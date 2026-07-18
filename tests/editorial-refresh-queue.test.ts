import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildEditorialRefreshQueue } from '../scripts/editorial-refresh-queue.mjs';

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'pcd-refresh-'));
  await mkdir(join(root, 'src/content/articles'), { recursive: true });
  await mkdir(join(root, 'src/pages'), { recursive: true });
  const article = (title: string, date: string, extra = '', body = '') => `---\ntitle: ${title}\nphase: drive-home\npublishedAt: ${date}\n${extra}draft: false\n---\n${body}\n`;
  await writeFile(join(root, 'src/content/articles/old.md'), article('Old article', '2024-01-01', '', '[Buy](/go/glove/)'));
  await writeFile(join(root, 'src/content/articles/current.md'), article('Current article', '2026-01-01'));
  await writeFile(join(root, 'src/content/articles/fact.md'), article('Fact article', '2026-01-01', '  factCheckGoodThrough: 2026-06-01\n'));
  await writeFile(join(root, 'src/content/articles/scheduled.md'), article('Scheduled article', '2026-07-20'));
  await writeFile(join(root, 'src/content/articles/draft.md'), article('Draft article', '2024-01-01', 'draft: true\n').replace('draft: true\ndraft: false', 'draft: true'));
  await writeFile(join(root, 'src/pages/index.astro'), '<a href="/drive-home/old/">Old</a>');
  return root;
}

describe('editorial refresh queue', () => {
  it('derives the 18-month, fact-check, affiliate and incoming-link review states', async () => {
    const report = await buildEditorialRefreshQueue({ root: await fixture(), asOf: new Date('2026-07-18T00:00:00Z') });
    expect(report.summary).toEqual({ live_articles: 3, refresh_due: 1, fact_check_due: 1, refresh_due_without_explicit_source_reference: 0, affiliate_link_review: 1 });
    expect(report.items.find((item) => item.route.endsWith('/old/'))).toMatchObject({ state: 'refresh_due', explicit_source_references: 1, contains_affiliate_redirect: true, refresh_due_at: '2025-07-01' });
    expect(report.items.some((item) => item.route.endsWith('/current/'))).toBe(false);
    expect(report.next_refreshes.some((item) => item.route.endsWith('/current/'))).toBe(true);
    expect(report.inventory_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(report.items.find((item) => item.route.endsWith('/fact/'))?.state).toBe('fact_check_due');
    expect(report.policy).toMatchObject({ automatic_redirects: false, automatic_deletions: false, traffic_data_included: false });
    expect(report.policy.decommission_requires).toContain('emitted incoming-link audit');
  });

  it('is deterministic and rejects malformed source dates', async () => {
    const root = await fixture();
    expect(await buildEditorialRefreshQueue({ root, asOf: new Date('2026-07-18T00:00:00Z') })).toEqual(await buildEditorialRefreshQueue({ root, asOf: new Date('2026-07-18T00:00:00Z') }));
    await writeFile(join(root, 'src/content/articles/bad.md'), '---\ntitle: Bad date\nphase: game\npublishedAt: nope\n---\n');
    await expect(buildEditorialRefreshQueue({ root, asOf: new Date('2026-07-18T00:00:00Z') })).rejects.toThrow('invalid publishedAt');
  });

  it('surfaces the governed snapshot on the protected editorial desk', async () => {
    const page = await readFile('src/pages/admin/editorial/index.astro', 'utf8');
    expect(page).toContain("reports/editorial/editorial-refresh-queue.json");
    expect(page).toContain('data-refresh-summary');
    expect(page).toContain('never redirects or deletes content');
    expect(page).not.toMatch(/fetch\([^)]*editorial-refresh/i);
  });
});
