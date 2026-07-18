export const CAMP_VERIFICATION_REVIEW_DAYS = 90;

export type CampVerificationFreshness = 'current' | 'review_due' | 'missing';

export function campVerificationFreshness(
  verified: 0 | 1,
  lastVerifiedAt: string | null | undefined,
  now = new Date(),
): CampVerificationFreshness {
  if (verified !== 1 || !lastVerifiedAt) return 'missing';
  const reviewed = new Date(lastVerifiedAt);
  if (!Number.isFinite(reviewed.getTime()) || reviewed.getTime() > now.getTime()) return 'missing';
  const ageDays = (now.getTime() - reviewed.getTime()) / 86_400_000;
  return ageDays <= CAMP_VERIFICATION_REVIEW_DAYS ? 'current' : 'review_due';
}

export function campFreshnessLabel(state: CampVerificationFreshness): string {
  if (state === 'current') return 'Review current';
  if (state === 'review_due') return 'Review due';
  return 'Review date unavailable';
}
