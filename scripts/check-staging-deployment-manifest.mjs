#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { validateStagingDeploymentManifest } from './deploy-staging-verified.mjs';

const manifestPath = resolve('dist/server/wrangler.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const failures = validateStagingDeploymentManifest(manifest, {
  expectedConfigPath: resolve('wrangler.jsonc'),
});
if (failures.length) {
  console.error('Staging deployment manifest verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('Staging deployment manifest verified as isolated and default-off.');
}
