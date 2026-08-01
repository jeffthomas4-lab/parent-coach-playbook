// POST /api/admin/camps/:id/reject
// Rejects a pending camp. Requires Cloudflare Access (admin email).

import type { APIRoute } from 'astro';
import {
  rejectCamp,
  upsertDomainQuality,
  REJECT_REASON_CODES,
  type RejectReasonCode,
  type Camp,
} from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { withAdminReceipt, type MutationOutcome } from '../../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../../lib/log';
import { purgeCampsLiteEdgeCache } from '../../../../../lib/camps-lite-cache';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const VALID_REASON_CODES = new Set<RejectReasonCode>(REJECT_REASON_CODES.map((r) => r.code));

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as
    | { DB: D1Database; ADMIN_EMAILS?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string }
    | undefined;
  if (!env?.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'database not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/camps/reject', userId: auth.email });

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ ok: false, error: 'missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  let notes: string | null = null;
  let reasonCode: RejectReasonCode | null = null;
  let isForm = false;
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { notes?: string; reason_code?: string };
      notes = body?.notes?.trim() || null;
      const rc = body?.reason_code?.trim() as RejectReasonCode | undefined;
      if (rc && VALID_REASON_CODES.has(rc)) reasonCode = rc;
    } else if (ct.includes('form')) {
      isForm = true;
      const fd = await request.formData();
      const v = fd.get('notes');
      if (typeof v === 'string' && v.trim()) notes = v.trim();
      const rc = fd.get('reason_code');
      if (typeof rc === 'string' && VALID_REASON_CODES.has(rc as RejectReasonCode)) {
        reasonCode = rc as RejectReasonCode;
      }
    }
  } catch (error) {
    logger.error('parse_body_failed', error, { fallback: 'proceeding_with_no_notes_or_reason' });
  }

  const requestId = logger.requestId;

  const receipted = await withAdminReceipt(
    {
      env,
      environment: env.SITE_URL ?? 'unknown',
      actorEmail: auth.email,
      action: 'camp.reject',
      resourceType: 'camp',
      resourceId: id,
      requestId,
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    },
    async (): Promise<MutationOutcome<{ camp: Camp }>> => {
      // rejectCamp performs a single atomic conditional UPDATE and reports
      // whether THIS call transitioned the row (WHERE pcd_status != 'rejected').
      // Gating the domain-quality upsert on that reported change count — not a
      // prior read of camp state — is what makes a repeat reject on an
      // already-rejected camp, or two concurrent reject requests racing on the
      // same id, a no-op for the second caller instead of a double decrement.
      const { camp, transitioned } = await rejectCamp(env.DB, id, auth.email, notes, reasonCode);
      if (!camp) {
        return {
          outcome: 'error',
          reason: 'camp_not_found',
          response: new Response(JSON.stringify({ ok: false, error: 'camp not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          }),
        };
      }

      if (transitioned) {
        await upsertDomainQuality(env.DB, camp.source_domain, 'rejected');
        // A reject can REMOVE a camp from /api/camps/lite's result set
        // (approved -> rejected). See src/lib/camps-lite-cache.ts for this
        // call's stated TTL and invalidation path.
        await purgeCampsLiteEdgeCache();
      }

      return {
        outcome: 'success',
        value: { camp },
        beforeSummary: 'pcd_status!=rejected',
        afterSummary: `pcd_status=rejected${reasonCode ? ` reason=${reasonCode}` : ''}`,
      };
    },
  );

  if ('response' in receipted) return receipted.response;
  const { camp } = receipted.value;

  if (isForm) {
    return new Response(null, {
      status: 303,
      headers: { Location: '/admin/camps/' },
    });
  }

  return new Response(JSON.stringify({ ok: true, camp }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
