-- Migration: 0019_camp_field_audit
--
-- Supports the nightly camp field auditor (scheduled task
-- pcd-camp-field-auditor). The scraped directory carries field-level damage
-- that no existing agent looks at: dangling separator fragments left in names
-- ("... - San Antonio -  (July 27-30, 2026)"), raw HTML entities that were
-- never decoded (&amp;, &#8211;, &nbsp;), scraped page furniture captured as a
-- camp name ("REGISTER HERE FOR ALL FOUR WEEKS Week Three: Camping Spree with
-- Mr"), source-side misspellings ("afternon", "enviroment"), and
-- activity_category drift where the same Nike soccer camp is filed
-- 'camp_sports' on one row and 'soccer' on the next.
--
-- The auditor sweeps a fixed number of approved programs per night,
-- oldest-unchecked-first, repairs what it is confident about, and stamps these
-- columns so a row is never re-examined until the rule set changes.
--
--   data_audit_checked_at  ISO timestamp of the last completed audit pass.
--                          NULL = never audited; this is the work queue.
--   data_audit_status      'clean'       nothing wrong, no edit made
--                          'fixed'       one or more fields repaired
--                          'needs_human' a defect the agent would not fix
--                                        itself (see notes); surfaces in the
--                                        nightly review file
--   data_audit_notes       short human-readable summary of what was found or
--                          changed on this row. Not a full diff; the diff
--                          lives in field_audit_log.
--   data_audit_version     integer rule-set version that audited this row.
--                          Bumping the auditor's RULESET_VERSION makes every
--                          row eligible again without clearing timestamps, so
--                          the directory can be re-swept when the rules get
--                          smarter. Rows audited under the first rule set are
--                          version 1.
--
-- field_audit_log is the rollback record. The auditor writes to live D1 with
-- no PR gate, so every single field write it makes is captured here with the
-- prior value. That makes any bad edit revertable with a single UPDATE, and
-- makes a run of bad edits reviewable as a batch by run_id.
--
-- Forward-only, additive only. Never destructive.
--
-- Apply to remote:
--   npx wrangler d1 execute activity-radar --file=./migrations/0019_camp_field_audit.sql --remote

ALTER TABLE programs ADD COLUMN data_audit_checked_at TEXT;
ALTER TABLE programs ADD COLUMN data_audit_status TEXT;
ALTER TABLE programs ADD COLUMN data_audit_notes TEXT;
ALTER TABLE programs ADD COLUMN data_audit_version INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS field_audit_log (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id        TEXT NOT NULL,          -- one id per nightly run, for batch revert
  program_id    TEXT NOT NULL,
  field_name    TEXT NOT NULL,          -- column that was changed
  old_value     TEXT,                   -- value before the write; the rollback value
  new_value     TEXT,                   -- value after the write
  rule          TEXT NOT NULL,          -- which detection rule fired
  confidence    TEXT NOT NULL,          -- 'high' | 'medium' | 'low'
  reverted_at   TEXT,                   -- set by hand if an edit is rolled back
  created_at    TEXT NOT NULL,
  FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE INDEX IF NOT EXISTS idx_field_audit_log_run    ON field_audit_log(run_id);
CREATE INDEX IF NOT EXISTS idx_field_audit_log_program ON field_audit_log(program_id);

-- The nightly work queue: unchecked or stale-ruleset approved programs first.
CREATE INDEX IF NOT EXISTS idx_programs_audit_queue
  ON programs(pcd_status, data_audit_version, data_audit_checked_at);
