import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { newsletterCtaFromHref, newsletterSignupIntentEvent } from '../src/lib/newsletter-analytics';

describe('privacy-minimized newsletter signup intent', () => {
  it('accepts only the exact governed Kit destination and allowlisted CTA locations', () => {
    const url = 'https://parent-coach-playbook.kit.com/4b28f916b5';
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

  it('labels every direct hosted signup link in shipped Astro sources', async () => {
    const files = ['src/components/NewsletterSignup.astro', 'src/pages/index.astro', 'src/pages/newsletter.astro'];
    for (const file of files) {
      const source = await readFile(file, 'utf8');
      const destinations = source.match(/parent-coach-playbook\.kit\.com\/4b28f916b5/g) ?? [];
      const labels = source.match(/data-newsletter-cta=/g) ?? [];
      expect(labels).toHaveLength(destinations.length);
    }
  });
});
