import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('staging isolation contract', () => {
  it('keeps staging directory, operations, media, and public origin separate from production', async () => {
    const config = await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8');

    expect(config).toContain('"database_name": "parent-coach-desk-directory-staging"');
    expect(config).toContain('"bucket_name": "parent-coach-desk-staging-photos"');
    expect(config).toContain('"SITE_URL": "https://parent-coach-desk-staging.eepskalla.workers.dev"');
    expect(config).not.toContain('"database_name": "activity-radar"');
    expect(config).not.toContain('"database_name": "forge-command"');
    expect(config).not.toContain('"bucket_name": "activityradar-photos"');
  });

  it('uses only explicitly fictional data for the populated directory journey fixture', async () => {
    const fixture = await readFile(new URL('../staging-fixtures/directory-populated.sql', import.meta.url), 'utf8');

    expect(fixture).toContain('Synthetic, non-production data');
    expect(fixture).toContain('PCD Fixture Soccer Summer Camp');
    expect(fixture).toContain('example.invalid');
    expect(fixture).not.toContain('activity-radar');
  });
});
