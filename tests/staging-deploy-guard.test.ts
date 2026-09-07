import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import type { PathLike } from 'node:fs';
import type { FileHandle } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  buildAndVerifyStagingManifest,
  deployStagingManifest,
  hashBuildArtifact,
  parseDeploymentArguments,
  prepareStagingDeploymentManifest,
  readAndVerifyPrebuiltStagingManifest,
  readStagingDirectorySchema,
  validateCrmDirectorySchemaReadback,
  validatePostBuildStatus,
  validateStagingDeploymentManifest,
  verifyCleanCheckout,
} from '../scripts/deploy-staging-verified.mjs';

const schemaProcess = vi.hoisted(() => ({ readback: null as unknown }));
vi.mock('node:child_process', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:child_process')>();
  return {
    ...actual,
    spawnSync: (command: string, args?: readonly string[], options?: unknown) => {
      if (args?.includes('wrangler') && args.includes('d1') && args.includes('execute')) {
        return { status: 0, stdout: JSON.stringify(schemaProcess.readback), stderr: '' };
      }
      return actual.spawnSync(command, args, options as any);
    },
  };
});

const actionBoundary = String(Math.floor(Date.now() / 1_000) * 1_000);
const approvedSourceSha = 'abd0bea53554a3c832fddd0fb101d00602662491';
const approvedBuildArtifactSha256 = 'a'.repeat(64);
const requiredCrmDirectoryColumns = [
  'id', 'name', 'organization_type', 'website_url', 'city', 'state', 'zip', 'categories',
  'record_status', 'is_claimed', 'content_hash', 'deleted_at', 'updated_at',
  'crm_projection_revision',
];
const revisionTableSql = `CREATE TABLE crm_organization_projection_revisions (
  singleton INTEGER PRIMARY KEY CHECK(singleton=1),
  next_revision INTEGER NOT NULL CHECK(next_revision > 0)
)`;
const projectionIndexSql = `CREATE INDEX idx_organizations_crm_projection_revision
  ON organizations(crm_projection_revision) WHERE crm_projection_revision > 0`;
const projectionInsertTriggerSql = `CREATE TRIGGER crm_organization_projection_insert
AFTER INSERT ON organizations
BEGIN
  UPDATE crm_organization_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
  UPDATE organizations SET crm_projection_revision=(
    SELECT next_revision-1 FROM crm_organization_projection_revisions WHERE singleton=1
  ) WHERE id=NEW.id;
END`;
const projectionUpdateTriggerSql = `CREATE TRIGGER crm_organization_projection_update
AFTER UPDATE OF name,organization_type,website_url,city,state,zip,categories,
  record_status,is_claimed,deleted_at ON organizations
WHEN NEW.name IS NOT OLD.name
  OR NEW.organization_type IS NOT OLD.organization_type
  OR NEW.website_url IS NOT OLD.website_url
  OR NEW.city IS NOT OLD.city
  OR NEW.state IS NOT OLD.state
  OR NEW.zip IS NOT OLD.zip
  OR NEW.categories IS NOT OLD.categories
  OR NEW.record_status IS NOT OLD.record_status
  OR NEW.is_claimed IS NOT OLD.is_claimed
  OR NEW.deleted_at IS NOT OLD.deleted_at
BEGIN
  UPDATE crm_organization_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
  UPDATE organizations SET crm_projection_revision=(
    SELECT next_revision-1 FROM crm_organization_projection_revisions WHERE singleton=1
  ) WHERE id=NEW.id;
END`;
const requiredCrmDirectoryObjects = [
  { type: 'table', name: 'crm_organization_projection_revisions', tbl_name: 'crm_organization_projection_revisions', sql: revisionTableSql },
  { type: 'index', name: 'idx_organizations_crm_projection_revision', tbl_name: 'organizations', sql: projectionIndexSql },
  { type: 'trigger', name: 'crm_organization_projection_insert', tbl_name: 'organizations', sql: projectionInsertTriggerSql },
  { type: 'trigger', name: 'crm_organization_projection_update', tbl_name: 'organizations', sql: projectionUpdateTriggerSql },
];
const compatibleCrmDirectorySchema = [
  { success: true, results: requiredCrmDirectoryColumns.map((name) => ({ name })) },
  { success: true, results: requiredCrmDirectoryObjects },
];
let cleanRepoRoot = '';
let cleanRepoSha = '';
let cleanManifest: typeof valid;
let exactSource: { expectedSourceSha: string };

