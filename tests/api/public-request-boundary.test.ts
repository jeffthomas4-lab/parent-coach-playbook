import { describe, expect, it } from 'vitest';
import { enforcePublicRequestBoundary } from '../../src/lib/public-input';

const request = (body: string, headers: Record<string, string> = {}) => new Request('https://parentcoachdesk.com/api/camps/suggest', {
  method: 'POST', body, headers: { 'content-type': 'text/plain', ...headers },
});

describe('public request boundary', () => {
  it('rejects a cross-origin browser request', async () => {
    const response = await enforcePublicRequestBoundary(request('{}', { origin: 'https://attacker.example' }));
    expect(response?.status).toBe(403);
  });

  it('rejects Sec-Fetch-Site cross-site even without Origin', async () => {
    const response = await enforcePublicRequestBoundary(request('{}', { 'sec-fetch-site': 'cross-site' }));
    expect(response?.status).toBe(403);
  });

  it('accepts same-origin and bounds actual bytes without trusting Content-Length', async () => {
    expect(await enforcePublicRequestBoundary(request('{}', { origin: 'https://parentcoachdesk.com' }), 10)).toBeNull();
    const response = await enforcePublicRequestBoundary(request('x'.repeat(11)), 10);
    expect(response?.status).toBe(413);
  });
});
