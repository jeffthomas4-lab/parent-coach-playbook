import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import registry from '../src/data/parent-coach-approved.json';
import type { ApprovedProduct, ApprovedRegistry } from '../src/lib/parent-coach-approved';
import { validateApprovedRegistry } from '../src/lib/parent-coach-approved';

const qualified: ApprovedProduct = {
  slug: 'test-glove',
  name: 'Test Glove',
  sport: 'baseball',
  status: 'approved',
  use_weeks: 12,
  alternative_slugs: ['alt-one', 'alt-two'],
  wear_evidence_refs: ['evidence:week-4'],
  verdict: 'Held up.',
  wrong_for: 'Wide hands.',
  skip_category_when: 'A loaner fits.',
  paid_placement: false,
  approved_by: 'Jeff Thomas',
  approved_at: '2026-07-18',
};

describe('Parent Coach Approved product-mark foundation', () => {
  it('keeps the registry valid and honestly empty', () => {
    expect(validateApprovedRegistry(registry as ApprovedRegistry)).toEqual({ valid: true, errors: [] });
    expect(registry.state).toBe('foundation_no_awards');
    expect(registry.products).toEqual([]);
  });

  it('requires complete evidence and commercial separation', () => {
    const active: ApprovedRegistry = { ...registry, state: 'active', products: [qualified] };
    expect(validateApprovedRegistry(active)).toEqual({ valid: true, errors: [] });
    expect(validateApprovedRegistry({
      ...active,
      products: [{
        ...qualified,
        use_weeks: 11,
        alternative_slugs: ['alt-one'],
        wear_evidence_refs: [''],
        approved_at: '2026-02-30',
        paid_placement: true,
      }],
    }).valid).toBe(false);
  });

  it('separates product methodology from camp verification', async () => {
    const [page, camps] = await Promise.all([
      readFile('src/pages/parent-coach-approved.astro', 'utf8'),
      readFile('src/pages/camps/verification.astro', 'utf8'),
    ]);
    expect(page).toContain('It is not yet awarded to any product');
    expect(page).toContain('No automated badge awards');
    expect(camps).toContain('What “Verified” means for a camp listing.');
  });
});
