import { describe, expect, it } from 'vitest';
import receipt from '../coordination/release-evidence/staging-pcd-ops-rehearsal-2026-07-16.json';
import { validateStagingPcdOpsRehearsal } from '../scripts/staging-pcd-ops-rehearsal.mjs';

describe('staging PCD operational database rehearsal', () => {
  it('proves migration and restore without claiming deployment or activation', () => {
    expect(validateStagingPcdOpsRehearsal(receipt)).toEqual({ valid: true, errors: [] });
  });

  it('rejects production, feature, or live-binding overstatement', () => {
    const copy = structuredClone(receipt) as any;
    copy.production_binding_added = true;
    copy.binding_live_on_staging_worker = true;
    copy.feature_state.trust_intake_enabled = true;
    copy.production_migration_approved = true;
    expect(validateStagingPcdOpsRehearsal(copy).errors).toEqual(expect.arrayContaining([
      'binding state must not overstate a live deployment',
      'all staging operational features must remain disabled',
      'receipt exceeds the approved scope',
    ]));
  });
});
