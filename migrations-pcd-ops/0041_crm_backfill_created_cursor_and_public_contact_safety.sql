-- Durable creation-time cursors keep historical scans bounded even when the
-- source contains a large post-activation tail. Private/public transitions are
-- also projection-relevant safety changes and must advance the live cursor.

ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN organization_cursor_created_second INTEGER NOT NULL DEFAULT -1;
ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN contact_cursor_created_second INTEGER NOT NULL DEFAULT -1;

CREATE INDEX idx_org_contacts_crm_backfill_created
  ON org_contacts(unixepoch(created_at), id);

DROP TRIGGER IF EXISTS crm_contact_projection_update;
CREATE TRIGGER crm_contact_projection_update
AFTER UPDATE OF organization_id,full_name,title,role,email,phone,is_public,do_not_contact,
  contact_context,source_url,confidence,verified_at,deleted_at ON org_contacts
WHEN NEW.organization_id IS NOT OLD.organization_id
  OR NEW.full_name IS NOT OLD.full_name
  OR NEW.title IS NOT OLD.title
  OR NEW.role IS NOT OLD.role
  OR NEW.email IS NOT OLD.email
  OR NEW.phone IS NOT OLD.phone
  OR NEW.is_public IS NOT OLD.is_public
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
