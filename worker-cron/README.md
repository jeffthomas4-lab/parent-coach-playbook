# parent-coach-playbook-cron

Tiny Cloudflare Worker. Two jobs on one daily cron:

1. Fires the Pages deploy hook for parentcoachdesk.com so queued posts (`publishedAt` in the future) go live on their date without anyone pushing a button.
2. POSTs `/api/cron/camps-sweep` on the site app, which runs the camps URL-health sweep, the stale-camp archive, and the approved-and-future blackout check.

Full operator manual lives in `../QUEUE.md`. This file just covers the worker itself.

## Files

- `wrangler.toml` — name, cron schedule, entry point, `SWEEP_URL` var, observability.
- `src/index.ts` — the worker. Two handlers: `scheduled` (cron) and `fetch` (manual trigger via `?key=`).
- `package.json` — wrangler dev dependency only.
- `tsconfig.json` — Workers types.

## Failure policy (changed 2026-07-15)

This worker used to call `console.warn` and return when `CRON_KEY` or `SWEEP_URL` was unset. A misconfigured sweep looked exactly like a healthy one. URL-health timestamps in the live `activity-radar` D1 froze at 2026-05-09 and nothing reported it for roughly nine weeks.

Missing config is now a hard failure. Every failure path throws, so the run shows as errored in the Cloudflare dashboard and in `npx wrangler tail` instead of passing green. The worker also fails on a non-2xx from the sweep, on an `ok:false` body, and when the approved-and-future camp count hits zero.

The deploy and the sweep run independently. One being broken never cancels the other, but either one failing fails the whole invocation.

## Config

`SWEEP_URL` is a plain var in `wrangler.toml`, not a secret. It is a public URL, and making it a secret meant an unset value silently disabled the sweep.

Three secrets. Set each from this directory:

```powershell
npm run secret:hook   # DEPLOY_HOOK_URL
npm run secret:key    # MANUAL_TRIGGER_KEY
npm run secret:cron   # CRON_KEY
```

`DEPLOY_HOOK_URL` is the Pages deploy hook from the Cloudflare dashboard. `MANUAL_TRIGGER_KEY` is any long random string used to authorize the manual fetch trigger. `CRON_KEY` must match the `CRON_KEY` secret on the site app that serves `SWEEP_URL` — if they disagree the sweep gets a 403, which now throws.

See what is actually set:

```powershell
npm run secret:list
```

## Two cron paths — pick one

`.github/workflows/camps-sweep-cron.yml` in the repo root calls the same `/api/cron/camps-sweep` endpoint on its own schedule (09:17 UTC daily). This worker calls it at 13:00 UTC. Both are wired; neither is confirmed working. Running both means the sweep runs twice a day against the same rows, which is wasteful but not harmful (the sweep is idempotent).

Decide on one and disable the other. This worker is the better home: it already owns the deploy hook, it needs no GitHub secret, and it survives the Pages-to-Workers migration. If you keep this one, delete the workflow file.

## Deploy

Always `npm install` first. Without a local `node_modules`, Wrangler walks up the directory tree and detects the parent Astro project as a Pages project, then refuses to deploy.

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-desk\worker-cron"
npm install
npm run deploy
```

## Verify

```powershell
npm run tail
```

Then in another window open the manual trigger URL with the right `?key=`. You should see a log line and the Pages dashboard should start a build.

To prove the sweep specifically, wait for the 13:00 UTC run (or use the dashboard's "Trigger Cron Event") and watch the tail. A healthy run logs `camps sweep ok:` with a JSON body. Anything else throws and shows red.

## If `npm run deploy` still errors with "Pages project"

The fix is in the npm script (which uses `--config ./wrangler.toml`), but if you ever invoke wrangler directly, use the explicit form:

```powershell
npx wrangler deploy --config ./wrangler.toml
```

## Schedule

`0 13 * * *` UTC. Edit `wrangler.toml` to change. Re-deploy after any change.
