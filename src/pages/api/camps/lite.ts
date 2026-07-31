// GET /api/camps/lite
//
// The full campsLite dataset for /camps/: every approved, non-past camp
// (bounded by listApprovedCamps' APPROVED_CAMPS_HARD_CAP), projected down to
// the fields the client's search, filters, and Leaflet map actually read.
// See src/lib/camps-lite.ts for the shared projection and
// reports/CAMPS-RENDERING-REBUILD-2026-07-31.md for why this exists as its
// own endpoint: it used to be an inline JSON island on every /camps/ page
// load (~253,500 bytes projected at 311 approved camps), shipped on first
// paint even though nothing needs it until JavaScript is ready to filter or
// map something. camps/index.astro now fetches this in the background after
// first paint instead.
//
// This response is identical for every visitor (no auth, no per-user
// scoping) and cheap to serve stale for a few minutes, so it is genuinely
// cacheable — see src/lib/camps-lite-cache.ts for the Cache API layer, its
// stated TTL, and its stated (best-effort, single-colo) invalidation path.

import type { APIRoute } from 'astro';
import { listApprovedCamps, type Camp } from '../../../lib/camps-db';
import { toCampsLite } from '../../../lib/camps-lite';
import { CAMP_SPORTS } from '../../../data/site';
import { env as cfEnv } from 'cloudflare:workers';
import { enforcePublicWriteRateLimit, type PublicRateLimiter } from '../../../lib/public-rate-limit';
import { createRequestLogger, type RequestLogger } from '../../../lib/log';
import {
  getCampsLiteFromEdgeCache,
  putCampsLiteInEdgeCache,
  CAMPS_LITE_CACHE_TTL_SECONDS,
  CAMPS_LITE_STALE_WHILE_REVALIDATE_SECONDS,
  CAMPS_LITE_REVALIDATE_AFTER_SECONDS,
} from '../../../lib/camps-lite-cache';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

const RESPONSE_CACHE_CONTROL = `public, s-maxage=${CAMPS_LITE_CACHE_TTL_SECONDS}, stale-while-revalidate=${CAMPS_LITE_STALE_WHILE_REVALIDATE_SECONDS}`;

interface LiteEnv {
  DB?: D1Database;
  PUBLIC_READ_RATE_LIMITER?: PublicRateLimiter;
}

// Shared by the cache-miss path (compute, cache, and return) and the
// background revalidation path (compute and cache only, no response to
// return). Never throws to its caller in the background path — see
// scheduleBackgroundRevalidate below — but the cache-miss path lets a
// failure here reach its own try/catch so the request can fail loud.
async function buildCampsLiteBody(db: D1Database): Promise<string> {
  const camps: Camp[] = await listApprovedCamps(db);
  return JSON.stringify({ ok: true, camps: toCampsLite(camps), sports: CAMP_SPORTS });
}

async function refreshCache(db: D1Database, logger: RequestLogger): Promise<void> {
  try {
    const body = await buildCampsLiteBody(db);
    await putCampsLiteInEdgeCache(body);
  } catch (error) {
    // A failed background refresh just leaves the existing (still valid,
    // still within its stale-while-revalidate window) entry in place one
    // cycle longer. Logged, not silent, but never allowed to surface to a
    // reader — this runs behind waitUntil, after the response already went
    // out.
    logger.warn('camps_lite_background_refresh_failed', {
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
}

export const GET: APIRoute = async ({ request, locals }) => {
  const logger = createRequestLogger(request, { route: 'api/camps/lite', userId: null });

  if (request.method !== 'GET') {
    return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'GET' });
  }

  const env = cfEnv as LiteEnv | undefined;

  const limited = await enforcePublicWriteRateLimit(env?.PUBLIC_READ_RATE_LIMITER, request, 'camps-lite', null);
  if (limited) return limited;

  // Cache hit: serve instantly, no D1 read at all. If the entry is old
  // enough to be due for a refresh, kick a non-blocking background
  // recompute so the next request (in this colo) is more likely to find a
  // fresher copy already waiting — the "revalidate behind it" half of
  // stale-while-revalidate, not just the HTTP header's promise of it.
  const cached = await getCampsLiteFromEdgeCache();
  if (cached) {
    if (cached.ageSeconds >= CAMPS_LITE_REVALIDATE_AFTER_SECONDS && env?.DB) {
      const refresh = refreshCache(env.DB, logger);
      const runtimeCtx = (locals as { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } })
        ?.runtime?.ctx;
      if (typeof runtimeCtx?.waitUntil === 'function') {
        runtimeCtx.waitUntil(refresh);
      } else {
        // No waitUntil available (local dev outside wrangler) — let it run
        // without blocking this response; a rejection here is already
        // caught inside refreshCache and only logged.
        void refresh;
      }
    }
    return cached.response;
  }

  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  let body: string;
  try {
    body = await buildCampsLiteBody(env.DB);
  } catch (error) {
    logger.error('list_approved_camps_failed', error);
    return json({ ok: false, error: 'directory temporarily unavailable' }, 500);
  }

  // Fire-and-forget: a failed cache write degrades this endpoint back to
  // "always hits D1," not to a broken response. Never blocks or fails the
  // request the reader is actually waiting on.
  try {
    await putCampsLiteInEdgeCache(body);
  } catch (error) {
    logger.warn('camps_lite_cache_put_failed', {
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': RESPONSE_CACHE_CONTROL,
    },
  });
};
