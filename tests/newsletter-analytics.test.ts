import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { newsletterCtaFromHref, newsletterSignupIntentEvent } from '../src/lib/newsletter-analytics';

describe('privacy-minimized newsletter signup intent', () => {
  it('accepts only the exact governed Kit destination and allowlisted CTA locations', () => {
    const url = 'https://parentcoachdesk.kit.com/4b28f916b5';
    expect(newsletterCtaFromHref(url, 'home_hero')).toBe('home_hero');
    expect(newsletterCtaFromHref(`${url}?email=reader@example.com`, 'home_hero')).toBeNull();
    expect(newsletterCtaFromHref('https://attacker.example/4b28f916b5', 'home_hero')).toBeNull();
    expect(newsletterCtaFromHref(url, 'invented')).toBeNull();
  });

  it('emits placement only, without destination or reader data', () => {
    const event = newsletterSignupIntentEvent('newsletter_primary');
    expect(event).toEqual({
      name: 'newsletter_signup_intent',
      parameters: { cta_location: 'newsletter_primary', transport_type: 'beacon' },
    });
    expect(JSON.stringify(event)).not.toMatch(/href|url|email|user|cookie|subscriber/i);
    expect(newsletterSignupIntentEvent('unknown')).toBeNull();
  });

  it('keeps the shared Kit hosted URL and labels tracked Astro CTAs', async () => {
    const kit = await readFile('src/lib/kit.ts', 'utf8');
    expect(kit).toContain('https://parentcoachdesk.kit.com/4b28f916b5');

    const files = ['src/components/NewsletterSignup.astro', 'src/pages/index.astro', 'src/pages/newsletter.astro'];
    for (const file of files) {
      const source = await readFile(file, 'utf8');
      const literalDestinations = source.match(/parentcoachdesk\.kit\.com\/4b28f916b5/g) ?? [];
      const labeledConstantHrefs = [
        ...source.matchAll(/href=\{KIT_HOSTED_URL\}[^>]*data-newsletter-cta=/g),
        ...source.matchAll(/data-newsletter-cta=[^>]*href=\{KIT_HOSTED_URL\}/g),
      ];
      const labels = source.match(/data-newsletter-cta=/g) ?? [];
      // Literals (if any) and labeled KIT_HOSTED_URL hrefs must stay in sync with CTA labels.
      expect(labels).toHaveLength(literalDestinations.length + labeledConstantHrefs.length);
      if (source.includes('KIT_HOSTED_URL')) {
        expect(source).toMatch(/from ['"].*\/kit['"]/);
      }
    }
  });
});
