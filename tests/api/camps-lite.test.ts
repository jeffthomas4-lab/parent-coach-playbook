// Tests for GET /api/camps/lite — public, cached, read-only route. Happy
// path, failure path, and the refusal case Pillar 9 asks for on a public
// route with no auth boundary (a bad method).
//
// The Cache API (`caches.default`) does not exist under plain Node — see
// src/lib/camps-lite-cache.ts's file header — so every request in this file
// exercises the "no edge cache available, fall through to D1" branch. That
// is also exactly what happens in local dev outside `wrangler dev`, so it is
// a real code path, not just a test artifact.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  listApprovedCamps: vi.fn(),
}));

import { GET } from '../../src/pages/api/camps/lite';
import * as campsDb from '../../src/lib/camps-db';

function makeCamp(overrides: Record<string, unknown> = {}) {
  return {
    id: 'camp-1',
    name: 'Tacoma Soccer Camp',
    slug: 'tacoma-soccer-camp',
    sport: 'soccer',
    age_min: 6,
    age_max: 12,
    age_known: 1,
    start_date: '2026-08-01',
    end_date: '2026-08-05',
    city: 'Tacoma',
    state: 'WA',
    day_or_overnight: 'day',
    spots_status: 'open',
    verified: 1,
    last_verified_at: '2026-07-01T00:00:00.000Z',
    program_type: 'camp',
    latitude: 47.25,
    longitude: -122.44,
    description: 'A great soccer camp for kids.',
    hero_photo_key: null,
    price_text: '$150',
    date_added: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

function req(method = 'GET') {
  return new Request('https://parentcoachdesk.com/api/camps/lite', { method });
}

describe('GET /api/camps/lite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('happy path: returns the full campsLite array and the sports list', async () => {
    (campsDb.listApprovedCamps as any).mockResolvedValue([makeCamp()]);
    const ctx = makeContext({ request: req(), env: { DB: {} } });
    const res = await GET(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=300');
    expect(body.ok).toBe(true);
    expect(body.camps).toHaveLength(1);
    expect(body.camps[0]).toMatchObject({ id: 'camp-1', name: 'Tacoma Soccer Camp', slug: 'tacoma-soccer-camp' });
    // The lite projection is a strict subset — admin-only columns like
    // contact_email or submitted_by_email never reach this response.
    expect(body.camps[0]).not.toHaveProperty('contact_email');
    expect(Array.isArray(body.sports)).toBe(true);
  });

  it('failure path: a D1 read failure returns 500 with no raw error detail', async () => {
    (campsDb.listApprovedCamps as any).mockRejectedValue(new Error('D1 is down'));
    const ctx = makeContext({ request: req(), env: { DB: {} } });
    const res = await GET(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(JSON.stringify(body)).not.toContain('D1 is down');
  });

  it('refusal: a non-GET method is rejected with 405, not routed to the handler logic', async () => {
    const ctx = makeContext({ request: req('POST'), env: { DB: {} } });
    const res = await GET(ctx);
    expect(res.status).toBe(405);
    expect(res.headers.get('Allow')).toBe('GET');
    expect(campsDb.listApprovedCamps).not.toHaveBeenCalled();
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: req(), env: {} });
    const res = await GET(ctx);
    expect(res.status).toBe(500);
  });
});
