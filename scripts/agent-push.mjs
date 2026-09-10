#!/usr/bin/env node
/**
 * agent-push.mjs — the push an agent is allowed to make.
 *
 * WHY THIS EXISTS
 *   Between 2026-08-10 and 2026-09-02, `coordination/deploy-hold-state.json`
 *   counted 23 consecutive nights where an agent produced committed work and
 *   could not ship it: `git push origin main` fails in the Cowork sandbox with
 *   `fatal: could not read Username for 'https://github.com'`. The agents kept
 *   writing. Nothing reached readers. Nobody read the log.
 *
 *   The fix is not "give agents credentials." It is "give agents a push that
 *   cannot do the thing we were protecting against." That is this script.
 *
 * THE ONE INVARIANT
 *   An agent may ship CONTENT automatically. An agent may never ship CODE.
 *
 *   This is not re-implemented here. `ci-deploy-guard.mjs` already owns the
 *   content/inert/code/unknown classification, already fails closed on
 *   `unknown`, and already requires Jeff's `Deploy-Code: approved` trailer for
 *   code. This script simply refuses to push anything the guard would block.
 *   One classifier, one source of truth. If the guard changes, this follows.
 *
 *   Consequence, stated plainly: an agent that writes code and then calls this
 *   script gets refused, exactly as it does today. Automation buys content
 *   velocity and buys nothing else.
 *
 * WHAT IT REFUSES, AND WHY EACH ONE MATTERS
 *   - dirty working tree      → a half-finished edit ships as if it were done
 *   - diverged from origin    → the two-lane clobbering bug of 2026-08-12
 *   - non-fast-forward        → same, from the other direction
 *   - guard block             → unapproved code reaches production unreviewed
 *   - no token                → say so loudly instead of failing at 4am silently
 *
 * USAGE
 *   node scripts/agent-push.mjs [--dry-run] [--verbose]
 *
 * TOKEN
 *   Read from PCD_PUSH_TOKEN, or from the file named by PCD_PUSH_TOKEN_FILE,
 *   or from ~/.pcd/push-token. The token is never printed, never written to a
 *   log, and never placed in a git remote that persists on disk — it is passed
 *   per-invocation via an ephemeral credential helper argument.
 *
 * EXIT CODES
 *   0  pushed, or --dry-run and everything passed, or already up to date
 *   1  refused (a precondition failed) — safe, nothing was pushed
 *   2  the push itself failed (network, auth, remote rejection)
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');

const REPO = 'jeffthomas4-lab/parent-coach-playbook';
const BRANCH = 'main';
const RECEIPT_LOG = 'reports/ops/agent-push.log';

// git on this repo's Windows-mounted working directory hangs on fsync and on
// full-tree index refreshes. Same flags safe-commit.sh uses, same reasons.
const GIT_FLAGS = ['-c', 'core.fsync=none', '-c', 'core.fsyncMethod=none'];

function git(...a) {
  return execFileSync('git', [...GIT_FLAGS, ...a], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}

function gitQuiet(...a) {
  try { return git(...a); } catch { return null; }
}

function refuse(reason, detail) {
  console.error(`agent-push: REFUSED — ${reason}`);
  if (detail) console.error(detail);
  console.error('');
  console.error('Nothing was pushed. This is a safe state, not a broken one.');
  receipt('refused', reason);
  process.exit(1);
}

function receipt(status, note) {
  const line = [
    new Date().toISOString(),
    'agent-push',
    status,
    (gitQuiet('rev-parse', '--short', 'HEAD') ?? 'unknown'),
    note.replace(/[\t\n\r]+/g, ' ').slice(0, 400),
  ].join('\t');
  try {
    mkdirSync(dirname(RECEIPT_LOG), { recursive: true });
    appendFileSync(RECEIPT_LOG, line + '\n');
  } catch { /* a receipt that cannot be written must not abort the push */ }
}

