// POST /api/admin/intel/review/:id
// A human resolves one review-queue detection as accepted or rejected.
// Body: { decision: 'accepted' | 'rejected', notes?: string }
// 404 when the item does not exist, or is no longer pending (resolveReviewItem
// reports false for both — the queue row's own status is the only source of
// truth here, no separate existence check to race against it).

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { resolveReviewItem } from '../../../../../lib/intel/store';
import { withAdminReceipt, type MutationOutcome } from '../../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../../lib/log';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

const DECISIONS = new Set(['accepted', 'rejected']);

export const POST: APIRoute = async ({ params, request }) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'POST' });

  const env = cfEnv as { DB?: D1Database; ADMIN_EMAILS?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/review/[id]', userId: auth.email });

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  let body: { decision?: string; notes?: string };
  try {
    body = (await request.json()) as { decision?: string; notes?: string };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const decision = typeof body.decision === 'string' ? body.decision.trim() : '';
  if (!DECISIONS.has(decision)) return json({ ok: false, error: 'decision must be accepted or rejected' }, 400);
  const notes = typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim().slice(0, 500) : undefined;

  const requestId = logger.requestId;

  const receipted = await withAdminReceipt(
    {
      env,
      environment: env.SITE_URL ?? 'unknown',
      actorEmail: auth.email,
      action: 'intel.review.resolve',
      resourceType: 'intel_review_queue',
      resourceId: id,
      requestId,
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    },
    async (): Promise<MutationOutcome<{ id: string; decision: 'accepted' | 'rejected' }>> => {
      let resolved: boolean;
      try {
        resolved = await resolveReviewItem(env.DB!, id, {
          status: decision as 'accepted' | 'rejected',
          resolvedBy: auth.email,
          notes,
        });
      } catch (error) {
        logger.error('intel_review_resolve_failed', error, { reviewId: id });
        return {
          outcome: 'error',
          reason: 'resolve_threw',
          response: json({ ok: false, error: 'review item could not be resolved' }, 500),
        };
      }
      if (!resolved) {
        return {
          outcome: 'blocked',
          reason: 'not_found_or_not_pending',
          response: json({ ok: false, error: 'review item not found or already resolved' }, 404),
        };
      }
      return {
        outcome: 'success',
        value: { id, decision: decision as 'accepted' | 'rejected' },
        beforeSummary: 'status=pending',
        afterSummary: `status=${decision}${notes ? ' notes_set' : ''}`,
      };
    },
  );

  if ('response' in receipted) return receipted.response;
  return json({ ok: true, ...receipted.value });
};
