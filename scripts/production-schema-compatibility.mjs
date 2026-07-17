import fs from 'node:fs';

const requiredReasons = [
  'different_migration_lineage',
  'pcd_base_table_absent',
  'preexisting_table_name_collisions',
  'shared_directory_data_boundary',
];

export function validateProductionSchemaCompatibility(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { valid: false, errors: ['receipt must be an object'] };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (value.inspection_mode !== 'remote_read_only_schema_metadata' || value.changed_db !== false || value.rows_written !== 0 || value.customer_rows_selected !== false) errors.push('inspection must remain metadata-only and non-mutating');
  if (value.current_lineage !== 'activity_radar_graph') errors.push('current lineage must be explicit');
  if (value.camps_table_present !== false) errors.push('receipt must preserve the absent camps table finding');
  if (value.compatibility_result !== 'incompatible_for_pcd_migration_chain') errors.push('incompatible migration finding must fail closed');
  for (const reason of requiredReasons) if (!value.reason_codes?.includes(reason)) errors.push(`missing reason code: ${reason}`);
  for (const table of ['camp_claims', 'camp_reviews', 'org_suggestions', 'search_events']) if (!value.existing_collision_tables?.includes(table)) errors.push(`missing collision table: ${table}`);
  if (value.required_architecture?.directory_binding !== 'DB' || value.required_architecture?.operational_binding !== 'PCD_OPS_DB') errors.push('separate directory and operational bindings are required');
  if (value.required_architecture?.staging_provisioned !== true || value.required_architecture?.staging_migration_applied !== true || value.required_architecture?.staging_worker_binding_live !== false || value.required_architecture?.production_provisioned !== false || value.required_architecture?.production_migration_applied !== false) errors.push('environment-specific operational database state is incomplete or overstated');
  const proof = value.local_operational_lineage_proof;
  if (proof?.config !== 'wrangler.pcd-ops.local.jsonc' || proof?.migrations_dir !== 'migrations-pcd-ops' || proof?.empty_local_database !== true || proof?.applied_migration_count !== 4 || proof?.applied_through !== '0014_trust_intake_idempotency.sql' || proof?.remote !== false || !Array.isArray(proof?.external_changes) || proof.external_changes.length !== 0) errors.push('isolated operational lineage proof is incomplete');
  if (!String(value.prohibited_conclusion ?? '').includes('Do not run')) errors.push('explicit prohibited conclusion is required');
  if (!Array.isArray(value.external_changes) || value.external_changes.length !== 0 || value.production_migration_approved !== false) errors.push('receipt must remain non-authorizing');
  return { valid: errors.length === 0, errors };
}

export function loadProductionSchemaCompatibility(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
