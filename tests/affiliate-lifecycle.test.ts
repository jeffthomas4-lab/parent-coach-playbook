import { describe, expect, it } from 'vitest';
import affiliates from '../src/data/affiliates.json';
import governance from '../src/data/affiliate-governance.json';
import {
  canTransitionAffiliateLifecycle,
  PROHIBITED_REVENUE_DIMENSIONS,
  recommendationMayPublish,
  recommendationTrustScore,
  REVENUE_ATTRIBUTION_DIMENSIONS,
} from '../src/lib/affiliate-lifecycle';
import { governedAffiliateDestination, merchantForDestination } from '../src/lib/affiliate-routing';
import type { AffiliateGovernance } from '../src/lib/affiliate-routing';

const governedMerchants = governance as AffiliateGovernance;

const completeEvidence = {
  sourceCount: 2,
  sourceQuality: 90,
  verifiedAt: '2026-07-18',
  editorialReviewedAt: '2026-07-18',
  availabilityState: 'available' as const,
  correctionCount: 0,
  hasStrengths: true,
  hasWeaknesses: true,
  hasWrongFor: true,
  hasReasoning: true,
};

describe('affiliate lifecycle governance', () => {
  it('recognizes every current destination through the centralized merchant registry', () => {
    for (const entry of Object.values(affiliates)) {
      expect(merchantForDestination(new URL(entry.destination), governedMerchants)).not.toBeNull();
    }
  });

  it('preserves special links and adds first-party attribution only where governed', () => {
    const amazon = 'https://www.amazon.com/dp/example?tag=parentcoachpl-20';
    expect(governedAffiliateDestination(amazon, 'campaign', governedMerchants)).toBe(amazon);
    const bookshop = governedAffiliateDestination('https://bookshop.org/a/example', 'books', governedMerchants);
    expect(bookshop).toContain('utm_source=parentcoachdesk');
    expect(() => governedAffiliateDestination('https://unknown.example/item', 'x', governedMerchants)).toThrow(/not governed/);
  });

  it('requires legal lifecycle transitions and keeps retirement human-reversible', () => {
    expect(canTransitionAffiliateLifecycle('need_discovered', 'intent_qualified')).toBe(true);
    expect(canTransitionAffiliateLifecycle('need_discovered', 'published')).toBe(false);
    expect(canTransitionAffiliateLifecycle('retired', 'researching')).toBe(true);
  });

  it('scores evidence deterministically without allowing the score to publish', () => {
    expect(recommendationTrustScore(completeEvidence, '2026-07-18')).toBeGreaterThanOrEqual(60);
    expect(recommendationMayPublish(completeEvidence, '2026-07-18')).toEqual({ allowed: true, reasons: [] });
    expect(recommendationMayPublish({ ...completeEvidence, editorialReviewedAt: undefined, hasWeaknesses: false }, '2026-07-18')).toMatchObject({ allowed: false });
  });

  it('allows aggregate revenue attribution and prohibits family-level surveillance', () => {
    expect(REVENUE_ATTRIBUTION_DIMENSIONS).toContain('guide');
    expect(REVENUE_ATTRIBUTION_DIMENSIONS).not.toContain('city');
    expect(PROHIBITED_REVENUE_DIMENSIONS).toEqual(expect.arrayContaining(['person', 'child', 'household', 'precise_location', 'raw_search']));
  });
});
