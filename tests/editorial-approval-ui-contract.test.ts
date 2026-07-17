import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('editorial approval UI contract', () => {
  it('uses an explicit non-submit button and resolves clicks from nested content', async () => {
    const source = await readFile(new URL('../src/pages/admin/editorial/index.astro', import.meta.url), 'utf8');
    expect(source).toContain('type="button"');
    expect(source).toContain("closest<HTMLButtonElement>('.approve-btn')");
    expect(source).toContain("fetch('/api/admin/editorial/approve'");
  });
});
