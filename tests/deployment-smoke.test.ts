import { describe, expect, it, vi } from 'vitest';
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

  it('recovers from a cached-negative asset response via the cache-busted retry', async () => {
    // `any` is deliberate: this stands in for the platform `fetch`, whose real
    // signature is (URL | RequestInfo, RequestInit<CfProperties>). Restating
    // that in a stub buys nothing and trips strictFunctionTypes on assignment.
    const fetchImpl = async (url: any) => {
      const u = new URL(String(url));
      if (u.pathname === assetProof.path) {
        if (u.searchParams.has('pcd-smoke-retry')) {
          return new Response('hello', { status: 200, headers: { 'content-type': 'text/css' } });
        }
        // A cached negative: cf-cache-status HIT serving an HTML 404 under the
        // asset's own URL. The clean URL must never recover from this.
        return new Response('<html>not found</html>', {
          status: 404,
          headers: { 'content-type': 'text/html', 'cf-cache-status': 'HIT' },
        });
      }
      if (u.pathname === '/api/agent-runs') return new Response(null, { status: 403 });
      return new Response(null, { status: 200 });
    };
    const report = await runDeploymentSmoke({
      origin: 'https://staging.example.com', target: 'staging', assetProof,
      fetchImpl,
      sleep: async () => {},
    });
    const assetResult = report.results.find((item) => item.kind === 'exact_static_asset');
    expect(assetResult).toMatchObject({ passed: true, asset_matched: true });
    expect(assetResult).toBeDefined();
    expect(assetResult!.attempts).toBeGreaterThan(1);
  });

  it('sends cache-defeating headers on the asset request', async () => {
    const capturedHeaders: Record<string, string>[] = [];
    const fetchImpl = async (url: any, init: any) => {
      const u = new URL(String(url));
      if (u.pathname === assetProof.path) {
        capturedHeaders.push(init.headers);
        return new Response('hello', { status: 200 });
      }
      if (u.pathname === '/api/agent-runs') return new Response(null, { status: 403 });
      return new Response(null, { status: 200 });
    };
    await runDeploymentSmoke({ origin: 'https://staging.example.com', target: 'staging', assetProof, fetchImpl });
    expect(capturedHeaders.length).toBeGreaterThan(0);
    for (const headers of capturedHeaders) {
      expect(headers['cache-control']).toBe('no-cache');
      expect(headers['pragma']).toBe('no-cache');
    }
  });

  it('keeps the canonical asset path in the report even after a cache-busted retry', async () => {
    // `any` is deliberate: this stands in for the platform `fetch`, whose real
    // signature is (URL | RequestInfo, RequestInit<CfProperties>). Restating
    // that in a stub buys nothing and trips strictFunctionTypes on assignment.
    const fetchImpl = async (url: any) => {
      const u = new URL(String(url));
      if (u.pathname === assetProof.path) {
        if (u.searchParams.has('pcd-smoke-retry')) return new Response('hello', { status: 200 });
        return new Response('<html>not found</html>', { status: 404, headers: { 'content-type': 'text/html' } });
      }
      if (u.pathname === '/api/agent-runs') return new Response(null, { status: 403 });
      return new Response(null, { status: 200 });
    };
    const report = await runDeploymentSmoke({
      origin: 'https://staging.example.com', target: 'staging', assetProof, fetchImpl,
      sleep: async () => {},
    });
    const assetResult = report.results.find((item) => item.kind === 'exact_static_asset');
    expect(assetResult).toBeDefined();
    expect(assetResult!.path).toBe(assetProof.path);
    expect(assetResult!.path).not.toMatch(/\?/);
  });

  it('reports an inconclusive diagnosis instead of a false build-mismatch claim', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // `any` is deliberate: this stands in for the platform `fetch`, whose real
    // signature is (URL | RequestInfo, RequestInit<CfProperties>). Restating
    // that in a stub buys nothing and trips strictFunctionTypes on assignment.
    const fetchImpl = async (url: any) => {
      const u = new URL(String(url));
      if (u.pathname === assetProof.path) {
        // Not a cached negative: no cf-cache-status HIT, not text/html. A
        // genuine 404 with no propagation-lag signal.
        return new Response('nope', { status: 404, headers: { 'content-type': 'application/octet-stream' } });
      }
      if (u.pathname === '/') {
        return new Response('<html><script src="/_astro/other.PLECURTe.js"></script></html>', {
          status: 200,
          headers: { 'content-type': 'text/html' },
        });
      }
      if (u.pathname === '/api/agent-runs') return new Response(null, { status: 403 });
      return new Response(null, { status: 200 });
    };
    await expect(runDeploymentSmoke({
      origin: 'https://staging.example.com', target: 'staging', assetProof, fetchImpl,
      sleep: async () => {},
    })).rejects.toThrow('smoke failed');
    const logged = errorSpy.mock.calls.map((args) => args.join(' ')).join('\n');
    expect(logged).toMatch(/Inconclusive/i);
    expect(logged).not.toMatch(/origin is serving HTML from a different build/i);
    errorSpy.mockRestore();
  });
});
