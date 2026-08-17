#!/usr/bin/env node
/**
 * Refuse an automatic production deploy that carries unreviewed CODE.
 *
 * WHY THIS EXISTS. Cloudflare Build Watch Paths are the primary control: only
 * a push touching the content paths triggers a build at all. But Cloudflare
 * documents two cases where it bypasses path matching entirely and builds
 * anyway: a push with 20+ commits, or one with 3000+ changed files. Codex and
 * the editorial agents push in bursts, so 20+ commits is not hypothetical.
 * Without this guard, one of those bursts would ship whatever half-finished
 * code happened to be sitting on main.
 *
 * Local runs are a no-op. Jeff deploying by hand from PowerShell is a
 * deliberate act and does not need a gate.
 *
 * ---------------------------------------------------------------------------
 * WHY THE CLASSIFICATION IS THREE-WAY, NOT TWO-WAY (fixed 2026-08-17)
 *
 * This guard used to be a binary content allowlist: content passes, everything
 * else blocks. That treated "not content" as "dangerous code," and it caused a
 * 3-day publishing outage (2026-08-14 to 2026-08-17).
 *
 * How that outage worked. The guard anchors its diff to the LIVE commit, read
 * from the site's own /build-info.json. On 2026-08-14 a cleanup and audit
 * session landed 32 non-content files on main: reports/, coordination/,
 * buildout/, imports/.cache/, root audit markdown, .gitignore, a stray webp.
 * None of it could affect the built artifact. All 32 blocked the guard anyway.
 * The build went red, so no deploy ran, so /build-info.json never advanced off
 * c40448cd, so the next content push carried the same 32 files in its range and
 * blocked again. A self-perpetuating deadlock: every article published after
 * that point was permanently unshippable, and it could never self-heal. Two
 * BabyLoveGrowth articles sat on origin/main 404ing on the live site.
 *
 * The anchor is not the bug. Anchoring to the live commit is correct: it is the
 * only honest answer to "what would this deploy actually change in production."
 * The bug was the classification. So paths are now sorted three ways:
 *
 *   content  -> always safe to auto-deploy
 *   inert    -> cannot affect the built artifact, so it must not block content
 *   code     -> changes the artifact or runtime, so a human ships it
 *
 * Anything unrecognized still BLOCKS. The guard stays fail-closed: a new
 * top-level directory nobody has classified is treated as code, not waved
 * through. Add it to one of the lists below deliberately.
 * ---------------------------------------------------------------------------
 *
 * Usage:
 *   node scripts/ci-deploy-guard.mjs                 # enforce (CI), pass (local)
 *   node scripts/ci-deploy-guard.mjs --force         # always pass, log why
 *   node scripts/ci-deploy-guard.mjs --explain       # print the verdict, never fail
 *   node scripts/ci-deploy-guard.mjs --since <sha>   # judge a diff by hand
 *
 * Exit codes:
 *   0  safe to deploy
 *   1  diff carries code changes; deploy by hand instead
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
 * CONTENT. What an editorial agent legitimately touches when publishing.
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

/**
 * CODE. Changes the built artifact or the runtime. A human ships these.
 * Checked AFTER the content prefixes, so src/content and public/og fall out
 * as content before 'src/' and 'public/' catch them here.
 */
const CODE_PREFIXES = [
  'src/',
  'public/',
  'scripts/',
  'migrations/',
  'worker-cron/',
  'functions/',
  'patches/',
  '.github/',
  '.githooks/',
];

const CODE_FILES = [
  'package.json',
  'package-lock.json',
  'astro.config.mjs',
  'astro.config.ts',
  'astro.config.js',
  'tsconfig.json',
  'vitest.config.ts',
  'playwright.config.ts',
];

/** wrangler.jsonc, wrangler.production.jsonc, wrangler.toml, and friends. */
const CODE_FILE_PATTERN = /^wrangler[^/]*\.(jsonc?|toml)$/;

/**
 * GENERATED. Tracked, but every build overwrites them, so their incoming diff
 * has no bearing on what ships. build:manifest regenerates link-manifest.json
 * and build:info regenerates build-info.json on every single build.
 */
const GENERATED_FILES = [
  'public/link-manifest.json',
  'public/build-info.json',
];

/**
 * INERT. Bookkeeping, audit trails, agent state, and scratch. Nothing here is
 * read at build time or served to a browser. These must never block content:
 * that is exactly what caused the 2026-08-14 deadlock.
 */
const INERT_PREFIXES = [
  'reports/',
  'coordination/',
  'buildout/',
  'imports/',
  'docs/',
  'qa/',
  '.claude/',
  '.codex/',
];

