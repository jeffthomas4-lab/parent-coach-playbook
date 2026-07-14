// Tests for POST /api/search-event — public fire-and-forget logging route. Happy path, failure path.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

import { POST } from '../../src/pages/api/search-event';

function makeDb(runImpl: () => Promise<unknown> = () => Promise.resolve({})) {
  const bind = vi.fn(() => ({ run: vi.fn(runImpl) }));
  return { prepare: vi.fn(() => ({ bind })), _bind: bind };
}

function jsonReq(body: unknown) {
  return new Request('https://parentcoachdesk.com/api/search-event', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/search-event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('happy path: a valid search event is logged', async () => {
    const db = makeDb();
    const ctx = makeContext({ request: jsonReq({ query: 'flag football', resultCount: 12, sport: 'football' }), env: { DB: db } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(db._bind).toHaveBeenCalledWith('flag football', 12, null, 'football', null, null, null, expect.any(String));
  });

  it('failure path: a missing query is rejected before touching the DB', async () => {
    const db = makeDb();
    const ctx = makeContext({ request: jsonReq({ resultCount: 1 }), env: { DB: db } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('failure path: invalid JSON body returns 400', async () => {
    const req = new Request('https://parentcoachdesk.com/api/search-event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{not json',
    });
    const ctx = makeContext({ request: req, env: { DB: makeDb() } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: a D1 write failure (e.g. table not migrated) returns 500 without throwing', async () => {
    const db = makeDb(() => Promise.reject(new Error('no such table: search_events')));
    const ctx = makeContext({ request: jsonReq({ query: 'flag football' }), env: { DB: db } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: jsonReq({ query: 'x' }), env: {} });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
  });
});
