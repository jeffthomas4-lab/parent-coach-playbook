import { createHash } from 'node:crypto';
import { lstat, open, readFile, readdir, unlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const STAGING_WORKER = 'parent-coach-desk-staging';
const STAGING_ORIGIN = 'https://parent-coach-desk-staging.eepskalla.workers.dev';
const FALSE_FEATURE_FLAGS = [
  'CAMP_CLAIMS_ENABLED', 'CAMP_REVIEWS_ENABLED', 'TRUST_INTAKE_ENABLED',
  'DEMAND_TELEMETRY_ENABLED', 'IDEMPOTENCY_CLEANUP_ENABLED',
  'PCD_CUSTOMER_FOUNDATION_ENABLED', 'PCD_COMMERCE_TEST_MODE_ENABLED',
  'PCD_CRM_BACKFILL_ENABLED',
];
const CRM_IDENTIFIERS = {
  PCD_CRM_PRODUCER_WORKSPACE_ID: 'pcd-activity-radar',
  PCD_CRM_TARGET_WORKSPACE_ID: 'ws-sightsmash',
  PCD_CRM_SOURCE_ID: 'source-pcd-activity-radar',
};
const STAGING_D1_BINDINGS = [
  { binding: 'DB', database_name: 'parent-coach-desk-directory-staging', database_id: '6aa26d4d-d545-4eb7-bf50-34d45f2182ad' },
  { binding: 'PCD_OPS_DB', database_name: 'parent-coach-desk-ops-staging', database_id: '7f0da00d-bc98-464f-8702-ce0fb381dd5e' },
];
const STAGING_R2_BINDINGS = [
  { binding: 'PHOTOS', bucket_name: 'parent-coach-desk-staging-photos' },
];
const STAGING_SERVICE_BINDINGS = [
  { binding: 'CRM_ADAPTER', service: 'field-forge-crm-staging' },
];
const STAGING_KV_BINDINGS = [
  { binding: 'SESSION', id: '59cbf275ba16459c8f76ff39b033f748' },
];
const CRM_DIRECTORY_COLUMNS = [
  'id', 'name', 'organization_type', 'website_url', 'city', 'state', 'zip', 'categories',
  'record_status', 'is_claimed', 'content_hash', 'deleted_at', 'updated_at',
  'crm_projection_revision',
];
const CRM_DIRECTORY_OBJECTS = [
  {
    type: 'table', name: 'crm_organization_projection_revisions', table: 'crm_organization_projection_revisions',
    definition: `CREATE TABLE crm_organization_projection_revisions (
      singleton INTEGER PRIMARY KEY CHECK(singleton=1),
      next_revision INTEGER NOT NULL CHECK(next_revision > 0)
    )`,
  },
  {
    type: 'index', name: 'idx_organizations_crm_projection_revision', table: 'organizations',
    definition: `CREATE INDEX idx_organizations_crm_projection_revision
      ON organizations(crm_projection_revision) WHERE crm_projection_revision > 0`,
  },
  {
    type: 'trigger', name: 'crm_organization_projection_insert', table: 'organizations',
    definition: `CREATE TRIGGER crm_organization_projection_insert
      AFTER INSERT ON organizations
      BEGIN
        UPDATE crm_organization_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
        UPDATE organizations SET crm_projection_revision=(
          SELECT next_revision-1 FROM crm_organization_projection_revisions WHERE singleton=1
        ) WHERE id=NEW.id;
      END`,
  },
  {
    type: 'trigger', name: 'crm_organization_projection_update', table: 'organizations',
    definition: `CREATE TRIGGER crm_organization_projection_update
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
      END`,
  },
];
const CRM_DIRECTORY_SCHEMA_SQL = `PRAGMA table_info("organizations");
SELECT type,name,tbl_name,sql FROM sqlite_schema WHERE name IN (
  'crm_organization_projection_revisions',
  'idx_organizations_crm_projection_revision',
  'crm_organization_projection_insert',
  'crm_organization_projection_update'
) ORDER BY type,name;`;
const SOURCE_SHA_PATTERN = /^[0-9a-f]{40}$/;
const BUILD_ARTIFACT_SHA256_PATTERN = /^[0-9a-f]{64}$/;

function normalized(value) {
  return String(value ?? '').replaceAll('\\', '/');
}

function validActivationBoundary(value) {
  const parsed = Number(value);
  return /^\d+$/.test(String(value ?? '')) && Number.isSafeInteger(parsed) && parsed > 0 && parsed % 1000 === 0;
}

function actionTimeActivationBoundary(value) {
  return validActivationBoundary(value) && Math.abs(Date.now() - Number(value)) <= 15 * 60 * 1_000;
}

function hasExactBinding(actual, expected, fields) {
  return actual.some((binding) => fields.every((field) => binding?.[field] === expected[field]));
}

function normalizedSchemaDefinition(value) {
  return String(value ?? '')
    .trim()
    .replace(/;$/, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([(),=+>])\s*/g, '$1')
    .toLowerCase();
}

export function validateCrmDirectorySchemaReadback(readback) {
  if (!Array.isArray(readback) || readback.length !== 2
    || !readback.every((result) => result?.success === true && Array.isArray(result.results))) {
    return ['staging directory schema readback is malformed or unsuccessful'];
  }
  const columns = new Set(readback[0].results.map((row) => row?.name).filter(Boolean));
  const errors = [
    ...CRM_DIRECTORY_COLUMNS
      .filter((column) => !columns.has(column))
      .map((column) => `organizations.${column} is missing`),
  ];
  for (const expected of CRM_DIRECTORY_OBJECTS) {
    const object = readback[1].results.find((row) => (
      row?.type === expected.type && row?.name === expected.name
    ));
    if (!object) {
      errors.push(`${expected.type} ${expected.name} is missing`);
    } else if (object.tbl_name !== expected.table) {
      errors.push(`${expected.type} ${expected.name} does not belong to ${expected.table}`);
    } else if (normalizedSchemaDefinition(object.sql) !== normalizedSchemaDefinition(expected.definition)) {
      errors.push(`${expected.type} ${expected.name} definition is incompatible`);
    }
  }
  return errors;
}

export function readStagingDirectorySchema({ projectRoot, spawn = spawnSync }) {
  const result = spawn(process.execPath, [
    resolve(projectRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js'),
    'd1', 'execute', STAGING_D1_BINDINGS[0].database_id,
    '--remote', '--command', CRM_DIRECTORY_SCHEMA_SQL, '--json',
    '--config', resolve(projectRoot, 'wrangler.jsonc'),
  ], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 60_000,
  });
  if (result.error || result.status !== 0) {
    throw new Error('staging directory schema metadata read failed');
  }
  try {
    return JSON.parse(String(result.stdout ?? ''));
  } catch {
    throw new Error('staging directory schema metadata read was not valid JSON');
  }
}

export function parseDeploymentArguments(args) {
  const parsed = {
    disabledConfirmed: false,
    activationConfirmed: false,
    prepareCrmActivationArtifact: false,
    reuseVerifiedBuild: false,
    expectedCrmSourceNotBeforeMs: undefined,
    expectedSourceSha: undefined,
    expectedBuildArtifactSha256: undefined,
  };
  const seen = new Set();
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (![
      '--confirm', '--confirm-crm-activation', '--crm-activation-boundary-ms', '--expected-source-sha',
      '--prepare-crm-activation-artifact', '--reuse-verified-build',
      '--expected-build-artifact-sha256',
    ].includes(argument)) {
      throw new Error(`unknown deployment argument: ${argument}`);
    }
    if (seen.has(argument)) throw new Error(`duplicate deployment argument: ${argument}`);
    seen.add(argument);
    if (argument === '--confirm') parsed.disabledConfirmed = true;
    if (argument === '--confirm-crm-activation') parsed.activationConfirmed = true;
    if (argument === '--prepare-crm-activation-artifact') parsed.prepareCrmActivationArtifact = true;
    if (argument === '--reuse-verified-build') parsed.reuseVerifiedBuild = true;
    if (argument === '--expected-source-sha') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--expected-source-sha requires the exact approved 40-character Git SHA');
      }
      parsed.expectedSourceSha = value;
      index += 1;
    }
    if (argument === '--crm-activation-boundary-ms') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--crm-activation-boundary-ms requires the exact approved Unix-millisecond boundary');
      }
      parsed.expectedCrmSourceNotBeforeMs = value;
      index += 1;
    }
    if (argument === '--expected-build-artifact-sha256') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--expected-build-artifact-sha256 requires the exact approved SHA-256');
      }
      parsed.expectedBuildArtifactSha256 = value;
      index += 1;
    }
  }
  if (parsed.disabledConfirmed && parsed.activationConfirmed) {
    throw new Error('choose one staging deployment confirmation mode');
  }
  if (parsed.disabledConfirmed && parsed.expectedCrmSourceNotBeforeMs !== undefined) {
    throw new Error('--confirm cannot be combined with --crm-activation-boundary-ms');
  }
  if (parsed.activationConfirmed && parsed.expectedCrmSourceNotBeforeMs === undefined) {
    throw new Error('--confirm-crm-activation requires --crm-activation-boundary-ms');
  }
  if (parsed.prepareCrmActivationArtifact && (parsed.disabledConfirmed || parsed.activationConfirmed)) {
    throw new Error('--prepare-crm-activation-artifact cannot be combined with a deployment confirmation');
  }
  if (parsed.prepareCrmActivationArtifact && (
    parsed.expectedCrmSourceNotBeforeMs !== undefined
    || parsed.reuseVerifiedBuild
    || parsed.expectedBuildArtifactSha256 !== undefined
  )) {
    throw new Error('--prepare-crm-activation-artifact must build a disabled, unbound staging artifact');
  }
  if (parsed.reuseVerifiedBuild && parsed.expectedBuildArtifactSha256 === undefined) {
    throw new Error('--reuse-verified-build requires --expected-build-artifact-sha256');
  }
  if (!parsed.reuseVerifiedBuild && parsed.expectedBuildArtifactSha256 !== undefined) {
    throw new Error('--expected-build-artifact-sha256 requires --reuse-verified-build');
  }
  if (parsed.reuseVerifiedBuild && !parsed.activationConfirmed) {
    throw new Error('--reuse-verified-build is restricted to confirmed CRM activation');
  }
  if (parsed.expectedCrmSourceNotBeforeMs !== undefined
    && !validActivationBoundary(parsed.expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be a positive second-aligned Unix millisecond value');
  }
  if (parsed.expectedCrmSourceNotBeforeMs !== undefined
    && !actionTimeActivationBoundary(parsed.expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be within 15 minutes of deployment');
  }
  if (parsed.expectedSourceSha !== undefined && !SOURCE_SHA_PATTERN.test(parsed.expectedSourceSha)) {
    throw new Error('expected source SHA must be exactly 40 lowercase hexadecimal characters');
  }
  if (parsed.expectedBuildArtifactSha256 !== undefined
    && !BUILD_ARTIFACT_SHA256_PATTERN.test(parsed.expectedBuildArtifactSha256)) {
    throw new Error('expected build artifact SHA-256 must be exactly 64 lowercase hexadecimal characters');
  }
  if ((parsed.disabledConfirmed || parsed.activationConfirmed) && parsed.expectedSourceSha === undefined) {
    throw new Error('confirmed staging deployment requires --expected-source-sha');
  }
  if (parsed.prepareCrmActivationArtifact && parsed.expectedSourceSha === undefined) {
    throw new Error('--prepare-crm-activation-artifact requires --expected-source-sha');
  }
  return parsed;
}

function verifyExpectedSourceSha(expectedSourceSha, actualSourceSha) {
  if (!SOURCE_SHA_PATTERN.test(String(expectedSourceSha ?? ''))) {
    throw new Error('expected source SHA must be exactly 40 lowercase hexadecimal characters');
  }
  if (actualSourceSha !== expectedSourceSha) {
    throw new Error(`checked-out source SHA does not match approved candidate ${expectedSourceSha}`);
  }
}

function readCurrentSourceSha(projectRoot = process.cwd(), spawn = spawnSync) {
  const result = spawn('git', ['rev-parse', 'HEAD'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`git rev-parse HEAD exited with status ${result.status ?? 1}`);
  const sourceSha = String(result.stdout ?? '').trim();
  if (!SOURCE_SHA_PATTERN.test(sourceSha)) {
    throw new Error('checked-out source SHA is unavailable or malformed');
  }
  return sourceSha;
}

export function verifyCleanCheckout(projectRoot = process.cwd(), spawn = spawnSync) {
  const result = spawn('git', ['status', '--porcelain', '--untracked-files=normal'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`git status exited with status ${result.status ?? 1}`);
  if (String(result.stdout ?? '').trim() !== '') {
    throw new Error('confirmed staging deployment requires a clean working tree');
  }
}

export function validatePostBuildStatus(status) {
  const allowedGeneratedPath = /^(?: M public\/link-manifest\.json|\?\? public\/og\/[a-z0-9-]+\.jpg)$/;
  return String(status ?? '')
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !allowedGeneratedPath.test(line));
}

function verifyPostBuildCheckout(projectRoot = process.cwd(), spawn = spawnSync) {
  const result = spawn('git', ['status', '--porcelain', '--untracked-files=normal'], {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`git status exited with status ${result.status ?? 1}`);
  if (validatePostBuildStatus(result.stdout).length > 0) {
    throw new Error('checked-out source changed outside approved build-generated paths');
  }
}

async function verifyBuildSourceSha(projectRoot, expectedSourceSha) {
  let buildInfo;
  try {
    buildInfo = JSON.parse(await readFile(resolve(projectRoot, 'dist/client/build-info.json'), 'utf8'));
  } catch {
    throw new Error('built artifact source SHA is unavailable or malformed');
  }
  if (buildInfo?.commit !== expectedSourceSha) {
    throw new Error(`built artifact source SHA does not match approved candidate ${expectedSourceSha}`);
  }
}

async function verifyReleaseState(projectRoot, expectedSourceSha) {
  verifyExpectedSourceSha(expectedSourceSha, readCurrentSourceSha(projectRoot));
  verifyPostBuildCheckout(projectRoot);
  await verifyBuildSourceSha(projectRoot, expectedSourceSha);
}

async function collectBuildArtifactFiles(artifactRoot, directory = artifactRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name, 'en'));
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectBuildArtifactFiles(artifactRoot, path));
    } else if (entry.isFile()) {
      files.push(path);
    } else {
      throw new Error(`build artifact contains unsupported filesystem entry: ${normalized(relative(artifactRoot, path))}`);
    }
  }
  return files;
}

