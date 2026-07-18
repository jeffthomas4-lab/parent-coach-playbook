import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../lib/feature-flags';
import { decideMaintenanceProposal, proposeMaintenance } from '../../../../../lib/editorial-records';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const ACTIONS = ['propose', 'decide'] as const;
const PROPOSAL_TYPES = ['refresh', 'consolidate', 'retire'] as const;

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  if (!featureEnabled(env.EDITORIAL_LIFECYCLE_ENABLED)) return json({ ok: false, error: 'editorial lifecycle admin routes are not currently available' }, 404);

  const body = await request.json() as Record<string, unknown>;
  const action = body.action;
  if (typeof action !== 'string' || !(ACTIONS as readonly string[]).includes(action)) return json({ ok: false, error: 'invalid action' }, 400);

  try {
    if (action === 'propose') {
      if (typeof body.opportunity_id !== 'string' || !body.opportunity_id) return json({ ok: false, error: 'opportunity_id is required' }, 400);
      if (typeof body.proposal_type !== 'string' || !(PROPOSAL_TYPES as readonly string[]).includes(body.proposal_type)) return json({ ok: false, error: 'invalid proposal_type' }, 400);
      if (typeof body.reason !== 'string' || body.reason.trim().length < 5) return json({ ok: false, error: 'reason is required' }, 400);
      const proposal = await proposeMaintenance(env.PCD_OPS_DB, {
        opportunityId: body.opportunity_id,
        proposalType: body.proposal_type as (typeof PROPOSAL_TYPES)[number],
        reason: body.reason.trim(),
        incomingLinkAuditRef: typeof body.incoming_link_audit_ref === 'string' ? body.incoming_link_audit_ref : null,
        actor: auth.email,
      });
      return json({ ok: true, proposal }, 201);
    }
    // action === 'decide' -- retirement and consolidation supersession are
    // human-only decisions; this route is the only place a proposal can
    // become 'retired', and it always requires an authenticated admin actor.
    if (typeof body.proposal_id !== 'string' || !body.proposal_id) return json({ ok: false, error: 'proposal_id is required' }, 400);
    if (body.decision !== 'accepted' && body.decision !== 'rejected') return json({ ok: false, error: 'decision must be accepted or rejected' }, 400);
    const proposal = await decideMaintenanceProposal(env.PCD_OPS_DB, {
      proposalId: body.proposal_id,
      decision: body.decision,
      decidedBy: auth.email,
      actor: auth.email,
    });
    return json({ ok: true, proposal });
  } catch (error) {
    if (error instanceof Error && error.message.endsWith('not found')) return json({ ok: false, error: error.message }, 404);
    if (error instanceof Error) return json({ ok: false, error: error.message }, 409);
    throw error;
  }
};
