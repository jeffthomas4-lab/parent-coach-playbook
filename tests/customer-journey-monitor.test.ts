import { describe, expect, it, vi } from 'vitest';
import { runCustomerJourneyMonitor } from '../scripts/run-customer-journey-monitor.mjs';

const healthyFetch = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
  const url = input instanceof URL ? input : new URL(typeof input === 'string' ? input : input.url);
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
  }
  const labels: Record<string, string> = {
    '/': 'Parent Coach Desk',
    '/camps/': 'Camps &amp; Leagues',
    '/disclosure/': 'privacy',
    '/terms/': 'Terms',
  };
  return new Response(`<html><main>${labels[url.pathname]}</main></html>`, { headers: { 'content-type': 'text/html' } });
});

describe('independent customer journey monitor', () => {
  it('uses bounded read-only requests and reports healthy components', async () => {
    const report = await runCustomerJourneyMonitor({
      fetchImpl: healthyFetch as typeof fetch,
      now: () => new Date('2026-07-16T12:00:00.000Z'),
    });
    expect(report.ok).toBe(true);
    expect(report.results).toHaveLength(6);
    expect(report.results.every((row) => row.code === 'ok')).toBe(true);
    expect(healthyFetch).toHaveBeenCalledTimes(6);
    for (const [, init] of healthyFetch.mock.calls) expect(init).toMatchObject({ method: 'GET', redirect: 'error' });
  });

  it('fails explicitly on a customer-visible contract break without recording response content', async () => {
    const report = await runCustomerJourneyMonitor({
      fetchImpl: vi.fn(async () => new Response('<html><main>wrong</main></html>', { headers: { 'content-type': 'text/html' } })),
    });
    expect(report.ok).toBe(false);
    expect(report.results[0]).toMatchObject({ id: 'home', code: 'required_marker_missing' });
    expect(JSON.stringify(report)).not.toContain('<html>');
  });

  it('rejects insecure non-local monitor targets', async () => {
    await expect(runCustomerJourneyMonitor({ baseUrl: 'http://example.com' })).rejects.toThrow('HTTPS');
  });
});
