import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../../../lib/admin-auth';
import { approveTrustResponseDraft } from '../../../../../../../lib/trust-cases';

export const prerender = false;
const json = (body: unknown, status = 200) => Response.json(body, { status });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  if (!params.id || !params.draftId) return json({ ok: false, error: 'missing id' }, 400);

  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson = contentType.includes('application/json');
  let note = '';
  let confirmed = false;
  try {
    if (wantsJson) {
      const body = await request.json() as { note?: string; confirm_payload?: boolean };
      note = body.note?.trim() ?? '';
      confirmed = body.confirm_payload === true;
    } else {
      const form = await request.formData();
      note = typeof form.get('note') === 'string' ? String(form.get('note')).trim() : '';
      confirmed = form.get('confirm_payload') === 'yes';
    }
  } catch { return json({ ok: false, error: 'invalid request' }, 400); }
  if (!confirmed) return json({ ok: false, error: 'payload confirmation required' }, 400);
  if (note.length < 10 || note.length > 1000) return json({ ok: false, error: 'approval note must be 10-1000 characters' }, 400);

  try {
    const draft = await approveTrustResponseDraft(env.PCD_OPS_DB, params.id, params.draftId, auth.email, note);
    if (!draft) return json({ ok: false, error: 'draft not found' }, 404);
    if (!wantsJson) return Response.redirect(new URL('/admin/trust/drafts/', request.url), 303);
    return json({ ok: true, draft, delivery: 'not authorized; separate approval required' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'approval failed';
    if (['draft is not pending', 'draft expired', 'draft payload hash mismatch', 'draft changed concurrently'].includes(message)) {
      return json({ ok: false, error: message }, 409);
    }
    throw error;
  }
};
