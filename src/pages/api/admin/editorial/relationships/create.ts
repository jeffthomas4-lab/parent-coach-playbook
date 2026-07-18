import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { mapRelationship } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const RELATIONSHIP_TYPES = ['internal_link', 'canonical', 'supersedes', 'hub_child', 'see_also'] as const;

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
  if (typeof body.related_route !== 'string' || !body.related_route.startsWith('/')) return json({ ok: false, error: 'related_route must be a site-relative path' }, 400);
  if (typeof body.relationship_type !== 'string' || !(RELATIONSHIP_TYPES as readonly string[]).includes(body.relationship_type)) return json({ ok: false, error: 'invalid relationship_type' }, 400);

  try {
    const relationship = await mapRelationship(env.PCD_OPS_DB, {
      opportunityId: body.opportunity_id,
      relatedRoute: body.related_route,
      relationshipType: body.relationship_type as (typeof RELATIONSHIP_TYPES)[number],
      actor: auth.email,
    });
    return json({ ok: true, relationship }, 201);
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('not found')) return json({ ok: false, error: error.message }, 404);
    if (error instanceof Error) return json({ ok: false, error: error.message }, 409);
    throw error;
  }
};
