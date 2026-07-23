// POST /api/proof-submit
//
// Public "share your experience" endpoint for the /proof page, per 15-07
// Social Proof Page Standard, "Collecting the proof: the inbox," method 2.
// Writes a raw, unmoderated row to D1 `proof_inbox` (migration 0026,
// PCD_OPS_DB). It never writes to src/data/proof.json directly and nothing
// submitted here appears on /proof until a person pulls it into
// src/data/proof-inbox.json (`node scripts/proof.mjs pull`) and approves it.
//
// Follows the same house pattern as src/pages/api/trust/request.ts:
// feature-flag gate, same-origin + payload-size boundary, honeypot,
// Turnstile, server-side validation, a rate limiter, and idempotent-retry
// via a caller-supplied Idempotency-Key + request fingerprint. No CORS
// headers are ever emitted, so no other origin can read the response even if
// it could get a request through the same-origin boundary check.
//
// Gate: PROOF_SUBMIT_ENABLED (var, default unset/false). Off until Jeff
// flips it on in wrangler config after the migration is applied and
// Turnstile keys are set. See TODOs below and the report for the exact list.

import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { enforcePublicRequestBoundary, firstOversizedField } from '../../lib/public-input';
import { enforcePublicWriteRateLimit, type PublicRateLimiter } from '../../lib/public-rate-limit';
import { enforcePublicTurnstile } from '../../lib/turnstile';
import { featureEnabled } from '../../lib/feature-flags';
import {
  findProofInboxByIntakeKey,
  insertProofInboxRow,
  PROOF_SOURCES,
  type ProofInboxSource,
} from '../../lib/proof-inbox-db';

export const prerender = false;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

const isIntakeKey = (value: string) => /^[A-Za-z0-9_-]{16,128}$/.test(value);

async function sha256Hex(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

interface ProofSubmitPayload {
  website?: string; // honeypot
  'cf-turnstile-response'?: string;
  idempotency_key?: string;
  quote?: string;
  name?: string;
  context?: string;
  source?: string;
  sourceUrl?: string;
  product?: string;
}

async function readPayload(request: Request): Promise<ProofSubmitPayload> {
  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) return (await request.json()) as ProofSubmitPayload;
  const form = await request.formData();
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') out[key] = value;
  }
  return out as ProofSubmitPayload;
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as {
    PCD_OPS_DB?: D1Database;
    PROOF_SUBMIT_ENABLED?: string;
    // TODO(jeff): reuses the existing public-submission limiter for now.
    // Add a dedicated PROOF_RATE_LIMITER binding in wrangler.jsonc /
    // wrangler.production.jsonc if proof submissions need their own budget.
    PUBLIC_SUBMISSION_RATE_LIMITER?: PublicRateLimiter;
    // TODO(jeff): set as a Worker secret. Run `npx wrangler secret put TURNSTILE_SECRET_KEY`
    // (staging) and again against wrangler.production.jsonc (production).
    // Pair with PUBLIC_TURNSTILE_SITE_KEY baked into the /proof form.
    TURNSTILE_SECRET_KEY?: string;
  } | undefined;

  // Fails closed: this route does nothing until Jeff turns it on.
  if (!featureEnabled(env?.PROOF_SUBMIT_ENABLED)) {
    return json({ ok: false, error: 'not currently available' }, 404);
  }
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);

  const boundary = await enforcePublicRequestBoundary(request, 8_192);
  if (boundary) return boundary;

  let data: ProofSubmitPayload;
  try {
    data = await readPayload(request);
  } catch {
    return json({ ok: false, error: 'invalid request' }, 400);
  }

  // Honeypot: bots fill hidden fields, real users never see them.
  if (data.website && data.website.trim().length > 0) return json({ ok: true });

  const turnstileFailure = await enforcePublicTurnstile(env.TURNSTILE_SECRET_KEY, data['cf-turnstile-response'], request);
  if (turnstileFailure) return turnstileFailure;

  const oversized = firstOversizedField(data as Record<string, unknown>, {
    quote: 2000,
    name: 120,
    context: 200,
    source: 40,
    sourceUrl: 2048,
    product: 60,
  });
  if (oversized) return json({ ok: false, error: `${oversized} too long` }, 400);

  const quote = data.quote?.trim() ?? '';
  const name = data.name?.trim() ?? '';
  if (!quote) return json({ ok: false, error: 'quote is required' }, 400);
  if (!name) return json({ ok: false, error: 'name is required' }, 400);

  // The submitter picks a source on the form (google/yelp/facebook/etc.) or
  // leaves it as "form". This endpoint never guesses a source that was not
  // actually indicated.
  const requestedSource = (data.source?.trim() || 'form') as ProofInboxSource;
  const source: ProofInboxSource = PROOF_SOURCES.includes(requestedSource) ? requestedSource : 'form';

  let sourceUrl: string | null = null;
  if (data.sourceUrl?.trim()) {
    try {
      const parsed = new URL(data.sourceUrl.trim());
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error();
      sourceUrl = parsed.toString();
    } catch {
      return json({ ok: false, error: 'sourceUrl is invalid' }, 400);
    }
  }

  const suppliedIntakeKey = request.headers.get('Idempotency-Key')?.trim() || data.idempotency_key?.trim() || '';
  if (suppliedIntakeKey && !isIntakeKey(suppliedIntakeKey)) {
    return json({ ok: false, error: 'invalid Idempotency-Key' }, 400);
  }
  const intakeKey = suppliedIntakeKey || null;

  const context = data.context?.trim() || null;
  const product = data.product?.trim() || null;
  const normalized = { quote, name, context, source, sourceUrl, product };
  const requestFingerprint = await sha256Hex(normalized);

  if (intakeKey) {
    const existing = await findProofInboxByIntakeKey(env.PCD_OPS_DB, intakeKey);
    if (existing && existing.request_fingerprint !== requestFingerprint) {
      return json({ ok: false, error: 'Idempotency-Key was already used for a different request' }, 409);
    }
    if (existing) return json({ ok: true, replayed: true });
  }

  const limited = await enforcePublicWriteRateLimit(env.PUBLIC_SUBMISSION_RATE_LIMITER, request, 'proof-submit', null);
  if (limited) return limited;

  const now = new Date().toISOString();
  const id = `proof_${crypto.randomUUID()}`;

  try {
    const inserted = await insertProofInboxRow(env.PCD_OPS_DB, {
      id,
      quote,
      name,
      context,
      source,
      source_url: sourceUrl,
      product,
      status: 'new',
      created_at: now,
      intake_key: intakeKey,
      request_fingerprint: requestFingerprint,
    });
    if (inserted.outcome === 'conflict') {
      return json({ ok: false, error: 'Idempotency-Key was already used for a different request' }, 409);
    }
    return json({ ok: true, replayed: inserted.outcome === 'replayed' });
  } catch (error) {
    // Full error stays server-side. The caller never sees SQL, table names,
    // or a stack trace.
    console.error('[proof-submit] insert failed', error instanceof Error ? error.message : error);
    return json({ ok: false, error: 'could not save submission' }, 500);
  }
};
