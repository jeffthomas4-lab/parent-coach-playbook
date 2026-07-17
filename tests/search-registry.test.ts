import { describe, expect, it, vi } from 'vitest';
import {
  getAnchor,
  inAnchor,
  listAllDomains,
  listDomainsForAnchor,
  listRecheckDue,
  listSkipDomains,
  slimNote,
  upsertAnchor,
  upsertDomain,
  type SearchDomain,
} from '../src/lib/search-registry';

const domain = (overrides: Partial<SearchDomain> = {}): SearchDomain => ({
  domain: 'example.org',
  organization: 'Example Club',
  area_covered: 'seattle-wa',
  last_checked: null,
  result: 'unknown',
  camps_pulled: 0,
  next_recheck_after: null,
  notes: null,
  permanent_skip: 0,
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
  ...overrides,
});

function readDb(results: SearchDomain[] | undefined) {
  const all = vi.fn().mockResolvedValue({ results });
  const prepare = vi.fn().mockReturnValue({ all });
  return { db: { prepare } as never, prepare, all };
}

describe('search registry query policy', () => {
  it('normalizes notes and truncates long LLM-facing values', () => {
    expect(slimNote(null)).toBe('');
    expect(slimNote('  short\n note  ')).toBe('short note');
    expect(slimNote('x'.repeat(81))).toHaveLength(80);
    expect(slimNote('x'.repeat(81)).endsWith('…')).toBe(true);
  });

  it('matches exact comma-delimited anchors and human-readable area names', () => {
    expect(inAnchor(domain({ area_covered: 'portland-or, seattle-wa' }), 'seattle-wa')).toBe(true);
    expect(inAnchor(domain({ area_covered: 'Greater Seattle WA metro' }), 'seattle-wa')).toBe(true);
    expect(inAnchor(domain({ area_covered: 'Tacoma' }), 'seattle-wa')).toBe(false);
  });

  it('returns ordered database results and treats a missing D1 result list as empty', async () => {
    const populated = readDb([domain()]);
    await expect(listAllDomains(populated.db)).resolves.toHaveLength(1);
    expect(populated.prepare).toHaveBeenCalledWith('SELECT * FROM search_domains ORDER BY domain ASC');

    const empty = readDb(undefined);
    await expect(listAllDomains(empty.db)).resolves.toEqual([]);
  });

  it('scopes domains before applying recheck eligibility', async () => {
    const rows = [
      domain({ domain: 'due.org', next_recheck_after: '2026-07-16' }),
      domain({ domain: 'future.org', next_recheck_after: '2026-07-17' }),
      domain({ domain: 'never.org', next_recheck_after: null }),
      domain({ domain: 'permanent.org', next_recheck_after: '2026-07-01', permanent_skip: 1 }),
      domain({ domain: 'empty.org', next_recheck_after: '2026-07-01', result: 'no_camps' }),
      domain({ domain: 'elsewhere.org', area_covered: 'Tacoma', next_recheck_after: '2026-07-01' }),
    ];
    const { db } = readDb(rows);

    await expect(listDomainsForAnchor(db, 'seattle-wa')).resolves.toHaveLength(5);
    await expect(listRecheckDue(db, 'seattle-wa', '2026-07-16')).resolves.toEqual([rows[0]]);
  });

  it('returns a sorted skip list for permanent, exhausted, and not-yet-due domains', async () => {
    const { db } = readDb([
      domain({ domain: 'z.org', permanent_skip: 1 }),
      domain({ domain: 'a.org', result: 'no_camps' }),
      domain({ domain: 'm.org', next_recheck_after: '2026-07-17' }),
      domain({ domain: 'due.org', next_recheck_after: '2026-07-16' }),
    ]);

    await expect(listSkipDomains(db, 'seattle-wa', '2026-07-16')).resolves.toEqual([
      'a.org',
      'm.org',
      'z.org',
    ]);
  });
});

describe('search registry persistence', () => {
  it('returns an anchor row or null', async () => {
    const first = vi.fn().mockResolvedValue({ slug: 'seattle-wa' });
    const bind = vi.fn().mockReturnValue({ first });
    const prepare = vi.fn().mockReturnValue({ bind });
    const db = { prepare } as never;

    await expect(getAnchor(db, 'seattle-wa')).resolves.toEqual({ slug: 'seattle-wa' });
    expect(bind).toHaveBeenCalledWith('seattle-wa');
    first.mockResolvedValueOnce(undefined);
    await expect(getAnchor(db, 'missing')).resolves.toBeNull();
  });

  it('binds every domain field and executes the upsert', async () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const bind = vi.fn().mockReturnValue({ run });
    const prepare = vi.fn().mockReturnValue({ bind });
    const value = domain();
    const { created_at: _created, updated_at: _updated, ...input } = value;

    await upsertDomain({ prepare } as never, input);

    expect(bind).toHaveBeenCalledTimes(1);
    expect(bind.mock.calls[0].slice(0, 9)).toEqual([
      input.domain,
      input.organization,
      input.area_covered,
      input.last_checked,
      input.result,
      input.camps_pulled,
      input.next_recheck_after,
      input.notes,
      input.permanent_skip,
    ]);
    expect(run).toHaveBeenCalledOnce();
  });

  it('binds anchor state and executes the upsert', async () => {
    const run = vi.fn().mockResolvedValue(undefined);
    const bind = vi.fn().mockReturnValue({ run });
    const prepare = vi.fn().mockReturnValue({ bind });
    const anchor = {
      slug: 'seattle-wa',
      city: 'Seattle',
      radius_miles: 50,
      status: 'in_progress' as const,
      last_batch_at: null,
      next_batch_after: '2026-07-20',
      notes: 'Continue north',
      ring: 2,
      position: 4,
    };

    await upsertAnchor({ prepare } as never, anchor);

    expect(bind.mock.calls[0].slice(0, 9)).toEqual(Object.values(anchor));
    expect(run).toHaveBeenCalledOnce();
  });
});
