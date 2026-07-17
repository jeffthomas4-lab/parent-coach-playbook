import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('newsletter provider boundary', () => {
  it('uses the hosted provider form while leaving delivery proof explicitly launch-gated', async () => {
    const [component, newsletter, disclosure] = await Promise.all([
      readFile(new URL('../src/components/NewsletterSignup.astro', import.meta.url), 'utf8'),
      readFile(new URL('../src/pages/newsletter.astro', import.meta.url), 'utf8'),
      readFile(new URL('../src/pages/disclosure.astro', import.meta.url), 'utf8'),
    ]);
    expect(component).toContain('https://parent-coach-playbook.kit.com/4b28f916b5');
    expect(component).toContain('confirmation, redirect,\n// suppression, delivery, and failure behavior remain launch-gated');
    expect(newsletter).toContain('Kit’s hosted page, which shows an unsubscribe option');
    expect(disclosure).toContain('controlled proof of consent, confirmation, suppression, failure handling, and provider configuration');
    expect(disclosure).toContain('future marketing sends must be suppressed before delivery is activated');
    expect(`${component}\n${newsletter}\n${disclosure}`).not.toMatch(/unsubscribe in one click/i);
  });
});
