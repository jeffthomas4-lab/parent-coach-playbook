import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HASHED_ASSET = /[._-][A-Za-z0-9_-]{8,}\.(?:css|js)$/;

export async function buildStaticAssetProof({ clientDir = 'dist/client', sha }) {
  if (!/^[0-9a-f]{40}$/.test(sha ?? '')) throw new Error('a full lowercase Git SHA is required');
  const astroDir = resolve(clientDir, '_astro');
  const candidates = [];
  for (const name of await readdir(astroDir)) {
    if (!HASHED_ASSET.test(name)) continue;
    const path = join(astroDir, name);
    const info = await stat(path);
    if (info.isFile() && info.size > 0) candidates.push({ name, path, bytes: info.size });
  }
  candidates.sort((a, b) => b.bytes - a.bytes || a.name.localeCompare(b.name));
  const selected = candidates[0];
  if (!selected) throw new Error('no content-hashed CSS or JS asset was found');
  const body = await readFile(selected.path);
  return {
    schema_version: 1,
    git_sha: sha,
    path: `/_astro/${selected.name}`,
    bytes: body.byteLength,
    sha256: createHash('sha256').update(body).digest('hex'),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
  const output = value('--output');
  const proof = await buildStaticAssetProof({ clientDir: value('--client-dir') ?? 'dist/client', sha: value('--sha') });
  if (!output) throw new Error('usage: build-static-asset-proof.mjs --sha <full-sha> --output <file> [--client-dir <dir>]');
  await writeFile(output, `${JSON.stringify(proof, null, 2)}\n`, 'utf8');
  console.log(`Static asset proof written for ${proof.path} (${proof.bytes} bytes).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
