import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('linked illustration card integrity', () => {
  it('keeps the AI label while making the nested Details link optional', async () => {
    const source = await readFile('src/components/Illo.astro', 'utf8');

    expect(source).toContain('AI-generated illustration.');
    expect(source).toContain("detailsLink?: boolean");
    expect(source).toContain('detailsLink && <a href="/ai-transparency/">Details</a>');
    expect(source).toContain("disclosure?: 'below' | 'overlay'");
  });

  it('uses the non-nested overlay disclosure for every linked homepage illustration', async () => {
    const source = await readFile('src/pages/index.astro', 'utf8');

    expect(source.match(/detailsLink=\{false\}/g)).toHaveLength(3);
    expect(source.match(/disclosure="overlay"/g)).toHaveLength(3);
    expect(source.match(/class="relative aspect-\[3\/2\] overflow-hidden/g)).toHaveLength(3);
  });
});
