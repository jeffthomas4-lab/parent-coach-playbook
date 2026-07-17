// POST /api/camps/check
//
// Authenticated bulk-import dedup probe. Returns internal match and domain
// quality details, so it must never be exposed as a public client-side helper.

import type { APIRoute } from 'astro';
import { findFuzzyCampMatches, getDomainQuality, extractDomain } from '../../../lib/camps-db';
import { env as cfEnv } from 'cloudflare:workers';
import { enforcePublicRequestBoundary, firstOversizedField, normalizeExternalHttpUrl } from '../../../lib/public-input';
import { bearerCredential, secretsMatch } from '../../../lib/secrets';

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
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
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
  const env = cfEnv as { DB: D1Database; BULK_IMPORT_TOKEN?: string } | undefined;
  if (!env?.DB) return fail('database not available', 500);
  if (!env.BULK_IMPORT_TOKEN) return fail('service not configured', 503);
  if (!await secretsMatch(bearerCredential(request), env.BULK_IMPORT_TOKEN)) return fail('not found', 404);
  const boundary = await enforcePublicRequestBoundary(request, 8_192);
  if (boundary) return boundary;

  const data = await readPayload(request);
  const oversized = firstOversizedField(data as Record<string, unknown>, {
    name: 200, city: 120, state: 40, zip: 20, address: 300, website_url: 2048,
  });
  if (oversized) return fail(`${oversized} too long`);
  if (!data.name || !data.city || !data.state) {
    return fail('name, city, and state are required');
  }

  let websiteUrl: string | null = null;
  try { websiteUrl = normalizeExternalHttpUrl(data.website_url); }
  catch (error) { return fail(error instanceof Error ? error.message : 'website_url is invalid'); }

  const matches = await findFuzzyCampMatches(env.DB, {
    name: data.name,
    city: data.city,
    state: data.state.toUpperCase(),
    zip: data.zip ?? null,
    address: data.address ?? null,
    website_url: websiteUrl,
  });

  // Domain reputation, if we know this source.
  const domain = extractDomain(websiteUrl);
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
