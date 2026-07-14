// Tests for POST /api/admin/suggestions/:id/update — three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  getOrgSuggestionById: vi.fn(),
  updateOrgSuggestionStatus: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/suggestions/[id]/update';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const mockSuggestion = { id: 'sugg_1', org_name: 'Tacoma Youth Soccer', status: 'pending' };

function adminRequest(body: unknown = { status: 'reviewed' }, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/suggestions/sugg_1/update', {
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

describe('POST /api/admin/suggestions/:id/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getOrgSuggestionById as any).mockResolvedValue(mockSuggestion);
    (campsDb.updateOrgSuggestionStatus as any).mockResolvedValue({ ...mockSuggestion, status: 'reviewed' });
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/suggestions/sugg_1/update', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ status: 'reviewed' }),
    });
    const ctx = makeContext({ request: req, params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.updateOrgSuggestionStatus).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin marking a suggestion reviewed succeeds', async () => {
    const ctx = makeContext({ request: adminRequest({ status: 'reviewed' }), params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.updateOrgSuggestionStatus).toHaveBeenCalledWith(expect.anything(), 'sugg_1', 'reviewed');
  });

  it('failure path: an invalid status value is rejected', async () => {
    const ctx = makeContext({ request: adminRequest({ status: 'bogus' }), params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(campsDb.updateOrgSuggestionStatus).not.toHaveBeenCalled();
  });

  it('failure path: a suggestion id that does not exist returns 404', async () => {
    (campsDb.getOrgSuggestionById as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ status: 'reviewed' }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.updateOrgSuggestionStatus).not.toHaveBeenCalled();
  });
});
