// Tests for POST /api/admin/camps/:id/reject — three-test minimum: happy path, failure path, auth.
//
// rejectCamp() now performs a single atomic conditional UPDATE and reports
// whether *this* call transitioned the row, instead of the route reading
// prior state via getCampById() to decide. These tests model that by making
// the mocked rejectCamp() resolve { camp, transitioned } directly — the
// route's only job is to gate upsertDomainQuality() on `transitioned`.

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
import { POST as adminApiPOST } from '../../src/pages/admin/api/camps/[id]/reject';
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
    // Default: a pending camp that this call actually transitions.
    (campsDb.rejectCamp as any).mockResolvedValue({ camp: mockCamp, transitioned: true });
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

  it('happy path: an allowed admin rejecting a pending camp succeeds and transitions once', async () => {
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
    expect(campsDb.upsertDomainQuality).toHaveBeenCalledTimes(1);
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

  it('sequential replay: rejecting an already-rejected camp does not double-count domain quality', async () => {
    // The conditional UPDATE (WHERE pcd_status != 'rejected') affects zero
    // rows the second time, so rejectCamp reports transitioned: false even
    // though the camp still exists and is returned.
    (campsDb.rejectCamp as any).mockResolvedValue({ camp: mockCamp, transitioned: false });
    const ctx = makeContext({
      request: adminRequest({ notes: 'dead link', reason_code: 'dead-url' }),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(200);
    expect(campsDb.rejectCamp).toHaveBeenCalledWith(expect.anything(), 'camp_1', 'jeffthomas@pugetsound.edu', 'dead link', 'dead-url');
    expect(campsDb.upsertDomainQuality).not.toHaveBeenCalled();
  });

  it('race-shaped: upsert is gated on the UPDATE\'s reported change count, not a prior read of camp existence', async () => {
    // Simulates two requests racing on the same id: this call's UPDATE
    // reports zero changes (another request won the race), even though the
    // row unambiguously exists and is returned by the SELECT. The route
    // must not infer "not yet rejected" from the camp object being present.
    (campsDb.rejectCamp as any).mockResolvedValue({ camp: mockCamp, transitioned: false });
    const ctx = makeContext({
      request: adminRequest({}),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.camp).toBeTruthy();
    expect(campsDb.upsertDomainQuality).not.toHaveBeenCalled();
  });

  it('failure path: a camp id that does not exist returns 404 and never upserts', async () => {
    (campsDb.rejectCamp as any).mockResolvedValue({ camp: null, transitioned: false });
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
    expect(campsDb.upsertDomainQuality).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({}, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.rejectCamp).not.toHaveBeenCalled();
  });
});

// Mirror route under /admin/api/*. Imports the exact same rejectCamp from
// src/lib/camps-db (mocked once, above, for this whole test file), so the
// atomicity/idempotency guarantee is shared — this block only needs to
// confirm the mirror route wires transitioned -> upsert the same way.
describe('POST /admin/api/camps/:id/reject (mirror route, same rejectCamp)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.rejectCamp as any).mockResolvedValue({ camp: mockCamp, transitioned: true });
    (campsDb.upsertDomainQuality as any).mockResolvedValue(undefined);
  });

  it('happy path: transitions once and upserts domain quality once', async () => {
    const ctx = makeContext({
      request: adminRequest({ notes: 'dead link', reason_code: 'dead-url' }),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await adminApiPOST(ctx);
    expect(res.status).toBe(303);
    expect(campsDb.rejectCamp).toHaveBeenCalledWith(expect.anything(), 'camp_1', 'jeffthomas@pugetsound.edu', 'dead link', 'dead-url');
    expect(campsDb.upsertDomainQuality).toHaveBeenCalledTimes(1);
  });

  it('sequential replay: a second reject on an already-rejected camp does not upsert', async () => {
    (campsDb.rejectCamp as any).mockResolvedValue({ camp: mockCamp, transitioned: false });
    const ctx = makeContext({
      request: adminRequest({ notes: 'dead link', reason_code: 'dead-url' }),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await adminApiPOST(ctx);
    expect(res.status).toBe(303);
    expect(campsDb.upsertDomainQuality).not.toHaveBeenCalled();
  });

  it('failure path: a camp id that does not exist returns 404 and never upserts', async () => {
    (campsDb.rejectCamp as any).mockResolvedValue({ camp: null, transitioned: false });
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await adminApiPOST(ctx);
    expect(res.status).toBe(404);
    expect(campsDb.upsertDomainQuality).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({}, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await adminApiPOST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.rejectCamp).not.toHaveBeenCalled();
  });
});
