import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AUTHOR_REVEALED, SCHEMA_IDS, authorEntity, personSchema } from '../src/data/site';

const source = (path: string) => readFileSync(path, 'utf8');

describe('structured-data entity graph', () => {
  it('uses stable absolute identifiers', () => {
    expect(SCHEMA_IDS).toEqual({
      organization: 'https://parentcoachdesk.com/#organization',
      website: 'https://parentcoachdesk.com/#website',
      person: 'https://parentcoachdesk.com/about/#person',
    });
    expect(authorEntity()).toMatchObject({ '@type': 'Organization', '@id': SCHEMA_IDS.organization });
  });

  it('preserves the deliberate person reveal gate', () => {
    expect(AUTHOR_REVEALED).toBe(false);
    expect(personSchema()).toBeNull();
    expect(JSON.stringify(authorEntity())).not.toContain('Jeff Thomas');
  });

  it('connects site and article publishers to the canonical organization', () => {
    const base = source('src/layouts/BaseLayout.astro');
    const homepage = source('src/pages/index.astro');
    const articleSources = [
      source('src/layouts/ArticleLayout.astro'),
      source('src/components/ArticleSchema.astro'),
      source('src/pages/team-parent/[slug].astro'),
    ];
    expect(base).toContain("'@id': SCHEMA_IDS.organization");
    expect(homepage).toContain("'@id': SCHEMA_IDS.website");
    expect(homepage).toContain("'@id': SCHEMA_IDS.organization");
    for (const article of articleSources) {
      expect(article).toContain("'@id': SCHEMA_IDS.organization");
      expect(article).toContain('authorEntity()');
    }
  });
});
