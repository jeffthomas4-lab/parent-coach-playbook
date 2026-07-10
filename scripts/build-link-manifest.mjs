#!/usr/bin/env node
// Walks src/content/**/*.md and src/pages/**/*.astro, extracts every external HTTP(S)
// URL, and writes public/link-manifest.json. The link-checker worker reads this manifest
// and validates each URL on a rolling schedule.
//
// Also pulls in affiliate destination URLs from src/data/affiliates.json. Those never
// appear as raw URLs in content/pages (posts link through /go/[slug]/, which is on our
// own domain and gets filtered out by shouldSkip below), so without this step the daily
// worker never sees them at all — confirmed 2026-07: 0 Amazon URLs in a 437-URL manifest.
//
// NOTE: the worker only checks HTTP status codes (see worker-link-checker/src/index.ts,
// isBroken = 4xx). Amazon's CAPTCHA/bot-block page returns 200, and so does a genuine
// "currently unavailable" product page — neither trips isBroken. So this addition catches
// true 404s / dead redirects on affiliate links automatically, but it does NOT replace the
// content-based checks (out-of-stock text, generic search-page redirects) that the weekly
// pcd-link-health-monitor scheduled task does with a real browser. Keep running both.
//
// Run from project root:  node scripts/build-link-manifest.mjs
// Wired into npm run build via package.json prebuild step.

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const SCAN_DIRS = [join(ROOT, 'src/content'), join(ROOT, 'src/pages')];
const AFFILIATES_PATH = join(ROOT, 'src/data/affiliates.json');
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
    if (u.hostname.endsWith('parentcoachdesk.com')) return true;
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

// Pull in affiliate destination URLs (amzn.to / amazon.com / etc.) from affiliates.json.
// These are real external URLs even though they're never written literally in content —
// posts link to /go/[slug]/, which resolves to these at request time.
try {
  const raw = await readFile(AFFILIATES_PATH, 'utf8');
  const affiliates = JSON.parse(raw);
  const relPath = relative(ROOT, AFFILIATES_PATH).replace(/\\/g, '/');
  for (const [slug, entry] of Object.entries(affiliates)) {
    const dest = entry?.destination;
    if (!dest || shouldSkip(dest)) continue;
    if (!links.has(dest)) {
      links.set(dest, { sources: new Set() });
    }
    links.get(dest).sources.add(`${relPath} (slug: ${slug})`);
  }
} catch (err) {
  console.warn(`⚠ could not read affiliates.json for link manifest: ${err.message}`);
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
