// Tests for POST /api/admin/claims/:id/update — three-test minimum: happy path, failure path, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  getClaimById: vi.fn(),
  updateClaimStatus: vi.fn(),
  markCampClaimed: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/claims/[id]/update';
import * as campsDb from '../../src/lib/camps-db';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const mockClaim = { id: 'claim_1', camp_id: 'camp_1', claimant_email: 'owner@example.com', status: 'pending' };

function adminRequest(body: unknown = { status: 'verified' }, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/claims/claim_1/update', {
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

describe('POST /api/admin/claims/:id/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getClaimById as any).mockResolvedValue(mockClaim);
    (campsDb.updateClaimStatus as any).mockResolvedValue({ ...mockClaim, status: 'verified' });
    (campsDb.markCampClaimed as any).mockResolvedValue(undefined);
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/claims/claim_1/update', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ status: 'verified' }),
    });
    const ctx = makeContext({ request: req, params: { id: 'claim_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(campsDb.updateClaimStatus).not.toHaveBeenCalled();
  });

  it('happy path: an allowed admin marking a claim verified succeeds', async () => {
    const ctx = makeContext({ request: adminRequest({ status: 'verified' }), params: { id: 'claim_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.updateClaimStatus).toHaveBeenCalledWith(expect.anything(), 'claim_1', 'verified', 'jeffthomas@pugetsound.edu', null);
    expect(campsDb.markCampClaimed).not.toHaveBeenCalled();
  });

  it('happy path: marking a claim paid also flips the camp claimed flag', async () => {
    (campsDb.updateClaimStatus as any).mockResolvedValue({ ...mockClaim, status: 'paid' });
    const ctx = makeContext({
      request: adminRequest({ status: 'paid', paid_until: '2027-01-01' }),
      params: { id: 'claim_1' },
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(200);
    expect(campsDb.markCampClaimed).toHaveBeenCalledWith(expect.anything(), 'camp_1', 'owner@example.com', '2027-01-01');
  });

  it('failure path: an invalid status value is rejected', async () => {
    const ctx = makeContext({ request: adminRequest({ status: 'bogus' }), params: { id: 'claim_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(campsDb.updateClaimStatus).not.toHaveBeenCalled();
  });

  it('failure path: a claim id that does not exist returns 404', async () => {
    (campsDb.getClaimById as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ status: 'verified' }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'claim_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(campsDb.updateClaimStatus).not.toHaveBeenCalled();
  });
});
