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
  // Operator kill switch. The old August-November calendar auto-freeze was
  // removed 2026-08-01 (Jeff is working PCD nightly through the season now);
  // this is the only remaining way to hold writes, and it is manual only.
  PCD_MAINTENANCE_MODE?: string;
  // Secret, optional. Slack incoming-webhook URL for #pcd-agent-notifications.
  // The deploy-lag alert used to be a console.error, which meant it landed in
  // Workers observability logs that nobody opens. Production sat ten days stale
  // from 2026-08-19 to 2026-08-29 and every channel that could have said so was
  // a log file. If this is unset the monitor still logs and never throws, so a
  // missing secret degrades the alarm rather than breaking the camps sweep.
  SLACK_WEBHOOK_URL?: string;
}

const WORKFLOW_ID = 'pcd-camps-sweep';

export function maintenanceModeActive(
  env: Pick<Env, 'PCD_MAINTENANCE_MODE'>,
  _at = Date.now(),
): boolean {
  const explicit = env.PCD_MAINTENANCE_MODE?.trim().toLowerCase();
  return explicit === 'true' || explicit === '1' || explicit === 'on';
}

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

// ---------------------------------------------------------------------------
// Deploy-lag monitor
//
// WHY THIS EXISTS. On 2026-08-05 every GitHub Actions workflow was deleted,
// and `deploy-workers.yml` was the only thing that turned a commit on `main`
// into a live site. Both publishing pipelines (Ed/Penny, and BabyLoveGrowth's
// webhook) kept committing correctly, and nothing noticed that "published"
// had quietly stopped meaning "live" — it now meant "sitting in git until Jeff
// runs wrangler by hand."
//
// Cloudflare Workers Builds closes that gap, but a CI system that silently
// stops firing looks exactly like one that has nothing to do. So this checks
// the fact that actually matters: is the commit the live site was built from
// the same one that is on the tip of `main`?
//
// Deliberately unauthenticated on both ends. It reads the site's own public
// /build-info.json and GitHub's public commits API, so it needs no token and
// cannot leak anything. Never throws: a monitor that fails the invocation
// would mask the camps sweep in the same tick.
// ---------------------------------------------------------------------------

const REPO = 'jeffthomas4-lab/parent-coach-playbook';
const BUILD_INFO_URL = 'https://parentcoachdesk.com/build-info.json';
const LAG_ALERT_HOURS = 12;

/**
 * Post the lag alert somewhere a human actually looks. Best-effort by design:
 * a monitor must never fail the invocation it shares with the camps sweep.
 */
async function postLagAlert(
  env: Env | undefined,
  payload: Record<string, unknown>,
  fetchImpl: typeof fetch,
): Promise<void> {
  const webhook = env?.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.warn(JSON.stringify({ event: 'deploy_lag_alert_undeliverable', reason: 'no_slack_webhook' }));
    return;
  }
  const hours = payload.hours_behind ?? '?';
  const text = [
    `:rotating_light: *parentcoachdesk.com has been behind for ${hours}h*`,
    `live \`${payload.live_commit}\` vs main \`${payload.head_commit}\``,
    `oldest undeployed commit: ${payload.oldest_undeployed_at ?? 'unknown'}`,
    '',
    'Usually this is the deploy guard holding an unapproved code change, which',
    'also blocks every content push behind it. Check the latest Workers build.',
    'If the code is good, approve the pending range and push:',
    '```',
    'git commit --allow-empty -m "Approve pending code for deploy" \\',
    '                         -m "Deploy-Code: approved"',
    'git push origin main',
    '```',
  ].join('\n');
  try {
    await fetchImpl(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.warn(JSON.stringify({ event: 'deploy_lag_alert_failed', code: String(error).slice(0, 80) }));
  }
}