afterEach(() => {
  vi.restoreAllMocks();
  schemaProcess.readback = compatibleCrmDirectorySchema;
});

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

beforeAll(() => {
  cleanRepoRoot = mkdtempSync(join(tmpdir(), 'pcd-deploy-guard-'));
  writeFileSync(join(cleanRepoRoot, 'wrangler.jsonc'), '{}\n');
  writeFileSync(join(cleanRepoRoot, '.gitignore'), 'dist/\n');
  execFileSync('git', ['init', '--quiet'], { cwd: cleanRepoRoot });
  execFileSync('git', ['config', 'user.email', 'deploy-guard@example.invalid'], { cwd: cleanRepoRoot });
  execFileSync('git', ['config', 'user.name', 'Deploy Guard Test'], { cwd: cleanRepoRoot });
  execFileSync('git', ['add', '--', '.gitignore', 'wrangler.jsonc'], { cwd: cleanRepoRoot });
  execFileSync('git', ['commit', '--quiet', '-m', 'fixture'], { cwd: cleanRepoRoot });
  cleanRepoSha = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: cleanRepoRoot,
    encoding: 'utf8',
  }).trim();
  mkdirSync(join(cleanRepoRoot, 'dist', 'client'), { recursive: true });
  mkdirSync(join(cleanRepoRoot, 'dist', 'server'), { recursive: true });
  writeFileSync(join(cleanRepoRoot, 'dist', 'client', 'build-info.json'), JSON.stringify({
    schemaVersion: 1,
    commit: cleanRepoSha,
  }));
  cleanManifest = { ...structuredClone(valid), configPath: join(cleanRepoRoot, 'wrangler.jsonc') };
  writeFileSync(join(cleanRepoRoot, 'dist', 'server', 'wrangler.json'), JSON.stringify(cleanManifest));
  writeFileSync(join(cleanRepoRoot, 'dist', 'server', 'entry.mjs'), 'export default {}\n');
  exactSource = { expectedSourceSha: cleanRepoSha };
  schemaProcess.readback = compatibleCrmDirectorySchema;
});

afterAll(() => {
  rmSync(cleanRepoRoot, { recursive: true, force: true });
});

