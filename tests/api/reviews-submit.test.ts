// Tests for POST /api/camps/:slug/reviews/submit.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';

// See camps-claim.test.ts for why the factory below sets no default return
// values: vi.mock() is hoisted above top-level const declarations, so
// referencing an outer const here throws a temporal-dead-zone error.
vi.mock('../../src/lib/camps-db', () => ({
  getCampBySlug: vi.fn(),
  insertReview: vi.fn().mockResolvedValue(undefined),
  generateReviewId: vi.fn().mockReturnValue('review_test123'),
}));

const mockCamp = { id: 'camp_1', slug: 'test-camp', status: 'approved' };

import { POST } from '../../src/pages/api/camps/[slug]/reviews/submit';
import * as campsDb from '../../src/lib/camps-db';

describe('POST /api/camps/:slug/reviews/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getCampBySlug as any).mockResolvedValue(mockCamp);
  });

  it('happy path: a valid review is accepted as pending', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      reviewer_display_name: 'A Parent',
      rating: 5,
      body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
  });

  it('failure path: rating out of range (1-5) is rejected', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      rating: 9,
      body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: a review body under 30 characters is rejected', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      rating: 4,
      body: 'Too short.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('bot rejection: honeypot short-circuits without calling insertReview', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      website: 'http://spam.example.com',
      reviewer_email: 'parent@example.com',
      rating: 5,
      body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.insertReview).not.toHaveBeenCalled();
  });

  it('not-found path: reviewing a camp that is not approved returns 404', async () => {
    (campsDb.getCampBySlug as any).mockResolvedValue({ ...mockCamp, status: 'pending' });
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      rating: 5,
      body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });
});