export async function hashBuildArtifact(projectRoot, { excludePaths = [] } = {}) {
  const artifactRoot = resolve(projectRoot, 'dist');
  const excluded = new Set(excludePaths.map((path) => normalized(resolve(path))));
  const files = (await collectBuildArtifactFiles(artifactRoot))
    .filter((path) => !excluded.has(normalized(resolve(path))));
  if (files.length === 0) throw new Error('prebuilt build artifact is empty');

  const hash = createHash('sha256');
  hash.update('parent-coach-desk-build-artifact-v1\n');
  for (const path of files) {
    const artifactPath = normalized(relative(artifactRoot, path));
    const before = await lstat(path);
    if (!before.isFile()) {
      throw new Error(`build artifact contains unsupported filesystem entry: ${artifactPath}`);
    }
    hash.update(`${Buffer.byteLength(artifactPath, 'utf8')}:${artifactPath}:${before.size}\n`);
    const content = await readFile(path);
    if (content.length !== before.size) {
      throw new Error(`build artifact changed while hashing: ${artifactPath}`);
    }
    hash.update(content);
    hash.update('\n');
    const after = await lstat(path);
    if (!after.isFile() || after.size !== before.size || after.mtimeMs !== before.mtimeMs) {
      throw new Error(`build artifact changed while hashing: ${artifactPath}`);
    }
  }
  return hash.digest('hex');
}

