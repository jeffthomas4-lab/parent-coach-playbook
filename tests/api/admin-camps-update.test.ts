// Tests for POST /api/admin/camps/:id/update — three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  getCampById: vi.fn(),
  updateCamp: vi.fn(),
  uniqueSlug: vi.fn(),
  geocodeCached: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/camps/[id]/update';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const existingCamp = {
  id: 'camp_1',
  name: 'Old Camp Name',
  slug: 'old-camp-name',
  start_date: '2026-08-01',
  end_date: '2026-08-05',
  age_min: 8,
  age_max: 14,
  address: '123 Main St',
  city: 'Tacoma',
  state: 'WA',
  zip: '98402',
};

function adminRequest(body: unknown = {}, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/update', {
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

describe('POST /api/admin/camps/:id/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getCampById as any).mockResolvedValue(existingCamp);
    (campsDb.updateCamp as any).mockResolvedValue({ ...existingCamp, description: 'Updated description that is long enough to pass.' });
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/camp_1/update', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ name: 'New Name' }),
    });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.updateCamp).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin updating the description succeeds', async () => {
    const ctx = makeContext({
      request: adminRequest({ description: 'Updated description that is long enough to pass.' }),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.updateCamp).toHaveBeenCalledWith(
      expect.anything(),
      'camp_1',
      expect.objectContaining({ description: 'Updated description that is long enough to pass.' }),
      'jeffthomas@pugetsound.edu',
    );
  });

  it('happy path: changing the name triggers a slug regeneration', async () => {
    (campsDb.uniqueSlug as any).mockResolvedValue('new-camp-name');
    const ctx = makeContext({ request: adminRequest({ name: 'New Camp Name' }), params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(200);
    expect(campsDb.uniqueSlug).toHaveBeenCalledWith(expect.anything(), 'New Camp Name');
    expect(campsDb.updateCamp).toHaveBeenCalledWith(
      expect.anything(),
      'camp_1',
      expect.objectContaining({ name: 'New Camp Name', slug: 'new-camp-name' }),
      'jeffthomas@pugetsound.edu',
    );
  });

  it('failure path: an invalid zip is rejected before writing', async () => {
    const ctx = makeContext({ request: adminRequest({ zip: 'not-a-zip' }), params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(campsDb.updateCamp).not.toHaveBeenCalled();
  });

  it('failure path: start_date after end_date is rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ start_date: '2026-09-01' }),
      params: { id: 'camp_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.error).toMatch(/start_date must be on or before end_date/);
    expect(campsDb.updateCamp).not.toHaveBeenCalled();
  });

  it('failure path: a camp id that does not exist returns 404', async () => {
    (campsDb.getCampById as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest({ name: 'X' }), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ name: 'New Name' }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'camp_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.updateCamp).not.toHaveBeenCalled();
  });
});
