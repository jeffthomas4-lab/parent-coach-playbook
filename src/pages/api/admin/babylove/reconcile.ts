// POST /api/admin/babylove/reconcile
//
// WHY THIS EXISTS. reconcileBabyLoveArticles is the backstop that pulls
// articles the webhook never delivered. It had no trigger except a cron at
// :17 past every sixth hour, and it has never published a single article in
// its life — zero `api_reconciliation` rows in external_article_receipts,
// first noted 2026-08-10 and still true on 2026-08-27. A backstop nobody can
// invoke and nobody can watch fail is not a backstop.
//
// By 2026-08-27 that had cost five articles: "Youth Basketball Drills"
// (Aug 9), "Coach Pitch vs Kid Pitch" (Aug 10), "Youth Sports Playing Time"
// (Aug 23), "A Parent Code of Conduct" (Aug 24), and "Goalkeeper Drills"
// (Aug 26) were all published on the provider side and never arrived here.
//
// This route runs the same function on demand and, critically, returns the
// BabyLoveFailure code instead of a generic 500. The failure code is the
// whole point: `reconciliation_unavailable` names an unset Worker secret,
// `api_list_invalid` means the provider's envelope shape changed. Guessing
// between those two is what turned a one-line fix into a two-week outage.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { reconcileBabyLoveArticles, type BabyLoveEnv } from '../../../../lib/babylove-growth';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

// BabyLoveFailure carries a machine-readable `code`. Read it structurally
// rather than importing the class, so this route keeps working if the error
// type moves or the lib stops exporting it.
function failureCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: unknown }).code;
    if (typeof code === 'string' && code) return code;
  }
  if (error instanceof Error && error.message) return error.message.slice(0, 120);
  return 'unknown';
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as (BabyLoveEnv & { ADMIN_EMAILS?: string }) | undefined;
  if (!env) return json({ ok: false, error: 'worker env not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  // Report which bindings are actually present before running. When
  // reconciliation dies on `reconciliation_unavailable`, this is the line
  // that says which secret is missing without a wrangler tail.
  const bindings = {
    PCD_OPS_DB: Boolean(env.PCD_OPS_DB),
    BABYLOVE_API_KEY: Boolean(env.BABYLOVE_API_KEY),
    GITHUB_TOKEN: Boolean(env.GITHUB_TOKEN),
    autopublish: env.BABYLOVE_AUTOPUBLISH_ENABLED ?? null,
  };

  try {
    const result = await reconcileBabyLoveArticles(env);
    return json({ ok: true, bindings, ...result });
  } catch (error) {
    const code = failureCode(error);
    console.error(JSON.stringify({ event: 'babylove_manual_reconcile_failed', code }));
    return json({ ok: false, error: code, bindings }, 502);
  }
};
