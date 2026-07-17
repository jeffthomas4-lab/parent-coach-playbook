-- Default-inert account deletion and data-subject request control plane.
-- Records work and evidence only; no trigger, schedule, provider call, or deletion executor.
CREATE TABLE IF NOT EXISTS privacy_requests (
  id TEXT PRIMARY KEY, idempotency_key TEXT NOT NULL UNIQUE,
  request_fingerprint TEXT NOT NULL CHECK(length(request_fingerprint)=64),
  request_type TEXT NOT NULL CHECK(request_type IN ('access','export','correction','deletion','restriction','objection','review')),
  jurisdiction_code TEXT, subject_ref TEXT NOT NULL, tenant_ref TEXT,
  ownership_scope TEXT NOT NULL CHECK(ownership_scope IN ('self','authorized_tenant_record','disputed')),
  identity_state TEXT NOT NULL DEFAULT 'pending' CHECK(identity_state IN ('pending','verified','failed','escalated')),
  status TEXT NOT NULL DEFAULT 'received' CHECK(status IN ('received','identity_pending','verified','deactivated','recovery_window','executing','blocked','completed','denied','cancelled')),
  received_at TEXT NOT NULL, statutory_due_at TEXT, internal_target_at TEXT,
  extension_until TEXT, extension_reason_code TEXT, exception_code TEXT,
  assigned_owner TEXT, cascade_version TEXT, recovery_until TEXT,
  deactivated_at TEXT, sessions_revoked_at TEXT, completed_at TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  CHECK(status <> 'completed' OR completed_at IS NOT NULL),
  CHECK(status NOT IN ('deactivated','recovery_window','executing','blocked','completed') OR deactivated_at IS NOT NULL),
  CHECK(status NOT IN ('deactivated','recovery_window','executing','blocked','completed') OR sessions_revoked_at IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_privacy_requests_status_due ON privacy_requests(status,statutory_due_at,received_at);

CREATE TABLE IF NOT EXISTS privacy_request_events (
  id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES privacy_requests(id),
  event_type TEXT NOT NULL, actor_type TEXT NOT NULL CHECK(actor_type IN ('requester','staff','service','agent','provider')),
  actor_ref TEXT NOT NULL, from_status TEXT, to_status TEXT, reason_code TEXT, evidence_ref TEXT, created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS privacy_cascade_items (
  id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES privacy_requests(id),
  system_code TEXT NOT NULL, record_class TEXT NOT NULL, authority_code TEXT NOT NULL,
  subject_ref TEXT NOT NULL, tenant_ref TEXT,
  disposition TEXT NOT NULL CHECK(disposition IN ('delete','anonymize','retain','detach','review')),
  legal_basis_code TEXT, retention_until TEXT,
  hold_state TEXT NOT NULL DEFAULT 'clear' CHECK(hold_state IN ('clear','held','review')),
  propagation_target TEXT,
  state TEXT NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','in_progress','retry_wait','dead_letter','verified','excepted')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK(attempt_count BETWEEN 0 AND 20),
  checkpoint TEXT, last_error_code TEXT, next_attempt_at TEXT,
  verification_method TEXT NOT NULL, verification_ref TEXT, verified_at TEXT,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  UNIQUE(request_id,system_code,record_class,subject_ref,tenant_ref),
  CHECK(state <> 'verified' OR (verified_at IS NOT NULL AND verification_ref IS NOT NULL)),
  CHECK(disposition <> 'retain' OR legal_basis_code IS NOT NULL),
  CHECK(hold_state <> 'held' OR disposition IN ('retain','review'))
);
CREATE INDEX IF NOT EXISTS idx_privacy_cascade_work ON privacy_cascade_items(state,next_attempt_at,request_id);

CREATE TABLE IF NOT EXISTS privacy_legal_holds (
  id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES privacy_requests(id),
  scope_code TEXT NOT NULL, reason_ref TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active','released')),
  issued_by TEXT NOT NULL, issued_at TEXT NOT NULL, released_by TEXT, released_at TEXT,
  review_at TEXT NOT NULL,
  CHECK(status <> 'released' OR (released_by IS NOT NULL AND released_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS privacy_exception_approvals (
  id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES privacy_requests(id),
  cascade_item_id TEXT REFERENCES privacy_cascade_items(id), exception_code TEXT NOT NULL,
  proposed_by TEXT NOT NULL, proposed_actor_type TEXT NOT NULL CHECK(proposed_actor_type IN ('staff','service','agent')),
  first_approved_by TEXT, first_approved_at TEXT, second_approved_by TEXT, second_approved_at TEXT,
  status TEXT NOT NULL DEFAULT 'proposed' CHECK(status IN ('proposed','first_approved','approved','rejected','expired')),
  expires_at TEXT NOT NULL, created_at TEXT NOT NULL,
  CHECK(first_approved_by IS NULL OR first_approved_by <> proposed_by),
  CHECK(second_approved_by IS NULL OR second_approved_by NOT IN (proposed_by,first_approved_by)),
  CHECK(status <> 'approved' OR (first_approved_by IS NOT NULL AND second_approved_by IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS privacy_provider_receipts (
  id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES privacy_requests(id),
  cascade_item_id TEXT NOT NULL REFERENCES privacy_cascade_items(id), provider_code TEXT NOT NULL,
  operation TEXT NOT NULL CHECK(operation IN ('export','delete','anonymize','detach','retain_confirmed')),
  state TEXT NOT NULL CHECK(state IN ('accepted','confirmed','rejected','timeout','ambiguous')),
  provider_reference TEXT, payload_hash TEXT NOT NULL CHECK(length(payload_hash)=64), observed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS privacy_completion_receipts (
  id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE REFERENCES privacy_requests(id),
  cascade_version TEXT NOT NULL, disposition_summary_json TEXT NOT NULL CHECK(json_valid(disposition_summary_json)),
  exception_refs_json TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(exception_refs_json)),
  verified_by TEXT NOT NULL, verified_at TEXT NOT NULL,
  receipt_hash TEXT NOT NULL UNIQUE CHECK(length(receipt_hash)=64)
);
