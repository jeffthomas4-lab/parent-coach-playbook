-- PLAT-009 full-registry delivery claim order.
--
-- The status/next-attempt index cannot satisfy ORDER BY source_sequence, so a
-- 200k pending set otherwise requires a full scan and temporary sort for every
-- ten-row lease. Keep only actionable statuses in this compact ordering index.

CREATE INDEX IF NOT EXISTS idx_crm_adapter_outbox_claim_sequence
  ON crm_adapter_outbox(source_sequence)
  WHERE status IN ('pending','retry','leased');
