-- Provider-neutral customer identity and tenancy foundation.
-- Local preparation only. This migration creates no login route, provider
-- credential, session cookie, entitlement, payment state, or live binding.

CREATE TABLE customer_users (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN ('active','suspended','deactivation_pending','deactivated')),
  primary_email_normalized TEXT,
  email_verified_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deactivated_at TEXT,
  CHECK(primary_email_normalized IS NULL OR primary_email_normalized = lower(trim(primary_email_normalized))),
  CHECK((status = 'deactivated') = (deactivated_at IS NOT NULL))
);

CREATE UNIQUE INDEX idx_customer_users_email
  ON customer_users(primary_email_normalized)
  WHERE primary_email_normalized IS NOT NULL AND status <> 'deactivated';

CREATE TABLE customer_identities (
  id TEXT PRIMARY KEY,
  customer_user_id TEXT NOT NULL REFERENCES customer_users(id),
  provider_code TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active','revoked','unlinked')),
  linked_at TEXT NOT NULL,
  revoked_at TEXT,
  last_authenticated_at TEXT,
  UNIQUE(provider_code, provider_subject),
  CHECK((status = 'active' AND revoked_at IS NULL) OR (status <> 'active' AND revoked_at IS NOT NULL))
);

CREATE INDEX idx_customer_identities_user ON customer_identities(customer_user_id, status);

CREATE TABLE customer_organizations (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','active','suspended','closed')),
  created_by_customer_user_id TEXT NOT NULL REFERENCES customer_users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  closed_at TEXT,
  CHECK((status = 'closed') = (closed_at IS NOT NULL))
);

CREATE TABLE organization_memberships (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES customer_organizations(id),
  customer_user_id TEXT NOT NULL REFERENCES customer_users(id),
  role TEXT NOT NULL CHECK(role IN ('owner','admin','editor','viewer')),
  status TEXT NOT NULL CHECK(status IN ('invited','active','suspended','revoked')),
  granted_by_customer_user_id TEXT REFERENCES customer_users(id),
  granted_at TEXT,
  revoked_at TEXT,
  version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),
  UNIQUE(organization_id, customer_user_id),
  CHECK((status = 'active' AND granted_at IS NOT NULL AND revoked_at IS NULL) OR status <> 'active'),
  CHECK(status <> 'revoked' OR revoked_at IS NOT NULL)
);

CREATE INDEX idx_organization_memberships_user
  ON organization_memberships(customer_user_id, status, organization_id);
CREATE INDEX idx_organization_memberships_org
  ON organization_memberships(organization_id, status, role);

CREATE TABLE customer_session_revocations (
  id TEXT PRIMARY KEY,
  customer_user_id TEXT NOT NULL REFERENCES customer_users(id),
  provider_code TEXT NOT NULL,
  provider_session_ref_hash TEXT,
  scope TEXT NOT NULL CHECK(scope IN ('single_session','all_user_sessions')),
  reason_code TEXT NOT NULL CHECK(reason_code IN ('logout','recovery','security','suspension','deactivation','privacy_request')),
  requested_at TEXT NOT NULL,
  provider_confirmed_at TEXT,
  provider_receipt_ref TEXT,
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0),
  last_error_code TEXT,
  next_attempt_at TEXT,
  UNIQUE(provider_code, provider_session_ref_hash, reason_code)
);

CREATE INDEX idx_customer_session_revocations_pending
  ON customer_session_revocations(provider_code, provider_confirmed_at, next_attempt_at);

CREATE TABLE identity_provider_events (
  id TEXT PRIMARY KEY,
  provider_code TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL CHECK(length(payload_sha256) = 64),
  signature_verified_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  processing_status TEXT NOT NULL CHECK(processing_status IN ('pending','processed','ignored','failed','dead_letter')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0),
  processed_at TEXT,
  last_error_code TEXT,
  UNIQUE(provider_code, provider_event_id)
);

CREATE INDEX idx_identity_provider_events_work
  ON identity_provider_events(processing_status, received_at);

-- Authorization is derived only from active PCD memberships joined to active
-- PCD users and organizations. Provider organization and role claims are not
-- stored as grants and cannot manufacture tenant access.
