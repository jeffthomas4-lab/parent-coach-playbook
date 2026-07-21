// Tests for POST /api/admin/data-quality/fix — happy path, invalid action, non-admin.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/data-quality-db', () => ({
  getProgramById: vi.fn(),
  setAge: vi.fn(),
  setDates: vi.fn(),
  swapDates: vi.fn(),
  setPrice: vi.fn(),
  clearPrice: vi.fn(),
  setRegistrationUrl: vi.fn(),
  upgradeToHttps: vi.fn(),
  setSourceDomain: vi.fn(),
  deriveSourceDomain: vi.fn(),
  stampVerified: vi.fn(),
  unverify: vi.fn(),
  rejectAsDuplicate: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/data-quality/fix';
import * as dq from '../../src/lib/data-quality-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';

const mockProgram = {
  id: 'prog_1',
  name: 'Test Camp',
  organization_name: 'Test Org',
  city: 'Tacoma',
  state: 'WA',
  address: '123 Main St',
  age_min: null,
  age_max: 12,
  session_start_date: '2026-07-01',
  session_end_date: '2026-07-05',
  price: 100,
  registration_url: 'https://example.com/register',
  source_domain: 'example.com',
  verified: 0,
  last_verified_at: null,
  url_last_checked_at: null,
};

function adminRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/data-quality/fix', {
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

describe('POST /api/admin/data-quality/fix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (dq.getProgramById as any).mockResolvedValue(mockProgram);
    (dq.setAge as any).mockResolvedValue(true);
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/data-quality/fix', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ id: 'prog_1', action: 'set_age', fields: { age_min: 5, age_max: 10 } }),
    });
    const ctx = makeContext({ request: req, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(dq.setAge).not.toHaveBeenCalled();
  });

  it('auth: rejects an authenticated user who is not on the admin allowlist (non-admin)', async () => {
    const req = adminRequest(
      { id: 'prog_1', action: 'set_age', fields: { age_min: 5, age_max: 10 } },
      { 'Cf-Access-Authenticated-User-Email': 'stranger@example.com' },
    );
    const ctx = makeContext({ request: req, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(dq.setAge).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin setting a valid age range succeeds', async () => {
    const ctx = makeContext({
      request: adminRequest({ id: 'prog_1', action: 'set_age', fields: { age_min: 5, age_max: 10 } }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(dq.setAge).toHaveBeenCalledWith(expect.anything(), 'prog_1', 5, 10, 'jeffthomas@pugetsound.edu');
  });

  it('failure path: an unknown action is rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ id: 'prog_1', action: 'delete_everything', fields: {} }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(dq.setAge).not.toHaveBeenCalled();
  });

  it('failure path: an out-of-range age is rejected before any write', async () => {
    const ctx = makeContext({
      request: adminRequest({ id: 'prog_1', action: 'set_age', fields: { age_min: -1, age_max: 30 } }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(dq.setAge).not.toHaveBeenCalled();
  });

  it('failure path: a program id that does not exist returns 404', async () => {
    (dq.getProgramById as any).mockResolvedValue(null);
    const ctx = makeContext({
      request: adminRequest({ id: 'does-not-exist', action: 'set_age', fields: { age_min: 5, age_max: 10 } }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
    expect(dq.setAge).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ id: 'prog_1', action: 'set_age', fields: { age_min: 5, age_max: 10 } }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(dq.setAge).not.toHaveBeenCalled();
  });
});
