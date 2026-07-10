// Tests for POST /api/cron/camps-sweep — key-gated, not Access-gated, so its
// "auth" test is the shared-secret check instead of the admin allowlist.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/camps-db', () => ({
  listCampsForUrlSweep: vi.fn().mockResolvedValue([]),
  updateUrlHealth: vi.fn().mockResolvedValue(undefined),
  archiveStaleCamps: vi.fn().mockResolvedValue(0),
  countApprovedFutureCamps: vi.fn().mockResolvedValue(10),
}));

vi.mock('../../src/lib/url-health', () => ({
  checkUrlHealth: vi.fn().mockResolvedValue({ status: 'live', statusCode: 200, finalUrl: null }),
}));

import { POST } from '../../src/pages/api/cron/camps-sweep';
import * as campsDb from '../../src/lib/camps-db';

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
    expect(body.approved_future_count).toBe(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('CRON_KEY missing on the env refuses every caller (fails closed, not open)', async () => {
    const ctx = makeContext({ request: cronRequest('anything'), env: { DB: {} } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });
});
