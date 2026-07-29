#!/usr/bin/env node
/**
 * Observe the live production Worker and emit a rollback-target receipt.
 *
 * WHY THIS EXISTS. The receipt at coordination/release-evidence/ records the
 * exact Worker version to roll back to, and it carries a seven-day expiry so a
 * stale target can never be mistaken for a live one. Until 2026-07-29 there was
 * no way to produce one: the July 16 receipt was assembled by hand from wrangler
 * output. It expired on July 25 and blocked every deploy after that, which is
 * the same shape of failure as the rc01 expiry that blocked deploys for three
 * days earlier in the month. A control with an expiry and no renewal path is a
 * scheduled outage.
 *
 * WHAT THIS DOES NOT DO. It does not authorize, execute, or rehearse a rollback,
 * and it does not touch production. Every wrangler call below is read-only.
 *
 * THE ONE RULE: this script observes, it never assumes. If any required field
 * cannot be read out of real wrangler output, it exits non-zero naming the field
 * and the command it looked in. It does not fill a gap with a plausible value,
 * because the entire point of the receipt is that a human can trust the version
 * id in it enough to roll production back to it.
 *
 * Usage:
 *   node scripts/observe-worker-rollback-target.mjs [--config wrangler.production.jsonc]
 *                                                   [--days 7] [--dry-run]
 *
 * Requires Cloudflare credentials in the environment (the same ones wrangler
 * already uses). It reads nothing secret: only binding NAMES and TYPES are
 * recorded, never values, and the validator rejects a receipt that contains
 * binding_values, secret_values, token_values or credentials.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateWorkerRollbackTarget } from './worker-rollback-target.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EVIDENCE_DIR = resolve(ROOT, 'coordination/release-evidence');
const WORKER_NAME = 'parent-coach-desk';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const flag = (name, fallback) => {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const config = flag('--config', 'wrangler.production.jsonc');
const days = Number(flag('--days', '7'));
if (!Number.isFinite(days) || days <= 0) fail('--days must be a positive number');

function fail(message, detail) {
  console.error(`\nCannot write a rollback receipt: ${message}`);
  if (detail) console.error(String(detail).split('\n').slice(0, 12).map((l) => `    ${l}`).join('\n'));
  console.error('\nNothing was written. A receipt with a guessed field is worse than no receipt,');
  console.error('because the version id in it is what someone would roll production back to.');
  process.exit(1);
}

/** Run a read-only wrangler command and parse JSON, or fail loudly. */
function wrangler(argv) {
  const printable = `npm exec wrangler -- ${argv.join(' ')}`;
  let out;
  try {
    out = execFileSync('npm', ['exec', 'wrangler', '--', ...argv], {
      cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024,
    });
  } catch (error) {
    fail(`\`${printable}\` failed`, `${error.stdout ?? ''}${error.stderr ?? ''}` || error.message);
  }
  // wrangler prints banners before JSON on some versions; take the first {...} or [...] block.
  const start = out.search(/[[{]/);
  if (start === -1) fail(`\`${printable}\` produced no JSON`, out);
  try {
    return JSON.parse(out.slice(start));
  } catch (error) {
    fail(`\`${printable}\` produced unparseable JSON`, `${error.message}\n---\n${out.slice(0, 800)}`);
  }
}

/** Pull the first defined value at any of several candidate paths. Shapes vary by wrangler version. */
function pick(object, paths, label, command) {
  for (const path of paths) {
    let value = object;
    for (const key of path.split('.')) value = value?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  fail(
    `could not find ${label} in the output of \`${command}\``,
    `Looked at: ${paths.join(', ')}\nGot: ${JSON.stringify(object).slice(0, 600)}`,
  );
}

console.log(`Observing ${WORKER_NAME} via ${config} (read-only).`);

// --- 1. Active deployment and its version --------------------------------
const deployments = wrangler(['deployments', 'list', '--config', config, '--json']);
const list = Array.isArray(deployments) ? deployments : deployments.deployments ?? deployments.result;
if (!Array.isArray(list) || list.length === 0) fail('deployments list returned no deployments');
const active = list[0];

const activeDeploymentId = pick(active, ['id', 'deployment_id'], 'the active deployment id', 'deployments list');
const versionEntries = pick(active, ['versions'], 'the version split for the active deployment', 'deployments list');
if (!Array.isArray(versionEntries) || versionEntries.length === 0) fail('the active deployment lists no versions');

// A rollback target must have been taking ALL traffic when observed. A split
// deployment has no single answer to "what was live", so refuse rather than pick.
if (versionEntries.length > 1) {
  fail(
    `the active deployment is split across ${versionEntries.length} versions`,
    'A rollback target must have received 100 percent of traffic at observation.\n'
    + 'Wait for a single-version deployment, then re-run.',
  );
}
const activeVersionId = pick(versionEntries[0], ['version_id', 'id'], 'the active version id', 'deployments list');
const trafficPercentage = Number(pick(versionEntries[0], ['percentage', 'traffic'], 'the traffic percentage', 'deployments list'));
if (trafficPercentage !== 100) fail(`the active version is serving ${trafficPercentage} percent of traffic, not 100`);

// --- 2. Version detail: script etag and bindings --------------------------
const version = wrangler(['versions', 'view', activeVersionId, '--config', config, '--json']);
const scriptEtag = pick(version, ['resources.script.etag', 'script.etag', 'etag'], 'the script etag', `versions view ${activeVersionId}`);
const rawBindings = pick(version, ['resources.bindings', 'bindings'], 'the binding list', `versions view ${activeVersionId}`);
if (!Array.isArray(rawBindings)) fail('bindings were not an array', JSON.stringify(rawBindings).slice(0, 400));

// Record NAME -> TYPE only. Values never enter this file.
const bindings = {};
for (const binding of rawBindings) {
  const name = binding?.name ?? binding?.binding;
  const type = binding?.type;
  if (typeof name === 'string' && typeof type === 'string') bindings[name] = type;
}
if (Object.keys(bindings).length === 0) fail('no named bindings could be read from the version');

// --- 3. Predecessor -------------------------------------------------------
const versions = wrangler(['versions', 'list', '--config', config, '--json']);
const versionList = Array.isArray(versions) ? versions : versions.versions ?? versions.result;
if (!Array.isArray(versionList)) fail('versions list did not return an array');
const predecessor = versionList.find((v) => (v.id ?? v.version_id) !== activeVersionId);
if (!predecessor) fail('no predecessor version exists to record');
const predecessorId = predecessor.id ?? predecessor.version_id;
const predecessorEtag = predecessor?.resources?.script?.etag ?? predecessor?.script?.etag ?? null;

// The contract requires the predecessor be recorded as NOT safe. That is a
// deliberate stance, not a computed one: the certified rollback target is the
// version that is live and fully bound right now, and the one before it has not
// been through this check. Recording which bindings it lacks makes the reason
// legible instead of asserting "unsafe" with no basis.
const predecessorBindings = new Set(
  (predecessor?.resources?.bindings ?? predecessor?.bindings ?? [])
    .map((b) => b?.name ?? b?.binding).filter(Boolean),
);
const missingBindingNames = Object.keys(bindings).filter((name) => !predecessorBindings.has(name)).sort();

// --- 4. Health evidence ---------------------------------------------------
// Must reference at least two real files. Pick the newest anonymous-access and
// live-public-monitor receipts actually present on disk rather than hardcoding
// dates that will rot the same way the receipt itself did.
function newestEvidence(prefix) {
  const matches = readdirSync(EVIDENCE_DIR).filter((f) => f.startsWith(prefix) && f.endsWith('.json')).sort();
  return matches.length ? `coordination/release-evidence/${matches[matches.length - 1]}` : null;
}
const healthEvidence = [newestEvidence('anonymous-access-'), newestEvidence('live-public-monitor-')].filter(Boolean);
if (healthEvidence.length < 2) {
  fail(
    'fewer than two health-evidence receipts were found on disk',
    `Looked in ${EVIDENCE_DIR} for anonymous-access-*.json and live-public-monitor-*.json.\nFound: ${healthEvidence.join(', ') || '(none)'}`,
  );
}
for (const file of healthEvidence) {
  if (!existsSync(resolve(ROOT, file))) fail(`health evidence ${file} does not exist`);
}

// --- 5. Assemble and self-validate ---------------------------------------
const observedAt = new Date();
const expiresAt = new Date(observedAt.getTime() + days * 24 * 60 * 60 * 1000);

const receipt = {
  schema_version: 1,
  observed_at: observedAt.toISOString(),
  expires_at: expiresAt.toISOString(),
  worker_name: WORKER_NAME,
  active_deployment_id: activeDeploymentId,
  active_version_id: activeVersionId,
  target_version_id: activeVersionId,
  traffic_percentage: 100,
  script_etag: scriptEtag,
  candidate_usage: 'next_release_only',
  bindings,
  health_evidence: healthEvidence,
  predecessor_finding: {
    version_id: predecessorId,
    same_script_etag: predecessorEtag !== null ? predecessorEtag === scriptEtag : null,
    safe: false,
    missing_binding_names: missingBindingNames,
  },
  storage_rollback_included: false,
  pages_is_rollback_target: false,
  limitations: [
    'This receipt proves a fully bound exact Worker version for rollback after the next approved release; it does not authorize or execute rollback.',
    'Worker versions do not roll back D1, R2, KV, Durable Object, or other stored state.',
    'A separately approved tabletop or non-production rehearsal and candidate-specific data recovery evidence remain required.',
    `Observed by scripts/observe-worker-rollback-target.mjs from live wrangler output; expires ${expiresAt.toISOString()}.`,
  ],
  external_changes: [],
};

// Emit only what the checker will accept. Same principle as the release-evidence
// cut: never record a pass on faith.
const { errors } = validateWorkerRollbackTarget(receipt, observedAt.getTime());
if (errors.length > 0) {
  fail('the observed receipt does not satisfy its own validator', errors.join('\n'));
}

const stamp = observedAt.toISOString().slice(0, 10);
const outputRelative = `coordination/release-evidence/worker-rollback-target-${stamp}.json`;
const output = resolve(ROOT, outputRelative);

if (dryRun) {
  console.log('\n--dry-run: receipt is valid but was not written.\n');
  console.log(JSON.stringify(receipt, null, 2));
  process.exit(0);
}

writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(`\nWrote ${outputRelative}`);
console.log(`  target version : ${activeVersionId}`);
console.log(`  deployment     : ${activeDeploymentId}`);
console.log(`  bindings       : ${Object.keys(bindings).length} recorded by name and type, no values`);
console.log(`  expires        : ${expiresAt.toISOString()}`);
console.log('\nNext: point the checker at it, then verify.');
console.log(`  package.json  "check:rollback-target": "node scripts/check-worker-rollback-target.mjs ${outputRelative}"`);
console.log('  npm run check:rollback-target');
