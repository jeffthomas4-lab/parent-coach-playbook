// Tests for POST /api/camps/:slug/claim.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';

// Turnstile fails closed (src/lib/turnstile.ts): every request past the
// honeypot check must carry a token, and TURNSTILE_SECRET_KEY must be set in
// env, or the route returns 503 before doing anything else (including before
// looking at the camp's claim state). Tests that reach that far supply a
// secret and a token, and stub the Cloudflare siteverify call to succeed.
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

// NOTE: vi.mock() factories are hoisted above every other statement in this
// file, including top-level const declarations. Referencing an outer const
// from inside the factory throws "Cannot access '...' before initialization".
// So the factory below sets no default return values — beforeEach() sets
// them on the mocked functions after the module is mocked, which is safe.
vi.mock('../../src/lib/camps-db', () => ({
  getCampBySlug: vi.fn(),
  insertClaim: vi.fn().mockResolvedValue(undefined),
  prepareClaimInsert: vi.fn().mockResolvedValue({ run: vi.fn() }),
  generateClaimId: vi.fn().mockReturnValue('claim_test123'),
}));
vi.mock('../../src/lib/public-idempotency', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/lib/public-idempotency')>();
  return { ...actual, executeIdempotentWrite: vi.fn() };
});

const mockCamp = { id: 'camp_1', slug: 'test-camp', status: 'approved', is_claimed: 0 };

import { POST } from '../../src/pages/api/camps/[slug]/claim';
import * as campsDb from '../../src/lib/camps-db';
import * as idempotency from '../../src/lib/public-idempotency';

describe('POST /api/camps/:slug/claim', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = stubTurnstileSuccess();
    (campsDb.getCampBySlug as any).mockResolvedValue(mockCamp);
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({ outcome: 'created', resourceId: 'claim_test123', status: 200, body: { ok: true, id: 'claim_test123', status: 'pending' } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('happy path: a valid claim on an unclaimed approved camp is accepted', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com',
      claimant_name: 'Jane Owner',
      notes: 'I run this camp and can prove it with our business license.',
      idempotency_key: 'claim_retry_key_123456',
      'cf-turnstile-response': TURNSTILE_TOKEN,
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_CLAIMS_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
    expect(res.headers.get('Idempotency-Replayed')).toBe('false');
  });

  it('retry safety: requires an operation key before any claim write', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com', notes: 'I run this camp and can prove it with our business license.',
      'cf-turnstile-response': TURNSTILE_TOKEN,
    });
    const res = await POST(makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_CLAIMS_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } }));
    expect(res.status).toBe(400);
    expect(idempotency.executeIdempotentWrite).not.toHaveBeenCalled();
  });

  it('retry safety: returns conflict without creating a second claim', async () => {
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({ outcome: 'conflict' });
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com', notes: 'I run this camp and can prove it with our business license.', idempotency_key: 'claim_retry_key_123456',
      'cf-turnstile-response': TURNSTILE_TOKEN,
    });
    const res = await POST(makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_CLAIMS_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } }));
    expect(res.status).toBe(409);
  });

  it('failure path: a claim on an already-claimed camp is rejected', async () => {
    (campsDb.getCampBySlug as any).mockResolvedValue({ ...mockCamp, is_claimed: 1 });
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com',
      notes: 'I run this camp and can prove it with our business license.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_CLAIMS_ENABLED: 'true' } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: an invalid claimant email is rejected', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'not-an-email',
      notes: 'I run this camp and can prove it with our business license.',
      'cf-turnstile-response': TURNSTILE_TOKEN,
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_CLAIMS_ENABLED: 'true', TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('not-found path: claiming a camp slug that does not exist returns 404', async () => {
    (campsDb.getCampBySlug as any).mockResolvedValue(null);
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/nope/claim', {
      claimant_email: 'owner@example.com',
      notes: 'I run this camp and can prove it with our business license.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'nope' }, env: { DB: {}, CAMP_CLAIMS_ENABLED: 'true' } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('disabled path: claims are unavailable by default and do not read or write the database', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com',
      notes: 'I run this camp and can prove it with our business license.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
    expect(campsDb.getCampBySlug).not.toHaveBeenCalled();
    expect(campsDb.insertClaim).not.toHaveBeenCalled();
  });

  it('security: fails closed with no TURNSTILE_SECRET_KEY set — returns 503 and writes nothing', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com',
      claimant_name: 'Jane Owner',
      notes: 'I run this camp and can prove it with our business license.',
      idempotency_key: 'claim_retry_key_123456',
      'cf-turnstile-response': TURNSTILE_TOKEN,
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_CLAIMS_ENABLED: 'true' } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(503);
    expect(body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(campsDb.insertClaim).not.toHaveBeenCalled();
    expect(idempotency.executeIdempotentWrite).not.toHaveBeenCalled();
  });
});
