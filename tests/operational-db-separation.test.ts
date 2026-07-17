import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

const operationalFiles = [
  '../src/pages/api/trust/request.ts',
  '../src/pages/api/search-event.ts',
  '../src/pages/api/admin/trust/[id]/update.ts',
  '../src/pages/api/admin/trust/[id]/suppression.ts',
  '../src/pages/api/admin/trust/[id]/draft.ts',
  '../src/pages/api/admin/trust/[id]/drafts/[draftId]/approve.ts',
  '../src/pages/api/admin/trust/[id]/deliveries/[attemptId]/reconcile.ts',
  '../src/pages/admin/trust/index.astro',
  '../src/pages/admin/trust/drafts.astro',
  '../src/pages/admin/trust/deliveries.astro',
  '../src/pages/admin/retention.astro',
];

describe('PCD operational database separation', () => {
  it('routes trust, retention, and demand state only through PCD_OPS_DB', async () => {
    for (const file of operationalFiles) {
      const source = await readFile(new URL(file, import.meta.url), 'utf8');
      expect(source, file).toContain('PCD_OPS_DB');
      expect(source, file).not.toMatch(/env(?:\?|)\.DB\b/);
    }
  });

  it('keeps staged and production operational database bindings distinct', async () => {
    const staging = await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
    expect(staging).toContain('"binding": "PCD_OPS_DB"');
    expect(staging).toContain('"database_name": "parent-coach-desk-ops-staging"');
    expect(staging).toContain('"migrations_dir": "migrations-pcd-ops"');
    expect(staging).not.toContain('"binding": "FORGE_DB"');
    expect(staging).not.toContain('"database_name": "forge-command"');

    const production = await readFile(new URL('../wrangler.production.jsonc', import.meta.url), 'utf8');
    expect(production).toContain('"binding": "PCD_OPS_DB"');
    expect(production).toContain('"database_name": "parent-coach-desk-ops-production"');
    expect(production).toContain('"migrations_dir": "migrations-pcd-ops"');
    expect(production).not.toContain('parent-coach-desk-ops-staging');
  });

  it('keeps the directory and agent-control bindings distinct', async () => {
    const config = await readFile(new URL('../wrangler.production.jsonc', import.meta.url), 'utf8');
    expect(config).toContain('"binding": "DB"');
    expect(config).toContain('"binding": "FORGE_DB"');
  });

  it('keeps the prepared operational migration lineage isolated and synchronized', async () => {
    const files = [
      '0011_trust_cases.sql',
      '0012_trust_drafts_and_notification_outbox.sql',
      '0013_demand_events_v1.sql',
      '0014_trust_intake_idempotency.sql',
    ];
    for (const file of files) {
      const legacy = await readFile(new URL(`../migrations/${file}`, import.meta.url), 'utf8');
      const operational = await readFile(new URL(`../migrations-pcd-ops/${file}`, import.meta.url), 'utf8');
      expect(operational, file).toBe(legacy);
    }
    const readme = await readFile(new URL('../migrations-pcd-ops/README.md', import.meta.url), 'utf8');
    expect(readme).toContain('must never be applied to the shared Activity Radar `DB` binding');
    expect(readme).toContain('production Worker now declares the separate `PCD_OPS_DB` binding');
    expect(readme).toContain('all migrations `0011` through `0022` pending');
    expect(readme).toContain('Adding a production migration or enabling a feature requires exact-target review and explicit approval');
  });

  it('makes the rehearsal config local-only and impossible to confuse with production', async () => {
    const config = await readFile(new URL('../wrangler.pcd-ops.local.jsonc', import.meta.url), 'utf8');
    expect(config).toContain('pcd-ops-local-proof-do-not-deploy');
    expect(config).toContain('00000000-0000-0000-0000-000000000000');
    expect(config).toContain('"migrations_dir": "migrations-pcd-ops"');
    expect(config).not.toMatch(/parent-coach-desk"|activity-radar|routes|custom_domain/i);
  });
});
