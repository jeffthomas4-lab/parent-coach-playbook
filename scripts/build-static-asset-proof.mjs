import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const HASHED_ASSET = /[._-][A-Za-z0-9_-]{8,}\.(?:css|js)$/;

// Assets the built homepage actually references. The proof asset is picked
// from this set whenever it is non-empty.
//
// It used to be "the largest hashed asset in _astro", which is a reasonable
// sounding rule that picked leaflet.*.js — a route-specific chunk only
// /camps/ ever loads. Nothing warms it at the edge, so the post-deploy smoke
// check was the first request it had ever seen, Cloudflare had a negative
// cached for the path, and the check failed with a 404 carrying
// `cf-cache-status: HIT` and `content-type: text/html`. A retry against the
// same URL cannot recover from a cached negative, so this failed three
// consecutive production deploys (2026-07-30) on a build that was fine.
//
// An asset the homepage links is warm by the time the asset check runs,
// because the smoke run requests `/` first. The proof is just as strong: it is
// still a content-hashed file compared by exact byte length and SHA-256, so it
// still catches the stale-build case this exists for.
async function homepageAssetNames(clientDir) {
  try {
    const html = await readFile(resolve(clientDir, 'index.html'), 'utf8');
    return new Set(
      [...html.matchAll(/\/_astro\/([A-Za-z0-9._-]+\.(?:css|js))/g)].map((m) => m[1]),
    );
  } catch {
    return new Set();
  }
}

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

  // Prefer a homepage-referenced asset; fall back to the old largest-overall
  // rule so a build that somehow references nothing still produces a proof
  // rather than failing the deploy outright.
  const onHomepage = await homepageAssetNames(clientDir);
  const selected =
    candidates.find((c) => onHomepage.has(c.name)) ?? candidates[0];
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
