// POST /api/admin/intel/rescore
// Recomputes org_opportunity_scores for up to DEFAULT_SWEEP_LIMIT orgs (or a
// caller-supplied, clamped limit). Returns how many were rescored.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { rescoreOrgs } from '../../../../lib/intel/scoring';
import { DEFAULT_SWEEP_LIMIT } from '../../../../lib/intel/config';
import { withAdminReceipt, type MutationOutcome } from '../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../lib/log';
import { parseLimit } from '../../../../lib/intel-admin-http';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

type RescoreEnv = { DB?: D1Database; ADMIN_EMAILS?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string };

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'POST' });

  const env = cfEnv as RescoreEnv | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/rescore', userId: auth.email });

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  let body: { limit?: unknown } = {};
  try {
    const text = await request.text();
    if (text.trim()) body = JSON.parse(text) as { limit?: unknown };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const rawLimit = body.limit === undefined || body.limit === null ? null : String(body.limit);
  const limit = parseLimit(rawLimit);
  if (!limit.ok) return json({ ok: false, error: limit.error }, 400);
  const effectiveLimit = rawLimit === null ? DEFAULT_SWEEP_LIMIT : limit.value;

  const requestId = logger.requestId;

  const receipted = await withAdminReceipt(
    {
      env,
      environment: env.SITE_URL ?? 'unknown',
      actorEmail: auth.email,
      action: 'intel.rescore',
      resourceType: 'org_opportunity_scores',
      resourceId: 'batch',
      requestId,
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    },
    async (): Promise<MutationOutcome<{ rescored: number }>> => {
      let rescored: number;
      try {
        rescored = await rescoreOrgs(env.DB!, effectiveLimit);
      } catch (error) {
        logger.error('intel_rescore_failed', error, { limit: effectiveLimit });
        return {
          outcome: 'error',
          reason: 'rescore_threw',
          response: json({ ok: false, error: 'rescore failed' }, 500),
        };
      }
      return {
        outcome: 'success',
        value: { rescored },
        afterSummary: `rescored=${rescored} limit=${effectiveLimit}`,
      };
    },
  );

  if ('response' in receipted) return receipted.response;
  return json({ ok: true, rescored: receipted.value.rescored });
};
