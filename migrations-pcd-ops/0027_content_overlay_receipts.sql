-- Inline editor: tamper-resistant sensitive-action receipts.
--
-- Website Build Standard, Pillar 13 item 3. An inline content edit is an admin
-- mutation on production copy, so it emits a receipt like any other sensitive
-- action.
--
-- Three properties this table has to hold:
--   1. Append-only. Enforced by triggers, not by convention.
--   2. Integrity-verifiable. Each row carries the previous row's hash, so a
--      deleted, modified or reordered row breaks the chain and is detectable.
--   3. Redacted. actor_digest is a SHA-256 of the email, never the address.
--      Values are stored as bounded summaries, not unbounded blobs.

CREATE TABLE IF NOT EXISTS content_overlay_receipts (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Envelope
  schema_version    INTEGER NOT NULL DEFAULT 1,
  environment       TEXT    NOT NULL,              -- 'production' | 'staging' | 'local'
  occurred_at       TEXT    NOT NULL,              -- ISO 8601 UTC
  request_id        TEXT    NOT NULL,              -- CF-Ray or generated correlation ID

  -- Actor and authorization context. No raw email, ever.
  actor_digest      TEXT    NOT NULL,              -- SHA-256 hex of lowercased email
  actor_domain      TEXT,                          -- domain only, for at-a-glance triage
  auth_method       TEXT    NOT NULL,              -- 'cloudflare-access-jwt'
  auth_verified     INTEGER NOT NULL,              -- 1 when the JWT signature was checked

  -- Action and resource
  action            TEXT    NOT NULL,              -- 'overlay.update' | 'overlay.revert'
  region_key        TEXT    NOT NULL,
  region_label      TEXT    NOT NULL,
  revision          INTEGER NOT NULL,

  -- Bounded before/after summaries. Truncated at write time; these are for
  -- review and rollback, not a content archive.
  before_summary    TEXT,
  after_summary     TEXT,
  before_length     INTEGER,
  after_length      INTEGER,

  result            TEXT    NOT NULL,              -- 'applied' | 'rejected' | 'conflict' | 'failed'
  reason            TEXT,                          -- bounded, safe, no stack traces

  -- Integrity chain
  prev_hash         TEXT    NOT NULL,              -- '' for the genesis row
  row_hash          TEXT    NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_overlay_receipts_region
  ON content_overlay_receipts (region_key, id DESC);

CREATE INDEX IF NOT EXISTS idx_overlay_receipts_time
  ON content_overlay_receipts (occurred_at DESC);

CREATE INDEX IF NOT EXISTS idx_overlay_receipts_actor
  ON content_overlay_receipts (actor_digest, id DESC);

-- Append-only enforcement. A receipt log that can be quietly edited is not a
-- receipt log. These fail the statement rather than silently ignoring it.
CREATE TRIGGER IF NOT EXISTS content_overlay_receipts_no_update
BEFORE UPDATE ON content_overlay_receipts
BEGIN
  SELECT RAISE(ABORT, 'content_overlay_receipts is append-only: UPDATE is not permitted');
END;

CREATE TRIGGER IF NOT EXISTS content_overlay_receipts_no_delete
BEFORE DELETE ON content_overlay_receipts
BEGIN
  SELECT RAISE(ABORT, 'content_overlay_receipts is append-only: DELETE is not permitted');
END;
