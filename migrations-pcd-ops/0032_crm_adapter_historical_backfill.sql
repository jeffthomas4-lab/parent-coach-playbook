-- PLAT-009 owner-directed historical CRM projection control.
-- This schema does not enable the producer or move any data. Runtime requires
-- both PCD_CRM_ADAPTER_ENABLED=true and PCD_CRM_BACKFILL_ENABLED=true plus the
-- existing immutable activation boundary.

CREATE TABLE IF NOT EXISTS crm_adapter_backfill_runs (
  id TEXT PRIMARY KEY,
  producer_workspace_id TEXT NOT NULL,
  target_workspace_id TEXT NOT NULL,
  snapshot_before_ms INTEGER NOT NULL CHECK(snapshot_before_ms > 0),
  expected_organization_rows INTEGER NOT NULL CHECK(expected_organization_rows >= 0),
  expected_contact_rows INTEGER NOT NULL CHECK(expected_contact_rows >= 0),
  status TEXT NOT NULL DEFAULT 'running' CHECK(status IN ('running','scanned','completed')),
  organization_cursor_id TEXT NOT NULL DEFAULT '',
  contact_cursor_id TEXT NOT NULL DEFAULT '',
  organization_complete INTEGER NOT NULL DEFAULT 0 CHECK(organization_complete IN (0,1)),
  contact_complete INTEGER NOT NULL DEFAULT 0 CHECK(contact_complete IN (0,1)),
  lease_id TEXT,
  lease_expires_at INTEGER,
  started_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  scanned_at INTEGER,
  completed_at INTEGER,
  UNIQUE(producer_workspace_id,target_workspace_id)
);

ALTER TABLE crm_adapter_outbox ADD COLUMN backfill_run_id TEXT
  REFERENCES crm_adapter_backfill_runs(id);

CREATE INDEX IF NOT EXISTS idx_crm_adapter_outbox_backfill
  ON crm_adapter_outbox(backfill_run_id,status,source_sequence);

CREATE TABLE IF NOT EXISTS crm_adapter_backfill_chunks (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES crm_adapter_backfill_runs(id),
  subject_type TEXT NOT NULL CHECK(subject_type IN ('organization','contact')),
  chunk_ordinal INTEGER NOT NULL CHECK(chunk_ordinal > 0),
  after_cursor_id TEXT NOT NULL,
  last_cursor_id TEXT NOT NULL,
  rows_seen INTEGER NOT NULL CHECK(rows_seen BETWEEN 1 AND 50),
  eligible_count INTEGER NOT NULL CHECK(eligible_count BETWEEN 0 AND rows_seen),
  new_event_count INTEGER NOT NULL CHECK(new_event_count BETWEEN 0 AND eligible_count),
  replayed_event_count INTEGER NOT NULL CHECK(replayed_event_count BETWEEN 0 AND eligible_count),
  rejected_count INTEGER NOT NULL CHECK(rejected_count BETWEEN 0 AND rows_seen),
  disposition_hash TEXT NOT NULL CHECK(
    length(disposition_hash)=64 AND disposition_hash=lower(disposition_hash)
    AND disposition_hash NOT GLOB '*[^0-9a-f]*'
  ),
  created_at INTEGER NOT NULL,
  UNIQUE(run_id,subject_type,chunk_ordinal),
  CHECK(eligible_count + rejected_count = rows_seen),
  CHECK(new_event_count + replayed_event_count = eligible_count)
);

CREATE INDEX IF NOT EXISTS idx_crm_adapter_backfill_chunks_run
  ON crm_adapter_backfill_chunks(run_id,subject_type,chunk_ordinal);
