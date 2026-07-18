import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const node = process.execPath;
const script = 'scripts/check-access-evidence.mjs';
const policy = 'coordination/release-evidence/access-policy-export-pending.json';
const probes = 'coordination/release-evidence/authenticated-access-probes-pending.json';

describe('Access evidence CLI gates', () => {
  it('accepts structurally valid pending evidence in normal CI', () => {
    expect(() => execFileSync(node, [script, policy, probes], { stdio: 'pipe' })).not.toThrow();
  });

  it('blocks production deployment while authenticated evidence is pending', () => {
    expect(() => execFileSync(node, [script, '--require-complete', policy, probes], { stdio: 'pipe' }))
      .toThrow(/Command failed/);
    try {
      execFileSync(node, [script, '--require-complete', policy, probes], { stdio: 'pipe' });
    } catch (error) {
      const stderr = String((error as { stderr?: Buffer }).stderr ?? '');
      expect(stderr).toContain('complete allowed/denied authenticated evidence is required for production deployment');
    }
  });
});
