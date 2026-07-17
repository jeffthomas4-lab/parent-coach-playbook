-- Immutable ownership-dispute history and recovery query support.
CREATE TABLE owner_dispute_events (
  id TEXT PRIMARY KEY,
  owner_dispute_id TEXT NOT NULL REFERENCES owner_disputes(id),
  owner_claim_id TEXT NOT NULL REFERENCES owner_claims(id),
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('customer','staff','system','third_party')),
  actor_ref TEXT NOT NULL,
  prior_status TEXT,
  next_status TEXT,
  reason_code TEXT,
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  UNIQUE(owner_dispute_id, idempotency_key)
);

CREATE INDEX idx_owner_dispute_events_history
  ON owner_dispute_events(owner_dispute_id, occurred_at);

CREATE INDEX idx_customer_recovery_token_lookup
  ON customer_recovery_challenges(token_sha256, status, expires_at);
