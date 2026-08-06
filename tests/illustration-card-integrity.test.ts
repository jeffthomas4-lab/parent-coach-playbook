import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('illustration rendering integrity', () => {
  it('renders the responsive image without public illustration disclosure UI', async () => {
    const source = await readFile('src/components/Illo.astro', 'utf8');

    expect(source).toContain('<img');
    expect(source).toContain('srcset={srcset}');
    expect(source).toContain('alt={alt}');
    expect(source).not.toMatch(/AI-generated illustration|data-ai-origin|data-ai-disclosure-id|aria-describedby/);
    expect(source).not.toMatch(/detailsLink|disclosure\?:|ai-illustration-disclosure|<span|<style>/);
    expect(source).not.toContain('/ai-transparency/');
  });

  it('keeps linked homepage illustrations free of obsolete overlay properties', async () => {
    const source = await readFile('src/pages/index.astro', 'utf8');

    expect(source).not.toContain('detailsLink={false}');
    expect(source).not.toContain('disclosure="overlay"');
    expect(source.match(/class="aspect-\[3\/2\] overflow-hidden/g)).toHaveLength(3);
  });

  it('removes illustration-label promises from public policy copy', async () => {
    const sources = await Promise.all([
      'src/pages/terms.astro',
      'src/pages/disclosure.astro',
      'src/pages/ai-transparency.astro',
    ].map((file) => readFile(file, 'utf8')));
    const publicCopy = sources.join('\n');

    expect(publicCopy).not.toMatch(/AI-generated illustration|AI-generated or AI-modified|Illustrations and AI-assisted/);
    expect(publicCopy).toContain('AI-assisted editorial content');
  });
});
