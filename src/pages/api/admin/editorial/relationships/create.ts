import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { mapRelationship } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const RELATIONSHIP_TYPES = ['internal_link', 'canonical', 'supersedes', 'hub_child', 'see_also'] as const;

// Domain errors authored in src/lib/editorial-records.ts (mapRelationship).
// These are the only messages echoed to the caller; anything else — a D1
// driver failure, say — is logged server-side and collapses to a fixed slug
// so provider text never reaches the browser.
const KNOWN_ERRORS = [
  'opportunity not found',
  'opportunity must have passed SEO/AI review before relationship mapping',
];

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }
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
    const message = error instanceof Error ? error.message : '';
    if (KNOWN_ERRORS.includes(message)) {
      return json({ ok: false, error: message }, message.endsWith('not found') ? 404 : 409);
    }
    console.error(JSON.stringify({
      event: 'editorial_record_write_failed',
      route: 'editorial/relationships/create',
      code: error instanceof Error ? error.message : 'unknown_error',
    }));
    return json({ ok: false, error: 'editorial_record_write_failed' }, 500);
  }
};
