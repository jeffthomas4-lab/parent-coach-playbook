// Tests for POST /api/admin/camps/:id/approve — representative admin route.
// Covers the three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

// See camps-claim.test.ts for why the factory below sets no default return
// values: vi.mock() is hoisted above top-level const declarations, so
// referencing an outer const here throws a temporal-dead-zone error.
vi.mock('../../src/lib/camps-db', () => ({
  approveCamp: vi.fn(),
  getCampById: vi.fn(),
  upsertDomainQuality: vi.fn().mockResolvedValue(undefined),
}));

const mockPendingCamp = { id: 'camp_1', status: 'pending', awaiting_review: 0, source_domain: 'example.com' };

import { POST } from '../../src/pages/api/admin/camps/[id]/approve';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';

function adminRequest(body: unknown = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/approve', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu',
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/camps/:id/approve', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getCampById as any).mockResolvedValue(mockPendingCamp);
    (campsDb.approveCamp as any).mockResolvedValue({ id: 'camp_1', status: 'approved', source_domain: 'example.com' });
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/approve', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: '{}',
    });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.approveCamp).not.toHaveBeenCalled();
  });

  it('auth: refuses an authenticated caller not on the admin allowlist', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/approve', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://parentcoachdesk.com',
        'Cf-Access-Authenticated-User-Email': 'stranger@example.com',
      },
      body: '{}',
    });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.approveCamp).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin approving a pending camp succeeds', async () => {
    const ctx = makeContext({ request: adminRequest(), params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.approveCamp).toHaveBeenCalledWith(expect.anything(), 'camp_1', 'jeffthomas@pugetsound.edu', null);
  });

  it('failure path: approving an id that does not exist returns 404', async () => {
    (campsDb.approveCamp as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/approve', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://evil.example.com',
        'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu',
      },
      body: '{}',
    });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.approveCamp).not.toHaveBeenCalled();
  });
});
