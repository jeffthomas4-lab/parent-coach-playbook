import { describe, expect, it } from 'vitest';
import { approvalGates, canTransition, chooseCannibalizationDecision } from '../src/lib/editorial-lifecycle';

describe('editorial lifecycle', () => {
  it('enforces ordered transitions', () => { expect(canTransition('drafting', 'claims_validated')).toBe(true); expect(canTransition('drafting', 'published')).toBe(false); });
  it('requires every approval gate', () => { const result = approvalGates({ sourceCount: 0, claimsValidated: true, editorialReviewed: true, seoReviewed: true, relationshipsMapped: true, humanApproved: true, hasFlags: false }); expect(result.ok).toBe(false); expect(result.missing).toContain('at least one reviewed source'); });
  it('stops unsupported opportunities before URL creation', () => { expect(chooseCannibalizationDecision({ existingMatch: false, distinctIntent: true, structuredDirectoryFit: false, evidenceSufficient: false })).toBe('insufficient_evidence'); });
  it('prefers consolidation for duplicate intent', () => { expect(chooseCannibalizationDecision({ existingMatch: true, distinctIntent: false, structuredDirectoryFit: false, evidenceSufficient: true })).toBe('consolidate'); });
});
