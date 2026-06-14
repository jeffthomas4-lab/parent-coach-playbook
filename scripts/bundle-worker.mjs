#!/usr/bin/env node
/**
 * bundle-worker.mjs
 *
 * The @astrojs/cloudflare adapter v11 removed esbuild bundling, so
 * dist/_worker.js/ ends up as 5000+ loose modules totaling 26+ MiB,
 * just over Cloudflare Pages' 25 MiB uncompressed limit.
 *
 * FIX: bundle everything into a single minified file at dist/_worker.js
 * (a FILE, not a directory). When wrangler sees _worker.js as a file, it
 * uploads it directly with no Pages Functions compilation overhead (~1 MiB
 * of overhead is added when _worker.js is a directory). This keeps us under
 * the 25 MiB limit.
 */

import * as esbuild from 'esbuild';
import { rmSync, statSync, renameSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, join } from 'path';

const workerDir  = resolve('./dist/_worker.js');   // currently a directory
const entryPoint = join(workerDir, 'index.js');
const tempOut    = resolve('./dist/_worker_bundle_temp.js'); // write OUTSIDE the dir

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
const mib = bundledSize / 1024 / 1024;
console.log(`Bundled: ${mib.toFixed(2)} MiB (limit 25 MiB)`);

if (mib > 25) {
  rmSync(tempOut, { force: true });
  console.error('ERROR: Bundle exceeds 25 MiB limit even after minification.');
  process.exit(1);
}

// Brief pause so Windows releases any file locks from astro build
await new Promise(r => setTimeout(r, 500));

// Delete the _worker.js/ DIRECTORY entirely
try {
  rmSync(workerDir, { recursive: true, force: true });
} catch (e) {
  // Windows file-lock fallback: use PowerShell to force-remove
  if (process.platform === 'win32') {
    console.log('rmSync blocked (likely Windows lock); retrying via PowerShell...');
    execSync(`powershell -Command "Remove-Item -Path '${workerDir}' -Recurse -Force"`, { stdio: 'inherit' });
  } else {
    throw e;
  }
}

// Place the bundle at dist/_worker.js as a FILE (not a directory).
// Wrangler treats a _worker.js FILE as a direct upload — no module
// compilation step, no extra overhead, file size = upload size.
renameSync(tempOut, workerDir);

console.log(`Done. dist/_worker.js is now a ${mib.toFixed(2)} MiB file (not a directory).`);
console.log('Wrangler will upload it directly — no Pages Functions compilation overhead.');
