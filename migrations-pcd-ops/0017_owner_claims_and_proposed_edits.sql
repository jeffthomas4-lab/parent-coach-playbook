-- Auditable owner claim, dispute, and proposed-edit workflow.
-- Default inert: no public/customer route reads or writes these tables yet.

CREATE TABLE owner_claims (
  id TEXT PRIMARY KEY,
  claimant_customer_user_id TEXT NOT NULL REFERENCES customer_users(id),
  customer_organization_id TEXT NOT NULL REFERENCES customer_organizations(id),
  directory_organization_ref TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','submitted','evidence_required','under_review','verified','rejected','withdrawn','suspended','disputed')),
  submitted_at TEXT,
  decided_at TEXT,
  decided_by_staff_ref TEXT,
  decision_reason_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),
  UNIQUE(customer_organization_id, directory_organization_ref),
  CHECK(status = 'draft' OR submitted_at IS NOT NULL),
  CHECK(status NOT IN ('verified','rejected') OR (decided_at IS NOT NULL AND decided_by_staff_ref IS NOT NULL AND decision_reason_code IS NOT NULL))
);

CREATE INDEX idx_owner_claims_review ON owner_claims(status, submitted_at);
CREATE INDEX idx_owner_claims_claimant ON owner_claims(claimant_customer_user_id, status);

CREATE TABLE owner_claim_evidence (
  id TEXT PRIMARY KEY,
  owner_claim_id TEXT NOT NULL REFERENCES owner_claims(id),
  evidence_type TEXT NOT NULL CHECK(evidence_type IN ('domain_control','official_email','registration_record','business_record','staff_callback','other')),
  evidence_ref TEXT NOT NULL,
  evidence_sha256 TEXT NOT NULL CHECK(length(evidence_sha256) = 64),
  contains_personal_data INTEGER NOT NULL DEFAULT 0 CHECK(contains_personal_data IN (0,1)),
  retention_review_at TEXT NOT NULL,
  submitted_by_customer_user_id TEXT NOT NULL REFERENCES customer_users(id),
  submitted_at TEXT NOT NULL,
  review_status TEXT NOT NULL CHECK(review_status IN ('pending','accepted','rejected','expired')),
  reviewed_by_staff_ref TEXT,
  reviewed_at TEXT,
  review_reason_code TEXT
);

CREATE INDEX idx_owner_claim_evidence_review ON owner_claim_evidence(owner_claim_id, review_status);

CREATE TABLE owner_claim_events (
  id TEXT PRIMARY KEY,
  owner_claim_id TEXT NOT NULL REFERENCES owner_claims(id),
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('customer','staff','system')),
  actor_ref TEXT NOT NULL,
  prior_status TEXT,
  next_status TEXT,
  reason_code TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  UNIQUE(owner_claim_id, idempotency_key)
);

CREATE INDEX idx_owner_claim_events_history ON owner_claim_events(owner_claim_id, occurred_at);

CREATE TABLE owner_proposed_edits (
  id TEXT PRIMARY KEY,
  customer_organization_id TEXT NOT NULL REFERENCES customer_organizations(id),
  directory_organization_ref TEXT NOT NULL,
  proposed_by_customer_user_id TEXT NOT NULL REFERENCES customer_users(id),
  base_record_sha256 TEXT NOT NULL CHECK(length(base_record_sha256) = 64),
  proposed_patch_json TEXT NOT NULL,
  proposed_patch_sha256 TEXT NOT NULL CHECK(length(proposed_patch_sha256) = 64),
  status TEXT NOT NULL CHECK(status IN ('draft','submitted','under_review','approved','rejected','superseded','withdrawn','conflict')),
  submitted_at TEXT,
  decided_at TEXT,
  decided_by_staff_ref TEXT,
  decision_reason_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1 CHECK(version > 0),
  CHECK(status = 'draft' OR submitted_at IS NOT NULL),
  CHECK(status NOT IN ('approved','rejected') OR (decided_at IS NOT NULL AND decided_by_staff_ref IS NOT NULL AND decision_reason_code IS NOT NULL))
);

CREATE INDEX idx_owner_proposed_edits_review ON owner_proposed_edits(status, submitted_at);
CREATE INDEX idx_owner_proposed_edits_org ON owner_proposed_edits(customer_organization_id, created_at);

CREATE TABLE owner_disputes (
  id TEXT PRIMARY KEY,
  owner_claim_id TEXT NOT NULL REFERENCES owner_claims(id),
  opened_by_type TEXT NOT NULL CHECK(opened_by_type IN ('customer','staff','third_party')),
  opened_by_ref TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('open','evidence_required','under_review','resolved_upheld','resolved_revoked','closed_no_action')),
  opened_at TEXT NOT NULL,
  resolved_at TEXT,
  resolved_by_staff_ref TEXT,
  resolution_reason_code TEXT,
  CHECK(status NOT LIKE 'resolved_%' OR (resolved_at IS NOT NULL AND resolved_by_staff_ref IS NOT NULL AND resolution_reason_code IS NOT NULL))
);

CREATE INDEX idx_owner_disputes_review ON owner_disputes(status, opened_at);

-- A verified claim establishes proof-of-control only. It does not change
-- directory verification, organic rank, paid status, or entitlement.
