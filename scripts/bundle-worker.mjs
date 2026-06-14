#!/usr/bin/env node
/**
 * bundle-worker.mjs
 *
 * The @astrojs/cloudflare adapter v11 removed the esbuild bundling step that
 * previously collapsed the multi-file Worker output into a single minified file.
 * Without it, the dist/_worker.js/ directory totals 26+ MiB, exceeding
 * Cloudflare Pages' 25 MiB uncompressed limit.
 *
 * This script restores that step:
 *   1. Runs esbuild on dist/_worker.js/index.js (all dynamic imports inlined)
 *   2. Outputs a single minified dist/_worker.js file
 *   3. Removes the now-redundant dist/_worker.js/ directory
 *
 * Run after `astro build`, before `wrangler pages deploy`.
 */

import * as esbuild from 'esbuild';
import { rmSync, renameSync, statSync } from 'fs';
import { resolve } from 'path';

const workerDir  = resolve('./dist/_worker.js');
const entryPoint = resolve('./dist/_worker.js/index.js');
const outFile    = resolve('./dist/_worker.js.bundle');
const finalPath  = resolve('./dist/_worker.js');

console.log('📦 Bundling + minifying Worker with esbuild…');

await esbuild.build({
  entryPoints: [entryPoint],
  bundle:      true,
  minify:      true,
  format:      'esm',
  outfile:     outFile,
  platform:    'browser',
  target:      'es2022',
  conditions:  ['workerd', 'worker', 'browser'],
  // Don't try to bundle wasm or other binary assets
  external:    ['*.wasm', '*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp'],
  logLevel:    'info',
});

const { size } = statSync(outFile);
console.log(`✅ Bundled size: ${(size / 1024 / 1024).toFixed(2)} MiB (limit 25 MiB)`);

// Swap: remove directory, rename bundle → _worker.js
rmSync(workerDir, { recursive: true, force: true });
renameSync(outFile, finalPath);

console.log('✅ dist/_worker.js replaced with bundled output.');
