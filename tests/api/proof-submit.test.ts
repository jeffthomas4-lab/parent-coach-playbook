// Tests for POST /api/proof-submit — the public "share your experience"
// endpoint. Mocks the shared boundary libs (feature-flag, turnstile,
// public-input, rate limiter) and the proof_inbox D1 layer so these tests
// exercise the route's own gate order, validation, and idempotency handling.
// The D1 layer and the pure helpers have their own direct suites.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';

vi.mock('../../src/lib/feature-flags', () => ({
  featureEnabled: (value: unknown) => value === 'true',
}));

vi.mock('../../src/lib/turnstile', () => ({
  enforcePublicTurnstile: vi.fn(async () => null),
}));

vi.mock('../../src/lib/public-input', () => ({
  enforcePublicRequestBoundary: vi.fn(async () => null),
  firstOversizedField: vi.fn(() => null),
}));

vi.mock('../../src/lib/public-rate-limit', () => ({
  enforcePublicWriteRateLimit: vi.fn(async () => null),
}));

vi.mock('../../src/lib/proof-inbox-db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/lib/proof-inbox-db')>();
  return {
    ...actual,
    findProofInboxByIntakeKey: vi.fn(async () => null),
    insertProofInboxRow: vi.fn(async () => ({ outcome: 'created', id: 'proof_x' })),
  };
});

import { POST } from '../../src/pages/api/proof-submit';
import * as turnstile from '../../src/lib/turnstile';
import * as publicInput from '../../src/lib/public-input';
import * as rateLimit from '../../src/lib/public-rate-limit';
import * as db from '../../src/lib/proof-inbox-db';

const ENABLED = { PCD_OPS_DB: {}, PROOF_SUBMIT_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'ts' };
const VALID = { quote: 'This site helped a lot.', name: 'A Parent', source: 'google', 'cf-turnstile-response': 'tok' };

function ctx(body: unknown, env: Record<string, unknown> = ENABLED, headers?: Record<string, string>) {
  return makeContext({ request: jsonRequest('https://parentcoachdesk.com/api/proof-submit', body, { headers }), env });
}

