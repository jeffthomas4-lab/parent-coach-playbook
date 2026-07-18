import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const root = new URL('../', import.meta.url);
const read = (path: string) => readFile(new URL(path, root), 'utf8');

describe('repository operator entrypoints', () => {
  it('routes current status, releases, and placement to one authority each', async () => {
    const readme = await read('README.md');
    expect(readme).toContain('Astro 7 with Cloudflare adapter');
    expect(readme).toContain('Cloudflare Workers');
    expect(readme).toContain('DEPLOYMENT-RUNBOOK.md');
    expect(readme).toContain('coordination/CURRENT_STATE.md');
    expect(readme).toContain('coordination/REPOSITORY-STRUCTURE.md');
    expect(readme).not.toContain('| Hosting     | Cloudflare Pages');
  });

  it('keeps the three D1 migration lineages explicitly distinct', async () => {
    const structure = await read('coordination/REPOSITORY-STRUCTURE.md');
    for (const path of ['migrations-activity-radar/', 'migrations-pcd-ops/', 'migrations/']) {
      expect(structure).toContain(`\`${path}\``);
    }
    expect(structure).toContain('never run it against `DB`');
  });

  it('defines canonical destinations for new governance artifacts', async () => {
    const structure = await read('coordination/REPOSITORY-STRUCTURE.md');
    for (const path of [
      'coordination/plans/',
      'coordination/reviews/',
      'coordination/handoffs/',
      'coordination/release-evidence/',
      'reports/',
    ]) {
      expect(structure).toContain(`\`${path}\``);
    }
  });
});
