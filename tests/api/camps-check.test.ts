// Tests for POST /api/camps/check — public dedup-probe route. Happy path, failure path.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  findFuzzyCampMatches: vi.fn(),
  getDomainQuality: vi.fn(),
  extractDomain: vi.fn(),
}));

import { POST } from '../../src/pages/api/camps/check';
import * as campsDb from '../../src/lib/camps-db';

function jsonReq(body: unknown) {
  return new Request('https://parentcoachdesk.com/api/camps/check', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/camps/check', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.findFuzzyCampMatches as any).mockResolvedValue([]);
    (campsDb.getDomainQuality as any).mockResolvedValue(null);
    (campsDb.extractDomain as any).mockReturnValue(null);
  });

  it('happy path: a request with no matches returns an empty match list', async () => {
    const ctx = makeContext({ request: jsonReq({ name: 'Tacoma Soccer Camp', city: 'Tacoma', state: 'wa' }), env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.duplicate_count).toBe(0);
    expect(campsDb.findFuzzyCampMatches).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ state: 'WA' }));
  });

  it('happy path: a request with fuzzy matches returns them with reasons', async () => {
    (campsDb.findFuzzyCampMatches as any).mockResolvedValue([
      { camp: { id: 'camp_1', slug: 's', name: 'Tacoma Soccer Camp', city: 'Tacoma', state: 'WA', status: 'approved', website_url: null }, reason: 'name+city' },
    ]);
    (campsDb.extractDomain as any).mockReturnValue('example.com');
    (campsDb.getDomainQuality as any).mockResolvedValue({ domain: 'example.com', quality: 'good' });
    const ctx = makeContext({
      request: jsonReq({ name: 'Tacoma Soccer Camp', city: 'Tacoma', state: 'WA', website_url: 'https://example.com' }),
      env: { DB: {} },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.duplicate_count).toBe(1);
    expect(body.matches[0].reason).toBe('name+city');
    expect(body.domain_stats).toEqual({ domain: 'example.com', quality: 'good' });
  });

  it('failure path: missing required fields is rejected without querying the DB', async () => {
    const ctx = makeContext({ request: jsonReq({ name: 'Tacoma Soccer Camp' }), env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(campsDb.findFuzzyCampMatches).not.toHaveBeenCalled();
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: jsonReq({ name: 'X', city: 'Y', state: 'WA' }), env: {} });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
  });
});
