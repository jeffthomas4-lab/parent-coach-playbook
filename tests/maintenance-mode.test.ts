import { describe, expect, it } from 'vitest';
import {
  MAINTENANCE_EXEMPT_WRITE_CLASSES,
  isMaintenanceExemptWriteClass,
  pcdMaintenanceModeActive,
  writeHeldDuringMaintenance,
} from '../src/lib/maintenance-mode';

// The August-November calendar auto-freeze was removed 2026-08-01. Jeff is
// working PCD nightly through the season now, so maintenance mode is
// operator-controlled only: PCD_MAINTENANCE_MODE is the sole trigger.
describe('PCD maintenance mode', () => {
  it('is off by default and stays off across the former calendar boundaries', () => {
    expect(pcdMaintenanceModeActive(undefined)).toBe(false);
    expect(pcdMaintenanceModeActive('false')).toBe(false);
    expect(pcdMaintenanceModeActive('false', new Date('2026-07-31T23:59:59Z'))).toBe(false);
    expect(pcdMaintenanceModeActive('false', new Date('2026-08-01T00:00:00Z'))).toBe(false);
    expect(pcdMaintenanceModeActive('false', new Date('2026-11-30T23:59:59Z'))).toBe(false);
    expect(pcdMaintenanceModeActive('false', new Date('2026-12-01T00:00:00Z'))).toBe(false);
  });

  it('allows the operator switch to stop writes year-round', () => {
    expect(pcdMaintenanceModeActive('true')).toBe(true);
    expect(pcdMaintenanceModeActive('on')).toBe(true);
    expect(pcdMaintenanceModeActive('1')).toBe(true);
  });
});

describe('maintenance-mode write-class exemption (S4 deletion opt-out bypass)', () => {
  const insideFormerWindow = new Date('2026-09-15T12:00:00Z');
  const outsideFormerWindow = new Date('2026-01-15T12:00:00Z');

  it('names the S4 deletion opt-out proposal as an exempt write class', () => {
    expect(MAINTENANCE_EXEMPT_WRITE_CLASSES.has('deletion_opt_out_proposal')).toBe(true);
    expect(isMaintenanceExemptWriteClass('deletion_opt_out_proposal')).toBe(true);
    expect(isMaintenanceExemptWriteClass('camps_sweep')).toBe(false);
  });

  it('does not hold ordinary writes when the operator switch is off in any month', () => {
    expect(writeHeldDuringMaintenance('camps_sweep', 'false')).toBe(false);
    expect(writeHeldDuringMaintenance('camps_sweep', undefined)).toBe(false);
    expect(writeHeldDuringMaintenance('camps_sweep', 'false', insideFormerWindow)).toBe(false);
    expect(writeHeldDuringMaintenance('camps_sweep', 'false', outsideFormerWindow)).toBe(false);
  });

  it('holds ordinary writes when the operator switch is on', () => {
    expect(writeHeldDuringMaintenance('camps_sweep', 'true')).toBe(true);
    expect(writeHeldDuringMaintenance('camps_sweep', 'on')).toBe(true);
  });

  it('never holds the S4 deletion opt-out proposal, switch on or off', () => {
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'false')).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', undefined)).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'false', insideFormerWindow)).toBe(false);
  });

  // The operator override cannot suppress the S4 path, though it still holds ordinary writes.
  it('does not let the operator override suppress the S4 path', () => {
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'true', outsideFormerWindow)).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'on', insideFormerWindow)).toBe(false);
    // The same override does hold an ordinary write, proving the override is otherwise live.
    expect(writeHeldDuringMaintenance('camps_sweep', 'true')).toBe(true);
  });
});
