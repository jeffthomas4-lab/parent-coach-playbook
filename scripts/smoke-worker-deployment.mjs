#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const STATIC_ASSET_MAX_ATTEMPTS = 6;
const STATIC_ASSET_RETRY_MS = 2_000;

const valueAfter = (argv, flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

export function deploymentSmokeChecks(target, assetPath) {
  const checks = [
    { path: '/', method: 'GET', statuses: [200], kind: 'public_html' },
    { path: '/camps/', method: 'GET', statuses: [200], kind: 'camp_directory' },
    { path: '/api/health', method: 'GET', statuses: [200], kind: 'health' },
    { path: '/api/ready', method: 'GET', statuses: [200], kind: 'readiness' },
    { path: assetPath, method: 'GET', statuses: [200], kind: 'exact_static_asset' },
    // HEAD is intentionally non-mutating. Staging may omit the task token;
    // production must see it and reject an unauthenticated caller with 403.
    { path: '/api/agent-runs', method: 'HEAD', statuses: target === 'production' ? [403] : [403, 503], kind: 'non_mutating_api' },
  ];
  if (target === 'production') checks.push({ path: '/admin', method: 'GET', statuses: [302], kind: 'access_redirect' });
  return checks;
}

export async function runDeploymentSmoke({
  origin,
  target,
  assetProof,
  fetchImpl = fetch,
  now = () => new Date(),
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
}) {
  if (!origin || !['staging', 'production'].includes(target)) throw new Error('target must be staging or production');
  const base = new URL(origin);
  if (base.protocol !== 'https:' || base.pathname !== '/' || base.search || base.hash) throw new Error('origin must be a bare HTTPS origin');
  if (!assetProof || !/^[0-9a-f]{40}$/.test(assetProof.git_sha ?? '') || !/^\/_astro\/[A-Za-z0-9._-]+$/.test(assetProof.path ?? '') || !/^[0-9a-f]{64}$/.test(assetProof.sha256 ?? '') || !(assetProof.bytes > 0)) throw new Error('a valid exact static-asset proof is required');
  const results = [];
  for (const check of deploymentSmokeChecks(target, assetProof.path)) {
    let response;
    let attempts = 0;
    do {
      attempts += 1;
      response = await fetchImpl(new URL(check.path, base), {
        method: check.method,
        redirect: 'manual',
        headers: { 'user-agent': `pcd-${target}-deployment-smoke/2` },
      });
      if (check.kind !== 'exact_static_asset' || check.statuses.includes(response.status) || attempts === STATIC_ASSET_MAX_ATTEMPTS) break;
      await sleep(STATIC_ASSET_RETRY_MS);
    } while (true);
    let assetMatched = null;
    if (check.kind === 'exact_static_asset' && check.statuses.includes(response.status)) {
      const body = Buffer.from(await response.arrayBuffer());
      assetMatched = body.byteLength === assetProof.bytes && createHash('sha256').update(body).digest('hex') === assetProof.sha256;
    }
    const passed = check.statuses.includes(response.status) && assetMatched !== false;
    results.push({ path: check.path, method: check.method, kind: check.kind, status: response.status, attempts, asset_matched: assetMatched, passed });
    if (assetMatched === false) throw new Error(`${target} smoke failed: ${check.path} did not match exact built asset bytes`);
    if (!passed) throw new Error(`${target} smoke failed: ${check.path} returned ${response.status}; expected ${check.statuses.join(' or ')}`);
  }
  return {
    schema_version: 2,
    target,
    origin: base.origin,
    artifact: {
      git_sha: assetProof.git_sha,
      path: assetProof.path,
      bytes: assetProof.bytes,
      sha256: assetProof.sha256,
    },
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
  const assetProofPath = valueAfter(argv, '--asset-proof');
  if (!origin || !target || !assetProofPath) throw new Error('usage: smoke-worker-deployment.mjs --origin <https-origin> --target staging|production --asset-proof <file> [--report <path>]');
  const assetProof = JSON.parse(await readFile(assetProofPath, 'utf8'));
  const report = await runDeploymentSmoke({ origin, target, assetProof });
  for (const item of report.results) console.log(`${target} smoke passed: ${item.path} -> ${item.status}`);
  if (reportPath) await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
