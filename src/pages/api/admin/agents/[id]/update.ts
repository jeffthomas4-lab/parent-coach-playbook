// POST /api/admin/agents/:id/update
//
// Admin-only control surface for the /admin/agents page. `:id` is
// context-dependent on the action:
//   pause | resume  -> :id is the agent_registry.agent key
//   acknowledge      -> :id is the agent_runs.run_id
// This mirrors the two different primary keys the two Forge Command tables
// actually use (touchRegistry/pauseAgent key off `agent`; agent_runs keys off
// `run_id` — see src/lib/agent-runs.ts), so one route can drive both without
// pretending they share an id space.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../../lib/admin-auth';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const fail = (message: string, status = 400) => json({ ok: false, error: message }, status);

const VALID_ACTIONS = new Set(['pause', 'resume', 'acknowledge']);

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as { FORGE_DB?: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.FORGE_DB) return fail('FORGE_DB binding missing or query failed', 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return fail('missing id');

  let payload: { action?: string };
  try {
    payload = (await request.json()) as { action?: string };
  } catch {
    return fail('invalid json body');
  }

  const action = typeof payload.action === 'string' ? payload.action.trim() : '';
  if (!VALID_ACTIONS.has(action)) return fail('action must be pause, resume, or acknowledge');

  try {
    if (action === 'pause' || action === 'resume') {
      const status = action === 'pause' ? 'paused' : 'active';
      const res = await env.FORGE_DB.prepare(`UPDATE agent_registry SET status = ? WHERE agent = ?`).bind(status, id).run();
      if ((res.meta?.changes ?? 0) === 0) return fail('agent not found', 404);
    } else {
      const res = await env.FORGE_DB.prepare(`UPDATE agent_runs SET needs_you = 0 WHERE run_id = ?`).bind(id).run();
      if ((res.meta?.changes ?? 0) === 0) return fail('run not found', 404);
    }
  } catch (e) {
    console.error('[admin/agents/update] query failed', e);
    return fail('FORGE_DB binding missing or query failed', 500);
  }

  return json({ ok: true, id, action });
};
