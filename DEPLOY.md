# Historical deployment guide — retired

This filename is retained because older notes and operator bookmarks point to
it. It is not a deployment procedure.

Parent Coach Desk is a Cloudflare Workers application. The former Cloudflare
Pages setup, Pages deploy hooks, direct local deploy sequence, repository
initialization steps, and custom-domain instructions that used to live here
are obsolete. Do not use them to configure, rebuild, or release the site.

## Current authorities

- Normal staging and production release: `DEPLOYMENT-RUNBOOK.md`
- Exact workflow implementation: `.github/workflows/deploy-workers.yml`
- Current verified runtime state: `coordination/CURRENT_STATE.md`
- Approval boundaries: `automation/APPROVAL-MATRIX.md` and
  `coordination/LAUNCH-AUTHORIZATION-MATRIX.md`
- Recovery and rollback evidence: `coordination/release-evidence/`

## Safe local preparation

Local preparation does not authorize deployment:

```powershell
npm.cmd ci
npm.cmd run test:unit
npm.cmd run test:integration
npm.cmd run check
npm.cmd run check:production-manifest
```

Never delete or reinitialize `.git` as a cleanup step. Never use `git add -A`
for a release. Never deploy an unreviewed working tree or reconstruct a
production artifact after approval.

## Resource bootstrap boundary

Creating or changing a Cloudflare Worker, D1 database, R2 bucket, KV namespace,
Access application, route, secret, domain, provider account, or GitHub
Environment is an external mutation. Follow a reviewed numbered plan and the
applicable human gate. Presence of a Wrangler configuration or migration file
is not authorization to apply it.

The retained Pages project is rollback evidence only and is not a safe normal
release target. Do not reconnect its custom domain or revive its deploy hook.
