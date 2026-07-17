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
];

function normalized(value) {
  return String(value ?? '').replaceAll('\\', '/');
}

export function validateStagingDeploymentManifest(manifest, { expectedConfigPath } = {}) {
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
  const d1Names = new Set((manifest.d1_databases ?? []).map((binding) => binding.database_name));
  for (const expected of ['parent-coach-desk-directory-staging', 'parent-coach-desk-ops-staging']) {
    if (!d1Names.has(expected)) errors.push(`missing required isolated staging D1 binding: ${expected}`);
  }
  for (const forbidden of ['activity-radar', 'forge-command', 'parent-coach-desk-ops-production']) {
    if (d1Names.has(forbidden)) errors.push(`production D1 binding is forbidden in staging deploy: ${forbidden}`);
  }
  const r2Names = new Set((manifest.r2_buckets ?? []).map((binding) => binding.bucket_name));
  if (!r2Names.has('parent-coach-desk-staging-photos')) errors.push('missing required isolated staging R2 binding');
  if (r2Names.has('activityradar-photos')) errors.push('production R2 binding is forbidden in staging deploy');
  return errors;
}

function run(command, args, options) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

export async function buildAndVerifyStagingManifest({ projectRoot = process.cwd() } = {}) {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error('deploy-staging-verified.mjs must be run through npm');
  const buildEnvironment = { ...process.env, PCD_OWNER_AUTH_PROOF_ENABLED: 'false' };
  delete buildEnvironment.WRANGLER_CONFIG_PATH;
  run(process.execPath, [npmCli, 'run', 'build'], { cwd: projectRoot, env: buildEnvironment });
  const manifest = JSON.parse(await readFile(resolve(projectRoot, 'dist/server/wrangler.json'), 'utf8'));
  const errors = validateStagingDeploymentManifest(manifest, {
    expectedConfigPath: resolve(projectRoot, 'wrangler.jsonc'),
  });
  if (errors.length > 0) throw new Error(`staging deployment refused:\n- ${errors.join('\n- ')}`);
  return manifest;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const confirmed = process.argv.includes('--confirm');
  const manifest = await buildAndVerifyStagingManifest();
  console.log(`Verified isolated staging manifest for ${manifest.name}.`);
  if (!confirmed) {
    console.log('No deploy performed. Re-run with --confirm after reviewing the generated staging manifest.');
  } else {
    const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    run(npx, ['wrangler', 'deploy', '--config', 'dist/server/wrangler.json', '--keep-vars', '--message', 'verified staging deployment'], { cwd: process.cwd() });
  }
}
