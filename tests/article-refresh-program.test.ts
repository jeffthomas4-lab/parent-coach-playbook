import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildArticleRefreshProgram } from '../scripts/article-refresh-program.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'pcd-article-refresh-'));
  const articleDir = join(root, 'src/content/articles');
  await mkdir(articleDir, { recursive: true });
  const article = (index: number, extra = '', body = 'A useful short answer.') => `---
title: How to choose gear article ${String(index).padStart(3, '0')}
seoDescription: A useful description that is long enough for the article content schema.
topic: equipment
phase: drive-there
publishedAt: 2026-01-01
featured: ${index === 0}
draft: false
${extra}---
${body}
`;
  for (let index = 0; index < 105; index += 1) {
    await writeFile(join(articleDir, `article-${String(index).padStart(3, '0')}.md`), article(index));
  }
  await writeFile(join(articleDir, 'draft.md'), article(200, 'draft: true\n').replace('draft: false\n', ''));
  await writeFile(join(articleDir, 'future.md'), article(201, 'publishedAt: 2027-01-01\n').replace('publishedAt: 2026-01-01\n', ''));
  await writeFile(join(articleDir, 'external.md'), article(202, 'externalSource:\n  provider: babylovegrowth\n'));
  return root;
}

describe('article refresh program', () => {
  it('selects exactly 100 eligible articles in ten deterministic batches', async () => {
    const root = await fixture();
    const first = await buildArticleRefreshProgram({ root });
    const second = await buildArticleRefreshProgram({ root });
    expect(first).toEqual(second);
    expect(first.as_of).toBe('2026-08-02');
    expect(first.program).toMatchObject({ size: 100, batch_size: 10, batch_count: 10, selection_frozen: true });
    expect(first.batches).toHaveLength(10);
    expect(first.batches.every((batch) => batch.items.length === 10)).toBe(true);
    expect(first.batches.flatMap((batch) => batch.items)).toHaveLength(100);
    expect(first.summary).toEqual({ eligible_articles: 105, selected_articles: 100, refreshed: 0, pending: 100 });
    expect(first.policy.traffic_data_included).toBe(false);
    expect(first.policy.traffic_claim).toContain('not a top-traffic list');
    expect(first.batches[0].items[0]).toMatchObject({ source: 'src/content/articles/article-000.md', rank: 1, status: 'pending' });
    expect(first.batches[0].items[0].score_breakdown).toMatchObject({ featured: 20, commercial_intent: 10, missing_bluf: 10 });
    expect(first.selection_sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it('preserves the frozen selection and derives completion only from updatedAt', async () => {
    const root = await fixture();
    const initial = await buildArticleRefreshProgram({ root });
    const firstSource = initial.batches[0].items[0].source;
    const firstFile = join(root, firstSource);
    const raw = await readFile(firstFile, 'utf8');
    await writeFile(firstFile, raw.replace('publishedAt: 2026-01-01', 'publishedAt: 2026-01-01\nupdatedAt: 2026-08-02').replace('A useful short answer.', 'A much longer refreshed article with new headings and links.'));
    const refreshed = await buildArticleRefreshProgram({ root, previousReport: initial });
    expect(refreshed.batches[0].items[0]).toMatchObject({ source: firstSource, rank: 1, status: 'refreshed', refreshed_at: '2026-08-02' });
    expect(refreshed.summary).toMatchObject({ refreshed: 1, pending: 99 });
    expect(refreshed.selection_sha256).toBe(initial.selection_sha256);
  });
});
