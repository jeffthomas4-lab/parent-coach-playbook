import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({
  scoreOpportunity: vi.fn(), classifyOpportunity: vi.fn(), advanceOpportunityToClaimsValidated: vi.fn(),
  beginReview: vi.fn(), markRelationshipMappingComplete: vi.fn(),
}));
import { POST } from '../../src/pages/api/admin/editorial/opportunities/[id]/update';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/opportunities/opportunity_1/update', {
    method: 'POST', body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json', origin,
      ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}),
    },
  });
const ctx = (body: unknown, origin?: string, auth?: boolean) =>
  makeContext({ request: request(body, origin, auth), params: { id: 'opportunity_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } });

describe('POST /api/admin/editorial/opportunities/:id/update', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requires Cloudflare Access identity', async () => {
    const res = await POST(ctx({ action: 'score', score: 50 }, undefined, false));
    expect(res.status).toBe(401);
  });

  it('requires same-origin mutation', async () => {
    const res = await POST(ctx({ action: 'score', score: 50 }, 'https://evil.example'));
    expect(res.status).toBe(403);
  });

  it('rejects an unrecognized action', async () => {
    const res = await POST(ctx({ action: 'delete_everything' }));
    expect(res.status).toBe(400);
  });

  it('routes the score action with a bounded integer score', async () => {
    (records.scoreOpportunity as any).mockResolvedValue({ id: 'opportunity_1', status: 'scored', score: 75 });
    const bad = await POST(ctx({ action: 'score', score: 101 }));
    expect(bad.status).toBe(400);
    expect(records.scoreOpportunity).not.toHaveBeenCalled();

    const ok = await POST(ctx({ action: 'score', score: 75 }));
    expect(ok.status).toBe(200);
    expect(records.scoreOpportunity).toHaveBeenCalledWith(expect.anything(), { id: 'opportunity_1', score: 75, actor: 'jeffthomas@pugetsound.edu' });
  });

  it('translates a lib-thrown "not found" error to 404 and other errors to 409', async () => {
    (records.scoreOpportunity as any).mockRejectedValueOnce(new Error('opportunity not found'));
    const notFound = await POST(ctx({ action: 'score', score: 50 }));
    expect(notFound.status).toBe(404);

    (records.scoreOpportunity as any).mockRejectedValueOnce(new Error('invalid opportunity transition'));
    const conflict = await POST(ctx({ action: 'score', score: 50 }));
    expect(conflict.status).toBe(409);
  });

  it('requires a decision_reason for classify and forwards the cannibalization flags', async () => {
    (records.classifyOpportunity as any).mockResolvedValue({ id: 'opportunity_1', status: 'classified' });
    const missing = await POST(ctx({ action: 'classify', content_type: 'guide' }));
    expect(missing.status).toBe(400);

    const ok = await POST(ctx({ action: 'classify', content_type: 'guide', decision_reason: 'No existing coverage.', evidence_sufficient: true }));
    expect(ok.status).toBe(200);
    const body = await readJson(ok);
    expect(body.ok).toBe(true);
    expect(records.classifyOpportunity).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ evidenceSufficient: true, decisionReason: 'No existing coverage.' }));
  });

  it('routes begin_review only for a valid review_type', async () => {
    const bad = await POST(ctx({ action: 'begin_review', review_type: 'legal' }));
    expect(bad.status).toBe(400);
    (records.beginReview as any).mockResolvedValue({ id: 'opportunity_1', status: 'editorial_review' });
    const ok = await POST(ctx({ action: 'begin_review', review_type: 'editorial' }));
    expect(ok.status).toBe(200);
  });
});
