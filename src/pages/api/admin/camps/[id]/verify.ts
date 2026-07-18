// POST /api/admin/camps/:id/verify
// Toggles or sets the camp's `verified` flag. Body { verified: boolean }.
// Requires Cloudflare Access (admin email).

import type { APIRoute } from 'astro';
import { CampVerificationBlockedError, setVerified, getCampById } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  let verified = true;
  let isForm = false;
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { verified?: boolean };
      verified = body?.verified ?? true;
    } else if (ct.includes('form')) {
      isForm = true;
      const fd = await request.formData();
      const v = fd.get('verified');
      verified = v === 'true' || v === 'on' || v === '1';
    }
  } catch {
    // default to true
  }

  const existing = await getCampById(env.DB, id);
  if (!existing) return json({ ok: false, error: 'camp not found' }, 404);
  try {
    await setVerified(env.DB, id, verified);
  } catch (error) {
    if (error instanceof CampVerificationBlockedError) {
      return json({ ok: false, error: error.code }, 409);
    }
    throw error;
  }
  const camp = await getCampById(env.DB, id);

  // Browser form submissions get redirected back to the camp's admin page.
  // Programmatic JSON callers still receive the JSON response.
  if (isForm) {
    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/camps/${id}/` },
    });
  }

  return json({ ok: true, camp });
};
