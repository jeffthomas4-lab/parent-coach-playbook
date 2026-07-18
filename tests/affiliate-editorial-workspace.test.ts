import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import report from '../reports/affiliate/inventory.json';

describe('protected affiliate editorial workspace', () => {
  it('surfaces the governed report on the already protected admin desk without adding a mutation', async () => {
    const page = await readFile(new URL('../src/pages/admin/index.astro', import.meta.url), 'utf8');
    expect(page).toContain("import affiliateReport from '../../../reports/affiliate/inventory.json'");
    expect(page).toContain('requireAdmin(Astro.request, env)');
    expect(page).toContain('Unreferenced inventory candidates');
    expect(page).toContain('this desk cannot activate an account, change a destination, or publish a link');
    expect(page).not.toMatch(/fetch\(|method=["']post/i);
  });

  it('keeps the snapshot internally reconciled and free of destination URLs', () => {
    expect(report.inventoryCount).toBe(report.links.length);
    expect(report.referencedCount + report.unreferencedCount).toBe(report.inventoryCount);
    expect(report.unreferencedCount).toBe(report.links.filter((link) => link.sources.length === 0).length);
    expect(report.errorCount).toBe(0);
    expect(JSON.stringify(report.links)).not.toMatch(/https?:\/\//i);
  });
});
