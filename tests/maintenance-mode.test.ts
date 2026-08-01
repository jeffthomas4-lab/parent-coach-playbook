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
  it('is off by default, with no calendar boundary in play', () => {
    expect(pcdMaintenanceModeActive(undefined)).toBe(false);
    expect(pcdMaintenanceModeActive('false')).toBe(false);
  });

  it('allows the operator switch to stop writes year-round', () => {
    expect(pcdMaintenanceModeActive('true')).toBe(true);
    expect(pcdMaintenanceModeActive('on')).toBe(true);
    expect(pcdMaintenanceModeActive('1')).toBe(true);
  });
});

describe('maintenance-mode write-class exemption (S4 deletion opt-out bypass)', () => {
  it('names the S4 deletion opt-out proposal as an exempt write class', () => {
    expect(MAINTENANCE_EXEMPT_WRITE_CLASSES.has('deletion_opt_out_proposal')).toBe(true);
    expect(isMaintenanceExemptWriteClass('deletion_opt_out_proposal')).toBe(true);
    expect(isMaintenanceExemptWriteClass('camps_sweep')).toBe(false);
  });

  // (a) ordinary writes run free when the operator switch is off.
  it('does not hold ordinary writes when the operator switch is off', () => {
    expect(writeHeldDuringMaintenance('camps_sweep', 'false')).toBe(false);
    expect(writeHeldDuringMaintenance('camps_sweep', undefined)).toBe(false);
  });

  // (b) ordinary writes are held when the operator switch is on.
  it('holds ordinary writes when the operator switch is on', () => {
    expect(writeHeldDuringMaintenance('camps_sweep', 'true')).toBe(true);
    expect(writeHeldDuringMaintenance('camps_sweep', 'on')).toBe(true);
  });

  // (c) the S4 path is never held, on or off.
  it('never holds the S4 deletion opt-out proposal, switch on or off', () => {
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'false')).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', undefined)).toBe(false);
  });

  // (d) the operator override cannot suppress the S4 path, though it still holds ordinary writes.
  it('does not let the operator override suppress the S4 path', () => {
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'true')).toBe(false);
    expect(writeHeldDuringMaintenance('deletion_opt_out_proposal', 'on')).toBe(false);
    // The same override does hold an ordinary write, proving the override is otherwise live.
    expect(writeHeldDuringMaintenance('camps_sweep', 'true')).toBe(true);
  });
});
