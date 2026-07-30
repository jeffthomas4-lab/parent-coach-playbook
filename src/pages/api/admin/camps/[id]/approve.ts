// POST /api/admin/camps/:id/approve
// Approves a pending camp. Requires Cloudflare Access (admin email).

import type { APIRoute } from 'astro';
import { approveCamp, CampApprovalBlockedError, upsertDomainQuality } from '../../../../../lib/camps-db';
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

  const auth = await requireAdmin(request, env);
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

  // approveCamp reports whether THIS call performed the promotion into
  // 'approved'. Gating the domain-quality credit on that reported change
  // count — not on a prior read of camp state — is what makes a replayed
  // approve, or two admins racing on the same id, a no-op for the second
  // caller instead of a double credit. Clearing the awaiting_review flag on a
  // row that was already auto-approved at bulk-import time is not a promotion
  // and reports false. approveCamp applies the same gate to the submitter's
  // approved count.
  let approved;
  try {
    approved = await approveCamp(env.DB, id, auth.email, notes);
  } catch (error) {
    if (error instanceof CampApprovalBlockedError) {
      return new Response(JSON.stringify({ ok: false, error: 'camp is not eligible for approval', code: error.code }), {
        status: 409,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
      });
    }
    throw error;
  }
  if (!approved) {
    return new Response(JSON.stringify({ ok: false, error: 'camp not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  // Split the transition flag off the row so the response body keeps the
  // camp shape callers already expect.
  const { transitioned, ...camp } = approved;
  if (transitioned) {
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
