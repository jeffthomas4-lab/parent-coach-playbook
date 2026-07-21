// Tests for POST /api/camps/suggest — public route. Happy path, failure path, spam/honeypot path.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

// Turnstile fails closed (src/lib/turnstile.ts): every request past the
// honeypot check must carry a token, and TURNSTILE_SECRET_KEY must be set in
// env, or the route returns 503 before doing anything else. Tests that reach
// past the honeypot supply a secret and a token, and stub the Cloudflare
// siteverify call to succeed.
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

vi.mock('../../src/lib/camps-db', () => ({
  insertOrgSuggestion: vi.fn().mockResolvedValue(undefined),
  prepareOrgSuggestionInsert: vi.fn(() => ({ run: vi.fn() })),
  generateOrgSuggestionId: vi.fn(() => 'sugg_fixed_id'),
}));

vi.mock('../../src/lib/public-idempotency', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/lib/public-idempotency')>();
  return { ...actual, executeIdempotentWrite: vi.fn() };
});

import { POST } from '../../src/pages/api/camps/suggest';
import * as campsDb from '../../src/lib/camps-db';
import * as idempotency from '../../src/lib/public-idempotency';

function jsonReq(body: Record<string, unknown>) {
  return new Request('https://parentcoachdesk.com/api/camps/suggest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ 'cf-turnstile-response': TURNSTILE_TOKEN, ...body }),
  });
}

function idempotentReq(body: Record<string, unknown>, key = 'retry_key_1234567890') {
  return new Request('https://parentcoachdesk.com/api/camps/suggest', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify({ 'cf-turnstile-response': TURNSTILE_TOKEN, ...body }),
  });
}

describe('POST /api/camps/suggest', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = stubTurnstileSuccess();
    (campsDb.insertOrgSuggestion as any).mockResolvedValue(undefined);
    (campsDb.generateOrgSuggestionId as any).mockReturnValue('sugg_fixed_id');
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({
      outcome: 'created', resourceId: 'sugg_fixed_id', status: 200, body: { ok: true, id: 'sugg_fixed_id' },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('happy path: a valid suggestion is inserted and returns its id', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', org_website: 'tacomasoccer.org', org_city: 'Tacoma', org_state: 'wa', idempotency_key: 'suggest_default_key_123' }),
      env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.id).toBe('sugg_fixed_id');
    expect(idempotency.executeIdempotentWrite).toHaveBeenCalledWith(expect.objectContaining({ scope: 'directory.organization.suggest.v1' }));
  });

  it('failure path: a missing org_name is rejected without touching the DB', async () => {
    const ctx = makeContext({ request: jsonReq({ org_city: 'Tacoma' }), env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('failure path: an invalid submitter_email is rejected', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', submitter_email: 'not-an-email' }),
      env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('spam: a filled-in honeypot field short-circuits to 200 without writing', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', website: 'i-am-a-bot.com' }),
      env: { DB: {} },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: jsonReq({ org_name: 'X' }), env: {} });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
  });

  it('security: rejects private-network organization URLs', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Internal', org_website: 'http://192.168.1.1/private' }),
      env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('failure path: bounds free-text notes before writing', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', notes: 'x'.repeat(2001) }),
      env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('abuse control: returns 429 before writing when the platform limiter rejects', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', submitter_email: 'parent@example.com' }),
      env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET, PUBLIC_SUBMISSION_RATE_LIMITER: { limit: vi.fn().mockResolvedValue({ success: false }) } },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(429);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('retry safety: binds a valid operation key to the normalized payload', async () => {
    const ctx = makeContext({ request: idempotentReq({ org_name: 'Tacoma Youth Soccer', org_state: 'wa' }), env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } });
    const res = await POST(ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get('Idempotency-Replayed')).toBe('false');
    expect(idempotency.executeIdempotentWrite).toHaveBeenCalledWith(expect.objectContaining({
      scope: 'directory.organization.suggest.v1', key: 'retry_key_1234567890', resourceId: 'sugg_fixed_id',
    }));
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('retry safety: returns the original resource for a matching replay', async () => {
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({
      outcome: 'replayed', resourceId: 'sugg_original', status: 200, body: { ok: true, id: 'sugg_original' },
    });
    const res = await POST(makeContext({ request: idempotentReq({ org_name: 'Tacoma Youth Soccer' }), env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } }));
    expect(await readJson(res)).toEqual({ ok: true, id: 'sugg_original' });
    expect(res.headers.get('Idempotency-Replayed')).toBe('true');
  });

  it('retry safety: rejects a key reused with a different payload', async () => {
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({ outcome: 'conflict' });
    const res = await POST(makeContext({ request: idempotentReq({ org_name: 'Different Organization' }), env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET } }));
    expect(res.status).toBe(409);
  });

  it('retry safety: rejects disagreement between header and body keys', async () => {
    const res = await POST(makeContext({
      request: idempotentReq({ org_name: 'Tacoma Youth Soccer', idempotency_key: 'another_retry_key_12345' }), env: { DB: {}, TURNSTILE_SECRET_KEY: TURNSTILE_SECRET },
    }));
    expect(res.status).toBe(400);
    expect(idempotency.executeIdempotentWrite).not.toHaveBeenCalled();
  });

  it('security: fails closed with no TURNSTILE_SECRET_KEY set — returns 503 and writes nothing', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', org_city: 'Tacoma', org_state: 'wa' }),
      env: { DB: {} },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(503);
    expect(body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
    expect(idempotency.executeIdempotentWrite).not.toHaveBeenCalled();
  });
});
