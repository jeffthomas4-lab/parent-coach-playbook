import { afterEach, describe, expect, it, vi } from 'vitest';
import { enforcePublicWriteRateLimit } from '../../src/lib/public-rate-limit';

afterEach(() => vi.restoreAllMocks());

describe('public write rate limiting', () => {
  it('allows a successful rate-limit decision', async () => {
    const limiter = { limit: vi.fn().mockResolvedValue({ success: true }) };
    const result = await enforcePublicWriteRateLimit(limiter, new Request('https://parentcoachdesk.com/api/test'), 'test', 'Parent@Example.com');
    expect(result).toBeNull();
    expect(limiter.limit).toHaveBeenCalledWith({ key: expect.stringMatching(/^test:[a-f0-9]{64}$/) });
    expect(JSON.stringify(limiter.limit.mock.calls)).not.toContain('parent@example.com');
  });

  it('returns a non-cacheable 429 without exposing the actor key', async () => {
    const limiter = { limit: vi.fn().mockResolvedValue({ success: false }) };
    const result = await enforcePublicWriteRateLimit(limiter, new Request('https://parentcoachdesk.com/api/test'), 'test', 'parent@example.com');
    expect(result?.status).toBe(429);
    expect(result?.headers.get('retry-after')).toBe('60');
    expect(await result?.text()).not.toContain('parent@example.com');
  });

  it('does not persist or expose raw connecting IP in the binding key', async () => {
    const limiter = { limit: vi.fn().mockResolvedValue({ success: true }) };
    const request = new Request('https://parentcoachdesk.com/api/test', { headers: { 'cf-connecting-ip': '203.0.113.7' } });
    await enforcePublicWriteRateLimit(limiter, request, 'test');
    const key = limiter.limit.mock.calls[0][0].key;
    expect(key).not.toContain('203.0.113.7');
  });
});
