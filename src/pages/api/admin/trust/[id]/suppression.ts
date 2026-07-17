import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { proposeContentSuppression, type SuppressionReason } from '../../../../../lib/trust-cases';

export const prerender = false;
const json = (body: unknown, status = 200) => Response.json(body, { status });
const REASONS = ['rights_request', 'operator_request', 'duplicate', 'unsafe_source', 'legal_hold', 'other'];

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  if (!params.id) return json({ ok: false, error: 'missing id' }, 400);

  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson = contentType.includes('application/json');
  let reason: string | null;
  if (wantsJson) {
    try { reason = (await request.json() as { reason_code?: string }).reason_code ?? null; }
    catch { return json({ ok: false, error: 'invalid request' }, 400); }
  } else {
    const form = await request.formData();
    reason = typeof form.get('reason_code') === 'string' ? form.get('reason_code') as string : null;
  }
  if (!reason || !REASONS.includes(reason)) return json({ ok: false, error: 'invalid reason_code' }, 400);

  const suppression = await proposeContentSuppression(env.PCD_OPS_DB, params.id, reason as SuppressionReason, auth.email);
  if (!suppression) return json({ ok: false, error: 'case not found or has no suppressible target' }, 404);
  if (!wantsJson) return Response.redirect(new URL('/admin/trust/', request.url), 303);
  return json({ ok: true, suppression, activation: 'separate approval required' });
};
