# Publish pipeline

**Owner:** Jeff
**Last updated:** 2026-08-10
**Covers:** how an article gets from Ed, Penny, or BabyLoveGrowth onto parentcoachdesk.com without anyone typing a wrangler command.

This is the source for publishing and deployment behavior. `DEPLOYMENT-RUNBOOK.md` still owns the by-hand production sequence and the traps in it. When the two disagree about what happens automatically, this file wins.

---

## 1. What broke, and when

On 2026-08-05 every GitHub Actions workflow was deleted across nine repos after push-triggered CI burned the monthly allotment in four days. See `Outputs/_system/GITHUB-ACTIONS-REPLACEMENT.md`.

One of the deleted files was `deploy-workers.yml`. It was the only thing that turned a commit on `main` into a live site. Nothing replaced it.

Both publishing pipelines kept working exactly as designed. Ed drafts, Penny reviews and flips `draft: false`, the commit lands on `main`. BabyLoveGrowth posts a webhook, the Worker writes the article to `main` with `draft: false` and records a receipt in D1. Every step reported success.

The site just stopped changing. "Published" quietly came to mean "committed to git," and going live became a thing that happened only when Jeff ran the PowerShell block by hand. That gap is what this document closes.

### The second failure, found the same day

`Youth Basketball Drills: A Parent Coach's Ready-to-Run Guide` sat in the BabyLoveGrowth dashboard and never reached the repo at all. Its webhook never landed.

A six-hourly Cloudflare cron exists specifically to catch missed webhooks. It has never worked. As of 2026-08-10 there are zero rows in `external_article_receipts` with `source = 'api_reconciliation'`, against six from `webhook`. The reconciliation failed before it examined a single article and logged nothing useful about why. Section 4 covers the fix.

---

## 2. The two pipelines

Both end at the same place: a commit on `main` with `draft: false`.

### Ed and Penny (editorial)

| Step | Actor | What lands |
|---|---|---|
| 1 | Ed (`pcd-editorial-writer`) | Draft in the right collection with `draft: true`, queue advanced in `editorial-queue.md` |
| 2 | Penny | Review. Publishes (`draft: false`), sends back for revision, or holds |
| 3 | Workers Builds | Build and deploy |

Penny flipping `draft: false` is the approval. Nothing else gates it, and nothing else should.

### BabyLoveGrowth (provider)

| Step | Actor | What lands |
|---|---|---|
| 1 | BabyLoveGrowth | POST to `/api/integrations/babylovegrowth/articles` |
| 2 | `src/lib/babylove-growth.ts` | Receipt row in `external_article_receipts`, then a commit to `main` via the GitHub Contents API with `draft: false` and an `externalSource` block |
| 3 | Cloudflare cron, `17 */6 * * *` | Reconciliation. Pulls the provider's article list and imports anything with no receipt, so a dropped webhook self-heals within six hours |
| 4 | Workers Builds | Build and deploy |

`BABYLOVE_AUTOPUBLISH_ENABLED` is `true` in `wrangler.production.jsonc`. Set it to `false` to hold every provider article at status `held` without turning off the integration.

---

## 3. Workers Builds

Cloudflare's own git-connected CI. It runs on the Workers plan already paid for and spends zero GitHub Actions minutes, which is the whole reason it replaces the deleted workflow rather than restoring it.

### One-time setup

Cloudflare dashboard, **Workers & Pages** → **parent-coach-desk** → **Settings** → **Build**.

| Field | Value |
|---|---|
| Git repository | `jeffthomas4-lab/parent-coach-playbook` |
| Git branch | `main` |
| Root directory | `/` |
| Build command | `npm run build:production` |
| Deploy command | `npm run deploy:ci` |
| Non-production branch builds | Leave off |

**Build watch paths.**

| | Value |
|---|---|
| Include | `src/content/*`, `public/illustrations/*`, `public/og/*`, `public/og-camps/*`, `editorial-queue.md`, `CONTENT_ROADMAP.md` |
| Exclude | (empty) |

A push that touches none of those does not build. Code changes still ship by hand, per `DEPLOYMENT-RUNBOOK.md`.

`reports/editorial/editorial-refresh-queue.json` is deliberately absent from that list. It is untracked (`.gitignore`), regenerated at the top of every build, and was untracked on 2026-08-05 because tracking it conflicted on every merge.

### Why the build command must be `build:production`

Plain `npm run build` stamps `dist/server/wrangler.json` with `"name": "parent-coach-desk-staging"`. Wrangler then deploys the staging Worker and reports success. The only tell is one `Uploaded parent-coach-desk-staging` line under a 128-row module table. This has already shipped a day-old staging build once, on 2026-08-05.

### The deploy guard

`npm run deploy:ci` runs `scripts/ci-deploy-guard.mjs` before wrangler, and only deploys if the guard passes.

Build watch paths are the primary control, but Cloudflare documents two cases where it ignores them and builds anyway: a push carrying 20 or more commits, or one touching 3,000 or more files. Codex and the editorial agents push in bursts, so 20 commits is not hypothetical. Without the guard, one burst would ship whatever half-finished code was sitting on `main`.

