// GET /api/camps/search-priority?anchor=tacoma-wa-25mi&today=2026-05-06
//
// Returns the camp-search priority queue for a given anchor city, scoped and
// compact so the Claude in Chrome flow can decide what to visit without parsing
// the full markdown registry. Three buckets:
//
//   recheck_due   — domains whose next_recheck_after <= today (highest priority)
//   skip_domains  — bare domain strings the LLM should NOT visit (compact; can be
//                   thousands of entries without burning tokens)
//   anchor        — the anchor row (status, last batch, next batch, notes)
//
// Public read-only. Cached at the edge for 5 minutes.

import type { APIRoute } from 'astro';
import {
  getAnchor,
  listRecheckDue,
  listSkipDomains,
  slimNote,
} from '../../../lib/search-registry';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, cache = true) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...(cache ? { 'Cache-Control': 'public, max-age=300, s-maxage=300' } : {}),
    },
  });

const today = () => new Date().toISOString().slice(0, 10);

export const GET: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB?: D1Database } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500, false);

  const url = new URL(request.url);
  const anchor = (url.searchParams.get('anchor') ?? 'tacoma-wa-25mi').trim().toLowerCase();
  const onDate = (url.searchParams.get('today') ?? today()).trim();

  const anchorRow = await getAnchor(env.DB, anchor);
  const due = await listRecheckDue(env.DB, anchor, onDate);
  const skip = await listSkipDomains(env.DB, anchor, onDate);

  return json({
    ok: true,
    anchor: anchorRow
      ? {
          slug: anchorRow.slug,
          city: anchorRow.city,
          radius_miles: anchorRow.radius_miles,
          status: anchorRow.status,
          last_batch_at: anchorRow.last_batch_at,
          next_batch_after: anchorRow.next_batch_after,
        }
      : null,
    today: onDate,
    recheck_due: due.map((d) => ({
      domain: d.domain,
      organization: d.organization,
      result: d.result,
      camps_pulled: d.camps_pulled,
      next_recheck_after: d.next_recheck_after,
      note: slimNote(d.notes),
    })),
    skip_domains: skip,
    counts: {
      recheck_due: due.length,
      skip_domains: skip.length,
    },
  });
};