export async function checkDeployLag(fetchImpl: typeof fetch = fetch, env?: Env): Promise<void> {
  const headers = { 'User-Agent': 'pcd-deploy-lag-monitor/1.0' };
  let liveCommit: string;
  let builtAt: string;
  try {
    const response = await fetchImpl(BUILD_INFO_URL, {
      headers: { ...headers, 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`http_${response.status}`);
    const body = await response.json() as { commit?: unknown; builtAt?: unknown };
    liveCommit = typeof body.commit === 'string' ? body.commit : '';
    builtAt = typeof body.builtAt === 'string' ? body.builtAt : '';
    if (!liveCommit) throw new Error('no_commit');
  } catch (error) {
    // Before the first Workers Builds run there is no /build-info.json, so this
    // is expected exactly once. After that it means the site is down or a
    // deploy shipped without the build stamp.
    console.warn(JSON.stringify({ event: 'deploy_lag_build_info_unavailable', code: String(error).slice(0, 80) }));
    return;
  }

  let headCommit: string;
  let headDate: string;
  try {
    const response = await fetchImpl(`https://api.github.com/repos/${REPO}/commits/main`, {
      headers: { ...headers, Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`http_${response.status}`);
    const body = await response.json() as { sha?: unknown; commit?: { committer?: { date?: unknown } } };
    headCommit = typeof body.sha === 'string' ? body.sha : '';
    headDate = typeof body.commit?.committer?.date === 'string' ? body.commit.committer.date : '';
    if (!headCommit) throw new Error('no_sha');
  } catch (error) {
    console.warn(JSON.stringify({ event: 'deploy_lag_github_unavailable', code: String(error).slice(0, 80) }));
    return;
  }

  if (liveCommit === headCommit) {
    console.log(JSON.stringify({ event: 'deploy_lag_ok', commit: liveCommit.slice(0, 8) }));
    return;
  }

  // Behind is normal for a few minutes after a push, and normal indefinitely
  // for a code-only push the deploy guard deliberately refused. Only shout
  // once it has been behind long enough that nobody is coming.
  //
  // MEASURE THE OLDEST UNDEPLOYED COMMIT, NOT THE NEWEST (fixed 2026-08-17).
  //
  // This used to compute `now - headDate`, the age of the TIP commit, which
  // made the alert unfireable in normal operation. BabyLoveGrowth publishes
  // nightly around 22:00-22:30 PT and this cron ticks at 13:00 UTC (06:00 PT),
  // so the tip commit was reliably ~7.5 hours old at tick time: always under
  // LAG_ALERT_HOURS, always logged `info`, never once an alert. Production sat
  // 3 days stale from 2026-08-14 to 2026-08-17 with two published articles
  // 404ing, and this check would have shrugged at it every single morning if it
  // had been deployed. Any night with a fresh article reset the clock.
  //
  // The honest question is how long the oldest thing waiting to ship has been
  // waiting. GitHub's commits API with `since` answers it, still with no token.
  // `since` excludes anything at or before builtAt, so the deployed commit
  // drops out and what remains is the actual backlog.
  let waitingSince = headDate;
  if (builtAt) {
    try {
      const response = await fetchImpl(
        `https://api.github.com/repos/${REPO}/commits?since=${encodeURIComponent(builtAt)}&per_page=100`,
        {
          headers: { ...headers, Accept: 'application/vnd.github+json' },
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (response.ok) {
        const list = await response.json() as Array<{ commit?: { committer?: { date?: unknown } } }>;
        // GitHub returns newest first, so the last entry is the oldest commit
        // that has not shipped.
        const oldest = Array.isArray(list) && list.length > 0 ? list[list.length - 1] : null;
        const date = oldest?.commit?.committer?.date;
        if (typeof date === 'string' && date) waitingSince = date;
      }
    } catch {
      // Fall back to headDate. A missing backlog window is not worth throwing:
      // this monitor must never fail the camps sweep that shares its tick.
    }
  }

  const hoursBehind = waitingSince
    ? (Date.now() - Date.parse(waitingSince)) / 3_600_000
    : Number.POSITIVE_INFINITY;

  const payload = {
    event: 'deploy_lag',
    live_commit: liveCommit.slice(0, 8),
    head_commit: headCommit.slice(0, 8),
    live_built_at: builtAt,
    head_committed_at: headDate,
    oldest_undeployed_at: waitingSince,
    hours_behind: Number.isFinite(hoursBehind) ? Math.round(hoursBehind * 10) / 10 : null,
  };

  if (hoursBehind >= LAG_ALERT_HOURS) {
    console.error(JSON.stringify({ ...payload, severity: 'alert' }));
    await postLagAlert(env, payload, fetchImpl);
  } else {
    console.log(JSON.stringify({ ...payload, severity: 'info' }));
  }
}

export async function runScheduledSweep(env: Env, scheduledTime: number): Promise<void> {
  if (maintenanceModeActive(env)) {
    console.log(JSON.stringify({
      event: 'camps_sweep_held',
      workflowId: WORKFLOW_ID,
      reason: 'maintenance_mode',
      scheduledAt: new Date(scheduledTime).toISOString(),
      writes: 0,
    }));
    return;
  }
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
          maintenance_mode: maintenanceModeActive(env),
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

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // The lag monitor rides along rather than getting its own cron: it is two
    // GETs, and putting it first would delay the sweep. waitUntil so a slow
    // GitHub response cannot hold the invocation open, and checkDeployLag
    // swallows its own errors so it can never fail the sweep's tick.
    ctx.waitUntil(checkDeployLag(fetch, env));
    await runScheduledSweep(env, event.scheduledTime);
  },
};
