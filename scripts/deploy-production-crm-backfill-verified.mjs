#!/usr/bin/env node

import { createHash, randomUUID } from 'node:crypto';
import { mkdir, open, readFile, unlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { hashBuildArtifact } from './deploy-staging-verified.mjs';
import {
  PRODUCTION_CRM_IDENTITIES,
  validateProductionCrmDisabledManifest,
} from './verify-production-crm-disabled-release.mjs';

const SHA256 = /^[a-f0-9]{64}$/;
const GIT_SHA = /^[a-f0-9]{40}$/;
const BOOKMARK = /^[a-f0-9]{8}(?:-[a-f0-9]{8}){2}-[a-f0-9]{32}$/;
const REQUIRED_CONFIRMATION = 'ACTIVATE parent-coach-desk CRM PRODUCTION BACKFILL';
const EXPECTED_POLICY = 'pcd-public-professional-v1';
const EXPECTED_RECEIVER = '4dd8794b8006c075bcda6905f5a4dda283a0378a';
const FLAG_NAMES = new Set([
  '--sha', '--artifact-sha256', '--manifest-sha256', '--backfill-manifest',
  '--receiver-candidate', '--receipt-out', '--receipt-timestamp',
  '--confirm-production-backfill', '--type-confirmation',
]);

function requiredString(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required`);
  return value.trim();
}

function exactCount(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
  return value;
}

function freshBoundary(value, now = Date.now()) {
  return Number.isSafeInteger(value) && value > 0 && value % 1_000 === 0
    && Math.abs(now - value) <= 15 * 60 * 1_000;
}

function pushMismatch(failures, condition, message) {
  if (!condition) failures.push(message);
}

export function parseProductionBackfillDeployArgs(argv) {
  const options = {
    sha: null,
    artifactSha256: null,
    manifestSha256: null,
    backfillManifest: null,
    receiverCandidate: null,
    receiptOut: null,
    receiptTimestamp: null,
    confirmProductionBackfill: false,
    typeConfirmation: null,
  };
  const seen = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (!FLAG_NAMES.has(flag)) throw new Error(`unknown argument: ${flag}`);
    if (seen.has(flag)) throw new Error(`duplicate argument: ${flag}`);
    seen.add(flag);
    if (flag === '--confirm-production-backfill') {
      options.confirmProductionBackfill = true;
      continue;
    }
    const value = argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
    if (flag === '--sha') options.sha = value;
    else if (flag === '--artifact-sha256') options.artifactSha256 = value;
    else if (flag === '--manifest-sha256') options.manifestSha256 = value;
    else if (flag === '--backfill-manifest') options.backfillManifest = value;
    else if (flag === '--receiver-candidate') options.receiverCandidate = value;
    else if (flag === '--receipt-out') options.receiptOut = value;
    else if (flag === '--receipt-timestamp') options.receiptTimestamp = value;
    else if (flag === '--type-confirmation') options.typeConfirmation = value;
  }
  return options;
}

export function resolveBackfillReceiptOutput(value, projectRoot = process.cwd()) {
  const output = resolve(projectRoot, requiredString(value, '--receipt-out'));
  const backups = resolve(projectRoot, 'backups');
  const child = relative(backups, output);
  if (!child || child === '..' || child.startsWith(`..${sep}`) || isAbsolute(child)) {
    throw new Error('backfill deployment receipt must be written beneath backups');
  }
  return output;
}

/**
 * @param {any} manifest
 * @param {{
 *   expectedProducerCandidate?: string,
 *   expectedReceiverCandidate?: string,
 *   expectedManifestSha256?: string,
 *   manifestBytes?: Uint8Array | string,
 *   now?: number,
 * }} [options]
 */
export function validateProductionBackfillApproval(
  manifest,
  {
    expectedProducerCandidate,
    expectedReceiverCandidate = EXPECTED_RECEIVER,
    expectedManifestSha256,
    manifestBytes,
    now = Date.now(),
  } = {},
) {
  const failures = [];
  const boundary = manifest?.sourceNotBeforeMs;
  pushMismatch(failures, manifest?.schemaVersion === 1, 'backfill manifest schemaVersion must be 1');
  pushMismatch(failures, manifest?.kind === 'pcd-crm-historical-backfill', 'backfill manifest kind mismatch');
  pushMismatch(failures, manifest?.environment === 'production', 'backfill manifest environment must be production');
  pushMismatch(failures, manifest?.dataClassification === 'governed_source_projection', 'backfill data classification mismatch');
  pushMismatch(failures, manifest?.remoteExecutionAuthorized === false, 'local backfill manifest must retain remoteExecutionAuthorized=false');
  pushMismatch(failures, GIT_SHA.test(expectedProducerCandidate ?? ''), 'expected producer candidate is malformed');
  pushMismatch(failures, manifest?.producerCandidate === expectedProducerCandidate, 'producer candidate mismatch');
  pushMismatch(failures, GIT_SHA.test(expectedReceiverCandidate ?? ''), 'expected receiver candidate is malformed');
  pushMismatch(failures, manifest?.receiverCandidate === expectedReceiverCandidate, 'receiver candidate mismatch');
  pushMismatch(failures, manifest?.producerWorkspaceId === 'pcd-activity-radar', 'producer workspace mismatch');
  pushMismatch(failures, manifest?.targetWorkspaceId === 'ws-sightsmash', 'target workspace mismatch');
  pushMismatch(failures, manifest?.sourceId === 'source-pcd-activity-radar', 'source identity mismatch');
  pushMismatch(failures, manifest?.sourcePolicyVersion === EXPECTED_POLICY, 'source policy version mismatch');
  pushMismatch(failures, freshBoundary(boundary, now), 'production backfill boundary is stale or malformed');
  const boundaryIso = Number.isSafeInteger(boundary) ? new Date(boundary).toISOString() : null;
  pushMismatch(failures, manifest?.sourceNotBeforeIso === boundaryIso, 'boundary ISO value mismatch');

  const databaseIds = manifest?.databaseIds ?? {};
  pushMismatch(failures, databaseIds.directory === PRODUCTION_CRM_IDENTITIES.directoryDatabaseId, 'directory D1 identity mismatch');
  pushMismatch(failures, databaseIds.operations === PRODUCTION_CRM_IDENTITIES.opsDatabaseId, 'operations D1 identity mismatch');
  pushMismatch(failures, databaseIds.target === '9ea593e2-b5ca-40d8-b7fa-8172e02edb3d', 'target D1 identity mismatch');
  pushMismatch(failures, BOOKMARK.test(manifest?.sourceBookmarks?.directory ?? ''), 'directory bookmark is malformed');
  pushMismatch(failures, BOOKMARK.test(manifest?.sourceBookmarks?.operations ?? ''), 'operations bookmark is malformed');

  try {
    const inventory = manifest?.sourceInventory ?? {};
    const organizations = exactCount(inventory.organizations, 'organization inventory');
    const contacts = exactCount(inventory.contacts, 'contact inventory');
    const channels = exactCount(inventory.contactsWithChannel, 'contact-channel inventory');
    const publicReviewed = exactCount(inventory.contactsPublicReviewed, 'public-contact inventory');
    pushMismatch(failures, channels <= contacts, 'contact-channel inventory exceeds contact inventory');
    pushMismatch(failures, publicReviewed <= contacts, 'public-contact inventory exceeds contact inventory');
    pushMismatch(failures, organizations > 0, 'organization inventory must be positive');
  } catch (error) {
    failures.push(error.message);
  }

  const runtime = manifest?.requiredRuntime ?? {};
  const expectedRuntime = {
    PCD_CRM_ADAPTER_ENABLED: 'true',
    PCD_CRM_BACKFILL_ENABLED: 'true',
    PCD_CRM_SOURCE_NOT_BEFORE_MS: String(boundary),
    PCD_CRM_DIRECTORY_DATABASE_ID: databaseIds.directory,
    PCD_CRM_OPS_DATABASE_ID: databaseIds.operations,
    PCD_CRM_TARGET_DATABASE_ID: databaseIds.target,
    PCD_CRM_DIRECTORY_BOOKMARK: manifest?.sourceBookmarks?.directory,
    PCD_CRM_OPS_BOOKMARK: manifest?.sourceBookmarks?.operations,
    PCD_CRM_SOURCE_POLICY_VERSION: EXPECTED_POLICY,
  };
  pushMismatch(failures, JSON.stringify(runtime) === JSON.stringify(expectedRuntime), 'required runtime contract mismatch');
  const completion = manifest?.completionContract ?? {};
  for (const field of [
    'everyOrganizationHasTerminalDisposition', 'everyContactHasTerminalDisposition',
    'eligibleEventsEqualDeliveredReceipts', 'twoCompleteReconciliationPasses',
    'zeroPendingOrDeadEvents', 'zeroReceiverFindings',
  ]) {
    pushMismatch(failures, completion[field] === true, `completion contract ${field} must be true`);
  }

  pushMismatch(failures, SHA256.test(expectedManifestSha256 ?? ''), 'expected manifest SHA-256 is malformed');
  if (manifestBytes !== undefined && SHA256.test(expectedManifestSha256 ?? '')) {
    const actual = createHash('sha256').update(manifestBytes).digest('hex');
    pushMismatch(failures, actual === expectedManifestSha256, 'backfill manifest byte hash mismatch');
  }
  return failures;
}

export function prepareProductionBackfillDeploymentManifest(baseManifest, approval, manifestSha256) {
  if (!SHA256.test(manifestSha256 ?? '')) throw new Error('backfill manifest SHA-256 is malformed');
  const prepared = structuredClone(baseManifest);
  prepared.vars = {
    ...prepared.vars,
    ...approval.requiredRuntime,
    PCD_CRM_BACKFILL_MANIFEST_SHA256: manifestSha256,
  };
  return prepared;
}

export function validateProductionBackfillDeploymentManifest(manifest, approval, manifestSha256, serverEntry = '') {
  const neutralized = structuredClone(manifest);
  neutralized.vars.PCD_CRM_ADAPTER_ENABLED = 'false';
  neutralized.vars.PCD_CRM_BACKFILL_ENABLED = 'false';
  delete neutralized.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS;
  const failures = validateProductionCrmDisabledManifest(neutralized, serverEntry);
  const expected = {
    ...approval.requiredRuntime,
    PCD_CRM_BACKFILL_MANIFEST_SHA256: manifestSha256,
  };
  for (const [name, value] of Object.entries(expected)) {
    if (manifest.vars?.[name] !== value) failures.push(`${name} does not match the frozen production backfill manifest`);
  }
  if (Object.hasOwn(manifest.vars ?? {}, 'PCD_CRM_PILOT_MODE')) {
    failures.push('production backfill deployment must not contain PCD_CRM_PILOT_MODE');
  }
  return [...new Set(failures)];
}

function runCaptured(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status ?? 1}`);
  return String(result.stdout ?? '');
}

