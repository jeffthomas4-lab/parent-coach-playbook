// The August-November calendar auto-freeze was removed 2026-08-01. Jeff is
// working PCD nightly through the season, so the "founder unavailable
// four months a year" assumption behind the old freeze no longer holds.
// Maintenance mode is now operator-controlled only: PCD_MAINTENANCE_MODE
// stays as a manual lever so Jeff can still pause writes deliberately.
export function pcdMaintenanceModeActive(configured: string | undefined): boolean {
  const explicit = configured?.trim().toLowerCase();
  return explicit === 'true' || explicit === '1' || explicit === 'on';
}

/**
 * Write classes that must NOT be held by the PCD_MAINTENANCE_MODE operator
 * override. This is the code-enforced form of the "named bypass list"
 * described in PCD-AI-OS/00-FOUNDATIONS.md.
 *
 * `deletion_opt_out_proposal` is the S4 deletion opt-out watch: a legal-clock
 * obligation whose 30-day SLA does not pause for football season. Vera stages
 * the proposal (she never commits), but the staging itself must never be held
 * by maintenance mode, and the operator override must not be able to suppress
 * it. Keeping the exempt set here — rather than in agent prompts — makes the
 * exemption provable instead of honor-system.
 */
export const MAINTENANCE_EXEMPT_WRITE_CLASSES: ReadonlySet<string> = new Set([
  'deletion_opt_out_proposal',
]);

export function isMaintenanceExemptWriteClass(writeClass: string): boolean {
  return MAINTENANCE_EXEMPT_WRITE_CLASSES.has(writeClass);
}

/**
 * Whether a write of the given class is held by maintenance mode.
 *
 * Ordinary writes are held only when the PCD_MAINTENANCE_MODE operator
 * override is on. Exempt classes on the named bypass list are never held,
 * and the operator override cannot force them to be held.
 */
export function writeHeldDuringMaintenance(
  writeClass: string,
  configured: string | undefined,
): boolean {
  if (isMaintenanceExemptWriteClass(writeClass)) return false;
  return pcdMaintenanceModeActive(configured);
}
