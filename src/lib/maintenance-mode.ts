export function pcdMaintenanceModeActive(configured: string | undefined, at = new Date()): boolean {
  const explicit = configured?.trim().toLowerCase();
  if (explicit === 'true' || explicit === '1' || explicit === 'on') return true;
  const month = at.getUTCMonth() + 1;
  return month >= 8 && month <= 11;
}
