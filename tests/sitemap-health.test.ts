import { describe, expect, it } from 'vitest';
import { campSitemapResponseMeta } from '../src/lib/sitemap-health';

describe('camp sitemap failure semantics', () => {
  it('returns a retryable non-cacheable failure for an empty required sitemap', () => {
    expect(campSitemapResponseMeta(0)).toEqual({
      status: 503,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store',
        'Retry-After': '3600',
      },
    });
  });

  it('serves populated camp sitemaps normally with bounded caching', () => {
    expect(campSitemapResponseMeta(12)).toEqual({
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  });

  it('rejects invalid counts instead of guessing', () => {
    expect(() => campSitemapResponseMeta(-1)).toThrow('invalid sitemap URL count');
    expect(() => campSitemapResponseMeta(1.5)).toThrow('invalid sitemap URL count');
  });
});