function validateStatus(output) {
  return output.split(/\r?\n/).filter(Boolean).filter((line) => (
    !/^ M public\/link-manifest\.json$/.test(line)
    && !/^\?\? public\/og\/[a-z0-9-]+\.jpg$/.test(line)
  ));
}

function extractVersionId(output) {
  return output.match(/Version ID:\s*([0-9a-f-]{36})/i)?.[1] ?? null;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const options = parseProductionBackfillDeployArgs(process.argv.slice(2));
  const projectRoot = process.cwd();
  const expectedSha = requiredString(options.sha, '--sha');
  const expectedArtifactSha256 = requiredString(options.artifactSha256, '--artifact-sha256');
  const expectedManifestSha256 = requiredString(options.manifestSha256, '--manifest-sha256');
  if (!GIT_SHA.test(expectedSha)) throw new Error('--sha must be a full lowercase Git SHA');
  if (!SHA256.test(expectedArtifactSha256)) throw new Error('--artifact-sha256 is malformed');
  if (!SHA256.test(expectedManifestSha256)) throw new Error('--manifest-sha256 is malformed');
  const receiverCandidate = requiredString(options.receiverCandidate, '--receiver-candidate');
  const approvalPath = resolve(requiredString(options.backfillManifest, '--backfill-manifest'));
  const approvalBytes = await readFile(approvalPath);
  const approval = JSON.parse(approvalBytes.toString('utf8'));
  const approvalFailures = validateProductionBackfillApproval(approval, {
    expectedProducerCandidate: expectedSha,
    expectedReceiverCandidate: receiverCandidate,
    expectedManifestSha256,
    manifestBytes: approvalBytes,
  });
  if (approvalFailures.length > 0) throw new Error(`production backfill approval refused:\n- ${approvalFailures.join('\n- ')}`);

  const status = runCaptured('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: projectRoot });
  const unexpectedStatus = validateStatus(status);
  if (unexpectedStatus.length > 0) throw new Error('worktree has changes outside approved build-generated paths');
  const head = runCaptured('git', ['rev-parse', 'HEAD'], { cwd: projectRoot }).trim();
  if (head !== expectedSha) throw new Error('checked-out source does not match approved producer candidate');
  const buildInfo = JSON.parse(await readFile(resolve(projectRoot, 'dist/client/build-info.json'), 'utf8'));
  if (buildInfo.commit !== expectedSha) throw new Error('prebuilt artifact source does not match approved producer candidate');
  const actualArtifactSha256 = await hashBuildArtifact(projectRoot);
  if (actualArtifactSha256 !== expectedArtifactSha256) throw new Error('prebuilt production artifact hash mismatch');

  const baseManifestPath = resolve(projectRoot, 'dist/server/wrangler.json');
  const baseManifest = JSON.parse(await readFile(baseManifestPath, 'utf8'));
  const serverEntry = await readFile(resolve(projectRoot, 'dist/server/entry.mjs'), 'utf8');
  const baseFailures = validateProductionCrmDisabledManifest(baseManifest, serverEntry);
  if (baseFailures.length > 0) throw new Error(`base production artifact refused:\n- ${baseFailures.join('\n- ')}`);
  const deploymentManifest = prepareProductionBackfillDeploymentManifest(baseManifest, approval, expectedManifestSha256);
  const deploymentFailures = validateProductionBackfillDeploymentManifest(
    deploymentManifest, approval, expectedManifestSha256, serverEntry,
  );
  if (deploymentFailures.length > 0) throw new Error(`production backfill deployment refused:\n- ${deploymentFailures.join('\n- ')}`);

  const dryRun = {
    dryRun: true,
    producerCandidate: expectedSha,
    receiverCandidate,
    artifactSha256: expectedArtifactSha256,
    backfillManifestSha256: expectedManifestSha256,
    sourceNotBeforeMs: approval.sourceNotBeforeMs,
    sourceInventory: approval.sourceInventory,
    databaseIds: approval.databaseIds,
    sourceBookmarks: approval.sourceBookmarks,
    runtime: deploymentManifest.vars,
  };
  if (!options.confirmProductionBackfill) {
    process.stdout.write(`${JSON.stringify(dryRun, null, 2)}\nDry run only. No deployment was attempted.\n`);
    process.exit(0);
  }
  if (options.typeConfirmation !== REQUIRED_CONFIRMATION) {
    throw new Error(`--type-confirmation must exactly equal "${REQUIRED_CONFIRMATION}"`);
  }
  const receiptTimestamp = requiredString(options.receiptTimestamp, '--receipt-timestamp');
  if (Number.isNaN(Date.parse(receiptTimestamp))) throw new Error('--receipt-timestamp must be ISO-8601');
  const receiptOut = resolveBackfillReceiptOutput(options.receiptOut, projectRoot);
  if (!freshBoundary(approval.sourceNotBeforeMs)) throw new Error('production backfill boundary expired before deployment');

  await mkdir(dirname(receiptOut), { recursive: true });
  const temporaryConfig = resolve(projectRoot, 'dist/server', `.wrangler.crm-production-backfill-${randomUUID()}.json`);
  const handle = await open(temporaryConfig, 'wx');
  try {
    await handle.writeFile(`${JSON.stringify(deploymentManifest)}\n`);
  } finally {
    await handle.close();
  }
  let receiptHandle;
  let deployed = false;
  try {
    receiptHandle = await open(receiptOut, 'wx');
    if (!freshBoundary(approval.sourceNotBeforeMs)) throw new Error('production backfill boundary expired before deployment');
    const deployOutput = runCaptured(process.execPath, [
      resolve(projectRoot, 'node_modules/wrangler/bin/wrangler.js'),
      'deploy', '--config', temporaryConfig, '--keep-vars',
      '--message', `CRM production historical backfill ${expectedManifestSha256}`,
    ], { cwd: projectRoot });
    process.stdout.write(deployOutput);
    const receipt = {
      schemaVersion: 1,
      worker: 'parent-coach-desk',
      producerCandidate: expectedSha,
      receiverCandidate,
      versionId: extractVersionId(deployOutput),
      artifactSha256: expectedArtifactSha256,
      backfillManifestSha256: expectedManifestSha256,
      sourceNotBeforeMs: approval.sourceNotBeforeMs,
      deployedAt: receiptTimestamp,
      adapterEnabled: true,
      backfillEnabled: true,
    };
    await receiptHandle.writeFile(`${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
    deployed = true;
    process.stdout.write(`Production backfill deployment receipt written beneath backups.\n`);
  } finally {
    if (receiptHandle) await receiptHandle.close();
    if (!deployed) await unlink(receiptOut).catch(() => {});
    await unlink(temporaryConfig).catch(() => {});
  }
}
