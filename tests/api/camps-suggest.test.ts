// Tests for POST /api/camps/suggest — public route. Happy path, failure path, spam/honeypot path.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  insertOrgSuggestion: vi.fn().mockResolvedValue(undefined),
  generateOrgSuggestionId: vi.fn(() => 'sugg_fixed_id'),
}));

import { POST } from '../../src/pages/api/camps/suggest';
import * as campsDb from '../../src/lib/camps-db';

function jsonReq(body: unknown) {
  return new Request('https://parentcoachdesk.com/api/camps/suggest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/camps/suggest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.insertOrgSuggestion as any).mockResolvedValue(undefined);
    (campsDb.generateOrgSuggestionId as any).mockReturnValue('sugg_fixed_id');
  });

  it('happy path: a valid suggestion is inserted and returns its id', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', org_website: 'tacomasoccer.org', org_city: 'Tacoma', org_state: 'wa' }),
      env: { DB: {} },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.id).toBe('sugg_fixed_id');
    expect(campsDb.insertOrgSuggestion).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ org_name: 'Tacoma Youth Soccer', org_website: 'https://tacomasoccer.org', org_state: 'WA' }),
    );
  });

  it('failure path: a missing org_name is rejected without touching the DB', async () => {
    const ctx = makeContext({ request: jsonReq({ org_city: 'Tacoma' }), env: { DB: {} } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('failure path: an invalid submitter_email is rejected', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', submitter_email: 'not-an-email' }),
      env: { DB: {} },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('spam: a filled-in honeypot field short-circuits to 200 without writing', async () => {
    const ctx = makeContext({
      request: jsonReq({ org_name: 'Tacoma Youth Soccer', website: 'i-am-a-bot.com' }),
      env: { DB: {} },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(campsDb.insertOrgSuggestion).not.toHaveBeenCalled();
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: jsonReq({ org_name: 'X' }), env: {} });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
  });
});
