import { describe, expect, it } from 'vitest';
import { deploymentSmokeChecks, runDeploymentSmoke } from '../scripts/smoke-worker-deployment.mjs';

describe('deployment smoke evidence', () => {
  it('covers the complete non-mutating production health set', () => {
    expect(deploymentSmokeChecks('production').map((item) => item.kind)).toEqual([
      'public_html', 'camp_directory', 'health', 'readiness', 'static_asset', 'non_mutating_api', 'access_redirect',
    ]);
    expect(deploymentSmokeChecks('production').every((item) => ['GET', 'HEAD'].includes(item.method))).toBe(true);
  });

  it('returns a sanitized receipt and accepts the staging token-absent boundary', async () => {
    const statuses = [200, 200, 200, 200, 200, 503];
    const report = await runDeploymentSmoke({
      origin: 'https://staging.example.com', target: 'staging',
      fetchImpl: async () => new Response(null, { status: statuses.shift() }),
      now: () => new Date('2026-07-18T09:00:00Z'),
    });
    expect(report).toMatchObject({ target: 'staging', mutation_methods_used: false, credentials_retained: false, passed: true });
    expect(report.results).toHaveLength(6);
    expect(JSON.stringify(report)).not.toMatch(/cookie|authorization|location/i);
  });

  it('fails on a missing health surface or unsafe origin', async () => {
    await expect(runDeploymentSmoke({ origin: 'http://example.com', target: 'production' })).rejects.toThrow('bare HTTPS origin');
    await expect(runDeploymentSmoke({
      origin: 'https://example.com', target: 'production',
      fetchImpl: async () => new Response(null, { status: 500 }),
    })).rejects.toThrow('smoke failed');
  });
});
