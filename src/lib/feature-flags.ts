/** Server-side feature flags. Only the literal string "true" enables a gate. */
export function featureEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}
