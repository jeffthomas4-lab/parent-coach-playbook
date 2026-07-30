import { describe, expect, it } from 'vitest';
import {
  CAMP_VERIFICATION_REVIEW_DAYS,
  campFreshnessLabel,
  campVerificationFreshness,
  daysSinceAdded,
  formatDateAdded,
  isRecentlyAdded,
  type CampVerificationFreshness,
} from '../src/lib/camp-freshness';

const now = new Date('2026-07-18T12:00:00Z');

describe('camp verification freshness', () => {
  it('keeps the published policy boundary deterministic', () => {
    expect(CAMP_VERIFICATION_REVIEW_DAYS).toBe(90);
    expect(campVerificationFreshness(1, '2026-04-19T12:00:00Z', now)).toBe('current');
    expect(campVerificationFreshness(1, '2026-04-18T11:59:59Z', now)).toBe('review_due');
  });

  it('does not invent freshness when evidence is absent, invalid, future-dated, or unverified', () => {
    expect(campVerificationFreshness(0, '2026-07-18T00:00:00Z', now)).toBe('missing');
    expect(campVerificationFreshness(1, null, now)).toBe('missing');
    expect(campVerificationFreshness(1, 'not-a-date', now)).toBe('missing');
    expect(campVerificationFreshness(1, '2026-07-19T00:00:00Z', now)).toBe('missing');
  });

  it('uses plain-language labels without implying safety or endorsement', () => {
    const states: CampVerificationFreshness[] = ['current', 'review_due', 'missing'];
    expect(states.map(campFreshnessLabel))
      .toEqual(['Review current', 'Review due', 'Review date unavailable']);
  });
});

// date_added is NOT NULL in the schema, so the null-safety in these three
// functions only ever fires on bad data. That is exactly why it needs tests:
// the paths that matter are the ones nothing normal exercises. A parser that
// silently rolls 2026-13-40 over into 2027 would put a wrong "added" date on a
// public camp listing and nothing would flag it.
describe('date added parsing', () => {
  // Deliberately local, not UTC. new Date('2026-08-03') parses as UTC midnight,
  // which renders as Aug 2 in Pacific — the bug this parser exists to avoid.
  const localNow = new Date(2026, 6, 30, 12, 0, 0); // 2026-07-30 12:00 local

  describe('formatDateAdded', () => {
    it('formats a bare date and a full timestamp the same way, in local time', () => {
      expect(formatDateAdded('2026-07-22')).toBe('Jul 22, 2026');
      expect(formatDateAdded('2026-07-22T23:45:10Z')).toBe('Jul 22, 2026');
      expect(formatDateAdded('2026-07-22T23:45')).toBe('Jul 22, 2026');
      expect(formatDateAdded('2026-08-03')).toBe('Aug 3, 2026');
    });

    it('covers every month name rather than trusting the array order', () => {
      const months = Array.from({ length: 12 }, (_, i) =>
        formatDateAdded(`2026-${String(i + 1).padStart(2, '0')}-15`));
      expect(months).toEqual([
        'Jan 15, 2026', 'Feb 15, 2026', 'Mar 15, 2026', 'Apr 15, 2026',
        'May 15, 2026', 'Jun 15, 2026', 'Jul 15, 2026', 'Aug 15, 2026',
        'Sep 15, 2026', 'Oct 15, 2026', 'Nov 15, 2026', 'Dec 15, 2026',
      ]);
    });

    it('returns null rather than "Invalid Date" on missing or unparseable input', () => {
      expect(formatDateAdded(null)).toBeNull();
      expect(formatDateAdded(undefined)).toBeNull();
      expect(formatDateAdded('')).toBeNull();
      expect(formatDateAdded('not-a-date')).toBeNull();
      expect(formatDateAdded('0000-00-00')).toBeNull();
      expect(formatDateAdded('2026-00-15')).toBeNull();
      expect(formatDateAdded('2026-07-00')).toBeNull();
    });

    it('refuses an out-of-range day or month instead of letting it roll over', () => {
      // Without the rollover guard these become Jan 9 2027 and Jul 3 2026.
      expect(formatDateAdded('2026-13-40')).toBeNull();
      expect(formatDateAdded('2026-06-32')).toBeNull();
      expect(formatDateAdded('2026-02-30')).toBeNull();
    });
  });

  describe('daysSinceAdded', () => {
    it('counts whole days back from now', () => {
      expect(daysSinceAdded('2026-07-30', localNow)).toBe(0);
      expect(daysSinceAdded('2026-07-29', localNow)).toBe(1);
      expect(daysSinceAdded('2026-06-30', localNow)).toBe(30);
    });

    it('returns null on missing or unparseable input instead of NaN', () => {
      expect(daysSinceAdded(null, localNow)).toBeNull();
      expect(daysSinceAdded(undefined, localNow)).toBeNull();
      expect(daysSinceAdded('', localNow)).toBeNull();
      expect(daysSinceAdded('garbage', localNow)).toBeNull();
    });

    it('returns null when `now` itself is an invalid date', () => {
      expect(daysSinceAdded('2026-07-22', new Date('nope'))).toBeNull();
    });

    it('reports a future date as negative rather than clamping it', () => {
      expect(daysSinceAdded('2026-08-30', localNow)).toBeLessThan(0);
    });
  });

  describe('isRecentlyAdded', () => {
    it('includes both ends of the window', () => {
      expect(isRecentlyAdded('2026-07-30', 30, localNow)).toBe(true);
      expect(isRecentlyAdded('2026-06-30', 30, localNow)).toBe(true);
      expect(isRecentlyAdded('2026-06-29', 30, localNow)).toBe(false);
    });

    it('honours a custom window', () => {
      expect(isRecentlyAdded('2026-07-24', 7, localNow)).toBe(true);
      expect(isRecentlyAdded('2026-07-22', 7, localNow)).toBe(false);
    });

    it('never calls a future or unparseable date recent', () => {
      expect(isRecentlyAdded('2026-08-30', 30, localNow)).toBe(false);
      expect(isRecentlyAdded(null, 30, localNow)).toBe(false);
      expect(isRecentlyAdded('garbage', 30, localNow)).toBe(false);
    });
  });
});
