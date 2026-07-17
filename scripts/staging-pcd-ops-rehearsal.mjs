import fs from 'node:fs';

const expectedMigrations = [
  '0011_trust_cases.sql',
  '0012_trust_drafts_and_notification_outbox.sql',
  '0013_demand_events_v1.sql',
  '0014_trust_intake_idempotency.sql',
];

export function validateStagingPcdOpsRehearsal(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: ['receipt must be an object'] };
  if (value.schema_version !== 1 || value.environment !== 'staging') errors.push('receipt must identify staging schema version 1');
  if (value.database_name !== 'parent-coach-desk-ops-staging' || value.binding_name !== 'PCD_OPS_DB' || value.region !== 'WNAM') errors.push('exact staging target is required');
  if (value.binding_in_staging_source_config !== true || value.binding_live_on_staging_worker !== false || value.production_binding_added !== false) errors.push('binding state must not overstate a live deployment');
  if (value.migrations_dir !== 'migrations-pcd-ops' || JSON.stringify(value.applied_migrations) !== JSON.stringify(expectedMigrations)) errors.push('operational migration lineage is incomplete');
  const remote = value.remote_verification;
  if (remote?.changed_db !== false || remote?.rows_written !== 0 || remote?.trust_case_rows !== 0 || remote?.demand_event_rows !== 0 || remote?.foreign_key_violation_count !== 0) errors.push('post-migration verification must be read-only, empty, and referentially clean');
  const restore = value.export_restore;
  if (restore?.restored_to_isolated_sqlite !== true || restore?.integrity_check !== 'ok' || restore?.foreign_key_violation_count !== 0 || restore?.expected_tables_present !== true || restore?.all_operational_table_counts_zero !== true || !/^[a-f0-9]{64}$/.test(restore?.export_sha256 ?? '')) errors.push('export/restore proof is incomplete');
  if (Object.values(value.feature_state ?? {}).some((state) => state !== false)) errors.push('all staging operational features must remain disabled');
  if (value.failure_isolation?.missing_binding_returns_503_in_local_contract !== true || value.failure_isolation?.live_staging_worker_drill_complete !== false) errors.push('failure-isolation scope must remain explicit');
  if (value.authorized_scope !== 'staging_pcd_ops_provisioning_and_rehearsal' || value.production_migration_approved !== false || value.feature_activation_approved !== false) errors.push('receipt exceeds the approved scope');
  return { valid: errors.length === 0, errors };
}

export const loadStagingPcdOpsRehearsal = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
