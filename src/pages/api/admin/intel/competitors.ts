// GET  /api/admin/intel/competitors  — list the competitor catalog
// POST /api/admin/intel/competitors  — sync COMPETITOR_DEFINITIONS into the
//                                       competitors table, returns count synced

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { syncCompetitorCatalog } from '../../../../lib/intel/store';
import { COMPETITOR_DEFINITIONS } from '../../../../lib/intel/competitors';
import { withAdminReceipt, type MutationOutcome } from '../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../lib/log';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

type CompetitorsEnv = { DB?: D1Database; ADMIN_EMAILS?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string };

export const GET: APIRoute = async ({ request }) => {
  if (request.method !== 'GET') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'GET' });

  const env = cfEnv as CompetitorsEnv | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/competitors', userId: auth.email });

  try {
    const { results } = await env.DB
      .prepare(
        `SELECT id, display_name, canonical_domain, category, status, migration_difficulty
           FROM competitors ORDER BY display_name ASC`,
      )
      .all();
    return json({ ok: true, competitors: results });
  } catch (error) {
    logger.error('intel_competitors_list_failed', error);
    return json({ ok: false, error: 'competitors query failed' }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'POST' });

  const env = cfEnv as CompetitorsEnv | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/competitors', userId: auth.email });

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const requestId = logger.requestId;

  const receipted = await withAdminReceipt(
    {
      env,
      environment: env.SITE_URL ?? 'unknown',
      actorEmail: auth.email,
      action: 'intel.competitors.sync',
      resourceType: 'competitors',
      resourceId: 'catalog',
      requestId,
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    },
    async (): Promise<MutationOutcome<{ synced: number }>> => {
      let synced: number;
      try {
        synced = await syncCompetitorCatalog(env.DB!, COMPETITOR_DEFINITIONS);
      } catch (error) {
        logger.error('intel_competitors_sync_failed', error);
        return {
          outcome: 'error',
          reason: 'sync_threw',
          response: json({ ok: false, error: 'competitor catalog sync failed' }, 500),
        };
      }
      return {
        outcome: 'success',
        value: { synced },
        afterSummary: `synced=${synced}`,
      };
    },
  );

  if ('response' in receipted) return receipted.response;
  return json({ ok: true, synced: receipted.value.synced });
};
