import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  parseProductionBackfillDeployArgs,
  prepareProductionBackfillDeploymentManifest,
  resolveBackfillReceiptOutput,
  validateExactActiveVersion,
  validateProductionBackfillResumeAuthorization,
  validateProductionBackfillResumeCheckpoint,
  validateReadOnlyD1Response,
  validateProductionBackfillApproval,
  validateProductionBackfillDeploymentManifest,
  validateProductionBackfillLiveSnapshot,
} from '../scripts/deploy-production-crm-backfill-verified.mjs';
import { PRODUCTION_CRM_IDENTITIES } from '../scripts/verify-production-crm-disabled-release.mjs';

const boundary = Math.floor(Date.now() / 1_000) * 1_000;
const producer = '1'.repeat(40);
const receiver = '4dd8794b8006c075bcda6905f5a4dda283a0378a';
const digest = 'a'.repeat(64);
const resumeProducer = '2'.repeat(40);
const rollbackVersionId = '44444444-4444-4444-8444-444444444444';
const runId = `pcd-backfill:${'b'.repeat(64)}`;

function approval() {
  const directory = PRODUCTION_CRM_IDENTITIES.directoryDatabaseId;
  const operations = PRODUCTION_CRM_IDENTITIES.opsDatabaseId;
  const target = '9ea593e2-b5ca-40d8-b7fa-8172e02edb3d';
  const directoryBookmark = '00000001-00000000-00000000-11111111111111111111111111111111';
  const operationsBookmark = '00000002-00000000-00000000-22222222222222222222222222222222';
  return {
    schemaVersion: 1,
    kind: 'pcd-crm-historical-backfill',
    environment: 'production',
    dataClassification: 'governed_source_projection',
    remoteExecutionAuthorized: false,
    sourceNotBeforeMs: boundary,
    sourceNotBeforeIso: new Date(boundary).toISOString(),
    producerCandidate: producer,
    receiverCandidate: receiver,
    producerWorkspaceId: 'pcd-activity-radar',
    targetWorkspaceId: 'ws-sightsmash',
    sourceId: 'source-pcd-activity-radar',
    sourcePolicyVersion: 'pcd-public-professional-v1',
    databaseIds: { directory, operations, target },
    sourceBookmarks: { directory: directoryBookmark, operations: operationsBookmark },
    sourceInventory: { organizations: 198_287, contacts: 141, contactsWithChannel: 35, contactsPublicReviewed: 0 },
    requiredRuntime: {
      PCD_CRM_ADAPTER_ENABLED: 'true', PCD_CRM_BACKFILL_ENABLED: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(boundary),
      PCD_CRM_DIRECTORY_DATABASE_ID: directory, PCD_CRM_OPS_DATABASE_ID: operations,
      PCD_CRM_TARGET_DATABASE_ID: target, PCD_CRM_DIRECTORY_BOOKMARK: directoryBookmark,
      PCD_CRM_OPS_BOOKMARK: operationsBookmark,
      PCD_CRM_SOURCE_POLICY_VERSION: 'pcd-public-professional-v1',
    },
    completionContract: {
      everyOrganizationHasTerminalDisposition: true, everyContactHasTerminalDisposition: true,
      eligibleEventsEqualDeliveredReceipts: true, twoCompleteReconciliationPasses: true,
      zeroPendingOrDeadEvents: true, zeroReceiverFindings: true,
    },
  };
}

