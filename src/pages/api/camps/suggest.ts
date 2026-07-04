// POST /api/camps/suggest
//
// Public "suggest an organization" endpoint. Lighter-weight than /api/camps/submit:
// no dates, no address, no live-URL check. Just enough for admin to research and
// either build a full listing (insertCamp, via /camps/submit-quality data) or pass.
//
// Spam protection: a `website` honeypot field, same convention as /api/camps/submit.

import type { APIRoute } from 'astro';
import { insertOrgSuggestion, generateOrgSuggestionId } from '../../../lib/camps-db';

export const prerender = false;

interface SuggestPayload {
  website?: string; // honeypot
  org_name?: string;
  org_website?: string;
  org_city?: string;
  org_state?: string;
  activity_type?: string;
  submitter_email?: string;
  notes?: string;
}

const isEmail = (s: string | undefined): boolean => !!s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const ok = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
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

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database } | undefined;
  if (!env?.DB) return fail('database not available', 500);

  const data = await readPayload(request);

  if (data.website && data.website.trim().length > 0) {
    return ok({ ok: true });
  }

  const orgName = (data.org_name ?? '').trim();
  if (!orgName) return fail('org_name is required');
  if (orgName.length > 200) return fail('org_name too long');

  if (data.submitter_email && !isEmail(data.submitter_email)) {
    return fail('submitter_email is not a valid email');
  }

  const normalizedWebsite = data.org_website?.trim()
    ? (/^https?:\/\//i.test(data.org_website.trim()) ? data.org_website.trim() : `https://${data.org_website.trim()}`)
    : null;

  const id = generateOrgSuggestionId();
  await insertOrgSuggestion(env.DB, {
    id,
    org_name: orgName,
    org_website: normalizedWebsite,
    org_city: data.org_city?.trim() || null,
    org_state: data.org_state?.trim() ? data.org_state.trim().toUpperCase() : null,
    activity_type: data.activity_type?.trim() || null,
    submitter_email: data.submitter_email?.trim().toLowerCase() || null,
    notes: data.notes?.trim() || null,
    submitted_at: new Date().toISOString(),
  });

  return ok({ ok: true, id });
};
