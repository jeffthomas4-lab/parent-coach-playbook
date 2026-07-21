// POST /api/camps/:slug/claim
// Public: a camp owner / staff submits a claim request. Goes into a moderation queue.
// Admin verifies ownership, sends payment link (Stripe / invoice), then marks claim paid.

import type { APIRoute } from 'astro';
import { getCampBySlug, prepareClaimInsert, generateClaimId } from '../../../../lib/camps-db';
import { featureEnabled } from '../../../../lib/feature-flags';
import { env as cfEnv } from 'cloudflare:workers';
import { enforcePublicRequestBoundary, firstOversizedField } from '../../../../lib/public-input';
import { enforcePublicWriteRateLimit, type PublicRateLimiter } from '../../../../lib/public-rate-limit';
import { executeIdempotentWrite, sha256Hex, suppliedIdempotencyKey } from '../../../../lib/public-idempotency';
import { enforcePublicTurnstile } from '../../../../lib/turnstile';

export const prerender = false;

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

const isEmail = (s: string | undefined): boolean => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; CAMP_CLAIMS_ENABLED?: string; OWNER_RATE_LIMITER?: PublicRateLimiter; TURNSTILE_SECRET_KEY?: string } | undefined;
  if (!featureEnabled(env?.CAMP_CLAIMS_ENABLED)) {
    return json({ ok: false, error: 'camp claims are not currently available' }, 404);
  }
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);
  const boundary = await enforcePublicRequestBoundary(request, 12_288);
  if (boundary) return boundary;

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
    'cf-turnstile-response'?: string;
    claimant_email?: string;
    claimant_name?: string;
    organization?: string;
    phone?: string;
    notes?: string;
    idempotency_key?: string;
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

  const turnstileFailure = await enforcePublicTurnstile(env.TURNSTILE_SECRET_KEY, payload['cf-turnstile-response'], request);
  if (turnstileFailure) return turnstileFailure;

  const oversized = firstOversizedField(payload as Record<string, unknown>, {
    claimant_email: 320, claimant_name: 120, organization: 200, phone: 60, notes: 4000,
  });
  if (oversized) return json({ ok: false, error: `${oversized} too long` }, 400);

  if (!isEmail(payload.claimant_email)) {
    return json({ ok: false, error: 'claimant_email must be a valid email' }, 400);
  }
  if (!payload.notes || payload.notes.trim().length < 20) {
    return json({ ok: false, error: 'notes (proof of ownership) must be at least 20 characters' }, 400);
  }
  const limited = await enforcePublicWriteRateLimit(env.OWNER_RATE_LIMITER, request, 'camp-claim', payload.claimant_email);
  if (limited) return limited;
  const idempotency = suppliedIdempotencyKey(request, payload.idempotency_key);
  if (idempotency.error) return json({ ok: false, error: idempotency.error }, 400);
  if (!idempotency.key) return json({ ok: false, error: 'Idempotency-Key is required' }, 400);
  const now = new Date().toISOString();
  const claim = {
    id: generateClaimId(),
    camp_id: camp.id,
    claimant_email: payload.claimant_email!.toLowerCase(),
    claimant_name: payload.claimant_name?.trim() || null,
    organization: payload.organization?.trim() || null,
    phone: payload.phone?.trim() || null,
    notes: payload.notes.trim(),
    submitted_at: now,
  };
  const body = {
    ok: true,
    id: claim.id,
    status: 'pending',
    message: 'Claim request received. It remains pending until identity and authority evidence is reviewed. We may follow up at the submitted email if more evidence is needed.',
  };
  const result = await executeIdempotentWrite({
    db: env.DB, scope: 'directory.claim.submit.v1', key: idempotency.key,
    payloadHash: await sha256Hex({ version: 1, camp_id: claim.camp_id, claimant_email: claim.claimant_email, claimant_name: claim.claimant_name, organization: claim.organization, phone: claim.phone, notes: claim.notes }),
    resourceId: claim.id, status: 200, body, now,
    expiresAt: new Date(Date.parse(now) + 30 * 24 * 60 * 60 * 1000).toISOString(),
    domainStatements: [await prepareClaimInsert(env.DB, claim)],
  });
  if (result.outcome === 'conflict') return json({ ok: false, error: 'Idempotency-Key was already used for a different request' }, 409);
  return json(result.body, result.status, { 'Idempotency-Replayed': String(result.outcome === 'replayed') });
};
