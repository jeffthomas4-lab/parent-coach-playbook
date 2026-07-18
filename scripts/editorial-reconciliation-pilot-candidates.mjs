#!/usr/bin/env node
// Read-only. Lists the proposed pilot batch for legacy-corpus reconciliation
// (see strategy/EDITORIAL-CORPUS-RECONCILIATION-BATCHING.md). Creates no D1
// row, marks no content item reconciled, and writes nothing.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pillarDir = path.join(root, 'src', 'content', 'pillar');

function frontmatterField(raw, key) {
  const fm = raw.match(/^---\s*([\s\S]*?)\s*---/);
  const header = fm?.[1] ?? '';
  return (header.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1] ?? '').trim().replace(/^['"]|['"]$/g, '');
}

function listPilotCandidates() {
  const files = fs.readdirSync(pillarDir).filter((name) => /\.(md|mdx)$/.test(name)).sort();
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(pillarDir, file), 'utf8');
    return {
      file: path.relative(root, path.join(pillarDir, file)).replaceAll('\\', '/'),
      title: frontmatterField(raw, 'title') || null,
      draft: frontmatterField(raw, 'draft') === 'true',
    };
  });
}

const candidates = listPilotCandidates();
console.log(`Proposed pilot batch: ${candidates.length} items from src/content/pillar/ (see strategy/EDITORIAL-CORPUS-RECONCILIATION-BATCHING.md)`);
console.log('No content status changed. No D1 row created.');
for (const item of candidates) console.log(`- ${item.file}${item.title ? ` -- ${item.title}` : ''}${item.draft ? ' [draft]' : ''}`);
