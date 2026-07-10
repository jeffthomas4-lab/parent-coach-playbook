// Tests for POST /api/camps/:slug/claim.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';

// NOTE: vi.mock() factories are hoisted above every other statement in this
// file, including top-level const declarations. Referencing an outer const
// from inside the factory throws "Cannot access '...' before initialization".
// So the factory below sets no default return values — beforeEach() sets
// them on the mocked functions after the module is mocked, which is safe.
vi.mock('../../src/lib/camps-db', () => ({
  getCampBySlug: vi.fn(),
  insertClaim: vi.fn().mockResolvedValue(undefined),
  generateClaimId: vi.fn().mockReturnValue('claim_test123'),
}));

const mockCamp = { id: 'camp_1', slug: 'test-camp', status: 'approved', is_claimed: 0 };

import { POST } from '../../src/pages/api/camps/[slug]/claim';
import * as campsDb from '../../src/lib/camps-db';

describe('POST /api/camps/:slug/claim', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getCampBySlug as any).mockResolvedValue(mockCamp);
  });

  it('happy path: a valid claim on an unclaimed approved camp is accepted', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com',
      claimant_name: 'Jane Owner',
      notes: 'I run this camp and can prove it with our business license.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
  });

  it('failure path: a claim on an already-claimed camp is rejected', async () => {
    (campsDb.getCampBySlug as any).mockResolvedValue({ ...mockCamp, is_claimed: 1 });
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'owner@example.com',
      notes: 'I run this camp and can prove it with our business license.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: an invalid claimant email is rejected', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/claim', {
      claimant_email: 'not-an-email',
      notes: 'I run this camp and can prove it with our business license.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('not-found path: claiming a camp slug that does not exist returns 404', async () => {
    (campsDb.getCampBySlug as any).mockResolvedValue(null);
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/nope/claim', {
      claimant_email: 'owner@example.com',
      notes: 'I run this camp and can prove it with our business license.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'nope' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });
});
