// Tests for POST /api/cron/camps-sweep — key-gated, not Access-gated, so its
// "auth" test is the shared-secret check instead of the admin allowlist.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  listCampsForUrlSweep: vi.fn().mockResolvedValue([]),
  updateUrlHealth: vi.fn().mockResolvedValue(undefined),
  archiveStaleCamps: vi.fn().mockResolvedValue({ archived: 0, hasMore: false }),
  countApprovedFutureCamps: vi.fn().mockResolvedValue(10),
}));

vi.mock('../../src/lib/url-health', () => ({
  checkUrlHealth: vi.fn().mockResolvedValue({ status: 'live', statusCode: 200, finalUrl: null }),
}));
vi.mock('../../src/lib/public-idempotency', () => ({
  deleteExpiredIdempotencyRecords: vi.fn().mockResolvedValue(0),
}));

import { POST } from '../../src/pages/api/cron/camps-sweep';
import * as campsDb from '../../src/lib/camps-db';
import * as publicIdempotency from '../../src/lib/public-idempotency';

const CRON_KEY = 'test-cron-key';

function cronRequest(headerKey?: string) {
  const headers: Record<string, string> = {};
  if (headerKey !== undefined) headers['x-cron-key'] = headerKey;
  return new Request('https://parentcoachdesk.com/api/cron/camps-sweep', { method: 'POST', headers });
}

describe('POST /api/cron/camps-sweep', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    (campsDb.countApprovedFutureCamps as any).mockResolvedValue(10);
    global.fetch = vi.fn().mockResolvedValue(new Response('ok'));
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('auth: refuses a request with no x-cron-key header', async () => {
    const ctx = makeContext({ request: cronRequest(), env: { DB: {}, CRON_KEY } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });

  it('auth: refuses a request with the wrong key', async () => {
    const ctx = makeContext({ request: cronRequest('wrong-key'), env: { DB: {}, CRON_KEY } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });

  it('happy path: the correct key runs the sweep and returns a summary', async () => {
    const ctx = makeContext({ request: cronRequest(CRON_KEY), env: { DB: {}, CRON_KEY } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.approved_future_count).toBe(10);
    expect(campsDb.archiveStaleCamps).toHaveBeenCalledWith({}, expect.any(String), 'cron', 25);
    expect(body.idempotency_cleanup).toEqual({ enabled: false, deleted: 0, limit: 100 });
    expect(publicIdempotency.deleteExpiredIdempotencyRecords).not.toHaveBeenCalled();
  });

  it('business-metric alert: pings OPS_HEARTBEAT_URL when the count is healthy', async () => {
    const ctx = makeContext({
      request: cronRequest(CRON_KEY),
      env: { DB: {}, CRON_KEY, OPS_HEARTBEAT_URL: 'https://hc-ping.example.com/abc' },
    });
    await POST(ctx);
    expect(global.fetch).toHaveBeenCalledWith('https://hc-ping.example.com/abc', { method: 'GET' });
  });

  it('business-metric alert: does NOT ping when the approved-future count is zero', async () => {
    (campsDb.countApprovedFutureCamps as any).mockResolvedValue(0);
    const ctx = makeContext({
      request: cronRequest(CRON_KEY),
      env: { DB: {}, CRON_KEY, OPS_HEARTBEAT_URL: 'https://hc-ping.example.com/abc' },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.failures).toContain('directory_blackout');
    expect(body.approved_future_count).toBe(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('returns failure when the URL stage throws instead of a false green', async () => {
    (campsDb.listCampsForUrlSweep as any).mockRejectedValueOnce(new Error('private D1 detail'));
    const res = await POST(makeContext({ request: cronRequest(CRON_KEY), env: { DB: {}, CRON_KEY } }));
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body).toMatchObject({ ok: false, code: 'partial_failure' });
    expect(body.failures).toContain('url_sweep_failed');
    expect(JSON.stringify(body)).not.toContain('private D1 detail');
  });

  it('does not send a healthy heartbeat after a prior stage failure', async () => {
    (campsDb.archiveStaleCamps as any).mockRejectedValueOnce(new Error('archive failed'));
    const res = await POST(makeContext({
      request: cronRequest(CRON_KEY),
      env: { DB: {}, CRON_KEY, OPS_HEARTBEAT_URL: 'https://hc-ping.example.com/abc' },
    }));
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.failures).toContain('stale_archive_failed');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('reports a bounded stale backlog without pretending it was fully drained', async () => {
    (campsDb.archiveStaleCamps as any).mockResolvedValueOnce({ archived: 25, hasMore: true });
    const res = await POST(makeContext({ request: cronRequest(CRON_KEY), env: { DB: {}, CRON_KEY } }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ ok: true, stale_archived: 25, stale_archive_has_more: true });
  });

  it('runs bounded idempotency cleanup only when explicitly enabled', async () => {
    (publicIdempotency.deleteExpiredIdempotencyRecords as any).mockResolvedValueOnce(17);
    const res = await POST(makeContext({
      request: cronRequest(CRON_KEY), env: { DB: {}, CRON_KEY, IDEMPOTENCY_CLEANUP_ENABLED: 'true' },
    }));
    expect(res.status).toBe(200);
    expect(await readJson(res)).toMatchObject({ idempotency_cleanup: { enabled: true, deleted: 17, limit: 100 } });
    expect(publicIdempotency.deleteExpiredIdempotencyRecords).toHaveBeenCalledWith({}, expect.any(String), 100);
  });

  it('fails visibly and suppresses the healthy heartbeat when configured cleanup fails', async () => {
    (publicIdempotency.deleteExpiredIdempotencyRecords as any).mockRejectedValueOnce(new Error('private schema detail'));
    const res = await POST(makeContext({
      request: cronRequest(CRON_KEY),
      env: { DB: {}, CRON_KEY, IDEMPOTENCY_CLEANUP_ENABLED: 'true', OPS_HEARTBEAT_URL: 'https://hc-ping.example.com/abc' },
    }));
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.failures).toContain('idempotency_cleanup_failed');
    expect(JSON.stringify(body)).not.toContain('private schema detail');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('marks heartbeat delivery failure without leaking the heartbeat URL', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('https://hc-ping.example.com/private-token'));
    const res = await POST(makeContext({
      request: cronRequest(CRON_KEY),
      env: { DB: {}, CRON_KEY, OPS_HEARTBEAT_URL: 'https://hc-ping.example.com/private-token' },
    }));
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.failures).toContain('heartbeat_failed');
    expect(JSON.stringify(body)).not.toContain('private-token');
  });

  it('CRON_KEY missing on the env refuses every caller (fails closed, not open)', async () => {
    const ctx = makeContext({ request: cronRequest('anything'), env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });
});
