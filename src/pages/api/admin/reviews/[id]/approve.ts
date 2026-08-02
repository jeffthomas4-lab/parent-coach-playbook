// POST /api/admin/reviews/:id/approve
// Approves a pending camp review. Requires Cloudflare Access.

import type { APIRoute } from 'astro';
import { approveReview } from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { withAdminReceipt, type MutationOutcome } from '../../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../../lib/log';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as
    | { DB: D1Database; ADMIN_EMAILS?: string; CAMP_REVIEWS_ENABLED?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string }
    | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/reviews/approve', userId: auth.email });

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
  } catch (error) {
    logger.error('parse_body_failed', error, { fallback: 'proceeding_with_no_notes' });
  }

  const requestId = logger.requestId;

  const receipted = await withAdminReceipt(
    {
      env,
      environment: env.SITE_URL ?? 'unknown',
      actorEmail: auth.email,
      action: 'review.approve',
      resourceType: 'camp_review',
      resourceId: id,
      requestId,
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    },
    async (): Promise<MutationOutcome<{ review: Record<string, unknown> }>> => {
      const result = await approveReview(env.DB, id, auth.email, notes);
      if (!result) {
        return {
          outcome: 'error',
          reason: 'review_not_found',
          response: json({ ok: false, error: 'review not found' }, 404),
        };
      }
      // approveReview's UPDATE is guarded on status = 'pending'. A false
      // `transitioned` means another admin already decided this review, so
      // reporting success here would silently overwrite their call.
      const { transitioned, ...review } = result;
      if (transitioned === false) {
        return {
          outcome: 'blocked',
          reason: 'review_state_changed',
          response: json({ ok: false, error: 'review already decided', code: 'review_state_changed' }, 409),
        };
      }
      return {
        outcome: 'success',
        value: { review },
        beforeSummary: 'status=pending',
        afterSummary: `status=approved${notes ? ' notes_set' : ''}`,
      };
    },
  );

  if ('response' in receipted) return receipted.response;
  return json({ ok: true, review: receipted.value.review });
};
