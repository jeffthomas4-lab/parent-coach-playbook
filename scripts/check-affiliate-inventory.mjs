#!/usr/bin/env node

import { readFile, readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const inventoryPath = join(root, 'src/data/affiliates.json');
const scanRoots = [join(root, 'src/content'), join(root, 'src/pages')];
const reportPath = join(root, 'reports/affiliate/inventory.json');
const goLinkPattern = /(?:https?:\/\/parentcoachdesk\.com)?\/go\/([a-z0-9][a-z0-9-]*)\/?/gi;
const amazonHosts = new Set(['amazon.com', 'www.amazon.com']);

async function* walk(directory) {
  for (const name of await readdir(directory)) {
    const path = join(directory, name);
    const metadata = await stat(path);
    if (metadata.isDirectory()) yield* walk(path);
    else if (metadata.isFile()) yield path;
  }
}

const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
const references = new Map();

for (const scanRoot of scanRoots) {
  for await (const file of walk(scanRoot)) {
    if (!/\.(astro|md|mdx)$/.test(file)) continue;
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(goLinkPattern)) {
      const slug = match[1].toLowerCase();
      const files = references.get(slug) ?? new Set();
      files.add(relative(root, file).replaceAll('\\', '/'));
      references.set(slug, files);
    }
  }
}

const errors = [];
const links = [];
for (const [slug, entry] of Object.entries(inventory)) {
  let destination;
  try {
    destination = new URL(entry.destination);
  } catch {
    errors.push(`${slug}: destination is not a valid URL`);
    continue;
  }
  if (destination.protocol !== 'https:') errors.push(`${slug}: destination must use HTTPS`);
  if (!entry.retailer?.trim()) errors.push(`${slug}: retailer is required`);
  if (!entry.campaign?.trim()) errors.push(`${slug}: campaign is required`);
  if (amazonHosts.has(destination.hostname) && destination.searchParams.get('tag') !== 'parentcoachpl-20') {
    errors.push(`${slug}: direct Amazon URL is missing the parentcoachpl-20 associate tag`);
  }
  links.push({
    slug,
    retailer: entry.retailer,
    campaign: entry.campaign,
    destinationHost: destination.hostname,
    sources: [...(references.get(slug) ?? [])].sort(),
  });
}

for (const slug of references.keys()) {
  if (!Object.hasOwn(inventory, slug)) errors.push(`${slug}: referenced by content but missing from affiliates.json`);
}

links.sort((a, b) => a.slug.localeCompare(b.slug));
const report = {
  inventoryCount: links.length,
  referencedCount: links.filter((link) => link.sources.length > 0).length,
  unreferencedCount: links.filter((link) => link.sources.length === 0).length,
  errorCount: errors.length,
  errors: errors.sort(),
  links,
};

if (process.argv.includes('--report')) {
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Affiliate inventory report written to ${relative(root, reportPath)}`);
}

console.log(`${report.inventoryCount} affiliate links; ${report.referencedCount} referenced; ${report.errorCount} errors`);
if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
}
