// Tiny Cloudflare Worker. Two jobs.
//
// 1. On the cron trigger declared in wrangler.toml, POST the Pages deploy hook
//    so the site rebuilds and any queued post whose publishedAt has now passed
//    goes live.
//
// 2. On a manual GET with the right ?key=, do the same thing. This is the panic
//    button if you want to publish a queued post early without pushing code.
//
// Configure with:
//   npx wrangler secret put DEPLOY_HOOK_URL
//   npx wrangler secret put MANUAL_TRIGGER_KEY
//
// Both secrets are required. Without them the worker returns 500 on manual
// triggers and logs an error on cron.

export interface Env {
  DEPLOY_HOOK_URL: string;
  MANUAL_TRIGGER_KEY: string;
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
    {
      status: res.ok ? 200 : 502,
      headers: { 'content-type': 'application/json' },
    }
  );
}

export default {
  // Manual trigger. Open this URL in a browser to publish the queue early:
  //   https://parent-coach-playbook-cron.<subdomain>.workers.dev/?key=YOUR_KEY
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const key = url.searchParams.get('key');

    if (!env.MANUAL_TRIGGER_KEY || key !== env.MANUAL_TRIGGER_KEY) {
      return new Response('Forbidden', { status: 403 });
    }

    return fireDeploy(env, 'manual');
  },

  // Scheduled trigger. Cron schedule lives in wrangler.toml.
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(fireDeploy(env, 'cron'));
  },
};
