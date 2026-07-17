import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('public assurance claim boundaries', () => {
  it('describes WCAG as a target while conformance evidence is pending', async () => {
    const page = await readFile(new URL('../src/pages/accessibility.astro', import.meta.url), 'utf8');
    expect(page).toContain('as its conformance target');
    expect(page).toContain('do not claim that every page currently conforms');
    expect(page).not.toContain('Parent Coach Desk is built to conform');
  });

  it('does not publish unsupported certification claims in public page source', async () => {
    const publicPages = ['terms.astro', 'disclosure.astro', 'accessibility.astro', 'about.astro'];
    for (const file of publicPages) {
      const page = await readFile(new URL(`../src/pages/${file}`, import.meta.url), 'utf8');
      expect(page, file).not.toMatch(/SOC 2 (?:compliant|certified)|ISO(?:\/IEC)? \d+ (?:compliant|certified)|fully accessible/i);
    }
  });
});
