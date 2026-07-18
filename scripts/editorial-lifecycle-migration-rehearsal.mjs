import fs from 'node:fs';

const fullChainMigrations = [
  '0011_trust_cases.sql', '0012_trust_drafts_and_notification_outbox.sql', '0013_demand_events_v1.sql',
  '0014_trust_intake_idempotency.sql', '0015_privacy_request_lifecycle.sql', '0016_customer_identity_and_tenancy.sql',
  '0017_owner_claims_and_proposed_edits.sql', '0018_customer_invitations_and_recovery.sql', '0019_owner_workflow_hardening.sql',
  '0020_recovery_and_dispute_audit.sql', '0021_privacy_execution_evidence.sql', '0022_commerce_test_mode_ledger.sql',
  '0023_affiliate_recommendation_lifecycle.sql', '0024_editorial_opportunity_lifecycle.sql',
];
const editorialTables = [
  'editorial_approvals', 'editorial_briefs', 'editorial_claim_sources', 'editorial_claims',
  'editorial_lifecycle_events', 'editorial_maintenance_proposals', 'editorial_opportunities',
  'editorial_relationships', 'editorial_reviews', 'editorial_sources',
];

export function validateEditorialLifecycleMigrationRehearsal(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: ['receipt must be an object'] };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (value.scope !== 'isolated_local_d1' || value.remote !== false) errors.push('scope must remain isolated and local');
  if (value.production_data_used !== false) errors.push('production data must not be used');
  if (!Array.isArray(value.external_changes) || value.external_changes.length !== 0) errors.push('external_changes must be empty');
  if (JSON.stringify(value.new_migration) !== JSON.stringify(['0024_editorial_opportunity_lifecycle.sql'])) errors.push('new_migration must name exactly 0024');
  if (JSON.stringify(value.full_chain_migrations) !== JSON.stringify(fullChainMigrations)) errors.push('full_chain_migrations list is incomplete, reordered, or does not match migrations-pcd-ops/');
  if (value.full_chain_result !== 'pass') errors.push('full chain result must be pass');
  if (value.checks?.full_chain_migration_count !== 14) errors.push('full chain migration count must be 14');
  if (value.checks?.editorial_tables_present !== 10 || JSON.stringify(value.checks?.editorial_table_names) !== JSON.stringify(editorialTables)) {
    errors.push('all ten editorial tables must be present and named exactly');
  }
  if (value.checks?.foreign_key_check_clean !== true) errors.push('foreign key check must be clean');
  if (value.checks?.full_lifecycle_walkthrough_passed !== true) errors.push('full lifecycle walkthrough proof is required');
  if (value.checks?.evidence_gate_rejection_proven !== true) errors.push('the missing-evidence approval rejection path must be proven');
  if (value.checks?.insufficient_evidence_stop_proven !== true) errors.push('the insufficient-evidence classification stop must be proven');
  if (value.checks?.maintenance_propose_never_executes_retirement !== true) errors.push('proposing retirement must be proven not to execute it');
  if (value.checks?.maintenance_decide_requires_human_actor !== true) errors.push('the human decision gate for retirement must be proven');
  if (value.test_suite_reference !== 'tests/editorial-records-migration.test.ts') errors.push('test_suite_reference must name the disposable-D1 integration suite');
  if (value.test_result !== '9/9 passing') errors.push('test_result must record the exact passing count');
  if (value.operational_migration_gate_complete !== false || value.production_migration_approved !== false) {
    errors.push('local rehearsal must not clear operational or approval gates');
  }
  const serialized = JSON.stringify(value).toLowerCase();
  for (const prohibited of ['--remote', 'authorization:', 'cookie:', 'secret_value', 'token_value']) {
    if (serialized.includes(prohibited)) errors.push(`receipt contains prohibited material: ${prohibited}`);
  }
  return { valid: errors.length === 0, errors };
}

export function loadEditorialLifecycleMigrationRehearsal(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
