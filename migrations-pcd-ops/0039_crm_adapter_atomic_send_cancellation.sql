-- Forward-only repair for the atomic contact-safety/send race. Migration 0038
-- may already be recorded by a prior candidate, so these columns and indexes
-- must be introduced under a new migration number.

ALTER TABLE crm_adapter_outbox ADD COLUMN cancelled_at INTEGER
  CHECK(cancelled_at IS NULL OR cancelled_at >= 0);
ALTER TABLE crm_adapter_outbox ADD COLUMN send_attempt_count INTEGER NOT NULL DEFAULT 0
  CHECK(send_attempt_count >= 0);

-- Earlier rows with an attempted delivery are ambiguous and must be retained
-- as send-started evidence rather than treated as safe-to-delete observations.
UPDATE crm_adapter_outbox SET send_attempt_count=attempt_count WHERE attempt_count>0;

DROP INDEX IF EXISTS idx_crm_adapter_outbox_claim_sequence;
CREATE INDEX idx_crm_adapter_outbox_claim_sequence
  ON crm_adapter_outbox(producer_workspace_id,source_sequence)
  WHERE cancelled_at IS NULL AND status IN ('pending','retry','leased','dead');

DROP INDEX IF EXISTS idx_crm_adapter_outbox_safety_sequence;
CREATE INDEX idx_crm_adapter_outbox_safety_sequence
  ON crm_adapter_outbox(producer_workspace_id,source_sequence)
  WHERE cancelled_at IS NULL AND event_type='contact.deleted.v1'
    AND status IN ('pending','retry','leased');
