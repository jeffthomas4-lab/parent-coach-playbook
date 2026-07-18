import { afterEach, describe, expect, it, vi } from 'vitest';
import { preflightAgentRunClient, writeAgentRun } from '../scripts/agent-run-client.mjs';

afterEach(() => vi.unstubAllGlobals());

describe('agent run caller', () => {
  it('performs a redacted non-mutating preflight and classifies failures', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(preflightAgentRunClient({ token: 'secret-value' })).resolves.toEqual({ ok: true, status: 204 });
    expect(fetchMock).toHaveBeenCalledWith('https://parentcoachdesk.com/api/agent-runs', expect.objectContaining({ method: 'HEAD', redirect: 'error' }));

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));
    await expect(preflightAgentRunClient({ token: 'wrong-value' })).resolves.toMatchObject({ code: 'credential_rejected' });
  });

  it('writes bounded machine identities without returning or logging the credential', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ ok: true, run_id: 'run-1' }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(writeAgentRun({ phase: 'start', run_id: 'run-1', agent: 'nora', venture: 'pcd' }, { token: 'secret-value' })).resolves.toMatchObject({ ok: true });
    const [, request] = fetchMock.mock.calls[0];
    expect(request.body).not.toContain('secret-value');
    expect(request.redirect).toBe('error');
  });

  it('refuses alternate endpoints, missing runtime secrets, and unsafe IDs', async () => {
    await expect(preflightAgentRunClient({ endpoint: 'https://evil.example/api/agent-runs', token: 'x' })).rejects.toThrow('not approved');
    await expect(preflightAgentRunClient({ token: '' })).rejects.toThrow('runtime secret environment');
    await expect(writeAgentRun({ phase: 'start', run_id: 'run 1', agent: 'nora', venture: 'pcd' }, { token: 'x' })).rejects.toThrow('run_id is invalid');
  });
});
