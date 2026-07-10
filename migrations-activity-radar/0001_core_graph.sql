-- Migration: 0001_core_graph
-- ActivityRadar shared activity database. The org-centric spine.
--
-- This replaces the flat `camps` table from parent-coach-playbook. Where that
-- model put org, program, and schedule on one row, this splits them:
--   organizations  -> the entity a parent decides to trust
--   programs       -> one offering an org runs (a camp, a league, a class series)
--   sessions       -> one occurrence of a program (only when granular data exists)
--   activity_categories -> the controlled vocabulary programs map onto
--
-- Field names follow the Field & Forge Entity Dictionary (entities 19-22):
-- confidence_score and last_verified_at are the canonical quality/recency fields.
-- Platform-operational fields from OS chapter 07-02 / 07-05 (record_source,
-- record_status, is_claimed) are layered on top.
--
-- D1 is SQLite: TEXT for ids/dates/times (ISO 8601), INTEGER 0/1 for booleans,
-- REAL for lat/lng and price. JSON is stored as TEXT and parsed in the read layer.

-- =====================================================================
-- organizations  (Entity 19: Activity Organization)
-- =====================================================================
CREATE TABLE organizations (
  id            TEXT PRIMARY KEY,            -- UUID, never changes
  slug          TEXT NOT NULL UNIQUE,        -- url slug for the org profile page
  name          TEXT NOT NULL,               -- display name
  aliases       TEXT,                        -- JSON array of alternate names

  organization_type TEXT NOT NULL DEFAULT 'other',
    -- 'parks_rec' | 'ymca_community_center' | 'club_league'
    -- | 'private_studio' | 'school_program' | 'other'

  -- contact / web
  website_url   TEXT,
  email         TEXT,
  phone         TEXT,
  social_urls   TEXT,                         -- JSON object {platform: url}

  -- location
  address       TEXT,
  city          TEXT,
  state         TEXT,                         -- two-letter code
  zip           TEXT,
  latitude      REAL,                         -- geocoded; required for radius search
  longitude     REAL,

  -- derived rollups (kept in sync from programs by the read/write layer)
  categories    TEXT,                         -- JSON array of activity_category slugs
  age_min       INTEGER,                      -- min across the org's programs
  age_max       INTEGER,                      -- max across the org's programs
  program_types TEXT,                         -- JSON array e.g. ["camp","league"]

  description   TEXT,                          -- max 500 chars (enforced in app)
  logo_url      TEXT,
  years_operating INTEGER,

  -- provenance + quality (OS 07-02)
  record_source TEXT NOT NULL DEFAULT 'scraped',  -- 'scraped' | 'claimed' | 'manual'
  record_status TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'inactive' | 'unverified'
  is_claimed    INTEGER NOT NULL DEFAULT 0,
  claimed_by_email TEXT,
  confidence_score INTEGER NOT NULL DEFAULT 0,      -- 0-100 record quality score

  -- crosswalk back to the old flat model (nullable; only set on migrated rows)
  legacy_source_domain TEXT,

  created_at        TEXT NOT NULL,
  last_verified_at  TEXT,
  updated_at        TEXT NOT NULL
);

CREATE INDEX idx_org_state          ON organizations(state);
CREATE INDEX idx_org_city           ON organizations(city);
CREATE INDEX idx_org_type           ON organizations(organization_type);
CREATE INDEX idx_org_claimed        ON organizations(is_claimed);
CREATE INDEX idx_org_status         ON organizations(record_status);
CREATE INDEX idx_org_confidence     ON organizations(confidence_score);
CREATE INDEX idx_org_geo            ON organizations(latitude, longitude);

-- =====================================================================
-- activity_categories  (Entity 22: controlled vocabulary)
-- =====================================================================
CREATE TABLE activity_categories (
  id                 TEXT PRIMARY KEY,
  slug               TEXT NOT NULL UNIQUE,    -- canonical category key (e.g. 'soccer')
  name               TEXT NOT NULL,           -- display label
  parent_category_id TEXT,                    -- self-ref for hierarchy (e.g. soccer -> sports)
  description        TEXT,
  FOREIGN KEY (parent_category_id) REFERENCES activity_categories(id)
);

