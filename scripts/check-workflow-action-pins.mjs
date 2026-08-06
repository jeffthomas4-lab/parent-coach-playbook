#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';

const workflowDirectory = new URL('../.github/workflows/', import.meta.url);

// GitHub Actions was removed from this repo on 2026-08-05 (it burned the
// monthly allotment in four days), so .github/workflows/ no longer exists.
// Zero workflows is a passing state, not an error: there is nothing unpinned.
// The check stays wired into ci:release on purpose, so that if workflows ever
// come back the pinning requirement is enforced from the first one.
let workflowFiles = [];
try {
  workflowFiles = (await readdir(workflowDirectory))
    .filter((name) => name.endsWith('.yml') || name.endsWith('.yaml'))
    .sort();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  console.log('No .github/workflows directory: GitHub Actions is disabled for this repo. Nothing to pin.');
  process.exit(0);
}

if (workflowFiles.length === 0) {
  console.log('No workflow files found: GitHub Actions is disabled for this repo. Nothing to pin.');
  process.exit(0);
}

const unpinned = [];
for (const file of workflowFiles) {
  const source = await readFile(new URL(file, workflowDirectory), 'utf8');
  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const match = line.match(/^\s*-?\s*uses:\s*([^\s#]+)\s*(?:#.*)?$/);
    if (!match) continue;
    const action = match[1];
    if (action.startsWith('./') || action.startsWith('docker://')) continue;
    const separator = action.lastIndexOf('@');
    const revision = separator >= 0 ? action.slice(separator + 1) : '';
    if (!/^[0-9a-f]{40}$/i.test(revision)) {
      unpinned.push(`${file}:${index + 1} ${action}`);
    }
  }
}

if (unpinned.length > 0) {
  console.error('External GitHub Actions must be pinned to a full 40-character commit SHA:');
  for (const finding of unpinned) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${workflowFiles.length} workflow files: every external action is commit-pinned.`);
}
