import { describe, expect, it, vi } from 'vitest';
import { listDemandOpportunities } from '../src/lib/demand-reporting';

describe('demand opportunity reporting', () => {
  it('aggregates only current non-bot events without exposing raw rows', async () => {
    const all = vi.fn(async () => ({ results: [{
      query: 'soccer camps', searches: 8, zero_result_searches: 5, last_seen_at: '2026-07-18T00:00:00.000Z',
    }] }));
    const bind = vi.fn(() => ({ all }));
    const prepare = vi.fn((_sql: string) => ({ bind }));
    const db = { prepare } as unknown as D1Database;

    await expect(listDemandOpportunities(db, '2026-07-18T01:00:00.000Z', 10)).resolves.toHaveLength(1);
    expect(bind).toHaveBeenCalledWith('2026-07-18T01:00:00.000Z', 10);
    const sql = prepare.mock.calls[0][0];
    expect(sql).toContain('expires_at > ?');
    expect(sql).toContain("bot_class != 'bot_likely'");
    expect(sql).toContain("result_band = 'zero'");
    expect(sql).not.toMatch(/event_id|ip_address|user_agent|referrer/);
  });

  it('rejects unbounded or invalid report inputs', async () => {
    const db = {} as D1Database;
    await expect(listDemandOpportunities(db, 'invalid')).rejects.toThrow('invalid reporting time');
    await expect(listDemandOpportunities(db, '2026-07-18T00:00:00.000Z', 101)).rejects.toThrow('invalid reporting limit');
  });
});
