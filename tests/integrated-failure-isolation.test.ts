import { afterEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from './helpers/context';
import { GET as healthGet } from '../src/pages/api/health';
import { GET as readyGet } from '../src/pages/api/ready';
import { readOperationsStatus } from '../src/lib/operations-status';
import { runScheduledSweep } from '../worker-cron/src/index';

afterEach(() => vi.restoreAllMocks());

describe('integrated failure isolation', () => {
  it('keeps liveness public while D1 readiness and operational truth fail closed', async () => {
    const broken = { prepare() { return { first: async () => { throw new Error('private database detail'); } }; } } as unknown as D1Database;
    const health = await healthGet(makeContext({ request: new Request('https://parentcoachdesk.com/api/health'), env: {} }));
    const ready = await readyGet(makeContext({ request: new Request('https://parentcoachdesk.com/api/ready'), env: { DB: broken } }));
    const operations = await readOperationsStatus({ DB: broken, FORGE_DB: broken });
    expect(health.status).toBe(200);
    expect(ready.status).toBe(503);
    expect(await readJson(ready)).toMatchObject({ ok: false, code: 'db_unavailable' });
    expect(operations.filter((item) => ['Public directory supply', 'PCD agent runtime'].includes(item.component)).every((item) => item.state === 'unknown')).toBe(true);
    expect(JSON.stringify(operations)).not.toContain('private database detail');
  });

  it('does not invoke the sweep when the durable Forge attempt ledger is absent', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await expect(runScheduledSweep({ CRON_KEY: 'configured', SWEEP_URL: 'https://parentcoachdesk.com/api/cron/camps-sweep' }, Date.UTC(2026, 6, 16, 13))).rejects.toThrow('FORGE_DB');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
