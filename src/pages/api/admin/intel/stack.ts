// GET /api/admin/intel/stack
// Read-only, paginated. Backs the "Detected stack" table on /admin/intel,
// filterable by competitorId/status/minConfidence/state, sortable by
// confidence (client-side, over this response).

import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-auth';
import { listStack } from '../../../../lib/intel/store';
import type { StackStatus } from '../../../../lib/intel/types';
import { createRequestLogger } from '../../../../lib/log';
import {
  fetchCompetitorNames,
  parseBoundedInt,
  parseCompetitorId,
  parseEnumParam,
  parseLimit,
  parseOffset,
  parseStateParam,
} from '../../../../lib/intel-admin-http';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

const STACK_STATUSES: readonly StackStatus[] = ['detected', 'confirmed', 'rejected', 'lapsed'];

export const GET: APIRoute = async ({ request }) => {
  if (request.method !== 'GET') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'GET' });

  const env = cfEnv as { DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/stack', userId: auth.email });

  const url = new URL(request.url);
  const limit = parseLimit(url.searchParams.get('limit'));
  if (!limit.ok) return json({ ok: false, error: limit.error }, 400);
  const offset = parseOffset(url.searchParams.get('offset'));
  if (!offset.ok) return json({ ok: false, error: offset.error }, 400);
  const status = parseEnumParam(url.searchParams.get('status'), STACK_STATUSES, 'status');
  if (!status.ok) return json({ ok: false, error: status.error }, 400);
  const competitorId = parseCompetitorId(url.searchParams.get('competitorId'));
  if (!competitorId.ok) return json({ ok: false, error: competitorId.error }, 400);
  const minConfidence = parseBoundedInt(url.searchParams.get('minConfidence'), 0, 100, 'minConfidence');
  if (!minConfidence.ok) return json({ ok: false, error: minConfidence.error }, 400);
  const state = parseStateParam(url.searchParams.get('state'));
  if (!state.ok) return json({ ok: false, error: state.error }, 400);

  try {
    // listStack's own query already joins organizations for org_name/org_city/
    // org_state/org_website_url — no separate org lookup needed here. It does
    // not join competitors, so that one lookup stays.
    const rows = await listStack(env.DB, {
      competitorId: competitorId.value,
      status: status.value,
      minConfidence: minConfidence.value,
      state: state.value,
      limit: limit.value,
      offset: offset.value,
    });

    const competitorNames = await fetchCompetitorNames(env.DB, rows.map((r) => r.competitor_id));

    const items = rows.map((row) => ({
      id: row.id,
      org_id: row.org_id,
      org_name: row.org_name ?? null,
      org_state: row.org_state ?? null,
      org_website: row.org_website_url ?? null,
      category: row.category,
      competitor_id: row.competitor_id,
      competitor_name: row.competitor_id ? competitorNames.get(row.competitor_id) ?? null : null,
      confidence: row.confidence,
      status: row.status,
      first_detected_at: row.first_detected_at,
      last_confirmed_at: row.last_confirmed_at,
      evidence_count: row.evidence_count,
      reviewed_by: row.reviewed_by,
      reviewed_at: row.reviewed_at,
    }));

    return json({ ok: true, items, limit: limit.value, offset: offset.value });
  } catch (error) {
    logger.error('intel_stack_query_failed', error);
    return json({ ok: false, error: 'stack query failed' }, 500);
  }
};
