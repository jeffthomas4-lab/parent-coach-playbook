// POST /api/admin/suggestions/:id/update
// Admin updates a suggested organization's status. Body { status: 'reviewed' | 'imported' }.

import type { APIRoute } from 'astro';
import { getOrgSuggestionById, updateOrgSuggestionStatus, type OrgSuggestionStatus } from '../../../../../lib/camps-db';
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
  let payload: { status?: string } = {};
  if (ct.includes('application/json')) {
    payload = (await request.json()) as typeof payload;
  } else {
    const fd = await request.formData();
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') (payload as any)[k] = v;
    }
  }

  const status = payload.status as OrgSuggestionStatus | undefined;
  if (!status || !['reviewed', 'imported'].includes(status)) {
    return json({ ok: false, error: 'status must be reviewed | imported' }, 400);
  }

  const suggestion = await getOrgSuggestionById(env.DB, id);
  if (!suggestion) return json({ ok: false, error: 'suggestion not found' }, 404);

  const updated = await updateOrgSuggestionStatus(env.DB, id, status);
  return json({ ok: true, suggestion: updated });
};
