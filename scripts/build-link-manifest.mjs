#!/usr/bin/env node
// Walks src/content/**/*.md and src/pages/**/*.astro, extracts every external HTTP(S)
// URL, and writes public/link-manifest.json. The link-checker worker reads this manifest
// and validates each URL on a rolling schedule.
//
// Run from project root:  node scripts/build-link-manifest.mjs
// Wired into npm run build via package.json prebuild step.

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SCAN_DIRS = [join(ROOT, 'src/content'), join(ROOT, 'src/pages')];
const OUT_PATH = join(ROOT, 'public/link-manifest.json');

// Match http(s) URLs. Stops at whitespace, quotes, brackets, parens, angle brackets, backticks.
const URL_RE = /https?:\/\/[^\s"'<>()`\\\]]+/g;

// Strip trailing punctuation that isn't part of the URL (common in markdown prose).
const TRAILING = /[.,;:!?'")\]]+$/;

// Skip URLs we never want to check (Jeff's own site; example.com placeholders; mailto/tel).
function shouldSkip(url) {
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('parentcoachplaybook.com')) return true;
    if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return true;
    if (u.hostname.includes('example.com') || u.hostname.includes('example.org')) return true;
    return false;
  } catch {
    return true;
  }
}

async function* walk(dir) {
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    const s = await stat(full);
    if (s.isDirectory()) {
      // Skip node_modules and .astro caches.
      if (name === 'node_modules' || name.startsWith('.')) continue;
      yield* walk(full);
    } else if (s.isFile()) {
      yield full;
    }
  }
}

const links = new Map(); // url -> { sources: Set<string> }

for (const dir of SCAN_DIRS) {
  for await (const file of walk(dir)) {
    if (!file.endsWith('.md') && !file.endsWith('.astro')) continue;
    const content = await readFile(file, 'utf8');
    const matches = content.match(URL_RE) || [];
    const relPath = relative(ROOT, file).replace(/\\/g, '/');
    for (const raw of matches) {
      const cleaned = raw.replace(TRAILING, '');
      if (shouldSkip(cleaned)) continue;
      if (!links.has(cleaned)) {
        links.set(cleaned, { sources: new Set() });
      }
      links.get(cleaned).sources.add(relPath);
    }
  }
}

// Output sorted manifest. Each entry has the URL and the source files where it appears.
const manifest = {
  generatedAt: new Date().toISOString(),
  count: links.size,
  links: [...links.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([url, { sources }]) => ({
      url,
      sources: [...sources].sort(),
    })),
};

await mkdir(join(ROOT, 'public'), { recursive: true });
await writeFile(OUT_PATH, JSON.stringify(manifest, null, 2) + '\n');

console.log(`✓ link-manifest.json written with ${manifest.count} unique URLs across ${
  new Set(manifest.links.flatMap(l => l.sources)).size
} files`);
