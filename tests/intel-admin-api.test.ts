// Tests for src/pages/api/admin/intel/** — the competitor-intelligence admin
// API surface. Every route here is new (Wave: competitor intelligence admin
// API + cron). src/lib/intel/{store,pipeline,config,scoring}.ts are owned by
// a concurrent workstream and mocked here to the documented contract; if
// those modules are not on disk yet, importing the routes under test below
// will fail at module-resolution time, not because of a bug in this file.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from './helpers/context';
import { makeFakeD1 } from './helpers/d1';

vi.mock('../src/lib/intel/store', () => ({
  getIntelSummary: vi.fn(),
  listStack: vi.fn(),
  listReviewQueue: vi.fn(),
  resolveReviewItem: vi.fn(),
  listOpportunities: vi.fn(),
  listRuns: vi.fn(),
  createRun: vi.fn(),
  approveRun: vi.fn(),
  syncCompetitorCatalog: vi.fn(),
}));
vi.mock('../src/lib/intel/pipeline', () => ({
  runApprovedRun: vi.fn(),
  runOrgSweep: vi.fn(),
}));
vi.mock('../src/lib/intel/scoring', () => ({
  rescoreOrgs: vi.fn(),
}));
vi.mock('../src/lib/intel/config', () => ({
  DEFAULT_SWEEP_LIMIT: 25,
  isFeatureEnabled: vi.fn(() => true),
  policyFromEnv: vi.fn(),
}));
vi.mock('../src/lib/intel/competitors', () => ({
  COMPETITOR_DEFINITIONS: [{ id: 'sportsgravy' }],
}));
vi.mock('../src/lib/admin-receipts', async () => {
  const actual = await vi.importActual<typeof import('../src/lib/admin-receipts')>('../src/lib/admin-receipts');
  return {
    ...actual,
    withAdminReceipt: vi.fn(async (_input: unknown, run: () => Promise<any>) => {
      const outcome = await run();
      return outcome.outcome === 'success' ? { value: outcome.value } : { response: outcome.response };
    }),
    recordAdminReceipt: vi.fn(async () => ({ ok: true, id: 1, rowHash: 'hash' })),
  };
});

import { GET as summaryGet } from '../src/pages/api/admin/intel/summary';
import { GET as stackGet } from '../src/pages/api/admin/intel/stack';
import { GET as reviewGet } from '../src/pages/api/admin/intel/review';
import { POST as reviewResolvePost } from '../src/pages/api/admin/intel/review/[id]';
import { GET as opportunitiesGet } from '../src/pages/api/admin/intel/opportunities';
import { GET as runsGet, POST as runsPost } from '../src/pages/api/admin/intel/runs';
import { POST as runApprovePost } from '../src/pages/api/admin/intel/runs/[id]/approve';
import { POST as rescorePost } from '../src/pages/api/admin/intel/rescore';
import { GET as competitorsGet, POST as competitorsPost } from '../src/pages/api/admin/intel/competitors';
import * as intelStore from '../src/lib/intel/store';
import * as intelPipeline from '../src/lib/intel/pipeline';
import * as intelScoring from '../src/lib/intel/scoring';

const ADMIN_EMAILS = 'eepskalla@gmail.com,jeffthomas4@gmail.com';
const ORIGIN = 'https://parentcoachdesk.com';

