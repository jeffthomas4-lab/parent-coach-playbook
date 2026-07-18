import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { addClaim } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);

  const body = await request.json() as Record<string, unknown>;
  if (typeof body.brief_id !== 'string' || !body.brief_id) return json({ ok: false, error: 'brief_id is required' }, 400);
  if (typeof body.claim_text !== 'string' || !body.claim_text.trim()) return json({ ok: false, error: 'claim_text is required' }, 400);
  if (body.claim_text.length > 1000) return json({ ok: false, error: 'claim_text too long' }, 400);

  try {
    const claim = await addClaim(env.PCD_OPS_DB, { briefId: body.brief_id, claimText: body.claim_text, actor: auth.email });
    return json({ ok: true, claim }, 201);
  } catch (error) {
    if (error instanceof Error) return json({ ok: false, error: error.message }, 400);
    throw error;
  }
};