-- =====================================================================
-- programs  (Entity 20)
-- =====================================================================
CREATE TABLE programs (
  id              TEXT PRIMARY KEY,           -- UUID
  organization_id TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,       -- url slug for program detail page
  name            TEXT NOT NULL,              -- "Youth Soccer - Spring League"

  program_type    TEXT NOT NULL DEFAULT 'camp',   -- 'camp' | 'league' | 'class' | 'clinic'
  activity_category TEXT NOT NULL DEFAULT 'other', -- slug into activity_categories
  categories      TEXT,                        -- JSON array of secondary category slugs
  description     TEXT,                        -- max 300 chars (enforced in app)

  -- audience
  age_min         INTEGER,
  age_max         INTEGER,
  grade_min       INTEGER,
  grade_max       INTEGER,
  skill_level     TEXT DEFAULT 'all',          -- 'all' | 'beginner' | 'intermediate' | 'advanced'

  -- schedule (coarse; per-meeting detail lives in sessions when available)
  season              TEXT,                    -- e.g. 'Summer 2026'
  session_start_date  TEXT,                    -- ISO date
  session_end_date    TEXT,
  days_of_week        TEXT,                    -- JSON array ["Monday","Wednesday"]
  start_time          TEXT,                    -- HH:MM
  end_time            TEXT,
  location_notes      TEXT,                    -- if different from org address

  -- pricing (price not required: many orgs do not publish it)
  price       REAL,
  price_type  TEXT,                            -- 'per_session'|'per_month'|'per_season'|'per_year'|'free'
  price_text  TEXT,                            -- raw price string as scraped (preserved)

  -- registration / availability
  registration_url     TEXT,
  registration_open    INTEGER NOT NULL DEFAULT 1,
  registration_deadline TEXT,
  availability_status  TEXT NOT NULL DEFAULT 'unknown', -- 'open'|'waitlist'|'full'|'unknown'

  -- camp-specific extras carried forward from the flat model (nullable)
  day_or_overnight    TEXT,                    -- 'day' | 'overnight'
  lunch_included      INTEGER,
  aftercare_available INTEGER,
  schedule_text       TEXT,                    -- league free-form schedule

  -- media
  hero_photo_key      TEXT,                    -- R2 object key

  -- provenance + quality
  record_source   TEXT NOT NULL DEFAULT 'scraped',  -- 'scraped' | 'claimed' | 'manual'
  record_status   TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'inactive' | 'upcoming'
  confidence_score INTEGER NOT NULL DEFAULT 0,
  source_domain   TEXT,
  url_health_status TEXT,                        -- carried forward from camps quality framework

  -- crosswalk to the old flat model
  legacy_camp_id  TEXT,                          -- old camps.id
  legacy_slug     TEXT,                          -- old camps.slug (preserve inbound links)

  created_at        TEXT NOT NULL,
  last_verified_at  TEXT,
  updated_at        TEXT NOT NULL,

  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_prog_org        ON programs(organization_id);
CREATE INDEX idx_prog_type       ON programs(program_type);
CREATE INDEX idx_prog_category   ON programs(activity_category);
CREATE INDEX idx_prog_status     ON programs(record_status);
CREATE INDEX idx_prog_ages       ON programs(age_min, age_max);
CREATE INDEX idx_prog_dates      ON programs(session_start_date, session_end_date);
CREATE INDEX idx_prog_legacy     ON programs(legacy_camp_id);

-- =====================================================================
-- sessions  (Entity 21)  -- one occurrence of a program
-- Created only when granular per-meeting data is available. Migrated camp
-- rows do NOT fabricate sessions: their coarse date range lives on the program.
-- =====================================================================
CREATE TABLE sessions (
  id              TEXT PRIMARY KEY,
  program_id      TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  name            TEXT,
  session_date    TEXT,                         -- ISO date
  start_date      TEXT,                         -- range support for multi-day occurrences
  end_date        TEXT,
  start_time      TEXT,
  end_time        TEXT,
  location        TEXT,                         -- override if different from program default
  age_min         INTEGER,
  age_max         INTEGER,
  price           REAL,
  registration_deadline TEXT,
  registration_status   TEXT,                   -- 'open'|'waitlist'|'full'|'closed'
  registration_url      TEXT,
  status          TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled'|'cancelled'|'completed'
  cancellation_reason TEXT,
  confidence_score INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL,
  last_verified_at  TEXT,
  FOREIGN KEY (program_id)      REFERENCES programs(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_sess_program ON sessions(program_id);
CREATE INDEX idx_sess_org     ON sessions(organization_id);
CREATE INDEX idx_sess_date    ON sessions(session_date);
CREATE INDEX idx_sess_status  ON sessions(status);
