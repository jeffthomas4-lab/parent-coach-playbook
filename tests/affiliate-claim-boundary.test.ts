import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('affiliate claim boundary', () => {
  it('keeps affiliate disclosures conspicuous without unsupported personal-use endorsements', async () => {
    const [disclosure, guide, about] = await Promise.all([
      source('src/pages/disclosure.astro'),
      source('src/components/BuyingGuideDisclosure.astro'),
      source('src/pages/about.astro'),
    ]);
    const publicCopy = `${disclosure}\n${guide}\n${about}`;
    expect(publicCopy).toMatch(/affiliate/i);
    expect(publicCopy).not.toMatch(/only recommend gear we would buy|only link to gear we would buy|put on our own kid/i);
    expect(publicCopy).toMatch(/review the product details and seller terms before buying/i);
  });
});
