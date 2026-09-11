import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  PRODUCTION_CRM_IDENTITIES,
  validateProductionCrmDisabledLiveSnapshot,
  validateProductionCrmDisabledManifest,
} from '../scripts/verify-production-crm-disabled-release.mjs';

function manifest() {
  return {
    name: 'parent-coach-desk',
    topLevelName: 'parent-coach-desk',
    configPath: 'C:/repo/wrangler.production.jsonc',
    d1_databases: [
      { binding: 'DB', database_name: 'activity-radar', database_id: String(PRODUCTION_CRM_IDENTITIES.directoryDatabaseId) },
      { binding: 'FORGE_DB', database_name: 'forge-command', database_id: String(PRODUCTION_CRM_IDENTITIES.forgeDatabaseId) },
      { binding: 'PCD_OPS_DB', database_name: 'parent-coach-desk-ops-production', database_id: String(PRODUCTION_CRM_IDENTITIES.opsDatabaseId) },
    ],
    services: [{ binding: 'CRM_ADAPTER', service: String(PRODUCTION_CRM_IDENTITIES.receiverService) }],
    triggers: { crons: ['17 */6 * * *', '* * * * *'] },
    r2_buckets: [{ binding: 'PHOTOS' }],
    kv_namespaces: [{ binding: 'SESSION' }],
    ratelimits: [
      'PUBLIC_SUBMISSION_RATE_LIMITER', 'TRUST_RATE_LIMITER', 'COMMUNITY_RATE_LIMITER',
      'DEMAND_RATE_LIMITER', 'OWNER_RATE_LIMITER', 'PUBLIC_READ_RATE_LIMITER',
    ].map((name) => ({ name })),
    assets: {
      binding: 'ASSETS',
      run_worker_first: ['/admin', '/admin/*', '/api/admin', '/api/admin/*', '/api/integrations/babylovegrowth/articles', '/sitemap-camps.xml'],
    },
    observability: { enabled: true, head_sampling_rate: 1 },
    secrets: {
      required: [
        'AGENT_RUNS_TOKEN', 'BABYLOVE_API_KEY', 'BABYLOVE_WEBHOOK_TOKEN',
        'BULK_IMPORT_TOKEN', 'CRON_KEY', 'GITHUB_TOKEN', 'PCD_CRM_ADAPTER_HMAC_SECRET',
      ],
    },
    vars: {
      SITE_URL: 'https://parentcoachdesk.com',
      ADMIN_EMAILS: 'owner@example.com',
      ACCESS_TEAM_DOMAIN: 'fieldforge.cloudflareaccess.com',
      ACCESS_AUD: 'audience',
      CAMP_CLAIMS_ENABLED: 'false', CAMP_REVIEWS_ENABLED: 'false', TRUST_INTAKE_ENABLED: 'false',
      DEMAND_TELEMETRY_ENABLED: 'false', IDEMPOTENCY_CLEANUP_ENABLED: 'false',
      PCD_CUSTOMER_FOUNDATION_ENABLED: 'false', PCD_COMMERCE_TEST_MODE_ENABLED: 'false',
      PCD_CRM_ADAPTER_ENABLED: 'false', PCD_CRM_BACKFILL_ENABLED: 'false',
      EDITORIAL_LIFECYCLE_ENABLED: 'false',
      PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
      PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
      PCD_CRM_SOURCE_ID: 'source-pcd-activity-radar',
    },
  };
}

function liveVersion(id = '11111111-1111-4111-8111-111111111111') {
  return {
    id,
    annotations: { 'workers/tag': 'crm-p17-disabled-candidate' },
    resources: {
      bindings: [
        { name: 'DB', type: 'd1', database_id: PRODUCTION_CRM_IDENTITIES.directoryDatabaseId },
        { name: 'FORGE_DB', type: 'd1', database_id: PRODUCTION_CRM_IDENTITIES.forgeDatabaseId },
        { name: 'PCD_OPS_DB', type: 'd1', database_id: PRODUCTION_CRM_IDENTITIES.opsDatabaseId },
        { name: 'CRM_ADAPTER', type: 'service', service: PRODUCTION_CRM_IDENTITIES.receiverService, environment: 'production' },
        { name: 'PCD_CRM_ADAPTER_HMAC_SECRET', type: 'secret_text' },
        { name: 'PCD_CRM_ADAPTER_ENABLED', type: 'plain_text', text: 'false' },
        { name: 'PCD_CRM_BACKFILL_ENABLED', type: 'plain_text', text: 'false' },
        { name: 'PCD_CRM_PRODUCER_WORKSPACE_ID', type: 'plain_text', text: 'pcd-activity-radar' },
        { name: 'PCD_CRM_TARGET_WORKSPACE_ID', type: 'plain_text', text: 'ws-sightsmash' },
        { name: 'PCD_CRM_SOURCE_ID', type: 'plain_text', text: 'source-pcd-activity-radar' },
      ],
    },
  };
}

