// POST /api/admin/link-health/recheck
// Admin "Recheck now" action: fetches a single tracked URL server-side
// (HEAD, falling back to GET) and writes the result back to link_health —
// the same status columns worker-link-checker's scheduled pass updates.
// Body: { url: string }

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { applyLinkCheckResult, checkLinkNow, getLinkHealthByUrl } from '../../../../lib/link-health';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

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

  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const url = typeof body.url === 'string' ? body.url.trim() : '';
  if (!url || !isHttpUrl(url)) {
    return json({ ok: false, error: 'a valid http(s) url is required' }, 400);
  }

  const existing = await getLinkHealthByUrl(env.DB, url);
  if (!existing) return json({ ok: false, error: 'url is not tracked in link_health' }, 404);

  const result = await checkLinkNow(url);
  await applyLinkCheckResult(env.DB, url, result);
  const updated = await getLinkHealthByUrl(env.DB, url);

  return json({ ok: true, result: updated });
};