describe('POST /api/proof-submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (turnstile.enforcePublicTurnstile as any).mockResolvedValue(null);
    (publicInput.enforcePublicRequestBoundary as any).mockResolvedValue(null);
    (publicInput.firstOversizedField as any).mockReturnValue(null);
    (rateLimit.enforcePublicWriteRateLimit as any).mockResolvedValue(null);
    (db.findProofInboxByIntakeKey as any).mockResolvedValue(null);
    (db.insertProofInboxRow as any).mockResolvedValue({ outcome: 'created', id: 'proof_x' });
  });

  it('fails closed with a 404 when the feature flag is off', async () => {
    const res = await POST(ctx(VALID, { PCD_OPS_DB: {} }));
    expect(res.status).toBe(404);
    expect(db.insertProofInboxRow).not.toHaveBeenCalled();
  });

  it('returns 503 when the operational database is not bound', async () => {
    const res = await POST(ctx(VALID, { PROOF_SUBMIT_ENABLED: 'true' }));
    expect(res.status).toBe(503);
  });

  it('returns a request-boundary rejection unchanged', async () => {
    (publicInput.enforcePublicRequestBoundary as any).mockResolvedValue(new Response('too big', { status: 413 }));
    const res = await POST(ctx(VALID));
    expect(res.status).toBe(413);
    expect(db.insertProofInboxRow).not.toHaveBeenCalled();
  });

  it('returns 400 on an unparseable JSON body', async () => {
    const req = new Request('https://parentcoachdesk.com/api/proof-submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{ not valid json',
    });
    const res = await POST(makeContext({ request: req, env: ENABLED }));
    expect(res.status).toBe(400);
  });

  it('short-circuits a filled honeypot to 200 without inserting', async () => {
    const res = await POST(ctx({ ...VALID, website: 'http://spam.example' }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(turnstile.enforcePublicTurnstile).not.toHaveBeenCalled();
    expect(db.insertProofInboxRow).not.toHaveBeenCalled();
  });

  it('returns a turnstile failure unchanged', async () => {
    (turnstile.enforcePublicTurnstile as any).mockResolvedValue(new Response('bad token', { status: 403 }));
    const res = await POST(ctx(VALID));
    expect(res.status).toBe(403);
    expect(db.insertProofInboxRow).not.toHaveBeenCalled();
  });

  it('rejects an oversized field with 400', async () => {
    (publicInput.firstOversizedField as any).mockReturnValue('quote');
    const res = await POST(ctx(VALID));
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.error).toContain('quote');
  });

  it('requires a quote', async () => {
    const res = await POST(ctx({ ...VALID, quote: '   ' }));
    expect(res.status).toBe(400);
    expect((await readJson(res)).error).toContain('quote');
  });

  it('requires a name', async () => {
    const res = await POST(ctx({ ...VALID, name: '' }));
    expect(res.status).toBe(400);
    expect((await readJson(res)).error).toContain('name');
  });

  it('rejects an invalid sourceUrl', async () => {
    const res = await POST(ctx({ ...VALID, sourceUrl: 'javascript:alert(1)' }));
    expect(res.status).toBe(400);
    expect((await readJson(res)).error).toContain('sourceUrl');
  });

  it('rejects a malformed Idempotency-Key', async () => {
    const res = await POST(ctx(VALID, ENABLED, { 'Idempotency-Key': 'short' }));
    expect(res.status).toBe(400);
  });

  it('returns 409 when an idempotency key was used for different content', async () => {
    (db.findProofInboxByIntakeKey as any).mockResolvedValue({ id: 'proof_old', request_fingerprint: 'totally-different' });
    const res = await POST(ctx(VALID, ENABLED, { 'Idempotency-Key': 'abcdefghij1234567890' }));
    expect(res.status).toBe(409);
    expect(db.insertProofInboxRow).not.toHaveBeenCalled();
  });

  it('returns a rate-limit rejection unchanged', async () => {
    (rateLimit.enforcePublicWriteRateLimit as any).mockResolvedValue(new Response('slow down', { status: 429 }));
    const res = await POST(ctx(VALID));
    expect(res.status).toBe(429);
    expect(db.insertProofInboxRow).not.toHaveBeenCalled();
  });

  it('accepts a complete submission and inserts it', async () => {
    const res = await POST(ctx({ ...VALID, sourceUrl: 'https://example.com/review', context: 'saw it on google', product: 'cleats' }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.replayed).toBe(false);
    expect(db.insertProofInboxRow).toHaveBeenCalledTimes(1);
  });

  it('falls back to the "form" source for an unrecognized source', async () => {
    await POST(ctx({ ...VALID, source: 'not-a-real-source' }));
    const row = (db.insertProofInboxRow as any).mock.calls[0][1];
    expect(row.source).toBe('form');
  });

  it('reports an insert-layer conflict as 409', async () => {
    (db.insertProofInboxRow as any).mockResolvedValue({ outcome: 'conflict' });
    const res = await POST(ctx(VALID));
    expect(res.status).toBe(409);
  });

  it('reports an insert-layer replay as replayed:true', async () => {
    (db.insertProofInboxRow as any).mockResolvedValue({ outcome: 'replayed', id: 'proof_old' });
    const res = await POST(ctx(VALID));
    expect((await readJson(res)).replayed).toBe(true);
  });

  it('returns 500 without leaking the underlying error on an insert failure', async () => {
    (db.insertProofInboxRow as any).mockRejectedValue(new Error('d1 exploded on secret_table'));
    const res = await POST(ctx(VALID));
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(JSON.stringify(body)).not.toContain('secret_table');
  });

  it('accepts a form-encoded submission', async () => {
    const req = new Request('https://parentcoachdesk.com/api/proof-submit', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ quote: 'Loved it', name: 'B', source: 'yelp', 'cf-turnstile-response': 'tok' }).toString(),
    });
    const res = await POST(makeContext({ request: req, env: ENABLED }));
    expect(res.status).toBe(200);
    expect(db.insertProofInboxRow).toHaveBeenCalledTimes(1);
  });
});
