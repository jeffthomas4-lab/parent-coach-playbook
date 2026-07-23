// Unit tests for src/lib/proof.ts — the pure approval helpers behind the
// curated /proof page. No I/O; just the "only approved items ever render" rule.

import { describe, it, expect } from 'vitest';
import { isApprovedItem, approvedItems, hasAnyApprovedItem, type ProofItem, type ProofFile } from '../src/lib/proof';

const item = (over: Partial<ProofItem> = {}): ProofItem => ({
  quote: 'This site helped me get the gear right.',
  name: 'A Parent',
  source: 'google',
  approved: true,
  ...over,
});

const file = (items: ProofItem[]): ProofFile => ({
  headline: 'h',
  intro: 'i',
  groups: [{ id: 'g', label: 'Group', items }],
});

describe('proof lib', () => {
  it('isApprovedItem requires approved===true plus quote, name, and source', () => {
    expect(isApprovedItem(item())).toBe(true);
    expect(isApprovedItem(item({ approved: false }))).toBe(false);
    expect(isApprovedItem(item({ quote: '   ' }))).toBe(false);
    expect(isApprovedItem(item({ name: '' }))).toBe(false);
    expect(isApprovedItem(item({ source: undefined as unknown as ProofItem['source'] }))).toBe(false);
  });

  it('approvedItems keeps only the approved items in a group', () => {
    const group = { id: 'g', label: 'G', items: [item(), item({ approved: false }), item({ name: '' })] };
    expect(approvedItems(group)).toHaveLength(1);
    expect(approvedItems({ id: 'g', label: 'G', items: [] })).toEqual([]);
  });

  it('hasAnyApprovedItem is true only when at least one group has an approved item', () => {
    expect(hasAnyApprovedItem(file([item()]))).toBe(true);
    expect(hasAnyApprovedItem(file([item({ approved: false })]))).toBe(false);
    expect(hasAnyApprovedItem({ headline: 'h', intro: 'i', groups: [] })).toBe(false);
  });
});
