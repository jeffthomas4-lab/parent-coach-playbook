import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('privacy consent controls', () => {
  it('provides a persistent preference control and withdrawal signal', async () => {
    const footer = await readFile(new URL('../src/components/Footer.astro', import.meta.url), 'utf8');
    const banner = await readFile(new URL('../src/components/ConsentBanner.astro', import.meta.url), 'utf8');
    expect(footer).toContain('data-privacy-choices');
    expect(footer).toContain('Privacy choices');
    expect(banner).toContain("new Event('pcd_consent_denied')");
    expect(banner).toContain("document.getElementById('consent-accept')?.focus()");
  });

  it('disables GA and removes accessible GA cookies after withdrawal', async () => {
    const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
    const notice = await readFile(new URL('../src/pages/disclosure.astro', import.meta.url), 'utf8');
    expect(layout).toContain('pcd_consent_denied');
    expect(layout).toContain('ga-disable-${GA_ID}');
    expect(layout).toContain("name?.startsWith('_ga')");
    expect(notice).toContain('reopen <strong>Privacy choices</strong>');
  });

  it('avoids an unsubstantiated personal-use endorsement in the global footer', async () => {
    const footer = await readFile(new URL('../src/components/Footer.astro', import.meta.url), 'utf8');
    expect(footer).not.toContain('We only recommend things we use');
    expect(footer).toContain('Affiliate relationships are disclosed');
  });
});
