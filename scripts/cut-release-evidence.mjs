#!/usr/bin/env node
/**
 * Cut a fresh release-evidence packet against the CURRENT commit.
 *
 * WHY THIS EXISTS. rc01 was cut 2026-07-18 against commit 0ccd55f and expired
 * 2026-07-25, which blocked `ci:release` and therefore every production deploy.
 * The tempting fix is to edit `expires_at`. That is the one thing you must not
 * do: eleven gates in rc01 are marked `pass` and pinned to a commit that no
 * longer resembles the branch, so renewing the date silently re-certifies
 * claims that are no longer true. The packet exists to prevent exactly that.
 *
 * So this script re-establishes the commit-sensitive gates by RUNNING them and
 * recording what actually happened. It cannot mark a gate `pass` on faith:
 * every pass here is the recorded exit code of a command this script executed.
 *
 * GATE HANDLING
 *
 *   re-established  Run now, pass/fail from the real exit code.
 *                   source_commit, production_manifest, tests_and_build,
 *                   secret_scan
 *
 *   carried         Environment facts that do not move with the commit
 *                   (Access policy, rollback target, restore proof, the
 *                   owner-approved empty-R2 disposition). Copied from the
 *                   previous packet WITH the date they were established, so a
 *                   reader can see their age.
 *
 *   reset           Claims that were true of a DIFFERENT candidate and are not
 *                   true of this one. deploy_approval (Jeff approved bf4c424,
 *                   not this branch) and post_deploy_observation (observed the
 *                   old deploy; this candidate has not shipped). Carrying these
 *                   forward would be the forgery this script exists to avoid.
 *
 *   pending         Left pending, summaries preserved. These were never closed
 *                   on rc01 and are the real work: authenticated_access_probes,
 *                   database_backup, customer_journeys, notification_receipt,
 *                   failure_isolation, open_risk_decision, migration_approval.
 *
 * The result is a packet with MORE pending gates than rc01, not fewer. That is
 * the honest picture. `ready` stays false; `ci:release` runs --structure-only
 * and only needs the packet to be in-contract and unexpired.
 *
 * Usage:
 *   node scripts/cut-release-evidence.mjs                 # full cut (runs build + tests)
 *   node scripts/cut-release-evidence.mjs --skip-slow     # skip build/tests, leave that gate pending
 *   node scripts/cut-release-evidence.mjs --days 14       # custom validity window (default 7)
 *   node scripts/cut-release-evidence.mjs --dry-run       # print, do not write
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REQUIRED_GATES, validateReleaseEvidence } from './release-evidence.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = resolve(ROOT, 'coordination/release-evidence');
const PREVIOUS = resolve(DIR, 'rc01.json');
const OUTPUT = resolve(DIR, 'rc02.json');

const args = process.argv.slice(2);
const skipSlow = args.includes('--skip-slow');
const dryRun = args.includes('--dry-run');
const daysIdx = args.indexOf('--days');
const days = daysIdx !== -1 && Number.isFinite(Number(args[daysIdx + 1])) ? Number(args[daysIdx + 1]) : 7;

const now = new Date();
const iso = (d) => d.toISOString();
const stamp = iso(now);

// ---------------------------------------------------------------------------
// Command runner. Records what ran, what it exited with, and a digest of the
// output. The digest is the receipt: it is reproducible and it does not paste
// several thousand lines of build log into a governance artifact.
// ---------------------------------------------------------------------------

// Where a failing gate's full output goes. Gitignored: a build log is a local
// debugging artifact, it can contain environment detail, and it has no business
// in a governance packet or a commit.
const LOG_DIR = resolve(DIR, 'logs');

/**
 * Persist the whole output of a failed command.
 *
 * WHY. Until 2026-07-29 a failure recorded only a sha256 and the last line. On
 * that day `build` failed inside a cut and the entire record of it was:
 *
 *   final line: at [nodejs.internal.kHybridDispatch] (node:internal/event_target:843:20)
 *
 * which is the bottom frame of an async stack and says nothing about what broke.
 * Diagnosing it meant re-running a sixty-second build to see an error the script
 * had already captured and thrown away. The digest is still the receipt; this is
 * the evidence. Only failures are written, because a passing build log is noise.
 */
