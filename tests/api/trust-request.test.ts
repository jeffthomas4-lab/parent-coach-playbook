import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonRequest, makeContext, readJson } from '../helpers/context';

// Turnstile fails closed (src/lib/turnstile.ts): every request past the
// honeypot check must carry a token, and TURNSTILE_SECRET_KEY must be set in
// env, or the route returns 503 before doing anything else (including before
// looking up an idempotency key). Tests that reach that far supply a secret
// and a token, and stub the Cloudflare siteverify call to succeed.
const TURNSTILE_SECRET = 'test-turnstile-secret';
const TURNSTILE_TOKEN = 'test-turnstile-token';
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function stubTurnstileSuccess() {
  const fetchMock = vi.fn(async (url: string) => {
    if (url === SITEVERIFY_URL) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    throw new Error(`unexpected fetch to ${url} in this suite`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

vi.mock('../../src/lib/trust-cases', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../src/lib/trust-cases')>();
  return {
    ...original,
    findTrustCaseByIntakeKey: vi.fn().mockResolvedValue(null),
    insertTrustCase: vi.fn().mockImplementation(async (_db, value) => ({ outcome: 'created', id: value.id })),
  };
});

import { POST } from '../../src/pages/api/trust/request';
import * as trustCases from '../../src/lib/trust-cases';

const valid = {
  category: 'listing_correction',
  target_url: 'https://parentcoachdesk.com/camps/test-camp/',
  camp_slug: 'test-camp',
  requester_email: 'Parent@Example.com',
  description: 'The listed dates changed and the official registration page has the new dates.',
  'cf-turnstile-response': TURNSTILE_TOKEN,
};

describe('POST /api/trust/request', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = stubTurnstileSuccess();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('accepts a bounded correction as an open case', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.status).toBe('open');
    expect(trustCases.insertTrustCase).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      category: 'listing_correction', requester_email: 'parent@example.com', status: 'open',
    }));
  });

  it('is unavailable by default and does not write', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid),
      env: { PCD_OPS_DB: {} },
    }));
    expect(res.status).toBe(404);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('rejects an unsupported case category', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, category: 'emergency' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    expect(res.status).toBe(400);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('rejects an external target URL', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, target_url: 'https://evil.example/camp' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    expect(res.status).toBe(400);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('rejects short descriptions and invalid email addresses', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, requester_email: 'bad', description: 'wrong' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    expect(res.status).toBe(400);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('honeypot returns success without writing', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', { ...valid, website: 'spam.example' }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    expect(res.status).toBe(200);
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });

  it('binds browser retries to a validated idempotency key and returns the durable case id', async () => {
    vi.mocked(trustCases.findTrustCaseByIntakeKey).mockResolvedValueOnce(null);
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, {
        headers: { 'Idempotency-Key': '12345678-1234-1234-1234-123456789abc' },
      }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    const firstBody = await readJson(res);
    const inserted = vi.mocked(trustCases.insertTrustCase).mock.calls.at(-1)?.[1];
    expect(firstBody.replayed).toBe(false);
    vi.mocked(trustCases.findTrustCaseByIntakeKey).mockResolvedValueOnce({
      id: 'case_original', request_fingerprint: inserted!.request_fingerprint,
    });
    const replay = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, {
        headers: { 'Idempotency-Key': '12345678-1234-1234-1234-123456789abc' },
      }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    expect(await readJson(replay)).toMatchObject({ id: 'case_original', replayed: true });
    expect(trustCases.insertTrustCase).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
      intake_key: '12345678-1234-1234-1234-123456789abc', request_fingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
    }));
  });

  it('rejects malformed or payload-conflicting idempotency keys', async () => {
    const malformed = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, { headers: { 'Idempotency-Key': 'short' } }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    expect(malformed.status).toBe(400);

    vi.mocked(trustCases.findTrustCaseByIntakeKey).mockResolvedValueOnce({ id: 'case_existing', request_fingerprint: 'b'.repeat(64) });
    const conflict = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid, { headers: { 'Idempotency-Key': '12345678-1234-1234-1234-123456789abc' } }),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    expect(conflict.status).toBe(409);
  });

  it('security: fails closed with no TURNSTILE_SECRET_KEY set — returns 503 and writes nothing', async () => {
    const res = await POST(makeContext({
      request: jsonRequest('https://parentcoachdesk.com/api/trust/request', valid),
      env: { PCD_OPS_DB: {}, TRUST_INTAKE_ENABLED: 'true' },
    }));
    const body = await readJson(res);
    expect(res.status).toBe(503);
    expect(body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(trustCases.insertTrustCase).not.toHaveBeenCalled();
  });
});
