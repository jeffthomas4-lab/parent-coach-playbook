// POST /admin/api/camps/:id/reject
//
// Mirror of /api/admin/camps/:id/reject under /admin/* for Access coverage.
// Redirects back to the spot-check queue on success.

import type { APIRoute } from 'astro';
import {
  rejectCamp,
  upsertDomainQuality,
  REJECT_REASON_CODES,
  type RejectReasonCode,
} from '../../../../../lib/camps-db';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const VALID_REASON_CODES = new Set<RejectReasonCode>(REJECT_REASON_CODES.map((r) => r.code));

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) {
    return new Response(JSON.stringify({ ok: false, error: 'database not available' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

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
  try {
    const ct = (request.headers.get('content-type') ?? '').toLowerCase();
    if (ct.includes('application/json')) {
      const body = (await request.json()) as { notes?: string; reason_code?: string };
      notes = body?.notes?.trim() || null;
      const rc = body?.reason_code?.trim() as RejectReasonCode | undefined;
      if (rc && VALID_REASON_CODES.has(rc)) reasonCode = rc;
    } else if (ct.includes('form')) {
      const fd = await request.formData();
      const v = fd.get('notes');
      if (typeof v === 'string' && v.trim()) notes = v.trim();
      const rc = fd.get('reason_code');
      if (typeof rc === 'string' && VALID_REASON_CODES.has(rc as RejectReasonCode)) {
        reasonCode = rc as RejectReasonCode;
      }
    }
  } catch {
    // ignore
  }

  // rejectCamp performs a single atomic conditional UPDATE and reports
  // whether THIS call transitioned the row (WHERE pcd_status != 'rejected').
  // Gating the domain-quality upsert on that reported change count — not a
  // prior read of camp state — is what makes a repeat reject on an
  // already-rejected camp, or two concurrent reject requests racing on the
  // same id, a no-op for the second caller instead of a double decrement.
  const { camp, transitioned } = await rejectCamp(env.DB, id, auth.email, notes, reasonCode);
  if (!camp) {
    return new Response(JSON.stringify({ ok: false, error: 'camp not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  if (transitioned) {
    await upsertDomainQuality(env.DB, camp.source_domain, 'rejected');
  }

  return new Response(null, {
    status: 303,
    headers: { Location: '/admin/camps/spot-check' },
  });
};