function writeFailureLog(label, command, exitCode, output) {
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    const safe = label.replace(/[^a-z0-9._-]+/gi, '-');
    const file = resolve(LOG_DIR, `${safe}-${stamp.replace(/[:.]/g, '-')}.log`);
    const header = [
      `# ${label}`,
      `# command: ${command}`,
      `# exit code: ${exitCode}`,
      `# run at: ${stamp}`,
      `# commit: ${git('rev-parse HEAD', 'unknown')}`,
      '',
    ].join('\n');
    writeFileSync(file, header + output);
    return file.slice(ROOT.length + 1).replace(/\\/g, '/');
  } catch (error) {
    // A logging failure must never turn a recorded gate failure into a crash.
    // The gate still fails; we just say why the log is missing.
    return `(could not write log: ${error.message})`;
  }
}

function run(label, command) {
  process.stdout.write(`  running: ${label} ... `);
  const started = Date.now();
  try {
    const out = execSync(command, { cwd: ROOT, encoding: 'utf8', stdio: 'pipe', maxBuffer: 64 * 1024 * 1024 });
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`ok (${secs}s)`);
    return { ok: true, command, exitCode: 0, digest: sha256(out).slice(0, 16), tail: lastLine(out), seconds: Number(secs) };
  } catch (error) {
    const secs = ((Date.now() - started) / 1000).toFixed(1);
    const code = error.status ?? 1;
    console.log(`FAILED exit ${code} (${secs}s)`);
    const combined = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    const logPath = writeFailureLog(label, command, code, combined);
    console.log(`    full output: ${logPath}`);
    return {
      ok: false, command, exitCode: code, digest: sha256(combined).slice(0, 16),
      tail: lastLine(combined), seconds: Number(secs), logPath, output: combined,
    };
  }
}

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

function lastLine(text) {
  const lines = String(text).split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length ? lines[lines.length - 1].slice(0, 200) : '(no output)';
}

