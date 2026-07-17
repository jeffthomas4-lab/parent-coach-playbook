#!/usr/bin/env node
/**
 * Production verified-deploy control.
 *
 * This is a human-invoked control, not an automated pipeline step. It must
 * NEVER be wired into CI to run unattended, and it must never be executed
 * as part of an automated review of this repository.
 *
 * It mirrors the build-then-verify-then-deploy shape of
 * deploy-staging-verified.mjs, but adds the production-only gates a NO-GO
 * review found missing from that pattern. In order, it:
 *
 *   1. Refuses to proceed if the git worktree is dirty (`git status
 *      --porcelain` non-empty), or if HEAD does not match an operator
 *      supplied `--sha <rev>` argument. This stops a deploy of uncommitted
 *      or unexpected code.
 *   2. Requires the build to be sourced from wrangler.production.jsonc
 *      (never the staging wrangler.jsonc).
 *   3. Builds the exact production manifest via the same path
 *      `npm run check:production-manifest` uses (`npm run build:production`,
 *      then reads `dist/server/wrangler.json`) and verifies it with the
 *      shared `verifyDeploymentManifest` from check-deployment-manifest.mjs
 *      plus explicit production-specific restatements of: Worker name
 *      `parent-coach-desk`, required bindings (PCD_OPS_DB and the other D1s,
 *      R2, KV), the production origin, and that every default-off feature
 *      flag is literally `"false"`.
 *   4. Requires BOTH an explicit `--confirm-production` flag AND an exact
 *      typed confirmation phrase (`--type-confirmation "<phrase>"`) before
 *      it will proceed past verification.
 *   5. Only once every gate above has passed does it run the actual
 *      `wrangler deploy`. That call is the LAST statement reachable in this
 *      file -- everything above it is a gate, nothing below it is a gate --
 *      and it is followed only by writing a post-deploy receipt (Worker
 *      version, bindings, and a timestamp the operator supplied via
 *      `--receipt-timestamp`; this script never calls Date.now() itself).
 *
 * With no `--confirm-production`, the script always stops after building
 * and verifying (build and verification are read-only / side-effect-free
 * other than producing the `dist/` build artifact -- they never call
 * `wrangler deploy`) and prints a DRY-RUN plan of what it verified and what
 * it would deploy. No deploy is ever performed in that mode.
 *
 * Usage:
 *   node scripts/deploy-production-verified.mjs --sha <full-git-sha>
 *     (dry run: builds, verifies, prints plan, exits 0/1, never deploys)
 *
 *   node scripts/deploy-production-verified.mjs --sha <full-git-sha> \
 *     --confirm-production \
 *     --type-confirmation "DEPLOY parent-coach-desk TO PRODUCTION" \
 *     --receipt-timestamp <ISO-8601>
 *     (only mode that can reach the wrangler deploy call)
 */
import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { verifyDeploymentManifest } from './check-deployment-manifest.mjs';

export const PRODUCTION_WORKER = 'parent-coach-desk';
export const PRODUCTION_ORIGIN = 'https://parentcoachdesk.com';
export const PRODUCTION_CONFIG_PATH = 'wrangler.production.jsonc';
export const REQUIRED_CONFIRMATION_TOKEN = 'DEPLOY parent-coach-desk TO PRODUCTION';

export const FALSE_FEATURE_FLAGS = [
  'CAMP_CLAIMS_ENABLED', 'CAMP_REVIEWS_ENABLED', 'TRUST_INTAKE_ENABLED',
  'DEMAND_TELEMETRY_ENABLED', 'IDEMPOTENCY_CLEANUP_ENABLED',
  'PCD_CUSTOMER_FOUNDATION_ENABLED', 'PCD_COMMERCE_TEST_MODE_ENABLED',
];

export const REQUIRED_D1_BINDINGS = ['DB', 'FORGE_DB', 'PCD_OPS_DB'];
export const REQUIRED_R2_BINDINGS = ['PHOTOS'];
export const REQUIRED_KV_BINDINGS = ['SESSION'];

function run(command, args, options) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function runCaptured(command, args, options) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    if (result.stdout) process.stderr.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  return result.stdout ?? '';
}