// ---------------------------------------------------------------------------
// Token. Never logged. Never persisted into .git/config.
// ---------------------------------------------------------------------------
function readToken() {
  if (process.env.PCD_PUSH_TOKEN?.trim()) return process.env.PCD_PUSH_TOKEN.trim();

  const candidates = [
    process.env.PCD_PUSH_TOKEN_FILE,
    join(homedir(), '.pcd', 'push-token'),
  ].filter(Boolean);

  for (const path of candidates) {
    if (existsSync(path)) {
      const value = readFileSync(path, 'utf8').trim();
      if (value) return value;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Preconditions
// ---------------------------------------------------------------------------
console.log('agent-push: checking preconditions');

if (!gitQuiet('rev-parse', '--is-inside-work-tree')) {
  refuse('not inside a git work tree', 'Run from the repo root.');
}

const branch = git('symbolic-ref', '--short', 'HEAD');
if (branch !== BRANCH) {
  refuse(
    `on branch "${branch}", not "${BRANCH}"`,
    'This script only ships the release branch. Switch, or push by hand if this is deliberate.',
  );
}

// 1. Clean tree. An agent that leaves edits uncommitted and pushes anyway ships
//    a partial state; worse, the next agent inherits the mess and cannot tell
//    whose it is. That exact condition caused the 2026-08-17 dirty-tree hold.
const dirty = git('status', '--porcelain');
if (dirty) {
  refuse(
    `working tree has ${dirty.split('\n').length} uncommitted change(s)`,
    dirty.split('\n').slice(0, 20).join('\n')
      + '\n\nCommit these with scripts/safe-commit.sh, or stash them, then retry.',
  );
}

// 2. Fetch, then compare. Do this before the guard, so the guard judges the
//    range that will actually ship.
console.log('agent-push: fetching origin');
try {
  git('fetch', 'origin', BRANCH);
} catch (error) {
  refuse('could not fetch origin', String(error.message ?? error).slice(0, 500));
}

const head = git('rev-parse', 'HEAD');
const remote = git('rev-parse', `origin/${BRANCH}`);

if (head === remote) {
  console.log('agent-push: already up to date, nothing to push');
  receipt('noop', 'already up to date');
  process.exit(0);
}

const [behind, ahead] = git('rev-list', '--left-right', '--count', `origin/${BRANCH}...HEAD`)
  .split(/\s+/)
  .map(Number);

if (VERBOSE) console.log(`agent-push: ${ahead} ahead, ${behind} behind`);

// 3. Fast-forward only. A local deploy or push over a diverged history is
//    precisely what silently deleted BabyLoveGrowth articles on 2026-08-12 and
//    again days later. An agent must never resolve a divergence unattended:
//    merging is a judgment call about two humans' intentions.
if (behind > 0) {
  refuse(
    `origin/${BRANCH} is ${behind} commit(s) ahead of local — histories have diverged`,
    git('log', '--oneline', `HEAD..origin/${BRANCH}`)
      + '\n\nA human must merge this. Do not let an agent decide whose work wins.'
      + '\nThis is the failure mode that deleted published articles twice in August.',
  );
}

if (ahead === 0) {
  refuse('nothing to push and not up to date — unexpected state', `head=${head} remote=${remote}`);
}

// 4. The guard. Single source of truth for what an agent may ship.
console.log(`agent-push: running deploy guard over ${remote.slice(0, 8)}..${head.slice(0, 8)}`);
let guardOutput = '';
let guardPassed = false;
try {
  guardOutput = execFileSync(
    process.execPath,
    ['scripts/ci-deploy-guard.mjs', '--since', remote],
    { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  guardPassed = true;
} catch (error) {
  guardOutput = `${error.stdout ?? ''}${error.stderr ?? ''}`;
}

if (!guardPassed) {
  refuse(
    'the deploy guard blocked this range',
    guardOutput.trim()
      + '\n\n--- what this means ---'
      + '\nThis range carries code, and code is Jeff\'s to approve. An agent must'
      + '\nnever write the Deploy-Code trailer for its own change. Report this in'
      + '\nyour run summary, by name, and stop. Do not retry.',
  );
}

if (VERBOSE && guardOutput.trim()) console.log(guardOutput.trim());

// ---------------------------------------------------------------------------
// Push
// ---------------------------------------------------------------------------
const commits = git('log', '--oneline', `origin/${BRANCH}..HEAD`);
console.log(`agent-push: ${ahead} commit(s) ready, guard passed (content only)`);
if (VERBOSE) console.log(commits);

if (DRY_RUN) {
  console.log('agent-push: --dry-run, stopping before the push');
  console.log(commits);
  receipt('dry-run', `${ahead} commit(s) would push`);
  process.exit(0);
}

const token = readToken();
if (!token) {
  refuse(
    'no push token found',
    'Looked at: $PCD_PUSH_TOKEN, $PCD_PUSH_TOKEN_FILE, ~/.pcd/push-token'
      + '\n\nSee docs in coordination/agent-push-setup.md. Until a token exists this'
      + '\nscript refuses loudly every night, which is the point — the previous'
      + '\nfailure mode was 23 nights of silence.',
  );
}

// The token goes into the process argv of a single git invocation and into no
// file. It is NOT written to .git/config, and NOT interpolated into a remote
// URL that git would persist or echo on error.
const authHeader = `http.https://github.com/.extraheader=Authorization: Basic ${
  Buffer.from(`x-access-token:${token}`).toString('base64')
}`;

console.log(`agent-push: pushing ${ahead} commit(s) to ${REPO}@${BRANCH}`);
try {
  execFileSync(
    'git',
    [...GIT_FLAGS, '-c', authHeader, 'push', `https://github.com/${REPO}.git`, `HEAD:${BRANCH}`],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 },
  );
} catch (error) {
  // Scrub: git can echo the remote URL, and some failure paths echo headers.
  const raw = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  const safe = raw
    .replaceAll(token, '***REDACTED***')
    .replace(/Basic [A-Za-z0-9+/=]+/g, 'Basic ***REDACTED***');
  console.error('agent-push: PUSH FAILED');
  console.error(safe.trim().slice(0, 2000));
  receipt('push-failed', safe.split('\n')[0] ?? 'unknown');
  process.exit(2);
}

console.log(`agent-push: pushed ${head.slice(0, 8)} to ${REPO}@${BRANCH}`);
console.log('agent-push: Workers Builds will deploy from origin/main; do not run wrangler.');
receipt('pushed', `${ahead} commit(s), head ${head.slice(0, 8)}`);

// Mark what we shipped, so the next session can tell push-lag from build-lag.
try { git('update-ref', 'refs/pcd-agent-pushed', head); } catch { /* non-fatal */ }

process.exit(0);
