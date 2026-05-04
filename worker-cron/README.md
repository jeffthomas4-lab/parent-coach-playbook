# parent-coach-playbook-cron

Tiny Cloudflare Worker. Fires the Pages deploy hook for parentcoachplaybook.com once a day so queued posts (`publishedAt` in the future) go live on their date without anyone pushing a button.

Full operator manual lives in `../QUEUE.md`. This file just covers the worker itself.

## Files

- `wrangler.toml` — name, cron schedule, entry point.
- `src/index.ts` — the worker. Two handlers: `scheduled` (cron) and `fetch` (manual trigger via `?key=`).
- `package.json` — wrangler dev dependency only.
- `tsconfig.json` — Workers types.

## Secrets

Set both before the first deploy. The npm scripts already pass `--config ./wrangler.toml`.

```powershell
npm run secret:hook
npm run secret:key
```

`DEPLOY_HOOK_URL` is the Pages deploy hook from the Cloudflare dashboard. `MANUAL_TRIGGER_KEY` is any string used to authorize the manual fetch trigger.

## Deploy

Always `npm install` first. Without a local `node_modules`, Wrangler walks up the directory tree and detects the parent Astro project as a Pages project, then refuses to deploy.

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-playbook\worker-cron"
npm install
npm run deploy
```

## Verify

```powershell
npm run tail
```

Then in another window open the manual trigger URL with the right `?key=`. You should see a log line and the Pages dashboard should start a build.

## If `npm run deploy` still errors with "Pages project"

The fix is in the npm script (which uses `--config ./wrangler.toml`), but if you ever invoke wrangler directly, use the explicit form:

```powershell
npx wrangler deploy --config ./wrangler.toml
```

## Schedule

`0 13 * * *` UTC. Edit `wrangler.toml` to change. Re-deploy after any change.
