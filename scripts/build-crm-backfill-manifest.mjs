import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const UUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const BOOKMARK = /^[a-f0-9]{8}(?:-[a-f0-9]{8}){2}-[a-f0-9]{32}$/;
const GIT_SHA = /^[a-f0-9]{40}$/;
const POLICY_VERSION = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,79}$/;
const FLAGS = new Set([
  '--boundary-ms',
  '--output-file',
  '--producer-candidate',
  '--receiver-candidate',
  '--directory-database-id',
  '--ops-database-id',
  '--target-database-id',
  '--directory-bookmark',
  '--ops-bookmark',
  '--source-policy-version',
  '--expected-organizations',
  '--expected-contacts',
  '--expected-contact-channels',
  '--expected-public-contacts',
]);

export function parseBackfillManifestBoundary(value, now = Date.now()) {
  if (typeof value !== 'string' || !/^\d+$/.test(value)) {
    throw new Error('crm_backfill_boundary_invalid');
  }
  const boundaryMs = Number(value);
  if (!Number.isSafeInteger(boundaryMs) || boundaryMs <= 0 || boundaryMs % 1_000 !== 0
    || Math.abs(now - boundaryMs) > 15 * 60 * 1_000) {
    throw new Error('crm_backfill_boundary_invalid');
  }
  return boundaryMs;
}

export function parseBackfillManifestArguments(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (!FLAGS.has(flag)) throw new Error(`unknown_argument:${flag}`);
    if (Object.hasOwn(values, flag)) throw new Error(`duplicate_argument:${flag}`);
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`missing_value:${flag}`);
    values[flag] = value;
    index += 1;
  }
  return values;
}

function requiredText(value, error) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(error);
  return value.trim();
}

export function resolveBackfillManifestOutput(value, root = process.cwd()) {
  const outputFile = resolve(root, requiredText(value, 'crm_backfill_output_file_required'));
  const backupsRoot = resolve(root, 'backups');
  const childPath = relative(backupsRoot, outputFile);
  if (!childPath || childPath === '..' || childPath.startsWith(`..${sep}`) || isAbsolute(childPath)) {
    throw new Error('crm_backfill_output_must_be_under_backups');
  }
  return outputFile;
}

function exactCount(value, error) {
  const count = typeof value === 'number' ? value : Number(value);
  if (!Number.isSafeInteger(count) || count < 0) throw new Error(error);
  return count;
}

function exactMatch(value, pattern, error) {
  const normalized = requiredText(value, error);
  if (!pattern.test(normalized)) throw new Error(error);
  return normalized;
}

