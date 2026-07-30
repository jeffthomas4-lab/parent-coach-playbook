// POST /api/admin/suggestions/:id/promote
//
// Marks a pending org_suggestions row imported, then creates a minimal draft
// `programs` row (and an `organizations` row, unless one already matches by
// name) from it. Returns the new program id so the UI can link straight to
// /admin/camps/{id} for the admin to finish the listing.
//
// The status flip runs FIRST, on purpose: it is the atomic claim that keeps
// two concurrent promotes from each creating a camp. See the comment on the
// updateOrgSuggestionStatus call below.

import type { APIRoute } from 'astro';
import { getOrgSuggestionById, updateOrgSuggestionStatus } from '../../../../../lib/camps-db';
import { promoteOrgSuggestionToProgram, type PromoteResult } from '../../../../../lib/suggestion-promotion';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  const suggestion = await getOrgSuggestionById(env.DB, id);
  if (!suggestion) return json({ ok: false, error: 'suggestion not found' }, 404);

  if (suggestion.status === 'imported') {
    return json({ ok: false, error: 'suggestion was already imported' }, 409);
  }

  // Claim the suggestion BEFORE anything is created. updateOrgSuggestionStatus
  // is a single guarded UPDATE (... WHERE id = ? AND status != 'imported'), so
  // when two promotes race on the same id exactly one of them reports a change
  // and the loser bails out here instead of inserting a second organization +
  // program pair. The SELECT above is only a friendlier 404/409; the change
  // count below is the real gate.
  const claimed = await updateOrgSuggestionStatus(env.DB, id, 'imported');
  if (!claimed) return json({ ok: false, error: 'suggestion not found' }, 404);

  // `transitioned` is the guarded UPDATE's own change count, not a re-read.
  // An explicit false means another request already took this suggestion.
  const { transitioned, ...claimedSuggestion } = claimed;
  if (transitioned === false) {
    return json({ ok: false, error: 'suggestion was already imported' }, 409);
  }

  let promoted: PromoteResult;
  try {
    promoted = await promoteOrgSuggestionToProgram(env.DB, suggestion);
  } catch (err) {
    // The claim already landed, so the suggestion is off the pending queue with
    // no draft behind it. Surface a fixed message and keep the real error in
    // the logs; the admin re-adds the org by hand from /admin/camps/new.
    console.error('[admin/suggestions/promote] draft creation failed after claim', { suggestionId: id, err });
    return json({ ok: false, error: 'draft camp could not be created' }, 500);
  }
  const { programId, organizationId, organizationCreated } = promoted;

  return json({
    ok: true,
    program_id: programId,
    organization_id: organizationId,
    organization_created: organizationCreated,
    suggestion: claimedSuggestion,
    redirect: `/admin/camps/${programId}`,
  });
};
