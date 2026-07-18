import { describe, expect, it } from 'vitest';
import {
  correctionOpportunityAdapter,
  demandOpportunityAdapter,
  sanitizeOpportunitySignal,
  unimplementedOpportunityAdapter,
} from '../src/lib/editorial-opportunity-intake';
import { makeFakeD1 } from './helpers/d1';

describe('sanitizeOpportunitySignal', () => {
  it('redacts email, url, and phone content from a raw summary', () => {
    const result = sanitizeOpportunitySignal({
      source: 'support',
      summary: 'Parent jane@example.com asked about https://example.com and called 206-555-0100 about camp dates.',
    });
    expect(result?.signalSummary).not.toMatch(/@/);
    expect(result?.signalSummary).not.toContain('example.com');
    expect(result?.signalSummary).not.toMatch(/206-555-0100/);
    expect(result?.redacted).toBe(true);
  });

  it('bounds the summary and target keyword lengths', () => {
    const result = sanitizeOpportunitySignal({
      source: 'gsc', summary: 'x'.repeat(1000), targetKeywordHint: 'y'.repeat(500),
    });
    expect(result?.signalSummary.length).toBe(500);
    expect(result?.targetKeyword?.length).toBe(200);
  });

  it('rejects an unknown source and a non-string summary', () => {
    expect(sanitizeOpportunitySignal({ source: 'not_a_real_source' as any, summary: 'x' })).toBeNull();
    expect(sanitizeOpportunitySignal({ source: 'gsc', summary: 123 as any })).toBeNull();
  });

  it('returns null for a summary that is entirely redacted away or empty', () => {
    expect(sanitizeOpportunitySignal({ source: 'gsc', summary: '   ' })).toBeNull();
  });

  it('drops an unrecognized content-type hint instead of trusting it', () => {
    const result = sanitizeOpportunitySignal({ source: 'gsc', summary: 'coverage gap', contentTypeHint: 'blog_post' });
    expect(result?.contentType).toBeNull();
  });
});

describe('demandOpportunityAdapter', () => {
  it('produces no_result signals for zero-result queries and search signals for stale-coverage queries', async () => {
    const fake = makeFakeD1();
    fake.queueAll([
      { query: 'flag football camp seattle', searches: 12, zero_result_searches: 9, last_seen_at: '2026-07-17T00:00:00Z' },
      { query: 'lacrosse pads sizing', searches: 6, zero_result_searches: 0, last_seen_at: '2026-07-17T00:00:00Z' },
    ]);
    const adapter = demandOpportunityAdapter(fake.db as any, [], '2026-07-18T00:00:00Z');
    const signals = await adapter.collect();
    expect(signals).toHaveLength(2);
    expect(signals[0]).toEqual(expect.objectContaining({ source: 'no_result', targetKeywordHint: 'flag football camp seattle' }));
    expect(signals[1]).toEqual(expect.objectContaining({ source: 'search', targetKeywordHint: 'lacrosse pads sizing' }));
    for (const signal of signals) expect(sanitizeOpportunitySignal(signal)).not.toBeNull();
  });

  it('excludes queries whose coverage is already current', async () => {
    const fake = makeFakeD1();
    fake.queueAll([{ query: 'covered query', searches: 5, zero_result_searches: 0, last_seen_at: '2026-07-17T00:00:00Z' }]);
    const adapter = demandOpportunityAdapter(fake.db as any, [{ query: 'covered query', status: 'current', route: '/guides/covered/' }], '2026-07-18T00:00:00Z');
    expect(await adapter.collect()).toEqual([]);
  });
});

describe('correctionOpportunityAdapter', () => {
  it('turns each correction log entry into a refresh candidate signal', async () => {
    const adapter = correctionOpportunityAdapter([
      { date: '2026-05-05', piece: 'Sample piece', url: '/sample/', change: 'Fixed a stale link.', reason: 'Internal audit.' },
    ]);
    const signals = await adapter.collect();
    expect(signals).toEqual([expect.objectContaining({ source: 'correction', ref: 'correction:/sample/' })]);
  });
});

describe('unimplementedOpportunityAdapter', () => {
  it('throws a descriptive error naming the missing dependency instead of returning fabricated signals', async () => {
    const adapter = unimplementedOpportunityAdapter('gsc');
    await expect(adapter.collect()).rejects.toThrow(/Google Search Console/);
  });

  it('covers every opportunity source not backed by a real adapter', () => {
    const sources = ['gsc', 'camp_gap', 'affiliate_gap', 'seasonal', 'newsletter', 'support', 'competitor', 'emerging_trend'] as const;
    for (const source of sources) expect(() => unimplementedOpportunityAdapter(source)).not.toThrow();
  });
});
