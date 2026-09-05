-- Bind a historical CRM projection run to the exact approved source and target
-- identities. Empty defaults keep this forward-only migration compatible with
-- older local evidence; runtime refuses to create or resume a run with them.

ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN approval_manifest_sha256 TEXT NOT NULL DEFAULT '' CHECK(
    approval_manifest_sha256='' OR (
      length(approval_manifest_sha256)=64
      AND approval_manifest_sha256=lower(approval_manifest_sha256)
      AND approval_manifest_sha256 NOT GLOB '*[^0-9a-f]*'
    )
  );
ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN directory_database_id TEXT NOT NULL DEFAULT '' CHECK(
    directory_database_id='' OR (length(directory_database_id)=36 AND directory_database_id NOT GLOB '*[^0-9a-f-]*')
  );
ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN ops_database_id TEXT NOT NULL DEFAULT '' CHECK(
    ops_database_id='' OR (length(ops_database_id)=36 AND ops_database_id NOT GLOB '*[^0-9a-f-]*')
  );
ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN target_database_id TEXT NOT NULL DEFAULT '' CHECK(
    target_database_id='' OR (length(target_database_id)=36 AND target_database_id NOT GLOB '*[^0-9a-f-]*')
  );
ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN directory_bookmark TEXT NOT NULL DEFAULT '' CHECK(
    directory_bookmark='' OR (length(directory_bookmark)=59 AND directory_bookmark NOT GLOB '*[^0-9a-f-]*')
  );
ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN ops_bookmark TEXT NOT NULL DEFAULT '' CHECK(
    ops_bookmark='' OR (length(ops_bookmark)=59 AND ops_bookmark NOT GLOB '*[^0-9a-f-]*')
  );
ALTER TABLE crm_adapter_backfill_runs
  ADD COLUMN source_policy_version TEXT NOT NULL DEFAULT '' CHECK(
    source_policy_version='' OR (
      length(source_policy_version) BETWEEN 1 AND 80
      AND source_policy_version NOT GLOB '*[^A-Za-z0-9._:-]*'
    )
  );

-- One sealed approval manifest authorizes exactly one historical run/target.
-- The partial predicate preserves upgrade compatibility for legacy empty rows;
-- runtime rejects those rows and never creates another empty approval.
CREATE UNIQUE INDEX idx_crm_adapter_backfill_manifest
  ON crm_adapter_backfill_runs(approval_manifest_sha256)
  WHERE approval_manifest_sha256!='';