async function verifyBuildArtifactSha256(projectRoot, expectedBuildArtifactSha256, options) {
  if (!BUILD_ARTIFACT_SHA256_PATTERN.test(String(expectedBuildArtifactSha256 ?? ''))) {
    throw new Error('expected build artifact SHA-256 must be exactly 64 lowercase hexadecimal characters');
  }
  const actualBuildArtifactSha256 = await hashBuildArtifact(projectRoot, options);
  if (actualBuildArtifactSha256 !== expectedBuildArtifactSha256) {
    throw new Error('prebuilt build artifact SHA-256 does not match approved hash');
  }
}

export async function readAndVerifyPrebuiltStagingManifest({
  projectRoot = process.cwd(),
  expectedSourceSha = /** @type {string | undefined} */ (undefined),
  expectedBuildArtifactSha256 = /** @type {string | undefined} */ (undefined),
  readManifest = readFile,
} = {}) {
  await verifyReleaseState(projectRoot, expectedSourceSha);
  await verifyBuildArtifactSha256(projectRoot, expectedBuildArtifactSha256);
  let manifest;
  try {
    manifest = JSON.parse(await readManifest(resolve(projectRoot, 'dist/server/wrangler.json'), 'utf8'));
  } catch {
    throw new Error('prebuilt staging manifest is unavailable or malformed');
  }
  const errors = validateStagingDeploymentManifest(manifest, {
    expectedConfigPath: resolve(projectRoot, 'wrangler.jsonc'),
  });
  if (errors.length > 0) throw new Error(`staging deployment refused:\n- ${errors.join('\n- ')}`);
  return manifest;
}

