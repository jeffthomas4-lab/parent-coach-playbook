import { afterEach, describe, expect, it, vi } from 'vitest';
import worker, { fireCampsSweep, runScheduledSweep, type Env } from '../worker-cron/src/index';

const ledger = (changes = 1) => ({
  prepare() {
    return {
      bind() {
        return { run: async () => ({ meta: { changes } }) };
      },
    };
  },
}) as unknown as D1Database;

const makeEnv = (overrides: Partial<Env> = {}): Env => ({
  CRON_KEY: 'cron-secret',
  SWEEP_URL: 'https://parentcoachdesk.com/api/cron/camps-sweep',
  FORGE_DB: ledger(),
  ...overrides,
});

afterEach(() => vi.restoreAllMocks());

describe('camps-sweep scheduler', () => {
  it('exposes a non-mutating liveness response', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const response = await worker.fetch(new Request('https://scheduler.example/health'), makeEnv());
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      service: 'pcd-camps-sweep-scheduler',
      check: 'liveness',
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('reports readiness without exposing which secret or variable is missing', async () => {
    const response = await worker.fetch(
      new Request('https://scheduler.example/ready'),
      makeEnv({ CRON_KEY: undefined }),
    );
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      service: 'pcd-camps-sweep-scheduler',
      check: 'readiness',
      code: 'required_configuration_missing',
    });
  });

  it('reports ready only when all required settings exist', async () => {
    const response = await worker.fetch(
      new Request('https://scheduler.example/ready'),
      makeEnv(),
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ ok: true, check: 'readiness' });
  });

  it('fails closed before the sweep when the durable ledger is unavailable', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await expect(runScheduledSweep(makeEnv({ FORGE_DB: undefined }), Date.UTC(2026, 6, 16, 13))).rejects.toThrow('FORGE_DB');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('does not repeat a duplicate scheduled attempt', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    await runScheduledSweep(makeEnv({ FORGE_DB: ledger(0) }), Date.UTC(2026, 6, 16, 13));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('fails closed when required configuration is absent', async () => {
    await expect(fireCampsSweep(makeEnv({ CRON_KEY: undefined }), 'test')).rejects.toThrow(
      'CAMPS SWEEP MISCONFIGURED',
    );
  });

  it('posts once with the cron credential and origin', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ ok: true, approved_future_count: 12 }),
    );

    await fireCampsSweep(makeEnv(), 'test');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://parentcoachdesk.com/api/cron/camps-sweep',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-cron-key': 'cron-secret',
          origin: 'https://parentcoachdesk.com',
        }),
      }),
    );
  });

  it('surfaces bounded archive backlog while keeping the successful run complete', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        ok: true,
        approved_future_count: 12,
        stale_archived: 25,
        stale_archive_has_more: true,
      }),
    );

    await fireCampsSweep(makeEnv(), 'test');

    expect(JSON.stringify(warnSpy.mock.calls)).toContain('stale_archive_has_more');
  });

  it('fails the scheduled invocation on an unhealthy sweep', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ ok: false, error: 'broken' }),
    );

    await expect(
      worker.scheduled({ scheduledTime: Date.UTC(2026, 6, 16, 13) } as ScheduledEvent, makeEnv(), {} as ExecutionContext),
    ).rejects.toThrow('ok:false');
  });
});
