// Tests for POST /api/admin/camps/:id/reject — three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', async () => {
  const actual = await vi.importActual<typeof import('../../src/lib/camps-db')>('../../src/lib/camps-db');
  return {
    ...actual,
    rejectCamp: vi.fn(),
    upsertDomainQuality: vi.fn().mockResolvedValue(undefined),
  };
});

import { POST } from '../../src/pages/api/admin/camps/[id]/reject';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const mockCamp = { id: 'camp_1', status: 'rejected', source_domain: 'example.com' };

function adminRequest(body: unknown = {}, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/reject', {
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

describe('POST /api/admin/camps/:id/reject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.rejectCamp as any).mockResolvedValue(mockCamp);
    (campsDb.upsertDomainQuality as any).mockResolvedValue(undefined);
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/reject', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: '{}',
    });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.rejectCamp).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin rejecting a pending camp succeeds', async () => {
    const ctx = makeContext({
      request: adminRequest({ notes: 'dead link', reason_code: 'dead-url' }),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.rejectCamp).toHaveBeenCalledWith(expect.anything(), 'camp_1', 'jeffthomas@pugetsound.edu', 'dead link', 'dead-url');
    expect(campsDb.upsertDomainQuality).toHaveBeenCalledWith(expect.anything(), 'example.com', 'rejected');
  });

  it('failure path: an unknown reason_code is silently dropped, not rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ reason_code: 'not-a-real-code' }),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(200);
    expect(campsDb.rejectCamp).toHaveBeenCalledWith(expect.anything(), 'camp_1', 'jeffthomas@pugetsound.edu', null, null);
  });

  it('failure path: a camp id that does not exist returns 404', async () => {
    (campsDb.rejectCamp as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({}, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.rejectCamp).not.toHaveBeenCalled();
  });
});
