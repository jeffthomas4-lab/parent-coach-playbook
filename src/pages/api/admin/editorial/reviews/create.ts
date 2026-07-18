import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { recordReview } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);

  const body = await request.json() as Record<string, unknown>;
  if (typeof body.opportunity_id !== 'string' || !body.opportunity_id) return json({ ok: false, error: 'opportunity_id is required' }, 400);
  if (body.review_type !== 'editorial' && body.review_type !== 'seo_ai') return json({ ok: false, error: 'review_type must be editorial or seo_ai' }, 400);
  if (body.outcome !== 'pass' && body.outcome !== 'changes_requested') return json({ ok: false, error: 'outcome must be pass or changes_requested' }, 400);
  if (typeof body.notes === 'string' && body.notes.length > 2000) return json({ ok: false, error: 'notes too long' }, 400);

  try {
    const review = await recordReview(env.PCD_OPS_DB, {
      opportunityId: body.opportunity_id,
      reviewType: body.review_type,
      outcome: body.outcome,
      reviewer: auth.email,
      notes: typeof body.notes === 'string' ? body.notes : null,
      actor: auth.email,
    });
    return json({ ok: true, review }, 201);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('not found')) return json({ ok: false, error: error.message }, 404);
    if (error instanceof Error) return json({ ok: false, error: error.message }, 409);
    throw error;
  }
};
