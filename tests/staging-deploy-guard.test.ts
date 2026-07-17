import { describe, expect, it } from 'vitest';
import { validateStagingDeploymentManifest } from '../scripts/deploy-staging-verified.mjs';

const valid = {
  configPath: 'C:/workspace/wrangler.jsonc',
  topLevelName: 'parent-coach-desk-staging',
  name: 'parent-coach-desk-staging',
  vars: {
    SITE_URL: 'https://parent-coach-desk-staging.eepskalla.workers.dev',
    CAMP_CLAIMS_ENABLED: 'false', CAMP_REVIEWS_ENABLED: 'false', TRUST_INTAKE_ENABLED: 'false',
    DEMAND_TELEMETRY_ENABLED: 'false', IDEMPOTENCY_CLEANUP_ENABLED: 'false',
    PCD_CUSTOMER_FOUNDATION_ENABLED: 'false', PCD_COMMERCE_TEST_MODE_ENABLED: 'false',
  },
  d1_databases: [
    { database_name: 'parent-coach-desk-directory-staging' },
    { database_name: 'parent-coach-desk-ops-staging' },
  ],
  r2_buckets: [{ bucket_name: 'parent-coach-desk-staging-photos' }],
};

describe('verified staging deployment guard', () => {
  it('accepts only the isolated staging manifest with safe feature defaults', () => {
    expect(validateStagingDeploymentManifest(valid)).toEqual([]);
  });

  it('rejects a production-derived generated manifest before deploy', () => {
    const production = structuredClone(valid) as any;
    production.configPath = 'C:/workspace/wrangler.production.jsonc';
    production.topLevelName = 'parent-coach-desk';
    production.name = 'parent-coach-desk';
    production.vars.SITE_URL = 'https://parentcoachdesk.com';
    production.d1_databases[0].database_name = 'activity-radar';
    production.r2_buckets[0].bucket_name = 'activityradar-photos';
    production.vars.TRUST_INTAKE_ENABLED = 'true';
    expect(validateStagingDeploymentManifest(production)).toEqual(expect.arrayContaining([
      'generated manifest is not sourced from the root staging wrangler.jsonc',
      'generated manifest does not name the isolated staging Worker',
      'generated manifest does not use the isolated staging origin',
      'TRUST_INTAKE_ENABLED must remain false for staging deployment',
      'production D1 binding is forbidden in staging deploy: activity-radar',
      'production R2 binding is forbidden in staging deploy',
    ]));
  });

  it('requires the exact staging configuration when a deployment root is known', () => {
    expect(validateStagingDeploymentManifest(valid, {
      expectedConfigPath: 'C:/workspace/wrangler.jsonc',
    })).toEqual([]);
    expect(validateStagingDeploymentManifest({ ...valid, configPath: 'C:/other/wrangler.jsonc' }, {
      expectedConfigPath: 'C:/workspace/wrangler.jsonc',
    })).toContain('generated manifest is not sourced from the exact root staging wrangler.jsonc');
  });
});
