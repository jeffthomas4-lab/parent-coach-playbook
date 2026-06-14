-- Migration 0010: search event logging
--
-- Captures every search query fired on /search, with result count and
-- optional filter context (collection, sport, age). No PII: no user ID,
-- no email, no session token. Used to understand what parents and coaches
-- are looking for and to prioritise content production.

CREATE TABLE IF NOT EXISTS search_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT NOT NULL,
  result_count INTEGER,
  collection TEXT,
  sport TEXT,
  age TEXT,
  referrer TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_events_query ON search_events(query);
CREATE INDEX IF NOT EXISTS idx_search_events_created_at ON search_events(created_at);
CREATE INDEX IF NOT EXISTS idx_search_events_collection ON search_events(collection);
