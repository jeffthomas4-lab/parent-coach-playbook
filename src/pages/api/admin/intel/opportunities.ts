// GET /api/admin/intel/opportunities
// Read-only, paginated. Composite outreach-priority scores per org.

import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-auth';
import { listOpportunities } from '../../../../lib/intel/store';
import { createRequestLogger } from '../../../../lib/log';
import {
  fetchCompetitorNames,
  parseBoundedInt,
  parseCompetitorId,
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

export const GET: APIRoute = async ({ request }) => {
  if (request.method !== 'GET') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'GET' });

  const env = cfEnv as { DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/opportunities', userId: auth.email });

  const url = new URL(request.url);
  const limit = parseLimit(url.searchParams.get('limit'));
  if (!limit.ok) return json({ ok: false, error: limit.error }, 400);
  const offset = parseOffset(url.searchParams.get('offset'));
  if (!offset.ok) return json({ ok: false, error: offset.error }, 400);
  const minPriority = parseBoundedInt(url.searchParams.get('minPriority'), 0, 100, 'minPriority');
  if (!minPriority.ok) return json({ ok: false, error: minPriority.error }, 400);
  const competitorId = parseCompetitorId(url.searchParams.get('competitorId'));
  if (!competitorId.ok) return json({ ok: false, error: competitorId.error }, 400);

  try {
    // listOpportunities already joins organizations (org_name, org_state) and
    // resolves each org's best-confidence competitor_id — no separate org
    // lookup needed here. It does not resolve a competitor display name.
    const rows = await listOpportunities(env.DB, {
      minPriority: minPriority.value,
      competitorId: competitorId.value,
      limit: limit.value,
      offset: offset.value,
    });

    const competitorNames = await fetchCompetitorNames(env.DB, rows.map((r) => r.competitor_id));

    const items = rows.map((row) => ({
      org_id: row.org_id,
      org_name: row.org_name ?? null,
      org_state: row.org_state ?? null,
      competitor_id: row.competitor_id,
      competitor_name: row.competitor_id ? competitorNames.get(row.competitor_id) ?? null : null,
      migration_difficulty: row.migration_difficulty,
      org_size_score: row.org_size_score,
      tech_maturity: row.tech_maturity,
      switch_likelihood: row.switch_likelihood,
      revenue_estimate_usd: row.revenue_estimate_usd,
      priority: row.priority,
      rationale: row.rationale,
      scored_at: row.scored_at,
    }));

    return json({ ok: true, items, limit: limit.value, offset: offset.value });
  } catch (error) {
    logger.error('intel_opportunities_query_failed', error);
    return json({ ok: false, error: 'opportunities query failed' }, 500);
  }
};
