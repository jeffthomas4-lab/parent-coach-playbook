// Tiny Cloudflare Worker. Three jobs.
//
// 1. On the cron trigger declared in wrangler.toml, POST the Pages deploy hook
//    so the site rebuilds and any queued post whose publishedAt has now passed
//    goes live.
//
// 2. Same cron, fire the camps-quality sweep on the Pages app.
//
// 3. On a manual GET with the right ?key=, do (1).

export interface Env {
  DEPLOY_HOOK_URL: string;
  MANUAL_TRIGGER_KEY: string;
  CRON_KEY?: string;
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

async function fireCampsSweep(env: Env, source: string): Promise<void> {
  if (!env.CRON_KEY || !env.SWEEP_URL) {
    console.warn(`[${source}] camps sweep skipped — CRON_KEY or SWEEP_URL not configured`);
    return;
  }
  try {
    const res = await fetch(env.SWEEP_URL, {
      method: 'POST',
      headers: { 'x-cron-key': env.CRON_KEY, 'content-type': 'application/json' },
    });
    const body = await res.text();
    console.log(`[${source}] camps sweep returned ${res.status}: ${body}`);
  } catch (e) {
    console.error(`[${source}] camps sweep failed`, e);
  }
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

  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(fireDeploy(env, 'cron'));
    ctx.waitUntil(fireCampsSweep(env, 'cron'));
  },
};