export function validateStagingDeploymentManifest(
  manifest,
  { expectedConfigPath, expectedCrmSourceNotBeforeMs } = {},
) {
  const errors = [];
  if (expectedConfigPath && normalized(manifest.configPath) !== normalized(expectedConfigPath)) {
    errors.push('generated manifest is not sourced from the exact root staging wrangler.jsonc');
  } else if (!expectedConfigPath && !normalized(manifest.configPath).endsWith('/wrangler.jsonc')) {
    errors.push('generated manifest is not sourced from the root staging wrangler.jsonc');
  }
  if (manifest.topLevelName !== STAGING_WORKER || manifest.name !== STAGING_WORKER) {
    errors.push('generated manifest does not name the isolated staging Worker');
  }
  if (manifest.vars?.SITE_URL !== STAGING_ORIGIN) {
    errors.push('generated manifest does not use the isolated staging origin');
  }
  for (const flag of FALSE_FEATURE_FLAGS) {
    if (manifest.vars?.[flag] !== 'false') errors.push(`${flag} must remain false for staging deployment`);
  }
  const adapterEnabled = manifest.vars?.PCD_CRM_ADAPTER_ENABLED;
  const pilotMode = manifest.vars?.PCD_CRM_PILOT_MODE;
  const activationBoundary = manifest.vars?.PCD_CRM_SOURCE_NOT_BEFORE_MS;
  if (expectedCrmSourceNotBeforeMs === undefined) {
    if (adapterEnabled !== 'false') {
      errors.push('PCD_CRM_ADAPTER_ENABLED must remain false unless an exact activation boundary is supplied');
    }
    if (activationBoundary !== undefined) {
      errors.push('PCD_CRM_SOURCE_NOT_BEFORE_MS must be absent while the CRM adapter is disabled');
    }
    if (pilotMode !== 'false') {
      errors.push('PCD_CRM_PILOT_MODE must remain false outside an approved CRM pilot activation');
    }
  } else {
    if (adapterEnabled !== 'true') {
      errors.push('PCD_CRM_ADAPTER_ENABLED must be true for the approved CRM pilot activation');
    }
    if (String(activationBoundary ?? '') !== String(expectedCrmSourceNotBeforeMs)) {
      errors.push('PCD_CRM_SOURCE_NOT_BEFORE_MS does not match the approved activation boundary');
    }
    if (!validActivationBoundary(expectedCrmSourceNotBeforeMs)) {
      errors.push('PCD_CRM_SOURCE_NOT_BEFORE_MS must be a positive second-aligned Unix millisecond value');
    }
    if (pilotMode !== 'true') {
      errors.push('PCD_CRM_PILOT_MODE must be true for the approved CRM pilot activation');
    }
  }
  const d1Bindings = manifest.d1_databases ?? [];
  if (d1Bindings.length !== STAGING_D1_BINDINGS.length) {
    errors.push('staging deployment must contain exactly the approved D1 bindings');
  }
  for (const expected of STAGING_D1_BINDINGS) {
    if (!hasExactBinding(d1Bindings, expected, ['binding', 'database_name', 'database_id'])) {
      errors.push(`D1 binding ${expected.binding} must target the approved staging database identity`);
    }
  }
  const r2Bindings = manifest.r2_buckets ?? [];
  if (r2Bindings.length !== STAGING_R2_BINDINGS.length) {
    errors.push('staging deployment must contain exactly the approved R2 bindings');
  }
  for (const expected of STAGING_R2_BINDINGS) {
    if (!hasExactBinding(r2Bindings, expected, ['binding', 'bucket_name'])) {
      errors.push(`R2 binding ${expected.binding} must target the approved staging bucket`);
    }
  }
  const services = manifest.services ?? [];
  if (services.length !== STAGING_SERVICE_BINDINGS.length) {
    errors.push('staging deployment must contain exactly the approved service bindings');
  }
  const expectedService = STAGING_SERVICE_BINDINGS[0];
  const serviceBinding = services[0];
  if (!serviceBinding
    || Object.keys(serviceBinding).length !== Object.keys(expectedService).length
    || !hasExactBinding(services, expectedService, ['binding', 'service'])) {
    errors.push('CRM_ADAPTER must use the exact approved staging service binding');
  }
  const kvBindings = manifest.kv_namespaces ?? [];
  if (kvBindings.length !== STAGING_KV_BINDINGS.length) {
    errors.push('staging deployment must contain exactly the approved KV bindings');
  }
  if (!hasExactBinding(kvBindings, STAGING_KV_BINDINGS[0], ['binding', 'id'])) {
    errors.push('SESSION must target the approved staging KV namespace');
  }
  for (const [name, expected] of Object.entries(CRM_IDENTIFIERS)) {
    if (manifest.vars?.[name] !== expected) errors.push(`${name} must equal ${expected}`);
  }
  const requiredSecrets = new Set(manifest.secrets?.required ?? []);
  if (requiredSecrets.size !== 1 || !requiredSecrets.has('PCD_CRM_ADAPTER_HMAC_SECRET')) {
    errors.push('missing required staging secret declaration: PCD_CRM_ADAPTER_HMAC_SECRET');
  }
  return errors;
}

