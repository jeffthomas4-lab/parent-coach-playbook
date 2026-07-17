import { describe, expect, it } from 'vitest';
import { RETENTION_AUDIT_POLICIES, runRetentionAudit } from '../../src/lib/retention-audit';

function fakeDb() {
  const cutoffs: string[] = [];
  const db = {
    prepare(sql: string) {
      if (sql.includes('sqlite_master')) {
        return { all: async () => ({ results: [{ name: 'search_events' }, { name: 'org_suggestions' }] }) };
      }
      return {
        bind(cutoff: string) {
          cutoffs.push(cutoff);
          return {
            first: async () => {
              if (sql.includes('FROM org_suggestions')) throw new Error('schema drift');
              return { total_records: 12, aging_records: 3, oldest_record_at: '2025-01-01T00:00:00.000Z' };
            },
          };
        },
      };
    },
  };
  return { db: db as unknown as D1Database, cutoffs };
}

describe('retention aging audit', () => {
  it('is read-only by construction and keeps every disposition non-destructive', () => {
    expect(RETENTION_AUDIT_POLICIES.length).toBeGreaterThan(0);
    for (const policy of RETENTION_AUDIT_POLICIES) {
      expect(policy.reviewAfterDays).toBeGreaterThan(0);
      expect(['proposal-only', 'counsel-required']).toContain(policy.disposition);
      expect(policy.table).toMatch(/^[a-z_]+$/);
      expect(policy.dateColumn).toMatch(/^[a-z_]+$/);
    }
  });

  it('reports counts, missing migrations, and query failures without mutating data or leaking errors', async () => {
    const { db, cutoffs } = fakeDb();
    const rows = await runRetentionAudit(db, new Date('2026-07-16T00:00:00.000Z'));
    const search = rows.find((row) => row.table === 'search_events');
    const suggestions = rows.find((row) => row.table === 'org_suggestions');
    const trust = rows.find((row) => row.table === 'trust_cases');

    expect(search).toMatchObject({ tablePresent: true, totalPersonalRecords: 12, recordsPastReviewHorizon: 3, error: null });
    expect(suggestions).toMatchObject({ tablePresent: true, totalPersonalRecords: null, error: 'query-failed' });
    expect(trust).toMatchObject({ tablePresent: false, totalPersonalRecords: null, error: null });
    expect(cutoffs).toEqual(['2026-04-17T00:00:00.000Z', '2026-01-17T00:00:00.000Z']);
  });
});
