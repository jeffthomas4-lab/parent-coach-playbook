import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { createBrief } from '../../../../../lib/editorial-records';
import { createRequestLogger } from '../../../../../lib/log';
import { OPPORTUNITY_CONTENT_TYPES } from '../../../../../lib/editorial-opportunity-intake';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

// Domain errors authored in src/lib/editorial-records.ts (createBrief). These
// are the only messages echoed to the caller; anything else — a D1 driver
// failure, say — is logged server-side and collapses to a fixed slug so
// provider text never reaches the browser.
const KNOWN_ERRORS = [
  'opportunity not found',
  'opportunity is not ready to be briefed',
  'opportunity changed concurrently',
];

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const logger = createRequestLogger(request, { route: 'admin/editorial/briefs/create', userId: auth.email });
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
    const message = error instanceof Error ? error.message : '';
    if (KNOWN_ERRORS.includes(message)) {
      return json({ ok: false, error: message }, message.endsWith('not found') ? 404 : 409);
    }
    logger.error('editorial_record_write_failed', error, { opportunityId: body.opportunity_id });
    return json({ ok: false, error: 'editorial_record_write_failed' }, 500);
  }
};
