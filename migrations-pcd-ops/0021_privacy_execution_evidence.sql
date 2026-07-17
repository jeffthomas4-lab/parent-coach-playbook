-- Durable, idempotent privacy execution and export evidence.
CREATE TABLE privacy_cascade_execution_attempts (
  id TEXT PRIMARY KEY,
  cascade_item_id TEXT NOT NULL REFERENCES privacy_cascade_items(id),
  request_id TEXT NOT NULL REFERENCES privacy_requests(id),
  executor_ref TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('claimed','verified','retry_wait','dead_letter','blocked')),
  claimed_at TEXT NOT NULL,
  settled_at TEXT,
  provider_code TEXT,
  provider_reference TEXT,
  verification_reference TEXT,
  error_code TEXT,
  checkpoint TEXT,
  UNIQUE(cascade_item_id, idempotency_key),
  CHECK(status = 'claimed' OR settled_at IS NOT NULL),
  CHECK(status <> 'verified' OR verification_reference IS NOT NULL)
);

CREATE INDEX idx_privacy_execution_attempts_work
  ON privacy_cascade_execution_attempts(status, claimed_at);

CREATE TABLE privacy_export_artifacts (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES privacy_requests(id),
  format TEXT NOT NULL CHECK(format IN ('machine_readable','human_readable')),
  version INTEGER NOT NULL CHECK(version > 0),
  storage_reference TEXT NOT NULL,
  content_sha256 TEXT NOT NULL CHECK(length(content_sha256) = 64),
  generated_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('generated','delivered','expired','revoked')),
  verified_by TEXT NOT NULL,
  verified_at TEXT NOT NULL,
  UNIQUE(request_id, format, version)
);

CREATE INDEX idx_privacy_export_artifacts_expiry
  ON privacy_export_artifacts(status, expires_at);

-- Artifacts contain no payload itself: object access is a separate, expiring,
-- approved storage concern. The database retains only integrity and lifecycle evidence.