export function prepareStagingDeploymentManifest(manifest, expectedCrmSourceNotBeforeMs) {
  if (!validActivationBoundary(expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be a positive second-aligned Unix millisecond value');
  }
  return {
    ...manifest,
    vars: {
      ...manifest.vars,
      PCD_CRM_ADAPTER_ENABLED: 'true',
      PCD_CRM_BACKFILL_ENABLED: 'false',
      PCD_CRM_PILOT_MODE: 'true',
      PCD_CRM_SOURCE_NOT_BEFORE_MS: String(expectedCrmSourceNotBeforeMs),
    },
  };
}

function run(command, args, options) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status ?? 1}`);
}

export async function deployStagingManifest({
  manifest,
  projectRoot = process.cwd(),
  expectedCrmSourceNotBeforeMs = /** @type {string | undefined} */ (undefined),
  expectedSourceSha = /** @type {string | undefined} */ (undefined),
  expectedBuildArtifactSha256 = /** @type {string | undefined} */ (undefined),
  npmCli = process.env.npm_execpath,
  openConfig = open,
  unlinkConfig = unlink,
  runCommand = run,
}) {
  if (!npmCli) throw new Error('deploy-staging-verified.mjs must be run through npm');
  if (expectedBuildArtifactSha256 !== undefined && expectedCrmSourceNotBeforeMs === undefined) {
    throw new Error('prebuilt build artifact reuse is restricted to CRM activation');
  }
  const errors = validateStagingDeploymentManifest(manifest, {
    expectedConfigPath: resolve(projectRoot, 'wrangler.jsonc'),
    expectedCrmSourceNotBeforeMs,
  });
  if (errors.length > 0) throw new Error(`staging deployment refused:\n- ${errors.join('\n- ')}`);

  const message = expectedCrmSourceNotBeforeMs === undefined
    ? `exact candidate ${expectedSourceSha}; adapter and backfill disabled`
    : `exact candidate ${expectedSourceSha}; Gate 9C-C CRM pilot activation ${expectedCrmSourceNotBeforeMs}`;
  if (expectedCrmSourceNotBeforeMs === undefined) {
    await verifyReleaseState(projectRoot, expectedSourceSha);
    runCommand(process.execPath, [resolve(projectRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js'),
      'deploy', '--config', resolve(projectRoot, 'dist/server/wrangler.json'), '--keep-vars', '--message', message], { cwd: projectRoot });
    return;
  }

  await verifyReleaseState(projectRoot, expectedSourceSha);
  if (!actionTimeActivationBoundary(expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be within 15 minutes of deployment');
  }
  const schemaErrors = validateCrmDirectorySchemaReadback(readStagingDirectorySchema({
    projectRoot, npmCli,
  }));
  if (schemaErrors.length > 0) {
    throw new Error(`staging deployment refused:\n- ${schemaErrors.join('\n- ')}`);
  }
  if (!actionTimeActivationBoundary(expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be within 15 minutes of deployment');
  }
  const activationConfigPath = resolve(
    projectRoot,
    'dist/server',
    `.wrangler.crm-activation-${process.pid}-${Date.now()}.json`,
  );
  const handle = await openConfig(activationConfigPath, 'wx');
  try {
    try {
      await handle.writeFile(`${JSON.stringify(manifest)}\n`);
    } finally {
      await handle.close();
    }
    if (!actionTimeActivationBoundary(expectedCrmSourceNotBeforeMs)) {
      throw new Error('activation boundary must be within 15 minutes of deployment');
    }
    await verifyReleaseState(projectRoot, expectedSourceSha);
    if (expectedBuildArtifactSha256 !== undefined) {
      await verifyBuildArtifactSha256(projectRoot, expectedBuildArtifactSha256, {
        excludePaths: [activationConfigPath],
      });
    }
    runCommand(process.execPath, [resolve(projectRoot, 'node_modules', 'wrangler', 'bin', 'wrangler.js'),
      'deploy', '--config', activationConfigPath, '--keep-vars', '--message', message], { cwd: projectRoot });
  } finally {
    await unlinkConfig(activationConfigPath);
  }
}

export async function buildAndVerifyStagingManifest({
  projectRoot = process.cwd(),
  expectedCrmSourceNotBeforeMs,
  npmCli = process.env.npm_execpath,
  runCommand = run,
  readManifest = readFile,
} = {}) {
  if (expectedCrmSourceNotBeforeMs !== undefined
    && !validActivationBoundary(expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be a positive second-aligned Unix millisecond value');
  }
  if (expectedCrmSourceNotBeforeMs !== undefined
    && !actionTimeActivationBoundary(expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be within 15 minutes of deployment');
  }
  if (!npmCli) throw new Error('deploy-staging-verified.mjs must be run through npm');
  const buildEnvironment = { ...process.env, PCD_OWNER_AUTH_PROOF_ENABLED: 'false' };
  delete buildEnvironment.WRANGLER_CONFIG_PATH;
  runCommand(process.execPath, [npmCli, 'run', 'build'], { cwd: projectRoot, env: buildEnvironment });
  if (expectedCrmSourceNotBeforeMs !== undefined
    && !actionTimeActivationBoundary(expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be within 15 minutes of deployment');
  }
  const baseManifest = JSON.parse(await readManifest(resolve(projectRoot, 'dist/server/wrangler.json'), 'utf8'));
  const baseErrors = validateStagingDeploymentManifest(baseManifest, {
    expectedConfigPath: resolve(projectRoot, 'wrangler.jsonc'),
  });
  if (baseErrors.length > 0) throw new Error(`staging deployment refused:\n- ${baseErrors.join('\n- ')}`);
  if (expectedCrmSourceNotBeforeMs === undefined) return baseManifest;

  const manifest = prepareStagingDeploymentManifest(baseManifest, expectedCrmSourceNotBeforeMs);
  const errors = validateStagingDeploymentManifest(manifest, {
    expectedConfigPath: resolve(projectRoot, 'wrangler.jsonc'),
    expectedCrmSourceNotBeforeMs,
  });
  if (errors.length > 0) throw new Error(`staging deployment refused:\n- ${errors.join('\n- ')}`);
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const boundaryFlag = '--crm-activation-boundary-ms';
  const {
    disabledConfirmed, activationConfirmed, prepareCrmActivationArtifact, reuseVerifiedBuild,
    expectedCrmSourceNotBeforeMs, expectedSourceSha, expectedBuildArtifactSha256,
  } = parseDeploymentArguments(process.argv.slice(2));
  const confirmed = expectedCrmSourceNotBeforeMs === undefined ? disabledConfirmed : activationConfirmed;
  if (expectedSourceSha !== undefined) {
    verifyExpectedSourceSha(expectedSourceSha, readCurrentSourceSha());
  }
  if (prepareCrmActivationArtifact || (confirmed && !reuseVerifiedBuild)) verifyCleanCheckout();
  const baseManifest = reuseVerifiedBuild
    ? await readAndVerifyPrebuiltStagingManifest({
      expectedSourceSha,
      expectedBuildArtifactSha256,
    })
    : await buildAndVerifyStagingManifest({ expectedCrmSourceNotBeforeMs });
  const manifest = reuseVerifiedBuild
    ? prepareStagingDeploymentManifest(baseManifest, expectedCrmSourceNotBeforeMs)
    : baseManifest;
  console.log(`Verified isolated staging manifest for ${manifest.name}.`);
  if (prepareCrmActivationArtifact) {
    await verifyReleaseState(process.cwd(), expectedSourceSha);
    const buildArtifactSha256 = await hashBuildArtifact(process.cwd());
    console.log(`Frozen complete dist artifact SHA-256: ${buildArtifactSha256}`);
    console.log('No deploy performed. Freeze this hash with the fresh C1-A packet before requesting C1-B.');
  } else if (!confirmed) {
    const instruction = expectedCrmSourceNotBeforeMs === undefined
      ? '--expected-source-sha <approved-40-character-sha> --confirm'
      : `${boundaryFlag} ${expectedCrmSourceNotBeforeMs} --expected-source-sha <approved-40-character-sha> --confirm-crm-activation`;
    console.log(`No deploy performed. Re-run with ${instruction} after exact-SHA approval.`);
  } else {
    await deployStagingManifest({
      manifest,
      expectedCrmSourceNotBeforeMs,
      expectedSourceSha,
      expectedBuildArtifactSha256,
    });
  }
}
