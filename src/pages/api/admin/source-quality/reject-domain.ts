// POST /api/admin/source-quality/reject-domain
//
// Bulk-destructive action: rejects every still-pending program whose
// source_domain matches. Body: { domain: string, confirm: true }.
// `confirm` must be exactly boolean true (or the string "true") — the UI
// arms the button on first click and only sends this request on the second,
// confirming click. Missing/false confirm is refused server-side too, so the
// gate holds even if the UI is bypassed.
//
// reject_reason_code is 'other': none of the fixed REJECT_REASON_CODES
// (duplicate, dead-url, unverifiable-address, missing-required-field,
// off-brand, past-date, aggregator-source, low-confidence, spam) describes
// "this domain's overall track record is bad," so the domain itself is named
// in review_notes instead of forcing a specific-cause code that may not apply
// to every row swept up in the bulk action.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { bulkRejectPendingByDomain } from '../../../../lib/domain-skip-list';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

interface RejectDomainPayload {
  domain?: string;
  confirm?: boolean | string;
}

async function readPayload(request: Request): Promise<RejectDomainPayload> {
  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) {
    return (await request.json()) as RejectDomainPayload;
  }
  const fd = await request.formData();
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === 'string') out[k] = v;
  }
  return out as RejectDomainPayload;
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const payload = await readPayload(request);
  const domain = (payload.domain ?? '').trim().toLowerCase();
  if (!domain) return json({ ok: false, error: 'domain is required' }, 400);

  const confirmed = payload.confirm === true || payload.confirm === 'true';
  if (!confirmed) {
    return json({ ok: false, error: 'confirm must be true to run this bulk action' }, 400);
  }

  const rejectedCount = await bulkRejectPendingByDomain(
    env.DB,
    domain,
    auth.email,
    'other',
    `Bulk-rejected via /admin/source-quality: low approval rate for domain ${domain}.`,
  );

  return json({ ok: true, domain, rejected_count: rejectedCount });
};
