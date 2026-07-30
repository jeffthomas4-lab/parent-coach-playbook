import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildStaticAssetProof } from '../scripts/build-static-asset-proof.mjs';

describe('exact build static asset proof', () => {
  it('selects a non-empty hashed asset and records exact bytes', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pcd-asset-'));
    await mkdir(join(root, '_astro'));
    await writeFile(join(root, '_astro', 'app.abcdefgh.css'), 'hello');
    const proof = await buildStaticAssetProof({ clientDir: root, sha: 'a'.repeat(40) });
    expect(proof).toEqual({ schema_version: 1, git_sha: 'a'.repeat(40), path: '/_astro/app.abcdefgh.css', bytes: 5, sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' });
  });

  // Regression: three consecutive production deploys failed on 2026-07-30
  // because the proof selected the largest asset in _astro, which was a
  // route-only chunk (leaflet) the homepage never loads. Cold at the edge,
  // negative-cached, 404 on a build that was fine.
  it('prefers an asset the homepage references over a larger route-only chunk', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pcd-asset-'));
    await mkdir(join(root, '_astro'));
    await writeFile(join(root, '_astro', 'leaflet.BuyNj4Zx.js'), 'x'.repeat(5000));
    await writeFile(join(root, '_astro', 'BaseLayout.CNaIGIGl.css'), 'body{}');
    await writeFile(
      join(root, 'index.html'),
      '<html><head><link rel="stylesheet" href="/_astro/BaseLayout.CNaIGIGl.css"></head></html>',
    );
    const proof = await buildStaticAssetProof({ clientDir: root, sha: 'b'.repeat(40) });
    expect(proof.path).toBe('/_astro/BaseLayout.CNaIGIGl.css');
    expect(proof.bytes).toBe(6);
  });

  it('falls back to the largest asset when the homepage references none', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pcd-asset-'));
    await mkdir(join(root, '_astro'));
    await writeFile(join(root, '_astro', 'small.abcdefgh.css'), 'a');
    await writeFile(join(root, '_astro', 'big.hgfedcba.js'), 'bbbb');
    await writeFile(join(root, 'index.html'), '<html><head></head></html>');
    const proof = await buildStaticAssetProof({ clientDir: root, sha: 'c'.repeat(40) });
    expect(proof.path).toBe('/_astro/big.hgfedcba.js');
  });

  it('still produces a proof when index.html is absent entirely', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pcd-asset-'));
    await mkdir(join(root, '_astro'));
    await writeFile(join(root, '_astro', 'app.abcdefgh.css'), 'hello');
    const proof = await buildStaticAssetProof({ clientDir: root, sha: 'd'.repeat(40) });
    expect(proof.path).toBe('/_astro/app.abcdefgh.css');
  });

  it('rejects unhashed assets and non-full SHAs', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pcd-asset-'));
    await mkdir(join(root, '_astro'));
    await writeFile(join(root, '_astro', 'app.css'), 'hello');
    await expect(buildStaticAssetProof({ clientDir: root, sha: 'short' })).rejects.toThrow('full lowercase Git SHA');
    await expect(buildStaticAssetProof({ clientDir: root, sha: 'a'.repeat(40) })).rejects.toThrow('no content-hashed');
  });
});