const INERT_FILES = [
  '.gitignore',
  '.gitattributes',
  '.editorconfig',
];

/**
 * Root-level files with these extensions are documentation or stray artifacts.
 * This repo carries ~40 root markdown files (runbooks, audits, plans) and they
 * cannot reach the bundle. Root only: a nested path is judged by its prefix.
 */
const INERT_ROOT_EXTENSIONS = [
  '.md', '.txt', '.log', '.tmp', '.csv', '.xlsx', '.sql',
  '.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.pdf',
];

function hasPrefix(path, prefixes) {
  return prefixes.some((prefix) => path.startsWith(prefix));
}

/** 'content' | 'inert' | 'code' | 'unknown' */
function classify(path) {
  if (hasPrefix(path, CONTENT_PREFIXES) || CONTENT_FILES.includes(path)) return 'content';

  // Generated-at-build files are inert no matter where they live.
  if (GENERATED_FILES.includes(path)) return 'inert';

  if (CODE_FILES.includes(path) || CODE_FILE_PATTERN.test(path)) return 'code';
  if (hasPrefix(path, CODE_PREFIXES)) return 'code';

  if (hasPrefix(path, INERT_PREFIXES) || INERT_FILES.includes(path)) return 'inert';

  // Root-level docs and stray artifacts.
  if (!path.includes('/')) {
    const dot = path.lastIndexOf('.');
    const ext = dot === -1 ? '' : path.slice(dot).toLowerCase();
    if (INERT_ROOT_EXTENSIONS.includes(ext)) return 'inert';
  }

  // Fail closed. An unclassified top-level directory is code until someone says
  // otherwise, in writing, in one of the lists above.
  return 'unknown';
}

function git(...argv) {
  return execFileSync('git', argv, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function allow(reason) {
  console.log(`ci-deploy-guard: DEPLOY - ${reason}`);
  process.exit(0);
}

function block(reason, offenders, inertCount = 0) {
  console.error(`ci-deploy-guard: BLOCKED - ${reason}`);
  for (const path of offenders.slice(0, 25)) console.error(`  code: ${path}`);
  if (offenders.length > 25) console.error(`  ...and ${offenders.length - 25} more`);
  if (inertCount) console.error(`  (${inertCount} inert file(s) ignored: reports, coordination, docs, scratch)`);
  console.error('');
  console.error('This push carries code, so it will not auto-deploy.');
  console.error('');
  console.error('NOTE: production will now stay pinned at the live commit until this');
  console.error('ships, and every content push behind it is blocked with it. Do not');
  console.error('leave this sitting. Review it, then ship from PowerShell:');
  console.error('');
  console.error('  git fetch origin');
  console.error('  git pull --rebase origin main');
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

// How many commits to judge when the live stamp cannot be resolved.
const FALLBACK_WINDOW = 20;
let base = live;

if (!haveLive) {
  // A local `wrangler deploy` stamps /build-info.json with whatever commit sat
  // on that machine, including a rebased or never-pushed SHA. Workers Builds
  // clones origin/main, so it can never resolve one of those, and the old
  // behavior was to block forever. That is a guaranteed outage whose only exit
  // is another local deploy, which re-stamps another unresolvable SHA. Observed
  // live on 2026-08-17: a local deploy stamped 46603379, a commit that exists
  // only in Jeff's clone.
  //
  // Judge a bounded window on this branch instead. Same three-way
  // classification, same fail-closed rule on code, no deadlock.
  console.warn(
    `ci-deploy-guard: live commit ${live.slice(0, 8)} is not in this history `
    + `(almost certainly stamped by a local deploy); judging the last `
    + `${FALLBACK_WINDOW} commits instead`,
  );
  try {
    base = git('rev-list', '--max-count=1', `--skip=${FALLBACK_WINDOW}`, head);
  } catch {
    base = '';
  }
  if (!base) {
    allow('live commit unresolvable and history too shallow to judge a window; deploying rather than deadlocking');
  }
}

const changed = git('diff', '--name-only', `${base}..${head}`)
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean);

if (changed.length === 0) allow('no file changes since the live commit');

const buckets = { content: [], inert: [], code: [], unknown: [] };
for (const path of changed) buckets[classify(path)].push(path);

const offenders = [...buckets.code, ...buckets.unknown];

if (offenders.length) {
  block(
    `${offenders.length} of ${changed.length} changed files are code`,
    offenders,
    buckets.inert.length,
  );
}

allow(
  `${changed.length} changed files, no code `
  + `(${buckets.content.length} content, ${buckets.inert.length} inert)`,
);
