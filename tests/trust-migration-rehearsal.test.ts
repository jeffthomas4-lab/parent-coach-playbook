import { describe, expect, it } from 'vitest';
import receipt from '../coordination/release-evidence/trust-migration-rehearsal-2026-07-16.json';
import { validateTrustMigrationRehearsal } from '../scripts/trust-migration-rehearsal.mjs';

describe('trust migration rehearsal receipt', () => {
  it('records the repaired fresh bootstrap without hiding the original failure', () => {
    expect(validateTrustMigrationRehearsal(receipt)).toEqual({ valid: true, errors: [] });
  });

  it('cannot convert local synthetic evidence into production approval', () => {
    const copy = structuredClone(receipt) as any;
    copy.remote = true;
    copy.fresh_chain_result = 'fail';
    copy.operational_migration_gate_complete = true;
    copy.production_migration_approved = true;
    expect(validateTrustMigrationRehearsal(copy).errors).toEqual(expect.arrayContaining([
      'scope must remain isolated and local',
      'fresh chain repair result is required',
      'local rehearsal must not clear operational or approval gates',
    ]));
  });
});
