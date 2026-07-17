import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildContentCoverageSnapshot, loadContentCoverageRegistry, normalizeCoverageQuery } from '../scripts/content-coverage-registry.mjs';

const base = (items: unknown[] = []) => ({
  schemaVersion: 1,
  contentRegistryComplete: false,
  registryAsOf: '2026-07-16T00:00:00.000Z',
  scope: { surfaces: ['site_search'], languages: ['en'], normalizationVersion: 1 },
  items,
});

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'pcd-coverage-'));
  await mkdir(join(root, 'src/content/rules'), { recursive: true });
  await writeFile(join(root, 'src/content/rules/soccer.md'), '---\ntitle: Soccer rules\n---\n');
  return root;
}

const item = (overrides = {}) => ({
  query: ' Soccer   Rules ', status: 'current', asOf: '2026-07-15T00:00:00.000Z',
  route: '/rules/soccer/', evidencePath: 'src/content/rules/soccer.md', ...overrides,
});

describe('content coverage registry', () => {
  it('normalizes exact queries deterministically', () => {
    expect(normalizeCoverageQuery(' Soccer   Rules ')).toBe('soccer rules');
  });

  it('builds a minimal deterministic Forge snapshot from verified source evidence', async () => {
    const root = await fixture();
    const first = await buildContentCoverageSnapshot(base([item()]), { root });
    const second = await buildContentCoverageSnapshot(base([item()]), { root });
    expect(first).toEqual(second);
    expect(first).toEqual({
      schemaVersion: 1, contentRegistryComplete: false,
      contentItems: [{ query: 'soccer rules', status: 'current', asOf: '2026-07-15T00:00:00.000Z', route: '/rules/soccer/' }],
      directoryItems: [],
    });
    expect(JSON.stringify(first)).not.toContain('evidencePath');
  });

  it('validates the repository registry and keeps it explicitly partial', async () => {
    const snapshot = await loadContentCoverageRegistry({ root: process.cwd() });
    expect(snapshot.contentRegistryComplete).toBe(false);
    expect(snapshot.contentItems.length).toBeGreaterThan(0);
    expect(JSON.parse(await readFile('artifacts/content-coverage-v1.snapshot.json', 'utf8'))).toEqual(snapshot);
  });

  it('rejects duplicate normalized queries and duplicate routes', async () => {
    const root = await fixture();
    await expect(buildContentCoverageSnapshot(base([item(), item({ query: 'soccer rules', route: '/rules/other/' })]), { root })).rejects.toThrow(/duplicate coverage query/);
    await expect(buildContentCoverageSnapshot(base([item(), item({ query: 'basketball rules' })]), { root })).rejects.toThrow(/duplicate coverage route/);
  });

  it('rejects missing or escaping evidence and future review times', async () => {
    const root = await fixture();
    await expect(buildContentCoverageSnapshot(base([item({ evidencePath: 'missing.md' })]), { root })).rejects.toThrow(/missing evidence/);
    await expect(buildContentCoverageSnapshot(base([item({ evidencePath: '../outside.md' })]), { root })).rejects.toThrow(/escapes project/);
    await expect(buildContentCoverageSnapshot(base([item({ asOf: '2026-07-17T00:00:00.000Z' })]), { root })).rejects.toThrow(/future item evidence/);
  });

  it('refuses completeness claims until a separate approval protocol exists', async () => {
    const root = await fixture();
    await expect(buildContentCoverageSnapshot({ ...base([item()]), contentRegistryComplete: true }, { root })).rejects.toThrow(/explicitly partial/);
  });

  it('enforces scope, taxonomy and bounds', async () => {
    const root = await fixture();
    await expect(buildContentCoverageSnapshot({ ...base(), scope: { surfaces: ['camp_directory'], languages: ['en'], normalizationVersion: 1 } }, { root })).rejects.toThrow(/surfaces/);
    await expect(buildContentCoverageSnapshot(base([item({ status: 'fresh' })]), { root })).rejects.toThrow(/status/);
    await expect(buildContentCoverageSnapshot(base(Array.from({ length: 5001 }, () => item())), { root })).rejects.toThrow(/items/);
  });
});
