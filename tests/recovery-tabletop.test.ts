import { describe, expect, it } from 'vitest';
import receipt from '../coordination/release-evidence/recovery-tabletop-2026-07-16.json';
import { validateRecoveryTabletop } from '../scripts/recovery-tabletop.mjs';

describe('storage-aware recovery tabletop', () => {
  it('passes only as a no-side-effect tabletop with operational gaps visible', () => {
    expect(validateRecoveryTabletop(receipt)).toEqual({ errors: [], valid: true });
    expect(receipt.operational_rehearsal_complete).toBe(false);
  });

  it('rejects claims that R2 is recovered or Pages is a rollback target', () => {
    const copy = structuredClone(receipt) as any;
    copy.scenarios.find((item: any) => item.id === 'r2_object_loss').state = 'tabletop_pass';
    copy.scenarios.find((item: any) => item.id === 'pages_fallback_request').state = 'tabletop_pass';
    expect(validateRecoveryTabletop(copy).errors).toEqual(expect.arrayContaining([
      'R2 loss must remain an operational gap', 'Pages fallback must be rejected',
    ]));
  });

  it('rejects a tabletop that claims an actual rollback or restore', () => {
    const copy = structuredClone(receipt) as any;
    copy.rollback_executed = true;
    copy.data_restore_executed = true;
    copy.external_changes = ['rollback'];
    expect(validateRecoveryTabletop(copy).errors).toEqual(expect.arrayContaining([
      'tabletop must record zero external changes', 'rollback_executed must be false', 'data_restore_executed must be false',
    ]));
  });
});
