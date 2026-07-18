import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findBrokenBuiltInternalLinks } from '../scripts/check-built-internal-links.mjs';

async function fixture(html: string) {
  const root = await mkdtemp(join(tmpdir(), 'pcd-built-links-'));
  await mkdir(join(root, 'good'), { recursive: true });
  await writeFile(join(root, 'index.html'), html);
  await writeFile(join(root, 'good', 'index.html'), '<p>ok</p>');
  return root;
}

describe('emitted internal-link contract', () => {
  it('accepts built files, fragments, and explicitly owned runtime routes', async () => {
    const root = await fixture('<a href="/good/#part">good</a><a href="/camps/">runtime</a><a href="/trust/?category=x">trust</a>');
    await expect(findBrokenBuiltInternalLinks(root)).resolves.toEqual([]);
  });

  it('reports unresolved public paths with their source artifact', async () => {
    const root = await fixture('<a href="/old-phase/missing/">broken</a>');
    await expect(findBrokenBuiltInternalLinks(root)).resolves.toEqual([
      { url: '/old-phase/missing/', sources: ['index.html'] },
    ]);
  });

  it('does not treat protected future-content previews as public links', async () => {
    const root = await fixture('<p>home</p>');
    await mkdir(join(root, 'admin', 'preview', 'articles', 'future'), { recursive: true });
    await writeFile(join(root, 'admin', 'preview', 'articles', 'future', 'index.html'), '<a href="/future/not-live/">future</a>');
    await expect(findBrokenBuiltInternalLinks(root)).resolves.toEqual([]);
  });
});
