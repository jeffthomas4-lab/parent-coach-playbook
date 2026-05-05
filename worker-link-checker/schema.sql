-- Link health table. Lives in the same D1 database as camps.
-- Run once: `wrangler d1 execute parent-coach-playbook --file=schema.sql`

CREATE TABLE IF NOT EXISTS link_health (
  url TEXT PRIMARY KEY,
  source_files TEXT,                  -- JSON array of files where this URL appears
  last_checked TEXT,                  -- ISO datetime, NULL = never checked
  last_status_code INTEGER,           -- HTTP status code from last check
  final_url TEXT,                     -- After following redirects
  is_broken INTEGER NOT NULL DEFAULT 0,
  is_redirect INTEGER NOT NULL DEFAULT 0,
  redirected_off_host INTEGER NOT NULL DEFAULT 0,  -- 1 if redirected to a different host
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  last_broken_at TEXT,
  last_ok_at TEXT,
  wayback_snapshot TEXT,              -- Most-recent Internet Archive snapshot URL
  suggested_search TEXT,              -- google.com/search?q=... query string for human to click
  notes TEXT,                         -- Free text notes from the worker
  first_seen TEXT NOT NULL            -- When the URL first appeared in the manifest
);

CREATE INDEX IF NOT EXISTS idx_link_last_checked ON link_health(last_checked);
CREATE INDEX IF NOT EXISTS idx_link_is_broken    ON link_health(is_broken);

-- The schedule of checks per run is determined by sorting links by:
--   broken first (re-check broken links every cycle to confirm)
--   then by last_checked ascending (oldest first)
--   then NULLs first (never-checked)