function req(path: string, opts: { method?: string; body?: unknown; authed?: boolean; origin?: string | null } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (opts.origin !== null) headers.origin = opts.origin ?? ORIGIN;
  if (opts.authed !== false) headers['Cf-Access-Authenticated-User-Email'] = 'eepskalla@gmail.com';
  return new Request(`${ORIGIN}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
  });
}

function ctxFor(request: Request, db: unknown, params: Record<string, string> = {}) {
  // PCD_OPS_DB stands in for the operational database withAdminReceipt/
  // recordAdminReceipt write to. Both are mocked below, but the routes still
  // check `env.PCD_OPS_DB` is bound before calling them (same "refuse to
  // report success without a durable receipt path" discipline as every other
  // receipted admin route in this repo), so tests need a truthy value here.
  return makeContext({ request, params, env: { DB: db, PCD_OPS_DB: db, ADMIN_EMAILS } });
}

describe('competitor intelligence admin API', () => {
  let db: any;

  beforeEach(() => {
    vi.clearAllMocks();
    (intelStore.getIntelSummary as any).mockResolvedValue({
      orgsWithStack: 10,
      byCompetitor: [{ competitor_id: 'sportsgravy', count: 10 }],
      pendingReview: 3,
      lastRunAt: '2026-08-01T00:00:00.000Z',
      signalsLast30d: 42,
    });
    (intelStore.listStack as any).mockResolvedValue([]);
    (intelStore.listReviewQueue as any).mockResolvedValue([]);
    (intelStore.listOpportunities as any).mockResolvedValue([]);
    (intelStore.listRuns as any).mockResolvedValue([]);
    db = makeFakeD1().db;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---------------------------------------------------------------------
  // Auth: every route rejects an unauthenticated request.
  // ---------------------------------------------------------------------
  const routes: Array<{ name: string; handler: any; method: string; path: string; params?: Record<string, string> }> = [
    { name: 'summary GET', handler: summaryGet, method: 'GET', path: '/api/admin/intel/summary' },
    { name: 'stack GET', handler: stackGet, method: 'GET', path: '/api/admin/intel/stack' },
    { name: 'review GET', handler: reviewGet, method: 'GET', path: '/api/admin/intel/review' },
    { name: 'review/[id] POST', handler: reviewResolvePost, method: 'POST', path: '/api/admin/intel/review/rq_1', params: { id: 'rq_1' } },
    { name: 'opportunities GET', handler: opportunitiesGet, method: 'GET', path: '/api/admin/intel/opportunities' },
    { name: 'runs GET', handler: runsGet, method: 'GET', path: '/api/admin/intel/runs' },
    { name: 'runs POST', handler: runsPost, method: 'POST', path: '/api/admin/intel/runs' },
    { name: 'runs/[id]/approve POST', handler: runApprovePost, method: 'POST', path: '/api/admin/intel/runs/run_1/approve', params: { id: 'run_1' } },
    { name: 'rescore POST', handler: rescorePost, method: 'POST', path: '/api/admin/intel/rescore' },
    { name: 'competitors GET', handler: competitorsGet, method: 'GET', path: '/api/admin/intel/competitors' },
    { name: 'competitors POST', handler: competitorsPost, method: 'POST', path: '/api/admin/intel/competitors' },
  ];

  it.each(routes)('$name rejects an unauthenticated request with 401', async ({ handler, method, path, params }) => {
    const res = await handler(ctxFor(req(path, { method, authed: false, body: method === 'POST' ? {} : undefined }), db, params));
    expect(res.status).toBe(401);
  });

  // ---------------------------------------------------------------------
  // Method guards.
  // ---------------------------------------------------------------------
  it('GET-only routes reject POST with 405', async () => {
    const res = await summaryGet(ctxFor(req('/api/admin/intel/summary', { method: 'POST', body: {} }), db));
    expect(res.status).toBe(405);
  });

  it('POST-only routes reject GET with 405', async () => {
    const res = await reviewResolvePost(ctxFor(req('/api/admin/intel/review/rq_1', { method: 'GET' }), db, { id: 'rq_1' }));
    expect(res.status).toBe(405);
  });

  it('runs.ts GET rejects POST and POST rejects GET', async () => {
    const getRes = await runsGet(ctxFor(req('/api/admin/intel/runs', { method: 'POST', body: {} }), db));
    expect(getRes.status).toBe(405);
    const postRes = await runsPost(ctxFor(req('/api/admin/intel/runs', { method: 'GET' }), db));
    expect(postRes.status).toBe(405);
  });

  // ---------------------------------------------------------------------
  // Query-parameter clamping / rejection.
  // ---------------------------------------------------------------------
  it('summary: happy path returns the summary envelope', async () => {
    const res = await summaryGet(ctxFor(req('/api/admin/intel/summary'), db));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.summary.orgsWithStack).toBe(10);
  });

  it('stack: an out-of-range limit is clamped to 200', async () => {
    const res = await stackGet(ctxFor(req('/api/admin/intel/stack?limit=99999'), db));
    expect(res.status).toBe(200);
    expect((intelStore.listStack as any).mock.calls[0][1]).toMatchObject({ limit: 200 });
  });

  it('stack: a garbage limit is rejected with 400, never reaching the store', async () => {
    const res = await stackGet(ctxFor(req('/api/admin/intel/stack?limit=not-a-number'), db));
    expect(res.status).toBe(400);
    expect(intelStore.listStack).not.toHaveBeenCalled();
  });

  it('stack: a garbage offset is rejected with 400', async () => {
    const res = await stackGet(ctxFor(req('/api/admin/intel/stack?offset=-5'), db));
    expect(res.status).toBe(400);
    expect(intelStore.listStack).not.toHaveBeenCalled();
  });

  it('stack: a garbage status is rejected with 400', async () => {
    const res = await stackGet(ctxFor(req('/api/admin/intel/stack?status=not-a-real-status'), db));
    expect(res.status).toBe(400);
    expect(intelStore.listStack).not.toHaveBeenCalled();
  });

  it('stack: an unknown state code is rejected with 400', async () => {
    const res = await stackGet(ctxFor(req('/api/admin/intel/stack?state=ZZ'), db));
    expect(res.status).toBe(400);
  });

  it('stack: a valid limit/offset/status pass through to the store', async () => {
    const res = await stackGet(ctxFor(req('/api/admin/intel/stack?limit=10&offset=5&status=confirmed'), db));
    expect(res.status).toBe(200);
    expect(intelStore.listStack).toHaveBeenCalledWith(db, expect.objectContaining({ limit: 10, offset: 5, status: 'confirmed' }));
  });

  it('review: defaults to status=pending', async () => {
    const res = await reviewGet(ctxFor(req('/api/admin/intel/review'), db));
    expect(res.status).toBe(200);
    expect(intelStore.listReviewQueue).toHaveBeenCalledWith(db, expect.objectContaining({ status: 'pending' }));
  });

  it('review: a garbage status is rejected with 400', async () => {
    const res = await reviewGet(ctxFor(req('/api/admin/intel/review?status=whatever'), db));
    expect(res.status).toBe(400);
    expect(intelStore.listReviewQueue).not.toHaveBeenCalled();
  });

  it('opportunities: a garbage minPriority is rejected with 400', async () => {
    const res = await opportunitiesGet(ctxFor(req('/api/admin/intel/opportunities?minPriority=200'), db));
    expect(res.status).toBe(400);
    expect(intelStore.listOpportunities).not.toHaveBeenCalled();
  });

  it('runs GET: a garbage status is rejected with 400', async () => {
    const res = await runsGet(ctxFor(req('/api/admin/intel/runs?status=bogus'), db));
    expect(res.status).toBe(400);
    expect(intelStore.listRuns).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------
  // review/[id] resolve.
  // ---------------------------------------------------------------------
  it('review resolve: an invalid decision is rejected with 400', async () => {
    const res = await reviewResolvePost(ctxFor(req('/api/admin/intel/review/rq_1', { method: 'POST', body: { decision: 'maybe' } }), db, { id: 'rq_1' }));
    expect(res.status).toBe(400);
    expect(intelStore.resolveReviewItem).not.toHaveBeenCalled();
  });

  it('review resolve: resolveReviewItem false (not found / already resolved) returns 404', async () => {
    (intelStore.resolveReviewItem as any).mockResolvedValue(false);
    const res = await reviewResolvePost(ctxFor(req('/api/admin/intel/review/rq_1', { method: 'POST', body: { decision: 'accepted' } }), db, { id: 'rq_1' }));
    expect(res.status).toBe(404);
  });

  it('review resolve: happy path accepts and resolves with the admin identity', async () => {
    (intelStore.resolveReviewItem as any).mockResolvedValue(true);
    const res = await reviewResolvePost(ctxFor(req('/api/admin/intel/review/rq_1', { method: 'POST', body: { decision: 'accepted' } }), db, { id: 'rq_1' }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(intelStore.resolveReviewItem).toHaveBeenCalledWith(db, 'rq_1', expect.objectContaining({ status: 'accepted', resolvedBy: 'eepskalla@gmail.com' }));
  });

  it('review resolve: a cross-origin request is rejected even with valid admin auth', async () => {
    const res = await reviewResolvePost(
      ctxFor(req('/api/admin/intel/review/rq_1', { method: 'POST', body: { decision: 'accepted' }, origin: 'https://evil.example.com' }), db, { id: 'rq_1' }),
    );
    expect(res.status).toBe(403);
    expect(intelStore.resolveReviewItem).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------
  // runs.ts POST: creating a run always yields status 'proposed'.
  // ---------------------------------------------------------------------
  it('runs POST: an invalid runType is rejected with 400', async () => {
    const res = await runsPost(ctxFor(req('/api/admin/intel/runs', { method: 'POST', body: { runType: 'nonsense' } }), db));
    expect(res.status).toBe(400);
    expect(intelStore.createRun).not.toHaveBeenCalled();
  });

  it('runs POST: a run is created but PCD_OPS_DB is unbound refuses to report success', async () => {
    (intelStore.createRun as any).mockResolvedValue({ id: 'run_1', run_type: 'org_sweep', status: 'proposed', created_at: '2026-08-01T00:00:00.000Z' });
    const request = req('/api/admin/intel/runs', { method: 'POST', body: { runType: 'org_sweep' } });
    const ctx = makeContext({ request, params: {}, env: { DB: db, ADMIN_EMAILS } }); // no PCD_OPS_DB
    const res = await runsPost(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.code).toBe('RECEIPT_WRITE_FAILED');
    expect(intelStore.createRun).toHaveBeenCalled();
  });

  it.each(['org_sweep', 'competitor_property', 'manual'])('runs POST: creating a %s run always reports status proposed, never auto-approved', async (runType) => {
    (intelStore.createRun as any).mockResolvedValue({ id: 'run_1', run_type: runType, status: 'proposed', created_at: '2026-08-01T00:00:00.000Z' });
    const res = await runsPost(ctxFor(req('/api/admin/intel/runs', { method: 'POST', body: { runType } }), db));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.run.status).toBe('proposed');
    expect(intelStore.createRun).toHaveBeenCalledWith(db, expect.objectContaining({ runType, requestedBy: 'eepskalla@gmail.com' }));
    // This route never calls approveRun or runApprovedRun — proposing is not approving.
    expect(intelStore.approveRun).not.toHaveBeenCalled();
    expect(intelPipeline.runApprovedRun).not.toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------
  // runs/[id]/approve.ts.
  // ---------------------------------------------------------------------
  it('run approve: a run that is not proposed returns 409', async () => {
    (intelStore.approveRun as any).mockResolvedValue(null);
    const res = await runApprovePost(ctxFor(req('/api/admin/intel/runs/run_1/approve', { method: 'POST', body: {} }), db, { id: 'run_1' }));
    expect(res.status).toBe(409);
    expect(intelPipeline.runApprovedRun).not.toHaveBeenCalled();
  });

  it('run approve: happy path approves and executes via runApprovedRun', async () => {
    (intelStore.approveRun as any).mockResolvedValue({ id: 'run_1', run_type: 'org_sweep', status: 'approved' });
    (intelPipeline.runApprovedRun as any).mockResolvedValue({ ok: true });
    const res = await runApprovePost(ctxFor(req('/api/admin/intel/runs/run_1/approve', { method: 'POST', body: {} }), db, { id: 'run_1' }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.run.status).toBe('approved');
    expect(intelStore.approveRun).toHaveBeenCalledWith(db, 'run_1', 'eepskalla@gmail.com');
    expect(intelPipeline.runApprovedRun).toHaveBeenCalledWith(expect.anything(), 'run_1');
  });

  it('run approve: an execution failure does not change the (already-successful) approve response', async () => {
    (intelStore.approveRun as any).mockResolvedValue({ id: 'run_1', run_type: 'competitor_property', status: 'approved' });
    (intelPipeline.runApprovedRun as any).mockRejectedValue(new Error('crawl blew up'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await runApprovePost(ctxFor(req('/api/admin/intel/runs/run_1/approve', { method: 'POST', body: {} }), db, { id: 'run_1' }));
    expect(res.status).toBe(200);
    errorSpy.mockRestore();
  });

  // ---------------------------------------------------------------------
  // rescore.ts.
  // ---------------------------------------------------------------------
  it('rescore: happy path returns the rescored count', async () => {
    (intelScoring.rescoreOrgs as any).mockResolvedValue(7);
    const res = await rescorePost(ctxFor(req('/api/admin/intel/rescore', { method: 'POST', body: {} }), db));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.rescored).toBe(7);
  });

  // ---------------------------------------------------------------------
  // competitors.ts.
  // ---------------------------------------------------------------------
  it('competitors GET: lists the catalog', async () => {
    const fake = makeFakeD1();
    fake.queueAll([{ id: 'sportsgravy', display_name: 'SportsGravy', canonical_domain: null, category: 'club_management', status: 'active', migration_difficulty: 'medium' }]);
    const res = await competitorsGet(ctxFor(req('/api/admin/intel/competitors'), fake.db));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.competitors).toHaveLength(1);
  });

  it('competitors POST: syncs the catalog and returns the count', async () => {
    (intelStore.syncCompetitorCatalog as any).mockResolvedValue(1);
    const res = await competitorsPost(ctxFor(req('/api/admin/intel/competitors', { method: 'POST', body: {} }), db));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.synced).toBe(1);
  });
});
