// POST /api/admin/link-health/resolve
// Admin "Mark resolved" action: an admin fixed the link in content directly
// (edited the markdown source, or decided the flag is fine to ignore), so
// this stamps resolved_at/resolved_by and the row drops out of the default
// broken-links list on /admin/link-health/. Additive-only — never deletes
// the row or its check history.
// Body: { url: string }

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { getLinkHealthByUrl, markLinkResolved } from '../../../../lib/link-health';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const url = typeof body.url === 'string' ? body.url.trim() : '';
  if (!url) return json({ ok: false, error: 'url is required' }, 400);

  const existing = await getLinkHealthByUrl(env.DB, url);
  if (!existing) return json({ ok: false, error: 'url is not tracked in link_health' }, 404);

  const changed = await markLinkResolved(env.DB, url, auth.email);
  if (!changed) return json({ ok: false, error: 'url could not be updated' }, 409);

  return json({ ok: true, resolvedBy: auth.email });
};
