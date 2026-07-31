import { describe, expect, it, vi } from 'vitest';
import {
  REMEDIATION_HALTED,
  REMEDIATION_NONE,
  precedingVersionFrom,
  remediateAfterSmoke,
  rollbackWranglerArgs,
} from '../scripts/deploy-remediation.mjs';

// Newest first, the way wrangler returns them.
const versions = [
  { id: 'v3-just-deployed', created_on: '2026-07-30T21:00:00Z' },
  { id: 'v2-previous-good', created_on: '2026-07-30T18:00:00Z' },
  { id: 'v1-older', created_on: '2026-07-29T15:38:00Z' },
];

describe('preceding version selection', () => {
  it('excludes the just-deployed version by id when it is known', () => {
    expect(precedingVersionFrom(versions, 'v3-just-deployed')).toMatchObject({ versionId: 'v2-previous-good' });
  });

  it('falls back to the second-newest when the deployed id is unknown', () => {
    expect(precedingVersionFrom(versions)).toMatchObject({ versionId: 'v2-previous-good' });
  });

  it('sorts by created date rather than trusting list order', () => {
    const shuffled = [versions[2], versions[0], versions[1]];
    expect(precedingVersionFrom(shuffled, 'v3-just-deployed')).toMatchObject({ versionId: 'v2-previous-good' });
  });

  it('reads the id and timestamp across wrangler JSON shapes', () => {
    const alt = [
      { version_id: 'newest', createdOn: '2026-07-30T21:00:00Z' },
      { versionId: 'older', created_at: '2026-07-30T10:00:00Z' },
    ];
    expect(precedingVersionFrom(alt, 'newest')).toMatchObject({ versionId: 'older' });
  });

  it('returns null rather than guessing when there is no preceding version', () => {
    expect(precedingVersionFrom([versions[0]], 'v3-just-deployed')).toBeNull();
    expect(precedingVersionFrom([], 'anything')).toBeNull();
    expect(precedingVersionFrom(null as unknown as [])).toBeNull();
  });
});

describe('post-deploy remediation', () => {
  it('does nothing when the smoke check passed', () => {
    const readVersions = vi.fn(() => versions);
    const outcome = remediateAfterSmoke({ smokeFailed: false, target: 'production', readVersions });
    expect(outcome).toMatchObject({ action: REMEDIATION_NONE, remediated: false });
    expect(readVersions).not.toHaveBeenCalled();
  });

  // The 2026-07-30 regression: this used to execute a rollback.
  it('HALTS on production smoke failure and never executes a rollback', () => {
    const readVersions = vi.fn(() => versions);
    const outcome = remediateAfterSmoke({
      smokeFailed: true, target: 'production', deployedVersionId: 'v3-just-deployed', readVersions,
    });
    expect(outcome.action).toBe(REMEDIATION_HALTED);
    expect(outcome.remediated).toBe(false);
    expect(outcome).not.toHaveProperty('wranglerStatus');
  });

  it('resolves the rollback target live instead of from a checked-in receipt', () => {
    const readVersions = vi.fn(() => versions);
    const outcome = remediateAfterSmoke({
      smokeFailed: true, target: 'production', deployedVersionId: 'v3-just-deployed', readVersions,
    });
    expect(readVersions).toHaveBeenCalledWith('wrangler.production.jsonc');
    expect(outcome.versionId).toBe('v2-previous-good');
    // Not the stale receipt id that caused the incident.
    expect(outcome.versionId).not.toBe('2acba9fb-a44d-44ea-bf17-8955e1507cfd');
  });

  it('hands a human the exact paste-ready rollback command', () => {
    const outcome = remediateAfterSmoke({
      smokeFailed: true, target: 'production', deployedVersionId: 'v3-just-deployed', readVersions: () => versions,
    });
    expect(outcome.command).toBe(
      `npx wrangler ${rollbackWranglerArgs('production', 'v2-previous-good', 'wrangler.production.jsonc').join(' ')}`,
    );
    expect(outcome.alert).toContain('v2-previous-good');
    expect(outcome.alert).toMatch(/nothing has been rolled back automatically/i);
  });

  it('warns that a lone asset 404 is usually edge caching, not a bad build', () => {
    const outcome = remediateAfterSmoke({
      smokeFailed: true, target: 'production', deployedVersionId: 'v3-just-deployed', readVersions: () => versions,
    });
    expect(outcome.alert).toMatch(/cf-cache-status HIT is usually edge negative-caching/i);
  });

  it('still halts loudly when the version list cannot be read', () => {
    const outcome = remediateAfterSmoke({
      smokeFailed: true, target: 'production', readVersions: () => null,
    });
    expect(outcome.action).toBe(REMEDIATION_HALTED);
    expect(outcome.versionId).toBeNull();
    expect(outcome.alert).toMatch(/Inspect the deployment by hand NOW/);
  });

  it('behaves the same for staging', () => {
    const outcome = remediateAfterSmoke({
      smokeFailed: true, target: 'staging', deployedVersionId: 'v3-just-deployed', readVersions: () => versions,
    });
    expect(outcome.action).toBe(REMEDIATION_HALTED);
    expect(outcome.versionId).toBe('v2-previous-good');
  });

  it('rejects an unknown target', () => {
    expect(() => remediateAfterSmoke({ smokeFailed: true, target: 'prod' as 'production' })).toThrow(/staging or production/);
  });
});
