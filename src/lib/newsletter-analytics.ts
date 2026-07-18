const KIT_SIGNUP = 'https://parent-coach-playbook.kit.com/4b28f916b5';
const CTA_LOCATIONS = new Set(['home_hero', 'site_banner', 'newsletter_primary', 'newsletter_secondary']);

export function newsletterCtaFromHref(href: string, cta: string | undefined): string | null {
  if (!cta || !CTA_LOCATIONS.has(cta)) return null;
  try {
    const target = new URL(href, 'https://parentcoachdesk.com');
    return target.href === KIT_SIGNUP ? cta : null;
  } catch {
    return null;
  }
}

export function newsletterSignupIntentEvent(cta: string) {
  if (!CTA_LOCATIONS.has(cta)) return null;
  return { name: 'newsletter_signup_intent', parameters: { cta_location: cta, transport_type: 'beacon' } };
}
