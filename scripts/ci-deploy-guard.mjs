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
 * ---------------------------------------------------------------------------
 * THE DAM, AND ITS DRAIN (added 2026-08-29)
 *
 * The three-way classification above fixed FALSE blocks: harmless bookkeeping
 * that had no business stopping content. It did nothing about TRUE blocks, and
 * those dam the pipeline in exactly the same shape.
 *
 * How that outage worked, 2026-08-19 to 2026-08-29. A real code commit landed
 * on main and nobody shipped it by hand. The guard blocked, correctly. But
 * production then stayed pinned at the live commit, so the NEXT content push
 * diffed against that same stale commit, still saw the unshipped code file in
 * its range, and blocked too. And the one after that. For ten days. Every
 * article Penny published in that window was unshippable, and two of the three
 * blocked code files were themselves fixes for other outages.
 *
 * The guard printed the warning below on every single one of those builds. It
 * printed it into a Cloudflare build log that nobody reads. The failure was
 * silent and unbounded, and its only exit was a laptop.
 *
 * So a code block now has a drain that does not require a laptop: a commit may
 * authorize its own deploy with a trailer in its message.
 *
 *   Deploy-Code: approved
 *
 * Every commit in the judged range that touches a code path must carry it. One
 * unapproved code commit still blocks the range, which keeps the fail-closed
 * property intact.
 *
 * WHAT THIS DEFENDS AGAINST, HONESTLY. The threat this guard was built for is
 * an accident: an agent burst pushing 20+ commits and shipping whatever
 * half-finished code happened to be sitting on main. A burst like that does not
 * write "Deploy-Code: approved" into a commit message, so the trailer meets
 * that threat.
 *
 * WHAT IT DOES NOT DEFEND AGAINST. Anyone who can push to main can now
 * self-approve a code deploy by typing a string. Author-matching would not help:
 * the editorial agents commit under Jeff's own name and email. This is a
 * deliberate-act marker, exactly like the manual PowerShell deploy it replaces,
 * and it is worth exactly as much as the discipline behind it. The rule is that
 * Jeff adds this trailer. An agent must never add it to its own code change.
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
 *   1  diff carries unapproved code changes
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

function block(reason, offenders, inertCount = 0, unapproved = []) {
  console.error(`ci-deploy-guard: BLOCKED - ${reason}`);
  for (const path of offenders.slice(0, 25)) console.error(`  code: ${path}`);
  if (offenders.length > 25) console.error(`  ...and ${offenders.length - 25} more`);
  if (inertCount) console.error(`  (${inertCount} inert file(s) ignored: reports, coordination, docs, scratch)`);
  console.error('');
  console.error('This push carries unapproved code, so it will not auto-deploy.');
  console.error('');
  if (unapproved.length) {
    console.error(`These ${unapproved.length} commit(s) touch code without a Deploy-Code trailer:`);
    for (const line of unapproved.slice(0, 15)) console.error(`  ${line}`);
    if (unapproved.length > 15) console.error(`  ...and ${unapproved.length - 15} more`);
    console.error('');
  }
  console.error('NOTE: production will now stay pinned at the live commit until this');
  console.error('clears, and every content push behind it is blocked with it. Do not');
  console.error('leave this sitting.');
  console.error('');
  console.error('PREFERRED FIX. Review the code above. If it is good to ship, approve the');
  console.error('pending range and push. No laptop deploy needed:');
  console.error('');
  console.error('  git commit --allow-empty -m "Approve pending code for deploy" \\');
  console.error('                           -m "Deploy-Code: approved"');
  console.error('  git push origin main');
  console.error('');
  console.error('Approval is range-level: it clears everything pending between the live');
  console.error('commit and HEAD, which is the same set a manual deploy would have shipped.');
  console.error('');
  console.error('BREAK GLASS. Only if Workers Builds itself is down:');
  console.error('');
  console.error('  git fetch origin && git pull --rebase origin main');
  console.error('  npm ci && npm run build:production');
  console.error('  npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars --dry-run');
  console.error('  npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars');
  console.error('');
  process.exit(explain ? 0 : 1);
}

/** Commits in base..head that touched any of `paths`. */
function commitsTouching(base, head, paths) {
  const out = git('log', '--format=%H %h %s', `${base}..${head}`, '--', ...paths);
  return out ? out.split('\n').map((l) => l.trim()).filter(Boolean) : [];
}

/**
 * Commits in base..head whose message carries the approval trailer on its own
 * line. Matched against the full body, so it works whether git recorded it as a
 * real trailer or as a plain final line. `%B` is flattened to one line per
 * commit first, so a multi-line body cannot desync the list.
 */
function approvalCommits(base, head) {
  let out;
  try {
    out = git('log', '--format=%H %h %s%x00%B%x00', `${base}..${head}`);
  } catch {
    return [];
  }
  return out
    .split('\0\n')
    .map((entry) => {
      const [header, body = ''] = entry.split('\0');
      return { header: header.trim(), body };
    })
    .filter(({ header, body }) => header && /^[ \t]*Deploy-Code:[ \t]*approved[ \t]*$/im.test(body))
    .map(({ header }) => header);
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
  // The drain. Approval is RANGE-level, not per-commit, because the dam is a
  // range problem: what is pending is everything between the live commit and
  // HEAD, and that is exactly what a manual deploy used to ship in one go. Any
  // commit in the judged range carrying the trailer approves the whole range.
  //
  // Per-commit approval was tried first and is wrong in practice: an approval
  // added as an empty commit touches no code path, so it would never count,
  // and amending a commit already pushed to main means a force-push. Neither is
  // a drain you would actually reach for at 9pm.
  // An approval covers what precedes it, never what lands after it. Otherwise
  // one trailer would permanently unlock every future code push for as long as
  // production stayed behind, and a build that failed for an unrelated reason
  // would keep that window open indefinitely. Re-judge from the newest approval.
  const approvals = approvalCommits(base, head); // newest first
  let blocking = offenders;

  if (approvals.length) {
    const approvedAt = approvals[0].split(' ')[0];
    const since = git('diff', '--name-only', `${approvedAt}..${head}`)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    blocking = since.filter((path) => {
      const kind = classify(path);
      return kind === 'code' || kind === 'unknown';
    });

    if (blocking.length === 0) {
      allow(
        `${offenders.length} code file(s) in range, all of them at or before `
        + `${approvals[0].split(' ').slice(1).join(' ')} (Deploy-Code: approved)`,
      );
    }
  }

  block(
    `${blocking.length} of ${changed.length} changed files are unapproved code`,
    blocking,
    buckets.inert.length,
    commitsTouching(approvals.length ? approvals[0].split(' ')[0] : base, head, blocking)
      .map((l) => l.split(' ').slice(1).join(' ')),
  );
}

allow(
  `${changed.length} changed files, no code `
  + `(${buckets.content.length} content, ${buckets.inert.length} inert)`,
);
