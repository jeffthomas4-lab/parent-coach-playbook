import { describe, expect, it } from 'vitest';
import { REQUIRED_GATES, validateReleaseEvidence } from '../scripts/release-evidence.mjs';
import packet from '../coordination/release-evidence/rc02.json';

/**
 * Clone the live packet for a GATE-LOGIC test, with the expiry pinned forward.
 *
 * Why this exists (2026-07-28): the logic tests below used a raw
 * structuredClone, so they inherited `expires_at` from the live packet. When
 * rc01 went stale on 2026-07-25 all three started failing — not because the
 * gate arithmetic regressed, but because a date passed. A unit test of gate
 * logic must not depend on what day it is, or it stops being a signal and
 * becomes noise people learn to skip.
 *
 * Expiry is still enforced: validateReleaseEvidence pushes 'packet is expired'
 * regardless of this helper, the first test reads the live packet untouched,
 * and the last test proves the clock check still bites.
 */
function cloneWithFutureExpiry(): any {
  const copy = structuredClone(packet) as any;
  copy.expires_at = new Date(Date.now() + 86_400_000).toISOString();
  return copy;
}

describe('release evidence contract', () => {
  // Reads the LIVE packet on purpose. This is the staleness canary: when the
  // packet expires or drifts out of contract it fails here and nothing else
  // has to notice. Do not hand this one cloneWithFutureExpiry().
  it('keeps the current packet structurally valid and explicitly not ready', () => {
    const result = validateReleaseEvidence(packet);
    expect(
      result.errors,
      'The live release-evidence packet is out of contract (expired, or a gate is malformed). Re-cut it with `npm run cut:release-evidence` rather than editing expires_at by hand.',
    ).toEqual([]);
    // Gates remain pending by design. The packet documents readiness; it does
    // not assert it.
    expect(result.ready).toBe(false);
  });

  it('rejects missing gates and evidence-free passes', () => {
    const copy = cloneWithFutureExpiry();
    delete copy.gates.access_policy;
    copy.gates.database_backup.state = 'pass';
    copy.gates.database_backup.evidence = [];
    expect(validateReleaseEvidence(copy).errors).toEqual(expect.arrayContaining([
      'access_policy is required',
      'database_backup cannot pass without evidence',
    ]));
  });

  it('requires every named gate to pass or have a human-approved exception', () => {
    const copy = cloneWithFutureExpiry();
    for (const gate of REQUIRED_GATES) copy.gates[gate] = { state: 'pass', summary: 'Evidence attached.', evidence: ['receipt'] };
    expect(validateReleaseEvidence(copy)).toEqual({ errors: [], ready: true });
    copy.gates.r2_recovery = { state: 'not_applicable', summary: 'No R2 change.', evidence: [] };
    expect(validateReleaseEvidence(copy).errors).toContain('r2_recovery not_applicable requires approved_by');
  });

  it('separates pre-deploy authorization from post-deploy closeout', () => {
    const copy = cloneWithFutureExpiry();
    for (const gate of REQUIRED_GATES) copy.gates[gate] = { state: 'pass', summary: 'Evidence attached.', evidence: ['receipt'] };
    copy.gates.post_deploy_observation = { state: 'pending', summary: 'Requires deployment.', evidence: [] };
    expect(validateReleaseEvidence(copy, 'predeploy').ready).toBe(true);
    expect(validateReleaseEvidence(copy, 'closeout').ready).toBe(false);
  });

  it('still rejects an expired packet, so the clock is enforced somewhere', () => {
    // The guard on the guard: proves cloneWithFutureExpiry did not quietly
    // disable expiry checking for the whole suite.
    const copy = structuredClone(packet) as any;
    copy.expires_at = '2020-01-01T00:00:00Z';
    const result = validateReleaseEvidence(copy);
    expect(result.errors).toContain('packet is expired');
    expect(result.ready).toBe(false);
  });
});
