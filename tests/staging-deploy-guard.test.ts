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
    PCD_CRM_ADAPTER_ENABLED: 'false',
    PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
    PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
    PCD_CRM_SOURCE_ID: 'source-pcd-activity-radar',
  },
  d1_databases: [
    { database_name: 'parent-coach-desk-directory-staging' },
    { database_name: 'parent-coach-desk-ops-staging' },
  ],
  r2_buckets: [{ bucket_name: 'parent-coach-desk-staging-photos' }],
  services: [{ binding: 'CRM_ADAPTER', service: 'field-forge-crm-staging' }],
  secrets: { required: ['PCD_CRM_ADAPTER_HMAC_SECRET'] },
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

  it('fails closed when the CRM staging binding, disabled gate, identifiers, or secret name drift', () => {
    const incomplete = structuredClone(valid) as any;
    incomplete.services[0].service = 'field-forge-organization-crm';
    incomplete.vars.PCD_CRM_ADAPTER_ENABLED = 'true';
    delete incomplete.vars.PCD_CRM_SOURCE_ID;
    incomplete.secrets.required = [];

    expect(validateStagingDeploymentManifest(incomplete)).toEqual(expect.arrayContaining([
      'CRM_ADAPTER must target field-forge-crm-staging',
      'PCD_CRM_ADAPTER_ENABLED must remain false for staging deployment',
      'PCD_CRM_SOURCE_ID must equal source-pcd-activity-radar',
      'missing required staging secret declaration: PCD_CRM_ADAPTER_HMAC_SECRET',
    ]));
  });
});
