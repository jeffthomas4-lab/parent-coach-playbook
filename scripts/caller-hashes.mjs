#!/usr/bin/env node
/**
 * Per-caller SHA-256 for the scheduled-task run-log reconciliation.
 *
 * Step 2 of the reconciliation proof procedure ("confirm its deployed prompt
 * references the listed committed caller source") was an eyeball comparison.
 * This turns it into a deterministic hash match: every committed caller source
 * (the agent SKILL.md a scheduled task calls) gets a SHA-256, recorded in a
 * committed manifest. The verifier recomputes each hash from the working tree
 * and asserts it matches the manifest, so any drift in a caller source that is
 * not reflected in the reconciliation fails instead of passing unnoticed.
 *
 * No secret is involved: this hashes version-controlled prompt files only.
 */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const RECONCILIATION_DOC = 'automation/TASK-RUN-LOG-RECONCILIATION.md';
export const DEFAULT_MANIFEST = 'coordination/release-evidence/scheduled-task-caller-hashes.json';

/** Parse the reconciliation table into { task_id, caller_paths } rows. */
export function parseCallerInventory(markdown) {
  const lines = markdown.split('\n');
  const headerIdx = lines.findIndex((l) => l.includes('Task ID') && l.includes('Version-controlled caller'));
  if (headerIdx < 0) throw new Error('reconciliation table header not found');
  const header = lines[headerIdx].split('|').map((c) => c.trim());
  const taskCol = header.indexOf('Task ID');
  const callerCol = header.indexOf('Version-controlled caller');
  if (taskCol < 0 || callerCol < 0) throw new Error('required reconciliation columns not found');
  const rows = [];
  for (let i = headerIdx + 2; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    const cells = line.split('|').map((c) => c.trim());
    const taskMatch = (cells[taskCol] ?? '').match(/`([^`]+)`/);
    if (!taskMatch) continue;
    const callerPaths = [...(cells[callerCol] ?? '').matchAll(/`([^`]+\.md)`/g)].map((m) => m[1]);
    rows.push({ task_id: taskMatch[1], caller_paths: callerPaths });
  }
  return rows;
}

/** Compute a flat [{ task_id, caller_path, sha256 }] over every committed caller source. */
export function computeCallerHashes(markdown, readFile) {
  const entries = [];
  for (const { task_id, caller_paths } of parseCallerInventory(markdown)) {
    if (caller_paths.length === 0) throw new Error(`task ${task_id} has no committed caller source`);
    for (const caller_path of caller_paths) {
      const bytes = readFile(caller_path);
      entries.push({ task_id, caller_path, sha256: createHash('sha256').update(bytes).digest('hex') });
    }
  }
  return entries;
}

export function buildCallerHashManifest(markdown, readFile) {
  return {
    schema_version: 1,
    generated_from: RECONCILIATION_DOC,
    callers: computeCallerHashes(markdown, readFile),
  };
}

const keyOf = (entry) => `${entry.task_id}::${entry.caller_path}`;

/** Validate a committed manifest against freshly computed hashes of the working tree. */
export function validateCallerHashManifest(manifest, markdown, readFile) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) return { errors: ['manifest must be an object'], valid: false };
  if (manifest.schema_version !== 1) errors.push('schema_version must be 1');
  if (manifest.generated_from !== RECONCILIATION_DOC) errors.push(`generated_from must be ${RECONCILIATION_DOC}`);
  if (!Array.isArray(manifest.callers)) return { errors: [...errors, 'callers must be an array'], valid: false };

  const expected = computeCallerHashes(markdown, readFile);
  const expectedByKey = new Map(expected.map((e) => [keyOf(e), e]));
  const actualByKey = new Map();
  for (const entry of manifest.callers) {
    if (!entry || typeof entry.task_id !== 'string' || typeof entry.caller_path !== 'string' || !/^[a-f0-9]{64}$/i.test(entry.sha256 ?? '')) {
      errors.push('each caller entry needs task_id, caller_path, and a SHA-256 hex sha256');
      continue;
    }
    actualByKey.set(keyOf(entry), entry);
  }
  for (const [key, exp] of expectedByKey) {
    const got = actualByKey.get(key);
    if (!got) errors.push(`missing committed hash for ${key}`);
    else if (got.sha256.toLowerCase() !== exp.sha256.toLowerCase()) errors.push(`hash mismatch for ${key}: committed source changed without updating the reconciliation manifest`);
  }
  for (const key of actualByKey.keys()) {
    if (!expectedByKey.has(key)) errors.push(`manifest lists ${key}, which is no longer a reconciliation caller`);
  }
  return { errors, valid: errors.length === 0 };
}

function readRepoFile(relPath) {
  return fs.readFileSync(new URL(`../${relPath}`, import.meta.url));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const argv = process.argv.slice(2);
  const markdown = readRepoFile(RECONCILIATION_DOC).toString('utf8');
  if (argv.includes('--emit')) {
    const manifest = buildCallerHashManifest(markdown, readRepoFile);
    process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
  } else {
    const manifestPath = argv[0] && !argv[0].startsWith('--') ? argv[0] : DEFAULT_MANIFEST;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const { errors, valid } = validateCallerHashManifest(manifest, markdown, readRepoFile);
    if (!valid) {
      console.error('Scheduled-task caller-hash reconciliation failed:');
      for (const error of errors) console.error(`- ${error}`);
      process.exitCode = 1;
    } else {
      console.log(`Caller-hash reconciliation passed; ${manifest.callers.length} committed callers match.`);
    }
  }
}
