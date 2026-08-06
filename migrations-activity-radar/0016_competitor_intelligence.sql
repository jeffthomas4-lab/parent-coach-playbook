-- Migration: 0016_competitor_intelligence
--
-- Schema for competitor intelligence: figuring out which club-management,
-- registration, website, payments, streaming, and communications tools an
-- organization is actually running, and how much upside a switch to Parent
-- Coach Desk represents.
--
-- competitors is the catalog of vendors we track (SportsGravy, etc.).
--
-- org_tech_signals is the append-only evidence log. Every time a sweep sees a
-- script tag, a link href, page text, a meta tag, a URL pattern, a header, or
-- a DNS CNAME that matches a known competitor fingerprint, it writes one row
-- here. Rows are never updated or deleted; the log is the audit trail behind
-- every belief the system holds.
--
-- org_tech_stack is the current believed state per org and category, rolled
-- up from the signals. This is the table the admin UI and the opportunity
-- scorer actually read.
--
-- org_tech_history is the append-only change log behind org_tech_stack: every
-- time the believed state changes (first detected, switched vendors, lapsed,
-- confidence moved, a human confirmed or rejected it) a row lands here so the
-- story of a single org's stack over time can be reconstructed.
--
-- intel_runs tracks each sweep or crawl job end to end: what was planned,
-- what was fetched, who approved it, and how it finished. Nothing here fires
-- a live fetch on its own; this is only the record of runs that were requested
-- and their outcome.
--
-- intel_review_queue holds detections that are not confident enough, or not
-- clean enough, to promote straight into org_tech_stack. A human resolves
-- each one as accepted or rejected.
--
-- org_opportunity_scores is the composite score used to prioritize outreach:
-- how hard the org would be to migrate, how big it looks, how mature its
-- current stack is, and how likely it is to switch, rolled into one priority
-- number with the reasoning kept alongside it.
--
-- intel_fetch_log is the politeness ledger: one row per domain/path ever
-- fetched, so repeat sweeps can send conditional requests, respect robots.txt,
-- and skip content that has not changed instead of re-fetching it blind.
--
-- Forward-only, additive only. Never destructive.
--
-- Apply to remote:
--   npx wrangler d1 execute activity-radar --file=./migrations-activity-radar/0016_competitor_intelligence.sql --remote

-- =====================================================================
-- competitors: the catalog of vendors we fingerprint and track.
-- =====================================================================
CREATE TABLE IF NOT EXISTS competitors (
  id                    TEXT PRIMARY KEY,               -- slug, e.g. 'sportsgravy'
  display_name          TEXT NOT NULL,
  canonical_domain       TEXT,
  category              TEXT NOT NULL DEFAULT 'club_management',
  status                TEXT NOT NULL DEFAULT 'active',  -- 'active' | 'watch' | 'retired'
  migration_difficulty  TEXT,                            -- 'low' | 'medium' | 'high'
  notes                 TEXT,
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL
);

-- =====================================================================
-- org_tech_signals: append-only evidence log. Never updated, never deleted.
-- =====================================================================
CREATE TABLE IF NOT EXISTS org_tech_signals (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id         TEXT NOT NULL,
  org_id         TEXT,                                   -- nullable; a signal can predate an org record
  domain         TEXT NOT NULL,
  competitor_id  TEXT NOT NULL REFERENCES competitors(id),
  signal_type    TEXT NOT NULL,   -- 'script_src' | 'link_href' | 'html_text' | 'meta' | 'url_pattern' | 'header' | 'dns_cname' | 'manual'
  pattern_id     TEXT NOT NULL,
  matched_value  TEXT,            -- truncated evidence snippet, max 500 chars, enforced in app code
  weight         INTEGER NOT NULL,
  source_url     TEXT NOT NULL,
  observed_at    TEXT NOT NULL
);

-- =====================================================================
-- org_tech_stack: current believed state per org and category.
-- =====================================================================
CREATE TABLE IF NOT EXISTS org_tech_stack (
  id                  TEXT PRIMARY KEY,
  org_id              TEXT NOT NULL REFERENCES organizations(id),
  category            TEXT NOT NULL,   -- 'club_management' | 'registration' | 'website' | 'payments' | 'streaming' | 'communications'
  competitor_id       TEXT REFERENCES competitors(id),
  confidence          INTEGER NOT NULL DEFAULT 0,   -- 0-100
  status              TEXT NOT NULL DEFAULT 'detected',  -- 'detected' | 'confirmed' | 'rejected' | 'lapsed'
  first_detected_at   TEXT NOT NULL,
  last_confirmed_at   TEXT NOT NULL,
  evidence_count      INTEGER NOT NULL DEFAULT 0,
  reviewed_by         TEXT,
  reviewed_at         TEXT,
  review_notes        TEXT,
  UNIQUE(org_id, category)
);

-- =====================================================================
-- org_tech_history: append-only change log behind org_tech_stack.
-- =====================================================================
CREATE TABLE IF NOT EXISTS org_tech_history (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  org_id               TEXT NOT NULL,
  category             TEXT NOT NULL,
  from_competitor_id   TEXT,
  to_competitor_id     TEXT,
  change_type          TEXT NOT NULL,   -- 'first_detected' | 'switched' | 'lapsed' | 'confidence_changed' | 'confirmed' | 'rejected'
  from_confidence      INTEGER,
  to_confidence        INTEGER,
  run_id               TEXT,
  detected_at          TEXT NOT NULL
);

