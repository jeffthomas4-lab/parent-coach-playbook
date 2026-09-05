-- Bound historical reconciliation failures. Canonical contact safety changes
-- are never blocked by delivery state; a leased observation is followed by the
-- PII-free tombstone atomically queued with the authoritative mutation.

ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_failure_count INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_failure_count BETWEEN 0 AND 8);
ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_next_attempt_at INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_next_attempt_at >= 0);
ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_halted INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_halted IN (0,1));
