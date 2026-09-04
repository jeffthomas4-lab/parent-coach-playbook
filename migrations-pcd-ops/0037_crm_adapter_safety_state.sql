-- Bound historical reconciliation failures and serialize contact safety
-- transitions against an already leased PII-bearing observation.

ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_failure_count INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_failure_count BETWEEN 0 AND 8);
ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_next_attempt_at INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_next_attempt_at >= 0);
ALTER TABLE crm_adapter_backfill_runs ADD COLUMN reconciliation_halted INTEGER NOT NULL DEFAULT 0
  CHECK(reconciliation_halted IN (0,1));

CREATE TRIGGER crm_contact_safety_transition_lease_guard
BEFORE UPDATE OF contact_context,do_not_contact,deleted_at ON org_contacts
WHEN (
  (NEW.do_not_contact=1 AND OLD.do_not_contact!=1)
  OR (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL)
  OR (
    OLD.contact_context IN ('professional','unknown')
    AND NEW.contact_context IN ('family','guardian','minor','roster')
  )
) AND EXISTS (
  SELECT 1 FROM crm_adapter_outbox
  WHERE subject_type='contact' AND subject_id=OLD.id
    AND event_type='contact.observed.v1' AND status='leased'
)
BEGIN
  SELECT RAISE(ABORT,'crm_contact_delivery_in_flight');
END;

CREATE TRIGGER crm_contact_delete_lease_guard
BEFORE DELETE ON org_contacts
WHEN EXISTS (
  SELECT 1 FROM crm_adapter_outbox
  WHERE subject_type='contact' AND subject_id=OLD.id
    AND event_type='contact.observed.v1' AND status='leased'
)
BEGIN
  SELECT RAISE(ABORT,'crm_contact_delivery_in_flight');
END;
