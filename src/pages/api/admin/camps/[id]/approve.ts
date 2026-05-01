// POST /api/admin/camps/:id/approve
// Approves a pending camp. Requires Cloudflare Access (admin email).

import type { APIRoute } from 'astro';
import { approveCamp } from '../../../../../lib/camps-db';
import { requireAdmin } from '../../../../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, locals }) => {
  const env = (locals as any).runtime?.env as { DB: D1Database } | undefined;
  if (!env?.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'database not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const auth = requireAdmin(request);
  if (auth instanceof Response) return auth;

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
    // ignore — notes are optional
  }

  const camp = await approveCamp(env.DB, id, auth.email, notes);
  if (!camp) {
    return new Response(JSON.stringify({ ok: false, error: 'camp not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  return new Response(JSON.stringify({ ok: true, camp }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
