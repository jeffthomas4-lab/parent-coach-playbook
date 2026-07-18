import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const source = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('affiliate inventory control', () => {
  it('enforces source coverage, HTTPS destinations, and direct Amazon associate tags', async () => {
    const script = await source('scripts/check-affiliate-inventory.mjs');

    expect(script).toContain("join(root, 'src/data/affiliates.json')");
    expect(script).toContain("join(root, 'src/content')");
    expect(script).toContain("join(root, 'src/pages')");
    expect(script).toContain("destination.protocol !== 'https:'");
    expect(script).toContain("destination.searchParams.get('tag') !== 'parentcoachpl-20'");
    expect(script).toContain('referenced by content but missing from affiliates.json');
  });

  it('produces an aggregate source map without reader identifiers', async () => {
    const script = await source('scripts/check-affiliate-inventory.mjs');

    expect(script).toContain('sources:');
    expect(script).not.toMatch(/ip_address|user_agent|cookie|fingerprint/i);
  });
});
