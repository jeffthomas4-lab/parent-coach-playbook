// POST /api/admin/claims/:id/update
// Admin updates a camp claim's evidence-review status.
// Payment and ownership activation are deliberately not transitions here: the
// paid product needs a reconciled payment/entitlement ledger and customer RBAC.

import type { APIRoute } from 'astro';
import { getClaimById, updateClaimStatus, type ClaimStatus } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string; CAMP_CLAIMS_ENABLED?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  if (!featureEnabled(env.CAMP_CLAIMS_ENABLED)) {
    return json({ ok: false, error: 'camp claims are not currently available' }, 404);
  }

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  let payload: { status?: string; notes?: string } = {};
  if (ct.includes('application/json')) {
    payload = (await request.json()) as typeof payload;
  } else {
    const fd = await request.formData();
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') (payload as any)[k] = v;
    }
  }

  const status = payload.status as ClaimStatus | undefined;
  if (!status || !['verified', 'rejected'].includes(status)) {
    return json({ ok: false, error: 'status must be verified | rejected' }, 400);
  }

  const claim = await getClaimById(env.DB, id);
  if (!claim) return json({ ok: false, error: 'claim not found' }, 404);

  const updated = await updateClaimStatus(env.DB, id, status, auth.email, payload.notes?.trim() || null);

  return json({ ok: true, claim: updated });
};
