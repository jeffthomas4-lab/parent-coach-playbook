// POST /api/camps/suggest
//
// Public "suggest an organization" endpoint. Lighter-weight than /api/camps/submit:
// no dates, no address, no live-URL check. Just enough for admin to research and
// either build a full listing (insertCamp, via /camps/submit-quality data) or pass.
//
// Spam protection: a `website` honeypot field, same convention as /api/camps/submit.

import type { APIRoute } from 'astro';
import { insertOrgSuggestion, prepareOrgSuggestionInsert, generateOrgSuggestionId } from '../../../lib/camps-db';
import { env as cfEnv } from 'cloudflare:workers';
import { enforcePublicRequestBoundary, firstOversizedField, normalizeExternalHttpUrl } from '../../../lib/public-input';
import { enforcePublicWriteRateLimit, type PublicRateLimiter } from '../../../lib/public-rate-limit';
import { executeIdempotentWrite, sha256Hex, suppliedIdempotencyKey } from '../../../lib/public-idempotency';
import { enforcePublicTurnstile } from '../../../lib/turnstile';

export const prerender = false;

interface SuggestPayload {
  website?: string; // honeypot
  'cf-turnstile-response'?: string;
  idempotency_key?: string;
  org_name?: string;
  org_website?: string;
  org_city?: string;
  org_state?: string;
  activity_type?: string;
  submitter_email?: string;
  notes?: string;
}

const isEmail = (s: string | undefined): boolean => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const ok = (body: unknown, status = 200, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

const fail = (message: string, status = 400) => ok({ ok: false, error: message }, status);

async function readPayload(req: Request): Promise<SuggestPayload> {
  const ct = (req.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) {
    return (await req.json()) as SuggestPayload;
  }
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const out: Record<string, string> = {};
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') out[k] = v;
    }
    return out as SuggestPayload;
  }
  try {
    return (await req.json()) as SuggestPayload;
  } catch {
    return {};
  }
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB: D1Database; PUBLIC_SUBMISSION_RATE_LIMITER?: PublicRateLimiter; TURNSTILE_SECRET_KEY?: string } | undefined;
  if (!env?.DB) return fail('database not available', 500);

  const boundary = await enforcePublicRequestBoundary(request, 12_288);
  if (boundary) return boundary;

  const data = await readPayload(request);

  if (data.website && data.website.trim().length > 0) {
    return ok({ ok: true });
  }

  const turnstileFailure = await enforcePublicTurnstile(env.TURNSTILE_SECRET_KEY, data['cf-turnstile-response'], request);
  if (turnstileFailure) return turnstileFailure;

  const oversized = firstOversizedField(data as Record<string, unknown>, {
    org_name: 200,
    org_website: 2048,
    org_city: 120,
    org_state: 40,
    activity_type: 120,
    submitter_email: 320,
    notes: 2000,
  });
  if (oversized) return fail(`${oversized} too long`);

  const orgName = (data.org_name ?? '').trim();
  if (!orgName) return fail('org_name is required');
  if (orgName.length > 200) return fail('org_name too long');

  if (data.submitter_email && !isEmail(data.submitter_email)) {
    return fail('submitter_email is not a valid email');
  }
  const limited = await enforcePublicWriteRateLimit(env.PUBLIC_SUBMISSION_RATE_LIMITER, request, 'camp-suggest', data.submitter_email);
  if (limited) return limited;

  let normalizedWebsite: string | null;
  try {
    normalizedWebsite = normalizeExternalHttpUrl(data.org_website);
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'org_website is invalid');
  }

  const idempotency = suppliedIdempotencyKey(request, data.idempotency_key);
  if (idempotency.error) return fail(idempotency.error);
  if (!idempotency.key) return fail('Idempotency-Key is required');
  const submittedAt = new Date().toISOString();
  const suggestion = {
    id: generateOrgSuggestionId(),
    org_name: orgName,
    org_website: normalizedWebsite,
    org_city: data.org_city?.trim() || null,
    org_state: data.org_state?.trim() ? data.org_state.trim().toUpperCase() : null,
    activity_type: data.activity_type?.trim() || null,
    submitter_email: data.submitter_email?.trim().toLowerCase() || null,
    notes: data.notes?.trim() || null,
    submitted_at: submittedAt,
  };
  const payloadHash = await sha256Hex({
    version: 1,
    org_name: suggestion.org_name,
    org_website: suggestion.org_website,
    org_city: suggestion.org_city,
    org_state: suggestion.org_state,
    activity_type: suggestion.activity_type,
    submitter_email: suggestion.submitter_email,
    notes: suggestion.notes,
  });
  const body = { ok: true, id: suggestion.id };
  const expiresAt = new Date(Date.parse(submittedAt) + 30 * 24 * 60 * 60 * 1000).toISOString();
  const result = await executeIdempotentWrite({
    db: env.DB,
    scope: 'directory.organization.suggest.v1',
    key: idempotency.key,
    payloadHash,
    resourceId: suggestion.id,
    status: 200,
    body,
    now: submittedAt,
    expiresAt,
    domainStatements: [prepareOrgSuggestionInsert(env.DB, suggestion)],
  });
  if (result.outcome === 'conflict') return fail('Idempotency-Key was already used for a different request', 409);
  return ok(result.body, result.status, { 'Idempotency-Replayed': String(result.outcome === 'replayed') });
};