function baseManifest() {
  return {
    name: 'parent-coach-desk', topLevelName: 'parent-coach-desk',
    configPath: 'C:/repo/wrangler.production.jsonc',
    d1_databases: [
      { binding: 'DB', database_name: 'activity-radar', database_id: String(PRODUCTION_CRM_IDENTITIES.directoryDatabaseId) },
      { binding: 'FORGE_DB', database_name: 'forge-command', database_id: String(PRODUCTION_CRM_IDENTITIES.forgeDatabaseId) },
      { binding: 'PCD_OPS_DB', database_name: 'parent-coach-desk-ops-production', database_id: String(PRODUCTION_CRM_IDENTITIES.opsDatabaseId) },
    ],
    services: [{ binding: 'CRM_ADAPTER', service: String(PRODUCTION_CRM_IDENTITIES.receiverService) }],
    triggers: { crons: ['17 */6 * * *', '* * * * *'] },
    r2_buckets: [{ binding: 'PHOTOS' }], kv_namespaces: [{ binding: 'SESSION' }],
    ratelimits: ['PUBLIC_SUBMISSION_RATE_LIMITER', 'TRUST_RATE_LIMITER', 'COMMUNITY_RATE_LIMITER', 'DEMAND_RATE_LIMITER', 'OWNER_RATE_LIMITER', 'PUBLIC_READ_RATE_LIMITER'].map((name) => ({ name })),
    assets: { binding: 'ASSETS', run_worker_first: ['/admin', '/admin/*', '/api/admin', '/api/admin/*', '/api/integrations/babylovegrowth/articles', '/sitemap-camps.xml'] },
    observability: { enabled: true, head_sampling_rate: 1 },
    secrets: { required: ['AGENT_RUNS_TOKEN', 'BABYLOVE_API_KEY', 'BABYLOVE_WEBHOOK_TOKEN', 'BULK_IMPORT_TOKEN', 'CRON_KEY', 'GITHUB_TOKEN', 'PCD_CRM_ADAPTER_HMAC_SECRET'] },
    vars: {
      SITE_URL: 'https://parentcoachdesk.com', ADMIN_EMAILS: 'owner@example.com',
      ACCESS_TEAM_DOMAIN: 'fieldforge.cloudflareaccess.com', ACCESS_AUD: 'audience',
      CAMP_CLAIMS_ENABLED: 'false', CAMP_REVIEWS_ENABLED: 'false', TRUST_INTAKE_ENABLED: 'false',
      DEMAND_TELEMETRY_ENABLED: 'false', IDEMPOTENCY_CLEANUP_ENABLED: 'false',
      PCD_CUSTOMER_FOUNDATION_ENABLED: 'false', PCD_COMMERCE_TEST_MODE_ENABLED: 'false',
      PCD_CRM_ADAPTER_ENABLED: 'false', PCD_CRM_BACKFILL_ENABLED: 'false', EDITORIAL_LIFECYCLE_ENABLED: 'false',
      PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar', PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
      PCD_CRM_SOURCE_ID: 'source-pcd-activity-radar',
    },
  };
}

function resumeAuthorization(now = Date.now()) {
  return {
    schemaVersion: 1,
    kind: 'pcd-crm-historical-backfill-resume',
    environment: 'production',
    authorizedAt: new Date(now - 60_000).toISOString(),
    expiresAt: new Date(now + 4 * 60 * 60_000).toISOString(),
    resumeProducerCandidate: resumeProducer,
    originalProducerCandidate: producer,
    receiverCandidate: receiver,
    rollbackVersionId,
    backfillManifestSha256: digest,
    runId,
    checkpoint: {
      status: 'running',
      organizationRowsSeen: 93_700,
      organizationEligible: 93_700,
      organizationRejected: 0,
      contactRowsSeen: 0,
      contactEligible: 0,
      contactRejected: 0,
      outboxTotal: 93_700,
      delivered: 45_837,
      pending: 47_863,
      dead: 0,
      organizationComplete: 0,
      contactComplete: 0,
      leaseId: null as string | null,
      reconciliationPass: 1,
      reconciliationCursorSequence: 0,
      reconciliationWindowOrdinal: 0,
      reconciliationComplete: 0,
      reconciliationFailureCount: 0,
      reconciliationHalted: 0,
    },
  };
}

function liveSnapshot(activeVersionId = '11111111-1111-4111-8111-111111111111') {
  const approved = approval();
  const expectedVersionId = '11111111-1111-4111-8111-111111111111';
  const expectedVersionTag = `crm-p17b-${digest.slice(0, 40)}`;
  return {
    expectedVersionId,
    expectedVersionTag,
    requireActive: true,
    backfillManifestSha256: digest,
    approval: approved,
    deployments: [{
      id: '22222222-2222-4222-8222-222222222222',
      created_on: '2026-09-11T05:00:00.000Z',
      versions: [{ version_id: activeVersionId, percentage: 100 }],
    }],
    version: {
      id: expectedVersionId,
      annotations: { 'workers/tag': expectedVersionTag },
      resources: {
        bindings: [
          { name: 'DB', type: 'd1', database_id: PRODUCTION_CRM_IDENTITIES.directoryDatabaseId },
          { name: 'FORGE_DB', type: 'd1', database_id: PRODUCTION_CRM_IDENTITIES.forgeDatabaseId },
          { name: 'PCD_OPS_DB', type: 'd1', database_id: PRODUCTION_CRM_IDENTITIES.opsDatabaseId },
          { name: 'CRM_ADAPTER', type: 'service', service: PRODUCTION_CRM_IDENTITIES.receiverService, environment: 'production' },
          { name: 'PCD_CRM_ADAPTER_HMAC_SECRET', type: 'secret_text' },
          ...Object.entries(approved.requiredRuntime).map(([name, text]) => ({ name, type: 'plain_text', text })),
          { name: 'PCD_CRM_BACKFILL_MANIFEST_SHA256', type: 'plain_text', text: digest },
        ],
      },
    },
  };
}

