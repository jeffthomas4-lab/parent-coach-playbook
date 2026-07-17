import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkUrlHealth } from '../../src/lib/url-health';

afterEach(() => vi.unstubAllGlobals());

describe('checkUrlHealth redirect safety', () => {
  it('rejects a direct private-network target without fetching it', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await checkUrlHealth('http://169.254.169.254/latest/meta-data');
    expect(result.status).toBe('dead');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a redirect to a private-network target before the second fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      new Response(null, { status: 302, headers: { location: 'http://127.0.0.1/admin' } }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const result = await checkUrlHealth('https://example.com/start');
    expect(result.status).toBe('dead');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('follows a bounded public redirect and records the final URL', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 302, headers: { location: '/camp' } }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await checkUrlHealth('https://example.com/start');
    expect(result).toEqual({ status: 'redirect', statusCode: 200, finalUrl: 'https://example.com/camp' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
