-- Migration: 0017_domain_skip_list
--
-- Admin-maintained list of source domains to stop accepting submissions from.
-- Populated from /admin/source-quality (per-domain "Add to skip-list" button,
-- next to every domain whose approval rate is flagged rust/low). Removing a
-- row (the "Unskip" action) is a plain DELETE, no soft-delete flag needed.
--
-- Enforced server-side at POST /api/camps/submit: a submission whose
-- source_domain matches a row here is rejected outright with HTTP 422 before
-- any organization/program row is written. Both the CSV bulk importer
-- (scripts/import-camps-csv.mjs) and the Claude-in-Chrome search workflow post
-- through that same endpoint, so this one table + one check point covers both.
--
-- Forward-only, single new table. Never destructive.
--
-- Apply to remote:
--   npx wrangler d1 execute activity-radar --file=./migrations/0017_domain_skip_list.sql --remote

CREATE TABLE IF NOT EXISTS domain_skip_list (
  domain     TEXT PRIMARY KEY,
  reason     TEXT,
  added_by   TEXT,
  added_at   TEXT DEFAULT (datetime('now'))
);
