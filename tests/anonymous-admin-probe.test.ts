import { describe, expect, it } from 'vitest';
import { probeAnonymousAdmin, routeSourceToPath } from '../scripts/probe-anonymous-admin.mjs';
import evidence from '../coordination/release-evidence/anonymous-access-2026-07-18.json';
import protectedRoutes from '../automation/protected-route-contract.json';

describe('anonymous administrative Access probe', () => {
  it('has current live evidence for every protected source route', () => {
    expect(evidence.ok).toBe(true);
    expect(evidence.route_count).toBe(protectedRoutes.routes.length);
    expect(evidence.results).toHaveLength(protectedRoutes.routes.length);
    expect(evidence.results.every((result) => result.protected && result.status === 302)).toBe(true);
    expect(evidence.results.every((result) => result.redirect_origin === 'https://fieldforge.cloudflareaccess.com')).toBe(true);
  });

  it('maps filesystem routes to non-mutating probe paths', () => {
    expect(routeSourceToPath('src/pages/admin/index.astro')).toBe('/admin/');
    expect(routeSourceToPath('src/pages/api/admin/claims/[id]/update.ts')).toBe('/api/admin/claims/probe-id/update');
  });

  it('accepts only redirects to the configured Access origin', async () => {
    const contract = { routes: [{ source: 'src/pages/admin/index.astro' }] };
    const report = await probeAnonymousAdmin({
      contract,
      now: () => new Date('2026-07-16T00:00:00.000Z'),
      fetchImpl: async () => new Response(null, {
        status: 302,
        headers: { location: 'https://fieldforge.cloudflareaccess.com/cdn-cgi/access/login?redacted=1' },
      }),
    });
    expect(report.ok).toBe(true);
    expect(report.results[0]).toEqual({
      path: '/admin/',
      protected: true,
      status: 302,
      redirect_origin: 'https://fieldforge.cloudflareaccess.com',
    });
    expect(JSON.stringify(report)).not.toContain('redacted=1');
  });

  it('fails closed for an application redirect or unprotected response', async () => {
    const responses = [
      new Response(null, { status: 302, headers: { location: 'https://example.com/login' } }),
      new Response('admin', { status: 200 }),
    ];
    const report = await probeAnonymousAdmin({
      contract: { routes: [
        { source: 'src/pages/admin/index.astro' },
        { source: 'src/pages/api/admin/editorial/approve.ts' },
      ] },
      fetchImpl: async () => responses.shift()!,
    });
    expect(report.ok).toBe(false);
    expect(report.results.every((result) => !result.protected)).toBe(true);
  });
});
