import { describe, expect, it } from 'vitest';
import receipt from '../coordination/release-evidence/production-schema-compatibility-2026-07-16.json';
import { validateProductionSchemaCompatibility } from '../scripts/production-schema-compatibility.mjs';

describe('production schema compatibility evidence', () => {
  it('requires a separate operational database and rejects the current DB migration target', () => {
    expect(validateProductionSchemaCompatibility(receipt)).toEqual({ valid: true, errors: [] });
  });

  it('cannot be relabeled compatible, mutating, or provisioned', () => {
    const copy = structuredClone(receipt) as any;
    copy.changed_db = true;
    copy.compatibility_result = 'compatible';
    copy.required_architecture.production_provisioned = true;
    copy.local_operational_lineage_proof.remote = true;
    copy.production_migration_approved = true;
    expect(validateProductionSchemaCompatibility(copy).errors).toEqual(expect.arrayContaining([
      'inspection must remain metadata-only and non-mutating',
      'incompatible migration finding must fail closed',
      'environment-specific operational database state is incomplete or overstated',
      'isolated operational lineage proof is incomplete',
      'receipt must remain non-authorizing',
    ]));
  });
});
