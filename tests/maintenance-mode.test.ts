import { describe, expect, it } from 'vitest';
import { pcdMaintenanceModeActive } from '../src/lib/maintenance-mode';

describe('PCD maintenance mode', () => {
  it('enforces the August-November calendar boundary even when config is false', () => {
    expect(pcdMaintenanceModeActive('false', new Date('2026-07-31T23:59:59Z'))).toBe(false);
    expect(pcdMaintenanceModeActive('false', new Date('2026-08-01T00:00:00Z'))).toBe(true);
    expect(pcdMaintenanceModeActive('false', new Date('2026-11-30T23:59:59Z'))).toBe(true);
    expect(pcdMaintenanceModeActive('false', new Date('2026-12-01T00:00:00Z'))).toBe(false);
  });

  it('allows the operator switch to stop writes year-round', () => {
    expect(pcdMaintenanceModeActive('true', new Date('2026-01-01T00:00:00Z'))).toBe(true);
    expect(pcdMaintenanceModeActive('on', new Date('2026-01-01T00:00:00Z'))).toBe(true);
  });
});
