import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('public camp verification methodology', () => {
  it('defines evidence, freshness, correction, limits, and commercial separation', async () => {
    const page = await readFile('src/pages/camps/verification.astro', 'utf8');
    expect(page).toContain('What “Verified” means for a camp listing.');
    expect(page).toContain('identified source domain');
    expect(page).toContain('HTTPS provider or registration page');
    expect(page).toContain('review date is recorded');
    expect(page).toContain('not a background check');
    expect(page).toContain('Request a camp correction or removal');
    expect(page).toContain('Verification cannot be purchased');
  });

  it('links the directory badges and detail explanation to the methodology', async () => {
    const [index, detail] = await Promise.all([
      readFile('src/pages/camps/index.astro', 'utf8'),
      readFile('src/pages/camps/[slug].astro', 'utf8'),
    ]);
    expect(index.match(/href="\/camps\/verification\/"/g)).toHaveLength(2);
    expect(detail).toContain('Read the methodology');
    expect(detail).toContain('href="/camps/verification/"');
  });
});
