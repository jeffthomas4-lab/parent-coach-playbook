import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('default-off owner dashboard', () => {
  it('uses only the server-populated customer local and keeps responses private', async () => {
    const page = await readFile(new URL('../src/pages/owner/index.astro', import.meta.url), 'utf8');
    expect(page).toContain('PCD_CUSTOMER_FOUNDATION_ENABLED');
    expect(page).toContain('Astro.locals as { customer?: unknown }');
    expect(page).toContain("'Cache-Control': 'private, no-store'");
    expect(page).toContain("'X-Robots-Tag': 'noindex, nofollow'");
    expect(page).not.toMatch(/request\.headers|URLSearchParams|cookies\.get/i);
  });
});
