// POST /api/admin/reviews/:id/approve
// Approves a pending camp review. Requires Cloudflare Access.

import type { APIRoute } from 'astro';
import { approveReview } from '../../../../../lib/camps-db';
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
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string; CAMP_REVIEWS_ENABLED?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  if (!featureEnabled(env.CAMP_REVIEWS_ENABLED)) {
    return json({ ok: false, error: 'camp reviews are not currently available' }, 404);
  }

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  let notes: string | null = null;
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { notes?: string };
      notes = body?.notes?.trim() || null;
    } else if (ct.includes('form')) {
      const fd = await request.formData();
      const v = fd.get('notes');
      if (typeof v === 'string' && v.trim()) notes = v.trim();
    }
  } catch {
    // optional
  }

  const review = await approveReview(env.DB, id, auth.email, notes);
  if (!review) return json({ ok: false, error: 'review not found' }, 404);
  return json({ ok: true, review });
};
