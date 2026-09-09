#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { verifyDeploymentManifest } from './check-deployment-manifest.mjs';

export const PRODUCTION_CRM_IDENTITIES = Object.freeze({
  directoryDatabaseId: '8cc3694a-26f8-4a56-b131-d5d3a68c49ef',
  forgeDatabaseId: '747cf988-a557-48bd-9d03-bea09e184f94',
  opsDatabaseId: 'b38d5f37-54df-4e0f-9706-023edc12c7fe',
  receiverService: 'field-forge-crm',
});

function exactBinding(entries, binding) {
  return (entries ?? []).find((entry) => entry?.binding === binding);
}

export function validateProductionCrmDisabledManifest(manifest, serverEntry = '') {
  const failures = [...verifyDeploymentManifest(manifest, serverEntry)];
  const expectedD1 = [
    ['DB', 'activity-radar', PRODUCTION_CRM_IDENTITIES.directoryDatabaseId],
    ['FORGE_DB', 'forge-command', PRODUCTION_CRM_IDENTITIES.forgeDatabaseId],
    ['PCD_OPS_DB', 'parent-coach-desk-ops-production', PRODUCTION_CRM_IDENTITIES.opsDatabaseId],
  ];
  for (const [binding, databaseName, databaseId] of expectedD1) {
    const actual = exactBinding(manifest.d1_databases, binding);
    if (actual?.database_name !== databaseName || actual?.database_id !== databaseId) {
      failures.push(`${binding} must target production D1 ${databaseName} (${databaseId})`);
    }
  }

  const service = exactBinding(manifest.services, 'CRM_ADAPTER');
  if (service?.service !== PRODUCTION_CRM_IDENTITIES.receiverService
    || Object.keys(service ?? {}).length !== 2) {
    failures.push('CRM_ADAPTER must be the exact field-forge-crm production service binding');
  }
  if (manifest.vars?.PCD_CRM_ADAPTER_ENABLED !== 'false') {
    failures.push('PCD_CRM_ADAPTER_ENABLED must remain false for the disabled producer release');
  }
  if (manifest.vars?.PCD_CRM_BACKFILL_ENABLED !== 'false') {
    failures.push('PCD_CRM_BACKFILL_ENABLED must remain false for the disabled producer release');
  }
  if (Object.hasOwn(manifest.vars ?? {}, 'PCD_CRM_SOURCE_NOT_BEFORE_MS')) {
    failures.push('PCD_CRM_SOURCE_NOT_BEFORE_MS must remain absent for the disabled producer release');
  }
  const requiredSecrets = new Set(manifest.secrets?.required ?? []);
  if (!requiredSecrets.has('PCD_CRM_ADAPTER_HMAC_SECRET')) {
    failures.push('PCD_CRM_ADAPTER_HMAC_SECRET must be declared as a required production secret');
  }
  return [...new Set(failures)];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifestIndex = process.argv.indexOf('--manifest');
  const manifestPath = resolve(manifestIndex >= 0 ? process.argv[manifestIndex + 1] ?? '' : 'dist/server/wrangler.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const serverEntry = await readFile(resolve(manifestPath, '..', 'entry.mjs'), 'utf8');
  const failures = validateProductionCrmDisabledManifest(manifest, serverEntry);
  if (failures.length > 0) {
    process.stderr.write(`Disabled production CRM release verification failed:\n- ${failures.join('\n- ')}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write('Disabled production CRM release manifest verified.\n');
  }
}
