// Parent Coach Desk camps-sweep scheduler.
//
// One job: fire the camps-quality sweep on the production Worker. The obsolete
// Pages deploy hook was removed after the Pages-to-Workers cutover. Publishing
// is a separate protected workflow.

export interface Env {
  // Secret. Must match the CRON_KEY on the site app that serves SWEEP_URL.
  CRON_KEY?: string;
  // Plain public URL set in wrangler.toml. Optional in the type so a bad deploy
  // is caught explicitly and recorded as a failed scheduled invocation.
  SWEEP_URL?: string;
  // Canonical Forge Command runtime database. A scheduled mutation is not
  // allowed to run unless its attempt can first be recorded durably.
  FORGE_DB?: D1Database;
}

const WORKFLOW_ID = 'pcd-camps-sweep';

type SweepMetrics = {
  approved_future_count: number;
  stale_archived: number | null;
  stale_archive_has_more: boolean;
};

// Throws on every failure. The scheduled handler awaits this promise so
// Cloudflare records the invocation as failed instead of silently green.
export async function fireCampsSweep(env: Env, source: string): Promise<SweepMetrics> {
  const missing: string[] = [];
  if (!env.CRON_KEY) missing.push('CRON_KEY (secret: wrangler secret put CRON_KEY)');
  if (!env.SWEEP_URL) missing.push('SWEEP_URL (var: set in worker-cron/wrangler.toml)');
  if (missing.length > 0) {
    const msg =
      `[${source}] CAMPS SWEEP MISCONFIGURED - not run. Missing: ${missing.join(', ')}. ` +
      'The URL-health sweep and stale-camp archive are down until configuration is restored.';
    console.error(msg);
    throw new Error(msg);
  }

  // The configuration gate above proves both values. Copy them into narrowed
  // locals so later async work cannot observe optional properties.
  const sweepUrl = env.SWEEP_URL as string;
  const cronKey = env.CRON_KEY as string;

  let response: Response;
  try {
    response = await fetch(sweepUrl, {
      method: 'POST',
      headers: {
        'x-cron-key': cronKey,
        'content-type': 'application/json',
        origin: new URL(sweepUrl).origin,
      },
    });
  } catch (error) {
    const msg = `[${source}] CAMPS SWEEP UNREACHABLE at ${sweepUrl}: ${String(error)}`;
    console.error(msg);
    throw new Error(msg);
  }

  // The response is a bounded first-party JSON status document.
  const body = await response.text();
  if (!response.ok) {
    const hint = response.status === 403 ? ' - CRON_KEY values do not match.' : '';
    const msg = `[${source}] CAMPS SWEEP FAILED: HTTP ${response.status}${hint} Body: ${body}`;
    console.error(msg);
    throw new Error(msg);
  }

  let parsed: {
    ok?: boolean;
    error?: string;
    approved_future_count?: number | null;
    stale_archive_has_more?: boolean;
    stale_archived?: number;
  };
  try {
    parsed = JSON.parse(body) as typeof parsed;
  } catch {
    const msg = `[${source}] CAMPS SWEEP returned non-JSON: ${body.slice(0, 300)}`;
    console.error(msg);
    throw new Error(msg);
  }

  if (parsed.ok !== true) {
    const msg = `[${source}] CAMPS SWEEP returned ok:false - ${parsed.error ?? 'no error given'}`;
    console.error(msg);
    throw new Error(msg);
  }
  if (parsed.approved_future_count === 0) {
    const msg = `[${source}] CAMPS ALERT: approved+future camp count is 0.`;
    console.error(msg);
    throw new Error(msg);
  }

  if (parsed.stale_archive_has_more) {
    console.warn(JSON.stringify({
      event: 'camps_sweep_backlog',
      code: 'stale_archive_has_more',
      archived: parsed.stale_archived ?? null,
      source,
    }));
  }

  console.log(JSON.stringify({ event: 'camps_sweep_ok', source, approvedFuture: parsed.approved_future_count }));
  return {
    approved_future_count: parsed.approved_future_count as number,
    stale_archived: parsed.stale_archived ?? null,
    stale_archive_has_more: parsed.stale_archive_has_more === true,
  };
}

export async function runScheduledSweep(env: Env, scheduledTime: number): Promise<void> {
  if (!env.FORGE_DB) throw new Error('[cron] CAMPS SWEEP MISCONFIGURED - FORGE_DB binding missing.');

  const scheduledAt = new Date(scheduledTime).toISOString();
  const attemptId = `${WORKFLOW_ID}:${scheduledAt}`;
  const startedAt = new Date().toISOString();
  const opened = await env.FORGE_DB.prepare(
    `INSERT INTO scheduler_attempts
       (attempt_id, venture, workflow_id, trigger_type, scheduled_at, started_at, status)
     VALUES (?, 'pcd', ?, 'cron', ?, ?, 'running')
     ON CONFLICT(attempt_id) DO NOTHING`,
  ).bind(attemptId, WORKFLOW_ID, scheduledAt, startedAt).run();

  if (Number(opened.meta?.changes ?? 0) !== 1) {
    console.warn(JSON.stringify({ event: 'scheduler_attempt_duplicate', workflowId: WORKFLOW_ID, attemptId }));
    return;
  }

  try {
    const metrics = await fireCampsSweep(env, 'cron');
    const completed = await env.FORGE_DB.prepare(
      `UPDATE scheduler_attempts
          SET finished_at = ?, status = 'succeeded', result_code = 'sweep_completed',
              metrics_json = ?, updated_at = ?
        WHERE attempt_id = ? AND status = 'running'`,
    ).bind(new Date().toISOString(), JSON.stringify(metrics), new Date().toISOString(), attemptId).run();
    if (Number(completed.meta?.changes ?? 0) !== 1) {
      throw new Error('[cron] CAMPS SWEEP completed but its durable attempt could not be finalized.');
    }
  } catch (error) {
    try {
      await env.FORGE_DB.prepare(
        `UPDATE scheduler_attempts
            SET finished_at = ?, status = 'failed', result_code = 'sweep_failed', updated_at = ?
          WHERE attempt_id = ? AND status = 'running'`,
      ).bind(new Date().toISOString(), new Date().toISOString(), attemptId).run();
    } catch {
      console.error(JSON.stringify({ event: 'scheduler_attempt_finalize_failed', workflowId: WORKFLOW_ID, attemptId }));
    }
    throw error;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    if (pathname === '/ready') {
      const ready = Boolean(env.CRON_KEY && env.SWEEP_URL && env.FORGE_DB);
      return Response.json(
        {
          ok: ready,
          service: 'pcd-camps-sweep-scheduler',
          check: 'readiness',
          ...(ready ? {} : { code: 'required_configuration_missing' }),
        },
        { status: ready ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    return Response.json(
      { ok: true, service: 'pcd-camps-sweep-scheduler', check: 'liveness' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  },

  async scheduled(event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    await runScheduledSweep(env, event.scheduledTime);
  },
};
