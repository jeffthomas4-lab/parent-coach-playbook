import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  formatCampDateRange,
  formatImportedAt,
  formatCampLocation,
  formatCampDescription,
} from '../src/lib/camps-display';
import type { Camp } from '../src/lib/camps-db';

// Regression coverage for the /admin/camps/spot-check 500.
//
// The route pulls approved-but-unverified camps straight from the shared
// activity-radar D1. Legacy directory rows there can carry NULL in
// start_date / end_date / description / address / submitted_at, even though
// the Camp interface types them as non-null strings. The page used to call
// start.split('-') and c.description.length directly, so a single legacy row
// threw during SSR and 500'd the whole route before it rendered anything.
//
// This suite proves the render transform now degrades to a safe fallback for
// exactly such a row (so the route renders 200 instead of throwing), and a
// source guard pins the fragile access out of the .astro page for good.

const root = path.resolve(import.meta.dirname, '..');

// A legacy incomplete camp row: everything the migration could not backfill is
// null. Cast through the interface because the DB can produce this shape at
// runtime even though the type says it cannot.
const legacyRow = {
  id: 'legacy-001',
  slug: 'legacy-day-camp',
  name: 'Legacy Day Camp',
  sport: 'soccer',
  age_min: 6,
  age_max: 12,
  age_known: 1,
  start_date: null,
  end_date: null,
  address: null,
  city: null,
  state: null,
  zip: null,
  description: null,
  price_text: null,
  spots_status: 'open',
  website_url: null,
  submitted_at: null,
  program_type: 'camp',
} as unknown as Camp;

// A fully populated modern row, to prove the happy path still formats as before.
const modernRow = {
  id: 'modern-001',
  slug: 'summer-soccer',
  name: 'Summer Soccer',
  sport: 'soccer',
  age_min: 7,
  age_max: 10,
  age_known: 1,
  start_date: '2026-07-05',
  end_date: '2026-07-12',
  address: '100 Field Rd',
  city: 'Tacoma',
  state: 'WA',
  zip: '98402',
  description: 'A great week of soccer.',
  price_text: '$250',
  spots_status: 'open',
  website_url: 'https://example.com',
  submitted_at: '2026-06-01T15:30:00Z',
  program_type: 'camp',
} as unknown as Camp;

// Mirror of the frontmatter map in spot-check.astro. Building the same view
// model here is what the SSR route does per camp; if it does not throw and
// yields safe strings, the route renders (200) instead of 500ing.
function buildCampView(c: Camp) {
  return {
    dateRange: formatCampDateRange(c.start_date, c.end_date),
    importedAt: formatImportedAt(c.submitted_at),
    location: formatCampLocation(c),
    description: formatCampDescription(c.description),
  };
}

describe('spot-check render transform tolerates legacy incomplete rows', () => {
  it('never throws building the view model for an all-null legacy row', () => {
    expect(() => buildCampView(legacyRow)).not.toThrow();
  });

  it('renders safe fallbacks for every nullable field on a legacy row', () => {
    const v = buildCampView(legacyRow);
    expect(v.dateRange).toBe('Dates TBD');
    expect(v.importedAt).toBe('unknown');
    expect(v.location).toBe('Location unavailable');
    expect(v.description).toEqual({ text: '', empty: true });
    // No leaked Invalid Date / NaN / undefined text reaches the template.
    const rendered = `${v.dateRange} ${v.importedAt} ${v.location} ${v.description.text}`;
    expect(rendered).not.toMatch(/Invalid Date|NaN|undefined|null/);
  });

  it('still formats a fully populated modern row exactly as before', () => {
    const v = buildCampView(modernRow);
    expect(v.dateRange).toBe('Jul 5–Jul 12, 2026');
    expect(v.location).toBe('100 Field Rd, Tacoma, WA 98402');
    expect(v.importedAt).toMatch(/2026/);
    expect(v.description).toEqual({ text: 'A great week of soccer.', empty: false });
  });

  it('a whole queue mixing legacy and modern rows maps without throwing', () => {
    expect(() => [legacyRow, modernRow].map(buildCampView)).not.toThrow();
  });
});

describe('camps-display formatters are individually null-safe', () => {
  it('formatCampDateRange handles null, half-null, and valid inputs', () => {
    expect(formatCampDateRange(null, null)).toBe('Dates TBD');
    expect(formatCampDateRange('2026-08-03', null)).toBe('Aug 3, 2026');
    expect(formatCampDateRange(null, '2026-08-09')).toBe('Aug 9, 2026');
    expect(formatCampDateRange('2026-08-03', '2026-08-09')).toBe('Aug 3–Aug 9, 2026');
    expect(formatCampDateRange('garbage', '')).toBe('Dates TBD');
  });

  it('formatImportedAt returns "unknown" for null/blank/unparseable', () => {
    expect(formatImportedAt(null)).toBe('unknown');
    expect(formatImportedAt('')).toBe('unknown');
    expect(formatImportedAt('not-a-date')).toBe('unknown');
    expect(formatImportedAt('2026-06-01T15:30:00Z')).toMatch(/2026/);
  });

  it('formatCampLocation drops missing parts and falls back when empty', () => {
    expect(formatCampLocation({ address: null, city: null, state: null, zip: null })).toBe('Location unavailable');
    expect(formatCampLocation({ city: 'Tacoma', state: 'WA' })).toBe('Tacoma, WA');
    expect(formatCampLocation({ address: '1 A St', city: 'Tacoma', state: 'WA', zip: '98402' })).toBe('1 A St, Tacoma, WA 98402');
  });

  it('formatCampDescription is safe on null and clamps long text', () => {
    expect(formatCampDescription(null)).toEqual({ text: '', empty: true });
    expect(formatCampDescription('   ')).toEqual({ text: '', empty: true });
    expect(formatCampDescription('short')).toEqual({ text: 'short', empty: false });
    const long = 'x'.repeat(400);
    const clamped = formatCampDescription(long);
    expect(clamped.empty).toBe(false);
    expect(clamped.text.endsWith('…')).toBe(true);
    expect(clamped.text.length).toBe(321); // 320 chars + ellipsis
  });
});

describe('spot-check.astro source no longer performs fragile field access', () => {
  const src = fs.readFileSync(path.join(root, 'src/pages/admin/camps/spot-check.astro'), 'utf8');

  it('imports the null-safe camps-display helpers', () => {
    expect(src).toMatch(/from '\.\.\/\.\.\/\.\.\/lib\/camps-display'/);
  });

  it('does not call .split( on a date, nor .description.length, nor a bare new Date()', () => {
    expect(src).not.toMatch(/\.split\(/);
    expect(src).not.toMatch(/\.description\.length/);
    expect(src).not.toMatch(/new Date\(/);
  });

  it('surfaces a visible query-error state instead of a silent empty queue', () => {
    expect(src).toMatch(/queryError/);
  });
});
