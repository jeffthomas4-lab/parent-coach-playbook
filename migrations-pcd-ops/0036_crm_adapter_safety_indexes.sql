-- Millisecond-safe live projection and source-ordered delivery blocking.
-- Kept additive so the committed 0035 migration remains immutable.

CREATE INDEX IF NOT EXISTS idx_org_contacts_crm_projection_cursor
  ON org_contacts(julianday(updated_at), id);

DROP INDEX IF EXISTS idx_crm_adapter_outbox_claim_sequence;
CREATE INDEX idx_crm_adapter_outbox_claim_sequence
  ON crm_adapter_outbox(producer_workspace_id,source_sequence)
  WHERE status IN ('pending','retry','leased','dead');
