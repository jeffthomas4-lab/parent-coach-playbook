// POST /api/camps/check
//
// Pre-submission dedup probe. Used by the Claude in Chrome import flow and by
// future client-side submit forms to ask "is this likely already in the DB?"
// before doing the full submit. Cheap to call. Returns matches grouped by reason.

import type { APIRoute } from 'astro';
import { findFuzzyCampMatches, getDomainQuality, extractDomain } from '../../../lib/camps-db';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

interface CheckPayload {
  name?: string;
  city?: string;
  state?: string;
  zip?: string;
  address?: string;
  website_url?: string;
}

const ok = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const fail = (message: string, status = 400) => ok({ ok: false, error: message }, status);

async function readPayload(req: Request): Promise<CheckPayload> {
  const ct = (req.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) {
    return (await req.json()) as CheckPayload;
  }
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    const fd = await req.formData();
    const out: Record<string, string> = {};
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') out[k] = v;
    }
    return out as CheckPayload;
  }
  try {
    return (await req.json()) as CheckPayload;
  } catch {
    return {};
  }
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB: D1Database } | undefined;
  if (!env?.DB) return fail('database not available', 500);

  const data = await readPayload(request);
  if (!data.name || !data.city || !data.state) {
    return fail('name, city, and state are required');
  }

  const matches = await findFuzzyCampMatches(env.DB, {
    name: data.name,
    city: data.city,
    state: data.state.toUpperCase(),
    zip: data.zip ?? null,
    address: data.address ?? null,
    website_url: data.website_url ?? null,
  });

  // Domain reputation, if we know this source.
  const domain = extractDomain(data.website_url ?? null);
  const domainStats = domain ? await getDomainQuality(env.DB, domain) : null;

  return ok({
    ok: true,
    duplicate_count: matches.length,
    matches: matches.map((m) => ({
      id: m.camp.id,
      slug: m.camp.slug,
      name: m.camp.name,
      city: m.camp.city,
      state: m.camp.state,
      status: m.camp.status,
      website_url: m.camp.website_url,
      reason: m.reason,
    })),
    domain,
    domain_stats: domainStats,
  });
};
