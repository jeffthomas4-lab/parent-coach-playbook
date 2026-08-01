import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { recordReview } from '../../../../../lib/editorial-records';
import { createRequestLogger } from '../../../../../lib/log';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

// Domain errors authored in src/lib/editorial-records.ts (recordReview). These
// are the only messages echoed to the caller; anything else — a D1 driver
// failure, say — is logged server-side and collapses to a fixed slug so
// provider text never reaches the browser. The regex entries cover the
// messages that interpolate a state name or review type.
const KNOWN_ERRORS: readonly (string | RegExp)[] = [
  'opportunity not found',
  'opportunity changed concurrently',
  /^opportunity must be in .+ to record a .+ review$/,
  /^invalid opportunity transition/,
];
const isKnownError = (message: string) =>
  KNOWN_ERRORS.some((known) => (typeof known === 'string' ? known === message : known.test(message)));

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const logger = createRequestLogger(request, { route: 'admin/editorial/reviews/create', userId: auth.email });
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }
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
    const message = error instanceof Error ? error.message : '';
    if (isKnownError(message)) {
      return json({ ok: false, error: message }, message.endsWith('not found') ? 404 : 409);
    }
    logger.error('editorial_record_write_failed', error, { opportunityId: body.opportunity_id });
    return json({ ok: false, error: 'editorial_record_write_failed' }, 500);
  }
};
