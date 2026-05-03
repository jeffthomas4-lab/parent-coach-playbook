// POST /api/admin/camps/:id/verify
// Toggles or sets the camp's `verified` flag. Body { verified: boolean }.
// Requires Cloudflare Access (admin email).

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
  return json({ ok: true, camp });
};
