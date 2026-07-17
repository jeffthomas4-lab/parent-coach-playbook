#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PROOF_ROUTE_PATHS = [
  '/owner-proof/login',
  '/owner-proof/signup',
  '/owner-proof/callback',
  '/owner-proof/logout',
  '/owner-proof/session',
];

export function verifyDeploymentManifest(manifest, serverEntry = '') {
  const failures = [];
  const expectEqual = (label, actual, expected) => {
    if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  };
  const expectBindings = (label, entries, expected, property = 'binding') => {
    const actual = (entries ?? []).map((entry) => entry[property]).sort();
    const wanted = [...expected].sort();
    if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
      failures.push(`${label}: expected ${wanted.join(', ')}, received ${actual.join(', ') || '(none)'}`);
    }
  };

  expectEqual('Worker name', manifest.name, 'parent-coach-desk');
  expectEqual('top-level Worker name', manifest.topLevelName, 'parent-coach-desk');
  if (!String(manifest.configPath ?? '').replaceAll('\\', '/').endsWith('/wrangler.production.jsonc')) {
    failures.push(`config path is not wrangler.production.jsonc: ${manifest.configPath ?? '(missing)'}`);
  }
  expectBindings('D1 bindings', manifest.d1_databases, ['DB', 'FORGE_DB', 'PCD_OPS_DB']);
  expectBindings('R2 bindings', manifest.r2_buckets, ['PHOTOS']);
  expectBindings('KV bindings', manifest.kv_namespaces, ['SESSION']);
  expectBindings('rate-limit bindings', manifest.ratelimits, [
    'PUBLIC_SUBMISSION_RATE_LIMITER',
    'TRUST_RATE_LIMITER',
    'COMMUNITY_RATE_LIMITER',
    'DEMAND_RATE_LIMITER',
    'OWNER_RATE_LIMITER',
  ], 'name');
  expectEqual('assets binding', manifest.assets?.binding, 'ASSETS');
  const workerFirst = [...(manifest.assets?.run_worker_first ?? [])].sort();
  const expectedWorkerFirst = ['/admin', '/admin/*', '/api/admin', '/api/admin/*'].sort();
  expectEqual('administrative Worker-first routes', JSON.stringify(workerFirst), JSON.stringify(expectedWorkerFirst));
  expectEqual('site URL', manifest.vars?.SITE_URL, 'https://parentcoachdesk.com');
  expectEqual('observability enabled', manifest.observability?.enabled, true);
  expectEqual('observability sampling', manifest.observability?.head_sampling_rate, 1);

  for (const key of ['ADMIN_EMAILS', 'ACCESS_TEAM_DOMAIN', 'ACCESS_AUD']) {
    if (typeof manifest.vars?.[key] !== 'string' || manifest.vars[key].trim() === '') {
      failures.push(`${key} must be a non-empty production variable`);
    }
  }
  for (const key of [
    'CAMP_CLAIMS_ENABLED',
    'CAMP_REVIEWS_ENABLED',
    'TRUST_INTAKE_ENABLED',
    'DEMAND_TELEMETRY_ENABLED',
    'IDEMPOTENCY_CLEANUP_ENABLED',
    'PCD_CUSTOMER_FOUNDATION_ENABLED',
    'PCD_COMMERCE_TEST_MODE_ENABLED',
  ]) {
    expectEqual(`${key} safe default`, manifest.vars?.[key], 'false');
  }

  for (const key of Object.keys(manifest.vars ?? {})) {
    if (key === 'PCD_OWNER_AUTH_PROOF_ENABLED' || key.startsWith('WORKOS_')) {
      failures.push(`production manifest must not contain disposable identity proof variable ${key}`);
    }
  }

  for (const route of PROOF_ROUTE_PATHS) {
    const escaped = route.replaceAll('/', '\\/');
    if (serverEntry.includes(`"route":"${route}"`)
      || serverEntry.includes(`"route": "${route}"`)
      || serverEntry.includes(`"route":"${escaped}"`)
      || serverEntry.includes(`"route": "${escaped}"`)) {
      failures.push(`production artifact contains injected disposable identity route ${route}`);
    }
  }
  return failures;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const manifestArg = process.argv.indexOf('--manifest');
  const manifestPath = resolve(
    manifestArg >= 0 ? process.argv[manifestArg + 1] ?? '' : 'dist/server/wrangler.json',
  );
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const serverEntryPath = resolve(manifestPath, '..', 'entry.mjs');
  const serverEntry = await readFile(serverEntryPath, 'utf8');
  const failures = verifyDeploymentManifest(manifest, serverEntry);
  if (failures.length > 0) {
    console.error('Production deployment manifest verification failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('Production deployment manifest verified: identity, bindings, Access vars, observability, and safe feature defaults match the release contract.');
  }
}
