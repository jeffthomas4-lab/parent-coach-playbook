#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { loadContentCoverageRegistry } from './content-coverage-registry.mjs';

const root = resolve(process.cwd());
const output = resolve(root, 'artifacts/content-coverage-v1.snapshot.json');
const snapshot = await loadContentCoverageRegistry({ root });
const canonical = JSON.stringify(snapshot);
const hash = createHash('sha256').update(canonical).digest('hex');
const rendered = `${JSON.stringify(snapshot, null, 2)}\n`;
if (process.argv.includes('--check')) {
  const [existing, existingHash] = await Promise.all([
    readFile(output, 'utf8').catch(() => null),
    readFile(`${output}.sha256`, 'utf8').catch(() => null),
  ]);
  if (existing !== rendered || existingHash !== `${hash}\n`) {
    throw new Error('content coverage artifact is missing or stale; run npm run build:coverage and review the diff');
  }
  console.log(`Verified ${snapshot.contentItems.length} exact content coverage entries and canonical SHA-256 ${hash}.`);
  console.log('Registry complete: false. Unmatched queries remain unknown.');
  process.exit(0);
}
await mkdir(dirname(output), { recursive: true });
await writeFile(output, rendered, 'utf8');
await writeFile(`${output}.sha256`, `${hash}\n`, 'utf8');
console.log(`Validated ${snapshot.contentItems.length} exact content coverage entries.`);
console.log(`Registry complete: ${snapshot.contentRegistryComplete}. Unmatched queries remain unknown.`);
console.log(`Wrote ${output}`);
console.log(`Canonical SHA-256: ${hash}`);
