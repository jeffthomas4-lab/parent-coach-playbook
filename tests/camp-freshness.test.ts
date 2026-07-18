import { describe, expect, it } from 'vitest';
import { CAMP_VERIFICATION_REVIEW_DAYS, campFreshnessLabel, campVerificationFreshness, type CampVerificationFreshness } from '../src/lib/camp-freshness';

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
