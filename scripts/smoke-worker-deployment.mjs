#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const valueAfter = (argv, flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

export function deploymentSmokeChecks(target) {
  const checks = [
    { path: '/', method: 'GET', statuses: [200], kind: 'public_html' },
    { path: '/camps/', method: 'GET', statuses: [200], kind: 'camp_directory' },
    { path: '/api/health', method: 'GET', statuses: [200], kind: 'health' },
    { path: '/api/ready', method: 'GET', statuses: [200], kind: 'readiness' },
    { path: '/favicon.svg', method: 'GET', statuses: [200], kind: 'static_asset' },
    // HEAD is intentionally non-mutating. Staging may omit the task token;
    // production must see it and reject an unauthenticated caller with 403.
    { path: '/api/agent-runs', method: 'HEAD', statuses: target === 'production' ? [403] : [403, 503], kind: 'non_mutating_api' },
  ];
  if (target === 'production') checks.push({ path: '/admin', method: 'GET', statuses: [302], kind: 'access_redirect' });
  return checks;
}

export async function runDeploymentSmoke({ origin, target, fetchImpl = fetch, now = () => new Date() }) {
  if (!origin || !['staging', 'production'].includes(target)) throw new Error('target must be staging or production');
  const base = new URL(origin);
  if (base.protocol !== 'https:' || base.pathname !== '/' || base.search || base.hash) throw new Error('origin must be a bare HTTPS origin');
  const results = [];
  for (const check of deploymentSmokeChecks(target)) {
    const response = await fetchImpl(new URL(check.path, base), {
      method: check.method,
      redirect: 'manual',
      headers: { 'user-agent': `pcd-${target}-deployment-smoke/2` },
    });
    const passed = check.statuses.includes(response.status);
    results.push({ path: check.path, method: check.method, kind: check.kind, status: response.status, passed });
    if (!passed) throw new Error(`${target} smoke failed: ${check.path} returned ${response.status}; expected ${check.statuses.join(' or ')}`);
  }
  return {
    schema_version: 1,
    target,
    origin: base.origin,
    observed_at: now().toISOString(),
    mutation_methods_used: false,
    credentials_retained: false,
    passed: true,
    results,
  };
}

async function main() {
  const argv = process.argv.slice(2);
  const origin = valueAfter(argv, '--origin');
  const target = valueAfter(argv, '--target');
  const reportPath = valueAfter(argv, '--report');
  if (!origin || !target) throw new Error('usage: smoke-worker-deployment.mjs --origin <https-origin> --target staging|production [--report <path>]');
  const report = await runDeploymentSmoke({ origin, target });
  for (const item of report.results) console.log(`${target} smoke passed: ${item.path} -> ${item.status}`);
  if (reportPath) await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
