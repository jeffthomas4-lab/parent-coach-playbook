import { describe, expect, it } from 'vitest';
import receipt from '../coordination/release-evidence/worker-rollback-target-2026-07-16.json';
import { validateWorkerRollbackTarget } from '../scripts/worker-rollback-target.mjs';

// The committed 2026-07-16 receipt predates the PCD_OPS_DB binding requirement and is
// intentionally NOT regenerated here (that needs a separately approved fresh live read).
// The happy-path test therefore validates the validator against a completed fixture; the
// real stale-receipt gap is surfaced (correctly, as a failure) by `npm run check:rollback-target`.
const withOpsDb = (r) => ({ ...r, bindings: { ...r.bindings, PCD_OPS_DB: 'd1' } });

describe('Worker rollback target receipt', () => {
  it('pins a fully bound active Worker version for the next release only', () => {
    expect(validateWorkerRollbackTarget(withOpsDb(receipt), Date.parse('2026-07-16T14:00:00Z'))).toEqual({ errors: [], valid: true });
  });

  it('rejects missing secret bindings, Pages fallback, storage claims and stale evidence', () => {
    const copy = structuredClone(receipt) as any;
    delete copy.bindings.CRON_KEY;
    copy.pages_is_rollback_target = true;
    copy.storage_rollback_included = true;
    expect(validateWorkerRollbackTarget(copy, Date.parse('2026-07-24T00:00:00Z')).errors).toEqual(expect.arrayContaining([
      'binding CRON_KEY must be present as secret_text',
      'Pages must not be designated as the rollback target',
      'receipt must state that storage rollback is not included',
      'receipt is expired',
    ]));
  });

  it('rejects a target that was not the active 100 percent version', () => {
    const copy = structuredClone(receipt) as any;
    copy.target_version_id = 'different';
    copy.traffic_percentage = 50;
    expect(validateWorkerRollbackTarget(copy, Date.parse('2026-07-16T14:00:00Z')).errors).toEqual(expect.arrayContaining([
      'target must have been the active version at observation',
      'target must have received 100 percent of traffic at observation',
    ]));
  });

  it('rejects a receipt whose bindings omit PCD_OPS_DB', () => {
    const copy = structuredClone(receipt) as any;
    delete copy.bindings.PCD_OPS_DB;
    expect(validateWorkerRollbackTarget(copy, Date.parse('2026-07-16T14:00:00Z')).errors).toEqual(expect.arrayContaining([
      'binding PCD_OPS_DB must be present as d1',
    ]));
  });
});