describe('verified staging deployment guard', () => {
  it('fails closed when the staging directory lacks the deleted_at tombstone contract', () => {
    const missingDeletedAt = structuredClone(compatibleCrmDirectorySchema);
    missingDeletedAt[0]!.results = missingDeletedAt[0]!.results.filter(({ name }) => name !== 'deleted_at');

    expect(validateCrmDirectorySchemaReadback(missingDeletedAt)).toContain(
      'organizations.deleted_at is missing',
    );
    expect(validateCrmDirectorySchemaReadback(compatibleCrmDirectorySchema)).toEqual([]);
  });

  it('rejects name-only decoy projection objects and an incomplete revision control table', () => {
    const decoy = structuredClone(compatibleCrmDirectorySchema);
    decoy[1]!.results = decoy[1]!.results.map((row) => {
      if (row.name === 'crm_organization_projection_revisions') {
        return { ...row, sql: 'CREATE TABLE crm_organization_projection_revisions (singleton INTEGER PRIMARY KEY)' };
      }
      return row.name === 'idx_organizations_crm_projection_revision'
        ? { ...row, tbl_name: 'decoy_organizations' }
        : row;
    });

    expect(validateCrmDirectorySchemaReadback(decoy)).toEqual(expect.arrayContaining([
      'table crm_organization_projection_revisions definition is incompatible',
      'index idx_organizations_crm_projection_revision does not belong to organizations',
    ]));
  });

  it('rejects partial or comment-spoofed projection trigger definitions', () => {
    const spoofed = structuredClone(compatibleCrmDirectorySchema);
    spoofed[1]!.results = spoofed[1]!.results.map((row) => {
      if (row.name === 'crm_organization_projection_insert') {
        return { ...row, sql: `CREATE TRIGGER crm_organization_projection_insert
          AFTER INSERT ON organizations BEGIN SELECT 1;
          /* UPDATE crm_organization_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
             UPDATE organizations SET crm_projection_revision=0 WHERE id=NEW.id; */ END` };
      }
      if (row.name === 'crm_organization_projection_update') {
        return { ...row, sql: `CREATE TRIGGER crm_organization_projection_update
          AFTER UPDATE OF deleted_at ON organizations BEGIN
          UPDATE crm_organization_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
          UPDATE organizations SET crm_projection_revision=0 WHERE id=NEW.id; END` };
      }
      return row;
    });

    expect(validateCrmDirectorySchemaReadback(spoofed)).toEqual(expect.arrayContaining([
      'trigger crm_organization_projection_insert definition is incompatible',
      'trigger crm_organization_projection_update definition is incompatible',
    ]));
  });

  it('refuses CRM activation before creating a config when directory schema is incompatible', async () => {
    const missingDeletedAt = structuredClone(compatibleCrmDirectorySchema);
    missingDeletedAt[0]!.results = missingDeletedAt[0]!.results.filter(({ name }) => name !== 'deleted_at');
    const opened: string[] = [];
    const deployed: string[] = [];
    schemaProcess.readback = missingDeletedAt;

    await expect(deployStagingManifest({
      manifest: prepareStagingDeploymentManifest(cleanManifest, actionBoundary),
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedCrmSourceNotBeforeMs: actionBoundary,
      npmCli: 'npm-cli.js',
      openConfig: async (path: PathLike) => {
        opened.push(String(path));
        return { writeFile: async () => {}, close: async () => {} } as unknown as FileHandle;
      },
      runCommand: () => { deployed.push('deploy'); },
    })).rejects.toThrow('organizations.deleted_at is missing');
    expect(opened).toEqual([]);
    expect(deployed).toEqual([]);
  });

  it('reads only schema metadata from the exact staging directory database', () => {
    let command = '';
    let args: string[] = [];
    const result = readStagingDirectorySchema({
      projectRoot: 'C:/workspace',
      npmCli: 'npm-cli.js',
      spawn: (nextCommand: string, nextArgs: string[]) => {
        command = nextCommand;
        args = nextArgs;
        return { status: 0, stdout: JSON.stringify(compatibleCrmDirectorySchema), stderr: '' };
      },
    } as any);

    expect(result).toEqual(compatibleCrmDirectorySchema);
    expect(command).toBe(process.execPath);
    expect(args).toEqual(expect.arrayContaining([
      'npm-cli.js', 'exec', '--', 'wrangler', 'd1', 'execute',
      '6aa26d4d-d545-4eb7-bf50-34d45f2182ad', '--remote', '--json',
      '--config', 'C:\\workspace\\wrangler.jsonc',
    ]));
    expect(args[args.indexOf('--command') + 1]).toContain('PRAGMA table_info("organizations")');
    expect(args[args.indexOf('--command') + 1]).toContain('FROM sqlite_schema');

    expect(() => readStagingDirectorySchema({
      projectRoot: 'C:/workspace', npmCli: 'npm-cli.js',
      spawn: () => ({ status: 1, stdout: '', stderr: 'private provider detail' }),
    } as any)).toThrow('staging directory schema metadata read failed');
    expect(() => readStagingDirectorySchema({
      projectRoot: 'C:/workspace', npmCli: 'npm-cli.js',
      spawn: () => ({ status: 0, stdout: 'not-json', stderr: '' }),
    } as any)).toThrow('staging directory schema metadata read was not valid JSON');
    expect(validateCrmDirectorySchemaReadback([])).toEqual([
      'staging directory schema readback is malformed or unsuccessful',
    ]);
  });

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
    expect(parseDeploymentArguments([
      '--crm-activation-boundary-ms', actionBoundary,
      '--expected-source-sha', approvedSourceSha,
      '--confirm-crm-activation',
    ]).activationConfirmed).toBe(true);
    expect(() => parseDeploymentArguments([
      '--crm-activation-boundary-ms', String(Number(actionBoundary) - 16 * 60 * 1_000),
      '--confirm-crm-activation',
    ])).toThrow('activation boundary must be within 15 minutes of deployment');
  });

  it('requires an exact approved source SHA for every confirmed deployment', () => {
    expect(() => parseDeploymentArguments(['--confirm']))
      .toThrow('confirmed staging deployment requires --expected-source-sha');
    expect(() => parseDeploymentArguments(['--expected-source-sha']))
      .toThrow('--expected-source-sha requires the exact approved 40-character Git SHA');
    expect(() => parseDeploymentArguments([
      '--expected-source-sha', 'ABD0BEA53554A3C832FDDD0FB101D00602662491', '--confirm',
    ])).toThrow('expected source SHA must be exactly 40 lowercase hexadecimal characters');
    expect(() => parseDeploymentArguments([
      '--expected-source-sha', approvedSourceSha,
      '--expected-source-sha', approvedSourceSha,
      '--confirm',
    ])).toThrow('duplicate deployment argument: --expected-source-sha');
    expect(parseDeploymentArguments([
      '--expected-source-sha', approvedSourceSha, '--confirm',
    ]).expectedSourceSha).toBe(approvedSourceSha);
  });

  it('bug-plat-009 refuses unbound prebuilt artifacts and ambiguous preparation modes', () => {
    expect(() => parseDeploymentArguments([
      '--reuse-verified-build',
      '--crm-activation-boundary-ms', actionBoundary,
      '--expected-source-sha', approvedSourceSha,
      '--confirm-crm-activation',
    ])).toThrow('--reuse-verified-build requires --expected-build-artifact-sha256');
    expect(() => parseDeploymentArguments([
      '--expected-build-artifact-sha256', approvedBuildArtifactSha256,
      '--crm-activation-boundary-ms', actionBoundary,
      '--expected-source-sha', approvedSourceSha,
      '--confirm-crm-activation',
    ])).toThrow('--expected-build-artifact-sha256 requires --reuse-verified-build');
    expect(() => parseDeploymentArguments([
      '--prepare-crm-activation-artifact',
      '--expected-source-sha', approvedSourceSha,
      '--confirm',
    ])).toThrow('--prepare-crm-activation-artifact cannot be combined with a deployment confirmation');
    expect(() => parseDeploymentArguments([
      '--reuse-verified-build',
      '--expected-build-artifact-sha256', 'A'.repeat(64),
      '--crm-activation-boundary-ms', actionBoundary,
      '--expected-source-sha', approvedSourceSha,
      '--confirm-crm-activation',
    ])).toThrow('expected build artifact SHA-256 must be exactly 64 lowercase hexadecimal characters');

    expect(parseDeploymentArguments([
      '--reuse-verified-build',
      '--expected-build-artifact-sha256', approvedBuildArtifactSha256,
      '--crm-activation-boundary-ms', actionBoundary,
      '--expected-source-sha', approvedSourceSha,
      '--confirm-crm-activation',
    ])).toMatchObject({
      reuseVerifiedBuild: true,
      expectedBuildArtifactSha256: approvedBuildArtifactSha256,
    });
    expect(parseDeploymentArguments([
      '--prepare-crm-activation-artifact',
      '--expected-source-sha', approvedSourceSha,
    ])).toMatchObject({
      prepareCrmActivationArtifact: true,
      expectedSourceSha: approvedSourceSha,
    });
    expect(() => parseDeploymentArguments(['--prepare-crm-activation-artifact']))
      .toThrow('--prepare-crm-activation-artifact requires --expected-source-sha');
  });

  it('bug-plat-009 verifies the complete prebuilt artifact without rebuilding and rejects drift', async () => {
    const artifactSha256 = await hashBuildArtifact(cleanRepoRoot);
    const manifest = await readAndVerifyPrebuiltStagingManifest({
      projectRoot: cleanRepoRoot,
      expectedSourceSha: cleanRepoSha,
      expectedBuildArtifactSha256: artifactSha256,
    });
    expect(manifest).toEqual(cleanManifest);

    const entryPath = join(cleanRepoRoot, 'dist', 'server', 'entry.mjs');
    writeFileSync(entryPath, 'export default { tampered: true }\n');
    try {
      await expect(readAndVerifyPrebuiltStagingManifest({
        projectRoot: cleanRepoRoot,
        expectedSourceSha: cleanRepoSha,
        expectedBuildArtifactSha256: artifactSha256,
      })).rejects.toThrow('prebuilt build artifact SHA-256 does not match approved hash');
    } finally {
      writeFileSync(entryPath, 'export default {}\n');
    }
  });

  it('bug-plat-009 refuses artifact reuse for an ordinary disabled deployment', async () => {
    await expect(deployStagingManifest({
      manifest: cleanManifest,
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedBuildArtifactSha256: await hashBuildArtifact(cleanRepoRoot),
      npmCli: 'npm-cli.js',
      runCommand: () => { throw new Error('wrangler must not run'); },
    })).rejects.toThrow('prebuilt build artifact reuse is restricted to CRM activation');
  });

  it('bug-plat-009 rechecks the frozen artifact immediately before Wrangler deploy', async () => {
    const artifactSha256 = await hashBuildArtifact(cleanRepoRoot);
    const activation = prepareStagingDeploymentManifest(cleanManifest, actionBoundary);
    const entryPath = join(cleanRepoRoot, 'dist', 'server', 'entry.mjs');
    const deploy = vi.fn();
    try {
      await expect(deployStagingManifest({
        manifest: activation,
        projectRoot: cleanRepoRoot,
        ...exactSource,
        expectedCrmSourceNotBeforeMs: actionBoundary,
        expectedBuildArtifactSha256: artifactSha256,
        npmCli: 'npm-cli.js',
        openConfig: async () => ({
          writeFile: async () => { writeFileSync(entryPath, 'export default { changed: true }\n'); },
          close: async () => {},
        } as unknown as FileHandle),
        unlinkConfig: async () => {},
        runCommand: deploy,
      })).rejects.toThrow('prebuilt build artifact SHA-256 does not match approved hash');
      expect(deploy).not.toHaveBeenCalled();
    } finally {
      writeFileSync(entryPath, 'export default {}\n');
    }
  });

  it('refuses a different checkout and carries the exact candidate in the deployment message', async () => {
    const calls: string[][] = [];
    await expect(deployStagingManifest({
      manifest: cleanManifest,
      projectRoot: cleanRepoRoot,
      expectedSourceSha: approvedSourceSha,
      actualSourceSha: '1111111111111111111111111111111111111111',
      npmCli: 'npm-cli.js',
      runCommand: (_command: string, args: string[]) => { calls.push(args); },
    } as any)).rejects.toThrow(`checked-out source SHA does not match approved candidate ${approvedSourceSha}`);
    expect(calls).toEqual([]);

    await deployStagingManifest({
      manifest: cleanManifest,
      projectRoot: cleanRepoRoot,
      expectedSourceSha: cleanRepoSha,
      actualSourceSha: approvedSourceSha,
      npmCli: 'npm-cli.js',
      runCommand: (_command: string, args: string[]) => { calls.push(args); },
    } as any);
    const messageIndex = calls[0].indexOf('--message');
    expect(calls[0][messageIndex + 1]).toContain(cleanRepoSha);
    expect(calls[0][messageIndex + 1]).toContain('adapter and backfill disabled');
  });

  it('refuses a dirty approved checkout before building a confirmed deployment', () => {
    const spawn = vi.fn(() => ({
      status: 0,
      stdout: ' M src/worker.ts\n?? public/unreviewed.js\n',
      stderr: '',
    }));
    expect(() => verifyCleanCheckout('C:/workspace', spawn as any))
      .toThrow('confirmed staging deployment requires a clean working tree');
  });

  it('allows only known generated assets after the build', () => {
    expect(validatePostBuildStatus([
      ' M public/link-manifest.json',
      '?? public/og/generated-card.jpg',
      '',
    ].join('\n'))).toEqual([]);
    expect(validatePostBuildStatus(' M src/worker.ts\n?? public/unreviewed.js\n')).toEqual([
      ' M src/worker.ts',
      '?? public/unreviewed.js',
    ]);
  });

  it('rechecks the working tree at the mutating boundary', async () => {
    const unexpectedPath = join(cleanRepoRoot, 'unexpected-worker.js');
    writeFileSync(unexpectedPath, 'export default {}\n');
    try {
      await expect(deployStagingManifest({
        manifest: cleanManifest,
        projectRoot: cleanRepoRoot,
        ...exactSource,
        npmCli: 'npm-cli.js',
        runCommand: () => {
          throw new Error('wrangler must not run');
        },
      })).rejects.toThrow('checked-out source changed outside approved build-generated paths');
    } finally {
      rmSync(unexpectedPath, { force: true });
    }
  });

  it('refuses a stale ignored build artifact at the mutating boundary', async () => {
    const buildInfoPath = join(cleanRepoRoot, 'dist', 'client', 'build-info.json');
    writeFileSync(buildInfoPath, JSON.stringify({ schemaVersion: 1, commit: approvedSourceSha }));
    try {
      await expect(deployStagingManifest({
        manifest: cleanManifest,
        projectRoot: cleanRepoRoot,
        ...exactSource,
        npmCli: 'npm-cli.js',
        runCommand: () => {
          throw new Error('wrangler must not run');
        },
      })).rejects.toThrow(`built artifact source SHA does not match approved candidate ${cleanRepoSha}`);
    } finally {
      writeFileSync(buildInfoPath, JSON.stringify({ schemaVersion: 1, commit: cleanRepoSha }));
    }
  });

  it('rechecks the approved HEAD after writing the activation config', async () => {
    const activation = prepareStagingDeploymentManifest(cleanManifest, actionBoundary);
    try {
      await expect(deployStagingManifest({
        manifest: activation,
        projectRoot: cleanRepoRoot,
        ...exactSource,
        expectedCrmSourceNotBeforeMs: actionBoundary,
        npmCli: 'npm-cli.js',
        openConfig: async () => ({
          writeFile: async () => {
            execFileSync('git', ['commit', '--quiet', '--allow-empty', '-m', 'concurrent change'], {
              cwd: cleanRepoRoot,
            });
          },
          close: async () => {},
        } as unknown as FileHandle),
        unlinkConfig: async () => {},
        runCommand: () => {
          throw new Error('wrangler invoked after HEAD changed');
        },
      })).rejects.toThrow(`checked-out source SHA does not match approved candidate ${cleanRepoSha}`);
    } finally {
      execFileSync('git', ['checkout', '--quiet', '--detach', cleanRepoSha], { cwd: cleanRepoRoot });
    }
  });

  it('refuses a stale activation boundary before opening a temporary config', async () => {
    const staleBoundary = String(Number(actionBoundary) - 16 * 60 * 1_000);
    const opened: string[] = [];
    await expect(deployStagingManifest({
      manifest: prepareStagingDeploymentManifest(cleanManifest, staleBoundary),
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedCrmSourceNotBeforeMs: staleBoundary,
      npmCli: 'npm-cli.js',
      openConfig: async (path: PathLike) => {
        opened.push(String(path));
        return { writeFile: async () => {}, close: async () => {} } as unknown as FileHandle;
      },
      unlinkConfig: async () => {},
      runCommand: () => {},
    })).rejects.toThrow('activation boundary must be within 15 minutes of deployment');
    expect(opened).toEqual([]);
  });

  it('rechecks activation freshness before config creation and immediately before deploy', async () => {
    const activation = prepareStagingDeploymentManifest(cleanManifest, actionBoundary);
    const beforeOpen: string[] = [];
    vi.spyOn(Date, 'now')
      .mockReturnValue(Number(actionBoundary) + 16 * 60 * 1_000);
    await expect(deployStagingManifest({
      manifest: activation,
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedCrmSourceNotBeforeMs: actionBoundary,
      npmCli: 'npm-cli.js',
      openConfig: async () => {
        beforeOpen.push('open');
        return { writeFile: async () => {}, close: async () => {} } as unknown as FileHandle;
      },
      unlinkConfig: async () => { beforeOpen.push('unlink'); },
      runCommand: () => { beforeOpen.push('deploy'); },
    })).rejects.toThrow('activation boundary must be within 15 minutes of deployment');
    expect(beforeOpen).toEqual([]);
    vi.restoreAllMocks();

    const beforeDeploy: string[] = [];
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(Number(actionBoundary))
      .mockReturnValueOnce(Number(actionBoundary))
      .mockReturnValue(Number(actionBoundary) + 16 * 60 * 1_000);
    await expect(deployStagingManifest({
      manifest: activation,
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedCrmSourceNotBeforeMs: actionBoundary,
      npmCli: 'npm-cli.js',
      openConfig: async () => ({
        writeFile: async () => { beforeDeploy.push('write'); },
        close: async () => { beforeDeploy.push('close'); },
      } as unknown as FileHandle),
      unlinkConfig: async () => { beforeDeploy.push('unlink'); },
      runCommand: () => { beforeDeploy.push('deploy'); },
    })).rejects.toThrow('activation boundary must be within 15 minutes of deployment');
    expect(beforeDeploy).toEqual(['write', 'close', 'unlink']);
  });

  it('rechecks activation freshness after the application build', async () => {
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(Number(actionBoundary))
      .mockReturnValue(Number(actionBoundary) + 16 * 60 * 1_000);
    const calls: string[] = [];
    await expect(buildAndVerifyStagingManifest({
      projectRoot: 'C:/workspace',
      expectedCrmSourceNotBeforeMs: actionBoundary,
      npmCli: 'npm-cli.js',
      runCommand: () => { calls.push('build'); },
      readManifest: async () => JSON.stringify(valid),
    } as any)).rejects.toThrow('activation boundary must be within 15 minutes of deployment');
    expect(calls).toEqual(['build']);
  });

  it('deploys the derived activation config and always removes its owned temporary file', async () => {
    const activation = prepareStagingDeploymentManifest(cleanManifest, actionBoundary);
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
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedCrmSourceNotBeforeMs: actionBoundary,
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
    const activation = prepareStagingDeploymentManifest(cleanManifest, actionBoundary);
    const removedAfterDeploy: string[] = [];
    await expect(deployStagingManifest({
      manifest: activation,
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedCrmSourceNotBeforeMs: actionBoundary,
      npmCli: 'npm-cli.js',
      openConfig: async () => ({ writeFile: async () => {}, close: async () => {} } as unknown as FileHandle),
      unlinkConfig: async (path: PathLike) => { removedAfterDeploy.push(String(path)); },
      runCommand: () => { throw new Error('deploy failed'); },
    })).rejects.toThrow('deploy failed');
    expect(removedAfterDeploy).toHaveLength(1);

    const calls: string[] = [];
    await expect(deployStagingManifest({
      manifest: activation,
      projectRoot: cleanRepoRoot,
      ...exactSource,
      expectedCrmSourceNotBeforeMs: actionBoundary,
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
