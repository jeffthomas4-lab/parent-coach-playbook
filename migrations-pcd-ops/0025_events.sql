-- The PCD event bus substrate: one append-only log of namespaced domain
-- events (`pcd.<domain>.<event>`, e.g. `pcd.editorial.draft_ready`,
-- `pcd.editorial.published`), per PCD-AI-OS/00-FOUNDATIONS.md section 4 and
-- PCD-AI-OS/08-roadmaps.md Phase 1. Every department's agents emit rows here
-- instead of inventing a bespoke notification table; downstream consumers
-- (Cloudflare Queues, the Approval Queue, future dashboards) read this one
-- table rather than seventeen. It is distinct from `notification_outbox`
-- (migration 0012), which is a delivery-attempt/lease queue for one specific
-- trust-case notification flow, not a general event log.
--
-- This file is additive and intentionally unapplied. Do not apply it
-- remotely, and do not point production code at it as a hard dependency,
-- until the exact-target review, backup/restore evidence, and explicit
-- production-migration approval described in this directory's README have
-- all been completed. A row here carries only a bounded, already-redacted
-- payload -- no requester PII, no child or family identifying data, no raw
-- email/case body, and no secret.

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  -- Namespaced `pcd.<domain>.<event>`, e.g. `pcd.editorial.draft_ready`.
  -- The CHECK enforces the namespace shape. It does not enumerate every
  -- event name, so new domains and event names do not require a migration.
  event_type TEXT NOT NULL CHECK (
    event_type LIKE 'pcd.%.%'
    AND length(event_type) BETWEEN 5 AND 100
  ),
  -- What kind of thing this event is about, e.g. 'editorial_draft',
  -- 'camp_record', 'affiliate_recommendation'. Free text by design: the event
  -- bus is shared across departments and a fixed enum would require a
  -- migration for every new department's first event.
  entity_type TEXT NOT NULL CHECK (length(entity_type) BETWEEN 1 AND 50),
  -- The natural key of the entity, e.g. `articles/some-slug` for an
  -- editorial draft (matching COLLECTION_PATHS + slug in src/lib/publish.ts)
  -- or a camp id for a directory record. Never a raw query, transcript, or
  -- PII value.
  entity_ref TEXT NOT NULL CHECK (length(entity_ref) BETWEEN 1 AND 200),
  -- Bounded JSON detail for the event. json_valid() rejects malformed JSON
  -- at write time rather than downstream at read time.
  payload TEXT NOT NULL DEFAULT '{}' CHECK (
    json_valid(payload)
    AND length(payload) <= 8000
  ),
  actor_type TEXT NOT NULL CHECK (actor_type IN ('staff', 'agent', 'system')),
  actor_ref TEXT NOT NULL CHECK (length(actor_ref) BETWEEN 1 AND 100),
  -- Optional caller-supplied dedupe key so a retried emit (e.g. a Slack
  -- action double-click already handled idempotently by publishDraft, or a
  -- worker retry) does not double-log. NULL is allowed for callers that have
  -- no natural dedupe key. NULL values do not collide under UNIQUE.
  idempotency_key TEXT UNIQUE,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_events_type_created ON events(event_type, created_at DESC);
CREATE INDEX idx_events_entity ON events(entity_type, entity_ref, created_at DESC);
