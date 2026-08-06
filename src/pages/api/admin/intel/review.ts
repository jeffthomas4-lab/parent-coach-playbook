// GET /api/admin/intel/review
// Read-only, paginated. Backs the review queue section on /admin/intel —
// detections not confident/clean enough to promote automatically. Defaults
// to status=pending, the only status a human still has work to do on.

import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-auth';
import { listReviewQueue } from '../../../../lib/intel/store';
import type { ReviewStatus } from '../../../../lib/intel/types';
import { createRequestLogger } from '../../../../lib/log';
import {
  fetchCompetitorNames,
  fetchOrgSummaries,
  parseEnumParam,
  parseLimit,
  parseOffset,
} from '../../../../lib/intel-admin-http';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

const REVIEW_STATUSES: readonly ReviewStatus[] = ['pending', 'accepted', 'rejected'];

export const GET: APIRoute = async ({ request }) => {
  if (request.method !== 'GET') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'GET' });

  const env = cfEnv as { DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/review', userId: auth.email });

  const url = new URL(request.url);
  const limit = parseLimit(url.searchParams.get('limit'));
  if (!limit.ok) return json({ ok: false, error: limit.error }, 400);
  const offset = parseOffset(url.searchParams.get('offset'));
  if (!offset.ok) return json({ ok: false, error: offset.error }, 400);
  const statusParam = parseEnumParam(url.searchParams.get('status'), REVIEW_STATUSES, 'status');
  if (!statusParam.ok) return json({ ok: false, error: statusParam.error }, 400);
  const status: ReviewStatus = statusParam.value ?? 'pending';

  try {
    const rows = await listReviewQueue(env.DB, { status, limit: limit.value, offset: offset.value });

    const [orgSummaries, competitorNames] = await Promise.all([
      fetchOrgSummaries(env.DB, rows.map((r) => r.org_id)),
      fetchCompetitorNames(env.DB, rows.map((r) => r.competitor_id)),
    ]);

    const items = rows.map((row) => ({
      id: row.id,
      org_id: row.org_id,
      org_name: row.org_id ? orgSummaries.get(row.org_id)?.name ?? null : null,
      domain: row.domain,
      competitor_id: row.competitor_id,
      competitor_name: competitorNames.get(row.competitor_id) ?? null,
      category: row.category,
      confidence: row.confidence,
      reason: row.reason,
      evidence_json: row.evidence_json,
      status: row.status,
      created_at: row.created_at,
    }));

    return json({ ok: true, items, status, limit: limit.value, offset: offset.value });
  } catch (error) {
    logger.error('intel_review_query_failed', error);
    return json({ ok: false, error: 'review queue query failed' }, 500);
  }
};
