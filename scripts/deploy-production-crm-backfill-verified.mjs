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
const BACKFILL_RUN_ID = /^pcd-backfill:[a-f0-9]{64}$/;
const BOOKMARK = /^[a-f0-9]{8}(?:-[a-f0-9]{8}){2}-[a-f0-9]{32}$/;
const REQUIRED_CONFIRMATION = 'ACTIVATE parent-coach-desk CRM PRODUCTION BACKFILL';
const EXPECTED_POLICY = 'pcd-public-professional-v1';
const EXPECTED_RECEIVER = '4dd8794b8006c075bcda6905f5a4dda283a0378a';
const MAX_RESUME_AUTHORIZATION_MS = 24 * 60 * 60 * 1_000;
const FLAG_NAMES = new Set([
  '--sha', '--artifact-sha256', '--manifest-sha256', '--backfill-manifest',
  '--receiver-candidate', '--rollback-version-id', '--receipt-out', '--receipt-timestamp',
  '--resume-authorization', '--resume-authorization-sha256',
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
  return validBoundary(value)
    && Math.abs(now - value) <= 15 * 60 * 1_000;
}

function validBoundary(value) {
  return Number.isSafeInteger(value) && value > 0 && value % 1_000 === 0;
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
    rollbackVersionId: null,
    receiptOut: null,
    receiptTimestamp: null,
    resumeAuthorization: null,
    resumeAuthorizationSha256: null,
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
    else if (flag === '--rollback-version-id') options.rollbackVersionId = value;
    else if (flag === '--receipt-out') options.receiptOut = value;
    else if (flag === '--receipt-timestamp') options.receiptTimestamp = value;
    else if (flag === '--resume-authorization') options.resumeAuthorization = value;
    else if (flag === '--resume-authorization-sha256') options.resumeAuthorizationSha256 = value;
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
 *   allowExpiredBoundary?: boolean,
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
    allowExpiredBoundary = false,
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
  pushMismatch(
    failures,
    validBoundary(boundary) && (allowExpiredBoundary || freshBoundary(boundary, now)),
    'production backfill boundary is stale or malformed',
  );
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

/**
 * @param {any} authorization
 * @param {{
 *   now?: number,
 *   expectedResumeProducerCandidate?: string,
 *   expectedOriginalProducerCandidate?: string,
 *   expectedReceiverCandidate?: string,
 *   expectedRollbackVersionId?: string,
 *   expectedManifestSha256?: string,
 * }} [options]
 */
export function validateProductionBackfillResumeAuthorization(
  authorization,
  {
    now = Date.now(),
    expectedResumeProducerCandidate,
    expectedOriginalProducerCandidate,
    expectedReceiverCandidate = EXPECTED_RECEIVER,
    expectedRollbackVersionId,
    expectedManifestSha256,
  } = {},
) {
  const failures = [];
  pushMismatch(failures, authorization?.schemaVersion === 1, 'resume authorization schemaVersion must be 1');
  pushMismatch(
    failures,
    authorization?.kind === 'pcd-crm-historical-backfill-resume',
    'resume authorization kind mismatch',
  );
  pushMismatch(failures, authorization?.environment === 'production', 'resume authorization environment must be production');
  pushMismatch(
    failures,
    GIT_SHA.test(expectedResumeProducerCandidate ?? '')
      && authorization?.resumeProducerCandidate === expectedResumeProducerCandidate,
    'resume producer candidate mismatch',
  );
  pushMismatch(
    failures,
    GIT_SHA.test(expectedOriginalProducerCandidate ?? '')
      && authorization?.originalProducerCandidate === expectedOriginalProducerCandidate,
    'original producer candidate mismatch',
  );
  pushMismatch(
    failures,
    GIT_SHA.test(expectedReceiverCandidate ?? '')
      && authorization?.receiverCandidate === expectedReceiverCandidate,
    'resume receiver candidate mismatch',
  );
  pushMismatch(
    failures,
    /^[a-f0-9-]{36}$/.test(expectedRollbackVersionId ?? '')
      && authorization?.rollbackVersionId === expectedRollbackVersionId,
    'resume rollback version mismatch',
  );
  pushMismatch(
    failures,
    SHA256.test(expectedManifestSha256 ?? '')
      && authorization?.backfillManifestSha256 === expectedManifestSha256,
    'resume backfill manifest hash mismatch',
  );
  pushMismatch(failures, BACKFILL_RUN_ID.test(authorization?.runId ?? ''), 'resume run id is malformed');

  const authorizedAt = Date.parse(authorization?.authorizedAt ?? '');
  const expiresAt = Date.parse(authorization?.expiresAt ?? '');
  const validWindow = Number.isFinite(authorizedAt) && Number.isFinite(expiresAt)
    && authorizedAt <= now + 60_000 && expiresAt >= now
    && expiresAt > authorizedAt && expiresAt - authorizedAt <= MAX_RESUME_AUTHORIZATION_MS;
  pushMismatch(failures, validWindow, 'resume authorization has expired or is not yet active');

  const checkpoint = authorization?.checkpoint ?? {};
  pushMismatch(failures, checkpoint.status === 'running', 'resume checkpoint status must be running');
  for (const field of [
    'organizationRowsSeen', 'organizationEligible', 'organizationRejected',
    'contactRowsSeen', 'contactEligible', 'contactRejected', 'outboxTotal',
    'delivered', 'pending', 'dead', 'organizationComplete', 'contactComplete',
    'reconciliationPass', 'reconciliationCursorSequence', 'reconciliationWindowOrdinal',
    'reconciliationComplete', 'reconciliationFailureCount', 'reconciliationHalted',
  ]) {
    try {
      exactCount(checkpoint[field], `resume checkpoint ${field}`);
    } catch (error) {
      failures.push(error.message);
    }
  }
  pushMismatch(
    failures,
    checkpoint.organizationEligible + checkpoint.organizationRejected === checkpoint.organizationRowsSeen,
    'resume organization disposition accounting mismatch',
  );
  pushMismatch(
    failures,
    checkpoint.contactEligible + checkpoint.contactRejected === checkpoint.contactRowsSeen,
    'resume contact disposition accounting mismatch',
  );
  pushMismatch(
    failures,
    checkpoint.delivered + checkpoint.pending + checkpoint.dead === checkpoint.outboxTotal,
    'resume outbox accounting mismatch',
  );
  pushMismatch(failures, checkpoint.dead === 0, 'resume checkpoint must have zero dead events');
  pushMismatch(failures, checkpoint.leaseId === null, 'resume checkpoint must not retain an active lease');
  pushMismatch(failures, checkpoint.reconciliationHalted === 0, 'resume checkpoint must not be halted');
  return [...new Set(failures)];
}

export function validateReadOnlyD1Response(response, label = 'D1 readback') {
  const envelopes = Array.isArray(response) ? response : [response];
  if (envelopes.length === 0) throw new Error(`${label} returned no result envelopes`);
  const rows = [];
  for (const envelope of envelopes) {
    if (envelope?.success !== true) throw new Error(`${label} must report success=true`);
    if (Number(envelope?.meta?.changes) !== 0) throw new Error(`${label} must report changes=0`);
    if (Number(envelope?.meta?.rows_written) !== 0) throw new Error(`${label} must report rows_written=0`);
    if (envelope?.meta?.changed_db !== false) throw new Error(`${label} must report changed_db=false`);
    if (!Array.isArray(envelope?.results)) throw new Error(`${label} must return a results array`);
    rows.push(...envelope.results);
  }
  return rows;
}

export function validateProductionBackfillResumeCheckpoint(row, authorization, approval) {
  const failures = [];
  const expected = authorization?.checkpoint ?? {};
  const exactText = [
    ['runId', authorization?.runId, 'resume run id changed'],
    ['status', expected.status, 'resume run status changed'],
    ['approvalManifestSha256', authorization?.backfillManifestSha256, 'resume manifest binding changed'],
    ['producerWorkspaceId', approval?.producerWorkspaceId, 'resume producer workspace changed'],
    ['targetWorkspaceId', approval?.targetWorkspaceId, 'resume target workspace changed'],
    ['directoryDatabaseId', approval?.databaseIds?.directory, 'resume directory database changed'],
    ['opsDatabaseId', approval?.databaseIds?.operations, 'resume operations database changed'],
    ['targetDatabaseId', approval?.databaseIds?.target, 'resume target database changed'],
    ['directoryBookmark', approval?.sourceBookmarks?.directory, 'resume directory bookmark changed'],
    ['opsBookmark', approval?.sourceBookmarks?.operations, 'resume operations bookmark changed'],
    ['sourcePolicyVersion', approval?.sourcePolicyVersion, 'resume source policy changed'],
  ];
  for (const [field, value, message] of exactText) pushMismatch(failures, row?.[field] === value, message);
  const exactNumbers = [
    ['snapshotBeforeMs', approval?.sourceNotBeforeMs],
    ['expectedOrganizationRows', approval?.sourceInventory?.organizations],
    ['expectedContactRows', approval?.sourceInventory?.contacts],
    ['organizationRowsSeen', expected.organizationRowsSeen],
    ['organizationEligible', expected.organizationEligible],
    ['organizationRejected', expected.organizationRejected],
    ['contactRowsSeen', expected.contactRowsSeen],
    ['contactEligible', expected.contactEligible],
    ['contactRejected', expected.contactRejected],
    ['outboxTotal', expected.outboxTotal],
    ['delivered', expected.delivered],
    ['pending', expected.pending],
    ['dead', expected.dead],
    ['organizationComplete', expected.organizationComplete],
    ['contactComplete', expected.contactComplete],
    ['reconciliationPass', expected.reconciliationPass],
    ['reconciliationCursorSequence', expected.reconciliationCursorSequence],
    ['reconciliationWindowOrdinal', expected.reconciliationWindowOrdinal],
    ['reconciliationComplete', expected.reconciliationComplete],
    ['reconciliationFailureCount', expected.reconciliationFailureCount],
    ['reconciliationHalted', expected.reconciliationHalted],
  ];
  for (const [field, value] of exactNumbers) {
    pushMismatch(failures, Number(row?.[field]) === value, `resume checkpoint ${field} changed`);
  }
  pushMismatch(failures, row?.leaseId === null, 'resume checkpoint acquired a lease');
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

function liveBinding(bindings, name) {
  return (bindings ?? []).find((binding) => binding?.name === name);
}

function newestDeployment(deployments) {
  return [...(deployments ?? [])].sort((left, right) =>
    String(right?.created_on ?? '').localeCompare(String(left?.created_on ?? '')))[0];
}

export function validateExactActiveVersion(deployments, expectedVersionId) {
  const activeVersions = newestDeployment(deployments)?.versions ?? [];
  if (activeVersions.length !== 1 || activeVersions[0]?.percentage !== 100) {
    return ['latest deployment must route exactly one version at 100 percent'];
  }
  if (activeVersions[0]?.version_id !== expectedVersionId) {
    return ['active version must equal the exact rollback version'];
  }
  return [];
}

export function validateProductionBackfillLiveSnapshot(snapshot) {
  const failures = [];
  const version = snapshot?.version;
  const expectedVersionId = snapshot?.expectedVersionId;
  const expectedVersionTag = snapshot?.expectedVersionTag;
  const approval = snapshot?.approval;
  const manifestSha256 = snapshot?.backfillManifestSha256;
  if (version?.id !== expectedVersionId) {
    failures.push('version readback must equal the exact uploaded version');
  }
  if (version?.annotations?.['workers/tag'] !== expectedVersionTag) {
    failures.push('version readback must retain the exact backfill tag');
  }

  const bindings = version?.resources?.bindings;
  if (!Array.isArray(bindings)) {
    return [...failures, 'version readback must contain Worker bindings'];
  }
  const expectedD1 = [
    ['DB', PRODUCTION_CRM_IDENTITIES.directoryDatabaseId],
    ['FORGE_DB', PRODUCTION_CRM_IDENTITIES.forgeDatabaseId],
    ['PCD_OPS_DB', PRODUCTION_CRM_IDENTITIES.opsDatabaseId],
  ];
  for (const [name, databaseId] of expectedD1) {
    const binding = liveBinding(bindings, name);
    if (binding?.type !== 'd1' || binding?.database_id !== databaseId) {
      failures.push(`${name} live binding must target production D1 ${databaseId}`);
    }
  }
  const service = liveBinding(bindings, 'CRM_ADAPTER');
  if (service?.type !== 'service'
    || service?.service !== PRODUCTION_CRM_IDENTITIES.receiverService
    || service?.environment !== 'production') {
    failures.push('CRM_ADAPTER live binding must target field-forge-crm production');
  }
  if (liveBinding(bindings, 'PCD_CRM_ADAPTER_HMAC_SECRET')?.type !== 'secret_text') {
    failures.push('PCD_CRM_ADAPTER_HMAC_SECRET must remain a live secret binding');
  }
  for (const [name, text] of Object.entries(approval?.requiredRuntime ?? {})) {
    const binding = liveBinding(bindings, name);
    if (binding?.type !== 'plain_text' || binding?.text !== text) {
      failures.push(`${name} live binding must match the frozen backfill manifest`);
    }
  }
  const digest = liveBinding(bindings, 'PCD_CRM_BACKFILL_MANIFEST_SHA256');
  if (digest?.type !== 'plain_text' || digest?.text !== manifestSha256) {
    failures.push('PCD_CRM_BACKFILL_MANIFEST_SHA256 live binding must match the frozen manifest');
  }
  if (liveBinding(bindings, 'PCD_CRM_PILOT_MODE')) {
    failures.push('PCD_CRM_PILOT_MODE must remain absent from the live production version');
  }

  if (snapshot?.requireActive !== false) {
    const activeVersions = newestDeployment(snapshot?.deployments)?.versions ?? [];
    if (activeVersions.length !== 1 || activeVersions[0]?.percentage !== 100) {
      failures.push('latest deployment must route exactly one version at 100 percent');
    } else if (activeVersions[0]?.version_id !== expectedVersionId) {
      failures.push('active version must equal the exact uploaded version');
    }
  }
  return [...new Set(failures)];
}

function runCaptured(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status ?? 1}`);
  return String(result.stdout ?? '');
}

function runWranglerJson(wranglerPath, args, projectRoot, label) {
  const output = runCaptured(process.execPath, [wranglerPath, ...args], { cwd: projectRoot });
  try {
    return JSON.parse(output);
  } catch {
    throw new Error(`${label} returned invalid JSON`);
  }
}

function runReadOnlyD1Rows(wranglerPath, configPath, projectRoot, binding, sql, label) {
  const response = runWranglerJson(wranglerPath, [
    'd1', 'execute', binding, '--remote', '--config', configPath,
    '--command', sql, '--json',
  ], projectRoot, label);
  return validateReadOnlyD1Response(response, label);
}

function assertResumePreflight({
  wranglerPath,
  configPath,
  projectRoot,
  authorization,
  approval,
}) {
  const runId = authorization.runId;
  if (!BACKFILL_RUN_ID.test(runId)) throw new Error('resume run id is malformed');
  const checkpointSql = `SELECT
    r.id AS runId,r.status,r.producer_workspace_id AS producerWorkspaceId,
    r.target_workspace_id AS targetWorkspaceId,r.snapshot_before_ms AS snapshotBeforeMs,
    r.approval_manifest_sha256 AS approvalManifestSha256,
    r.directory_database_id AS directoryDatabaseId,r.ops_database_id AS opsDatabaseId,
    r.target_database_id AS targetDatabaseId,r.directory_bookmark AS directoryBookmark,
    r.ops_bookmark AS opsBookmark,r.source_policy_version AS sourcePolicyVersion,
    r.expected_organization_rows AS expectedOrganizationRows,
    r.expected_contact_rows AS expectedContactRows,
    r.organization_complete AS organizationComplete,r.contact_complete AS contactComplete,
    r.lease_id AS leaseId,r.reconciliation_pass AS reconciliationPass,
    r.reconciliation_cursor_sequence AS reconciliationCursorSequence,
    r.reconciliation_window_ordinal AS reconciliationWindowOrdinal,
    r.reconciliation_complete AS reconciliationComplete,
    r.reconciliation_failure_count AS reconciliationFailureCount,
    r.reconciliation_halted AS reconciliationHalted,
    COALESCE((SELECT SUM(rows_seen) FROM crm_adapter_backfill_chunks c
      WHERE c.run_id=r.id AND c.subject_type='organization'),0) AS organizationRowsSeen,
    COALESCE((SELECT SUM(eligible_count) FROM crm_adapter_backfill_chunks c
      WHERE c.run_id=r.id AND c.subject_type='organization'),0) AS organizationEligible,
    COALESCE((SELECT SUM(rejected_count) FROM crm_adapter_backfill_chunks c
      WHERE c.run_id=r.id AND c.subject_type='organization'),0) AS organizationRejected,
    COALESCE((SELECT SUM(rows_seen) FROM crm_adapter_backfill_chunks c
      WHERE c.run_id=r.id AND c.subject_type='contact'),0) AS contactRowsSeen,
    COALESCE((SELECT SUM(eligible_count) FROM crm_adapter_backfill_chunks c
      WHERE c.run_id=r.id AND c.subject_type='contact'),0) AS contactEligible,
    COALESCE((SELECT SUM(rejected_count) FROM crm_adapter_backfill_chunks c
      WHERE c.run_id=r.id AND c.subject_type='contact'),0) AS contactRejected,
    COALESCE((SELECT COUNT(*) FROM crm_adapter_outbox o
      WHERE o.backfill_run_id=r.id AND o.cancelled_at IS NULL),0) AS outboxTotal,
    COALESCE((SELECT SUM(CASE WHEN status='delivered' AND receiver_receipt_id IS NOT NULL THEN 1 ELSE 0 END)
      FROM crm_adapter_outbox o WHERE o.backfill_run_id=r.id AND o.cancelled_at IS NULL),0) AS delivered,
    COALESCE((SELECT SUM(CASE WHEN status IN ('pending','retry','leased') THEN 1 ELSE 0 END)
      FROM crm_adapter_outbox o WHERE o.backfill_run_id=r.id AND o.cancelled_at IS NULL),0) AS pending,
    COALESCE((SELECT SUM(CASE WHEN status='dead' THEN 1 ELSE 0 END)
      FROM crm_adapter_outbox o WHERE o.backfill_run_id=r.id AND o.cancelled_at IS NULL),0) AS dead
    FROM crm_adapter_backfill_runs r WHERE r.id='${runId}'`;
  const checkpointRows = runReadOnlyD1Rows(
    wranglerPath, configPath, projectRoot, 'PCD_OPS_DB', checkpointSql, 'CRM resume checkpoint readback',
  );
  if (checkpointRows.length !== 1) throw new Error('CRM resume checkpoint must return exactly one run');
  const checkpointFailures = validateProductionBackfillResumeCheckpoint(
    checkpointRows[0], authorization, approval,
  );
  if (checkpointFailures.length > 0) {
    throw new Error(`CRM resume checkpoint drifted:\n- ${checkpointFailures.join('\n- ')}`);
  }

  const snapshotBeforeSecond = approval.sourceNotBeforeMs / 1_000;
  const directoryRows = runReadOnlyD1Rows(
    wranglerPath,
    configPath,
    projectRoot,
    'DB',
    `SELECT SUM(CASE WHEN unixepoch(created_at)<${snapshotBeforeSecond} THEN 1 ELSE 0 END) AS count,
      SUM(CASE WHEN unixepoch(created_at) IS NULL OR unixepoch(updated_at) IS NULL THEN 1 ELSE 0 END) AS invalid
      FROM organizations`,
    'CRM resume directory inventory readback',
  );
  const contactRows = runReadOnlyD1Rows(
    wranglerPath,
    configPath,
    projectRoot,
    'PCD_OPS_DB',
    `SELECT SUM(CASE WHEN unixepoch(created_at)<${snapshotBeforeSecond} THEN 1 ELSE 0 END) AS count,
      SUM(CASE WHEN unixepoch(created_at) IS NULL OR unixepoch(updated_at) IS NULL THEN 1 ELSE 0 END) AS invalid
      FROM org_contacts`,
    'CRM resume contact inventory readback',
  );
  if (directoryRows.length !== 1 || contactRows.length !== 1) {
    throw new Error('CRM resume source inventory must return exactly one row per source');
  }
  if (Number(directoryRows[0].invalid) !== 0 || Number(contactRows[0].invalid) !== 0) {
    throw new Error('CRM resume source inventory contains invalid timestamps');
  }
  if (Number(directoryRows[0].count) !== approval.sourceInventory.organizations
    || Number(contactRows[0].count) !== approval.sourceInventory.contacts) {
    throw new Error('CRM resume source inventory changed');
  }
  return checkpointRows[0];
}

function assertLiveBackfillVersion({
  wranglerPath,
  configPath,
  projectRoot,
  expectedVersionId,
  expectedVersionTag,
  approval,
  backfillManifestSha256,
  requireActive,
}) {
  const version = runWranglerJson(wranglerPath, [
    'versions', 'view', expectedVersionId,
    '--name', 'parent-coach-desk', '--config', configPath, '--json',
  ], projectRoot, 'Wrangler version readback');
  const deployments = requireActive ? runWranglerJson(wranglerPath, [
    'deployments', 'list', '--name', 'parent-coach-desk', '--config', configPath, '--json',
  ], projectRoot, 'Wrangler deployment readback') : [];
  const snapshot = {
    expectedVersionId,
    expectedVersionTag,
    requireActive,
    approval,
    backfillManifestSha256,
    version,
    deployments,
  };
  const failures = validateProductionBackfillLiveSnapshot(snapshot);
  if (failures.length > 0) {
    throw new Error(`production backfill live-version verification failed:\n- ${failures.join('\n- ')}`);
  }
  return { version, deployment: requireActive ? newestDeployment(deployments) : null };
}

function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds));
}

function validateStatus(output) {
  return output.split(/\r?\n/).filter(Boolean).filter((line) => (
    !/^ M public\/link-manifest\.json$/.test(line)
    && !/^\?\? public\/og\/[a-z0-9-]+\.jpg$/.test(line)
  ));
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
  const rollbackVersionId = requiredString(options.rollbackVersionId, '--rollback-version-id');
  if (!/^[a-f0-9-]{36}$/.test(rollbackVersionId)) throw new Error('--rollback-version-id is malformed');
  const approvalPath = resolve(requiredString(options.backfillManifest, '--backfill-manifest'));
  const approvalBytes = await readFile(approvalPath);
  const approval = JSON.parse(approvalBytes.toString('utf8'));
  const resumeMode = Boolean(options.resumeAuthorization || options.resumeAuthorizationSha256);
  if (Boolean(options.resumeAuthorization) !== Boolean(options.resumeAuthorizationSha256)) {
    throw new Error('--resume-authorization and --resume-authorization-sha256 must be provided together');
  }
  let resumeAuthorization = null;
  let resumeAuthorizationSha256 = null;
  if (resumeMode) {
    resumeAuthorizationSha256 = requiredString(
      options.resumeAuthorizationSha256, '--resume-authorization-sha256',
    );
    if (!SHA256.test(resumeAuthorizationSha256)) {
      throw new Error('--resume-authorization-sha256 is malformed');
    }
    const resumeAuthorizationPath = resolve(
      requiredString(options.resumeAuthorization, '--resume-authorization'),
    );
    const resumeAuthorizationBytes = await readFile(resumeAuthorizationPath);
    const actualResumeAuthorizationSha256 = createHash('sha256')
      .update(resumeAuthorizationBytes).digest('hex');
    if (actualResumeAuthorizationSha256 !== resumeAuthorizationSha256) {
      throw new Error('resume authorization byte hash mismatch');
    }
    resumeAuthorization = JSON.parse(resumeAuthorizationBytes.toString('utf8'));
  }
  const approvalFailures = validateProductionBackfillApproval(approval, {
    expectedProducerCandidate: resumeMode ? approval.producerCandidate : expectedSha,
    expectedReceiverCandidate: receiverCandidate,
    expectedManifestSha256,
    manifestBytes: approvalBytes,
    allowExpiredBoundary: resumeMode,
  });
  if (approvalFailures.length > 0) throw new Error(`production backfill approval refused:\n- ${approvalFailures.join('\n- ')}`);
  if (resumeMode) {
    const resumeFailures = validateProductionBackfillResumeAuthorization(resumeAuthorization, {
      expectedResumeProducerCandidate: expectedSha,
      expectedOriginalProducerCandidate: approval.producerCandidate,
      expectedReceiverCandidate: receiverCandidate,
      expectedRollbackVersionId: rollbackVersionId,
      expectedManifestSha256,
    });
    if (resumeFailures.length > 0) {
      throw new Error(`production backfill resume authorization refused:\n- ${resumeFailures.join('\n- ')}`);
    }
  }

  const assertActionFresh = () => {
    if (!resumeMode) {
      if (!freshBoundary(approval.sourceNotBeforeMs)) {
        throw new Error('production backfill boundary expired before deployment');
      }
      return;
    }
    const resumeFailures = validateProductionBackfillResumeAuthorization(resumeAuthorization, {
      expectedResumeProducerCandidate: expectedSha,
      expectedOriginalProducerCandidate: approval.producerCandidate,
      expectedReceiverCandidate: receiverCandidate,
      expectedRollbackVersionId: rollbackVersionId,
      expectedManifestSha256,
    });
    if (resumeFailures.length > 0) {
      throw new Error(`production backfill resume authorization expired or drifted:\n- ${resumeFailures.join('\n- ')}`);
    }
  };

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
    rollbackVersionId,
    artifactSha256: expectedArtifactSha256,
    backfillManifestSha256: expectedManifestSha256,
    sourceNotBeforeMs: approval.sourceNotBeforeMs,
    sourceInventory: approval.sourceInventory,
    databaseIds: approval.databaseIds,
    sourceBookmarks: approval.sourceBookmarks,
    runtime: deploymentManifest.vars,
    resume: resumeMode ? {
      authorizationSha256: resumeAuthorizationSha256,
      runId: resumeAuthorization.runId,
      checkpoint: resumeAuthorization.checkpoint,
      expiresAt: resumeAuthorization.expiresAt,
    } : null,
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
  assertActionFresh();

  await mkdir(dirname(receiptOut), { recursive: true });
  const temporaryConfig = resolve(projectRoot, 'dist/server', `.wrangler.crm-production-backfill-${randomUUID()}.json`);
  const wranglerPath = resolve(projectRoot, 'node_modules/wrangler/bin/wrangler.js');
  const versionTag = resumeMode
    ? `crm-p17b-resume-${resumeAuthorizationSha256.slice(0, 40)}`
    : `crm-p17b-${expectedManifestSha256.slice(0, 40)}`;
  const versionMessage = resumeMode
    ? `CRM production historical backfill resume ${resumeAuthorizationSha256}`
    : `CRM production historical backfill ${expectedManifestSha256}`;
  const handle = await open(temporaryConfig, 'wx');
  try {
    await handle.writeFile(`${JSON.stringify(deploymentManifest)}\n`);
  } finally {
    await handle.close();
  }
  let receiptHandle;
  let deployed = false;
  let promotionAttempted = false;
  try {
    receiptHandle = await open(receiptOut, 'wx');
    assertActionFresh();
    const initialDeployments = runWranglerJson(wranglerPath, [
      'deployments', 'list', '--name', 'parent-coach-desk', '--config', temporaryConfig, '--json',
    ], projectRoot, 'Wrangler activation preflight deployment readback');
    const activeFailures = validateExactActiveVersion(initialDeployments, rollbackVersionId);
    if (activeFailures.length > 0) {
      throw new Error(`production backfill rollback precondition failed:\n- ${activeFailures.join('\n- ')}`);
    }
    if (resumeMode) {
      assertResumePreflight({
        wranglerPath,
        configPath: temporaryConfig,
        projectRoot,
        authorization: resumeAuthorization,
        approval,
      });
    }
    const existingVersions = runWranglerJson(wranglerPath, [
      'versions', 'list', '--name', 'parent-coach-desk', '--config', temporaryConfig, '--json',
    ], projectRoot, 'Wrangler pre-upload version list');
    if (existingVersions.some((version) => version?.annotations?.['workers/tag'] === versionTag)) {
      throw new Error('exact production backfill version tag already exists');
    }

    const uploadOutput = runCaptured(process.execPath, [
      wranglerPath,
      'versions', 'upload', '--config', temporaryConfig, '--keep-vars', '--strict',
      '--tag', versionTag, '--message', versionMessage,
    ], { cwd: projectRoot });
    process.stdout.write(uploadOutput);
    const uploadedVersions = runWranglerJson(wranglerPath, [
      'versions', 'list', '--name', 'parent-coach-desk', '--config', temporaryConfig, '--json',
    ], projectRoot, 'Wrangler post-upload version list');
    const tagMatches = uploadedVersions.filter(
      (version) => version?.annotations?.['workers/tag'] === versionTag,
    );
    if (tagMatches.length !== 1 || !/^[a-f0-9-]{36}$/.test(tagMatches[0]?.id ?? '')) {
      throw new Error('exact production backfill version tag did not resolve uniquely');
    }
    const versionId = tagMatches[0].id;
    assertLiveBackfillVersion({
      wranglerPath, configPath: temporaryConfig, projectRoot,
      expectedVersionId: versionId, expectedVersionTag: versionTag,
      approval, backfillManifestSha256: expectedManifestSha256, requireActive: false,
    });
    assertActionFresh();
    if (resumeMode) {
      assertResumePreflight({
        wranglerPath,
        configPath: temporaryConfig,
        projectRoot,
        authorization: resumeAuthorization,
        approval,
      });
    }
    promotionAttempted = true;
    const deployOutput = runCaptured(process.execPath, [
      wranglerPath,
      'versions', 'deploy', '--version-id', versionId, '--percentage', '100',
      '--name', 'parent-coach-desk', '--config', temporaryConfig, '--yes', '--message', versionMessage,
    ], { cwd: projectRoot });
    process.stdout.write(deployOutput);
    assertLiveBackfillVersion({
      wranglerPath, configPath: temporaryConfig, projectRoot,
      expectedVersionId: versionId, expectedVersionTag: versionTag,
      approval, backfillManifestSha256: expectedManifestSha256, requireActive: true,
    });
    await wait(15_000);
    const finalReadback = assertLiveBackfillVersion({
      wranglerPath, configPath: temporaryConfig, projectRoot,
      expectedVersionId: versionId, expectedVersionTag: versionTag,
      approval, backfillManifestSha256: expectedManifestSha256, requireActive: true,
    });
    const receipt = {
      schemaVersion: 1,
      worker: 'parent-coach-desk',
      producerCandidate: expectedSha,
      receiverCandidate,
      versionId,
      versionTag,
      deploymentId: finalReadback.deployment?.id ?? null,
      artifactSha256: expectedArtifactSha256,
      backfillManifestSha256: expectedManifestSha256,
      sourceNotBeforeMs: approval.sourceNotBeforeMs,
      deployedAt: receiptTimestamp,
      adapterEnabled: true,
      backfillEnabled: true,
      resumeAuthorizationSha256,
      resumedRunId: resumeMode ? resumeAuthorization.runId : null,
    };
    await receiptHandle.writeFile(`${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
    deployed = true;
    process.stdout.write(`Production backfill deployment receipt written beneath backups.\n`);
  } catch (error) {
    if (promotionAttempted) {
      try {
        const rollbackOutput = runCaptured(process.execPath, [
          wranglerPath,
          'versions', 'deploy', '--version-id', rollbackVersionId, '--percentage', '100',
          '--name', 'parent-coach-desk', '--config', temporaryConfig, '--yes',
          '--message', `CRM production backfill automatic rollback ${expectedManifestSha256}`,
        ], { cwd: projectRoot });
        process.stderr.write(rollbackOutput);
        const rollbackDeployments = runWranglerJson(wranglerPath, [
          'deployments', 'list', '--name', 'parent-coach-desk', '--config', temporaryConfig, '--json',
        ], projectRoot, 'Wrangler rollback deployment readback');
        const rollbackFailures = validateExactActiveVersion(rollbackDeployments, rollbackVersionId);
        if (rollbackFailures.length > 0) throw new Error(rollbackFailures.join('; '));
      } catch (rollbackError) {
        throw new Error(`production backfill rollback failed after activation error: ${error.message}; ${rollbackError.message}`);
      }
    }
    throw error;
  } finally {
    if (receiptHandle) await receiptHandle.close();
    if (!deployed) await unlink(receiptOut).catch(() => {});
    await unlink(temporaryConfig).catch(() => {});
  }
}
