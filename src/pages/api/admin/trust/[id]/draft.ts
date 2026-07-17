import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { createTrustResponseDraft } from '../../../../../lib/trust-cases';

export const prerender = false;
const json = (body: unknown, status = 200) => Response.json(body, { status });

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
  let subject = '';
  let bodyText = '';
  try {
    if (wantsJson) {
      const body = await request.json() as { subject?: string; body_text?: string };
      subject = body.subject?.trim() ?? '';
      bodyText = body.body_text?.trim() ?? '';
    } else {
      const form = await request.formData();
      subject = typeof form.get('subject') === 'string' ? String(form.get('subject')).trim() : '';
      bodyText = typeof form.get('body_text') === 'string' ? String(form.get('body_text')).trim() : '';
    }
  } catch { return json({ ok: false, error: 'invalid request' }, 400); }
  if (subject.length < 3 || subject.length > 200) return json({ ok: false, error: 'subject must be 3-200 characters' }, 400);
  if (bodyText.length < 20 || bodyText.length > 10_000) return json({ ok: false, error: 'body_text must be 20-10000 characters' }, 400);

  const draft = await createTrustResponseDraft(env.PCD_OPS_DB, params.id, auth.email, subject, bodyText);
  if (!draft) return json({ ok: false, error: 'case not found or closed' }, 404);
  if (!wantsJson) return Response.redirect(new URL('/admin/trust/', request.url), 303);
  return json({ ok: true, draft, delivery: 'not authorized; separate approval required' }, 201);
};
