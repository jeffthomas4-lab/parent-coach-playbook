// POST /api/camps/:slug/reviews/submit
// Public: a parent submits a review of a camp. Goes into the moderation queue.

import type { APIRoute } from 'astro';
import { getCampBySlug, prepareReviewInsert, generateReviewId } from '../../../../../lib/camps-db';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { env as cfEnv } from 'cloudflare:workers';
import { enforcePublicRequestBoundary, firstOversizedField } from '../../../../../lib/public-input';
import { enforcePublicWriteRateLimit, type PublicRateLimiter } from '../../../../../lib/public-rate-limit';
import { executeIdempotentWrite, sha256Hex, suppliedIdempotencyKey } from '../../../../../lib/public-idempotency';

export const prerender = false;

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

const isEmail = (s: string | undefined): boolean => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; CAMP_REVIEWS_ENABLED?: string; COMMUNITY_RATE_LIMITER?: PublicRateLimiter } | undefined;
  if (!featureEnabled(env?.CAMP_REVIEWS_ENABLED)) {
    return json({ ok: false, error: 'camp reviews are not currently available' }, 404);
  }
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);
  const boundary = await enforcePublicRequestBoundary(request, 8_192);
  if (boundary) return boundary;

  const slug = params.slug;
  if (!slug) return json({ ok: false, error: 'missing slug' }, 400);

  const camp = await getCampBySlug(env.DB, slug);
  if (!camp || camp.status !== 'approved') {
    return json({ ok: false, error: 'camp not found' }, 404);
  }

  // Parse payload (form or JSON).
  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  let payload: { website?: string; idempotency_key?: string; reviewer_email?: string; reviewer_display_name?: string; rating?: string | number; body?: string } = {};
  if (ct.includes('application/json')) {
    payload = (await request.json()) as typeof payload;
  } else {
    const fd = await request.formData();
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') (payload as any)[k] = v;
    }
  }

  // Honeypot.
  if (payload.website && payload.website.trim().length > 0) {
    return json({ ok: true });
  }

  const oversized = firstOversizedField(payload as Record<string, unknown>, {
    reviewer_email: 320, reviewer_display_name: 120, body: 2000,
  });
  if (oversized) return json({ ok: false, error: `${oversized} too long` }, 400);

  if (!isEmail(payload.reviewer_email)) {
    return json({ ok: false, error: 'reviewer_email must be a valid email' }, 400);
  }
  const rating = Number.parseInt(String(payload.rating ?? ''), 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ ok: false, error: 'rating must be an integer 1-5' }, 400);
  }
  const body = (payload.body ?? '').trim();
  if (body.length < 30 || body.length > 2000) {
    return json({ ok: false, error: 'body must be 30-2000 characters' }, 400);
  }
  const limited = await enforcePublicWriteRateLimit(env.COMMUNITY_RATE_LIMITER, request, 'camp-review', payload.reviewer_email);
  if (limited) return limited;
  const idempotency = suppliedIdempotencyKey(request, payload.idempotency_key);
  if (idempotency.error) return json({ ok: false, error: idempotency.error }, 400);
  if (!idempotency.key) return json({ ok: false, error: 'Idempotency-Key is required' }, 400);
  const now = new Date().toISOString();
  const review = {
    id: generateReviewId(),
    camp_id: camp.id,
    reviewer_email: payload.reviewer_email!.toLowerCase(),
    reviewer_display_name: payload.reviewer_display_name?.trim() || null,
    rating,
    body,
    submitted_at: now,
  };
  const responseBody = { ok: true, id: review.id, status: 'pending' };
  const result = await executeIdempotentWrite({
    db: env.DB, scope: 'directory.review.submit.v1', key: idempotency.key,
    payloadHash: await sha256Hex({ version: 1, camp_id: review.camp_id, reviewer_email: review.reviewer_email, reviewer_display_name: review.reviewer_display_name, rating: review.rating, body: review.body }),
    resourceId: review.id, status: 200, body: responseBody, now,
    expiresAt: new Date(Date.parse(now) + 30 * 24 * 60 * 60 * 1000).toISOString(),
    domainStatements: [prepareReviewInsert(env.DB, review)],
  });
  if (result.outcome === 'conflict') return json({ ok: false, error: 'Idempotency-Key was already used for a different request' }, 409);
  return json(result.body, result.status, { 'Idempotency-Replayed': String(result.outcome === 'replayed') });
};
