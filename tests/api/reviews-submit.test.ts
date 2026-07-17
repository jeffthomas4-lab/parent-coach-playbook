// Tests for POST /api/camps/:slug/reviews/submit.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';

// See camps-claim.test.ts for why the factory below sets no default return
// values: vi.mock() is hoisted above top-level const declarations, so
// referencing an outer const here throws a temporal-dead-zone error.
vi.mock('../../src/lib/camps-db', () => ({
  getCampBySlug: vi.fn(),
  insertReview: vi.fn().mockResolvedValue(undefined),
  prepareReviewInsert: vi.fn().mockReturnValue({ run: vi.fn() }),
  generateReviewId: vi.fn().mockReturnValue('review_test123'),
}));
vi.mock('../../src/lib/public-idempotency', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/lib/public-idempotency')>();
  return { ...actual, executeIdempotentWrite: vi.fn() };
});

const mockCamp = { id: 'camp_1', slug: 'test-camp', status: 'approved' };

import { POST } from '../../src/pages/api/camps/[slug]/reviews/submit';
import * as campsDb from '../../src/lib/camps-db';
import * as idempotency from '../../src/lib/public-idempotency';

describe('POST /api/camps/:slug/reviews/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getCampBySlug as any).mockResolvedValue(mockCamp);
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({ outcome: 'created', resourceId: 'review_test123', status: 200, body: { ok: true, id: 'review_test123', status: 'pending' } });
  });

  it('happy path: a valid review is accepted as pending', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      reviewer_display_name: 'A Parent',
      rating: 5,
      body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
      idempotency_key: 'review_retry_key_12345',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_REVIEWS_ENABLED: 'true' } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe('pending');
    expect(res.headers.get('Idempotency-Replayed')).toBe('false');
  });

  it('retry safety: requires an operation key before any review write', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com', rating: 5, body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
    });
    const res = await POST(makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_REVIEWS_ENABLED: 'true' } }));
    expect(res.status).toBe(400);
    expect(idempotency.executeIdempotentWrite).not.toHaveBeenCalled();
  });

  it('retry safety: returns conflict without creating a second review', async () => {
    (idempotency.executeIdempotentWrite as any).mockResolvedValue({ outcome: 'conflict' });
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com', rating: 5, body: 'Great camp, my kid had a wonderful time all week long and made new friends.', idempotency_key: 'review_retry_key_12345',
    });
    const res = await POST(makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_REVIEWS_ENABLED: 'true' } }));
    expect(res.status).toBe(409);
  });

  it('failure path: rating out of range (1-5) is rejected', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      rating: 9,
      body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_REVIEWS_ENABLED: 'true' } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: a review body under 30 characters is rejected', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      rating: 4,
      body: 'Too short.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_REVIEWS_ENABLED: 'true' } });
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
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_REVIEWS_ENABLED: 'true' } });
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
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {}, CAMP_REVIEWS_ENABLED: 'true' } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('disabled path: reviews are unavailable by default and do not read or write the database', async () => {
    const req = jsonRequest('https://parentcoachdesk.com/api/camps/test-camp/reviews/submit', {
      reviewer_email: 'parent@example.com',
      rating: 5,
      body: 'Great camp, my kid had a wonderful time all week long and made new friends.',
    });
    const ctx = makeContext({ request: req, params: { slug: 'test-camp' }, env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
    expect(campsDb.getCampBySlug).not.toHaveBeenCalled();
    expect(campsDb.insertReview).not.toHaveBeenCalled();
  });
});
