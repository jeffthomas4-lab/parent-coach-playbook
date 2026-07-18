// POST /api/search-event
//
// Logs a search query to D1 for editorial signal. Fire-and-forget from the
// client — the search page calls this without awaiting a response, so a failure
// here is invisible to the user.
//
// Collection is default-off until the data contract, retention period, public
// disclosure, and production migration are separately approved.

import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { featureEnabled } from '../../lib/feature-flags';
import {
  boundedDimension,
  classifyDemandActor,
  DEMAND_EVENT_SCHEMA_VERSION,
  demandExpiry,
  demandResultBand,
  demandRetentionDays,
  isSameOriginRequest,
  readBoundedJson,
  sanitizeDemandQuery,
} from '../../lib/demand-telemetry';
import {
  enforcePublicWriteRateLimit,
  type PublicRateLimiter,
} from '../../lib/public-rate-limit';

export const prerender = false;

interface SearchEventPayload {
  query?: unknown;
  eventType?: unknown;
  resultCount?: unknown;
  collection?: unknown;
  sport?: unknown;
  age?: unknown;
  surface?: unknown;
}

const respond = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as {
    PCD_OPS_DB?: D1Database;
    DEMAND_TELEMETRY_ENABLED?: string;
    DEMAND_EVENT_RETENTION_DAYS?: string;
    DEMAND_RATE_LIMITER?: PublicRateLimiter;
  } | undefined;
  if (!featureEnabled(env?.DEMAND_TELEMETRY_ENABLED)) {
    return respond({ ok: false, error: 'not found' }, 404);
  }
  if (!env?.PCD_OPS_DB) {
    return respond({ ok: false, error: 'operational database not available' }, 503);
  }
  const retentionDays = demandRetentionDays(env.DEMAND_EVENT_RETENTION_DAYS);
  if (!retentionDays) {
    // A flag alone cannot activate collection. Retention is a required part of
    // the approved data contract and must be explicit and bounded.
    return respond({ ok: false, error: 'telemetry unavailable' }, 503);
  }
  if (!isSameOriginRequest(request)) {
    return respond({ ok: false, error: 'origin not allowed' }, 403);
  }

  let payload: SearchEventPayload = {};
  try {
    payload = (await readBoundedJson(request)) as SearchEventPayload;
  } catch (error) {
    if (error instanceof RangeError) return respond({ ok: false, error: 'payload too large' }, 413);
    return respond({ ok: false, error: 'invalid JSON' }, 400);
  }

  const sanitized = sanitizeDemandQuery(payload.query);
  if (!sanitized) {
    return respond({ ok: false, error: 'query is required' }, 400);
  }

  const limited = await enforcePublicWriteRateLimit(
    env.DEMAND_RATE_LIMITER,
    request,
    'demand-telemetry',
  );
  if (limited) return limited;

  const resultBand = demandResultBand(payload.resultCount);
  const eventType = payload.eventType === 'filter' ? 'filter' : 'search';
  const collection = boundedDimension(payload.collection, 50);
  const sport = boundedDimension(payload.sport, 50);
  const age = boundedDimension(payload.age, 30);
  const surface = payload.surface === 'camp_directory' ? 'camp_directory' : 'site_search';
  const botClass = classifyDemandActor(request);
  const createdAt = new Date().toISOString();
  const expiresAt = demandExpiry(createdAt, retentionDays);
  const eventId = crypto.randomUUID();

  try {
    await env.PCD_OPS_DB.prepare(
      `INSERT INTO demand_events_v1 (
         event_id, schema_version, event_type, query, query_redacted,
         result_band, surface, collection, sport, age_band, geography,
         bot_class, sampled, created_at, expires_at
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      // User-agent is classified ephemerally and discarded. IP and referrer are
      // never bound. Geography remains null until its policy is approved.
      .bind(
        eventId,
        DEMAND_EVENT_SCHEMA_VERSION,
        eventType,
        sanitized.query,
        sanitized.redacted ? 1 : 0,
        resultBand,
        surface,
        collection,
        sport,
        age,
        null,
        botClass,
        1,
        createdAt,
        expiresAt,
      )
      .run();

    return respond({ ok: true });
  } catch (err) {
    // Table may not exist yet (migration not yet applied). Log and return ok:false
    // without crashing — the client ignores this response anyway.
    console.error('[search-event] D1 write failed:', err);
    return respond({ ok: false, error: 'write failed' }, 500);
  }
};
