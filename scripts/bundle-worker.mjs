#!/usr/bin/env node
/**
 * bundle-worker.mjs
 *
 * The @astrojs/cloudflare adapter v11 removed esbuild bundling, so
 * dist/_worker.js/ ends up as 5000+ loose modules totaling 26+ MiB,
 * just over Cloudflare Pages' 25 MiB uncompressed limit.
 *
 * This script bundles everything into a single minified index.js inside
 * the existing _worker.js/ directory, then deletes all the chunk files.
 * Wrangler then sees 1 file instead of 5000+, well under 25 MiB.
 */

import * as esbuild from 'esbuild';
import { rmSync, readdirSync, statSync, renameSync, writeFileSync } from 'fs';
import { resolve, join, extname } from 'path';

const workerDir  = resolve('./dist/_worker.js');
const entryPoint = join(workerDir, 'index.js');
const tempOut    = join(workerDir, '_bundled_index.js');

console.log('Bundling Worker with esbuild...');

await esbuild.build({
  entryPoints:  [entryPoint],
  bundle:       true,
  minify:       true,
  format:       'esm',
  outfile:      tempOut,
  platform:     'browser',
  target:       'es2022',
  conditions:   ['workerd', 'worker', 'browser'],
  external:     ['*.wasm'],
  logLevel:     'warning',
});

const bundledSize = statSync(tempOut).size;
console.log(`Bundled: ${(bundledSize / 1024 / 1024).toFixed(2)} MiB (limit 25 MiB)`);

// Delete everything in _worker.js/ EXCEPT our bundled output
const entries = readdirSync(workerDir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.name === '_bundled_index.js') continue; // keep our output
  const fullPath = join(workerDir, entry.name);
  rmSync(fullPath, { recursive: true, force: true });
}

// Rename bundled output → index.js
renameSync(tempOut, join(workerDir, 'index.js'));

console.log('Done. dist/_worker.js/ now contains 1 bundled file.');
