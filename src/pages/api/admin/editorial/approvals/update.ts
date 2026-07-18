import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { classifyMonetization, EvidenceGateError, recordHumanApproval } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const ACTIONS = ['classify_monetization', 'approve'] as const;
const MONETIZATION_CLASSES = ['none', 'affiliate', 'sponsored', 'owned_product'] as const;

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
  const action = body.action;
  if (typeof action !== 'string' || !(ACTIONS as readonly string[]).includes(action)) return json({ ok: false, error: 'invalid action' }, 400);

  try {
    if (action === 'classify_monetization') {
      if (typeof body.monetization_classification !== 'string' || !(MONETIZATION_CLASSES as readonly string[]).includes(body.monetization_classification)) {
        return json({ ok: false, error: 'invalid monetization_classification' }, 400);
      }
      const approval = await classifyMonetization(env.PCD_OPS_DB, {
        opportunityId: body.opportunity_id,
        monetizationClassification: body.monetization_classification as (typeof MONETIZATION_CLASSES)[number],
        disclosureRequired: Boolean(body.disclosure_required),
        actor: auth.email,
      });
      return json({ ok: true, approval });
    }
    // action === 'approve' -- this is the terminal human sign-off. Jeff (or any
    // allowlisted admin) is the actor recorded as approvedBy; the requesting
    // identity always signs its own approval, never an impersonated one.
    if (!body.flags_resolved) return json({ ok: false, error: 'flags_resolved must be explicitly confirmed true to approve' }, 400);
    const result = await recordHumanApproval(env.PCD_OPS_DB, {
      opportunityId: body.opportunity_id,
      approvedBy: auth.email,
      flagsResolved: true,
      actor: auth.email,
    });
    return json({ ok: true, opportunity: result.opportunity, approval: result.approval });
  } catch (error) {
    if (error instanceof EvidenceGateError) return json({ ok: false, error: error.message, missing: error.missing }, 409);
    if (error instanceof Error && error.message.endsWith('not found')) return json({ ok: false, error: error.message }, 404);
    if (error instanceof Error) return json({ ok: false, error: error.message }, 409);
    throw error;
  }
};
