-- Migration: 0001_init_camps
-- Initial schema for the camps repository.
-- Two tables: submitters (the people who add camps) and camps (the records themselves).
-- Trust-tier on submitters supports a future upgrade from manual moderation to
-- auto-approve-trusted/queue-new without a schema change.
--
-- Fresh-database bootstrap repair (2026-07-16): several legacy columns were
-- originally added to production outside Wrangler's migration ledger. Later
-- migrations 0006 and 0008 create indexes against those columns while their
-- ALTER statements remain commented to protect existing databases. Defining
-- the columns here is intentionally limited to databases where 0001 has never
-- run; it does not alter or authorize changes to an existing remote database.

CREATE TABLE submitters (
  email TEXT PRIMARY KEY,
  trust_level TEXT NOT NULL DEFAULT 'new', -- 'new' | 'trusted' | 'banned'
  submission_count INTEGER NOT NULL DEFAULT 0,
  approved_count INTEGER NOT NULL DEFAULT 0,
  first_submitted_at TEXT NOT NULL,
  last_submitted_at TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE camps (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  sport TEXT NOT NULL,
  age_min INTEGER NOT NULL,
  age_max INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,

  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  latitude REAL,
  longitude REAL,

  description TEXT NOT NULL,
  price_text TEXT,
  day_or_overnight TEXT NOT NULL DEFAULT 'day',
  skill_level TEXT NOT NULL DEFAULT 'all',
  spots_status TEXT NOT NULL DEFAULT 'open',
  contact_email TEXT,
  contact_phone TEXT,
  website_url TEXT,
  lunch_included INTEGER NOT NULL DEFAULT 0,
  aftercare_available INTEGER NOT NULL DEFAULT 0,

  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  submitted_by_email TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,

  -- Legacy columns required by later migrations. Existing databases received
  -- these outside the migration framework; new databases receive them here.
  last_edited_at TEXT,
  last_edited_by TEXT,
  program_type TEXT NOT NULL DEFAULT 'camp',
  registration_deadline TEXT,
  schedule_text TEXT,
  confidence TEXT NOT NULL DEFAULT 'medium'
    CHECK (confidence IN ('high', 'medium', 'low')),
  source_domain TEXT,
  reject_reason_code TEXT
    CHECK (reject_reason_code IS NULL OR reject_reason_code IN (
      'duplicate', 'dead-url', 'unverifiable-address', 'missing-required-field',
      'off-brand', 'past-date', 'aggregator-source', 'low-confidence', 'spam', 'other'
    )),
  url_health_status TEXT NOT NULL DEFAULT 'unchecked'
    CHECK (url_health_status IN ('unchecked', 'live', 'dead', 'timeout', 'redirect')),
  url_last_checked_at TEXT,
  url_last_status_code INTEGER,
  awaiting_review INTEGER NOT NULL DEFAULT 0 CHECK (awaiting_review IN (0, 1)),
  featured INTEGER NOT NULL DEFAULT 0,
  featured_order INTEGER,
  featured_until TEXT,

  FOREIGN KEY (submitted_by_email) REFERENCES submitters(email)
);

CREATE INDEX idx_camps_status ON camps(status);
CREATE INDEX idx_camps_state ON camps(state);
CREATE INDEX idx_camps_sport ON camps(sport);
CREATE INDEX idx_camps_dates ON camps(start_date, end_date);
