#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const RUNTIME_PREFIXES = ['/api/', '/camp-photos/', '/camps/', '/go/'];
const RUNTIME_EXACT = new Set(['/trust/']);

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const emittedCandidates = (root, pathname) => {
  const relativePath = pathname.replace(/^\/+|\/+$/g, '');
  if (pathname.endsWith('/')) return [join(root, relativePath, 'index.html')];
  if (extname(pathname)) return [join(root, relativePath)];
  return [join(root, relativePath), join(root, relativePath, 'index.html')];
};

const isRuntimeRoute = (pathname) => RUNTIME_EXACT.has(pathname)
  || RUNTIME_PREFIXES.some((prefix) => pathname.startsWith(prefix));

export async function findBrokenBuiltInternalLinks(clientDir = 'dist/client') {
  const root = resolve(clientDir);
  if (!existsSync(root)) throw new Error(`built client directory not found: ${root}`);
  const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html'));
  const broken = new Map();
  for (const file of htmlFiles) {
    const source = relative(root, file).split(sep).join('/');
    // Preview pages deliberately render scheduled/future content whose public
    // route does not exist yet. They are protected editorial surfaces, not a
    // public internal-link contract.
    if (source.startsWith('admin/preview/')) continue;
    const html = await readFile(file, 'utf8');
    for (const match of html.matchAll(/\bhref=["'](\/[^"'#?]*)(?:[?#][^"']*)?["']/g)) {
      let pathname;
      try { pathname = decodeURI(match[1]); } catch { pathname = match[1]; }
      if (isRuntimeRoute(pathname)) continue;
      if (emittedCandidates(root, pathname).some(existsSync)) continue;
      const sources = broken.get(pathname) ?? [];
      if (!sources.includes(source)) sources.push(source);
      broken.set(pathname, sources);
    }
  }
  return [...broken].map(([url, sources]) => ({ url, sources })).sort((a, b) => a.url.localeCompare(b.url));
}

async function main() {
  const broken = await findBrokenBuiltInternalLinks(process.argv[2] ?? 'dist/client');
  if (broken.length) {
    for (const item of broken) console.error(`${item.url} <- ${item.sources.slice(0, 3).join(', ')}`);
    throw new Error(`${broken.length} unresolved internal link target(s) in emitted public HTML`);
  }
  console.log('Built internal-link contract passed: every public root-relative link resolves or has a named runtime owner.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