export async function buildCrmBackfillManifest(input) {
  const outputFile = resolve(requiredText(input.outputFile, 'crm_backfill_output_file_required'));
  const sourceNotBeforeMs = parseBackfillManifestBoundary(String(input.sourceNotBeforeMs));
  const producerCandidate = exactMatch(
    input.producerCandidate, GIT_SHA, 'crm_backfill_producer_candidate_invalid',
  );
  const receiverCandidate = exactMatch(
    input.receiverCandidate, GIT_SHA, 'crm_backfill_receiver_candidate_invalid',
  );
  const directoryDatabaseId = exactMatch(
    input.directoryDatabaseId, UUID, 'crm_backfill_directory_database_id_invalid',
  );
  const opsDatabaseId = exactMatch(
    input.opsDatabaseId, UUID, 'crm_backfill_ops_database_id_invalid',
  );
  const targetDatabaseId = exactMatch(
    input.targetDatabaseId, UUID, 'crm_backfill_target_database_id_invalid',
  );
  const directoryBookmark = exactMatch(
    input.directoryBookmark, BOOKMARK, 'crm_backfill_directory_bookmark_invalid',
  );
  const opsBookmark = exactMatch(
    input.opsBookmark, BOOKMARK, 'crm_backfill_ops_bookmark_invalid',
  );
  const sourcePolicyVersion = exactMatch(
    input.sourcePolicyVersion, POLICY_VERSION, 'crm_backfill_source_policy_version_invalid',
  );
  const expectedOrganizationRows = exactCount(
    input.expectedOrganizationRows, 'crm_backfill_organization_inventory_invalid',
  );
  const expectedContactRows = exactCount(
    input.expectedContactRows, 'crm_backfill_contact_inventory_invalid',
  );
  const expectedContactChannelRows = exactCount(
    input.expectedContactChannelRows, 'crm_backfill_contact_inventory_invalid',
  );
  const expectedContactPublicRows = exactCount(
    input.expectedContactPublicRows, 'crm_backfill_contact_inventory_invalid',
  );
  if (expectedContactChannelRows > expectedContactRows || expectedContactPublicRows > expectedContactRows) {
    throw new Error('crm_backfill_contact_inventory_invalid');
  }

  const manifest = {
    schemaVersion: 1,
    kind: 'pcd-crm-historical-backfill',
    environment: 'staging',
    dataClassification: 'governed_source_projection',
    remoteExecutionAuthorized: false,
    sourceNotBeforeMs,
    sourceNotBeforeIso: new Date(sourceNotBeforeMs).toISOString(),
    producerCandidate,
    receiverCandidate,
    producerWorkspaceId: 'pcd-activity-radar',
    targetWorkspaceId: 'ws-sightsmash',
    sourceId: 'source-pcd-activity-radar',
    sourcePolicyVersion,
    databaseIds: {
      directory: directoryDatabaseId,
      operations: opsDatabaseId,
      target: targetDatabaseId,
    },
    sourceBookmarks: {
      directory: directoryBookmark,
      operations: opsBookmark,
    },
    sourceInventory: {
      organizations: expectedOrganizationRows,
      contacts: expectedContactRows,
      contactsWithChannel: expectedContactChannelRows,
      contactsPublicReviewed: expectedContactPublicRows,
    },
    requiredRuntime: {
      PCD_CRM_ADAPTER_ENABLED: 'true',
      PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(sourceNotBeforeMs),
      PCD_CRM_DIRECTORY_DATABASE_ID: directoryDatabaseId,
      PCD_CRM_OPS_DATABASE_ID: opsDatabaseId,
      PCD_CRM_TARGET_DATABASE_ID: targetDatabaseId,
      PCD_CRM_DIRECTORY_BOOKMARK: directoryBookmark,
      PCD_CRM_OPS_BOOKMARK: opsBookmark,
      PCD_CRM_SOURCE_POLICY_VERSION: sourcePolicyVersion,
    },
    completionContract: {
      everyOrganizationHasTerminalDisposition: true,
      everyContactHasTerminalDisposition: true,
      eligibleEventsEqualDeliveredReceipts: true,
      twoCompleteReconciliationPasses: true,
      zeroPendingOrDeadEvents: true,
      zeroReceiverFindings: true,
    },
    hardStops: [
      'This local manifest grants no remote execution authority.',
      'Abort before mutation if source counts, bookmarks, database identities, candidates, or bindings drift.',
      'Do not project a contact unless current public-professional eligibility and use restrictions allow it.',
      'Do not infer consent, copy notes, include minor or household data, or enable outbound sending.',
      'Do not report completion until every frozen row has a terminal disposition and two reconciliation passes are green.',
    ],
  };
  const contents = `${JSON.stringify(manifest, null, 2)}\n`;
  const bytes = Buffer.byteLength(contents);
  const sha256 = createHash('sha256').update(contents).digest('hex');
  await mkdir(dirname(outputFile), { recursive: true });
  await writeFile(outputFile, contents, { encoding: 'utf8', flag: 'wx' });
  return { manifest, sha256, bytes, outputFile };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseBackfillManifestArguments(process.argv.slice(2));
  const result = await buildCrmBackfillManifest({
    outputFile: resolveBackfillManifestOutput(args['--output-file']),
    sourceNotBeforeMs: args['--boundary-ms'],
    producerCandidate: args['--producer-candidate'],
    receiverCandidate: args['--receiver-candidate'],
    directoryDatabaseId: args['--directory-database-id'],
    opsDatabaseId: args['--ops-database-id'],
    targetDatabaseId: args['--target-database-id'],
    directoryBookmark: args['--directory-bookmark'],
    opsBookmark: args['--ops-bookmark'],
    sourcePolicyVersion: args['--source-policy-version'],
    expectedOrganizationRows: args['--expected-organizations'],
    expectedContactRows: args['--expected-contacts'],
    expectedContactChannelRows: args['--expected-contact-channels'],
    expectedContactPublicRows: args['--expected-public-contacts'],
  });
  process.stdout.write(`${JSON.stringify({
    outputFile: result.outputFile,
    bytes: result.bytes,
    sha256: result.sha256,
    sourceNotBeforeMs: result.manifest.sourceNotBeforeMs,
    sourceInventory: result.manifest.sourceInventory,
  }, null, 2)}\n`);
}