describe('production CRM historical backfill deployment guard', () => {
  it('accepts the exact production approval contract', () => {
    expect(validateProductionBackfillApproval(approval(), {
      expectedProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedManifestSha256: digest,
    })).toEqual([]);
  });

  it('permits an expired original boundary only through a fresh exact resume authorization', () => {
    const now = boundary + 24 * 60 * 60_000;
    expect(validateProductionBackfillApproval(approval(), {
      expectedProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedManifestSha256: digest,
      now,
    })).toContain('production backfill boundary is stale or malformed');
    expect(validateProductionBackfillApproval(approval(), {
      expectedProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedManifestSha256: digest,
      now,
      allowExpiredBoundary: true,
    })).toEqual([]);
    expect(validateProductionBackfillResumeAuthorization(resumeAuthorization(now), {
      now,
      expectedResumeProducerCandidate: resumeProducer,
      expectedOriginalProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedRollbackVersionId: rollbackVersionId,
      expectedManifestSha256: digest,
    })).toEqual([]);
  });

  it('rejects expired, drifting, or unsafe resume authorization', () => {
    const now = boundary + 24 * 60 * 60_000;
    const expired = resumeAuthorization(now);
    expired.expiresAt = new Date(now - 1).toISOString();
    expect(validateProductionBackfillResumeAuthorization(expired, {
      now,
      expectedResumeProducerCandidate: resumeProducer,
      expectedOriginalProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedRollbackVersionId: rollbackVersionId,
      expectedManifestSha256: digest,
    })).toContain('resume authorization has expired or is not yet active');

    const unsafe = resumeAuthorization(now);
    unsafe.checkpoint.dead = 1;
    unsafe.checkpoint.leaseId = 'active-lease';
    expect(validateProductionBackfillResumeAuthorization(unsafe, {
      now,
      expectedResumeProducerCandidate: resumeProducer,
      expectedOriginalProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedRollbackVersionId: rollbackVersionId,
      expectedManifestSha256: digest,
    })).toEqual(expect.arrayContaining([
      'resume checkpoint must have zero dead events',
      'resume checkpoint must not retain an active lease',
    ]));
  });

  it('requires mutation-free D1 transport and exact paused checkpoint parity', () => {
    const authorized = resumeAuthorization();
    const response = [{
      success: true,
      results: [{
        runId,
        status: 'running',
        producerWorkspaceId: 'pcd-activity-radar',
        targetWorkspaceId: 'ws-sightsmash',
        snapshotBeforeMs: boundary,
        approvalManifestSha256: digest,
        directoryDatabaseId: PRODUCTION_CRM_IDENTITIES.directoryDatabaseId,
        opsDatabaseId: PRODUCTION_CRM_IDENTITIES.opsDatabaseId,
        targetDatabaseId: '9ea593e2-b5ca-40d8-b7fa-8172e02edb3d',
        directoryBookmark: '00000001-00000000-00000000-11111111111111111111111111111111',
        opsBookmark: '00000002-00000000-00000000-22222222222222222222222222222222',
        sourcePolicyVersion: 'pcd-public-professional-v1',
        expectedOrganizationRows: 198_287,
        expectedContactRows: 141,
        organizationRowsSeen: 93_700,
        organizationEligible: 93_700,
        organizationRejected: 0,
        contactRowsSeen: 0,
        contactEligible: 0,
        contactRejected: 0,
        outboxTotal: 93_700,
        delivered: 45_837,
        pending: 47_863,
        dead: 0,
        organizationComplete: 0,
        contactComplete: 0,
        leaseId: null,
        reconciliationPass: 1,
        reconciliationCursorSequence: 0,
        reconciliationWindowOrdinal: 0,
        reconciliationComplete: 0,
        reconciliationFailureCount: 0,
        reconciliationHalted: 0,
      }],
      meta: { changes: 0, rows_written: 0, changed_db: false },
    }];
    expect(validateReadOnlyD1Response(response, 'checkpoint')).toHaveLength(1);
    expect(validateProductionBackfillResumeCheckpoint(
      validateReadOnlyD1Response(response, 'checkpoint')[0],
      authorized,
      approval(),
    )).toEqual([]);
    response[0].meta.changed_db = true;
    expect(() => validateReadOnlyD1Response(response, 'checkpoint')).toThrow(/changed_db=false/);
  });

  it.each([
    ['staging environment', (value: ReturnType<typeof approval>) => { value.environment = 'staging'; }],
    ['wrong target', (value: ReturnType<typeof approval>) => { value.databaseIds.target = '33333333-3333-4333-8333-333333333333'; }],
    ['stale boundary', (value: ReturnType<typeof approval>) => { value.sourceNotBeforeMs -= 901_000; }],
    ['enabled authorization bit', (value: ReturnType<typeof approval>) => { value.remoteExecutionAuthorized = true; }],
    ['runtime drift', (value: ReturnType<typeof approval>) => { value.requiredRuntime.PCD_CRM_BACKFILL_ENABLED = 'false'; }],
  ])('rejects %s', (_label, mutate) => {
    const value = approval();
    mutate(value);
    expect(validateProductionBackfillApproval(value, {
      expectedProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedManifestSha256: digest,
    }).length).toBeGreaterThan(0);
  });

  it('prepares only the frozen activation runtime and manifest digest', () => {
    const approved = approval();
    const deployed = prepareProductionBackfillDeploymentManifest(baseManifest(), approved, digest);
    expect(deployed.vars).toMatchObject({
      ...approved.requiredRuntime,
      PCD_CRM_BACKFILL_MANIFEST_SHA256: digest,
    });
    expect(validateProductionBackfillDeploymentManifest(deployed, approved, digest)).toEqual([]);
  });

  it('rejects post-preparation runtime and pilot drift', () => {
    const approved = approval();
    const deployed = prepareProductionBackfillDeploymentManifest(baseManifest(), approved, digest);
    deployed.vars.PCD_CRM_TARGET_DATABASE_ID = '33333333-3333-4333-8333-333333333333';
    Object.assign(deployed.vars, { PCD_CRM_PILOT_MODE: 'true' });
    expect(validateProductionBackfillDeploymentManifest(deployed, approved, digest)).toEqual(expect.arrayContaining([
      expect.stringMatching(/TARGET_DATABASE_ID/),
      expect.stringMatching(/PILOT_MODE/),
    ]));
  });

  it('rejects unknown and duplicate CLI arguments and keeps receipts under backups', () => {
    expect(() => parseProductionBackfillDeployArgs(['--unknown'])).toThrow(/unknown argument/);
    expect(() => parseProductionBackfillDeployArgs(['--sha', producer, '--sha', producer])).toThrow(/duplicate/);
    expect(parseProductionBackfillDeployArgs([
      '--rollback-version-id', '44444444-4444-4444-8444-444444444444',
    ])).toMatchObject({ rollbackVersionId: '44444444-4444-4444-8444-444444444444' });
    expect(resolveBackfillReceiptOutput('backups/run/receipt.json', 'C:/repo')).toBe('C:\\repo\\backups\\run\\receipt.json');
    expect(() => resolveBackfillReceiptOutput('../receipt.json', 'C:/repo')).toThrow(/beneath backups/);
  });

  it('requires the gate-frozen rollback version to be solely active', () => {
    const rollbackVersionId = '44444444-4444-4444-8444-444444444444';
    expect(validateExactActiveVersion([{
      created_on: '2026-09-11T05:00:00.000Z',
      versions: [{ version_id: rollbackVersionId, percentage: 100 }],
    }], rollbackVersionId)).toEqual([]);
    expect(validateExactActiveVersion([{
      created_on: '2026-09-11T05:00:00.000Z',
      versions: [{ version_id: '55555555-5555-4555-8555-555555555555', percentage: 100 }],
    }], rollbackVersionId)).toContain('active version must equal the exact rollback version');
  });

  it('accepts only the exact uploaded activation version as the sole active version', () => {
    expect(validateProductionBackfillLiveSnapshot(liveSnapshot())).toEqual([]);
  });

  it('rejects a follow-on active version that drops the CRM service binding', () => {
    const snapshot = liveSnapshot('33333333-3333-4333-8333-333333333333');
    snapshot.version.resources.bindings = snapshot.version.resources.bindings
      .filter((binding) => binding.name !== 'CRM_ADAPTER');
    expect(validateProductionBackfillLiveSnapshot(snapshot)).toEqual(expect.arrayContaining([
      expect.stringContaining('active version must equal the exact uploaded version'),
      expect.stringContaining('CRM_ADAPTER'),
    ]));
  });

  it('uses immutable version upload, exact promotion, and repeated live verification', async () => {
    const source = await readFile(new URL('../scripts/deploy-production-crm-backfill-verified.mjs', import.meta.url), 'utf8');
    expect(source).toContain("'versions', 'upload'");
    expect(source).toContain("'--strict'");
    expect(source).toContain("'--tag', versionTag");
    expect(source).toContain("'versions', 'deploy'");
    expect(source).toContain('validateProductionBackfillLiveSnapshot');
    expect(source).toContain('await wait(15_000)');
    expect(source).toContain("'--rollback-version-id'");
    expect(source).toContain('production backfill rollback failed');
    expect(source).not.toMatch(/'deploy', '--config'/);
  });

  it('uses a separately frozen resume gate and direct read-only D1 checkpoint commands', async () => {
    const source = await readFile(new URL('../scripts/deploy-production-crm-backfill-verified.mjs', import.meta.url), 'utf8');
    expect(source).toContain("'--resume-authorization'");
    expect(source).toContain("'--resume-authorization-sha256'");
    expect(source).toContain("'--command'");
    expect(source).not.toContain("'--file'");
    expect(source).toContain('changed_db=false');
    expect(source).toContain('crm-p17b-resume-');
  });
});
