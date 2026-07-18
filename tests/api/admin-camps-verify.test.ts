// Tests for POST /api/admin/camps/:id/verify — three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  CampVerificationBlockedError: class CampVerificationBlockedError extends Error {},
  setVerified: vi.fn(),
  getCampById: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/camps/[id]/verify';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const mockCamp = { id: 'camp_1', verified: 1, status: 'approved', source_domain: 'example.com', registration_url: 'https://example.com/camp' };

function adminRequest(body: unknown = { verified: true }, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/verify', {
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

describe('POST /api/admin/camps/:id/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.setVerified as any).mockResolvedValue(undefined);
    (campsDb.getCampById as any).mockResolvedValue(mockCamp);
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/verify', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ verified: true }),
    });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.setVerified).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin setting verified=true succeeds', async () => {
    const ctx = makeContext({ request: adminRequest({ verified: true }), params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.setVerified).toHaveBeenCalledWith(expect.anything(), 'camp_1', true);
  });

  it('failure path: a camp id that does not exist returns 404', async () => {
    (campsDb.getCampById as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
    expect(campsDb.setVerified).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ verified: true }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.setVerified).not.toHaveBeenCalled();
  });

  it('form submission redirects with 303 instead of returning JSON', async () => {
    const fd = new URLSearchParams({ verified: 'true' });
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/verify', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://parentcoachdesk.com',
        'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu',
      },
      body: fd.toString(),
    });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(303);
    expect(res.headers.get('Location')).toBe('/admin/camps/camp_1/');
  });
});
