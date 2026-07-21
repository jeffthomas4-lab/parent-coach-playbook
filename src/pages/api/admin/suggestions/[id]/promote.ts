// POST /api/admin/suggestions/:id/promote
//
// Creates a minimal draft `programs` row (and an `organizations` row, unless
// one already matches by name) from a pending org_suggestions row, then marks
// the suggestion imported. Returns the new program id so the UI can link
// straight to /admin/camps/{id} for the admin to finish the listing.

import type { APIRoute } from 'astro';
import { getOrgSuggestionById, updateOrgSuggestionStatus } from '../../../../../lib/camps-db';
import { promoteOrgSuggestionToProgram } from '../../../../../lib/suggestion-promotion';
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

  const { programId, organizationId, organizationCreated } = await promoteOrgSuggestionToProgram(env.DB, suggestion);
  const updated = await updateOrgSuggestionStatus(env.DB, id, 'imported');

  return json({
    ok: true,
    program_id: programId,
    organization_id: organizationId,
    organization_created: organizationCreated,
    suggestion: updated,
    redirect: `/admin/camps/${programId}`,
  });
};
