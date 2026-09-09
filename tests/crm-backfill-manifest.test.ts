import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildCrmBackfillManifest,
  parseBackfillManifestArguments,
  parseBackfillManifestBoundary,
  resolveBackfillManifestOutput,
} from '../scripts/build-crm-backfill-manifest.mjs';

const roots: string[] = [];
const boundaryMs = Math.floor(Date.now() / 1_000) * 1_000;

function input(outputFile: string) {
  return {
    outputFile,
    environment: 'production',
    sourceNotBeforeMs: boundaryMs,
    producerCandidate: '1'.repeat(40),
    receiverCandidate: '2'.repeat(40),
    directoryDatabaseId: '11111111-1111-4111-8111-111111111111',
    opsDatabaseId: '22222222-2222-4222-8222-222222222222',
    targetDatabaseId: '33333333-3333-4333-8333-333333333333',
    directoryBookmark: '00000001-00000000-00000000-11111111111111111111111111111111',
    opsBookmark: '00000002-00000000-00000000-22222222222222222222222222222222',
    sourcePolicyVersion: 'pcd-public-professional-v1',
    expectedOrganizationRows: 198_287,
    expectedContactRows: 141,
    expectedContactChannelRows: 35,
    expectedContactPublicRows: 0,
  };
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe('CRM historical backfill manifest', () => {
  it('requires a fresh positive second-aligned boundary', () => {
    for (const value of [undefined, '', '0', '1001', 'not-a-number', String(boundaryMs - 901_000)]) {
      expect(() => parseBackfillManifestBoundary(value)).toThrow(/boundary/i);
    }
    expect(parseBackfillManifestBoundary(String(boundaryMs))).toBe(boundaryMs);
  });

  it('rejects unknown, duplicate, and valueless CLI flags', () => {
    expect(() => parseBackfillManifestArguments(['--unknown', 'value'])).toThrow('unknown_argument:--unknown');
    expect(() => parseBackfillManifestArguments([
      '--boundary-ms', String(boundaryMs), '--boundary-ms', String(boundaryMs),
    ])).toThrow('duplicate_argument:--boundary-ms');
    expect(() => parseBackfillManifestArguments(['--boundary-ms'])).toThrow('missing_value:--boundary-ms');
  });

  it('keeps CLI output beneath the ignored backups directory', () => {
    const root = join(tmpdir(), 'crm-manifest-root');
    expect(resolveBackfillManifestOutput('backups/run/manifest.json', root))
      .toBe(join(root, 'backups', 'run', 'manifest.json'));
    expect(() => resolveBackfillManifestOutput('../manifest.json', root))
      .toThrow('crm_backfill_output_must_be_under_backups');
    expect(() => resolveBackfillManifestOutput(join(root, 'outside.json'), root))
      .toThrow('crm_backfill_output_must_be_under_backups');
  });

  it('writes a deterministic, exact-identity manifest and refuses overwrite', async () => {
    const root = await mkdtemp(join(tmpdir(), 'crm-backfill-manifest-'));
    roots.push(root);
    const outputFile = join(root, 'manifest.json');
    const result = await buildCrmBackfillManifest(input(outputFile));
    const bytes = await readFile(outputFile);

    expect(result.manifest).toMatchObject({
      schemaVersion: 1,
      kind: 'pcd-crm-historical-backfill',
      environment: 'production',
      dataClassification: 'governed_source_projection',
      remoteExecutionAuthorized: false,
      sourceNotBeforeMs: boundaryMs,
      producerWorkspaceId: 'pcd-activity-radar',
      targetWorkspaceId: 'ws-sightsmash',
      sourceId: 'source-pcd-activity-radar',
      sourceInventory: {
        organizations: 198_287,
        contacts: 141,
        contactsWithChannel: 35,
        contactsPublicReviewed: 0,
      },
    });
    expect(result.manifest.completionContract).toEqual({
      everyOrganizationHasTerminalDisposition: true,
      everyContactHasTerminalDisposition: true,
      eligibleEventsEqualDeliveredReceipts: true,
      twoCompleteReconciliationPasses: true,
      zeroPendingOrDeadEvents: true,
      zeroReceiverFindings: true,
    });
    expect(result.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
    expect(bytes.toString('utf8')).toBe(`${JSON.stringify(result.manifest, null, 2)}\n`);
    await expect(buildCrmBackfillManifest(input(outputFile))).rejects.toMatchObject({ code: 'EEXIST' });
  });

  it('rejects malformed identities and inconsistent inventories before writing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'crm-backfill-manifest-invalid-'));
    roots.push(root);
    const outputFile = join(root, 'manifest.json');

    await expect(buildCrmBackfillManifest({
      ...input(outputFile),
      directoryDatabaseId: 'not-a-database',
    })).rejects.toThrow('crm_backfill_directory_database_id_invalid');
    await expect(buildCrmBackfillManifest({
      ...input(outputFile),
      expectedContactChannelRows: 142,
    })).rejects.toThrow('crm_backfill_contact_inventory_invalid');
    await expect(buildCrmBackfillManifest({
      ...input(outputFile),
      sourcePolicyVersion: 'policy with spaces',
    })).rejects.toThrow('crm_backfill_source_policy_version_invalid');
    await expect(buildCrmBackfillManifest({
      ...input(outputFile),
      environment: 'preview',
    })).rejects.toThrow('crm_backfill_environment_invalid');
  });
});