export function parseProductionDeployArgs(argv) {
  const options = {
    sha: null,
    confirmProduction: false,
    typeConfirmation: null,
    receiptTimestamp: null,
    receiptOut: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--sha') options.sha = argv[++i] ?? null;
    else if (arg === '--confirm-production') options.confirmProduction = true;
    else if (arg === '--type-confirmation') options.typeConfirmation = argv[++i] ?? null;
    else if (arg === '--receipt-timestamp') options.receiptTimestamp = argv[++i] ?? null;
    else if (arg === '--receipt-out') options.receiptOut = argv[++i] ?? null;
  }
  return options;
}

export function checkGitClean(statusOutput) {
  return statusOutput.trim().length === 0
    ? []
    : ['git worktree is dirty (git status --porcelain is non-empty); refusing to deploy production from an unclean tree'];
}

export function checkShaMatches(sha, headOutput) {
  if (!sha || !sha.trim()) {
    return ['--sha <rev> is required; refusing to deploy production without a pinned expected commit'];
  }
  const head = headOutput.trim();
  const expected = sha.trim();
  return head === expected ? [] : [`HEAD (${head}) does not match expected --sha ${expected}`];
}

export function checkProductionManifest(manifest, serverEntry) {
  const failures = [...verifyDeploymentManifest(manifest, serverEntry)];

  // Explicit production restatement of the release contract. This is
  // deliberately redundant with verifyDeploymentManifest above: a future
  // edit that loosens the shared verifier must not silently loosen the
  // production deploy gate too.
  if (manifest.name !== PRODUCTION_WORKER) {
    failures.push(`Worker name must be ${PRODUCTION_WORKER}, received ${manifest.name ?? '(missing)'}`);
  }
  if (!String(manifest.configPath ?? '').replaceAll('\\', '/').endsWith(`/${PRODUCTION_CONFIG_PATH}`)) {
    failures.push(`config must be ${PRODUCTION_CONFIG_PATH}, received ${manifest.configPath ?? '(missing)'}`);
  }
  if (manifest.vars?.SITE_URL !== PRODUCTION_ORIGIN) {
    failures.push(`SITE_URL must be ${PRODUCTION_ORIGIN}, received ${manifest.vars?.SITE_URL ?? '(missing)'}`);
  }

  const d1Bindings = new Set((manifest.d1_databases ?? []).map((entry) => entry.binding));
  for (const expected of REQUIRED_D1_BINDINGS) {
    if (!d1Bindings.has(expected)) failures.push(`missing required production D1 binding: ${expected}`);
  }
  const r2Bindings = new Set((manifest.r2_buckets ?? []).map((entry) => entry.binding));
  for (const expected of REQUIRED_R2_BINDINGS) {
    if (!r2Bindings.has(expected)) failures.push(`missing required production R2 binding: ${expected}`);
  }
  const kvBindings = new Set((manifest.kv_namespaces ?? []).map((entry) => entry.binding));
  for (const expected of REQUIRED_KV_BINDINGS) {
    if (!kvBindings.has(expected)) failures.push(`missing required production KV binding: ${expected}`);
  }

  for (const flag of FALSE_FEATURE_FLAGS) {
    if (manifest.vars?.[flag] !== 'false') {
      failures.push(`${flag} must remain the safe "false" default for a production deploy, received ${JSON.stringify(manifest.vars?.[flag])}`);
    }
  }

  return failures;
}

export function buildPostDeployReceipt({ manifest, versionId, timestamp, sha }) {
  if (!timestamp) {
    throw new Error('a receipt timestamp is required (pass --receipt-timestamp; this script never calls Date.now() itself)');
  }
  const bindings = {};
  for (const entry of manifest.d1_databases ?? []) bindings[entry.binding] = 'd1';
  for (const entry of manifest.r2_buckets ?? []) bindings[entry.binding] = 'r2_bucket';
  for (const entry of manifest.kv_namespaces ?? []) bindings[entry.binding] = 'kv_namespace';
  if (manifest.assets?.binding) bindings[manifest.assets.binding] = 'assets';
  return {
    schema_version: 1,
    worker_name: manifest.name,
    deployed_sha: sha,
    version_id: versionId ?? null,
    bindings,
    deployed_at: timestamp,
  };
}

export function extractVersionId(deployOutput) {
  const match = deployOutput.match(/Version ID:\s*([0-9a-f-]{36})/i) ?? deployOutput.match(/\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i);
  return match ? match[1] : null;
}