The guard compares the live commit against the incoming one and refuses to deploy if anything outside the content allowlist changed. It fails closed. It is a no-op outside Workers Builds, so a by-hand deploy is never gated.

```powershell
# Judge any diff yourself before pushing
node scripts/ci-deploy-guard.mjs --since <sha> --explain
```

When it blocks, the build goes red and prints the offending paths plus the manual deploy commands. That is the correct outcome: a push mixing code with content needs a human deciding to ship it.

### The build stamp

`scripts/write-build-info.mjs` writes `public/build-info.json` at the top of every build, so the live site says which commit it came from. Served at `/build-info.json`. Untracked, for the same conflict reason as the editorial refresh queue.

The deploy guard reads it to learn what is live. The deploy-lag monitor reads it to know whether production is behind `main`.

---

## 4. The reconciliation fix

`reconcileBabyLoveArticles` accepted exactly two response shapes: a bare array, or `{ articles: [...] }`. Anything else threw `api_list_invalid` before it looked at a single article, and the error went to a `console.error` nobody was tailing.

Changed 2026-08-10:

1. Accepts `articles`, `data`, `items`, `results`, and `records`, at the top level or one level of nesting.
2. When no list is found, logs the envelope's top-level keys and the payload type. Keys only, never values.
3. Names the missing binding on `reconciliation_unavailable` instead of reporting it bare, so an unset `BABYLOVE_API_KEY` or `GITHUB_TOKEN` is one log line away instead of a guess.
4. Reads a listing item's id from `id`, `article_id`, `articleId`, or `uuid`, and logs the item's keys when none match.
5. Batch raised from 20 to 50, with a warning when the provider returns more than that.
6. The completion log carries `listing_size`, which separates "the provider returned nothing" from "the shape was wrong."

### Confirming it works

The reconciliation runs at `:17` past every sixth hour. Watch a live tick:

```powershell
npm exec wrangler -- tail parent-coach-desk --format pretty
```

Look for `babylove_reconciliation_completed`. `listing_size` greater than zero with `published` or `skipped` greater than zero means the path is healthy. `babylove_reconciliation_unavailable` names a missing secret. `babylove_reconciliation_list_invalid` prints the shape the provider actually sent.

If a secret is missing:

```powershell
npm exec wrangler -- secret list --config wrangler.production.jsonc
```

Required: `AGENT_RUNS_TOKEN`, `BULK_IMPORT_TOKEN`, `CRON_KEY`, `GITHUB_TOKEN`, `BABYLOVE_API_KEY`, `BABYLOVE_WEBHOOK_TOKEN`.

---

## 5. Monitoring

Two checks, both already wired.

**Deploy lag.** `worker-cron` (`parent-coach-playbook-cron`, daily at 13:00 UTC) compares `/build-info.json` against the tip of `main` on GitHub. Logs `deploy_lag_ok` when they match. Logs `deploy_lag` with `severity: alert` once production has been behind for 12 hours or more. It swallows its own errors so it can never fail the camps sweep in the same tick.

**Publish drift.** `scripts/check-publish-queue-drift.mjs` compares every locally eligible page against the live sitemap. It exists because on 2026-07-28 the homepage went a week stale with a green build and passing tests. Run it any time:

```powershell
node scripts/check-publish-queue-drift.mjs
```

Reported clean on 2026-08-10: 2,104 URLs live, 1,873 eligible, no drift.

---

## 6. Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Article is on `main` with `draft: false` but not live | Build watch paths did not match, or the guard blocked the push | Check the Workers Builds log. If blocked, deploy by hand per `DEPLOYMENT-RUNBOOK.md` |
| Article is in BabyLoveGrowth but not in the repo | Webhook dropped and reconciliation is failing | Tail the Worker at `:17`. See section 4 |
| Deploy succeeded but the site did not change | Staging Worker shipped instead of production | The build must be `build:production`. Assert the manifest name prints `parent-coach-desk` |
| Whole site behind by days | Workers Builds disconnected or its API token expired | `deploy_lag` alert fires at 12 hours. Reconnect in **Settings** → **Build** |
| Provider article published with no hero image | `pcd-hero-image-backfill` has been disabled since 2026-07-31 | Generate the hero and commit it, or re-enable the backfill |

---

## 7. What this does not do

Code changes do not auto-deploy, by choice. Anything outside the content allowlist ships from PowerShell after review.

There is no staging-before-production sequence and no automatic rollback on smoke failure. Both went with `deploy-workers.yml`. `scripts/deploy-remediation.mjs` and `scripts/smoke-worker-deployment.mjs` still exist and still work, but nothing forces them to run. Restoring the staging gate on top of Workers Builds is open work.

Nothing here reopens the human approval gate on BabyLoveGrowth content. `BABYLOVE_AUTOPUBLISH_ENABLED` is the only switch, and it is all or nothing.
