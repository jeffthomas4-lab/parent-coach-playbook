// Tests for POST /api/agent-runs — the wire that closes Open Item 3.
//
// What has to hold: the run log is not writable without the token, a start and
// a finish both land, a failure alerts, and a second failure inside the window
// pauses the agent (CANARY) unless that agent is on the exemption list. Plus the
// usual: no bad input gets through, no internal error text comes back out.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, jsonRequest, readJson } from '../helpers/context';
import { makeFakeD1 } from '../helpers/d1';
import { POST } from '../../src/pages/api/agent-runs';
import { applyCanary, isCanaryExempt } from '../../src/lib/agent-runs';

const TOKEN = 'test-agent-runs-token';
const URL = 'https://parentcoachdesk.com/api/agent-runs';

function req(body: unknown, token: string | null = TOKEN) {
  return jsonRequest(URL, body, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

/**
 * A fetch double typed like the real thing, so a test can read the posted body
 * without indexing into an empty tuple. `vi.fn(async () => ...)` infers zero
 * parameters, which is what produced the TS2532/TS2493 errors here.
 */
function makeFetchSpy() {
  return vi.fn(async (_url: string, _init?: RequestInit) => new Response('ok', { status: 200 }));
}

type FetchSpy = ReturnType<typeof makeFetchSpy>;

/** The text of the nth Slack post. Throws rather than returning undefined. */
function slackText(spy: FetchSpy, index = 0): string {
  const call = spy.mock.calls[index];
  if (!call) throw new Error(`expected a Slack post at index ${index}, got ${spy.mock.calls.length}`);
  const body = call[1]?.body;
  if (typeof body !== 'string') throw new Error('expected a JSON string body on the Slack post');
  return String((JSON.parse(body) as { text?: string }).text ?? '');
}

const SLACK_ENV = { SLACK_WEBHOOK_URL: 'https://hooks.slack.com/x' };

describe('POST /api/agent-runs', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', makeFetchSpy());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('auth: refuses a request with no token', async () => {
    const { db } = makeFakeD1();
    const ctx = makeContext({
      request: req({ phase: 'start', run_id: 'r1', agent: 'ed', venture: 'pcd' }, null),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });

  it('auth: refuses a wrong token', async () => {
    const { db, calls } = makeFakeD1();
    const ctx = makeContext({
      request: req({ phase: 'start', run_id: 'r1', agent: 'ed', venture: 'pcd' }, 'wrong-token-xx'),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(calls).toHaveLength(0);
  });

  it('refuses everything when AGENT_RUNS_TOKEN is not configured', async () => {
    const { db } = makeFakeD1();
    const ctx = makeContext({
      request: req({ phase: 'start', run_id: 'r1', agent: 'ed', venture: 'pcd' }),
      env: { FORGE_DB: db },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(503);
  });

  it('happy path: a start writes one agent_runs row with bound parameters', async () => {
    const { db, calls } = makeFakeD1();
    const ctx = makeContext({
      request: req({ phase: 'start', run_id: 'run-1', agent: 'ed', venture: 'parent-coach-desk' }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ ok: true, phase: 'start', run_id: 'run-1' });
    expect(calls).toHaveLength(1);
    expect(calls[0].sql).toContain('INSERT INTO agent_runs');
    // Pre-Launch Security Gate item 5: bound parameters, never string-built SQL.
    expect(calls[0].sql).not.toContain('run-1');
    expect(calls[0].params).toContain('run-1');
    expect(calls[0].params).toContain('ed');
  });

  it('a repeated start does not create a second row (idempotent on run_id)', async () => {
    const { db, calls } = makeFakeD1();
    const ctx = makeContext({
      request: req({ phase: 'start', run_id: 'run-1', agent: 'ed', venture: 'pcd' }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    await POST(ctx);
    expect(calls[0].sql).toContain('ON CONFLICT(run_id) DO NOTHING');
  });

  it('happy path: a successful finish writes the row and stamps the registry', async () => {
    const { db, calls } = makeFakeD1();
    const ctx = makeContext({
      request: req({
        phase: 'finish',
        run_id: 'run-1',
        agent: 'ed',
        venture: 'parent-coach-desk',
        status: 'success',
        summary: 'Drafted 3 posts.',
        outputs: { drafts: 3 },
      }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body).toMatchObject({ ok: true, status: 'success' });
    expect(calls[0].sql).toContain('INSERT INTO agent_runs');
    expect(calls[1].sql).toContain('UPDATE agent_registry');
    expect(calls[1].sql).toContain('last_run_at');
  });

  it('a successful run posts nothing to Slack', async () => {
    const { db } = makeFakeD1();
    const slack = makeFetchSpy();
    vi.stubGlobal('fetch', slack);
    const ctx = makeContext({
      request: req({ phase: 'finish', run_id: 'r', agent: 'ed', venture: 'pcd', status: 'success' }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
    });
    await POST(ctx);
    expect(slack).not.toHaveBeenCalled();
  });

  it('a needs_you run posts to Slack even when it succeeded', async () => {
    const { db } = makeFakeD1();
    const slack = makeFetchSpy();
    vi.stubGlobal('fetch', slack);
    const ctx = makeContext({
      request: req({
        phase: 'finish',
        run_id: 'r',
        agent: 'vera',
        venture: 'pcd',
        status: 'success',
        needs_you: true,
        summary: 'One deletion request is staged.',
        needs_you_items: [{ id: 'req-1', urgency: 'high' }],
      }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
    });
    await POST(ctx);
    expect(slack).toHaveBeenCalledTimes(1);
    expect(slackText(slack)).toContain('vera');
  });

  it('failure alerting: a first failure alerts Slack but does not pause the agent', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ n: 1 }); // one failure in the last 24h — under the threshold
    const slack = makeFetchSpy();
    vi.stubGlobal('fetch', slack);
    const ctx = makeContext({
      request: req({
        phase: 'finish',
        run_id: 'r',
        agent: 'ed',
        venture: 'pcd',
        status: 'failed',
        error: 'GSC API returned 500',
      }),
      env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.canary).toMatchObject({ failures_24h: 1, paused: false });
    expect(slack).toHaveBeenCalledTimes(1);
    expect(slackText(slack)).toContain('GSC API returned 500');
    expect(fake.calls.some((c) => c.sql.includes("SET status = 'paused'"))).toBe(false);
  });

  it('CANARY: a second failure inside 24 hours pauses the agent and says so', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ n: 2 }); // two failures in the window — trips the threshold
    fake.queueRun({ meta: { changes: 1 } }); // finishRun
    const slack = makeFetchSpy();
    vi.stubGlobal('fetch', slack);
    const ctx = makeContext({
      request: req({
        phase: 'finish',
        run_id: 'r2',
        agent: 'ed',
        venture: 'pcd',
        status: 'failed',
        error: 'boom',
      }),
      env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.canary).toMatchObject({ failures_24h: 2, paused: true });
    const pauseCall = fake.calls.find((c) => c.sql.includes("SET status = 'paused'"));
    expect(pauseCall).toBeDefined();
    expect(pauseCall!.params).toContain('ed');
    expect(slackText(slack)).toContain('CANARY');
  });

  it('a Slack outage does not fail the log write', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ n: 1 });
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('slack down'); }));
    const ctx = makeContext({
      request: req({ phase: 'finish', run_id: 'r', agent: 'ed', venture: 'pcd', status: 'failed', error: 'x' }),
      env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(200);
    expect(fake.calls[0].sql).toContain('INSERT INTO agent_runs');
  });

  it('validation: rejects a missing run_id, agent, or venture', async () => {
    const { db } = makeFakeD1();
    for (const body of [
      { phase: 'start', agent: 'ed', venture: 'pcd' },
      { phase: 'start', run_id: 'r', venture: 'pcd' },
      { phase: 'start', run_id: 'r', agent: 'ed' },
    ]) {
      const ctx = makeContext({ request: req(body), env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN } });
      const res = await POST(ctx);
      expect(res.status).toBe(400);
    }
  });

  it('validation: rejects an unknown phase and an unknown status', async () => {
    const { db } = makeFakeD1();
    const bad = makeContext({
      request: req({ phase: 'middle', run_id: 'r', agent: 'ed', venture: 'pcd' }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    expect((await POST(bad)).status).toBe(400);

    const badStatus = makeContext({
      request: req({ phase: 'finish', run_id: 'r', agent: 'ed', venture: 'pcd', status: 'kinda-worked' }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    expect((await POST(badStatus)).status).toBe(400);
  });

  it('validation: rejects an oversized run_id', async () => {
    const { db } = makeFakeD1();
    const ctx = makeContext({
      request: req({ phase: 'start', run_id: 'x'.repeat(500), agent: 'ed', venture: 'pcd' }),
      env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN },
    });
    expect((await POST(ctx)).status).toBe(400);
  });

  it('rejects an invalid JSON body', async () => {
    const { db } = makeFakeD1();
    const request = new Request(URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}` },
      body: 'not json at all',
    });
    const ctx = makeContext({ request, env: { FORGE_DB: db, AGENT_RUNS_TOKEN: TOKEN } });
    expect((await POST(ctx)).status).toBe(400);
  });

  it('returns 500 without the FORGE_DB binding', async () => {
    const ctx = makeContext({ request: req({ phase: 'start', run_id: 'r', agent: 'ed', venture: 'pcd' }), env: { AGENT_RUNS_TOKEN: TOKEN } });
    expect((await POST(ctx)).status).toBe(500);
  });

  it('a D1 error returns a generic message, not the database error', async () => {
    const fake = makeFakeD1({ throwOn: /INSERT INTO agent_runs/ });
    const ctx = makeContext({
      request: req({ phase: 'start', run_id: 'r', agent: 'ed', venture: 'pcd' }),
      env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(500);
    expect(body.error).toBe('run log write failed');
    expect(JSON.stringify(body)).not.toContain('d1 exploded');
  });
});

// The CANARY exemption. Vera watches a legal 30-day deletion SLA and is the only
// thing watching it, so pausing her turns a loud failure into a silent one. Her
// real failures already sit 23h59m apart in agent_runs, which means the window
// below is her steady state rather than a contrived case. These tests exist so
// nobody deletes the exemption set and gets a green suite.
describe('CANARY exemption (Vera)', () => {
  const GUARD_ERROR = 'account guard: connected to pugetsound.edu, not the portfolio inbox';

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal('fetch', makeFetchSpy());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /** The live registry key, and the key after the deferred rename. Both are Vera. */
  for (const agent of ['pcd-deletion-monitor', 'vera']) {
    it(`${agent}: two failures inside 24 hours do not pause the agent`, async () => {
      const fake = makeFakeD1();
      fake.queueFirst({ n: 2 }); // same count that pauses 'ed' in the test above
      const slack = makeFetchSpy();
      vi.stubGlobal('fetch', slack);
      const ctx = makeContext({
        request: req({
          phase: 'finish',
          run_id: 'vera-2',
          agent,
          venture: 'pcd',
          status: 'failed',
          error: GUARD_ERROR,
        }),
        env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
      });
      const res = await POST(ctx);
      const body = await readJson(res);

      // Tripped the threshold, and was not paused.
      expect(body.canary).toMatchObject({ failures_24h: 2, paused: false });
      // No UPDATE ... SET status = 'paused' was issued at all, for any agent.
      expect(fake.calls.some((c) => c.sql.includes("SET status = 'paused'"))).toBe(false);
      expect(fake.calls.every((c) => !c.params.includes('paused'))).toBe(true);
    });

    it(`${agent}: still logs failed, still alerts Slack with the real error`, async () => {
      const fake = makeFakeD1();
      fake.queueFirst({ n: 2 });
      const slack = makeFetchSpy();
      vi.stubGlobal('fetch', slack);
      const ctx = makeContext({
        request: req({
          phase: 'finish',
          run_id: 'vera-3',
          agent,
          venture: 'pcd',
          status: 'failed',
          error: GUARD_ERROR,
        }),
        env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
      });
      await POST(ctx);

      const insert = fake.calls[0];
      expect(insert.sql).toContain('INSERT INTO agent_runs');
      expect(insert.params).toContain('failed');
      expect(insert.params).toContain(GUARD_ERROR);

      expect(slack).toHaveBeenCalledTimes(1);
      const text = slackText(slack);
      expect(text).toContain(agent);
      expect(text).toContain(GUARD_ERROR);
      // The alert says it tripped and says it was not paused. An exemption that
      // reads as a clean run is the silent failure wearing a different hat.
      expect(text).toContain('CANARY');
      expect(text).toContain('exempt');
      expect(text).not.toContain('set to *paused*');
    });

    it(`${agent}: a failed run sets needs_you even when the caller omitted it`, async () => {
      const fake = makeFakeD1();
      fake.queueFirst({ n: 2 });
      const ctx = makeContext({
        // No needs_you in the payload. This is exactly the 2026-07-14 row.
        request: req({
          phase: 'finish',
          run_id: 'vera-4',
          agent,
          venture: 'pcd',
          status: 'failed',
          error: GUARD_ERROR,
        }),
        env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
      });
      await POST(ctx);

      // finishRun binds: run_id, agent, venture, started_at, finished_at,
      // status, summary, needs_you, ...
      const insert = fake.calls[0];
      expect(insert.sql).toContain('INSERT INTO agent_runs');
      expect(insert.params[7]).toBe(1);
    });
  }

  it('a non-exempt agent with the identical two failures is still paused', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ n: 2 });
    const ctx = makeContext({
      request: req({
        phase: 'finish',
        run_id: 'ranger-2',
        agent: 'ranger',
        venture: 'pcd',
        status: 'failed',
        error: GUARD_ERROR,
      }),
      env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.canary).toMatchObject({ failures_24h: 2, paused: true });
    const pauseCall = fake.calls.find((c) => c.sql.includes("SET status = 'paused'"));
    expect(pauseCall).toBeDefined();
    expect(pauseCall!.params).toContain('ranger');
  });

  it('a non-exempt agent does not get needs_you invented for it', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ n: 2 });
    const ctx = makeContext({
      request: req({ phase: 'finish', run_id: 'ed-9', agent: 'ed', venture: 'pcd', status: 'failed', error: 'boom' }),
      env: { FORGE_DB: fake.db, AGENT_RUNS_TOKEN: TOKEN, ...SLACK_ENV },
    });
    await POST(ctx);
    expect(fake.calls[0].params[7]).toBe(0);
  });

  it('isCanaryExempt covers both keys and nothing else', () => {
    expect(isCanaryExempt('pcd-deletion-monitor')).toBe(true);
    expect(isCanaryExempt('vera')).toBe(true);
    expect(isCanaryExempt('  Vera  ')).toBe(true);
    expect(isCanaryExempt('ed')).toBe(false);
    expect(isCanaryExempt('ranger')).toBe(false);
    expect(isCanaryExempt('hal')).toBe(false);
    expect(isCanaryExempt('sunny')).toBe(false);
    expect(isCanaryExempt('nora')).toBe(false);
    // Not a prefix or substring match. `vera-test` is not Vera.
    expect(isCanaryExempt('vera-test')).toBe(false);
    expect(isCanaryExempt('pcd-deletion-monitor-v2')).toBe(false);
  });

  it('applyCanary reports the exemption instead of hiding it', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ n: 7 }); // well past the threshold
    const result = await applyCanary(fake.db, 'pcd-deletion-monitor');
    expect(result).toEqual({ failures24h: 7, tripped: true, paused: false, exempt: true });
    expect(fake.calls.some((c) => c.sql.includes("SET status = 'paused'"))).toBe(false);
  });

  it('applyCanary still pauses everyone else', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ n: 2 });
    const result = await applyCanary(fake.db, 'ed');
    expect(result).toEqual({ failures24h: 2, tripped: true, paused: true, exempt: false });
    expect(fake.calls.some((c) => c.sql.includes("SET status = 'paused'"))).toBe(true);
  });
});
