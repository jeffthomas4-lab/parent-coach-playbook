// Tests for GET /api/camps/nearest — public geolocation route. Happy path, failure path.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  slugifyCity: vi.fn((s: string) => s.toLowerCase().replace(/\s+/g, '-')),
}));

import { GET } from '../../src/pages/api/camps/nearest';

function makeDb(rows: Array<{ city: string; state: string; latitude: number; longitude: number }>) {
  return {
    prepare: vi.fn(() => ({
      all: vi.fn().mockResolvedValue({ results: rows }),
    })),
  };
}

function req(qs: string) {
  return new Request(`https://parentcoachdesk.com/api/camps/nearest?${qs}`);
}

describe('GET /api/camps/nearest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('happy path: finds the nearest city within range', async () => {
    const db = makeDb([
      { city: 'Tacoma', state: 'WA', latitude: 47.2529, longitude: -122.4443 },
      { city: 'Tacoma', state: 'WA', latitude: 47.2529, longitude: -122.4443 },
      { city: 'Seattle', state: 'WA', latitude: 47.6062, longitude: -122.3321 },
    ]);
    const ctx = makeContext({ request: req('lat=47.25&lon=-122.44'), env: { DB: db } });
    const res = await GET(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.city).toBe('Tacoma');
    expect(body.count).toBe(2);
  });

  it('failure path: missing lat/lon returns 400', async () => {
    const ctx = makeContext({ request: req(''), env: { DB: makeDb([]) } });
    const res = await GET(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: no camps in the database returns 404', async () => {
    const ctx = makeContext({ request: req('lat=47.25&lon=-122.44'), env: { DB: makeDb([]) } });
    const res = await GET(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(404);
    expect(body.error).toBe('no camps');
  });

  it('failure path: nearest city beyond the 75-mile range returns 404', async () => {
    const db = makeDb([{ city: 'Miami', state: 'FL', latitude: 25.7617, longitude: -80.1918 }]);
    const ctx = makeContext({ request: req('lat=47.25&lon=-122.44'), env: { DB: db } });
    const res = await GET(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(404);
    expect(body.error).toBe('nearest city is too far away');
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: req('lat=47.25&lon=-122.44'), env: {} });
    const res = await GET(ctx);
    expect(res.status).toBe(500);
  });
});
