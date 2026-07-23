// POST /api/admin/camps/:id/request-info
//
// Pulls a pending camp out of the visible admin queue and flags it for the
// unattended "camp info research" task, carrying the admin's freeform note
// on what's missing (e.g. "need actual camp name, dates, etc."). The task
// runs the request exactly once: it either fills in what it can find and
// clears the flag (camp reappears in the queue for a normal approve/reject),
// or rejects the camp outright if it can't (no retry loop — see
// migrations/0018_camp_info_requests.sql). Requires Cloudflare Access (admin
// email), same as approve/reject.

import type { APIRoute } from 'astro';
import { requestCampInfo, getCampById } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  let notes = '';
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { notes?: string };
      notes = body?.notes?.trim() || '';
    } else if (ct.includes('form')) {
      const fd = await request.formData();
      const v = fd.get('notes');
      if (typeof v === 'string') notes = v.trim();
    }
  } catch {
    // ignore, handled by the empty-notes check below
  }

  if (!notes) return json({ ok: false, error: 'notes required — say what you need' }, 400);

  const existing = await getCampById(env.DB, id);
  if (!existing) return json({ ok: false, error: 'camp not found' }, 404);

  const camp = await requestCampInfo(env.DB, id, auth.email, notes);

  return json({ ok: true, camp });
};
