import { describe, expect, it } from 'vitest';
import { REQUIRED_GATES, validateReleaseEvidence } from '../scripts/release-evidence.mjs';
import packet from '../coordination/release-evidence/rc01.json';

describe('release evidence contract', () => {
  it('keeps the current structurally valid packet explicitly not ready', () => {
    const result = validateReleaseEvidence(packet);
    expect(result.errors).toEqual([]);
    expect(result.ready).toBe(false);
  });

  it('rejects missing gates and evidence-free passes', () => {
    const copy = structuredClone(packet) as any;
    delete copy.gates.access_policy;
    copy.gates.database_backup.state = 'pass';
    copy.gates.database_backup.evidence = [];
    expect(validateReleaseEvidence(copy).errors).toEqual(expect.arrayContaining([
      'access_policy is required',
      'database_backup cannot pass without evidence',
    ]));
  });

  it('requires every named gate to pass or have a human-approved exception', () => {
    const copy = structuredClone(packet) as any;
    for (const gate of REQUIRED_GATES) copy.gates[gate] = { state: 'pass', summary: 'Evidence attached.', evidence: ['receipt'] };
    expect(validateReleaseEvidence(copy)).toEqual({ errors: [], ready: true });
    copy.gates.r2_recovery = { state: 'not_applicable', summary: 'No R2 change.', evidence: [] };
    expect(validateReleaseEvidence(copy).errors).toContain('r2_recovery not_applicable requires approved_by');
  });

  it('separates pre-deploy authorization from post-deploy closeout', () => {
    const copy = structuredClone(packet) as any;
    for (const gate of REQUIRED_GATES) copy.gates[gate] = { state: 'pass', summary: 'Evidence attached.', evidence: ['receipt'] };
    copy.gates.post_deploy_observation = { state: 'pending', summary: 'Requires deployment.', evidence: [] };
    expect(validateReleaseEvidence(copy, 'predeploy').ready).toBe(true);
    expect(validateReleaseEvidence(copy, 'closeout').ready).toBe(false);
  });
});
