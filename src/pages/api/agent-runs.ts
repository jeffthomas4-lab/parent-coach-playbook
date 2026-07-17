// POST /api/agent-runs
//
// The wire that closes Open Item 3. PCD's scheduled tasks run as Claude tasks
// with no D1 binding, so they had no way to reach `agent_runs` and the table sat
// empty. This route is the way in: a task POSTs a start row when it begins and a
// finish row when it ends, and this Worker does the D1 write, the Slack alert on
// failure, and the CANARY auto-pause on a second failure inside 24 hours.
//
// Auth: `Authorization: Bearer <AGENT_RUNS_TOKEN>` — a shared secret, not a user
// identity. This route writes only to the run log; it publishes nothing, sends
// nothing to a person outside the system, and spends nothing, so a machine
// caller with the token is the whole gate.
//
// Body (JSON):
//   { phase: "start",  run_id, agent, venture, started_at? }
//   { phase: "finish", run_id, agent, venture, status, summary?, needs_you?,
//     needs_you_items?, outputs?, error?, finished_at? }
//
// Idempotent on run_id. A task that retries the same run_id updates its row
// instead of doubling it.

import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import {
  startRun,
  finishRun,
  touchRegistry,
  applyCanary,
  alertRun,
  type AgentRunsEnv,
  type RunStatus,
} from '../../lib/agent-runs';
import { readBoundedJson } from '../../lib/demand-telemetry';
import { bearerCredential, secretsMatch } from '../../lib/secrets';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

const VALID_STATUS: RunStatus[] = ['success', 'partial', 'failed'];
const MAX_ID_LEN = 200;
const MAX_AGENT_RUN_BODY_BYTES = 65_536;
const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]*$/;

const stringField = (value: unknown): string => typeof value === 'string' ? value.trim() : '';

interface Payload {
  phase?: string;
  run_id?: string;
  agent?: string;
  venture?: string;
  status?: string;
  summary?: string;
  needs_you?: boolean;
  needs_you_items?: unknown;
  outputs?: unknown;
  error?: string;
  started_at?: string;
  finished_at?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as AgentRunsEnv | undefined;

  if (!env?.AGENT_RUNS_TOKEN) {
    console.error('[agent-runs] AGENT_RUNS_TOKEN not configured — refusing all writes');
    return json({ ok: false, error: 'not configured' }, 503);
  }
  if (!(await secretsMatch(bearerCredential(request), env.AGENT_RUNS_TOKEN))) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }
  if (!env.FORGE_DB) {
    console.error('[agent-runs] FORGE_DB binding missing');
    return json({ ok: false, error: 'run log not available' }, 500);
  }

  let body: Payload;
  try {
    body = (await readBoundedJson(request, MAX_AGENT_RUN_BODY_BYTES)) as Payload;
  } catch (error) {
    if (error instanceof RangeError) return json({ ok: false, error: 'payload too large' }, 413);
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  // Server-side validation. The client's word on any of this counts for nothing.
  const runId = stringField(body.run_id);
  const agent = stringField(body.agent);
  const venture = stringField(body.venture);
  if (!runId || !agent || !venture) {
    return json({ ok: false, error: 'run_id, agent, and venture are required' }, 400);
  }
  if (runId.length > MAX_ID_LEN || agent.length > MAX_ID_LEN || venture.length > MAX_ID_LEN) {
    return json({ ok: false, error: 'run_id, agent, or venture too long' }, 400);
  }
  if (!SAFE_ID.test(runId) || !SAFE_ID.test(agent) || !SAFE_ID.test(venture)) {
    return json({ ok: false, error: 'run_id, agent, or venture has invalid characters' }, 400);
  }
  const phase = stringField(body.phase).toLowerCase();
  if (phase !== 'start' && phase !== 'finish') {
    return json({ ok: false, error: 'phase must be "start" or "finish"' }, 400);
  }

  try {
    if (phase === 'start') {
      await startRun(env.FORGE_DB, {
        run_id: runId,
        agent,
        venture,
        started_at: body.started_at,
      });
      return json({ ok: true, phase: 'start', run_id: runId });
    }

    const status = stringField(body.status).toLowerCase() as RunStatus;
    if (!VALID_STATUS.includes(status)) {
      return json({ ok: false, error: 'status must be success, partial, or failed' }, 400);
    }
    if (body.summary !== undefined && typeof body.summary !== 'string') {
      return json({ ok: false, error: 'summary must be a string' }, 400);
    }
    if (body.error !== undefined && typeof body.error !== 'string') {
      return json({ ok: false, error: 'error must be a string' }, 400);
    }
    if (body.needs_you !== undefined && typeof body.needs_you !== 'boolean') {
      return json({ ok: false, error: 'needs_you must be a boolean' }, 400);
    }

    const finishInput = {
      run_id: runId,
      agent,
      venture,
      status,
      summary: body.summary ?? null,
      needs_you: body.needs_you ?? false,
      needs_you_items: body.needs_you_items,
      outputs: body.outputs,
      error: body.error ?? null,
      finished_at: body.finished_at,
    };

    await finishRun(env.FORGE_DB, finishInput);
    await touchRegistry(env.FORGE_DB, agent, finishInput.finished_at ?? new Date().toISOString());

    // CANARY: a second failure inside 24 hours pauses the agent rather than
    // letting it keep failing quietly.
    let canary;
    if (status === 'failed') {
      try {
        canary = await applyCanary(env.FORGE_DB, agent);
      } catch (e) {
        console.error('[agent-runs] canary check failed', e);
      }
    }

    // Alerting is best-effort and must never fail the log write — the row is
    // already committed above.
    try {
      await alertRun(env, finishInput, canary);
    } catch (e) {
      console.error('[agent-runs] alert failed', e);
    }

    return json({
      ok: true,
      phase: 'finish',
      run_id: runId,
      status,
      canary: canary ? { failures_24h: canary.failures24h, paused: canary.paused } : undefined,
    });
  } catch (e) {
    // The real error goes to the log, not the response body.
    console.error('[agent-runs] write failed', e);
    return json({ ok: false, error: 'run log write failed' }, 500);
  }
};
