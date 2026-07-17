import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

describe('global accessibility contract', () => {
  it('moves keyboard skip-link users to a programmatically focusable main landmark', async () => {
    const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');

    expect(layout).toContain('href="#main"');
    expect(layout).toContain('<main id="main" tabindex="-1">');
    expect(layout).toContain("window.location.hash !== '#main'");
    expect(layout).toContain("document.getElementById('main')?.focus({ preventScroll: true })");
    expect(layout).toContain("window.addEventListener('hashchange', focusSkipTarget)");
  });
});
