// POST /admin/api/camps/:id/reject
//
// Mirror of /api/admin/camps/:id/reject under /admin/* for Access coverage.
// Redirects back to the spot-check queue on success.

import type { APIRoute } from 'astro';
import { rejectCamp } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'database not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const auth = requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: 'missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  let notes: string | null = null;
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { notes?: string };
      notes = body?.notes?.trim() || null;
    } else if (ct.includes('form')) {
      const fd = await request.formData();
      const v = fd.get('notes');
      if (typeof v === 'string' && v.trim()) notes = v.trim();
    }
  } catch {
    // ignore
  }

  const camp = await rejectCamp(env.DB, id, auth.email, notes);
  if (!camp) {
    return new Response(JSON.stringify({ ok: false, error: 'camp not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/admin/camps/spot-check' },
  });
};
