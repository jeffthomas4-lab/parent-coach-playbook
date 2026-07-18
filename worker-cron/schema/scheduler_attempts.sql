-- scheduler_attempts
-- Durable attempt ledger for scheduled Forge workflows.
--
-- Written by worker-cron (parent-coach-playbook-cron) runScheduledSweep():
-- it opens a 'running' row BEFORE firing a sweep -- the durability gate,
-- "a scheduled mutation is not allowed to run unless its attempt can first
-- be recorded durably" -- then finalizes the row to 'succeeded' or 'failed'.
--
-- Read by src/lib/operations-status.ts (Scheduler execution freshness),
-- which selects the latest attempt per (venture, workflow_id).
--
-- Lives in the forge-command D1 (FORGE_DB). Operational metadata only,
-- no personal or family data. Safe to create empty; the flag stays honest.
--
-- Root cause it resolves: this table does not exist in production, so the
-- cron's opening INSERT throws every run, the sweep never fires, and both
-- "Scheduler execution freshness" (UNKNOWN) and "Directory URL freshness"
-- (stale since 2026-05-09) are stuck as a result.

CREATE TABLE IF NOT EXISTS scheduler_attempts (
  attempt_id    TEXT PRIMARY KEY,
  venture       TEXT NOT NULL,
  workflow_id   TEXT NOT NULL,
  trigger_type  TEXT NOT NULL,
  scheduled_at  TEXT NOT NULL,
  started_at    TEXT NOT NULL,
  status        TEXT NOT NULL CHECK (status IN ('running','succeeded','failed')),
  finished_at   TEXT,
  result_code   TEXT,
  metrics_json  TEXT,
  updated_at    TEXT
);

CREATE INDEX IF NOT EXISTS idx_scheduler_attempts_lookup
  ON scheduler_attempts (venture, workflow_id, started_at DESC);
