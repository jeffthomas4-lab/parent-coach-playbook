#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function normalizeGeneratedWranglerManifest(manifest) {
  const normalized = { ...manifest };
  delete normalized.legacy_env;
  return normalized;
}

export async function normalizeGeneratedWranglerFile(
  manifestPath = resolve('dist/server/wrangler.json'),
) {
  const raw = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(raw);
  const normalized = normalizeGeneratedWranglerManifest(manifest);

  if ('legacy_env' in manifest) {
    await writeFile(manifestPath, `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
    console.log('Removed unsupported legacy_env from generated Wrangler manifest.');
  } else {
    console.log('Generated Wrangler manifest requires no compatibility normalization.');
  }

  return normalized;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await normalizeGeneratedWranglerFile();
  } catch (error) {
    console.error(`Generated Wrangler manifest normalization failed: ${error.message}`);
    process.exitCode = 1;
  }
}
