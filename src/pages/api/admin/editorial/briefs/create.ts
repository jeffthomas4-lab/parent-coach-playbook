import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { createBrief } from '../../../../../lib/editorial-records';
import { OPPORTUNITY_CONTENT_TYPES } from '../../../../../lib/editorial-opportunity-intake';

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
  if (typeof body.opportunity_id !== 'string' || !body.opportunity_id) return json({ ok: false, error: 'opportunity_id is required' }, 400);
  if (typeof body.intent_statement !== 'string' || body.intent_statement.trim().length < 5) return json({ ok: false, error: 'intent_statement is required' }, 400);
  if (typeof body.content_type !== 'string' || !(OPPORTUNITY_CONTENT_TYPES as readonly string[]).includes(body.content_type)) return json({ ok: false, error: 'invalid content_type' }, 400);

  try {
    const brief = await createBrief(env.PCD_OPS_DB, {
      opportunityId: body.opportunity_id,
      intentStatement: body.intent_statement.trim(),
      contentType: body.content_type as (typeof OPPORTUNITY_CONTENT_TYPES)[number],
      targetRoute: typeof body.target_route === 'string' ? body.target_route : null,
      outlineRef: typeof body.outline_ref === 'string' ? body.outline_ref : null,
      actor: auth.email,
    });
    return json({ ok: true, brief }, 201);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('not found')) return json({ ok: false, error: error.message }, 404);
    if (error instanceof Error) return json({ ok: false, error: error.message }, 409);
    throw error;
  }
};
