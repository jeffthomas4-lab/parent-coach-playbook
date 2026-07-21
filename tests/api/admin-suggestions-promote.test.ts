// Tests for POST /api/admin/suggestions/:id/promote — turns an org_suggestions
// row into a draft `programs` row and marks the suggestion imported.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  getOrgSuggestionById: vi.fn(),
  updateOrgSuggestionStatus: vi.fn(),
}));

vi.mock('../../src/lib/suggestion-promotion', () => ({
  promoteOrgSuggestionToProgram: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/suggestions/[id]/promote';
import * as campsDb from '../../src/lib/camps-db';
import * as promotion from '../../src/lib/suggestion-promotion';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const mockSuggestion = { id: 'sugg_1', org_name: 'Tacoma Youth Soccer', status: 'pending' };

function adminRequest(body: unknown = {}, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/suggestions/sugg_1/promote', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/suggestions/:id/promote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.getOrgSuggestionById as any).mockResolvedValue(mockSuggestion);
    (campsDb.updateOrgSuggestionStatus as any).mockResolvedValue({ ...mockSuggestion, status: 'imported' });
    (promotion.promoteOrgSuggestionToProgram as any).mockResolvedValue({
      programId: 'prog_new_1',
      organizationId: 'org_new_1',
      organizationCreated: true,
    });
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/suggestions/sugg_1/promote', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: '{}',
    });
    const ctx = makeContext({ request: req, params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(promotion.promoteOrgSuggestionToProgram).not.toHaveBeenCalled();
  });

  it('happy path: promoting a pending suggestion creates a draft program and marks it imported', async () => {
    const ctx = makeContext({ request: adminRequest(), params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.program_id).toBe('prog_new_1');
    expect(body.redirect).toBe('/admin/camps/prog_new_1');
    expect(promotion.promoteOrgSuggestionToProgram).toHaveBeenCalledWith(expect.anything(), mockSuggestion);
    expect(campsDb.updateOrgSuggestionStatus).toHaveBeenCalledWith(expect.anything(), 'sugg_1', 'imported');
  });

  it('failure path: a suggestion id that does not exist returns 404', async () => {
    (campsDb.getOrgSuggestionById as any).mockResolvedValue(null);
    const ctx = makeContext({ request: adminRequest(), params: { id: 'does-not-exist' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
    expect(promotion.promoteOrgSuggestionToProgram).not.toHaveBeenCalled();
  });

  it('failure path: an already-imported suggestion cannot be promoted again', async () => {
    (campsDb.getOrgSuggestionById as any).mockResolvedValue({ ...mockSuggestion, status: 'imported' });
    const ctx = makeContext({ request: adminRequest(), params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(409);
    expect(body.ok).toBe(false);
    expect(promotion.promoteOrgSuggestionToProgram).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({}, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: { id: 'sugg_1' }, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(promotion.promoteOrgSuggestionToProgram).not.toHaveBeenCalled();
  });
});
