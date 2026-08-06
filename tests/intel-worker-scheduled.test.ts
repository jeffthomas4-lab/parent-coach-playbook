// Tests for src/worker.ts's composed scheduled handler
// (scheduledReconciliationAndIntelSweep) — the Worker's cron entry point,
// which now runs the existing BabyLove reconciliation AND the competitor-
// intelligence org sweep on every tick.
//
// Heavy/real dependencies (@astrojs/cloudflare's server entrypoint,
// @sentry/cloudflare) are mocked so the module can load under plain Vitest —
// worker-entry-boundary.test.ts avoids importing src/worker.ts as a module
// for the same reason (it reads the source as text instead). intel/config
// and intel/pipeline are owned by a concurrent workstream and mocked to the
// documented contract; if those files are not on disk yet, importing
// src/worker.ts below fails at module-resolution time, not because of a bug
// in this file.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@astrojs/cloudflare/entrypoints/server', () => ({
  default: { fetch: vi.fn(async () => new Response('astro-fetch-stub')) },
}));
vi.mock('@sentry/cloudflare', () => ({
  withSentry: vi.fn((_optionsCallback: unknown, handler: unknown) => handler),
}));
vi.mock('../src/lib/babylove-growth', () => ({
  handleBabyLoveWebhook: vi.fn(),
  reconcileBabyLoveArticles: vi.fn(),
}));
vi.mock('../src/lib/intel/config', () => ({
  isFeatureEnabled: vi.fn(() => true),
}));
vi.mock('../src/lib/intel/pipeline', () => ({
  runOrgSweep: vi.fn(),
  runApprovedRun: vi.fn(),
}));

import worker, { scheduledBabyLoveReconciliation, scheduledReconciliationAndIntelSweep } from '../src/worker';
import { reconcileBabyLoveArticles } from '../src/lib/babylove-growth';
import { isFeatureEnabled } from '../src/lib/intel/config';
import { runApprovedRun, runOrgSweep } from '../src/lib/intel/pipeline';

function fakeContext() {
  const waited: Promise<unknown>[] = [];
  const ctx = {
    waitUntil: (p: Promise<unknown>) => {
      waited.push(p);
    },
  } as unknown as ExecutionContext;
  return { ctx, waited };
}

const settleAll = (waited: Promise<unknown>[]) => Promise.allSettled(waited);

describe('src/worker.ts composed scheduled handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (isFeatureEnabled as any).mockReturnValue(true);
    (reconcileBabyLoveArticles as any).mockResolvedValue({ scanned: 0, published: 0, skipped: 0, failed: 0 });
    (runOrgSweep as any).mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('the default export scheduled handler is the composed function', () => {
    expect(worker.scheduled).toBe(scheduledReconciliationAndIntelSweep);
  });

  it('runs both BabyLove reconciliation and the intel org sweep on a normal tick', async () => {
    const { ctx, waited } = fakeContext();
    await scheduledReconciliationAndIntelSweep({} as ScheduledController, {} as any, ctx);
    await settleAll(waited);
    expect(reconcileBabyLoveArticles).toHaveBeenCalledTimes(1);
    expect(runOrgSweep).toHaveBeenCalledTimes(1);
  });

  it('still runs the intel sweep when BabyLove reconciliation throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (reconcileBabyLoveArticles as any).mockRejectedValue(new Error('babylove exploded'));
    const { ctx, waited } = fakeContext();
    await scheduledReconciliationAndIntelSweep({} as ScheduledController, {} as any, ctx);
    await settleAll(waited);
    expect(runOrgSweep).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(errorSpy.mock.calls)).toContain('babylove_reconciliation_failed');
    errorSpy.mockRestore();
  });

  it('still runs BabyLove reconciliation when the intel sweep throws', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (runOrgSweep as any).mockRejectedValue(new Error('sweep exploded'));
    const { ctx, waited } = fakeContext();
    await scheduledReconciliationAndIntelSweep({} as ScheduledController, {} as any, ctx);
    await settleAll(waited);
    expect(reconcileBabyLoveArticles).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(errorSpy.mock.calls)).toContain('intel_org_sweep_failed');
    errorSpy.mockRestore();
  });

  it('skips the intel sweep entirely when the feature is disabled for this environment', async () => {
    (isFeatureEnabled as any).mockReturnValue(false);
    const { ctx, waited } = fakeContext();
    await scheduledReconciliationAndIntelSweep({} as ScheduledController, {} as any, ctx);
    await settleAll(waited);
    expect(reconcileBabyLoveArticles).toHaveBeenCalledTimes(1);
    expect(runOrgSweep).not.toHaveBeenCalled();
  });

  it('never calls runApprovedRun from the scheduled path — only a human admin approval does that', async () => {
    const { ctx, waited } = fakeContext();
    await scheduledReconciliationAndIntelSweep({} as ScheduledController, {} as any, ctx);
    await settleAll(waited);
    // Also exercise the failure branches, which are the most likely place a
    // future edit might accidentally reach for the approved-run path.
    (reconcileBabyLoveArticles as any).mockRejectedValue(new Error('x'));
    (runOrgSweep as any).mockRejectedValue(new Error('y'));
    const second = fakeContext();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await scheduledReconciliationAndIntelSweep({} as ScheduledController, {} as any, second.ctx);
    await settleAll(second.waited);
    errorSpy.mockRestore();
    expect(runApprovedRun).not.toHaveBeenCalled();
  });

  it('scheduledBabyLoveReconciliation alone still only touches BabyLove reconciliation, unchanged', async () => {
    const { ctx, waited } = fakeContext();
    await scheduledBabyLoveReconciliation({} as ScheduledController, {} as any, ctx);
    await settleAll(waited);
    expect(reconcileBabyLoveArticles).toHaveBeenCalledTimes(1);
    expect(runOrgSweep).not.toHaveBeenCalled();
  });
});