-- =====================================================================
-- intel_runs: one row per sweep or crawl job, requested through to finished.
-- =====================================================================
CREATE TABLE IF NOT EXISTS intel_runs (
  id               TEXT PRIMARY KEY,
  run_type         TEXT NOT NULL,   -- 'org_sweep' | 'competitor_property' | 'manual'
  status           TEXT NOT NULL DEFAULT 'proposed',   -- 'proposed' | 'approved' | 'running' | 'complete' | 'failed' | 'cancelled'
  requested_by     TEXT,
  approved_by      TEXT,
  approved_at      TEXT,
  started_at       TEXT,
  finished_at      TEXT,
  targets_planned  INTEGER NOT NULL DEFAULT 0,
  targets_fetched  INTEGER NOT NULL DEFAULT 0,
  targets_skipped  INTEGER NOT NULL DEFAULT 0,
  signals_found    INTEGER NOT NULL DEFAULT 0,
  error_code       TEXT,
  notes            TEXT,
  created_at       TEXT NOT NULL
);

-- =====================================================================
-- intel_review_queue: detections a human has to accept or reject.
-- =====================================================================
CREATE TABLE IF NOT EXISTS intel_review_queue (
  id                 TEXT PRIMARY KEY,
  org_id             TEXT,
  domain             TEXT NOT NULL,
  competitor_id      TEXT NOT NULL,
  category           TEXT NOT NULL,
  confidence         INTEGER NOT NULL,
  reason             TEXT NOT NULL,   -- 'low_confidence' | 'conflicting_signals' | 'org_unmatched' | 'negative_pattern_conflict'
  evidence_json      TEXT,
  status             TEXT NOT NULL DEFAULT 'pending',   -- 'pending' | 'accepted' | 'rejected'
  run_id             TEXT,
  resolved_by        TEXT,
  resolved_at        TEXT,
  resolution_notes   TEXT,
  created_at         TEXT NOT NULL
);

-- =====================================================================
-- org_opportunity_scores: composite priority score used for outreach.
-- =====================================================================
CREATE TABLE IF NOT EXISTS org_opportunity_scores (
  org_id                TEXT PRIMARY KEY REFERENCES organizations(id),
  migration_difficulty  INTEGER,   -- 0-100, higher = harder
  org_size_score        INTEGER,
  tech_maturity         INTEGER,
  switch_likelihood     INTEGER,
  revenue_estimate_usd  INTEGER,
  priority              INTEGER NOT NULL DEFAULT 0,   -- 0-100 composite
  rationale             TEXT,   -- JSON, per-factor explanation
  scoring_version       INTEGER NOT NULL DEFAULT 1,
  scored_at             TEXT NOT NULL
);

-- =====================================================================
-- intel_fetch_log: politeness ledger for conditional requests and dedupe.
-- =====================================================================
CREATE TABLE IF NOT EXISTS intel_fetch_log (
  domain              TEXT NOT NULL,
  path                TEXT NOT NULL,
  last_fetched_at     TEXT NOT NULL,
  status_code         INTEGER,
  etag                TEXT,
  last_modified       TEXT,
  content_hash        TEXT,
  robots_allowed      INTEGER NOT NULL DEFAULT 1,
  robots_checked_at   TEXT,
  PRIMARY KEY (domain, path)
);

-- =====================================================================
-- indexes
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_org_tech_signals_org         ON org_tech_signals(org_id);
CREATE INDEX IF NOT EXISTS idx_org_tech_signals_domain      ON org_tech_signals(domain);
CREATE INDEX IF NOT EXISTS idx_org_tech_signals_run         ON org_tech_signals(run_id);
CREATE INDEX IF NOT EXISTS idx_org_tech_signals_competitor  ON org_tech_signals(competitor_id, observed_at);

CREATE INDEX IF NOT EXISTS idx_org_tech_stack_competitor    ON org_tech_stack(competitor_id, status);
CREATE INDEX IF NOT EXISTS idx_org_tech_stack_status        ON org_tech_stack(status, confidence);

CREATE INDEX IF NOT EXISTS idx_org_tech_history_org         ON org_tech_history(org_id, detected_at);

CREATE INDEX IF NOT EXISTS idx_intel_review_queue_status    ON intel_review_queue(status, created_at);

CREATE INDEX IF NOT EXISTS idx_intel_runs_status            ON intel_runs(status, created_at);

CREATE INDEX IF NOT EXISTS idx_org_opportunity_scores_priority ON org_opportunity_scores(priority DESC);

CREATE INDEX IF NOT EXISTS idx_intel_fetch_log_last_fetched ON intel_fetch_log(last_fetched_at);

-- The nightly/on-demand sweep work queue: which organizations are due a
-- fresh look, oldest-verified-first, restricted to active rows with a
-- website to actually crawl.
CREATE INDEX IF NOT EXISTS idx_organizations_intel_queue
  ON organizations(record_status, website_url, last_verified_at);
