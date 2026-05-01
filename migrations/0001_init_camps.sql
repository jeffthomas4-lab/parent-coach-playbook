-- Migration: 0001_init_camps
-- Initial schema for the camps repository.
-- Two tables: submitters (the people who add camps) and camps (the records themselves).
-- Trust-tier on submitters supports a future upgrade from manual moderation to
-- auto-approve-trusted/queue-new without a schema change.

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

  FOREIGN KEY (submitted_by_email) REFERENCES submitters(email)
);

CREATE INDEX idx_camps_status ON camps(status);
CREATE INDEX idx_camps_state ON camps(state);
CREATE INDEX idx_camps_sport ON camps(sport);
CREATE INDEX idx_camps_dates ON camps(start_date, end_date);
