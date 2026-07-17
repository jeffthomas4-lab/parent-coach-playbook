import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../../../lib/admin-auth';
import { reconcileTrustDraftDelivery } from '../../../../../../../lib/trust-cases';

export const prerender = false;
const json = (body: unknown, status = 200) => Response.json(body, { status });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  if (!params.id || !params.attemptId) return json({ ok: false, error: 'missing id' }, 400);

  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson = contentType.includes('application/json');
  let outcome = '';
  let evidenceReference = '';
  let note = '';
  let confirmed = false;
  try {
    if (wantsJson) {
      const body = await request.json() as { outcome?: string; evidence_reference?: string; note?: string; confirm_no_retry?: boolean };
      outcome = body.outcome ?? '';
      evidenceReference = body.evidence_reference?.trim() ?? '';
      note = body.note?.trim() ?? '';
      confirmed = body.confirm_no_retry === true;
    } else {
      const form = await request.formData();
      outcome = typeof form.get('outcome') === 'string' ? String(form.get('outcome')) : '';
      evidenceReference = typeof form.get('evidence_reference') === 'string' ? String(form.get('evidence_reference')).trim() : '';
      note = typeof form.get('note') === 'string' ? String(form.get('note')).trim() : '';
      confirmed = form.get('confirm_no_retry') === 'yes';
    }
  } catch { return json({ ok: false, error: 'invalid request' }, 400); }
  if (!['confirmed_sent', 'confirmed_not_sent'].includes(outcome)) return json({ ok: false, error: 'invalid outcome' }, 400);
  if (!confirmed) return json({ ok: false, error: 'no-retry confirmation required' }, 400);
  if (!/^[A-Za-z0-9._:/?#=&-]{3,500}$/.test(evidenceReference)) return json({ ok: false, error: 'invalid evidence_reference' }, 400);
  if (note.length < 10 || note.length > 1000) return json({ ok: false, error: 'note must be 10-1000 characters' }, 400);

  try {
    const attempt = await reconcileTrustDraftDelivery(
      env.PCD_OPS_DB, params.id, params.attemptId, auth.email,
      outcome as 'confirmed_sent' | 'confirmed_not_sent', evidenceReference, note,
    );
    if (!attempt) return json({ ok: false, error: 'delivery attempt not found' }, 404);
    if (!wantsJson) return Response.redirect(new URL('/admin/trust/deliveries/', request.url), 303);
    return json({ ok: true, attempt, retry: 'not performed' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'reconciliation failed';
    if (['delivery attempt is not reconcilable', 'delivery is already consistent', 'delivery reconciliation changed concurrently'].includes(message)) {
      return json({ ok: false, error: message }, 409);
    }
    throw error;
  }
};
