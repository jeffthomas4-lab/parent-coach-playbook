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

// ---------- "Date added" (Camp.date_added / programs.created_at) ----------
// date_added is NOT NULL in the schema, but every UI call site still treats
// it as possibly missing/malformed — same defensive posture as the
// start_date/end_date null-safety fix (see camps-db.ts, camps/[slug].astro,
// camps/index.astro): degrade to null/false rather than throw.

const DATE_ADDED_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Parses either a bare YYYY-MM-DD date or a full ISO timestamp
// (YYYY-MM-DDTHH:MM:SS...), always as a LOCAL date/time — never UTC. Mirrors
// the local-date-parse pattern in camps/index.astro's fmtDatePart, which
// exists specifically to avoid new Date('2026-08-03') rendering as Aug 2 in
// Pacific time.
function parseLocalDateAdded(iso: string): Date | null {
  const datePart = iso.slice(0, 10);
  const [y, m, d] = datePart.split('-').map(Number);
  if (!y || !m || !d) return null;
  const timePart = iso.length > 10 ? iso.slice(11) : '';
  const timeMatch = timePart.match(/^(\d{2}):(\d{2}):?(\d{2})?/);
  const hh = timeMatch ? Number(timeMatch[1]) : 0;
  const mm = timeMatch ? Number(timeMatch[2]) : 0;
  const ss = timeMatch && timeMatch[3] ? Number(timeMatch[3]) : 0;
  const date = new Date(y, m - 1, d, hh, mm, ss);
  if (!Number.isFinite(date.getTime())) return null;
  // Guard against rollover from an out-of-range day/month (e.g. 2026-13-40).
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  return date;
}

/**
 * Short human date for the "date added" UI, e.g. "Jul 22, 2026". Null-safe:
 * returns null on missing, empty, or unparseable input so callers can degrade
 * to showing nothing instead of throwing or rendering "Invalid Date".
 */
export function formatDateAdded(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = parseLocalDateAdded(iso);
  if (!date) return null;
  return `${DATE_ADDED_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Days between the given date_added and `now`. Null-safe: returns null on
 * missing/unparseable input instead of NaN.
 */
export function daysSinceAdded(iso: string | null | undefined, now = new Date()): number | null {
  if (!iso) return null;
  const date = parseLocalDateAdded(iso);
  if (!date) return null;
  const nowTime = now.getTime();
  if (!Number.isFinite(nowTime)) return null;
  return Math.floor((nowTime - date.getTime()) / 86_400_000);
}

/**
 * True when date_added falls within the last `withinDays` days of `now`.
 * Null-safe and future-date-safe: returns false rather than throwing or
 * reporting a negative age as "recent".
 */
export function isRecentlyAdded(iso: string | null | undefined, withinDays = 30, now = new Date()): boolean {
  const days = daysSinceAdded(iso, now);
  if (days === null) return false;
  return days >= 0 && days <= withinDays;
}
