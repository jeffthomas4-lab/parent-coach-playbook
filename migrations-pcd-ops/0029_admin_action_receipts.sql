-- Tamper-resistant sensitive-action receipts (Website Build Standard Pillar 13,
-- row 3). One append-only, hash-chained log of admin mutations: camp
-- approve/reject/verify/photo/update today, with reviews/claims/editorial/
-- suggestions queued as follow-up call sites (see src/lib/admin-receipts.ts
-- header). This replaces the STANDARD-AUDIT.md open item #25 description of a
-- "content_overlay_receipts" table, which a 2026-07-30 audit could not find
-- anywhere in source, migrations, or the live PCD_OPS_DB table list -- that
-- table was never built. This one is real, applied, and tested.
--
-- Binding: PCD_OPS_DB. Never the shared activity-radar DB -- a receipt row
-- must survive independently of the record it describes, and activity-radar
-- is also written by two other Workers (activityradar-enrichment,
-- worker-link-checker) that have no business writing admin receipts.
--
-- Append-only is enforced at the database layer, not just by convention:
-- trg_admin_receipts_no_update and trg_admin_receipts_no_delete abort any
-- UPDATE or DELETE against this table, including from a future admin tool
-- that "just wants to fix a typo" in a receipt. Fix it by writing a new
-- receipt that supersedes the old one; never edit history.
--
-- Integrity is a hash chain, not just an index: row_hash covers this row's
-- own fields plus prev_hash (the previous row's row_hash, or GENESIS_HASH for
-- the first row). Recomputing row_hash for every row and checking it matches
-- both the stored value and the next row's prev_hash detects an update,
-- delete, or reorder even if someone bypassed the triggers with direct file
-- access to a local D1 replica. See src/lib/admin-receipts.ts's
-- verifyReceiptChain().
--
-- Redaction, per the standard's exclusion list: actor identity is a SHA-256
-- digest plus the bare domain, never a raw email (matches the pattern
-- documented in migrations-pcd-ops/README.md for org_contacts and elsewhere
-- in this codebase, e.g. public-idempotency.ts's sha256Hex). before_summary/
-- after_summary/reason are bounded plain text -- never a raw request body,
-- token, invitation secret, card number, provider secret, signed URL, health
-- record, or full minor profile.

CREATE TABLE admin_action_receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schema_version INTEGER NOT NULL DEFAULT 1,
  -- 'staging' | 'production' | 'local' -- whichever SITE_URL/environment the
  -- Worker that wrote this row believes it is running as. Never inferred from
  -- the receipt reader; always stamped by the writer at write time.
  environment TEXT NOT NULL CHECK (length(environment) BETWEEN 1 AND 40),
  actor_email_digest TEXT NOT NULL CHECK (length(actor_email_digest) = 64),
  actor_email_domain TEXT NOT NULL CHECK (length(actor_email_domain) BETWEEN 1 AND 255),
  -- e.g. 'camp.approve', 'camp.reject', 'camp.verify', 'camp.photo_replace',
  -- 'camp.update', 'review.approve', 'review.reject'. Dot-namespaced so a
  -- reader can group by resource without a join.
  action TEXT NOT NULL CHECK (length(action) BETWEEN 3 AND 60),
  resource_type TEXT NOT NULL CHECK (length(resource_type) BETWEEN 1 AND 40),
  resource_id TEXT NOT NULL CHECK (length(resource_id) BETWEEN 1 AND 200),
  -- Correlates to the API response's request_id and to Worker logs.
  request_id TEXT NOT NULL CHECK (length(request_id) BETWEEN 1 AND 100),
  -- Bounded description of how the actor was authorized for this action,
  -- e.g. 'cloudflare-access-jwt:admin-allowlist'. Never a token or JWT.
  authorization_context TEXT NOT NULL CHECK (length(authorization_context) BETWEEN 1 AND 200),
  -- 'success' | 'error' | 'blocked'. What actually happened, not what the
  -- caller hoped would happen -- a receipt is written for the true outcome.
  result TEXT NOT NULL CHECK (result IN ('success', 'error', 'blocked')),
  -- Bounded, safe explanation: a validation code, a blocked-transition
  -- reason, or a short error class. Never a stack trace or raw exception.
  reason TEXT CHECK (reason IS NULL OR length(reason) <= 200),
  before_summary TEXT CHECK (before_summary IS NULL OR length(before_summary) <= 200),
  after_summary TEXT CHECK (after_summary IS NULL OR length(after_summary) <= 200),
  prev_hash TEXT NOT NULL CHECK (length(prev_hash) = 64),
  row_hash TEXT NOT NULL CHECK (length(row_hash) = 64),
  created_at TEXT NOT NULL
);

CREATE INDEX idx_admin_receipts_resource ON admin_action_receipts(resource_type, resource_id, created_at DESC);
CREATE INDEX idx_admin_receipts_created ON admin_action_receipts(created_at DESC);
CREATE INDEX idx_admin_receipts_actor ON admin_action_receipts(actor_email_digest, created_at DESC);
-- row_hash is already effectively unique (a SHA-256 collision is not a
-- practical concern), but the constraint also makes a naive "just re-run the
-- insert" retry bug loud instead of silently duplicating a receipt.
CREATE UNIQUE INDEX idx_admin_receipts_row_hash ON admin_action_receipts(row_hash);

CREATE TRIGGER trg_admin_receipts_no_update
BEFORE UPDATE ON admin_action_receipts
BEGIN
  SELECT RAISE(ABORT, 'admin_action_receipts is append-only: UPDATE is forbidden, write a new receipt instead');
END;

CREATE TRIGGER trg_admin_receipts_no_delete
BEFORE DELETE ON admin_action_receipts
BEGIN
  SELECT RAISE(ABORT, 'admin_action_receipts is append-only: DELETE is forbidden, receipts are retained forever');
END;
