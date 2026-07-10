-- Migration: 0013_pcd_editorial_fields
-- Adds the Parent Coach Desk editorial workflow layer to the shared activity-radar database.
--
-- Context: parentcoachdesk.com is moving from its own standalone D1 (parent-coach-playbook)
-- to reading and writing the shared activity-radar D1. This migration adds everything PCD
-- needs that doesn't exist in the ActivityRadar schema yet.
--
-- What this adds:
--   programs      — 19 new columns for editorial workflow, quality, featured placement,
--                   URL health tracking, and program-level contact overrides
--   organizations — 3 new columns for claim payment window, R2 logo key, gallery keys
--   domain_quality — 4 new columns to match PCD's source-domain reputation model
--   camp_claims   — NEW table: PCD claim-a-listing flow (maps to org via program lookup)
--   camp_reviews  — NEW table: PCD parent reviews of specific programs
--   search_domains, search_anchors, search_batches — NEW tables: PCD camp-discovery
--                   pipeline registry (moved from markdown to D1 in PCD's migration 0007)
--
-- Apply to remote:
--   npx wrangler d1 execute activity-radar --file=./migrations/0013_pcd_editorial_fields.sql --remote

-- =====================================================================
-- programs — editorial workflow columns
-- =====================================================================

-- PCD editorial status. Separate from record_status (ActivityRadar lifecycle).
-- record_status drives ActivityRadar display; pcd_status drives PCD admin queue.
-- When PCD approves a program: pcd_status='approved', record_status='active'.
-- When PCD rejects a program: pcd_status='rejected', record_status='inactive'.
ALTER TABLE programs ADD COLUMN pcd_status TEXT NOT NULL DEFAULT 'pending';
  -- 'pending' | 'approved' | 'rejected'

ALTER TABLE programs ADD COLUMN submitted_by_email TEXT;
ALTER TABLE programs ADD COLUMN submitted_at TEXT;
ALTER TABLE programs ADD COLUMN reviewed_by TEXT;
ALTER TABLE programs ADD COLUMN reviewed_at TEXT;
ALTER TABLE programs ADD COLUMN review_notes TEXT;
ALTER TABLE programs ADD COLUMN reject_reason_code TEXT;
  -- 'duplicate' | 'dead-url' | 'unverifiable-address' | 'missing-required-field'
  -- | 'off-brand' | 'past-date' | 'aggregator-source' | 'low-confidence' | 'spam' | 'other'

-- Manual verification flag. Admin sets verified=1 after confirming the listing is real.
ALTER TABLE programs ADD COLUMN verified INTEGER NOT NULL DEFAULT 0;

-- Featured placement on /camps/ home. Admin-toggled.
ALTER TABLE programs ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE programs ADD COLUMN featured_order INTEGER;
ALTER TABLE programs ADD COLUMN featured_until TEXT;  -- ISO date; NULL = indefinite

-- Bulk-imported rows surface in admin queue without blocking the public listing.
ALTER TABLE programs ADD COLUMN awaiting_review INTEGER NOT NULL DEFAULT 0;

-- URL health tracking (registration_url and website_url are checked by the link-checker worker).
ALTER TABLE programs ADD COLUMN url_last_checked_at TEXT;
ALTER TABLE programs ADD COLUMN url_last_status_code INTEGER;

-- Admin edit audit trail.
ALTER TABLE programs ADD COLUMN last_edited_at TEXT;
ALTER TABLE programs ADD COLUMN last_edited_by TEXT;

-- PCD confidence tier. ActivityRadar uses confidence_score (0-100 int); PCD uses a
-- three-tier label. Both coexist — PCD reads pcd_confidence, ActivityRadar reads confidence_score.
ALTER TABLE programs ADD COLUMN pcd_confidence TEXT NOT NULL DEFAULT 'medium';
  -- 'high' | 'medium' | 'low'

-- Program-level contact overrides. COALESCE(p.contact_email, o.email) in read queries.
-- Useful when the specific program has a different coordinator than the org's main contact.
ALTER TABLE programs ADD COLUMN contact_email TEXT;
ALTER TABLE programs ADD COLUMN contact_phone TEXT;

-- Indexes on new columns used in PCD queries.
CREATE INDEX IF NOT EXISTS idx_prog_pcd_status ON programs(pcd_status);
CREATE INDEX IF NOT EXISTS idx_prog_pcd_status_enddate ON programs(pcd_status, session_end_date);
CREATE INDEX IF NOT EXISTS idx_prog_awaiting_review ON programs(awaiting_review);
CREATE INDEX IF NOT EXISTS idx_prog_featured ON programs(featured);
CREATE INDEX IF NOT EXISTS idx_prog_verified ON programs(verified);

-- =====================================================================
-- organizations — claim and media columns
-- =====================================================================

-- Payment window for claimed listings. Set by admin after payment is confirmed.
ALTER TABLE organizations ADD COLUMN claim_paid_until TEXT;  -- ISO date

-- R2 keys for logo and photo gallery (complement to logo_url which is an external URL).
-- logo_key: R2 object key in activityradar-photos bucket (uploaded via /api/admin/camps/:id/photo).
-- gallery_keys: JSON array of R2 object keys.
ALTER TABLE organizations ADD COLUMN logo_key TEXT;
ALTER TABLE organizations ADD COLUMN gallery_keys TEXT;

-- =====================================================================
-- domain_quality — extend to match PCD's source-domain reputation model
-- =====================================================================
-- ActivityRadar's existing columns: domain, trust_score, approved_count, rejected_count,
-- blocked, notes, updated_at
-- PCD adds: submitted_count, high_confidence_count, low_confidence_count, last_seen_at

ALTER TABLE domain_quality ADD COLUMN submitted_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE domain_quality ADD COLUMN high_confidence_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE domain_quality ADD COLUMN low_confidence_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE domain_quality ADD COLUMN last_seen_at TEXT;

-- =====================================================================
-- camp_claims — PCD claim-a-listing flow
-- =====================================================================
-- A claimant requests to own a specific program listing. Admin verifies,
-- collects payment out-of-band, then marks as paid and sets org.is_claimed=1.
-- camp_id references programs.id (the program the claimant is claiming).
-- organization_id is denormalized here for fast org-level lookups.

CREATE TABLE IF NOT EXISTS camp_claims (
  id                    TEXT PRIMARY KEY,
  camp_id               TEXT NOT NULL,           -- programs.id
  organization_id       TEXT,                    -- organizations.id (denormalized)
  claimant_email        TEXT NOT NULL,
  claimant_name         TEXT,
  organization          TEXT,                    -- org name as stated by claimant
  phone                 TEXT,
  notes                 TEXT,                    -- proof of ownership, role, etc.
  status                TEXT NOT NULL DEFAULT 'pending',
    -- 'pending' | 'verified' | 'paid' | 'rejected'
  payment_amount_cents  INTEGER,
  payment_method        TEXT,                    -- 'stripe' | 'invoice' | 'manual'
  submitted_at          TEXT NOT NULL,
  reviewed_by           TEXT,
  reviewed_at           TEXT,
  review_notes          TEXT,
  FOREIGN KEY (camp_id) REFERENCES programs(id)
);

CREATE INDEX IF NOT EXISTS idx_camp_claims_camp   ON camp_claims(camp_id);
CREATE INDEX IF NOT EXISTS idx_camp_claims_status ON camp_claims(status);
CREATE INDEX IF NOT EXISTS idx_camp_claims_org    ON camp_claims(organization_id);

-- =====================================================================
-- camp_reviews — PCD parent reviews of specific programs
-- =====================================================================
-- camp_id references programs.id.
-- Complements the ActivityRadar reviews table (which attaches to org).
-- PCD surfaces these on individual camp detail pages.

CREATE TABLE IF NOT EXISTS camp_reviews (
  id                    TEXT PRIMARY KEY,
  camp_id               TEXT NOT NULL,           -- programs.id
  reviewer_email        TEXT NOT NULL,
  reviewer_display_name TEXT,
  rating                INTEGER NOT NULL,        -- 1-5
  body                  TEXT NOT NULL,
  status                TEXT NOT NULL DEFAULT 'pending',
    -- 'pending' | 'approved' | 'rejected'
  submitted_at          TEXT NOT NULL,
  reviewed_by           TEXT,
  reviewed_at           TEXT,
  review_notes          TEXT,
  FOREIGN KEY (camp_id) REFERENCES programs(id)
);

CREATE INDEX IF NOT EXISTS idx_camp_reviews_camp   ON camp_reviews(camp_id);
CREATE INDEX IF NOT EXISTS idx_camp_reviews_status ON camp_reviews(status);

-- =====================================================================
-- search_domains / search_anchors / search_batches
-- =====================================================================
-- PCD camp-discovery pipeline registry. Tracks which websites have been
-- searched for camps, which geographic anchors have been saturated, and
-- batch import history. Moved from CAMP-SEARCH-LOG.md to D1 in PCD's
-- original migration 0007.

CREATE TABLE IF NOT EXISTS search_domains (
  domain            TEXT PRIMARY KEY,
  organization      TEXT,
  area_covered      TEXT NOT NULL,
    -- Comma-separated anchor slugs (e.g. "tacoma-25mi,seattle-25mi")
  last_checked      TEXT,
  result            TEXT NOT NULL DEFAULT 'unknown',
    -- 'unknown' | 'camps_extracted' | 'partial' | 'blocked' | 'stale_listings' | 'no_camps'
  camps_pulled      INTEGER NOT NULL DEFAULT 0,
  next_recheck_after TEXT,
  notes             TEXT,
  permanent_skip    INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_domains_recheck ON search_domains(next_recheck_after);
CREATE INDEX IF NOT EXISTS idx_search_domains_result  ON search_domains(result);
CREATE INDEX IF NOT EXISTS idx_search_domains_skip    ON search_domains(permanent_skip);

CREATE TABLE IF NOT EXISTS search_anchors (
  slug              TEXT PRIMARY KEY,
  city              TEXT NOT NULL,
  radius_miles      INTEGER NOT NULL,
  status            TEXT NOT NULL DEFAULT 'not_started',
    -- 'not_started' | 'in_progress' | 'saturated' | 'diminishing' | 'paused'
  last_batch_at     TEXT,
  next_batch_after  TEXT,
  notes             TEXT,
  ring              INTEGER NOT NULL DEFAULT 1,
  position          INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_anchors_status ON search_anchors(status);

CREATE TABLE IF NOT EXISTS search_batches (
  id            TEXT PRIMARY KEY,
  batch_date    TEXT NOT NULL,
  anchor_slug   TEXT NOT NULL REFERENCES search_anchors(slug),
  source_file   TEXT,
  rows_imported INTEGER NOT NULL DEFAULT 0,
  rows_rejected INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_batches_anchor ON search_batches(anchor_slug);
CREATE INDEX IF NOT EXISTS idx_search_batches_date   ON search_batches(batch_date);
