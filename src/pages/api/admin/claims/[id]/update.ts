// POST /api/admin/claims/:id/update
// Admin updates a camp claim's status. Body { status: 'verified' | 'paid' | 'rejected', notes? }.
// When status='paid', also marks the camp as claimed and sets the paid-until window.

import type { APIRoute } from 'astro';
import { getClaimById, updateClaimStatus, markCampClaimed, type ClaimStatus } from '../../../../../lib/camps-db';
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

  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  let payload: { status?: string; notes?: string; paid_until?: string } = {};
  if (ct.includes('application/json')) {
    payload = (await request.json()) as typeof payload;
  } else {
    const fd = await request.formData();
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') (payload as any)[k] = v;
    }
  }

  const status = payload.status as ClaimStatus | undefined;
  if (!status || !['verified', 'paid', 'rejected'].includes(status)) {
    return json({ ok: false, error: 'status must be verified | paid | rejected' }, 400);
  }

  const claim = await getClaimById(env.DB, id);
  if (!claim) return json({ ok: false, error: 'claim not found' }, 404);

  const updated = await updateClaimStatus(env.DB, id, status, auth.email, payload.notes?.trim() || null);

  // If marking paid, also flip the camp's claimed flag.
  if (status === 'paid' && updated) {
    await markCampClaimed(env.DB, updated.camp_id, updated.claimant_email, payload.paid_until?.trim() || undefined);
  }

  return json({ ok: true, claim: updated });
};