function liveSnapshot(activeVersionId = '11111111-1111-4111-8111-111111111111') {
  return {
    expectedVersionId: '11111111-1111-4111-8111-111111111111',
    expectedVersionTag: 'crm-p17-disabled-candidate',
    deployments: [{
      id: '22222222-2222-4222-8222-222222222222',
      created_on: '2026-09-11T04:05:12.420Z',
      versions: [{ version_id: activeVersionId, percentage: 100 }],
    }],
    version: liveVersion(activeVersionId),
  };
}

describe('disabled production CRM producer release', () => {
  it('accepts the exact production identities with both producer modes disabled', () => {
    expect(validateProductionCrmDisabledManifest(manifest())).toEqual([]);
  });

  it.each([
    ['directory database', (value: ReturnType<typeof manifest>) => { value.d1_databases[0].database_id = '11111111-1111-4111-8111-111111111111'; }],
    ['receiver service', (value: ReturnType<typeof manifest>) => { value.services[0].service = 'field-forge-crm-staging'; }],
    ['adapter activation', (value: ReturnType<typeof manifest>) => { value.vars.PCD_CRM_ADAPTER_ENABLED = 'true'; }],
    ['backfill activation', (value: ReturnType<typeof manifest>) => { value.vars.PCD_CRM_BACKFILL_ENABLED = 'true'; }],
    ['activation boundary', (value: ReturnType<typeof manifest>) => { Object.assign(value.vars, { PCD_CRM_SOURCE_NOT_BEFORE_MS: '1780000000000' }); }],
  ])('rejects %s drift', (_label, mutate) => {
    const value = manifest();
    mutate(value);
    expect(validateProductionCrmDisabledManifest(value).length).toBeGreaterThan(0);
  });

  it('accepts only the exact uploaded version as the sole active disabled producer', () => {
    expect(validateProductionCrmDisabledLiveSnapshot(liveSnapshot())).toEqual([]);
  });

  it('rejects a follow-on active version that drops CRM_ADAPTER', () => {
    const snapshot = liveSnapshot('33333333-3333-4333-8333-333333333333');
    snapshot.version.resources.bindings = snapshot.version.resources.bindings
      .filter((binding) => binding.name !== 'CRM_ADAPTER');
    expect(validateProductionCrmDisabledLiveSnapshot(snapshot)).toEqual(expect.arrayContaining([
      expect.stringContaining('active version must equal the exact uploaded version'),
      expect.stringContaining('CRM_ADAPTER'),
    ]));
  });

  it('uses an immutable version upload, explicit promotion, and two live readbacks', async () => {
    const source = await readFile(new URL('../scripts/deploy-production-crm-disabled.ps1', import.meta.url), 'utf8');
    expect(source).toContain('versions upload');
    expect(source).toContain('--strict');
    expect(source).toContain('--tag $versionTag');
    expect(source).toContain('versions deploy');
    expect(source).toContain('Assert-LiveDisabledVersion');
    expect(source).toContain('Start-Sleep -Seconds 15');
    expect(source).not.toMatch(/\$wranglerPath deploy\s/);
  });

  it('inherits the installed adapter secret without reading or writing local secret material', async () => {
    const source = await readFile(new URL('../scripts/deploy-production-crm-disabled.ps1', import.meta.url), 'utf8');
    expect(source).toContain('--keep-vars');
    expect(source).not.toContain('SecretPackPath');
    expect(source).not.toContain('--secrets-file');
    expect(source).not.toContain('ProtectedData');
    expect(source).not.toContain('pcd-crm-production-secret-');
  });
});
