CREATE TABLE IF NOT EXISTS directory_sources (
  id                       TEXT PRIMARY KEY,
  name                     TEXT NOT NULL,
  governing_body           TEXT NOT NULL,
  sport                    TEXT,
  canonical_url            TEXT NOT NULL,
  terms_url                TEXT,
  -- How the data is shaped at the source.
  source_type              TEXT NOT NULL CHECK (source_type IN (
                             'html', 'pdf', 'csv', 'api', 'map_widget',
                             'address_search', 'unknown'
                           )),
  -- What slice of the world this directory covers. scope_type names the
  -- dimension, scope_value the specific slice, so "all clubs in USAV region
  -- SC" is ('region','SC') and "WIAA member schools" is ('state','WA').
  scope_type               TEXT NOT NULL CHECK (scope_type IN (
                             'national', 'state', 'region', 'district',
                             'county', 'city', 'membership', 'other'
                           )),
  scope_value              TEXT,
  -- Does the source publish a stable per-organization identifier we can key on?
  has_stable_org_id        INTEGER NOT NULL DEFAULT 0 CHECK (has_stable_org_id IN (0,1)),
  stable_org_id_field      TEXT,
  -- JSON array of the field/column names the source visibly publishes.
  -- Structure only. Never row values.
  published_fields_json    TEXT,
  -- ---- Policy ------------------------------------------------------------
  -- The gate. Nothing enters the batch lane unless this is one of the two
  -- approved_* values AND is_active = 1.
  access_classification    TEXT NOT NULL DEFAULT 'permission_required' CHECK (
                             access_classification IN (
                               'approved_public_batch',
                               'approved_manual_snapshot',
                               'validation_only',
                               'permission_required',
                               'blocked'
                             )),
  -- Verbatim quote of any restriction, so the reason survives staff turnover.
  solicitation_restriction TEXT,
  robots_result            TEXT CHECK (robots_result IS NULL OR robots_result IN (
                             'allowed', 'disallowed', 'unverified', 'not_applicable'
                           )),
  -- Set when the operator reserves AI/derivative use even while allowing
  -- crawling (e.g. Cloudflare Content-Signal ai-train=no, use=reference).
  content_signal_reserved  INTEGER NOT NULL DEFAULT 0 CHECK (content_signal_reserved IN (0,1)),
  approved_method          TEXT,
  permission_evidence_url  TEXT,
  -- ---- Cadence -----------------------------------------------------------
  refresh_cadence_days     INTEGER NOT NULL DEFAULT 180 CHECK (refresh_cadence_days > 0),
  is_active                INTEGER NOT NULL DEFAULT 0 CHECK (is_active IN (0,1)),
  last_policy_checked_at   TEXT,
  last_successful_batch_at TEXT,
  -- How this source was found: the exact query, the date, why it was accepted,
  -- held, or blocked. Required by the brief's query-catalog audit rule.
  discovery_query          TEXT,
  discovered_at            TEXT,
  evidence_notes           TEXT,
  created_at               TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_directory_sources_canonical_url
  ON directory_sources(canonical_url);
CREATE INDEX IF NOT EXISTS idx_directory_sources_due
  ON directory_sources(is_active, access_classification, last_policy_checked_at);
CREATE INDEX IF NOT EXISTS idx_directory_sources_scope
  ON directory_sources(sport, scope_type, scope_value);
CREATE TABLE IF NOT EXISTS directory_batches (
  id                    TEXT PRIMARY KEY,
  directory_source_id   TEXT NOT NULL REFERENCES directory_sources(id),
  snapshot_date         TEXT NOT NULL,
  source_url            TEXT NOT NULL,
  source_etag           TEXT,
  source_last_modified  TEXT,
  -- The idempotency key. Re-running an identical snapshot is a no-op.
  content_sha256        TEXT NOT NULL,
  content_bytes         INTEGER,
  -- expected_row_count is what the SOURCE claims (e.g. "190 listed"), NULL when
  -- it states none. extracted_row_count is what the parser actually got. The
  -- completion gate reconciles the two.
  expected_row_count    INTEGER,
  extracted_row_count   INTEGER NOT NULL DEFAULT 0,
  matched_count         INTEGER NOT NULL DEFAULT 0,
  candidate_count       INTEGER NOT NULL DEFAULT 0,
  inserted_count        INTEGER NOT NULL DEFAULT 0,
  updated_count         INTEGER NOT NULL DEFAULT 0,
  excluded_count        INTEGER NOT NULL DEFAULT 0,
  needs_review_count    INTEGER NOT NULL DEFAULT 0,
  contact_complete_count INTEGER NOT NULL DEFAULT 0,
  -- Completeness tiers C0-C5, counted at batch close. JSON object.
  completeness_json     TEXT,
  status                TEXT NOT NULL DEFAULT 'staged' CHECK (status IN (
                          'staged', 'parsing', 'matching', 'dry_run',
                          'applying', 'complete', 'failed', 'rolled_back'
                        )),
  -- dry_run means nothing was written to the canonical registry. The pilot runs
  -- here and stops here.
  is_dry_run            INTEGER NOT NULL DEFAULT 1 CHECK (is_dry_run IN (0,1)),
  -- Resumability: the highest source_row_number fully dispositioned. A crash
  -- after row 50 resumes at 51 instead of reprocessing.
  resume_after_row      INTEGER NOT NULL DEFAULT 0,
  started_at            TEXT,
  completed_at          TEXT,
  error_summary         TEXT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_directory_batches_replay
  ON directory_batches(directory_source_id, content_sha256);
CREATE INDEX IF NOT EXISTS idx_directory_batches_source_date
  ON directory_batches(directory_source_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_directory_batches_status
  ON directory_batches(status, is_dry_run);
CREATE TABLE IF NOT EXISTS directory_rows (
  id                     TEXT PRIMARY KEY,
  directory_batch_id     TEXT NOT NULL REFERENCES directory_batches(id),
  -- The source's own stable id when it publishes one (USAV region code, NCES
  -- id, league charter number). This is match rule 1 and it is the only thing
  -- that survives a rename cleanly.
  source_external_id     TEXT,
  source_row_number      INTEGER NOT NULL,
  source_name            TEXT NOT NULL,
  source_city            TEXT,
  source_state           TEXT,
  source_sport           TEXT,
  source_affiliation     TEXT,
  source_website_url     TEXT,
  -- ADULT ORGANIZATIONAL ROLE CONTACTS ONLY. See DATA BOUNDARY above.
  source_contact_name    TEXT,
  source_contact_role    TEXT,
  source_contact_email   TEXT,
  source_contact_phone   TEXT,
  source_url             TEXT NOT NULL,
  -- ---- Resolution --------------------------------------------------------
  canonical_organization_id TEXT,   -- soft ref to activity-radar organizations.id
  match_method           TEXT CHECK (match_method IS NULL OR match_method IN (
                           'source_membership', 'external_id', 'ein',
                           'domain_geo', 'name_city_state', 'alias_corroborated',
                           'fuzzy_held', 'none'
                         )),
  match_confidence       REAL CHECK (match_confidence IS NULL OR (match_confidence >= 0 AND match_confidence <= 100)),
  -- Exactly one disposition per extracted row. The completion gate requires
  -- this to be NOT NULL for every row in the batch.
  disposition            TEXT CHECK (disposition IS NULL OR disposition IN (
                           'matched', 'candidate', 'inserted',
                           'excluded', 'needs_review'
                         )),
  disposition_reason     TEXT,
  -- C0-C5 for this row, assessed after matching.
  completeness_tier      TEXT CHECK (completeness_tier IS NULL OR completeness_tier IN (
                           'C0','C1','C2','C3','C4','C5'
                         )),
  -- Set when a later batch of the same source no longer contains this row.
  -- A removal is recorded, never a canonical delete.
  retired_at             TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at             TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_directory_rows_batch_rownum
  ON directory_rows(directory_batch_id, source_row_number);
CREATE INDEX IF NOT EXISTS idx_directory_rows_disposition
  ON directory_rows(directory_batch_id, disposition);
CREATE INDEX IF NOT EXISTS idx_directory_rows_canonical
  ON directory_rows(canonical_organization_id) WHERE canonical_organization_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_directory_rows_review
  ON directory_rows(disposition, match_confidence DESC) WHERE disposition = 'needs_review';
CREATE INDEX IF NOT EXISTS idx_directory_rows_external
  ON directory_rows(source_external_id) WHERE source_external_id IS NOT NULL;
CREATE TABLE IF NOT EXISTS dedupe_log (
  id                     TEXT PRIMARY KEY,
  directory_batch_id     TEXT NOT NULL REFERENCES directory_batches(id),
  directory_row_id       TEXT REFERENCES directory_rows(id),
  canonical_organization_id TEXT,
  action                 TEXT NOT NULL CHECK (action IN (
                           'match', 'insert_candidate', 'field_update',
                           'alias_add', 'merge_proposed', 'contact_upsert',
                           'exclude', 'hold_for_review', 'rollback'
                         )),
  -- Which target the before/after refer to, since a batch writes to both the
  -- organization graph and the contact store.
  target_table           TEXT NOT NULL DEFAULT 'organizations' CHECK (target_table IN (
                           'organizations', 'org_contacts', 'directory_rows'
                         )),
  target_id              TEXT,
  match_method           TEXT,
  before_json            TEXT,
  after_json             TEXT,
  confidence             REAL,
  review_status          TEXT NOT NULL DEFAULT 'auto_applied' CHECK (review_status IN (
                           'auto_applied', 'pending_review', 'approved',
                           'rejected', 'reverted', 'dry_run'
                         )),
  reviewed_by            TEXT,
  reviewed_at            TEXT,
  -- Set when a rollback entry reverses this one. Points at the reversing row.
  reversed_by_id         TEXT,
  created_at             TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_dedupe_log_batch
  ON dedupe_log(directory_batch_id, action);
CREATE INDEX IF NOT EXISTS idx_dedupe_log_row
  ON dedupe_log(directory_row_id);
CREATE INDEX IF NOT EXISTS idx_dedupe_log_org
  ON dedupe_log(canonical_organization_id);
CREATE INDEX IF NOT EXISTS idx_dedupe_log_review
  ON dedupe_log(review_status) WHERE review_status = 'pending_review';
CREATE INDEX IF NOT EXISTS idx_dedupe_log_rollback
  ON dedupe_log(directory_batch_id, review_status, created_at DESC);
