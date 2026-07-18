import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('camp discovery trust journey', () => {
  it('lets a parent combine verified, open, age, date, and nearby filters', async () => {
    const page = await source('src/pages/camps/index.astro');

    expect(page).toContain('id="filter-verified-only"');
    expect(page).toContain('id="filter-open-only"');
    expect(page).toContain('state.verifiedOnly && c.verified !== 1');
    expect(page).toContain("state.openOnly && c.spots_status !== 'open'");
    expect(page).toContain('state.ageMin !== null');
    expect(page).toContain('state.dateStart');
    expect(page).toContain('haversineMiles');
  });

  it('labels verification with the verification timestamp, not editorial review time', async () => {
    const detail = await source('src/pages/camps/[slug].astro');

    expect(detail).toContain('formatReviewedAt(camp?.last_verified_at)');
    expect(detail).toContain("Verified{verifiedLabel ? ` on ${verifiedLabel}` : ''}");
  });
});
