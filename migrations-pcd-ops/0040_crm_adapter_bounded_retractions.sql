-- Bound historical-workspace safety fanout and make live target changes replay
-- organizations before contacts. Retraction rows contain no contact channel.

ALTER TABLE crm_adapter_controls ADD COLUMN target_workspace_id TEXT;

CREATE TABLE crm_contact_retraction_runs (
  id TEXT PRIMARY KEY,
  producer_workspace_id TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  content_hash TEXT NOT NULL CHECK(length(content_hash)=64),
  authority_updated_at INTEGER NOT NULL CHECK(authority_updated_at >= 0),
  cursor_target_workspace_id TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(producer_workspace_id,subject_id,authority_updated_at)
);
CREATE INDEX idx_crm_contact_retraction_pending
  ON crm_contact_retraction_runs(producer_workspace_id,status,created_at,id);
