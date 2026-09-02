-- PLAT-009 Packet 6: durable, provider-disabled CRM producer outbox.
-- Lives in PCD_OPS_DB because it includes private contact projection state.
-- No service binding, secret, remote migration or feature flag is activated by
-- this additive local schema.

CREATE TABLE IF NOT EXISTS crm_adapter_controls (
  producer_workspace_id TEXT PRIMARY KEY,
  next_sequence INTEGER NOT NULL DEFAULT 1 CHECK(next_sequence > 0),
  organization_cursor_at TEXT NOT NULL DEFAULT '',
  organization_cursor_id TEXT NOT NULL DEFAULT '',
  contact_cursor_at TEXT NOT NULL DEFAULT '',
  contact_cursor_id TEXT NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_adapter_outbox (
  id TEXT PRIMARY KEY,
  producer_workspace_id TEXT NOT NULL,
  event_id TEXT NOT NULL UNIQUE,
  source_sequence INTEGER NOT NULL CHECK(source_sequence > 0),
  event_type TEXT NOT NULL CHECK(event_type IN (
    'organization.upserted.v1',
    'organization.deleted.v1',
    'contact.observed.v1',
    'contact.deleted.v1'
  )),
  subject_type TEXT NOT NULL CHECK(subject_type IN ('organization','contact')),
  subject_id TEXT NOT NULL,
  authority_updated_at INTEGER NOT NULL,
  payload_json TEXT NOT NULL CHECK(json_valid(payload_json)),
  payload_hash TEXT NOT NULL CHECK(
    length(payload_hash)=64 AND payload_hash=lower(payload_hash)
    AND payload_hash NOT GLOB '*[^0-9a-f]*'
  ),
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','leased','retry','delivered','dead')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count BETWEEN 0 AND 8),
  next_attempt_at INTEGER NOT NULL,
  lease_id TEXT,
  lease_expires_at INTEGER,
  receiver_receipt_id TEXT,
  receiver_status INTEGER,
  last_error_code TEXT,
  delivered_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(producer_workspace_id,source_sequence)
);
CREATE INDEX IF NOT EXISTS idx_crm_adapter_outbox_due
  ON crm_adapter_outbox(status,next_attempt_at,source_sequence)
  WHERE status IN ('pending','retry','leased');
CREATE INDEX IF NOT EXISTS idx_crm_adapter_outbox_subject
  ON crm_adapter_outbox(subject_type,subject_id,source_sequence DESC);

CREATE TABLE IF NOT EXISTS crm_adapter_projection_receipts (
  subject_type TEXT NOT NULL CHECK(subject_type IN ('organization','contact')),
  subject_id TEXT NOT NULL,
  content_hash TEXT NOT NULL CHECK(length(content_hash)=64),
  last_event_id TEXT NOT NULL REFERENCES crm_adapter_outbox(event_id),
  last_sequence INTEGER NOT NULL CHECK(last_sequence > 0),
  authority_updated_at INTEGER NOT NULL,
  projected_at INTEGER NOT NULL,
  PRIMARY KEY(subject_type,subject_id)
);

CREATE TABLE IF NOT EXISTS crm_adapter_reconciliation_receipts (
  id TEXT PRIMARY KEY,
  producer_workspace_id TEXT NOT NULL,
  declared_high_water INTEGER NOT NULL CHECK(declared_high_water >= 0),
  receiver_high_water INTEGER NOT NULL CHECK(receiver_high_water >= 0),
  manifest_count INTEGER NOT NULL CHECK(manifest_count BETWEEN 0 AND 100),
  missing_count INTEGER NOT NULL CHECK(missing_count BETWEEN 0 AND 100),
  duplicate_count INTEGER NOT NULL CHECK(duplicate_count BETWEEN 0 AND 100),
  stale_count INTEGER NOT NULL CHECK(stale_count BETWEEN 0 AND 100),
  unauthorized_count INTEGER NOT NULL CHECK(unauthorized_count BETWEEN 0 AND 100),
  mismatch_count INTEGER NOT NULL CHECK(mismatch_count BETWEEN 0 AND 100),
  result_hash TEXT NOT NULL CHECK(length(result_hash)=64),
  checked_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_crm_adapter_reconciliation_time
  ON crm_adapter_reconciliation_receipts(producer_workspace_id,checked_at DESC);
