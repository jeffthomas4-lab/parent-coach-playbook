-- Protected response drafts and metadata-only notification delivery state.
-- This file is inert until separately reviewed and explicitly applied.
CREATE TABLE IF NOT EXISTS trust_response_drafts (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES trust_cases(id),
  revision INTEGER NOT NULL CHECK (revision > 0),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent', 'void')),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  approved_content_hash TEXT,
  sent_by TEXT,
  sent_at TEXT,
  provider_message_id TEXT,
  voided_by TEXT,
  voided_at TEXT,
  UNIQUE (case_id, revision)
);
CREATE INDEX IF NOT EXISTS idx_trust_response_drafts_case_created
  ON trust_response_drafts(case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trust_response_drafts_review
  ON trust_response_drafts(status, expires_at, created_at);

-- Append-only decision evidence. Message bodies remain in the protected draft.
CREATE TABLE IF NOT EXISTS trust_response_draft_events (
  id TEXT PRIMARY KEY,
  draft_id TEXT NOT NULL REFERENCES trust_response_drafts(id),
  case_id TEXT NOT NULL REFERENCES trust_cases(id),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created', 'approved', 'voided', 'sent', 'expired',
    'delivery_reconciled_sent', 'delivery_reconciled_not_sent'
  )),
  actor TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_trust_response_draft_events_draft_created
  ON trust_response_draft_events(draft_id, created_at ASC);

-- Contains no requester identity or case body. A delivery worker may project
-- this opaque pointer to an approved internal channel after separate approval.
CREATE TABLE IF NOT EXISTS notification_outbox (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('trust_case_submitted', 'trust_case_overdue', 'trust_draft_created', 'trust_draft_approved')),
  aggregate_type TEXT NOT NULL CHECK (aggregate_type IN ('trust_case', 'trust_response_draft')),
  aggregate_id TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'leased', 'delivered', 'dead_letter', 'cancelled')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  available_at TEXT NOT NULL,
  lease_owner TEXT,
  lease_expires_at TEXT,
  delivered_at TEXT,
  provider_event_id TEXT,
  last_error_code TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notification_outbox_dispatch
  ON notification_outbox(status, available_at, priority);

-- One delivery claim per immutable approved payload. A claimed or ambiguous
-- attempt is never retried automatically; it requires provider reconciliation.
CREATE TABLE IF NOT EXISTS trust_response_delivery_attempts (
  id TEXT PRIMARY KEY,
  idempotency_key TEXT NOT NULL UNIQUE,
  draft_id TEXT NOT NULL REFERENCES trust_response_drafts(id),
  case_id TEXT NOT NULL REFERENCES trust_cases(id),
  content_hash TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'claimed', 'sent', 'failed_retryable', 'delivery_unknown',
    'reconciled_sent', 'reconciled_not_sent'
  )),
  claimed_by TEXT NOT NULL,
  claimed_at TEXT NOT NULL,
  completed_at TEXT,
  provider_message_id TEXT,
  error_code TEXT,
  reconciled_by TEXT,
  reconciled_at TEXT,
  reconciliation_evidence TEXT,
  reconciliation_note TEXT,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_trust_response_delivery_attempts_reconcile
  ON trust_response_delivery_attempts(status, claimed_at);
