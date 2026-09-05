-- Lossless contact change cursor and source-ordered delivery blocking.
-- Existing contacts remain revision 0 for the separately gated historical
-- backfill; later inserts and relevant updates receive a monotonic revision.

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
  contact_context,source_url,confidence,verified_at,content_hash,deleted_at,updated_at ON org_contacts
BEGIN
  UPDATE crm_contact_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
  UPDATE org_contacts SET crm_projection_revision=(
    SELECT next_revision-1 FROM crm_contact_projection_revisions WHERE singleton=1
  ) WHERE id=NEW.id;
END;

DROP INDEX IF EXISTS idx_crm_adapter_outbox_claim_sequence;
CREATE INDEX idx_crm_adapter_outbox_claim_sequence
  ON crm_adapter_outbox(producer_workspace_id,source_sequence)
  WHERE status IN ('pending','retry','leased','dead');
