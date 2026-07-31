#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

// Asset propagation budget.
//
// Was 6 attempts × 2s = a 10-second window. Every deploy on 2026-07-30 failed
// inside it: the step ran 11s, meaning it burned all six attempts and the asset
// still was not being served. Cloudflare had not finished making the new build's
// assets available at the edge yet, so this was never a bad build — the budget
// was simply shorter than propagation.
//
// The earlier fix that session (STANDARD-AUDIT item 55, pick a homepage-
// referenced asset instead of the largest route-only chunk) was correct on its
// own terms and did not fix this, because the binding constraint is time, not
// which asset gets probed. Both matter: probe something the homepage loads, AND
// wait long enough for it to exist.
//
// Now: 12 attempts on a growing backoff, capped at 10s, for a ~90 second
// budget. Retries past the first already bust the cache key with a unique query
// param, which is what defeats a negative cached during the window.
const STATIC_ASSET_MAX_ATTEMPTS = 12;
const STATIC_ASSET_RETRY_CAP_MS = 10_000;
/** 2s, 4s, 6s, 8s, then 10s each — ~90s total across 12 attempts. */
export const staticAssetRetryDelayMs = (attempt) =>
  Math.min(2_000 * attempt, STATIC_ASSET_RETRY_CAP_MS);

const valueAfter = (argv, flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

// Cache and routing headers only. Never Set-Cookie, Authorization, or anything
// that could carry a credential into a build log.
const DIAGNOSTIC_HEADERS = ['cf-cache-status', 'cf-ray', 'age', 'content-type', 'content-length', 'etag', 'server'];

// A 404 on the exact built asset alone tells us the status and nothing else,
// which is not enough to tell "this version never shipped its assets" apart
// from "the edge cached a negative response before the asset ever propagated".
// Cloudflare can and does cache a 404 HTML error page under the asset's own
// content-hashed URL (cf-cache-status: HIT, content-type: text/html), and a
// retry against that same URL will keep reading the cached negative forever,
// never the real asset. So on failure: (1) if the response itself looks like
// a cached negative, say so plainly rather than blaming the build. (2)
// Otherwise, ask the live origin what asset URLs its own homepage currently
// references. If the homepage references a different build, that is a real
// build-mismatch signal worth keeping. If it does not, that is inconclusive
// rather than proof of a stale build: the asset proof selects the largest
// hashed asset, which may be a route-specific chunk (for example the Leaflet
// bundle used only by /camps/) that the homepage would never reference
// regardless of how fresh the build is.
async function diagnoseAssetFailure({ base, response, expectedPath, fetchImpl }) {
  const headers = {};
  for (const name of DIAGNOSTIC_HEADERS) {
    const value = response.headers?.get?.(name);
    if (value) headers[name] = value;
  }
  const cacheStatus = (headers['cf-cache-status'] ?? '').toUpperCase();
  const contentType = (headers['content-type'] ?? '').toLowerCase();
  const looksLikeCachedNegative = cacheStatus === 'HIT' || contentType.includes('text/html');
  let referencedAssets = null;
  let note = null;
  try {
    const home = await fetchImpl(new URL('/', base), {
      method: 'GET',
      redirect: 'manual',
      headers: { 'user-agent': 'pcd-deployment-smoke-diagnostic/1' },
    });
    if (home.status === 200) {
      const html = await home.text();
      referencedAssets = [...new Set(html.match(/\/_astro\/[A-Za-z0-9._-]+\.(?:js|css)/g) ?? [])].slice(0, 8);
      if (looksLikeCachedNegative) {
        note = 'The failing response looks like a cached negative (cf-cache-status HIT and/or content-type text/html on a JS/CSS path), which a retry against the same URL cannot recover from. This points at asset propagation lag plus edge negative caching, not a missing build.';
      } else if (referencedAssets.includes(expectedPath)) {
        note = 'The live homepage references the expected asset, so the deployed HTML and the missing asset come from the same build.';
      } else {
        note = 'Inconclusive: the live homepage does not reference the expected asset, but the asset proof selects the largest hashed asset, which can be a route-specific chunk (for example the Leaflet bundle used only by /camps/) that the homepage would never load. This does not by itself indicate a build mismatch.';
      }
    } else {
      note = `Diagnostic homepage fetch returned ${home.status}, so the asset reference comparison is unavailable rather than assumed.`;
    }
  } catch (error) {
    note = `Diagnostic homepage fetch failed (${error?.message ?? 'unknown error'}), so the asset reference comparison is unavailable rather than assumed.`;
  }
  return { expected_asset: expectedPath, response_headers: headers, homepage_referenced_assets: referencedAssets, observation: note };
}

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
      // Every attempt asks the edge not to serve a cached response. That alone
      // reduces the odds of a poisoned negative, but Cloudflare can still hand
      // back a cached 404 despite the request header, so retries beyond the
      // first also bust the cache key itself with a unique query param. The
      // canonical, no-query URL is only ever used on attempt 1 (what a real
      // user loads) and is what gets recorded in the report below.
      const requestUrl = new URL(check.path, base);
      if (check.kind === 'exact_static_asset' && attempts > 1) {
        requestUrl.searchParams.set('pcd-smoke-retry', `${Date.now()}-${attempts}`);
      }
      response = await fetchImpl(requestUrl, {
        method: check.method,
        redirect: 'manual',
        headers: {
          'user-agent': `pcd-${target}-deployment-smoke/2`,
          'cache-control': 'no-cache',
          'pragma': 'no-cache',
        },
      });
      if (check.kind !== 'exact_static_asset' || check.statuses.includes(response.status) || attempts === STATIC_ASSET_MAX_ATTEMPTS) break;
      await sleep(staticAssetRetryDelayMs(attempts));
    } while (true);
    let assetMatched = null;
    if (check.kind === 'exact_static_asset' && check.statuses.includes(response.status)) {
      const body = Buffer.from(await response.arrayBuffer());
      assetMatched = body.byteLength === assetProof.bytes && createHash('sha256').update(body).digest('hex') === assetProof.sha256;
    }
    const passed = check.statuses.includes(response.status) && assetMatched !== false;
    results.push({ path: check.path, method: check.method, kind: check.kind, status: response.status, attempts, asset_matched: assetMatched, passed });
    if (!passed && check.kind === 'exact_static_asset') {
      const diagnostic = await diagnoseAssetFailure({ base, response, expectedPath: check.path, fetchImpl });
      console.error(`${target} static-asset diagnostic:\n${JSON.stringify(diagnostic, null, 2)}`);
    }
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
