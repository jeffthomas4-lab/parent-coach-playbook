-- Migration: 0003_operations
-- Operational tables carried forward from the parent-coach-playbook camps build.
-- These were real and working; they map cleanly onto the new model. Most attach
-- to the organization instead of the flat camp row.

-- =====================================================================
-- submitters  -- people who add records. Trust tiers drive auto-approve.
-- Carried forward unchanged from camps 0001.
-- =====================================================================
CREATE TABLE submitters (
  email             TEXT PRIMARY KEY,
  trust_level       TEXT NOT NULL DEFAULT 'new',  -- 'new' | 'trusted' | 'banned'
  submission_count  INTEGER NOT NULL DEFAULT 0,
  approved_count    INTEGER NOT NULL DEFAULT 0,
  first_submitted_at TEXT NOT NULL,
  last_submitted_at  TEXT NOT NULL,
  notes             TEXT
);

-- =====================================================================
-- org_claims  -- the claim-listing flow, re-homed from camp_claims to the org.
-- =====================================================================
CREATE TABLE org_claims (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  claimant_email  TEXT NOT NULL,
  claimant_name   TEXT,
  claimant_role   TEXT,                          -- relationship to the org
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  evidence        TEXT,                          -- how they proved authority
  submitted_at    TEXT NOT NULL,
  reviewed_by     TEXT,
  reviewed_at     TEXT,
  review_notes    TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_claims_org    ON org_claims(organization_id);
CREATE INDEX idx_claims_status ON org_claims(status);

-- =====================================================================
-- reviews  -- parent reviews. Attach to the organization (was camp_reviews).
-- =====================================================================
CREATE TABLE reviews (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  program_id      TEXT,                          -- optional: review of a specific program
  rating          INTEGER NOT NULL,              -- 1-5
  body            TEXT,
  reviewer_name   TEXT,
  reviewer_email  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  created_at      TEXT NOT NULL,
  reviewed_at     TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (program_id)      REFERENCES programs(id)
);

CREATE INDEX idx_reviews_org    ON reviews(organization_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- =====================================================================
-- featured_listings  -- paid placement. Can target an org or a program.
-- =====================================================================
CREATE TABLE featured_listings (
  id              TEXT PRIMARY KEY,
  organization_id TEXT,
  program_id      TEXT,
  placement       TEXT NOT NULL,                 -- 'home' | 'category' | 'city'
  starts_at       TEXT NOT NULL,
  ends_at         TEXT NOT NULL,
  active          INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (program_id)      REFERENCES programs(id)
);

CREATE INDEX idx_featured_active ON featured_listings(active, placement);

-- =====================================================================
-- geocoded_addresses  -- geocoding cache. Carried forward unchanged.
-- =====================================================================
CREATE TABLE geocoded_addresses (
  address_key  TEXT PRIMARY KEY,                 -- normalized address string
  latitude     REAL NOT NULL,
  longitude    REAL NOT NULL,
  geocoded_at  TEXT NOT NULL
);

-- =====================================================================
-- domain_quality  -- source-domain reputation. Carried forward from camps 0006.
-- =====================================================================
CREATE TABLE domain_quality (
  domain        TEXT PRIMARY KEY,
  trust_score   INTEGER NOT NULL DEFAULT 50,     -- 0-100
  approved_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  blocked       INTEGER NOT NULL DEFAULT 0,
  notes         TEXT,
  updated_at    TEXT NOT NULL
);
