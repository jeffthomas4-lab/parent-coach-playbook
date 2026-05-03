// POST /admin/api/camps/:id/verify
//
// Mirror of /api/admin/camps/:id/verify but under /admin/* so it's covered by
// the existing Cloudflare Access policy on /admin/*. The /api/admin/* path
// requires its own Access coverage which proved fiddly to configure; this
// endpoint sidesteps that.
//
// On success, redirects back to /admin/camps/spot-check so the queue refreshes
// and the just-verified row drops off naturally. On error, returns JSON.

import type { APIRoute } from 'astro';
import { setVerified, getCampById } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  let verified = true;
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { verified?: boolean };
      verified = body?.verified ?? true;
    } else if (ct.includes('form')) {
      const fd = await request.formData();
      const v = fd.get('verified');
      verified = v === 'true' || v === 'on' || v === '1';
    }
  } catch {
    // default to true
  }

  await setVerified(env.DB, id, verified);
  const camp = await getCampById(env.DB, id);
  if (!camp) return json({ ok: false, error: 'camp not found' }, 404);

  // Redirect back to the spot-check queue so the row drops off and the page
  // reloads. 303 is the standard "after POST, navigate to a GET" status.
  return new Response(null, {
    status: 303,
    headers: { Location: '/admin/camps/spot-check' },
  });
};
