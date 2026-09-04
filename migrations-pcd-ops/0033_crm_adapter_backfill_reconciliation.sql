-- PLAT-009 full-run reconciliation coverage.
-- A pair of green tail samples cannot prove a historical run. These columns and
-- bounded window receipts make both full passes durable and resumable.

ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_pass INTEGER NOT NULL DEFAULT 1
  CHECK(reconciliation_pass IN (1,2));
ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_cursor_sequence INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_cursor_sequence >= 0);
ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_window_ordinal INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_window_ordinal >= 0);
ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_complete INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_complete IN (0,1));

CREATE TABLE IF NOT EXISTS crm_adapter_backfill_reconciliation_windows (
  run_id TEXT NOT NULL REFERENCES crm_adapter_backfill_runs(id),
  pass_number INTEGER NOT NULL CHECK(pass_number IN (1,2)),
  window_ordinal INTEGER NOT NULL CHECK(window_ordinal > 0),
  after_sequence INTEGER NOT NULL CHECK(after_sequence >= 0),
  first_sequence INTEGER NOT NULL CHECK(first_sequence > 0),
  last_sequence INTEGER NOT NULL CHECK(last_sequence >= first_sequence),
  manifest_count INTEGER NOT NULL CHECK(manifest_count BETWEEN 1 AND 100),
  declared_high_water INTEGER NOT NULL CHECK(declared_high_water >= last_sequence),
  receiver_high_water INTEGER NOT NULL CHECK(receiver_high_water >= 0),
  missing_count INTEGER NOT NULL CHECK(missing_count BETWEEN 0 AND 100),
  duplicate_count INTEGER NOT NULL CHECK(duplicate_count BETWEEN 0 AND 100),
  stale_count INTEGER NOT NULL CHECK(stale_count BETWEEN 0 AND 100),
  unauthorized_count INTEGER NOT NULL CHECK(unauthorized_count BETWEEN 0 AND 100),
  mismatch_count INTEGER NOT NULL CHECK(mismatch_count BETWEEN 0 AND 100),
  manifest_hash TEXT NOT NULL CHECK(
    length(manifest_hash)=64 AND manifest_hash=lower(manifest_hash)
    AND manifest_hash NOT GLOB '*[^0-9a-f]*'
  ),
  result_hash TEXT NOT NULL CHECK(
    length(result_hash)=64 AND result_hash=lower(result_hash)
    AND result_hash NOT GLOB '*[^0-9a-f]*'
  ),
  checked_at INTEGER NOT NULL,
  PRIMARY KEY(run_id,pass_number,window_ordinal),
  UNIQUE(run_id,pass_number,first_sequence),
  CHECK(last_sequence > after_sequence)
);

CREATE INDEX IF NOT EXISTS idx_crm_adapter_backfill_reconciliation_coverage
  ON crm_adapter_backfill_reconciliation_windows(run_id,pass_number,last_sequence);
