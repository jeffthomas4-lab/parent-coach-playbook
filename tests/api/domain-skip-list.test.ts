// Direct unit coverage for src/lib/domain-skip-list.ts — the fake-D1 pattern
// mirrors camps-db-reject-atomicity.test.ts: a stand-in D1Database whose
// prepare()/bind() records the SQL issued and lets the test control what
// .run()/.first()/.all() resolve to.

import { describe, expect, it, vi } from 'vitest';
import {
  isDomainSkipListed,
  addDomainToSkipList,
  removeDomainFromSkipList,
  bulkRejectPendingByDomain,
} from '../../src/lib/domain-skip-list';

function fakeDb(opts: { firstRow?: Record<string, unknown> | null; allRows?: Record<string, unknown>[]; runChanges?: number }) {
  const preparedSql: string[] = [];
  const boundArgs: unknown[][] = [];
  const run = vi.fn().mockResolvedValue({ meta: { changes: opts.runChanges ?? 0 } });
  const first = vi.fn().mockResolvedValue(opts.firstRow ?? null);
  const all = vi.fn().mockResolvedValue({ results: opts.allRows ?? [] });
  const database = {
    prepare(sql: string) {
      preparedSql.push(sql);
      return {
        bind(...values: unknown[]) {
          boundArgs.push(values);
          return { run, first, all };
        },
      };
    },
  } as unknown as D1Database;
  return { database, preparedSql, boundArgs, run, first, all };
}

describe('isDomainSkipListed', () => {
  it('returns false for a null/undefined domain without touching the database', async () => {
    const { database, first } = fakeDb({ firstRow: null });
    expect(await isDomainSkipListed(database, null)).toBe(false);
    expect(await isDomainSkipListed(database, undefined)).toBe(false);
    expect(first).not.toHaveBeenCalled();
  });

  it('returns true when a matching row exists', async () => {
    const { database } = fakeDb({ firstRow: { domain: 'bad.example.com' } });
    expect(await isDomainSkipListed(database, 'bad.example.com')).toBe(true);
  });

  it('returns false when no matching row exists', async () => {
    const { database } = fakeDb({ firstRow: null });
    expect(await isDomainSkipListed(database, 'good.example.com')).toBe(false);
  });
});

describe('addDomainToSkipList', () => {
  it('issues an upsert with the domain, reason, and admin email bound', async () => {
    const { database, preparedSql, boundArgs, run } = fakeDb({});
    await addDomainToSkipList(database, 'bad.example.com', 'Aggregator source', 'jeffthomas@pugetsound.edu');
    expect(preparedSql[0]).toContain('INSERT INTO domain_skip_list');
    expect(preparedSql[0]).toContain('ON CONFLICT(domain)');
    expect(boundArgs[0][0]).toBe('bad.example.com');
    expect(boundArgs[0][1]).toBe('Aggregator source');
    expect(boundArgs[0][2]).toBe('jeffthomas@pugetsound.edu');
    expect(run).toHaveBeenCalledOnce();
  });
});

describe('removeDomainFromSkipList', () => {
  it('issues a DELETE scoped to the domain', async () => {
    const { database, preparedSql, boundArgs } = fakeDb({});
    await removeDomainFromSkipList(database, 'bad.example.com');
    expect(preparedSql[0]).toContain('DELETE FROM domain_skip_list');
    expect(boundArgs[0]).toEqual(['bad.example.com']);
  });
});

describe('bulkRejectPendingByDomain', () => {
  it('scopes the UPDATE to the domain and pending status only, and returns the changed count', async () => {
    const { database, preparedSql, boundArgs } = fakeDb({ runChanges: 4 });
    const count = await bulkRejectPendingByDomain(
      database,
      'bad.example.com',
      'jeffthomas@pugetsound.edu',
      'other',
      'source-quality bulk reject',
    );
    expect(count).toBe(4);
    expect(preparedSql[0]).toContain('UPDATE programs');
    expect(preparedSql[0]).toContain("pcd_status = 'rejected'");
    expect(preparedSql[0]).toContain('WHERE source_domain = ? AND pcd_status = \'pending\'');
    expect(boundArgs[0]).toEqual([
      'jeffthomas@pugetsound.edu',
      expect.any(String),
      'source-quality bulk reject',
      'other',
      'bad.example.com',
    ]);
  });

  it('reports zero when nothing pending matches the domain', async () => {
    const { database } = fakeDb({ runChanges: 0 });
    const count = await bulkRejectPendingByDomain(database, 'quiet.example.com', 'admin@example.com', 'other', 'note');
    expect(count).toBe(0);
  });
});
