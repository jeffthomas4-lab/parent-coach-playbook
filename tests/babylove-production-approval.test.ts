import { describe, expect, it, vi } from 'vitest';
import { approvePendingBabyLoveDeployment } from '../scripts/approve-babylove-production.mjs';

describe('BabyLove production approval', () => {
  it('approves only the pending production Environment for the current run', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([
        { environment: { id: 183, name: 'production' } },
      ]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 1 }]), { status: 200 }));

    const result = await approvePendingBabyLoveDeployment({
      repository: 'owner/repo',
      runId: '1234',
      token: 'redacted-test-token',
      fetchImpl,
      attempts: 2,
      intervalMs: 0,
    });

    expect(result).toEqual({ approved: true, environmentId: 183, attempt: 2 });
    expect(fetchImpl.mock.calls[2][0]).toBe('https://api.github.com/repos/owner/repo/actions/runs/1234/pending_deployments');
    expect(JSON.parse(fetchImpl.mock.calls[2][1].body)).toMatchObject({
      environment_ids: [183],
      state: 'approved',
    });
  });

  it('does not approve a different pending Environment', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify([
      { environment: { id: 99, name: 'staging' } },
    ]), { status: 200 }));

    await expect(approvePendingBabyLoveDeployment({
      repository: 'owner/repo',
      runId: '1234',
      token: 'redacted-test-token',
      fetchImpl,
      attempts: 1,
      intervalMs: 0,
    })).rejects.toThrow('did not enter pending review');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
