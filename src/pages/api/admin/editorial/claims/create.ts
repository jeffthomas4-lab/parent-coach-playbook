import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { addClaim } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

// Domain errors authored in src/lib/editorial-records.ts (addClaim). These are
// the only messages echoed to the caller; anything else — a D1 driver failure,
// say — is logged server-side and collapses to a fixed slug so provider text
// never reaches the browser.
const KNOWN_ERRORS = ['claim text is required'];

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
  if (typeof body.brief_id !== 'string' || !body.brief_id) return json({ ok: false, error: 'brief_id is required' }, 400);
  if (typeof body.claim_text !== 'string' || !body.claim_text.trim()) return json({ ok: false, error: 'claim_text is required' }, 400);
  if (body.claim_text.length > 1000) return json({ ok: false, error: 'claim_text too long' }, 400);

  try {
    const claim = await addClaim(env.PCD_OPS_DB, { briefId: body.brief_id, claimText: body.claim_text, actor: auth.email });
    return json({ ok: true, claim }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (KNOWN_ERRORS.includes(message)) return json({ ok: false, error: message }, 400);
    console.error(JSON.stringify({
      event: 'editorial_record_write_failed',
      route: 'editorial/claims/create',
      code: error instanceof Error ? error.message : 'unknown_error',
    }));
    return json({ ok: false, error: 'editorial_record_write_failed' }, 500);
  }
};
