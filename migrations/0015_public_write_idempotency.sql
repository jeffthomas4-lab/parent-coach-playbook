-- Generic payload-bound idempotency for directory public writes.
-- Intentionally unapplied. This belongs to the directory DB lineage (`DB`),
-- never PCD_OPS_DB. Remote application requires backup/restore evidence and
-- separate migration/deployment approval.
CREATE TABLE IF NOT EXISTS public_write_idempotency (
  route_scope TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  response_status INTEGER NOT NULL CHECK (response_status BETWEEN 200 AND 299),
  response_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  PRIMARY KEY (route_scope, key_hash)
);

CREATE INDEX IF NOT EXISTS idx_public_write_idempotency_expiry
  ON public_write_idempotency(expires_at);
