import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { enforcePublicRequestBoundary, firstOversizedField } from '../../../lib/public-input';
import { findTrustCaseByIntakeKey, insertTrustCase, TRUST_CASE_CATEGORIES, trustCaseDueAt, trustCasePriority, type TrustCaseCategory } from '../../../lib/trust-cases';
import { featureEnabled } from '../../../lib/feature-flags';
import { enforcePublicWriteRateLimit, type PublicRateLimiter } from '../../../lib/public-rate-limit';

export const prerender = false;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isIntakeKey = (value: string) => /^[A-Za-z0-9_-]{16,100}$/.test(value);
const sha256 = async (value: unknown) => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

async function payload(request: Request): Promise<Record<string, string>> {
  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) return await request.json() as Record<string, string>;
  const form = await request.formData();
  return Object.fromEntries([...form.entries()].filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; TRUST_INTAKE_ENABLED?: string; TRUST_RATE_LIMITER?: PublicRateLimiter } | undefined;
  if (!featureEnabled(env?.TRUST_INTAKE_ENABLED)) return json({ ok: false, error: 'trust intake is not currently available' }, 404);
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const boundary = await enforcePublicRequestBoundary(request, 16_384);
  if (boundary) return boundary;

  let data: Record<string, string>;
  try { data = await payload(request); } catch { return json({ ok: false, error: 'invalid request' }, 400); }
  if (data.website?.trim()) return json({ ok: true });

  const oversized = firstOversizedField(data, {
    category: 40, target_url: 2048, camp_slug: 200, requester_email: 320,
    requester_name: 120, description: 4000, desired_resolution: 1000,
  });
  if (oversized) return json({ ok: false, error: `${oversized} too long` }, 400);

  const category = data.category?.trim() as TrustCaseCategory;
  if (!TRUST_CASE_CATEGORIES.includes(category)) return json({ ok: false, error: 'invalid category' }, 400);
  const email = data.requester_email?.trim().toLowerCase();
  if (!email || !isEmail(email)) return json({ ok: false, error: 'valid requester_email is required' }, 400);
  const description = data.description?.trim();
  if (!description || description.length < 20) return json({ ok: false, error: 'description must be at least 20 characters' }, 400);
  const suppliedIntakeKey = request.headers.get('Idempotency-Key')?.trim();
  if (suppliedIntakeKey && !isIntakeKey(suppliedIntakeKey)) return json({ ok: false, error: 'invalid Idempotency-Key' }, 400);
  const intakeKey = suppliedIntakeKey || crypto.randomUUID();

  let targetUrl: string | null = null;
  if (data.target_url?.trim()) {
    try {
      const parsed = new URL(data.target_url.trim(), 'https://parentcoachdesk.com');
      if (parsed.protocol !== 'https:' || parsed.hostname !== 'parentcoachdesk.com') throw new Error();
      targetUrl = parsed.toString();
    } catch {
      return json({ ok: false, error: 'target_url must be a parentcoachdesk.com URL' }, 400);
    }
  }

  const now = new Date().toISOString();
  const id = `case_${crypto.randomUUID()}`;
  const normalized = {
    category, target_url: targetUrl, camp_slug: data.camp_slug?.trim() || null,
    requester_email: email, requester_name: data.requester_name?.trim() || null,
    description, desired_resolution: data.desired_resolution?.trim() || null,
  };
  const requestFingerprint = await sha256(normalized);
  if (suppliedIntakeKey) {
    const existing = await findTrustCaseByIntakeKey(env.PCD_OPS_DB, intakeKey);
    if (existing) {
      if (existing.request_fingerprint !== requestFingerprint) {
        return json({ ok: false, error: 'Idempotency-Key was already used for a different request' }, 409);
      }
      return json({ ok: true, id: existing.id, status: 'open', replayed: true });
    }
  }
  const limited = await enforcePublicWriteRateLimit(env.TRUST_RATE_LIMITER, request, 'trust-request', email);
  if (limited) return limited;
  const inserted = await insertTrustCase(env.PCD_OPS_DB, {
    id, category, target_url: targetUrl, camp_slug: data.camp_slug?.trim() || null,
    requester_email: email, requester_name: data.requester_name?.trim() || null,
    description, desired_resolution: data.desired_resolution?.trim() || null,
    priority: trustCasePriority(category), due_at: trustCaseDueAt(category, now),
    status: 'open', submitted_at: now, updated_at: now,
    acknowledged_at: null, acknowledged_by: null,
    resolved_at: null, resolved_by: null, resolution_code: null, resolution_notes: null,
    intake_key: intakeKey, request_fingerprint: requestFingerprint,
  });
  if (inserted.outcome === 'conflict') return json({ ok: false, error: 'Idempotency-Key was already used for a different request' }, 409);
  return json({ ok: true, id: inserted.id, status: 'open', replayed: inserted.outcome === 'replayed' });
};