function git(cmd, fallback = 'unknown') {
  try { return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8' }).trim(); }
  catch { return fallback; }
}

/** Turn a command result into a gate, refusing to pass on a non-zero exit. */
function gateFromRun(result, passSummary, failSummary) {
  return {
    state: result.ok ? 'pass' : 'fail',
    summary: `${result.ok ? passSummary : failSummary} Established ${stamp} by scripts/cut-release-evidence.mjs.`,
    evidence: [
      `command: ${result.command}`,
      `exit code: ${result.exitCode}`,
      `output sha256 (first 16): ${result.digest}`,
      `final line: ${result.tail}`,
      ...(result.logPath ? [`full output: ${result.logPath}`] : []),
      `duration: ${result.seconds}s`,
      `run at: ${stamp}`,
    ],
  };
}

// ---------------------------------------------------------------------------
// Previous packet, for the carried and pending gates.
// ---------------------------------------------------------------------------

if (!existsSync(PREVIOUS)) {
  console.error(`Cannot find previous packet at ${PREVIOUS}. Nothing to carry forward.`);
  process.exit(1);
}
const prev = JSON.parse(readFileSync(PREVIOUS, 'utf8'));
const prevCreated = prev.created_at ?? 'unknown date';

/** Copy a gate forward, stamping it so its age is visible to a reader. */
function carry(name, why) {
  const g = prev.gates[name];
  if (!g) {
    return { state: 'pending', summary: `Not present in ${prev.release_id}; needs first-time evidence.`, evidence: [] };
  }
  const out = {
    state: g.state,
    summary: `[CARRIED from ${prev.release_id}, established ${prevCreated}] ${why} ${g.summary ?? ''}`.trim(),
    evidence: [...(g.evidence ?? []), `carried forward on ${stamp} from ${prev.release_id}`],
  };
  if (g.approved_by) out.approved_by = g.approved_by;
  return out;
}

/** Keep a gate pending, preserving what the previous packet said about it. */
function keepPending(name) {
  const g = prev.gates[name] ?? {};
  return {
    state: 'pending',
    summary: `[STILL OPEN, carried from ${prev.release_id}] ${g.summary ?? 'No evidence recorded yet.'}`,
    evidence: [...(g.evidence ?? []), `still open as of ${stamp}`],
  };
}

/** Reset a gate that described a different candidate. */
function reset(name, why) {
  const g = prev.gates[name] ?? {};
  return {
    state: 'pending',
    summary: `[RESET for this candidate] ${why} The ${prev.release_id} record described a different commit and is not carried: "${(g.summary ?? '').slice(0, 120)}"`,
    evidence: [`reset on ${stamp} because the previous evidence was pinned to a superseded candidate`],
  };
}

// ---------------------------------------------------------------------------
// Re-establish the commit-sensitive gates.
// ---------------------------------------------------------------------------

console.log(`\nCutting release evidence against the current commit.\n`);

const sha = git('rev-parse HEAD');
const shortSha = git('rev-parse --short HEAD');
const branch = git('rev-parse --abbrev-ref HEAD');
const dirty = git('status --porcelain', '').length > 0;
const subject = git('log -1 --pretty=%s');

console.log(`  commit: ${shortSha} on ${branch}${dirty ? ' (WORKING TREE DIRTY)' : ''}`);

const gates = {};

gates.source_commit = {
  state: dirty ? 'fail' : 'pass',
  summary: dirty
    ? `Working tree is DIRTY at ${shortSha}; a release candidate must be cut from a clean tree so the artifact is reproducible.`
    : `Candidate is commit ${sha} ("${subject}") on branch ${branch}, cut from a clean working tree.`,
  evidence: [
    `commit: ${sha}`,
    `short: ${shortSha}`,
    `branch: ${branch}`,
    `subject: ${subject}`,
    `working tree clean: ${!dirty}`,
    `recorded at: ${stamp}`,
  ],
};

const secretRun = run('check:secrets', 'npm run --silent check:secrets');
gates.secret_scan = gateFromRun(
  secretRun,
  'Repository files and full git history passed the secret scanner against this candidate.',
  'The secret scanner FAILED against this candidate. Do not deploy until resolved.',
);

const manifestRun = run('check:production-manifest', 'npm run --silent check:production-manifest');

// `check:production-manifest` is `build:production && check-deployment-manifest.mjs`.
// A production build failure and a manifest contract violation both exit 1 from
// that chain, and on 2026-07-29 two consecutive cuts recorded "the production
// manifest contract FAILED" when the contract had never executed: the build died
// first. Verified minutes later by running the same command standalone, where it
// printed "Production deployment manifest verified". Same red gate, two entirely
// different problems, and the wrong one sent me looking at the manifest.
//
// The build prints `[build] Complete!` as its last act, so its absence means the
// chain never reached the checker. Say so in the gate rather than making the next
// reader re-derive it.
const reachedContract = manifestRun.ok || /\[build\] Complete!/.test(manifestRun.output ?? '');
gates.production_manifest = gateFromRun(
  manifestRun,
  'The production manifest contract passes against production configuration for this candidate.',
  reachedContract
    ? 'The production manifest contract FAILED for this candidate: the build succeeded and the contract check rejected it.'
    : 'NOT a manifest finding. The production BUILD failed before the manifest contract ran, so the contract is unevaluated for this candidate, neither passing nor failing. Read the build log named below.',
);

// tests_and_build starts pending and is filled in AFTER the first write.
//
// ORDERING, load-bearing: tests/release-evidence.test.ts imports this packet,
// and this script runs `npm run test:unit`. On a first cut the file does not
// exist yet, so running the suite here would fail on an unresolvable import and
// this gate would record a failure caused by its own execution order. So: write
// the packet with this gate pending, THEN run the slow checks against a tree
// where the import resolves, then rewrite with the real result. The provisional
// packet is only ever an intermediate on disk; the committed one carries the
// actual exit codes.
gates.tests_and_build = {
  state: 'pending',
  summary: skipSlow
    ? 'Skipped with --skip-slow. Re-run without the flag before treating this packet as a deploy authorization.'
    : 'Provisional: the suite and build run after this packet is first written, then this gate is rewritten with the real result.',
  evidence: [`recorded pending at ${stamp}`],
};

// ---------------------------------------------------------------------------
// Carried, reset and pending gates.
// ---------------------------------------------------------------------------

gates.access_policy = carry('access_policy', 'Cloudflare Access configuration is independent of the application commit.');
gates.anonymous_access_probes = carry('anonymous_access_probes', 'Unauthenticated route probes against the live site; re-run after this candidate deploys.');
gates.database_restore = carry('database_restore', 'Restore proof is a property of the export tooling, not of this commit.');
gates.r2_recovery = carry('r2_recovery', 'Owner-approved empty-scope disposition; the bucket state has not changed.');
gates.rollback_target = carry('rollback_target', 'Rollback target is a deployment property, unchanged by this candidate.');
gates.rollback_rehearsal = carry('rollback_rehearsal', 'Rehearsal exercised the rollback mechanism, not this commit.');

gates.deploy_approval = reset('deploy_approval', 'Jeff has not approved THIS candidate for production.');
gates.post_deploy_observation = reset('post_deploy_observation', 'This candidate has not been deployed, so there is nothing to observe yet.');

for (const name of [
  'authenticated_access_probes', 'database_backup', 'customer_journeys',
  'notification_receipt', 'failure_isolation', 'open_risk_decision', 'migration_approval',
]) {
  gates[name] = keepPending(name);
}

// ---------------------------------------------------------------------------
// Assemble, validate, write.
// ---------------------------------------------------------------------------

const expires = new Date(now.getTime() + days * 86_400_000);

const packet = {
  release_id: 'pcd-rc02',
  environment: 'production',
  created_at: stamp,
  expires_at: iso(expires),
  supersedes: prev.release_id ?? 'pcd-local-rc01',
  candidate_commit: sha,
  candidate_branch: branch,
  cut_note:
    `Cut ${stamp} against ${shortSha} by scripts/cut-release-evidence.mjs. ` +
    `rc01 was pinned to a 2026-07-18 candidate and expired 2026-07-25, blocking ci:release. ` +
    `Rather than renew that packet's date over eleven commit-pinned pass marks, the commit-sensitive gates were re-run here, ` +
    `environment gates were carried with their original dates visible, and deploy_approval plus post_deploy_observation were RESET ` +
    `because they described a superseded candidate. This packet is deliberately not ready: the gates that were never closed on rc01 are still open.`,
  gates,
};

const missing = REQUIRED_GATES.filter((g) => !packet.gates[g]);
if (missing.length) {
  console.error(`\nBUG: this script did not produce every required gate. Missing: ${missing.join(', ')}`);
  process.exit(2);
}

if (dryRun) {
  const dry = validateReleaseEvidence(packet);
  console.log(`\n--dry-run: not writing. Contract errors: ${dry.errors.length ? dry.errors.join('; ') : 'none'}`);
  process.exit(dry.errors.length ? 1 : 0);
}

// First write, so the packet exists for anything that imports it.
writeFileSync(OUTPUT, `${JSON.stringify(packet, null, 2)}\n`);
console.log(`\n  wrote provisional ${OUTPUT}`);

// Now the slow gates, against a tree where the import resolves.
if (!skipSlow) {
  const testRun = run('test:unit', 'npm run --silent test:unit');
  const buildRun = run('build', 'npm run --silent build');
  const bothOk = testRun.ok && buildRun.ok;
  const finishedAt = iso(new Date());
  packet.gates.tests_and_build = {
    state: bothOk ? 'pass' : 'fail',
    summary: bothOk
      ? `Unit suite and the production build both completed for commit ${shortSha}.`
      : `Unit suite and/or build FAILED for commit ${shortSha} (tests exit ${testRun.exitCode}, build exit ${buildRun.exitCode}). Recorded as fail rather than dropped.`,
    evidence: [
      `tests: ${testRun.command} -> exit ${testRun.exitCode}, sha256 ${testRun.digest}, ${testRun.seconds}s`,
      `tests final line: ${testRun.tail}`,
      `build: ${buildRun.command} -> exit ${buildRun.exitCode}, sha256 ${buildRun.digest}, ${buildRun.seconds}s`,
      `build final line: ${buildRun.tail}`,
      `completed at: ${finishedAt}`,
    ],
  };
  writeFileSync(OUTPUT, `${JSON.stringify(packet, null, 2)}\n`);
  console.log(`  rewrote ${OUTPUT} with real test/build results`);
}

const result = validateReleaseEvidence(packet);

const counts = REQUIRED_GATES.reduce((acc, g) => {
  const s = packet.gates[g].state;
  acc[s] = (acc[s] ?? 0) + 1;
  return acc;
}, {});

console.log('\nGate states:');
for (const [state, n] of Object.entries(counts).sort()) console.log(`  ${state.padEnd(15)} ${n}`);
console.log(`\nContract errors: ${result.errors.length ? result.errors.join('; ') : 'none'}`);
console.log(`Ready: ${result.ready} (expected false while gates remain open)`);
console.log(`Expires: ${iso(expires)} (${days} days)`);

const failed = REQUIRED_GATES.filter((g) => packet.gates[g].state === 'fail');
if (failed.length) {
  console.log(`\nFAILED gates: ${failed.join(', ')}`);
  console.log('These are recorded as fail, not silently dropped. Fix the underlying problem and re-cut.');
}

if (result.errors.length) {
  console.error('Packet is out of contract. Fix before committing.');
  process.exit(1);
}
process.exit(0);
