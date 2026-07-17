// Direct unit coverage for rejectCamp()'s TOCTOU fix: the pending -> rejected
// transition must be a single atomic conditional UPDATE (no prior SELECT
// deciding whether to write), and the caller-visible `transitioned` flag
// must come only from that UPDATE's own reported change count.
//
// Mock style mirrors camps-db-atomicity.test.ts: a fake D1Database whose
// prepare()/bind() records the SQL issued and lets the test control what
// .run()/.first() resolve to.

import { describe, expect, it, vi } from 'vitest';
import { rejectCamp } from '../../src/lib/camps-db';

function fakeDb(opts: { runChanges: number; selectRow: Record<string, unknown> | null }) {
  const preparedSql: string[] = [];
  const run = vi.fn().mockResolvedValue({ meta: { changes: opts.runChanges } });
  const first = vi.fn().mockResolvedValue(opts.selectRow);
  const database = {
    prepare(sql: string) {
      preparedSql.push(sql);
      return {
        bind(..._values: unknown[]) {
          return { run, first };
        },
      };
    },
  } as unknown as D1Database;
  return { database, preparedSql, run, first };
}

describe('rejectCamp atomicity', () => {
  it('issues a single conditional UPDATE guarded on status, not a prior read', async () => {
    const { database, preparedSql, run } = fakeDb({
      runChanges: 1,
      selectRow: { id: 'camp-1', status: 'rejected', source_domain: 'example.com' },
    });

    const result = await rejectCamp(database, 'camp-1', 'admin@example.com', 'dead link', 'dead-url');

    // Exactly two statements: the conditional UPDATE, then the SELECT used
    // only to return the camp row — never a SELECT consulted beforehand to
    // decide whether to write.
    expect(preparedSql).toHaveLength(2);
    expect(preparedSql[0]).toContain('UPDATE programs');
    expect(preparedSql[0]).toContain("pcd_status != 'rejected'");
    expect(preparedSql[1]).not.toContain('UPDATE');
    expect(run).toHaveBeenCalledOnce();

    expect(result.transitioned).toBe(true);
    expect(result.camp?.id).toBe('camp-1');
  });

  it('reports transitioned: false when the UPDATE affects zero rows, even though the camp exists', async () => {
    // Models the race/replay case: another request already flipped the row
    // to 'rejected', so this call's conditional UPDATE matches no rows.
    const { database } = fakeDb({
      runChanges: 0,
      selectRow: { id: 'camp-1', status: 'rejected', source_domain: 'example.com' },
    });

    const result = await rejectCamp(database, 'camp-1', 'admin@example.com');

    expect(result.transitioned).toBe(false);
    expect(result.camp?.id).toBe('camp-1');
  });

  it('reports camp: null when the id does not exist', async () => {
    const { database } = fakeDb({ runChanges: 0, selectRow: null });

    const result = await rejectCamp(database, 'missing-id', 'admin@example.com');

    expect(result.transitioned).toBe(false);
    expect(result.camp).toBeNull();
  });
});
