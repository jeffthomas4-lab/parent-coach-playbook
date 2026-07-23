// Tests for POST /api/admin/camps/:id/request-info — the admin action that
// flags a pending camp for the unattended info-research task. Mocks the D1
// layer (camps-db) so these tests exercise the route's auth, same-origin,
// input, and not-found handling. Access auth + origin come from the shared
// makeContext harness.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  getCampById: vi.fn(),
  requestCampInfo: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/camps/[id]/request-info';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN = 'jeffthomas@pugetsound.edu';
const URL = 'https://parentcoachdesk.com/api/admin/camps/camp_1/request-info';

function adminReq(body: unknown, headers: Record<string, string> = {}) {
  return new Request(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': ADMIN,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function run(
  request: Request,
  params: Record<string, string | undefined> = { id: 'camp_1' },
  env: Record<string, unknown> = { DB: {}, ADMIN_EMAILS: ADMIN },
) {
  return POST(makeContext({ request, params, env }));
}

describe('POST /api/admin/camps/:id/request-info', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getCampById as any).mockResolvedValue({ id: 'camp_1', name: 'Test Camp' });
    (campsDb.requestCampInfo as any).mockResolvedValue({ id: 'camp_1', info_requested: 1 });
  });

  it('returns 500 without a database binding', async () => {
    const res = await run(adminReq({ notes: 'need name' }), { id: 'camp_1' }, { ADMIN_EMAILS: ADMIN });
    expect(res.status).toBe(500);
    expect(campsDb.requestCampInfo).not.toHaveBeenCalled();
  });

  it('refuses an unauthenticated request', async () => {
    const req = new Request(URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ notes: 'need name' }),
    });
    const res = await run(req);
    expect(res.status).toBe(401);
    expect(campsDb.requestCampInfo).not.toHaveBeenCalled();
  });

  it('forbids an authenticated non-admin', async () => {
    const res = await run(adminReq({ notes: 'need name' }, { 'Cf-Access-Authenticated-User-Email': 'stranger@example.com' }));
    expect(res.status).toBe(403);
    expect(campsDb.requestCampInfo).not.toHaveBeenCalled();
  });

  it('refuses a cross-origin request even with valid admin auth', async () => {
    const res = await run(adminReq({ notes: 'need name' }, { origin: 'https://evil.example.com' }));
    expect(res.status).toBe(403);
    expect(campsDb.requestCampInfo).not.toHaveBeenCalled();
  });

  it('returns 400 when the id is missing', async () => {
    const res = await run(adminReq({ notes: 'need name' }), {});
    expect(res.status).toBe(400);
    expect(campsDb.requestCampInfo).not.toHaveBeenCalled();
  });

  it('returns 400 when notes are empty', async () => {
    const res = await run(adminReq({ notes: '   ' }));
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.error).toContain('notes');
    expect(campsDb.requestCampInfo).not.toHaveBeenCalled();
  });

  it('returns 404 when the camp does not exist', async () => {
    (campsDb.getCampById as any).mockResolvedValue(null);
    const res = await run(adminReq({ notes: 'need name' }));
    expect(res.status).toBe(404);
    expect(campsDb.requestCampInfo).not.toHaveBeenCalled();
  });

  it('flags the camp and returns it on the happy path', async () => {
    const res = await run(adminReq({ notes: 'need the real camp name and dates' }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.requestCampInfo).toHaveBeenCalledWith(
      expect.anything(),
      'camp_1',
      ADMIN,
      'need the real camp name and dates',
    );
  });

  it('accepts form-encoded notes', async () => {
    const req = new Request(URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        origin: 'https://parentcoachdesk.com',
        'Cf-Access-Authenticated-User-Email': ADMIN,
      },
      body: new URLSearchParams({ notes: 'need dates' }).toString(),
    });
    const res = await run(req);
    expect(res.status).toBe(200);
    expect(campsDb.requestCampInfo).toHaveBeenCalled();
  });
});
