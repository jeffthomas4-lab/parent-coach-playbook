import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const node = process.execPath;
const script = 'scripts/check-access-evidence.mjs';
const policy = 'coordination/release-evidence/access-policy-export-pending.json';
const probes = 'coordination/release-evidence/authenticated-access-probes-pending.json';

describe('Access evidence CLI gates', () => {
  it('accepts complete evidence in normal CI', () => {
    expect(() => execFileSync(node, [script, policy, probes], { stdio: 'pipe' })).not.toThrow();
  });

  it('accepts complete evidence for production deployment', () => {
    expect(() => execFileSync(node, [script, '--require-complete', policy, probes], { stdio: 'pipe' }))
      .not.toThrow();
  });
});
