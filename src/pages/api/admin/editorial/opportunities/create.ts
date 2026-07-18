import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { createOpportunity } from '../../../../../lib/editorial-records';
import { OPPORTUNITY_CONTENT_TYPES, OPPORTUNITY_SOURCES, sanitizeOpportunitySignal } from '../../../../../lib/editorial-opportunity-intake';

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

  const body = await request.json() as {
    source?: string; summary?: string; ref?: string; content_type?: string; target_keyword?: string;
  };
  if (!body.source || !(OPPORTUNITY_SOURCES as readonly string[]).includes(body.source)) return json({ ok: false, error: 'invalid source' }, 400);
  if (typeof body.summary !== 'string' || !body.summary.trim()) return json({ ok: false, error: 'summary is required' }, 400);

  const sanitized = sanitizeOpportunitySignal({
    source: body.source as (typeof OPPORTUNITY_SOURCES)[number],
    summary: body.summary,
    ref: body.ref,
    contentTypeHint: body.content_type,
    targetKeywordHint: body.target_keyword,
  });
  if (!sanitized) return json({ ok: false, error: 'summary could not be sanitized to a usable signal' }, 400);
  if (body.content_type && !(OPPORTUNITY_CONTENT_TYPES as readonly string[]).includes(body.content_type)) {
    return json({ ok: false, error: 'invalid content_type' }, 400);
  }

  const opportunity = await createOpportunity(env.PCD_OPS_DB, {
    source: sanitized.source,
    signalSummary: sanitized.signalSummary,
    signalRef: sanitized.signalRef,
    contentType: sanitized.contentType,
    targetKeyword: sanitized.targetKeyword,
    actor: auth.email,
  });
  return json({ ok: true, opportunity }, 201);
};
