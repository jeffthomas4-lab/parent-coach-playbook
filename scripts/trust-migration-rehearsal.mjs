import fs from 'node:fs';

const candidateMigrations = [
  '0011_trust_cases.sql',
  '0012_trust_drafts_and_notification_outbox.sql',
  '0013_demand_events_v1.sql',
  '0014_trust_intake_idempotency.sql',
];

export function validateTrustMigrationRehearsal(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: ['receipt must be an object'] };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (value.scope !== 'isolated_local_d1' || value.remote !== false) errors.push('scope must remain isolated and local');
  if (value.production_data_used !== false) errors.push('production data must not be used');
  if (!Array.isArray(value.external_changes) || value.external_changes.length !== 0) errors.push('external_changes must be empty');
  if (JSON.stringify(value.candidate_migrations) !== JSON.stringify(candidateMigrations)) errors.push('candidate migration list is incomplete or reordered');
  if (value.candidate_result !== 'pass_on_fresh_local_bootstrap') errors.push('candidate result must be bounded to the fresh local bootstrap');
  if (value.fresh_chain_result !== 'pass_after_bootstrap_repair') errors.push('fresh chain repair result is required');
  if (value.prior_fresh_chain_failure?.migration !== '0006_camp_quality_framework.sql') errors.push('prior fresh chain failure must remain visible');
  if (value.bootstrap_repair?.file !== 'migrations/0001_init_camps.sql' || value.bootstrap_repair?.scope !== 'databases_where_0001_has_never_run' || value.bootstrap_repair?.existing_database_effect !== 'none_without_a_separately_approved_new_migration') errors.push('bootstrap repair scope is incomplete');
  if (value.checks?.candidate_migrations_applied !== true) errors.push('candidate migrations must be applied locally');
  if (value.checks?.full_chain_applied_from_empty_database !== true || value.checks?.required_legacy_columns_present !== 15) errors.push('fresh database bootstrap proof is incomplete');
  if (value.checks?.trust_tables_present !== 7) errors.push('all seven trust tables must be present');
  if (value.checks?.intake_columns_present !== 2 || value.checks?.intake_unique_index_present !== true) errors.push('idempotency schema proof is incomplete');
  if (value.checks?.foreign_key_check_clean !== true) errors.push('foreign key check must be clean');
  if (value.checks?.synthetic_exact_replay_retained_original !== true || value.checks?.synthetic_changed_payload_did_not_create_second_case !== true || value.checks?.synthetic_case_count_for_key !== 1) errors.push('synthetic idempotency proof is incomplete');
  if (value.operational_migration_gate_complete !== false || value.production_migration_approved !== false) errors.push('local rehearsal must not clear operational or approval gates');
  const serialized = JSON.stringify(value).toLowerCase();
  for (const prohibited of ['--remote', 'authorization:', 'cookie:', 'secret_value', 'token_value']) {
    if (serialized.includes(prohibited)) errors.push(`receipt contains prohibited material: ${prohibited}`);
  }
  return { valid: errors.length === 0, errors };
}

export function loadTrustMigrationRehearsal(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
