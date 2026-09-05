-- Bounded incremental CRM projection cursor for the canonical organization
-- authority. julianday() preserves millisecond ordering across the ISO and
-- SQLite datetime text formats already present in this database.

CREATE INDEX IF NOT EXISTS idx_organizations_crm_projection_cursor
  ON organizations(julianday(updated_at), id);
