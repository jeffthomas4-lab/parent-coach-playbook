// POST /api/camps/:slug/claim
// Public: a camp owner / staff submits a claim request. Goes into a moderation queue.
// Admin verifies ownership, sends payment link (Stripe / invoice), then marks claim paid.

import type { APIRoute } from 'astro';
import { getCampBySlug, insertClaim, generateClaimId } from '../../../../lib/camps-db';

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

  if (camp.is_claimed === 1) {
    return json({ ok: false, error: 'this listing is already claimed' }, 400);
  }

  // Parse payload (form or JSON).
  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  let payload: {
    website?: string;
    claimant_email?: string;
    claimant_name?: string;
    organization?: string;
    phone?: string;
    notes?: string;
  } = {};
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

  if (!isEmail(payload.claimant_email)) {
    return json({ ok: false, error: 'claimant_email must be a valid email' }, 400);
  }
  if (!payload.notes || payload.notes.trim().length < 20) {
    return json({ ok: false, error: 'notes (proof of ownership) must be at least 20 characters' }, 400);
  }

  await insertClaim(env.DB, {
    id: generateClaimId(),
    camp_id: camp.id,
    claimant_email: payload.claimant_email!.toLowerCase(),
    claimant_name: payload.claimant_name?.trim() || null,
    organization: payload.organization?.trim() || null,
    phone: payload.phone?.trim() || null,
    notes: payload.notes.trim(),
    submitted_at: new Date().toISOString(),
  });

  return json({
    ok: true,
    status: 'pending',
    message: 'Claim request received. We review every claim before activating. We will email you within 2 business days.',
  });
};
