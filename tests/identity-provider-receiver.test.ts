import { describe, expect, it, vi } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { receiveIdentityProviderEvent, type IdentityProviderSignatureVerifier } from '../src/lib/identity-provider-receiver';

vi.mock('../src/lib/customer-store', () => ({ recordIdentityProviderEvent: vi.fn().mockResolvedValue('created') }));
import { recordIdentityProviderEvent } from '../src/lib/customer-store';

const now = new Date('2026-07-16T12:00:00Z');
const request = (body: string, headers: Record<string, string> = {}) => new Request('https://example.test/provider/events', { method: 'POST', body, headers: { 'content-type': 'application/json', ...headers } });
const verifier = (overrides: Partial<IdentityProviderSignatureVerifier> = {}): IdentityProviderSignatureVerifier => ({
  providerCode: 'disposable',
  verify: vi.fn().mockResolvedValue({ providerEventId: 'event-1', eventType: 'user.updated', issuedAtUnixSeconds: Math.floor(now.getTime() / 1000) }),
  ...overrides,
});

describe('identity provider receiver composition', () => {
  it('persists only after provider-specific signature and timestamp verification', async () => {
    await expect(receiveIdentityProviderEvent({ request: request('{"id":"event-1"}'), db: {} as D1Database, verifier: verifier(), now, eventRecordId: 'record-1' })).resolves.toEqual({ accepted: true, outcome: 'created' });
    expect(recordIdentityProviderEvent).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ providerCode: 'disposable', providerEventId: 'event-1', payloadSha256: expect.stringMatching(/^[a-f0-9]{64}$/) }));
  });

  it('rejects invalid signatures and stale envelopes before persistence', async () => {
    vi.mocked(recordIdentityProviderEvent).mockClear();
    await expect(receiveIdentityProviderEvent({ request: request('{}'), db: {} as D1Database, verifier: verifier({ verify: vi.fn().mockResolvedValue(null) }), now, eventRecordId: 'record-1' })).resolves.toEqual({ accepted: false, status: 401, code: 'signature_invalid' });
    await expect(receiveIdentityProviderEvent({ request: request('{}'), db: {} as D1Database, verifier: verifier({ verify: vi.fn().mockResolvedValue({ providerEventId: 'event-1', eventType: 'user.updated', issuedAtUnixSeconds: Math.floor(now.getTime() / 1000) - 301 }) }), now, eventRecordId: 'record-1' })).resolves.toEqual({ accepted: false, status: 401, code: 'event_stale' });
    expect(recordIdentityProviderEvent).not.toHaveBeenCalled();
  });

  it('bounds and validates the exact raw JSON body', async () => {
    await expect(receiveIdentityProviderEvent({ request: new Request('https://example.test', { method: 'POST', body: '{}', headers: { 'content-type': 'text/plain' } }), db: {} as D1Database, verifier: verifier(), now, eventRecordId: 'record-1' })).resolves.toEqual({ accepted: false, status: 415, code: 'json_required' });
    await expect(receiveIdentityProviderEvent({ request: request('not-json'), db: {} as D1Database, verifier: verifier(), now, eventRecordId: 'record-1' })).resolves.toEqual({ accepted: false, status: 400, code: 'invalid_json' });
    await expect(receiveIdentityProviderEvent({ request: request('{}', { 'content-length': String(256 * 1024 + 1) }), db: {} as D1Database, verifier: verifier(), now, eventRecordId: 'record-1' })).resolves.toEqual({ accepted: false, status: 413, code: 'event_too_large' });
  });
});
