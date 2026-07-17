import { describe, expect, it, vi } from 'vitest';
import contract from '../automation/rate-limit-contract.json';
import { enforcePublicWriteRateLimit } from '../src/lib/public-rate-limit';

describe('layered public rate-limit contract', () => {
  it('uses separate namespaces for every risk class and environment', () => {
    expect(contract.classes).toHaveLength(5);
    expect(new Set(contract.classes.map((entry) => entry.binding)).size).toBe(5);
    expect(new Set(contract.classes.flatMap((entry) => [entry.staging_namespace, entry.production_namespace])).size).toBe(10);
    expect(contract.missing_binding_behavior).toBe('503_fail_closed');
  });

  it('fails closed when an enabled write has no limiter binding', async () => {
    const response = await enforcePublicWriteRateLimit(undefined, new Request('https://parentcoachdesk.com/api/camps/submit'), 'camp-submit');
    expect(response?.status).toBe(503);
    expect(response?.headers.get('Cache-Control')).toBe('no-store');
  });

  it('hashes the actor and returns 429 with retry guidance on exhaustion', async () => {
    const limit = vi.fn().mockResolvedValue({ success: false });
    const response = await enforcePublicWriteRateLimit({ limit }, new Request('https://parentcoachdesk.com/api/camps/submit'), 'camp-submit', 'Parent@Example.com');
    expect(response?.status).toBe(429);
    expect(response?.headers.get('Retry-After')).toBe('60');
    const key = limit.mock.calls[0][0].key as string;
    expect(key).toMatch(/^camp-submit:[a-f0-9]{64}$/);
    expect(key).not.toContain('parent@example.com');
  });
});
