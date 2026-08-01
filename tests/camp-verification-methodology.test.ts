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
    // The verified badge markup (including its link to this methodology
    // page) was extracted out of index.astro into a single shared helper,
    // verifiedHtml() in src/lib/camp-card.ts, on 2026-07-31 (Pillar 14 fix,
    // open item #74) — used by both the standard card renderer and the
    // Featured rail renderer. Before that extraction each renderer carried
    // its own inline copy of the link, so the source literally contained it
    // twice; now there is one reviewed occurrence that both renderers call,
    // so every verified card (standard or featured) still links out, just
    // from one place in source instead of two.
    const [index, cardRenderer, detail] = await Promise.all([
      readFile('src/pages/camps/index.astro', 'utf8'),
      readFile('src/lib/camp-card.ts', 'utf8'),
      readFile('src/pages/camps/[slug].astro', 'utf8'),
    ]);
    expect(index.match(/href="\/camps\/verification\/"/g)).toBeNull();
    expect(cardRenderer.match(/href="\/camps\/verification\/"/g)).toHaveLength(1);
    expect(detail).toContain('Read the methodology');
    expect(detail).toContain('href="/camps/verification/"');
  });
});
