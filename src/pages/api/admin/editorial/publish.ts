// POST /api/admin/editorial/publish
//
// The second half of the approve-to-publish pipeline, reachable from the admin
// UI. Flips `draft: false`, stamps the editorial block, commits to main, and
// fires the deploy hook.
//
// The sibling route, ./approve.ts, moves a piece to `jeff-approved` — that is
// the editorial sign-off and it does NOT publish. This route is the publish.
// Two routes on purpose: approving a draft and putting it in front of parents
// are different decisions and should take different clicks.
//
// Auth: Cloudflare Access identity + admin allowlist + same-origin. The Slack
// button path to the same action lives at /api/slack/actions.
//
// Env: GITHUB_TOKEN (contents:write), DEPLOY_HOOK_URL.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin, type AdminAuthEnv } from '../../../../lib/admin-auth';
import { publishDraft, type PublishEnv } from '../../../../lib/publish';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as (AdminAuthEnv & PublishEnv) | undefined;

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  let body: { collection?: string; slug?: string };
  try {
    body = (await request.json()) as { collection?: string; slug?: string };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const collection = (body.collection ?? '').trim();
  const slug = (body.slug ?? '').trim();
  if (!collection || !slug) {
    return json({ ok: false, error: 'missing collection or slug' }, 400);
  }

  const result = await publishDraft(env, { collection, slug, approvedBy: auth.email });
  if (!result.ok) return json({ ok: false, error: result.error }, result.code);

  return json({
    ok: true,
    status: 'published',
    path: result.path,
    commit: result.commitSha,
    deploy: result.deploy,
    publishedBy: auth.email,
  });
};