async function buildAndVerifyProductionManifest({ projectRoot = process.cwd() } = {}) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('deploy-production-verified.mjs must be run through npm');
  // Same build path `npm run check:production-manifest` uses: build:production
  // sets WRANGLER_CONFIG_PATH=wrangler.production.jsonc and writes
  // dist/server/wrangler.json.
  run(process.execPath, [npmCli, 'run', 'build:production'], { cwd: projectRoot });
  const manifestPath = resolve(projectRoot, 'dist/server/wrangler.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const serverEntryPath = resolve(manifestPath, '..', 'entry.mjs');
  const serverEntry = await readFile(serverEntryPath, 'utf8');
  const failures = checkProductionManifest(manifest, serverEntry);
  return { manifest, failures };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const options = parseProductionDeployArgs(process.argv.slice(2));

  // Gate 1: clean worktree, HEAD matches --sha. Read-only git calls only.
  const statusOutput = runCaptured('git', ['status', '--porcelain']);
  const headOutput = runCaptured('git', ['rev-parse', 'HEAD']);
  const gitFailures = [...checkGitClean(statusOutput), ...checkShaMatches(options.sha, headOutput)];

  // Gates 2 + 3: build the exact production manifest and verify it.
  const { manifest, failures: manifestFailures } = await buildAndVerifyProductionManifest();

  const allFailures = [...gitFailures, ...manifestFailures];
  if (allFailures.length > 0) {
    console.error('Production deploy verification failed:');
    for (const failure of allFailures) console.error(`- ${failure}`);
    console.error('\nNo deploy was attempted.');
    process.exit(1);
  }

  console.log(`Verified production manifest for ${manifest.name} (${PRODUCTION_CONFIG_PATH}). Git worktree clean at ${headOutput.trim()}.`);

  const dryRunPlan = {
    dry_run: true,
    verified: {
      worker_name: manifest.name,
      config_path: manifest.configPath,
      origin: manifest.vars?.SITE_URL,
      d1_bindings: REQUIRED_D1_BINDINGS,
      r2_bindings: REQUIRED_R2_BINDINGS,
      kv_bindings: REQUIRED_KV_BINDINGS,
      default_off_feature_flags_confirmed_false: FALSE_FEATURE_FLAGS,
      sha: options.sha,
    },
    would_deploy: {
      command: 'wrangler deploy --config dist/server/wrangler.json --keep-vars',
      message: `verified production deployment ${options.sha}`,
    },
    required_to_proceed_past_this_plan: [
      '--confirm-production',
      `--type-confirmation "${REQUIRED_CONFIRMATION_TOKEN}"`,
      '--receipt-timestamp <ISO-8601>',
    ],
  };

  // Gate 4: explicit --confirm-production is required to go any further.
  if (!options.confirmProduction) {
    console.log(JSON.stringify(dryRunPlan, null, 2));
    console.log('\nDry run only (no --confirm-production passed). No deploy was performed.');
    process.exit(0);
  }

  // Gate 4 (continued): the typed confirmation phrase must match exactly.
  if (options.typeConfirmation !== REQUIRED_CONFIRMATION_TOKEN) {
    console.error(`Production deploy refused: --type-confirmation must exactly equal "${REQUIRED_CONFIRMATION_TOKEN}"`);
    console.error('No deploy was attempted.');
    process.exit(1);
  }

  if (!options.receiptTimestamp) {
    console.error('Production deploy refused: --receipt-timestamp <ISO-8601> is required to record the post-deploy receipt.');
    console.error('No deploy was attempted.');
    process.exit(1);
  }

  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('deploy-production-verified.mjs must be run through npm');

  // Everything above this point is a gate. Nothing below it is a gate.
  // This is the last action reachable in this file, and it is only
  // reachable once git state, manifest verification, and the typed
  // confirmation have all passed.
  const deployOutput = runCaptured(process.execPath, [
    npmCli, 'exec', '--', 'wrangler', 'deploy',
    '--config', 'dist/server/wrangler.json',
    '--keep-vars',
    '--message', `verified production deployment ${options.sha}`,
  ]);
  process.stdout.write(deployOutput);

  const versionId = extractVersionId(deployOutput);
  const receipt = buildPostDeployReceipt({
    manifest,
    versionId,
    timestamp: options.receiptTimestamp,
    sha: options.sha,
  });
  const receiptOut = resolve(options.receiptOut ?? `coordination/release-evidence/production-deploy-${options.sha}.json`);
  await writeFile(receiptOut, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  console.log(`Post-deploy receipt written to ${receiptOut}`);
}
