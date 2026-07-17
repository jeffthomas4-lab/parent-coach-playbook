import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { CAMP_SPORTS } from '../src/data/site';

const load = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('public camp truthfulness contract', () => {
  it('does not convert missing age data into a 0-99 customer claim', async () => {
    const [db, directory, detail, city, sport] = await Promise.all([
      load('src/lib/camps-db.ts'),
      load('src/pages/camps/index.astro'),
      load('src/pages/camps/[slug].astro'),
      load('src/pages/camps/[state]/[city]/index.astro'),
      load('src/pages/camps/[state]/[city]/[sport]/index.astro'),
    ]);
    expect(db).toContain('(p.age_min IS NOT NULL AND p.age_max IS NOT NULL)');
    for (const page of [directory, detail, city, sport]) expect(page).toContain('ages not provided');
    expect(directory).toContain('c.age_known !== 1');
    expect(city).toContain('c.age_known === 1 &&');
    expect(sport).toContain('c.age_known === 1 &&');
  });

  it('reserves verified language for individually verified rows and defines its limits', async () => {
    const pages = (await Promise.all([
      load('src/pages/camps/index.astro'),
      load('src/pages/camps/[slug].astro'),
      load('src/pages/camps/[state]/[city]/index.astro'),
      load('src/pages/camps/[state]/[city]/[sport]/index.astro'),
    ])).join('\n');
    expect(pages).not.toMatch(/\bverified camps?\b/i);
    expect(pages).not.toMatch(/\bverified\s+[a-z-]+\s+camps?\b/i);
    expect(pages).toContain('camp.verified === 1');
    expect(pages).toContain('not an inspection or endorsement');
    expect(pages).toContain('does not mean PCD inspected');
    expect(pages).toContain('confirm them with the provider before paying or traveling');
    expect(pages).toContain('Listed price:');
  });

  it('keeps the deterministic source-audit sample read-only and free of private intake fields', async () => {
    const sql = await load('scripts/directory-source-sample.sql');
    expect(sql).toContain("p.pcd_status = 'approved'");
    expect(sql).toContain('PARTITION BY p.source_domain');
    expect(sql).toContain('LIMIT 12');
    expect(sql).not.toMatch(/\b(INSERT|UPDATE|DELETE|DROP|ALTER)\b/i);
    expect(sql).not.toMatch(/submitted_by_email|contact_email|contact_phone|review_notes/i);
  });

  it('keeps directory filters understandable and accessible', async () => {
    const directory = await load('src/pages/camps/index.astro');
    expect(directory).toContain('aria-label="Minimum age"');
    expect(directory).toContain('aria-label="Maximum age"');
    expect(directory).toContain('programs in this map area');
    expect(directory).toContain("split(/[\\s_-]+/)");
    expect(directory).not.toMatch(/navigator\.geolocation|getCurrentPosition\s*\(/);
  });

  it('offers every camp activity exactly once by slug and visible label', () => {
    const slugs = CAMP_SPORTS.map((sport) => sport.slug);
    const labels = CAMP_SPORTS.map((sport) => sport.label);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('preserves the bounded mobile accessibility remediations', async () => {
    const [directory, nav, consent] = await Promise.all([
      load('src/pages/camps/index.astro'),
      load('src/components/NavBar.astro'),
      load('src/components/ConsentBanner.astro'),
    ]);
    expect(directory).toContain('min-w-0');
    expect(directory).toContain('flex-wrap');
    expect(nav).toContain('min-h-11');
    expect(consent).toContain("data.{' '}");
  });
});
