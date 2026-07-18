import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { addSource } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const ENTITY_TYPES = ['opportunity', 'brief', 'claim'] as const;
const SOURCE_TYPES = ['primary_research', 'manufacturer', 'official_rule', 'governing_body', 'news', 'academic', 'internal_data', 'parent_feedback', 'other'] as const;

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);

  const body = await request.json() as Record<string, unknown>;
  if (typeof body.entity_type !== 'string' || !(ENTITY_TYPES as readonly string[]).includes(body.entity_type)) return json({ ok: false, error: 'invalid entity_type' }, 400);
  if (typeof body.entity_id !== 'string' || !body.entity_id) return json({ ok: false, error: 'entity_id is required' }, 400);
  if (typeof body.source_type !== 'string' || !(SOURCE_TYPES as readonly string[]).includes(body.source_type)) return json({ ok: false, error: 'invalid source_type' }, 400);
  if (typeof body.source_url !== 'string' || !body.source_url.startsWith('https://')) return json({ ok: false, error: 'source_url must be an https URL' }, 400);
  if (!Number.isInteger(body.source_quality) || (body.source_quality as number) < 0 || (body.source_quality as number) > 100) return json({ ok: false, error: 'source_quality must be an integer 0-100' }, 400);
  if (typeof body.claim_scope !== 'string' || !body.claim_scope.trim()) return json({ ok: false, error: 'claim_scope is required' }, 400);
  if (typeof body.verified_at !== 'string' || !Number.isFinite(Date.parse(body.verified_at))) return json({ ok: false, error: 'verified_at must be a valid date' }, 400);

  try {
    const source = await addSource(env.PCD_OPS_DB, {
      entityType: body.entity_type as (typeof ENTITY_TYPES)[number],
      entityId: body.entity_id,
      sourceType: body.source_type as (typeof SOURCE_TYPES)[number],
      sourceUrl: body.source_url,
      sourceQuality: body.source_quality as number,
      claimScope: body.claim_scope.trim(),
      verifiedAt: body.verified_at,
      expiresAt: typeof body.expires_at === 'string' ? body.expires_at : null,
      contentSha256: typeof body.content_sha256 === 'string' ? body.content_sha256 : null,
      actor: auth.email,
    });
    return json({ ok: true, source }, 201);
  } catch (error) {
    if (error instanceof Error) return json({ ok: false, error: error.message }, 400);
    throw error;
  }
};
