-- Migration 0013: versioned privacy-bounded demand events.
--
-- Additive only. Do not apply remotely without the separately approved data
-- contract, retention period, disclosure, legacy-row disposition, exact D1
-- target, backup/restore evidence, and migration approval. Collection remains
-- default-off in Worker configuration.

CREATE TABLE IF NOT EXISTS demand_events_v1 (
  event_id TEXT PRIMARY KEY,
  schema_version INTEGER NOT NULL DEFAULT 1 CHECK (schema_version = 1),
  event_type TEXT NOT NULL CHECK (event_type IN ('search', 'filter')),
  query TEXT NOT NULL CHECK (length(query) BETWEEN 1 AND 120),
  query_redacted INTEGER NOT NULL CHECK (query_redacted IN (0, 1)),
  result_band TEXT NOT NULL CHECK (result_band IN ('zero', 'one_to_five', 'six_to_twenty', 'twenty_one_plus', 'unknown')),
  surface TEXT NOT NULL CHECK (surface IN ('site_search', 'camp_directory')),
  collection TEXT CHECK (collection IS NULL OR length(collection) BETWEEN 1 AND 50),
  sport TEXT CHECK (sport IS NULL OR length(sport) BETWEEN 1 AND 50),
  age_band TEXT CHECK (age_band IS NULL OR length(age_band) BETWEEN 1 AND 30),
  geography TEXT CHECK (geography IS NULL OR length(geography) BETWEEN 1 AND 50),
  bot_class TEXT NOT NULL CHECK (bot_class IN ('human_likely', 'bot_likely', 'unknown')),
  sampled INTEGER NOT NULL DEFAULT 1 CHECK (sampled IN (0, 1)),
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL CHECK (expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_demand_events_v1_expiry
  ON demand_events_v1(expires_at);
CREATE INDEX IF NOT EXISTS idx_demand_events_v1_window
  ON demand_events_v1(created_at, bot_class, sampled);
CREATE INDEX IF NOT EXISTS idx_demand_events_v1_cohort
  ON demand_events_v1(query, event_type, result_band, surface, sport, age_band, geography, created_at);
