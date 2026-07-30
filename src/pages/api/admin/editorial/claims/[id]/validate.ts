import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../../lib/feature-flags';
import { validateClaim } from '../../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

// Domain errors authored in src/lib/editorial-records.ts (validateClaim).
// These are the only messages echoed to the caller; anything else — a D1
// driver failure, say — is logged server-side and collapses to a fixed slug
// so provider text never reaches the browser.
const KNOWN_ERRORS = [
  'at least one source is required to validate a claim',
  'claim not found',
  'claim is already validated',
  'claim changed concurrently',
];

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);
  if (!params.id) return json({ ok: false, error: 'missing id' }, 400);

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }
  const sourceIds = body.source_ids;
  if (!Array.isArray(sourceIds) || sourceIds.length === 0 || !sourceIds.every((value) => typeof value === 'string' && value)) {
    return json({ ok: false, error: 'source_ids must be a non-empty array of source ids' }, 400);
  }

  try {
    const claim = await validateClaim(env.PCD_OPS_DB, { claimId: params.id, sourceIds, actor: auth.email });
    return json({ ok: true, claim });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (KNOWN_ERRORS.includes(message)) {
      return json({ ok: false, error: message }, message.endsWith('not found') ? 404 : 409);
    }
    console.error(JSON.stringify({
      event: 'editorial_record_write_failed',
      route: 'editorial/claims/validate',
      code: error instanceof Error ? error.message : 'unknown_error',
    }));
    return json({ ok: false, error: 'editorial_record_write_failed' }, 500);
  }
};
