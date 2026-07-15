// POST /api/admin/camps/:id/approve
// Approves a pending camp. Requires Cloudflare Access (admin email).

import type { APIRoute } from 'astro';
import { approveCamp, getCampById, upsertDomainQuality } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
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
  let isForm = false;
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { notes?: string };
      notes = body?.notes?.trim() || null;
    } else if (ct.includes('form')) {
      isForm = true;
      const fd = await request.formData();
      const v = fd.get('notes');
      if (typeof v === 'string' && v.trim()) notes = v.trim();
    }
  } catch {
    // ignore
  }

  // Read prior state so we can tell whether this approve is a true
  // pending→approved transition or just clearing the awaiting_review flag on
  // a row that was already auto-approved at bulk-import time. The latter case
  // skips the domain-quality increment to avoid double-counting an approve.
  const before = await getCampById(env.DB, id);
  const wasAlreadyApproved =
    before?.status === 'approved' && before?.awaiting_review === 1;

  const camp = await approveCamp(env.DB, id, auth.email, notes);
  if (!camp) {
    return new Response(JSON.stringify({ ok: false, error: 'camp not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  if (!wasAlreadyApproved) {
    await upsertDomainQuality(env.DB, camp.source_domain, 'approved');
  }

  if (isForm) {
    return new Response(null, {
      status: 303,
      headers: { Location: `/admin/camps/${id}/` },
    });
  }

  return new Response(JSON.stringify({ ok: true, camp }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
