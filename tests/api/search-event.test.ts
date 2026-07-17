// Tests for POST /api/search-event — public fire-and-forget logging route. Happy path, failure path.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

import { POST } from '../../src/pages/api/search-event';

function makeDb(runImpl: () => Promise<unknown> = () => Promise.resolve({})) {
  const bind = vi.fn(() => ({ run: vi.fn(runImpl) }));
  return { prepare: vi.fn((_sql: string) => ({ bind })), _bind: bind };
}

function jsonReq(body: unknown) {
  return new Request('https://parentcoachdesk.com/api/search-event', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const enabledEnv = (db: unknown, extra: Record<string, unknown> = {}) => ({
  PCD_OPS_DB: db,
  DEMAND_TELEMETRY_ENABLED: 'true',
  DEMAND_EVENT_RETENTION_DAYS: '30',
  ...extra,
});

describe('POST /api/search-event', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('happy path: a valid search event is logged', async () => {
    const db = makeDb();
    const ctx = makeContext({ request: jsonReq({ query: 'flag football', resultCount: 12, sport: 'football' }), env: enabledEnv(db) });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(db._bind).toHaveBeenCalledWith(
      expect.any(String), 1, 'search', 'flag football', 0, 'six_to_twenty', 'site_search',
      null, 'football', null, null, 'unknown', 1, expect.any(String), expect.any(String),
    );
  });

  it('failure path: a missing query is rejected before touching the DB', async () => {
    const db = makeDb();
    const ctx = makeContext({ request: jsonReq({ resultCount: 1 }), env: enabledEnv(db) });
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
    const ctx = makeContext({ request: req, env: enabledEnv(makeDb()) });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: a D1 write failure (e.g. table not migrated) returns 500 without throwing', async () => {
    const db = makeDb(() => Promise.reject(new Error('no such table: search_events')));
    const ctx = makeContext({ request: jsonReq({ query: 'flag football' }), env: enabledEnv(db) });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
  });

  it('failure path: operational database not available returns 503', async () => {
    const ctx = makeContext({ request: jsonReq({ query: 'x' }), env: { DEMAND_TELEMETRY_ENABLED: 'true' } });
    const res = await POST(ctx);
    expect(res.status).toBe(503);
  });

  it('is default-off and does not touch D1', async () => {
    const db = makeDb();
    const res = await POST(makeContext({ request: jsonReq({ query: 'soccer' }), env: { PCD_OPS_DB: db } }));
    expect(res.status).toBe(404);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('fails closed when enabled without an approved bounded retention value', async () => {
    const db = makeDb();
    const res = await POST(makeContext({
      request: jsonReq({ query: 'soccer' }),
      env: { PCD_OPS_DB: db, DEMAND_TELEMETRY_ENABLED: 'true' },
    }));
    expect(res.status).toBe(503);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('redacts contact data and never stores referrer or user-agent', async () => {
    const db = makeDb();
    const request = new Request('https://parentcoachdesk.com/api/search-event', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://parentcoachdesk.com',
        referer: 'https://parentcoachdesk.com/search/?email=private@example.com',
        'user-agent': 'stable-browser-identifier',
      },
      body: JSON.stringify({ query: 'Call 253-555-1212 or private@example.com' }),
    });
    const res = await POST(makeContext({ request, env: enabledEnv(db) }));
    expect(res.status).toBe(200);
    expect(db._bind).toHaveBeenCalledWith(
      expect.any(String), 1, 'search', 'call [phone] or [email]', 1, 'unknown', 'site_search',
      null, null, null, null, 'unknown', 1, expect.any(String), expect.any(String),
    );
    const sql = db.prepare.mock.calls[0][0];
    expect(sql).not.toMatch(/referrer|user_agent|ip_address|cf_connecting/i);
  });

  it('derives a broad bot class without persisting the user-agent', async () => {
    const db = makeDb();
    const request = new Request('https://parentcoachdesk.com/api/search-event', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://parentcoachdesk.com',
        'user-agent': 'ExampleCrawler/1.0',
        'sec-fetch-site': 'same-origin',
      },
      body: JSON.stringify({ query: 'soccer', resultCount: 0, surface: 'camp_directory' }),
    });
    const res = await POST(makeContext({ request, env: enabledEnv(db) }));
    expect(res.status).toBe(200);
    expect(db._bind).toHaveBeenCalledWith(
      expect.any(String), 1, 'search', 'soccer', 0, 'zero', 'camp_directory',
      null, null, null, null, 'bot_likely', 1, expect.any(String), expect.any(String),
    );
    expect(db._bind.mock.calls[0]).not.toContain('ExampleCrawler/1.0');
  });

  it('rejects cross-origin writes', async () => {
    const db = makeDb();
    const request = new Request('https://parentcoachdesk.com/api/search-event', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://attacker.example' },
      body: JSON.stringify({ query: 'soccer' }),
    });
    const res = await POST(makeContext({ request, env: enabledEnv(db) }));
    expect(res.status).toBe(403);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('rejects oversized writes before D1', async () => {
    const db = makeDb();
    const res = await POST(makeContext({
      request: jsonReq({ query: 'x'.repeat(5000) }),
      env: enabledEnv(db),
    }));
    expect(res.status).toBe(413);
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('rate limits before D1 without storing the actor key', async () => {
    const db = makeDb();
    const limiter = { limit: vi.fn().mockResolvedValue({ success: false }) };
    const res = await POST(makeContext({
      request: jsonReq({ query: 'soccer' }),
      env: enabledEnv(db, { DEMAND_RATE_LIMITER: limiter }),
    }));
    expect(res.status).toBe(429);
    expect(db.prepare).not.toHaveBeenCalled();
    expect(limiter.limit).toHaveBeenCalledOnce();
  });
});
