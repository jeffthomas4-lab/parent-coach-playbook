import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MANIFEST,
  RECONCILIATION_DOC,
  buildCallerHashManifest,
  computeCallerHashes,
  parseCallerInventory,
  validateCallerHashManifest,
} from '../scripts/caller-hashes.mjs';

const markdown = readFileSync(RECONCILIATION_DOC, 'utf8');
const readFile = (relPath: string) => readFileSync(relPath);

describe('scheduled-task caller-hash reconciliation', () => {
  it('parses one row per scheduled task with at least one committed caller', () => {
    const inventory = parseCallerInventory(markdown);
    expect(inventory.length).toBe(10);
    expect(inventory.every((row) => row.caller_paths.length >= 1)).toBe(true);
    // Vera's row carries both the pointer and the underlying SKILL.
    const vera = inventory.find((row) => row.task_id === 'pcd-deletion-monitor');
    expect(vera?.caller_paths).toContain('agents/pcd-deletion-monitor/SKILL.md');
    expect(vera?.caller_paths).toContain('automation/agents/vera/SKILL.md');
  });

  it('computes a real SHA-256 of each committed caller source', () => {
    const entries = computeCallerHashes(markdown, readFile);
    const ranger = entries.find((e) => e.caller_path === 'automation/agents/ranger/SKILL.md');
    const expected = createHash('sha256').update(readFileSync('automation/agents/ranger/SKILL.md')).digest('hex');
    expect(ranger?.sha256).toBe(expected);
    expect(entries.every((e) => /^[a-f0-9]{64}$/.test(e.sha256))).toBe(true);
  });

  it('accepts the committed manifest that ships in the repo', () => {
    const committed = JSON.parse(readFileSync(DEFAULT_MANIFEST, 'utf8'));
    const result = validateCallerHashManifest(committed, markdown, readFile);
    expect(result).toEqual({ errors: [], valid: true });
  });

  it('fails a hash match when a committed caller source drifts', () => {
    const manifest = buildCallerHashManifest(markdown, readFile);
    manifest.callers[0].sha256 = 'f'.repeat(64);
    const result = validateCallerHashManifest(manifest, markdown, readFile);
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/hash mismatch/);
  });

  it('fails when a caller is missing from the manifest', () => {
    const manifest = buildCallerHashManifest(markdown, readFile);
    manifest.callers.pop();
    const result = validateCallerHashManifest(manifest, markdown, readFile);
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/missing committed hash/);
  });

  it('fails when the manifest lists a caller that is no longer reconciled', () => {
    const manifest = buildCallerHashManifest(markdown, readFile);
    manifest.callers.push({ task_id: 'ghost-task', caller_path: 'automation/agents/ghost/SKILL.md', sha256: 'a'.repeat(64) });
    const result = validateCallerHashManifest(manifest, markdown, readFile);
    expect(result.valid).toBe(false);
    expect(result.errors.join(' ')).toMatch(/no longer a reconciliation caller/);
  });
});
