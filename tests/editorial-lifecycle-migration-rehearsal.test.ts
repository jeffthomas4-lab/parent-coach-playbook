import { describe, expect, it } from 'vitest';
import receipt from '../coordination/release-evidence/editorial-lifecycle-migration-rehearsal-2026-07-18.json';
import { validateEditorialLifecycleMigrationRehearsal } from '../scripts/editorial-lifecycle-migration-rehearsal.mjs';

describe('editorial lifecycle migration rehearsal receipt', () => {
  it('records a clean local full-chain apply with the full lifecycle walkthrough proven', () => {
    expect(validateEditorialLifecycleMigrationRehearsal(receipt)).toEqual({ valid: true, errors: [] });
  });

  it('cannot convert local synthetic evidence into staging or production approval', () => {
    const copy = structuredClone(receipt) as any;
    copy.remote = true;
    copy.operational_migration_gate_complete = true;
    copy.production_migration_approved = true;
    const result = validateEditorialLifecycleMigrationRehearsal(copy);
    expect(result.errors).toEqual(expect.arrayContaining([
      'scope must remain isolated and local',
      'local rehearsal must not clear operational or approval gates',
    ]));
  });

  it('rejects a receipt that skips the evidence-gate or maintenance-authority proofs', () => {
    const copy = structuredClone(receipt) as any;
    copy.checks.evidence_gate_rejection_proven = false;
    copy.checks.maintenance_propose_never_executes_retirement = false;
    const result = validateEditorialLifecycleMigrationRehearsal(copy);
    expect(result.errors).toEqual(expect.arrayContaining([
      'the missing-evidence approval rejection path must be proven',
      'proposing retirement must be proven not to execute it',
    ]));
  });
});
