// POST /api/admin/link-health/suggest-replacement
// Admin "Replace URL" action. link_health's rows are sourced from repo
// markdown content files (see worker-link-checker's manifest sync), not the
// other way around, so writing a replacement here can never change a
// published page by itself. This stores the admin's chosen replacement URL
// as suggested_replacement; the /admin/link-health/ dashboard then renders
// it next to source_files so applying the fix is a copy-paste into those
// files, not an automatic content edit.
// Body: { url: string; suggestedReplacement: string }

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { getLinkHealthByUrl, setSuggestedReplacement } from '../../../../lib/link-health';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const MAX_REPLACEMENT_LENGTH = 2000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  let body: { url?: string; suggestedReplacement?: string };
  try {
    body = (await request.json()) as { url?: string; suggestedReplacement?: string };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const url = typeof body.url === 'string' ? body.url.trim() : '';
  if (!url) return json({ ok: false, error: 'url is required' }, 400);

  const suggestedReplacement = typeof body.suggestedReplacement === 'string' ? body.suggestedReplacement.trim() : '';
  if (!suggestedReplacement || suggestedReplacement.length > MAX_REPLACEMENT_LENGTH || !isHttpUrl(suggestedReplacement)) {
    return json({ ok: false, error: 'suggestedReplacement must be a valid http(s) url' }, 400);
  }

  const existing = await getLinkHealthByUrl(env.DB, url);
  if (!existing) return json({ ok: false, error: 'url is not tracked in link_health' }, 404);

  const changed = await setSuggestedReplacement(env.DB, url, suggestedReplacement);
  if (!changed) return json({ ok: false, error: 'url could not be updated' }, 409);

  return json({ ok: true, suggestedReplacement });
};
