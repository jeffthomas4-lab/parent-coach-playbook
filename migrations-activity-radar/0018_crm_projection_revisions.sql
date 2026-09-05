-- Upgrade-safe, lossless live CRM cursor for the organization authority.
-- Existing rows remain revision 0 for the separately gated historical backfill.

ALTER TABLE organizations ADD COLUMN crm_projection_revision INTEGER NOT NULL DEFAULT 0
  CHECK(crm_projection_revision >= 0);

CREATE TABLE crm_organization_projection_revisions (
  singleton INTEGER PRIMARY KEY CHECK(singleton=1),
  next_revision INTEGER NOT NULL CHECK(next_revision > 0)
);
INSERT INTO crm_organization_projection_revisions (singleton,next_revision) VALUES (1,1);

CREATE INDEX idx_organizations_crm_projection_revision
  ON organizations(crm_projection_revision) WHERE crm_projection_revision > 0;

CREATE TRIGGER crm_organization_projection_insert
AFTER INSERT ON organizations
BEGIN
  UPDATE crm_organization_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
  UPDATE organizations SET crm_projection_revision=(
    SELECT next_revision-1 FROM crm_organization_projection_revisions WHERE singleton=1
  ) WHERE id=NEW.id;
END;

CREATE TRIGGER crm_organization_projection_update
AFTER UPDATE OF name,organization_type,website_url,city,state,zip,categories,
  record_status,is_claimed,deleted_at ON organizations
WHEN NEW.name IS NOT OLD.name
  OR NEW.organization_type IS NOT OLD.organization_type
  OR NEW.website_url IS NOT OLD.website_url
  OR NEW.city IS NOT OLD.city
  OR NEW.state IS NOT OLD.state
  OR NEW.zip IS NOT OLD.zip
  OR NEW.categories IS NOT OLD.categories
  OR NEW.record_status IS NOT OLD.record_status
  OR NEW.is_claimed IS NOT OLD.is_claimed
  OR NEW.deleted_at IS NOT OLD.deleted_at
BEGIN
  UPDATE crm_organization_projection_revisions SET next_revision=next_revision+1 WHERE singleton=1;
  UPDATE organizations SET crm_projection_revision=(
    SELECT next_revision-1 FROM crm_organization_projection_revisions WHERE singleton=1
  ) WHERE id=NEW.id;
END;
