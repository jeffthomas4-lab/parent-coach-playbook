import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../../../lib/admin-auth';
import { featureEnabled } from '../../../../../../lib/feature-flags';
import {
  advanceOpportunityToClaimsValidated, beginReview, classifyOpportunity,
  markRelationshipMappingComplete, scoreOpportunity,
} from '../../../../../../lib/editorial-records';
import { OPPORTUNITY_CONTENT_TYPES } from '../../../../../../lib/editorial-opportunity-intake';
import { createRequestLogger } from '../../../../../../lib/log';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const ACTIONS = ['score', 'classify', 'advance_to_claims_validated', 'begin_review', 'complete_relationship_mapping'] as const;

// Domain errors authored in src/lib/editorial-records.ts by the five functions
// this route calls. These are the only messages echoed to the caller; anything
// else — a D1 driver failure, say — is logged server-side and collapses to a
// fixed slug so provider text never reaches the browser. The regex entries
// cover the messages that interpolate a state name.
const KNOWN_ERRORS: readonly (string | RegExp)[] = [
  'opportunity not found',
  'opportunity changed concurrently',
  'score must be an integer 0-100',
  'opportunity must be briefed before advancing to claims validation',
  'opportunity has no active brief',
  'brief has no claims to validate',
  'every claim on the active brief must be validated first',
  'at least one recorded source is required before claims validation',
  'opportunity is not ready to leave relationship mapping',
  'at least one relationship must be mapped first',
  /^invalid opportunity transition/,
  /^opportunity cannot enter /,
];
const isKnownError = (message: string) =>
  KNOWN_ERRORS.some((known) => (typeof known === 'string' ? known === message : known.test(message)));

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { PCD_OPS_DB?: D1Database; ADMIN_EMAILS?: string; EDITORIAL_LIFECYCLE_ENABLED?: string } | undefined;
  if (!env?.PCD_OPS_DB) return json({ ok: false, error: 'operational database not available' }, 503);
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const logger = createRequestLogger(request, { route: 'admin/editorial/opportunities/update', userId: auth.email });
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
  const action = body.action;
  if (typeof action !== 'string' || !(ACTIONS as readonly string[]).includes(action)) return json({ ok: false, error: 'invalid action' }, 400);

  try {
    if (action === 'score') {
      const score = body.score;
      if (!Number.isInteger(score) || (score as number) < 0 || (score as number) > 100) return json({ ok: false, error: 'score must be an integer 0-100' }, 400);
      const opportunity = await scoreOpportunity(env.PCD_OPS_DB, { id: params.id, score: score as number, actor: auth.email });
      return json({ ok: true, opportunity });
    }
    if (action === 'classify') {
      const contentType = body.content_type;
      if (typeof contentType !== 'string' || !(OPPORTUNITY_CONTENT_TYPES as readonly string[]).includes(contentType)) return json({ ok: false, error: 'invalid content_type' }, 400);
      const decisionReason = body.decision_reason;
      if (typeof decisionReason !== 'string' || decisionReason.trim().length < 5) return json({ ok: false, error: 'decision_reason is required' }, 400);
      const opportunity = await classifyOpportunity(env.PCD_OPS_DB, {
        id: params.id,
        contentType: contentType as (typeof OPPORTUNITY_CONTENT_TYPES)[number],
        existingMatch: Boolean(body.existing_match),
        distinctIntent: Boolean(body.distinct_intent),
        structuredDirectoryFit: Boolean(body.structured_directory_fit),
        evidenceSufficient: Boolean(body.evidence_sufficient),
        existingMatchRoute: typeof body.existing_match_route === 'string' ? body.existing_match_route : null,
        decisionReason: decisionReason.trim(),
        actor: auth.email,
      });
      return json({ ok: true, opportunity });
    }
    if (action === 'advance_to_claims_validated') {
      const opportunity = await advanceOpportunityToClaimsValidated(env.PCD_OPS_DB, { opportunityId: params.id, actor: auth.email });
      return json({ ok: true, opportunity });
    }
    if (action === 'begin_review') {
      const reviewType = body.review_type;
      if (reviewType !== 'editorial' && reviewType !== 'seo_ai') return json({ ok: false, error: 'review_type must be editorial or seo_ai' }, 400);
      const opportunity = await beginReview(env.PCD_OPS_DB, { opportunityId: params.id, reviewType, actor: auth.email });
      return json({ ok: true, opportunity });
    }
    // action === 'complete_relationship_mapping'
    const opportunity = await markRelationshipMappingComplete(env.PCD_OPS_DB, { opportunityId: params.id, actor: auth.email });
    return json({ ok: true, opportunity });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (isKnownError(message)) {
      return json({ ok: false, error: message }, message.endsWith('not found') ? 404 : 409);
    }
    logger.error('editorial_record_write_failed', error, { action, opportunityId: params.id });
    return json({ ok: false, error: 'editorial_record_write_failed' }, 500);
  }
};
