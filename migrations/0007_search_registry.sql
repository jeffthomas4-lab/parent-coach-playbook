-- 0007_search_registry.sql
--
-- Moves the camp-search domain registry from CAMP-SEARCH-LOG.md (markdown table)
-- to a proper D1 table. Markdown becomes a generated artifact for human reading;
-- D1 is the source of truth. Reduces token cost for the Claude in Chrome flow at
-- scale because the LLM hits an API that returns ranked, anchor-scoped JSON
-- instead of parsing 200+ lines of markdown.
--
-- Apply with:
--   npx wrangler d1 execute parent-coach-playbook --file=./migrations/0007_search_registry.sql --remote

CREATE TABLE IF NOT EXISTS search_domains (
  -- Identity
  domain TEXT PRIMARY KEY,
  organization TEXT,

  -- Geographic scope. Comma-separated list of anchor slugs (e.g. "tacoma-25mi").
  -- Multi-anchor entries (YMCA, Skyhawks, etc.) list all anchors they cover.
  area_covered TEXT NOT NULL,

  -- Last touch + outcome
  last_checked TEXT,                         -- ISO date YYYY-MM-DD
  result TEXT NOT NULL DEFAULT 'unknown'
    CHECK (result IN (
      'unknown',
      'camps_extracted',
      'partial',
      'blocked',
      'stale_listings',
      'no_camps'
    )),
  camps_pulled INTEGER NOT NULL DEFAULT 0,
  next_recheck_after TEXT,                   -- ISO date

  -- Notes (full version, may be long). The slim LLM-facing version truncates.
  notes TEXT,

  -- Permanent skip flag. Bypasses normal recheck logic.
  permanent_skip INTEGER NOT NULL DEFAULT 0 CHECK (permanent_skip IN (0, 1)),

  -- Bookkeeping
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_domains_recheck
  ON search_domains(next_recheck_after);
CREATE INDEX IF NOT EXISTS idx_search_domains_result
  ON search_domains(result);
CREATE INDEX IF NOT EXISTS idx_search_domains_skip
  ON search_domains(permanent_skip);

-- Anchor cities. One row per geographic search area.
CREATE TABLE IF NOT EXISTS search_anchors (
  slug TEXT PRIMARY KEY,                     -- e.g. "tacoma-25mi"
  city TEXT NOT NULL,                        -- e.g. "Tacoma, WA"
  radius_miles INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'saturated', 'diminishing', 'paused')),
  last_batch_at TEXT,                        -- ISO date
  next_batch_after TEXT,                     -- ISO date
  notes TEXT,
  ring INTEGER NOT NULL DEFAULT 1,           -- expansion ring (1 = Puget Sound core)
  position INTEGER NOT NULL DEFAULT 0,       -- ordering within ring
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_anchors_status ON search_anchors(status);

-- Batch history. One row per import batch run.
CREATE TABLE IF NOT EXISTS search_batches (
  id TEXT PRIMARY KEY,
  batch_date TEXT NOT NULL,                  -- ISO date
  anchor_slug TEXT NOT NULL REFERENCES search_anchors(slug),
  source_file TEXT,                          -- path to the CSV imported
  rows_imported INTEGER NOT NULL DEFAULT 0,
  rows_rejected INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_search_batches_anchor ON search_batches(anchor_slug);
CREATE INDEX IF NOT EXISTS idx_search_batches_date  ON search_batches(batch_date);
