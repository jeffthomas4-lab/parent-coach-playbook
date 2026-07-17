import { describe, expect, it, vi } from 'vitest';
import { listStaleCamps } from '../../src/lib/camps-db';

describe('stale-camp query bounds', () => {
  it.each([
    { requested: 0, expected: 1 },
    { requested: 25, expected: 25 },
    { requested: 10_000, expected: 101 },
  ])('clamps $requested to $expected with deterministic ordering', async ({ requested, expected }) => {
    const all = vi.fn().mockResolvedValue({ results: [] });
    const bind = vi.fn(() => ({ all }));
    const prepare = vi.fn((_sql: string) => ({ bind }));
    const db = { prepare } as unknown as D1Database;

    await listStaleCamps(db, '2026-07-16', requested);

    expect(bind).toHaveBeenCalledWith('2026-07-16', expected);
    const sql = prepare.mock.calls[0]?.[0];
    expect(sql).toBeTypeOf('string');
    expect(sql).toContain('ORDER BY p.session_end_date ASC, p.id ASC');
    expect(sql).toContain('LIMIT ?');
  });
});
