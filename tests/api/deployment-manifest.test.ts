import { describe, expect, it } from 'vitest';
import { verifyDeploymentManifest } from '../../scripts/check-deployment-manifest.mjs';

const VALID_MANIFEST = {
  name: 'parent-coach-desk',
  topLevelName: 'parent-coach-desk',
  configPath: '/repo/wrangler.production.jsonc',
  assets: { binding: 'ASSETS', run_worker_first: ['/admin', '/admin/*', '/api/admin', '/api/admin/*', '/sitemap-camps.xml'] },
  d1_databases: [{ binding: 'DB' }, { binding: 'FORGE_DB' }, { binding: 'PCD_OPS_DB' }],
  r2_buckets: [{ binding: 'PHOTOS' }],
  kv_namespaces: [{ binding: 'SESSION' }],
  ratelimits: [
    { name: 'PUBLIC_SUBMISSION_RATE_LIMITER' },
    { name: 'TRUST_RATE_LIMITER' },
    { name: 'COMMUNITY_RATE_LIMITER' },
    { name: 'DEMAND_RATE_LIMITER' },
    { name: 'OWNER_RATE_LIMITER' },
  ],
  observability: { enabled: true, head_sampling_rate: 1 },
  secrets: { required: ['AGENT_RUNS_TOKEN', 'BULK_IMPORT_TOKEN', 'CRON_KEY', 'GITHUB_TOKEN'] },
  vars: {
    SITE_URL: 'https://parentcoachdesk.com',
    ADMIN_EMAILS: 'admin@example.com',
    ACCESS_TEAM_DOMAIN: 'example.cloudflareaccess.com',
    ACCESS_AUD: 'audience',
    CAMP_CLAIMS_ENABLED: 'false',
    CAMP_REVIEWS_ENABLED: 'false',
    TRUST_INTAKE_ENABLED: 'false',
    DEMAND_TELEMETRY_ENABLED: 'false',
    IDEMPOTENCY_CLEANUP_ENABLED: 'false',
    PCD_CUSTOMER_FOUNDATION_ENABLED: 'false',
    PCD_COMMERCE_TEST_MODE_ENABLED: 'false',
    EDITORIAL_LIFECYCLE_ENABLED: 'false',
  },
};

describe('production deployment manifest contract', () => {
  it('accepts the complete safe production contract', () => {
    expect(verifyDeploymentManifest(VALID_MANIFEST)).toEqual([]);
  });

  it('rejects staging identity, missing controls, and enabled pre-release features', () => {
    const unsafe = structuredClone(VALID_MANIFEST) as typeof VALID_MANIFEST & {
      vars: Record<string, string>;
    };
    unsafe.name = 'parent-coach-desk-staging';
    unsafe.configPath = '/repo/wrangler.jsonc';
    unsafe.ratelimits = [];
    unsafe.assets.run_worker_first = [];
    unsafe.observability.enabled = false;
    unsafe.secrets.required = ['AGENT_RUNS_TOKEN'];
    unsafe.vars.CAMP_CLAIMS_ENABLED = 'true';
    unsafe.vars.PCD_CUSTOMER_FOUNDATION_ENABLED = 'true';
    unsafe.vars.PCD_COMMERCE_TEST_MODE_ENABLED = 'true';
    const failures = verifyDeploymentManifest(unsafe);
    expect(failures).toEqual(expect.arrayContaining([
      expect.stringContaining('Worker name'),
      expect.stringContaining('config path'),
      expect.stringContaining('rate-limit bindings'),
      expect.stringContaining('required Worker-first routes'),
      expect.stringContaining('observability enabled'),
      expect.stringContaining('required production secret names'),
      expect.stringContaining('CAMP_CLAIMS_ENABLED'),
      expect.stringContaining('PCD_CUSTOMER_FOUNDATION_ENABLED'),
      expect.stringContaining('PCD_COMMERCE_TEST_MODE_ENABLED'),
    ]));
  });

  it('rejects inherited WorkOS configuration and injected proof routes', () => {
    const unsafe = structuredClone(VALID_MANIFEST) as typeof VALID_MANIFEST & {
      vars: Record<string, string>;
    };
    unsafe.vars.PCD_OWNER_AUTH_PROOF_ENABLED = 'true';
    unsafe.vars.WORKOS_CLIENT_ID = 'redacted';
    const entry = '{"route": "/owner-proof/login"}';
    const failures = verifyDeploymentManifest(unsafe, entry);
    expect(failures).toEqual(expect.arrayContaining([
      expect.stringContaining('PCD_OWNER_AUTH_PROOF_ENABLED'),
      expect.stringContaining('WORKOS_CLIENT_ID'),
      expect.stringContaining('/owner-proof/login'),
    ]));
  });
});
