import { describe, expect, it } from 'vitest';
import { deploymentSmokeChecks, runDeploymentSmoke } from '../scripts/smoke-worker-deployment.mjs';

describe('deployment smoke evidence', () => {
  const assetProof = { git_sha: '1'.repeat(40), path: '/_astro/app.abcdefgh.css', bytes: 5, sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' };
  it('covers the complete non-mutating production health set', () => {
    expect(deploymentSmokeChecks('production', assetProof.path).map((item) => item.kind)).toEqual([
      'public_html', 'camp_directory', 'health', 'readiness', 'exact_static_asset', 'non_mutating_api', 'access_redirect',
    ]);
    expect(deploymentSmokeChecks('production', assetProof.path).every((item) => ['GET', 'HEAD'].includes(item.method))).toBe(true);
  });

  it('returns a sanitized receipt and accepts the staging token-absent boundary', async () => {
    const statuses = [200, 200, 200, 200, 200, 503];
    const report = await runDeploymentSmoke({
      origin: 'https://staging.example.com', target: 'staging', assetProof,
      fetchImpl: async (url) => new Response(String(url).includes('/_astro/') ? 'hello' : null, { status: statuses.shift() }),
      now: () => new Date('2026-07-18T09:00:00Z'),
    });
    expect(report).toMatchObject({
      schema_version: 2, target: 'staging', mutation_methods_used: false, credentials_retained: false, passed: true,
      artifact: assetProof,
    });
    expect(report.results).toHaveLength(6);
    expect(JSON.stringify(report)).not.toMatch(/cookie|authorization|location/i);
  });

  it('retries a not-yet-propagated static asset without weakening exact-byte verification', async () => {
    const statuses = [200, 200, 200, 200, 404, 200, 403];
    const delays: number[] = [];
    const report = await runDeploymentSmoke({
      origin: 'https://staging.example.com', target: 'staging', assetProof,
      fetchImpl: async (url) => new Response(String(url).includes('/_astro/') ? 'hello' : null, { status: statuses.shift() }),
      sleep: async (milliseconds) => { delays.push(milliseconds); },
    });
    expect(report.results.find((item) => item.kind === 'exact_static_asset')).toMatchObject({ status: 200, attempts: 2, passed: true });
    expect(delays).toEqual([2_000]);
  });

  it('fails on a missing health surface or unsafe origin', async () => {
    await expect(runDeploymentSmoke({ origin: 'http://example.com', target: 'production', assetProof })).rejects.toThrow('bare HTTPS origin');
    await expect(runDeploymentSmoke({ origin: 'https://example.com', target: 'production', assetProof: { ...assetProof, git_sha: undefined } })).rejects.toThrow('exact static-asset proof');
    await expect(runDeploymentSmoke({
      origin: 'https://example.com', target: 'production', assetProof,
      fetchImpl: async () => new Response(null, { status: 500 }),
    })).rejects.toThrow('smoke failed');
    const statuses = [200, 200, 200, 200, 200];
    await expect(runDeploymentSmoke({
      origin: 'https://example.com', target: 'production', assetProof,
      fetchImpl: async (url) => new Response(String(url).includes('/_astro/') ? 'wrong' : null, { status: statuses.shift() ?? 200 }),
    })).rejects.toThrow('did not match exact built asset bytes');
  });
});
