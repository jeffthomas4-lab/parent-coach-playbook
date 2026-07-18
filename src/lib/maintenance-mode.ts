export function pcdMaintenanceModeActive(configured: string | undefined, at = new Date()): boolean {
  const explicit = configured?.trim().toLowerCase();
  if (explicit === 'true' || explicit === '1' || explicit === 'on') return true;
  const month = at.getUTCMonth() + 1;
  return month >= 8 && month <= 11;
}

/**
 * Write classes that must NOT be held during the August–November freeze or the
 * PCD_MAINTENANCE_MODE operator override. This is the code-enforced form of the
 * "named bypass list" described in PCD-AI-OS/00-FOUNDATIONS.md.
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
 * Ordinary writes are held whenever maintenance mode is active (the Aug–Nov
 * calendar freeze or the operator override). Exempt classes on the named bypass
 * list are never held, and the operator override cannot force them to be held.
 */
export function writeHeldDuringMaintenance(
  writeClass: string,
  configured: string | undefined,
  at = new Date(),
): boolean {
  if (isMaintenanceExemptWriteClass(writeClass)) return false;
  return pcdMaintenanceModeActive(configured, at);
}
