// Tests for POST /api/admin/reviews/:id/reject — three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  rejectReview: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/reviews/[id]/reject';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const mockReview = { id: 'review_1', status: 'rejected' };

function adminRequest(body: unknown = {}, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/reviews/review_1/reject', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/reviews/:id/reject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.rejectReview as any).mockResolvedValue(mockReview);
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/reviews/review_1/reject', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: '{}',
    });
    const ctx = makeContext({ request: req, params: { id: 'review_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.rejectReview).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin rejecting a pending review succeeds', async () => {
    const ctx = makeContext({ request: adminRequest({ notes: 'off-topic' }), params: { id: 'review_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.rejectReview).toHaveBeenCalledWith(expect.anything(), 'review_1', 'jeffthomas@pugetsound.edu', 'off-topic');
  });

  it('failure path: a review id that does not exist returns 404', async () => {
    (campsDb.rejectReview as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({}, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'review_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.rejectReview).not.toHaveBeenCalled();
  });
});
