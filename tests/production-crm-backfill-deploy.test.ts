import { describe, expect, it } from 'vitest';
import {
  parseProductionBackfillDeployArgs,
  prepareProductionBackfillDeploymentManifest,
  resolveBackfillReceiptOutput,
  validateProductionBackfillApproval,
  validateProductionBackfillDeploymentManifest,
} from '../scripts/deploy-production-crm-backfill-verified.mjs';
import { PRODUCTION_CRM_IDENTITIES } from '../scripts/verify-production-crm-disabled-release.mjs';

const boundary = Math.floor(Date.now() / 1_000) * 1_000;
const producer = '1'.repeat(40);
const receiver = '4dd8794b8006c075bcda6905f5a4dda283a0378a';
const digest = 'a'.repeat(64);

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

describe('production CRM historical backfill deployment guard', () => {
  it('accepts the exact production approval contract', () => {
    expect(validateProductionBackfillApproval(approval(), {
      expectedProducerCandidate: producer,
      expectedReceiverCandidate: receiver,
      expectedManifestSha256: digest,
    })).toEqual([]);
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
    expect(resolveBackfillReceiptOutput('backups/run/receipt.json', 'C:/repo')).toBe('C:\\repo\\backups\\run\\receipt.json');
    expect(() => resolveBackfillReceiptOutput('../receipt.json', 'C:/repo')).toThrow(/beneath backups/);
  });
});
