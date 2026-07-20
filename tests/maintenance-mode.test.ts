import { describe, expect, it } from 'vitest';
import {
  MAINTENANCE_EXEMPT_WRITE_CLASSES,
  isMaintenanceExemptWriteClass,
  pcdMaintenanceModeActive,
  writeHeldDuringMaintenance,
} from '../src/lib/maintenance-mode';

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

describe('maintenance-mode write-class exemption (S4 deletion opt-out bypass)', () => {
  const insideWindow = new Date('2026-09-15T12:00:00Z'); // Aug–Nov freeze
  const outsideWindow = new Date('2026-01-15T12:00:00Z');

  it('names the S4 deletion opt-out proposal as an exempt write class', () => {
    expect(MAINTENANCE_EXEMPT_WRITE_CLASSES.has('deletion_opt_out_proposal')).toBe(true);
    expect(isMaintenanceExemptWriteClass('deletion_opt_out_proposal')).toBe(true);
    expect(isMaintenanceExemptWriteClass('camps_sweep')).toBe(false);
  });

  // (a) ordinary writes are held across the whole Aug 1 – Nov 30 window.
  it('holds ordinary writes during the August 1 – November 30 freeze', () => {
    expect(writeHeldDuringMaintenance('camps_sweep', 'false', new Date('2026-08-01T00:00:00Z'))).toBe(true);
    expect(writeHeldDuringMaintenance('camps_sweep', 'false', insideWindow)).toBe(true);
    expect(writeHeldDuringMaintenance('camps_sweep', 'false', new Date('2026-11-30T23:59:59Z'))).toBe(true);
    // ...and are free again outside the window.
    expect(writeHeldDuringMaintenance('camps_sweep', 'false', outsideWindow)).toBe(false);
  });

  // (b) the S4 path succeeds (is never held) inside the freeze window.
  it('never holds the S4 deletion opt-out proposal inside the freeze window', () => {
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'false', new Date('2026-08-01T00:00:00Z'))).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'false', insideWindow)).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'false', new Date('2026-11-30T23:59:59Z'))).toBe(false);
  });

  // (c) the operator override cannot suppress the S4 path, though it still holds ordinary writes.
  it('does not let the operator override suppress the S4 path', () => {
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'true', outsideWindow)).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'on', insideWindow)).toBe(false);
    // The same override does hold an ordinary write, proving the override is otherwise live.
    expect(writeHeldDuringMaintenance('camps_sweep', 'true', outsideWindow)).toBe(true);
  });
});
