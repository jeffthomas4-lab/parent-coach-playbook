-- Migration: 0002_trust_and_demand
-- Trust signals (OS 07-06) and the demand-intelligence feed (OS 07-02).
--
-- In the flat camps model, trust data (is_claimed, verified) lived as columns on
-- the camp row, so it duplicated every time an org ran more than one camp. Here
-- it attaches once, to the organization.

-- =====================================================================
-- trust_signals  -- one row per signal per organization
-- =====================================================================
CREATE TABLE trust_signals (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  signal_type     TEXT NOT NULL,
    -- 'accreditation' | 'review_count' | 'average_rating'
    -- | 'years_operating' | 'claimed_status' | 'insurance_on_file' | 'verified'
  signal_value    TEXT NOT NULL,                -- value as text; numeric signals parsed in app
  signal_source   TEXT,                          -- 'google_places' | 'yelp' | 'self_reported' | 'manual'
  verified_at     TEXT,
  created_at      TEXT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_trust_org  ON trust_signals(organization_id);
CREATE INDEX idx_trust_type ON trust_signals(signal_type);

-- =====================================================================
-- accreditations  -- structured accreditation records (one per org per body)
-- =====================================================================
CREATE TABLE accreditations (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  body            TEXT NOT NULL,                 -- issuing body
  identifier      TEXT,                          -- accreditation/license number
  issued_at       TEXT,
  expires_at      TEXT,
  verified_at     TEXT,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE INDEX idx_accred_org ON accreditations(organization_id);

-- =====================================================================
-- search_events  -- one row per parent search. The demand intelligence feed.
-- Consumed by the Demand Intelligence Agent (OS 04-13).
-- =====================================================================
CREATE TABLE search_events (
  id                  TEXT PRIMARY KEY,
  created_at          TEXT NOT NULL,
  -- raw query + parsed facets
  query               TEXT,                      -- free-text query if any
  location_searched   TEXT,                      -- zip or "lat,lng"
  latitude            REAL,
  longitude           REAL,
  radius_miles        INTEGER,
  age_searched        INTEGER,
  categories_searched TEXT,                      -- JSON array of category slugs
  price_min           REAL,
  price_max           REAL,
  available_now       INTEGER,
  -- outcome
  result_count        INTEGER,
  clicked_org_ids     TEXT,                      -- JSON array of organization ids clicked
  -- which front door the search came from
  source              TEXT NOT NULL DEFAULT 'activityradar' -- 'activityradar' | 'parentcoachdesk'
);

CREATE INDEX idx_search_created  ON search_events(created_at);
CREATE INDEX idx_search_source   ON search_events(source);
CREATE INDEX idx_search_location ON search_events(latitude, longitude);
