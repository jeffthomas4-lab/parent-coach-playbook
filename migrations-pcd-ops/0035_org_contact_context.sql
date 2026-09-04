-- Fail-closed classification boundary for CRM contact projection.
-- Existing rows remain held as unknown until a trusted workflow explicitly
-- classifies them. Family, guardian, minor, and roster identities are never
-- promoted merely because a channel was extracted.

ALTER TABLE org_contacts ADD COLUMN contact_context TEXT NOT NULL DEFAULT 'unknown'
  CHECK (contact_context IN ('professional','family','guardian','minor','roster','unknown'));

CREATE INDEX IF NOT EXISTS idx_org_contacts_context
  ON org_contacts(contact_context) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_org_contacts_crm_projection_cursor
  ON org_contacts(unixepoch(updated_at), id);
