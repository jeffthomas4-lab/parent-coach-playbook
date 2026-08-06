import { describe, expect, it } from 'vitest';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';

describe('disposable intel database smoke test', () => {
  it('applies every activity-radar migration plus skip-list and link_health', async () => {
    const { db } = await createDisposableIntelDatabase();
    await db.prepare(`INSERT INTO organizations (id, slug, name, website_url, record_status, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, ?)`)
      .bind('org-1', 'org-1', 'Org One', 'https://example.org/', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')
      .run();
    const row = await db.prepare(`SELECT * FROM organizations WHERE id = ?`).bind('org-1').first();
    expect(row).toBeTruthy();

    const tables = ['competitors', 'org_tech_signals', 'org_tech_stack', 'org_tech_history', 'intel_runs', 'intel_review_queue', 'org_opportunity_scores', 'intel_fetch_log', 'domain_skip_list', 'link_health'];
    for (const table of tables) {
      const res = await db.prepare(`SELECT COUNT(*) as n FROM ${table}`).all();
      expect(res.results).toBeTruthy();
    }
  });
});
