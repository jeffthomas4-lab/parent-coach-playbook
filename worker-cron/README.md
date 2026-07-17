# Parent Coach Desk camps-sweep scheduler

This Worker is the one authoritative daily scheduler for
`POST /api/cron/camps-sweep`. The endpoint performs URL-health checks, stale
record handling, and the approved/future blackout guard.

The former Pages deploy-hook job was removed after production moved to Worker
`parent-coach-desk`. Publishing and deployment are separate protected actions;
the camps-quality scheduler must not advance the Pages rollback project.

## Failure policy

Missing `CRON_KEY` or `SWEEP_URL`, network failure, non-2xx response, invalid
JSON, `ok:false`, or a zero approved/future count throws. The scheduled handler
awaits the sweep so Cloudflare records failure rather than a false green run.

The site endpoint returns `ok:false` and HTTP 500 when URL checking, stale
archiving, directory-count probing, blackout detection, or healthy-heartbeat
delivery fails. Completed earlier writes are not rolled back, but the partial
run is visibly failed and retried only through the bounded scheduler policy.

The fetch handler is non-mutating. `/health` (and other non-`/ready` paths)
reports process liveness without checking configuration. `/ready` returns 200
only when both required settings are present, or a generic 503 without naming
which setting is missing. Neither route can invoke a sweep or deployment.

## Configuration

- `SWEEP_URL` is a public variable in `wrangler.toml`.
- `CRON_KEY` is the only required secret and must match the production site
  Worker. Set it interactively with `npm run secret:cron`.
- Observability is enabled at full sampling because this low-volume scheduler
  has no other reliable failure history.

## GitHub workflow

`.github/workflows/camps-sweep-cron.yml` is manual-only. A manual dispatch still
calls the production mutation endpoint, requires the repository `CRON_KEY`, and
requires Jeff's explicit approval. It is not a second scheduler.

## Local validation

From the repository root:

```powershell
npm.cmd test
npm.cmd run check
npm.cmd exec tsc -- --noEmit -p worker-cron/tsconfig.json
```

## Deployment

Deployment, secret changes, schedule changes, and a production cron invocation
each require separate approval. When approved:

```powershell
cd worker-cron
npm.cmd install
npm.cmd run deploy
```

After deployment, verify the active version/configuration and observe the next
scheduled run. Do not manually invoke the production sweep merely as a smoke
test.
