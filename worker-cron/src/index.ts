// Tiny Cloudflare Worker. Three jobs.
//
// 1. On the cron trigger declared in wrangler.toml, POST the Pages deploy hook
//    so the site rebuilds and any queued post whose publishedAt has now passed
//    goes live.
//
// 2. Same cron, fire the camps-quality sweep on the Pages app.
//
// 3. On a manual GET with the right ?key=, do (1).
//
// FAILURE POLICY (2026-07-15). This worker used to swallow a missing CRON_KEY
// or SWEEP_URL with console.warn and return, so a misconfigured sweep looked
// exactly like a healthy one. It cost roughly nine weeks: URL-health
// timestamps in the live activity-radar D1 froze at 2026-05-09 and nothing
// said a word. The rule now: config that is missing is a hard failure, not a
// skip. Every failure path below throws, which marks the cron invocation
// errored in the Cloudflare dashboard, surfaces in `npx wrangler tail`, and is
// alertable via Workers observability. Loud beats quiet.

export interface Env {
  DEPLOY_HOOK_URL: string;
  MANUAL_TRIGGER_KEY: string;
  // Secret. Must match the CRON_KEY on the site app that serves SWEEP_URL.
  CRON_KEY?: string;
  // Plain var, set in wrangler.toml — it is a public URL, not a secret. Kept
  // optional in the type only so a bad deploy is caught by the check below
  // instead of failing to typecheck against an older config.
  SWEEP_URL?: string;
}

async function fireDeploy(env: Env, source: string): Promise<Response> {
  if (!env.DEPLOY_HOOK_URL) {
    console.error(`[${source}] DEPLOY_HOOK_URL secret is missing`);
    return new Response('DEPLOY_HOOK_URL not configured', { status: 500 });
  }
  const res = await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' });
  const body = await res.text();
  console.log(`[${source}] deploy hook returned ${res.status}: ${body}`);
  return new Response(
    JSON.stringify({ source, status: res.status, body }),
    { status: res.ok ? 200 : 502, headers: { 'content-type': 'application/json' } },
  );
}

// Throws on any failure. The caller lets it propagate so the cron run is
// recorded as errored rather than quietly succeeding.
async function fireCampsSweep(env: Env, source: string): Promise<void> {
  // 1. Config gate. Missing config is a failure, never a skip.
  const missing: string[] = [];
  if (!env.CRON_KEY) missing.push('CRON_KEY (secret: npx wrangler secret put CRON_KEY)');
  if (!env.SWEEP_URL) missing.push('SWEEP_URL (var: set in worker-cron/wrangler.toml)');
  if (missing.length > 0) {
    const msg =
      `[${source}] CAMPS SWEEP MISCONFIGURED — not run. Missing: ${missing.join(', ')}. ` +
      `The camps URL-health sweep and the stale-camp archive are both DOWN until this is set. ` +
      `This is the silent-skip that froze URL health from 2026-05-09.`;
    console.error(msg);
    throw new Error(msg);
  }

  // 2. Call the sweep.
  let res: Response;
  try {
    res = await fetch(env.SWEEP_URL as string, {
      method: 'POST',
      headers: {
        'x-cron-key': env.CRON_KEY as string,
        'content-type': 'application/json',
        // The sweep route sits behind Astro's cross-site POST protection, which
        // rejects a POST with no Origin before the route's own auth runs.
        origin: new URL(env.SWEEP_URL as string).origin,
      },
    });
  } catch (e) {
    const msg = `[${source}] CAMPS SWEEP UNREACHABLE at ${env.SWEEP_URL}: ${String(e)}`;
    console.error(msg);
    throw new Error(msg);
  }

  const body = await res.text();

  // 3. A non-2xx is a failure. 403 means CRON_KEY here and CRON_KEY on the site
  //    app disagree — the single most likely misconfiguration, and previously
  //    logged as a bland console.log nobody would ever read.
  if (!res.ok) {
    const hint =
      res.status === 403
        ? ' — CRON_KEY does not match the value on the site app. Rotate both together.'
        : '';
    const msg = `[${source}] CAMPS SWEEP FAILED: HTTP ${res.status}${hint}. Body: ${body}`;
    console.error(msg);
    throw new Error(msg);
  }

  // 4. A 200 with ok:false is still a failure. Parse and check.
  let parsed: { ok?: boolean; error?: string; approved_future_count?: number | null } | null = null;
  try {
    parsed = JSON.parse(body);
  } catch {
    const msg = `[${source}] CAMPS SWEEP returned non-JSON on a ${res.status}: ${body.slice(0, 300)}`;
    console.error(msg);
    throw new Error(msg);
  }

  if (parsed?.ok !== true) {
    const msg = `[${source}] CAMPS SWEEP returned ok:false — ${parsed?.error ?? 'no error given'}. Body: ${body}`;
    console.error(msg);
    throw new Error(msg);
  }

  // 5. Blackout guard. The sweep route logs this too, but it logs into the site
  //    app's stream; this worker is the thing on a schedule, so it repeats the
  //    alarm here where the cron failure is actually visible.
  if (parsed.approved_future_count === 0) {
    const msg =
      `[${source}] CAMPS ALERT: approved+future camp count is 0. /camps/ and the camps sitemap ` +
      `are serving empty. Check pcd_status on the programs table in the activity-radar D1.`;
    console.error(msg);
    throw new Error(msg);
  }

  console.log(`[${source}] camps sweep ok: ${body}`);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    if (!env.MANUAL_TRIGGER_KEY || key !== env.MANUAL_TRIGGER_KEY) {
      return new Response('Forbidden', { status: 403 });
    }
    return fireDeploy(env, 'manual');
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    // fireDeploy returns a Response (the fetch handler needs one) rather than
    // throwing, so on the cron path a 502 from the deploy hook would resolve
    // and count as a healthy run. Wrap it so a bad deploy fails the invocation
    // the same way a bad sweep does.
    const deploy = async (): Promise<void> => {
      const res = await fireDeploy(env, 'cron');
      if (!res.ok) {
        const msg = `[cron] DEPLOY HOOK FAILED: HTTP ${res.status}. Body: ${await res.text()}`;
        console.error(msg);
        throw new Error(msg);
      }
    };

    // Awaited, not ctx.waitUntil'd. waitUntil detaches the work from the
    // handler's promise, so a rejection inside it never marks the cron run
    // failed. Awaiting both is what makes a broken sweep show up as a red run
    // instead of a green one.
    const results = await Promise.allSettled([
      deploy(),
      fireCampsSweep(env, 'cron'),
    ]);

    // Run both jobs even if the first fails (allSettled), then fail the whole
    // invocation if either did. The deploy and the sweep are independent; one
    // being broken should never silently cancel the other.
    const failures = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
    if (failures.length > 0) {
      throw new Error(
        `cron: ${failures.length} of ${results.length} job(s) failed. ` +
          failures.map((f) => String(f.reason)).join(' | '),
      );
    }
  },
};
