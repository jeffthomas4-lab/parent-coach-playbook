import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { updateTrustCaseStatus, type TrustCaseStatus, type TrustResolutionCode } from '../../../../../lib/trust-cases';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  if (!params.id) return json({ ok: false, error: 'missing id' }, 400);

  const ct = request.headers.get('content-type') ?? '';
  const wantsJson = ct.includes('application/json');
  let status: string | null = null;
  let notes: string | null = null;
  let resolutionCode: string | null = null;
  if (ct.includes('application/json')) {
    const body = await request.json() as { status?: string; notes?: string };
    status = body.status ?? null; notes = body.notes?.trim() || null;
    resolutionCode = (body as { resolution_code?: string }).resolution_code ?? null;
  } else {
    const form = await request.formData();
    status = typeof form.get('status') === 'string' ? form.get('status') as string : null;
    notes = typeof form.get('notes') === 'string' ? (form.get('notes') as string).trim() || null : null;
    resolutionCode = typeof form.get('resolution_code') === 'string' ? form.get('resolution_code') as string : null;
  }
  if (!status || !['in_review', 'resolved', 'closed'].includes(status)) return json({ ok: false, error: 'invalid status' }, 400);
  if (notes && notes.length > 2000) return json({ ok: false, error: 'notes too long' }, 400);
  const terminal = status === 'resolved' || status === 'closed';
  const resolutionCodes = ['corrected', 'removed', 'fulfilled', 'no_action', 'duplicate', 'out_of_scope', 'referred'];
  if (terminal && (!notes || notes.length < 10)) return json({ ok: false, error: 'terminal status requires resolution notes' }, 400);
  if (terminal && (!resolutionCode || !resolutionCodes.includes(resolutionCode))) return json({ ok: false, error: 'terminal status requires resolution_code' }, 400);
  if (!terminal) resolutionCode = null;
  let updated;
  try {
    updated = await updateTrustCaseStatus(env.PCD_OPS_DB, params.id, status as TrustCaseStatus, auth.email, notes, resolutionCode as TrustResolutionCode | null);
  } catch (error) {
    if (error instanceof Error && ['invalid case transition', 'case changed concurrently'].includes(error.message)) {
      return json({ ok: false, error: error.message }, 409);
    }
    throw error;
  }
  if (!updated) return json({ ok: false, error: 'case not found' }, 404);
  if (!wantsJson) return Response.redirect(new URL('/admin/trust/', request.url), 303);
  return json({ ok: true, case: updated });
};
