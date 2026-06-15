#!/usr/bin/env node
/**
 * bundle-worker.mjs
 *
 * Astro 5 + @astrojs/cloudflare v12 emit dist/_worker.js/ as a DIRECTORY.
 * When wrangler sees a directory it compiles a Pages *Function*, which is
 * capped at 3 MiB (free) / 10 MiB (paid). Astro 5's Content Layer serializes
 * every content entry into the server bundle (~14 MiB here), so the Function
 * blows that cap.
 *
 * FIX: bundle the worker into a single minified file at dist/_worker.js (a
 * FILE, not a directory). wrangler then uploads it directly as a Pages
 * Advanced-mode worker under the 25 MiB limit, with no Function compilation.
 *
 * v12 notes: the adapter entry now imports `cloudflare:workers` and the image
 * service pulls in `sharp` (+ detect-libc -> node builtins). None of those are
 * bundleable for workerd, so they're marked external. nodejs_compat is enabled
 * in wrangler.jsonc, so the left-as-import node builtins resolve at runtime.
 */

import * as esbuild from 'esbuild';
import { rmSync, statSync, renameSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, join } from 'path';

const NODE_BUILTINS = [
  'assert','async_hooks','buffer','child_process','console','constants','crypto',
  'diagnostics_channel','dns','events','fs','fs/promises','http','http2','https',
  'inspector','module','net','os','path','perf_hooks','process','punycode',
  'querystring','readline','stream','stream/web','string_decoder','timers',
  'timers/promises','tls','tty','url','util','v8','vm','worker_threads','zlib',
];

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
  external: [
    'cloudflare:*',
    'node:*',
    'sharp',
    'detect-libc',
    '*.wasm',
    ...NODE_BUILTINS,
  ],
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

await new Promise(r => setTimeout(r, 500));

try {
  rmSync(workerDir, { recursive: true, force: true });
} catch (e) {
  if (process.platform === 'win32') {
    console.log('rmSync blocked (likely Windows lock); retrying via PowerShell...');
    execSync(`powershell -Command "Remove-Item -Path '${workerDir}' -Recurse -Force"`, { stdio: 'inherit' });
  } else {
    throw e;
  }
}

renameSync(tempOut, workerDir);

console.log(`Done. dist/_worker.js is now a ${mib.toFixed(2)} MiB file (not a directory).`);
console.log('Wrangler will upload it directly — no Pages Functions compilation overhead.');
