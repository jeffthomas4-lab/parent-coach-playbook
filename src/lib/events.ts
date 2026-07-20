// The PCD event bus writer.
//
// One append-only log of namespaced domain events (`pcd.<domain>.<event>`),
// per PCD-AI-OS/00-FOUNDATIONS.md section 4 ("Event bus: an `events` table in
// D1 plus Cloudflare Queues") and PCD-AI-OS/08-roadmaps.md Phase 1. This file
// is the write side only. There is no reader/dispatcher here yet — Cloudflare
// Queues consumption, if and when a subscriber needs it, is a separate build.
//
// Binding: PCD_OPS_DB, the operational D1 database described in
// migrations-pcd-ops/README.md. Migration 0025_events.sql defines the table
// and is intentionally unapplied to any real database (design-only, per that
// README's production-safety convention). Because of that, every call in
// this file is best-effort: a missing binding or a missing/unmigrated table
// is caught, logged, and swallowed. Nothing in this file may throw and break
// a caller's real work (publishing a draft, flipping a status) just because
// the event log isn't wired up yet in a given environment.

const MAX_PAYLOAD_LEN = 8000;
const EVENT_TYPE_RE = /^pcd\.[a-z0-9_]+\.[a-z0-9_]+$/;

export interface EventsEnv {
  PCD_OPS_DB?: D1Database;
}

export type EventActorType = 'staff' | 'agent' | 'system';

export interface EmitEventInput {
  /** Namespaced `pcd.<domain>.<event>`, e.g. `pcd.editorial.draft_ready`. */
  eventType: string;
  /** What kind of thing this event is about, e.g. `editorial_draft`, `camp_record`. */
  entityType: string;
  /** The entity's natural key, e.g. `articles/some-slug`. Never PII or a raw transcript. */
  entityRef: string;
  /** Bounded JSON detail. Stringified and clamped; never allowed to break the write. */
  payload?: unknown;
  actorType: EventActorType;
  actorRef: string;
  /** Optional dedupe key so a retried caller does not double-log the same event. */
  idempotencyKey?: string;
  occurredAt?: string;
}

function isNamespacedEventType(eventType: string): boolean {
  return EVENT_TYPE_RE.test(eventType) && eventType.length >= 5 && eventType.length <= 100;
}

function boundedJson(value: unknown): string {
  if (value === undefined) return '{}';
  let json: string;
  try {
    json = JSON.stringify(value ?? {});
  } catch {
    return '{}';
  }
  if (json.length > MAX_PAYLOAD_LEN) {
    // Truncating JSON mid-structure can produce invalid JSON, so on overflow
    // we drop to a bounded marker instead of a half-written payload row.
    return JSON.stringify({ truncated: true, originalLength: json.length });
  }
  return json;
}

/**
 * Write one event row. Unguarded — throws on a D1 error or a bad event type,
 * same as agent-runs.ts's startRun/finishRun. Use this only when the caller
 * wants a write failure to be visible. Most callers should use
 * emitEventSafely instead.
 */
export async function emitEvent(db: D1Database, input: EmitEventInput): Promise<void> {
  if (!isNamespacedEventType(input.eventType)) {
    throw new Error(`emitEvent: event_type "${input.eventType}" is not namespaced as pcd.<domain>.<event>`);
  }
  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO events (id, event_type, entity_type, entity_ref, payload, actor_type, actor_ref, idempotency_key, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(idempotency_key) DO NOTHING`,
    )
    .bind(
      id,
      input.eventType,
      input.entityType,
      input.entityRef,
      boundedJson(input.payload),
      input.actorType,
      input.actorRef,
      input.idempotencyKey ?? null,
      input.occurredAt ?? new Date().toISOString(),
    )
    .run();
}

/**
 * Best-effort event write for production call sites. Returns true if the row
 * was (or already had been, on a repeated idempotency key) written, false on
 * any failure — missing binding, unmigrated table, bad input. Never throws.
 *
 * This is deliberately permissive about the table not existing yet: 0025 is
 * unapplied by design (see migrations-pcd-ops/README.md), so a production
 * deploy that starts calling this function must not break because the
 * migration hasn't landed. The failure is logged so it's visible in the
 * Worker logs, not silent.
 */
export async function emitEventSafely(
  env: EventsEnv | undefined,
  input: EmitEventInput,
): Promise<boolean> {
  if (!env?.PCD_OPS_DB) return false;
  try {
    await emitEvent(env.PCD_OPS_DB, input);
    return true;
  } catch (err) {
    console.error(
      JSON.stringify({
        event: 'pcd_event_emit_failed',
        event_type: input.eventType,
        code: err instanceof Error ? err.message : 'unknown_error',
      }),
    );
    return false;
  }
}
