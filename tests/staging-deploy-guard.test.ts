import { describe, expect, it } from 'vitest';
import type { PathLike } from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import {
  deployStagingManifest,
  parseDeploymentArguments,
  prepareStagingDeploymentManifest,
  validateStagingDeploymentManifest,
} from '../scripts/deploy-staging-verified.mjs';

const valid = {
  configPath: 'C:/workspace/wrangler.jsonc',
  topLevelName: 'parent-coach-desk-staging',
  name: 'parent-coach-desk-staging',
  vars: {
    SITE_URL: 'https://parent-coach-desk-staging.eepskalla.workers.dev',
    CAMP_CLAIMS_ENABLED: 'false', CAMP_REVIEWS_ENABLED: 'false', TRUST_INTAKE_ENABLED: 'false',
    DEMAND_TELEMETRY_ENABLED: 'false', IDEMPOTENCY_CLEANUP_ENABLED: 'false',
    PCD_CUSTOMER_FOUNDATION_ENABLED: 'false', PCD_COMMERCE_TEST_MODE_ENABLED: 'false',
    PCD_CRM_ADAPTER_ENABLED: 'false', PCD_CRM_BACKFILL_ENABLED: 'false',
    PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
    PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
    PCD_CRM_SOURCE_ID: 'source-pcd-activity-radar',
  },
  d1_databases: [
    { binding: 'DB', database_name: 'parent-coach-desk-directory-staging', database_id: '6aa26d4d-d545-4eb7-bf50-34d45f2182ad' },
    { binding: 'PCD_OPS_DB', database_name: 'parent-coach-desk-ops-staging', database_id: '7f0da00d-bc98-464f-8702-ce0fb381dd5e' },
  ],
  r2_buckets: [{ binding: 'PHOTOS', bucket_name: 'parent-coach-desk-staging-photos' }],
  kv_namespaces: [{ binding: 'SESSION', id: '59cbf275ba16459c8f76ff39b033f748' }],
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
      'D1 binding DB must target the approved staging database identity',
      'R2 binding PHOTOS must target the approved staging bucket',
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
      'CRM_ADAPTER must use the exact approved staging service binding',
      'PCD_CRM_ADAPTER_ENABLED must remain false unless an exact activation boundary is supplied',
      'PCD_CRM_SOURCE_ID must equal source-pcd-activity-radar',
      'missing required staging secret declaration: PCD_CRM_ADAPTER_HMAC_SECRET',
    ]));
  });

  it('accepts a pilot activation only when its exact second-aligned boundary is supplied', () => {
    const activation = structuredClone(valid) as any;
    activation.vars.PCD_CRM_ADAPTER_ENABLED = 'true';
    activation.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS = '1788566400000';

    expect(validateStagingDeploymentManifest(activation, {
      expectedCrmSourceNotBeforeMs: '1788566400000',
    })).toEqual([]);
    expect(validateStagingDeploymentManifest(activation)).toContain(
      'PCD_CRM_ADAPTER_ENABLED must remain false unless an exact activation boundary is supplied',
    );
    expect(validateStagingDeploymentManifest(activation, {
      expectedCrmSourceNotBeforeMs: '1788566401000',
    })).toContain('PCD_CRM_SOURCE_NOT_BEFORE_MS does not match the approved activation boundary');
  });

  it('derives the approved pilot manifest without mutating the committed disabled manifest', () => {
    const activation = prepareStagingDeploymentManifest(valid, '1788566400000');

    expect(valid.vars.PCD_CRM_ADAPTER_ENABLED).toBe('false');
    expect(valid.vars).not.toHaveProperty('PCD_CRM_SOURCE_NOT_BEFORE_MS');
    expect(activation.vars.PCD_CRM_ADAPTER_ENABLED).toBe('true');
    expect(activation.vars.PCD_CRM_BACKFILL_ENABLED).toBe('false');
    expect(activation.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS).toBe('1788566400000');
    expect(validateStagingDeploymentManifest(activation, {
      expectedCrmSourceNotBeforeMs: '1788566400000',
    })).toEqual([]);
  });

  it('rejects missing, malformed, sub-second, stale disabled, and historical-backfill activation state', () => {
    const activation = structuredClone(valid) as any;
    activation.vars.PCD_CRM_ADAPTER_ENABLED = 'true';

    expect(validateStagingDeploymentManifest(activation, {
      expectedCrmSourceNotBeforeMs: '1788566400000',
    })).toContain('PCD_CRM_SOURCE_NOT_BEFORE_MS does not match the approved activation boundary');

    activation.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS = '1788566400001';
    expect(validateStagingDeploymentManifest(activation, {
      expectedCrmSourceNotBeforeMs: '1788566400001',
    })).toContain('PCD_CRM_SOURCE_NOT_BEFORE_MS must be a positive second-aligned Unix millisecond value');

    activation.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS = 'not-a-timestamp';
    expect(validateStagingDeploymentManifest(activation, {
      expectedCrmSourceNotBeforeMs: 'not-a-timestamp',
    })).toContain('PCD_CRM_SOURCE_NOT_BEFORE_MS must be a positive second-aligned Unix millisecond value');

    const disabledWithBoundary = structuredClone(valid) as any;
    disabledWithBoundary.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS = '1788566400000';
    expect(validateStagingDeploymentManifest(disabledWithBoundary)).toContain(
      'PCD_CRM_SOURCE_NOT_BEFORE_MS must be absent while the CRM adapter is disabled',
    );
    disabledWithBoundary.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS = '';
    expect(validateStagingDeploymentManifest(disabledWithBoundary)).toContain(
      'PCD_CRM_SOURCE_NOT_BEFORE_MS must be absent while the CRM adapter is disabled',
    );

    activation.vars.PCD_CRM_SOURCE_NOT_BEFORE_MS = '1788566400000';
    activation.vars.PCD_CRM_BACKFILL_ENABLED = 'true';
    expect(validateStagingDeploymentManifest(activation, {
      expectedCrmSourceNotBeforeMs: '1788566400000',
    })).toContain('PCD_CRM_BACKFILL_ENABLED must remain false for staging deployment');
  });

  it('rejects extra resources and wrong staging D1 identities', () => {
    const contaminated = structuredClone(valid) as any;
    contaminated.d1_databases.push({
      binding: 'PRODUCTION_DB', database_name: 'unreviewed-production-d1', database_id: 'production-id',
    });
    contaminated.r2_buckets.push({ binding: 'PRODUCTION_FILES', bucket_name: 'unreviewed-production-r2' });
    contaminated.services.push({ binding: 'PRODUCTION_PROVIDER', service: 'production-provider' });
    contaminated.kv_namespaces.push({ binding: 'PRODUCTION_SESSION', id: 'production-kv-id' });

    expect(validateStagingDeploymentManifest(contaminated)).toEqual(expect.arrayContaining([
      'staging deployment must contain exactly the approved D1 bindings',
      'staging deployment must contain exactly the approved R2 bindings',
      'staging deployment must contain exactly the approved service bindings',
      'staging deployment must contain exactly the approved KV bindings',
    ]));

    const wrongIds = structuredClone(valid) as any;
    wrongIds.d1_databases[0].database_id = 'production-id';
    expect(validateStagingDeploymentManifest(wrongIds)).toContain(
      'D1 binding DB must target the approved staging database identity',
    );

    const namedEntrypoint = structuredClone(valid) as any;
    namedEntrypoint.services[0].entrypoint = 'UnexpectedEntrypoint';
    expect(validateStagingDeploymentManifest(namedEntrypoint)).toContain(
      'CRM_ADAPTER must use the exact approved staging service binding',
    );
  });

  it('rejects duplicate, unknown, and ambiguous deployment arguments', () => {
    expect(() => parseDeploymentArguments([
      '--crm-activation-boundary-ms', '1788566400000',
      '--crm-activation-boundary-ms', '1788566401000',
      '--confirm-crm-activation',
    ])).toThrow('duplicate deployment argument: --crm-activation-boundary-ms');
    expect(() => parseDeploymentArguments([
      '--crm-activation-boundary-ms', '1788566400000', '--unexpected', '--confirm-crm-activation',
    ])).toThrow('unknown deployment argument: --unexpected');
    expect(() => parseDeploymentArguments(['--confirm', '--confirm-crm-activation']))
      .toThrow('choose one staging deployment confirmation mode');
    expect(() => parseDeploymentArguments([
      '--confirm', '--crm-activation-boundary-ms', '1788566400000',
    ])).toThrow('--confirm cannot be combined with --crm-activation-boundary-ms');
    expect(() => parseDeploymentArguments([
      '--crm-activation-boundary-ms', '1788566400001', '--confirm-crm-activation',
    ])).toThrow('activation boundary must be a positive second-aligned Unix millisecond value');
  });

  it('deploys the derived activation config and always removes its owned temporary file', async () => {
    const activation = prepareStagingDeploymentManifest(valid, '1788566400000');
    const calls: string[] = [];
    let deployedArgs: string[] = [];
    let written = '';
    const openConfig = async (path: PathLike, flags?: string | number) => {
      calls.push(`open:${String(path)}:${flags}`);
      return {
        writeFile: async (value: string) => { written = value; calls.push('write'); },
        close: async () => { calls.push('close'); },
      } as unknown as FileHandle;
    };
    const unlinkConfig = async (path: PathLike) => { calls.push(`unlink:${String(path)}`); };

    await deployStagingManifest({
      manifest: activation,
      projectRoot: 'C:/workspace',
      expectedCrmSourceNotBeforeMs: '1788566400000',
      npmCli: 'npm-cli.js',
      openConfig,
      unlinkConfig,
      runCommand: (_command: string, args: string[]) => { deployedArgs = args; },
    });

    const configIndex = deployedArgs.indexOf('--config');
    expect(configIndex).toBeGreaterThan(-1);
    expect(deployedArgs[configIndex + 1]).toContain('.wrangler.crm-activation-');
    expect(JSON.parse(written).vars.PCD_CRM_ADAPTER_ENABLED).toBe('true');
    expect(calls).toEqual(expect.arrayContaining(['write', 'close']));
    expect(calls.at(-1)).toContain('unlink:');
  });

  it('removes the activation config after deploy or post-open write failure', async () => {
    const activation = prepareStagingDeploymentManifest(valid, '1788566400000');
    const removedAfterDeploy: string[] = [];
    await expect(deployStagingManifest({
      manifest: activation,
      projectRoot: 'C:/workspace',
      expectedCrmSourceNotBeforeMs: '1788566400000',
      npmCli: 'npm-cli.js',
      openConfig: async () => ({ writeFile: async () => {}, close: async () => {} } as unknown as FileHandle),
      unlinkConfig: async (path: PathLike) => { removedAfterDeploy.push(String(path)); },
      runCommand: () => { throw new Error('deploy failed'); },
    })).rejects.toThrow('deploy failed');
    expect(removedAfterDeploy).toHaveLength(1);

    const calls: string[] = [];
    await expect(deployStagingManifest({
      manifest: activation,
      projectRoot: 'C:/workspace',
      expectedCrmSourceNotBeforeMs: '1788566400000',
      npmCli: 'npm-cli.js',
      openConfig: async () => ({
        writeFile: async () => { throw new Error('disk full'); },
        close: async () => { calls.push('close'); },
      } as unknown as FileHandle),
      unlinkConfig: async () => { calls.push('unlink'); },
      runCommand: () => { calls.push('deploy'); },
    })).rejects.toThrow('disk full');
    expect(calls).toEqual(['close', 'unlink']);
  });
});
