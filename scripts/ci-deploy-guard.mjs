#!/usr/bin/env node
/**
 * Refuse an automatic production deploy that carries anything but content.
 *
 * WHY THIS EXISTS. Cloudflare Build Watch Paths are the primary control: only
 * a push touching the content paths triggers a build at all. But Cloudflare
 * documents two cases where it bypasses path matching entirely and builds
 * anyway — a push with 20+ commits, or one with 3000+ changed files. Codex and
 * the editorial agents push in bursts, so 20+ commits is not hypothetical.
 * Without this guard, one of those bursts would ship whatever half-finished
 * code happened to be sitting on main.
 *
 * This is the surviving idea from the deleted classify-babylove-release.mjs:
 * a release is eligible for automatic production only when its diff is content
 * and nothing else. Fails closed.
 *
 * Local runs are a no-op. Jeff deploying by hand from PowerShell is a
 * deliberate act and does not need a gate.
 *
 * Usage:
 *   node scripts/ci-deploy-guard.mjs                 # enforce (CI), pass (local)
 *   node scripts/ci-deploy-guard.mjs --force         # always pass, log why
 *   node scripts/ci-deploy-guard.mjs --explain       # print the verdict, never fail
 *   node scripts/ci-deploy-guard.mjs --since <sha>   # judge a diff by hand
 *
 * Exit codes:
 *   0  safe to deploy
 *   1  diff carries non-content changes; deploy by hand instead
 */

import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const force = args.includes('--force');
const explain = args.includes('--explain');
const sinceIdx = args.indexOf('--since');
const SINCE = sinceIdx !== -1 ? args[sinceIdx + 1] : '';
const ORIGIN = 'https://parentcoachdesk.com';

/**
 * Paths an editorial agent legitimately touches when publishing. Everything
 * else — src/lib, src/pages, src/components, package.json, wrangler config,
 * migrations, scripts — is code and needs a human on the deploy.
 *
 * reports/editorial/editorial-refresh-queue.json is deliberately absent: it is
 * untracked (see .gitignore), so it never shows up in a diff.
 */
const CONTENT_PREFIXES = [
  'src/content/',
  'public/illustrations/',
  'public/og/',
  'public/og-camps/',
];

const CONTENT_FILES = [
  'editorial-queue.md',
  'CONTENT_ROADMAP.md',
];

function isContentPath(path) {
  return CONTENT_PREFIXES.some((prefix) => path.startsWith(prefix))
    || CONTENT_FILES.includes(path);
}

function git(...argv) {
  return execFileSync('git', argv, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function allow(reason) {
  console.log(`ci-deploy-guard: DEPLOY — ${reason}`);
  process.exit(0);
}

function block(reason, offenders) {
  console.error(`ci-deploy-guard: BLOCKED — ${reason}`);
  for (const path of offenders.slice(0, 25)) console.error(`  non-content: ${path}`);
  if (offenders.length > 25) console.error(`  ...and ${offenders.length - 25} more`);
  console.error('');
  console.error('This push mixes code with content, so it will not auto-deploy.');
  console.error('Review it, then ship it deliberately from PowerShell:');
  console.error('');
  console.error('  npm ci');
  console.error('  npm run build:production');
  console.error('  npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars --dry-run');
  console.error('  npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars');
  console.error('');
  process.exit(explain ? 0 : 1);
}

async function liveCommit() {
  try {
    const response = await fetch(`${ORIGIN}/build-info.json`, {
      headers: { 'User-Agent': 'parent-coach-desk-deploy-guard/1.0', 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return null;
    const body = await response.json();
    return typeof body?.commit === 'string' && /^[0-9a-f]{7,40}$/i.test(body.commit)
      ? body.commit
      : null;
  } catch {
    return null;
  }
}

if (force) allow('--force passed');
if (process.env.WORKERS_CI !== '1' && !SINCE) {
  allow('not running in Workers Builds; local deploys are not gated');
}

const head = process.env.WORKERS_CI_COMMIT_SHA || git('rev-parse', 'HEAD');
const live = SINCE ? git('rev-parse', SINCE) : await liveCommit();

if (!live) {
  // First build after this guard lands, or the site is down. Deploying is the
  // right move either way: refusing would mean a broken site stays broken.
  allow('no /build-info.json on the live site yet (bootstrap); deploying');
}

if (live === head) allow('live site is already this commit');

// The build container clones shallow. Deepen until the live commit is present,
// rather than guessing at the diff.
let haveLive = false;
for (const depth of [0, 100, 500, 2000]) {
  if (depth) {
    try { git('fetch', '--deepen', String(depth)); } catch { /* already complete */ }
  }
  try { git('cat-file', '-e', `${live}^{commit}`); haveLive = true; break; } catch { /* deeper */ }
}

if (!haveLive) {
  block(`the live commit ${live.slice(0, 8)} is not in this checkout's history, so the diff cannot be trusted`, []);
}

const changed = git('diff', '--name-only', `${live}..${head}`)
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (changed.length === 0) allow('no file changes since the live commit');

const offenders = changed.filter((path) => !isContentPath(path));

if (offenders.length) {
  block(`${offenders.length} of ${changed.length} changed files are outside the content allowlist`, offenders);
}

allow(`${changed.length} changed files, all content`);
