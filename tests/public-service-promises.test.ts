import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const load = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('public service promise contract', () => {
  it('does not promise response times or guaranteed human receipt before support is staffed and drilled', async () => {
    const surfaces = (await Promise.all([
      load('src/pages/camps/submit.astro'),
      load('src/pages/camps/index.astro'),
      load('src/pages/camps/[slug].astro'),
      load('src/pages/api/camps/[slug]/claim.ts'),
      load('src/pages/about/corrections.astro'),
      load('src/pages/resources/national-organizations.astro'),
      load('src/pages/why-we-exist.astro'),
      load('src/pages/about.astro'),
      load('src/pages/newsletter.astro'),
      load('src/pages/disclosure.astro'),
    ])).join('\n');

    expect(surfaces).not.toMatch(/within (?:a few|\d+) (?:business )?days?/i);
    expect(surfaces).not.toMatch(/~\d+ business days?/i);
    expect(surfaces).not.toMatch(/answer every correction email/i);
    expect(surfaces).not.toMatch(/real people read it/i);
    expect(surfaces).not.toMatch(/correct corrections fast/i);
    expect(surfaces).not.toMatch(/wherever you live/i);
    expect(surfaces).not.toMatch(/handle it within 30 days/i);
    expect(surfaces).not.toMatch(/nothing to opt out of/i);
    expect(surfaces).toContain('review timing varies');
    expect(surfaces).toContain('Timing varies with the evidence');
  });
});
