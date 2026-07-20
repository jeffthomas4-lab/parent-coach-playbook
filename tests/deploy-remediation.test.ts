import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import {
  REMEDIATION_HALTED,
  REMEDIATION_NONE,
  REMEDIATION_ROLLBACK_FAILED,
  REMEDIATION_ROLLED_BACK,
  remediateAfterSmoke,
  rollbackWranglerArgs,
} from '../scripts/deploy-remediation.mjs';

const goodTarget = JSON.parse(
  readFileSync('coordination/release-evidence/worker-rollback-target-2026-07-16.json', 'utf8'),
);
// Any instant inside the receipt's validity window (observed 2026-07-18, expires 2026-07-25).
const withinWindow = Date.parse('2026-07-19T00:00:00Z');
const versionId = goodTarget.target_version_id;

describe('deploy auto-remediation', () => {
  it('builds the exact wrangler args that restore 100% traffic to the good version', () => {
    expect(rollbackWranglerArgs('production', versionId, 'wrangler.production.jsonc')).toEqual([
      'versions', 'deploy', `${versionId}@100%`,
      '--config', 'wrangler.production.jsonc',
      '--yes',
      '--message', `auto-remediation: roll production back to ${versionId} after post-deploy smoke failure`,
    ]);
  });

  it('does nothing when the smoke check passed', () => {
    const runWrangler = vi.fn((_args: string[]) => ({ status: 0 }));
    const outcome = remediateAfterSmoke({ smokeFailed: false, target: 'production', rollbackTarget: goodTarget, runWrangler, now: withinWindow });
    expect(outcome).toMatchObject({ action: REMEDIATION_NONE, remediated: false });
    expect(runWrangler).not.toHaveBeenCalled();
  });

  it('auto-rolls back to the recorded good version on smoke failure', () => {
    // Mocked Wrangler CLI: succeeds.
    const runWrangler = vi.fn((_args: string[]) => ({ status: 0 }));
    const outcome = remediateAfterSmoke({ smokeFailed: true, target: 'production', rollbackTarget: goodTarget, runWrangler, now: withinWindow });
    expect(outcome).toMatchObject({ action: REMEDIATION_ROLLED_BACK, remediated: true, versionId });
    expect(runWrangler).toHaveBeenCalledTimes(1);
    expect(runWrangler.mock.calls[0][0]).toEqual(rollbackWranglerArgs('production', versionId, 'wrangler.production.jsonc'));
  });

  it('halts and alerts, without touching wrangler, when no valid rollback target exists', () => {
    const runWrangler = vi.fn((_args: string[]) => ({ status: 0 }));
    const expired = Date.parse('2027-01-01T00:00:00Z'); // past the receipt's expiry
    const outcome = remediateAfterSmoke({ smokeFailed: true, target: 'production', rollbackTarget: goodTarget, runWrangler, now: expired });
    expect(outcome.action).toBe(REMEDIATION_HALTED);
    expect(outcome.remediated).toBe(false);
    expect(outcome.alert).toMatch(/manual rollback required NOW/);
    expect(runWrangler).not.toHaveBeenCalled();
  });

  it('reports rollback_failed with a loud alert when the rollback command itself fails', () => {
    // Mocked Wrangler CLI: non-zero exit.
    const runWrangler = vi.fn((_args: string[]) => ({ status: 1 }));
    const outcome = remediateAfterSmoke({ smokeFailed: true, target: 'production', rollbackTarget: goodTarget, runWrangler, now: withinWindow });
    expect(outcome).toMatchObject({ action: REMEDIATION_ROLLBACK_FAILED, remediated: false, versionId, wranglerStatus: 1 });
    expect(outcome.alert).toMatch(/the failed version is LIVE/i);
    expect(runWrangler).toHaveBeenCalledTimes(1);
  });

  it('halt-only mode always alerts and never rolls back (staging, no recorded target)', () => {
    const runWrangler = vi.fn((_args: string[]) => ({ status: 0 }));
    const outcome = remediateAfterSmoke({ smokeFailed: true, target: 'staging', rollbackTarget: null, haltOnly: true, runWrangler, now: withinWindow });
    expect(outcome.action).toBe(REMEDIATION_HALTED);
    expect(outcome.remediated).toBe(false);
    expect(outcome.alert).toMatch(/No automated rollback is configured for staging/);
    expect(runWrangler).not.toHaveBeenCalled();
  });
});
