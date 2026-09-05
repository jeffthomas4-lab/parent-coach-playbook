-- Upgrade-safe repair for the CRM producer. Earlier candidate migrations may
-- already exist in a local/staging database, so this file removes their lease
-- guards and adds the new state without rewriting migration history.

DROP TRIGGER IF EXISTS crm_contact_safety_transition_lease_guard;
DROP TRIGGER IF EXISTS crm_contact_delete_lease_guard;

ALTER TABLE crm_adapter_controls ADD COLUMN organization_revision_cursor INTEGER NOT NULL DEFAULT 0
  CHECK(organization_revision_cursor >= 0);
ALTER TABLE crm_adapter_controls ADD COLUMN contact_revision_cursor INTEGER NOT NULL DEFAULT 0
  CHECK(contact_revision_cursor >= 0);

ALTER TABLE org_contacts ADD COLUMN crm_projection_revision INTEGER NOT NULL DEFAULT 0
  CHECK(crm_projection_revision >= 0);

CREATE TABLE crm_contact_projection_revisions (
  singleton INTEGER PRIMARY KEY CHECK(singleton=1),
  next_revision INTEGER NOT NULL CHECK(next_revision > 0)
);
INSERT INTO crm_contact_projection_revisions (singleton,next_revision) VALUES (1,1);

CREATE INDEX idx_org_contacts_crm_projection_revision
  ON org_contacts(crm_projection_revision) WHERE crm_projection_revision > 0;

CREATE TRIGGER crm_contact_projection_insert
AFTER INSERT ON org_contacts
BEGIN
  UPDATE crm_contact_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
  UPDATE org_contacts SET crm_projection_revision=(
    SELECT next_revision-1 FROM crm_contact_projection_revisions WHERE singleton=1
  ) WHERE id=NEW.id;
END;

CREATE TRIGGER crm_contact_projection_update
AFTER UPDATE OF organization_id,full_name,title,role,email,phone,do_not_contact,
  contact_context,source_url,confidence,verified_at,deleted_at ON org_contacts
WHEN NEW.organization_id IS NOT OLD.organization_id
  OR NEW.full_name IS NOT OLD.full_name
  OR NEW.title IS NOT OLD.title
  OR NEW.role IS NOT OLD.role
  OR NEW.email IS NOT OLD.email
  OR NEW.phone IS NOT OLD.phone
  OR NEW.do_not_contact IS NOT OLD.do_not_contact
  OR NEW.contact_context IS NOT OLD.contact_context
  OR NEW.source_url IS NOT OLD.source_url
  OR NEW.confidence IS NOT OLD.confidence
  OR NEW.verified_at IS NOT OLD.verified_at
  OR NEW.deleted_at IS NOT OLD.deleted_at
BEGIN
  UPDATE crm_contact_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
  UPDATE org_contacts SET crm_projection_revision=(
    SELECT next_revision-1 FROM crm_contact_projection_revisions WHERE singleton=1
  ) WHERE id=NEW.id;
END;

ALTER TABLE crm_adapter_outbox ADD COLUMN target_workspace_id TEXT;
UPDATE crm_adapter_outbox
  SET target_workspace_id=json_extract(payload_json,'$.payload.workspaceId')
  WHERE target_workspace_id IS NULL;
CREATE INDEX idx_crm_adapter_outbox_contact_targets
  ON crm_adapter_outbox(producer_workspace_id,subject_type,event_type,subject_id,target_workspace_id);
CREATE INDEX idx_crm_adapter_outbox_safety_sequence
  ON crm_adapter_outbox(producer_workspace_id,source_sequence)
  WHERE event_type='contact.deleted.v1' AND status IN ('pending','retry','leased');

CREATE TABLE crm_adapter_backfill_subjects (
  run_id TEXT NOT NULL REFERENCES crm_adapter_backfill_runs(id),
  subject_type TEXT NOT NULL CHECK(subject_type IN ('organization','contact')),
  subject_id TEXT NOT NULL,
  PRIMARY KEY(run_id,subject_type,subject_id)
);
INSERT OR IGNORE INTO crm_adapter_backfill_subjects (run_id,subject_type,subject_id)
  SELECT backfill_run_id,subject_type,subject_id FROM crm_adapter_outbox
  WHERE backfill_run_id IS NOT NULL;
CREATE INDEX idx_crm_adapter_backfill_subject_lookup
  ON crm_adapter_backfill_subjects(subject_type,subject_id,run_id);
