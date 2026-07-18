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

  it('rejects unhashed assets and non-full SHAs', async () => {
    const root = await mkdtemp(join(tmpdir(), 'pcd-asset-'));
    await mkdir(join(root, '_astro'));
    await writeFile(join(root, '_astro', 'app.css'), 'hello');
    await expect(buildStaticAssetProof({ clientDir: root, sha: 'short' })).rejects.toThrow('full lowercase Git SHA');
    await expect(buildStaticAssetProof({ clientDir: root, sha: 'a'.repeat(40) })).rejects.toThrow('no content-hashed');
  });
});
