import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../../lib/feature-flags';
import { validateClaim } from '../../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);
  if (!params.id) return json({ ok: false, error: 'missing id' }, 400);

  const body = await request.json() as Record<string, unknown>;
  const sourceIds = body.source_ids;
  if (!Array.isArray(sourceIds) || sourceIds.length === 0 || !sourceIds.every((value) => typeof value === 'string' && value)) {
    return json({ ok: false, error: 'source_ids must be a non-empty array of source ids' }, 400);
  }

  try {
    const claim = await validateClaim(env.PCD_OPS_DB, { claimId: params.id, sourceIds, actor: auth.email });
    return json({ ok: true, claim });
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('not found')) return json({ ok: false, error: error.message }, 404);
    if (error instanceof Error) return json({ ok: false, error: error.message }, 409);
    throw error;
  }
};
