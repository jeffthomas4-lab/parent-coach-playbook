import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
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

function normalized(value) {
  return String(value ?? '').replaceAll('\\', '/');
}

function validActivationBoundary(value) {
  const parsed = Number(value);
  return /^\d+$/.test(String(value ?? '')) && Number.isSafeInteger(parsed) && parsed > 0 && parsed % 1000 === 0;
}

function hasExactBinding(actual, expected, fields) {
  return actual.some((binding) => fields.every((field) => binding?.[field] === expected[field]));
}

export function parseDeploymentArguments(args) {
  const parsed = {
    disabledConfirmed: false,
    activationConfirmed: false,
    expectedCrmSourceNotBeforeMs: undefined,
  };
  const seen = new Set();
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (!['--confirm', '--confirm-crm-activation', '--crm-activation-boundary-ms'].includes(argument)) {
      throw new Error(`unknown deployment argument: ${argument}`);
    }
    if (seen.has(argument)) throw new Error(`duplicate deployment argument: ${argument}`);
    seen.add(argument);
    if (argument === '--confirm') parsed.disabledConfirmed = true;
    if (argument === '--confirm-crm-activation') parsed.activationConfirmed = true;
    if (argument === '--crm-activation-boundary-ms') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--crm-activation-boundary-ms requires the exact approved Unix-millisecond boundary');
      }
      parsed.expectedCrmSourceNotBeforeMs = value;
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
  if (parsed.expectedCrmSourceNotBeforeMs !== undefined
    && !validActivationBoundary(parsed.expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be a positive second-aligned Unix millisecond value');
  }
  return parsed;
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
  const activationBoundary = manifest.vars?.PCD_CRM_SOURCE_NOT_BEFORE_MS;
  if (expectedCrmSourceNotBeforeMs === undefined) {
    if (adapterEnabled !== 'false') {
      errors.push('PCD_CRM_ADAPTER_ENABLED must remain false unless an exact activation boundary is supplied');
    }
    if (activationBoundary !== undefined) {
      errors.push('PCD_CRM_SOURCE_NOT_BEFORE_MS must be absent while the CRM adapter is disabled');
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

function run(command, args, options) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

export async function buildAndVerifyStagingManifest({
  projectRoot = process.cwd(),
  expectedCrmSourceNotBeforeMs,
} = {}) {
  if (expectedCrmSourceNotBeforeMs !== undefined
    && !validActivationBoundary(expectedCrmSourceNotBeforeMs)) {
    throw new Error('activation boundary must be a positive second-aligned Unix millisecond value');
  }
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('deploy-staging-verified.mjs must be run through npm');
  const buildEnvironment = { ...process.env, PCD_OWNER_AUTH_PROOF_ENABLED: 'false' };
  delete buildEnvironment.WRANGLER_CONFIG_PATH;
  run(process.execPath, [npmCli, 'run', 'build'], { cwd: projectRoot, env: buildEnvironment });
  const manifest = JSON.parse(await readFile(resolve(projectRoot, 'dist/server/wrangler.json'), 'utf8'));
  const errors = validateStagingDeploymentManifest(manifest, {
    expectedConfigPath: resolve(projectRoot, 'wrangler.jsonc'),
    expectedCrmSourceNotBeforeMs,
  });
  if (errors.length > 0) throw new Error(`staging deployment refused:\n- ${errors.join('\n- ')}`);
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const boundaryFlag = '--crm-activation-boundary-ms';
  const { disabledConfirmed, activationConfirmed, expectedCrmSourceNotBeforeMs } = parseDeploymentArguments(
    process.argv.slice(2),
  );
  const manifest = await buildAndVerifyStagingManifest({ expectedCrmSourceNotBeforeMs });
  console.log(`Verified isolated staging manifest for ${manifest.name}.`);
  const confirmed = expectedCrmSourceNotBeforeMs === undefined ? disabledConfirmed : activationConfirmed;
  if (!confirmed) {
    const instruction = expectedCrmSourceNotBeforeMs === undefined
      ? '--confirm'
      : `${boundaryFlag} ${expectedCrmSourceNotBeforeMs} --confirm-crm-activation`;
    console.log(`No deploy performed. Re-run with ${instruction} after exact-SHA approval.`);
  } else {
    const npmCli = process.env.npm_execpath;
    if (!npmCli) throw new Error('deploy-staging-verified.mjs must be run through npm');
    const message = expectedCrmSourceNotBeforeMs === undefined
      ? 'verified staging deployment'
      : `Gate 9C-C CRM pilot activation ${expectedCrmSourceNotBeforeMs}`;
    run(process.execPath, [npmCli, 'exec', '--', 'wrangler', 'deploy', '--config', 'dist/server/wrangler.json', '--keep-vars', '--message', message], { cwd: process.cwd() });
  }
}
