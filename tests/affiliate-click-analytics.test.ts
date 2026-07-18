import { describe, expect, it } from 'vitest';
import { affiliateClickEvent, affiliateSlugFromHref } from '../src/lib/affiliate-analytics';

describe('privacy-minimized affiliate click analytics', () => {
  it('accepts only same-origin governed redirect slugs', () => {
    const origin = 'https://parentcoachdesk.com';
    expect(affiliateSlugFromHref('/go/soccer-ball/', origin)).toBe('soccer-ball');
    expect(affiliateSlugFromHref('https://parentcoachdesk.com/go/first-aid', origin)).toBe('first-aid');
    expect(affiliateSlugFromHref('https://retailer.example/go/soccer-ball/', origin)).toBeNull();
    expect(affiliateSlugFromHref('/go/soccer-ball/?email=reader', origin)).toBeNull();
    expect(affiliateSlugFromHref('/go/%2Fadmin/', origin)).toBeNull();
  });

  it('emits only an aggregate slug and transport hint', () => {
    const event = affiliateClickEvent('soccer-ball');
    expect(event).toEqual({
      name: 'affiliate_outbound_click',
      parameters: { affiliate_slug: 'soccer-ball', transport_type: 'beacon' },
    });
    expect(JSON.stringify(event)).not.toMatch(/destination|href|email|user|cookie|price/i);
    expect(affiliateClickEvent('../escape')).toBeNull();
  });
});
