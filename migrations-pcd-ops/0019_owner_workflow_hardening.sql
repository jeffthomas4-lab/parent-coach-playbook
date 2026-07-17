-- Append-only audit history for proposed edits.
CREATE TABLE owner_proposed_edit_events (
  id TEXT PRIMARY KEY,
  proposed_edit_id TEXT NOT NULL REFERENCES owner_proposed_edits(id),
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('customer','staff','system')),
  actor_ref TEXT NOT NULL,
  prior_status TEXT,
  next_status TEXT,
  reason_code TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  UNIQUE(proposed_edit_id, idempotency_key)
);

CREATE INDEX idx_owner_proposed_edit_events_history
  ON owner_proposed_edit_events(proposed_edit_id, occurred_at);

-- A proposal may be approved only from review and remains separate from the
-- directory write that a future staff-controlled publisher may perform.
