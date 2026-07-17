import { describe, expect, it } from 'vitest';
import receipt from '../coordination/release-evidence/staging-worker-rollback-rehearsal-2026-07-17.json';

describe('staging Worker rollback rehearsal receipt', () => {
  it('proves a compatible staging-only rollback was restored to its original version', () => {
    expect(receipt.environment).toBe('staging');
    expect(receipt.result).toBe('pass');
    expect(receipt.initial_version).toBe(receipt.restored_version);
    expect(receipt.initial_version).not.toBe(receipt.rollback_version);
    expect(receipt.scope).toContain('No D1, R2, KV');
    expect(receipt.limitations).toEqual(expect.arrayContaining([
      expect.stringContaining('Production Worker traffic was not changed.'),
      expect.stringContaining('does not roll back or test restoration of D1, R2, KV'),
    ]));
  });

  it('records successful public, health, and readiness checks after rollback and restore', () => {
    for (const phase of [receipt.health_checks.after_rollback, receipt.health_checks.after_restore]) {
      expect(phase).toEqual(expect.arrayContaining([
        expect.objectContaining({ path: '/', status: 200 }),
        expect.objectContaining({ path: '/api/health', status: 200 }),
        expect.objectContaining({ path: '/api/ready', status: 200 }),
      ]));
    }
  });
});
