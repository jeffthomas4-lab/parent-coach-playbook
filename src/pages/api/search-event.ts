// POST /api/search-event
//
// Logs a search query to D1 for editorial signal. Fire-and-forget from the
// client — the search page calls this without awaiting a response, so a failure
// here is invisible to the user.
//
// No PII is stored: no user ID, no email, no session token. The referrer and
// user-agent are included as standard technical context, not for tracking.

import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

interface SearchEventPayload {
  query?: unknown;
  resultCount?: unknown;
  collection?: unknown;
  sport?: unknown;
  age?: unknown;
}

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB: D1Database } | undefined;
  if (!env?.DB) {
    return respond({ ok: false, error: 'database not available' }, 500);
  }

  let payload: SearchEventPayload = {};
  try {
    payload = (await request.json()) as SearchEventPayload;
  } catch {
    return respond({ ok: false, error: 'invalid JSON' }, 400);
  }

  const query = typeof payload.query === 'string' ? payload.query.trim() : '';
  if (!query) {
    return respond({ ok: false, error: 'query is required' }, 400);
  }

  const resultCount =
    typeof payload.resultCount === 'number' ? Math.floor(payload.resultCount) : null;
  const collection =
    typeof payload.collection === 'string' && payload.collection.trim()
      ? payload.collection.trim().slice(0, 100)
      : null;
  const sport =
    typeof payload.sport === 'string' && payload.sport.trim()
      ? payload.sport.trim().slice(0, 100)
      : null;
  const age =
    typeof payload.age === 'string' && payload.age.trim()
      ? payload.age.trim().slice(0, 50)
      : null;

  const referrer = (request.headers.get('referer') ?? '').slice(0, 500) || null;
  const userAgent = (request.headers.get('user-agent') ?? '').slice(0, 200) || null;
  const createdAt = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO search_events (query, result_count, collection, sport, age, referrer, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(query, resultCount, collection, sport, age, referrer, userAgent, createdAt)
      .run();

    return respond({ ok: true });
  } catch (err) {
    // Table may not exist yet (migration not yet applied). Log and return ok:false
    // without crashing — the client ignores this response anyway.
    console.error('[search-event] D1 write failed:', err);
    return respond({ ok: false, error: 'write failed' }, 500);
  }
};
