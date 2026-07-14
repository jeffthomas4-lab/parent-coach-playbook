// Tests for GET /api/camps/search-priority — public read-only route. Happy path, failure path.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/search-registry', () => ({
  getAnchor: vi.fn(),
  listRecheckDue: vi.fn(),
  listSkipDomains: vi.fn(),
  slimNote: vi.fn((n: string | null) => n ?? ''),
}));

import { GET } from '../../src/pages/api/camps/search-priority';
import * as registry from '../../src/lib/search-registry';

function req(qs: string) {
  return new Request(`https://parentcoachdesk.com/api/camps/search-priority?${qs}`);
}

describe('GET /api/camps/search-priority', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (registry.getAnchor as any).mockResolvedValue({
      slug: 'tacoma-wa-25mi',
      city: 'Tacoma',
      radius_miles: 25,
      status: 'active',
      last_batch_at: '2026-07-01',
      next_batch_after: '2026-07-08',
    });
    (registry.listRecheckDue as any).mockResolvedValue([
      { domain: 'example.com', organization: 'Example Org', result: 'found', camps_pulled: 3, next_recheck_after: '2026-07-14', notes: 'note' },
    ]);
    (registry.listSkipDomains as any).mockResolvedValue(['spam.com', 'aggregator.com']);
  });

  it('happy path: returns anchor, recheck-due, and skip-domain buckets', async () => {
    const ctx = makeContext({ request: req('anchor=tacoma-wa-25mi&today=2026-07-14'), env: { DB: {} } });
    const res = await GET(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.anchor.city).toBe('Tacoma');
    expect(body.recheck_due).toHaveLength(1);
    expect(body.skip_domains).toEqual(['spam.com', 'aggregator.com']);
    expect(body.counts).toEqual({ recheck_due: 1, skip_domains: 2 });
  });

  it('happy path: defaults to the tacoma anchor and today when no query params given', async () => {
    const ctx = makeContext({ request: req(''), env: { DB: {} } });
    const res = await GET(ctx);
    expect(res.status).toBe(200);
    expect(registry.getAnchor).toHaveBeenCalledWith(expect.anything(), 'tacoma-wa-25mi');
  });

  it('failure path: an unknown anchor returns a null anchor, not an error', async () => {
    (registry.getAnchor as any).mockResolvedValue(null);
    const ctx = makeContext({ request: req('anchor=nowhere'), env: { DB: {} } });
    const res = await GET(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.anchor).toBeNull();
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: req(''), env: {} });
    const res = await GET(ctx);
    expect(res.status).toBe(500);
  });
});
