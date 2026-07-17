-- Migration 0010: search event logging
--
-- Legacy-compatible storage for sanitized, short-retention search signals.
-- New writes intentionally leave referrer and user_agent null. A reviewed
-- follow-up migration must define schema versioning and enforce retention
-- before collection is enabled in production.

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
