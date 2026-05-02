// POST /api/camps/:slug/reviews/submit
// Public: a parent submits a review of a camp. Goes into the moderation queue.

import type { APIRoute } from 'astro';
import { getCampBySlug, insertReview, generateReviewId } from '../../../../../lib/camps-db';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const isEmail = (s: string | undefined): boolean => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const POST: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const slug = params.slug;
  if (!slug) return json({ ok: false, error: 'missing slug' }, 400);

  const camp = await getCampBySlug(env.DB, slug);
  if (!camp || camp.status !== 'approved') {
    return json({ ok: false, error: 'camp not found' }, 404);
  }

  // Parse payload (form or JSON).
  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  let payload: { website?: string; reviewer_email?: string; reviewer_display_name?: string; rating?: string | number; body?: string } = {};
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

  await insertReview(env.DB, {
    id: generateReviewId(),
    camp_id: camp.id,
    reviewer_email: payload.reviewer_email!.toLowerCase(),
    reviewer_display_name: payload.reviewer_display_name?.trim() || null,
    rating,
    body,
    submitted_at: new Date().toISOString(),
  });

  return json({ ok: true, status: 'pending' });
};
