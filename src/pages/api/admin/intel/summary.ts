// GET /api/admin/intel/summary
// Read-only. Backs the four summary tiles on /admin/intel: orgs with a
// detected stack, count by competitor, pending review count, last run time.

import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-auth';
import { getIntelSummary } from '../../../../lib/intel/store';
import { createRequestLogger } from '../../../../lib/log';
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

  const logger = createRequestLogger(request, { route: 'admin/intel/summary', userId: auth.email });

  try {
    const summary = await getIntelSummary(env.DB);
    return json({ ok: true, summary });
  } catch (error) {
    logger.error('intel_summary_query_failed', error);
    return json({ ok: false, error: 'summary query failed' }, 500);
  }
};
