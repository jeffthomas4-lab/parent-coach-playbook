# Publish pipeline

**Owner:** Jeff
**Last updated:** 2026-08-12
**Covers:** how an article gets from Ed, Penny, or BabyLoveGrowth onto parentcoachdesk.com without anyone typing a wrangler command.

This is the source for publishing and deployment behavior. `DEPLOYMENT-RUNBOOK.md` still owns the by-hand production sequence and the traps in it. When the two disagree about what happens automatically, this file wins.

---

## 1. What broke, and when

On 2026-08-05 every GitHub Actions workflow was deleted across nine repos after push-triggered CI burned the monthly allotment in four days. See `Outputs/_system/GITHUB-ACTIONS-REPLACEMENT.md`.

One of the deleted files was `deploy-workers.yml`. It had been the only thing that turned a commit on `main` into a live site.

**Update, 2026-08-12: this section was wrong.** Cloudflare Workers Builds *did* replace it, and it works. Verified directly in Cloudflare's build history: a run of successful green builds, including `0c0d558 Publish BabyLoveGrowth article 703566: parent-coach-ethics`, which built and deployed straight from `main`. "Nothing replaced it" was never true after Workers Builds was connected. That was never the actual failure, and this doc never described the real one until today.

The real failure: the manual local deploy path was never retired once Workers Builds existed. Dana's nightly local `wrangler deploy` shipped whatever was on her machine — Penny's and Ed's editorial output, which had never been pushed. Workers Builds shipped whatever was on `origin/main` — BabyLoveGrowth's articles, written straight to origin via its webhook. Neither lane knew the other existed, and whichever ran last won, overwriting the other's articles. Cloudflare's version history shows the two lanes alternating for four days: `75b18753` manual, `312e1e7e` build, `0b6ea0f5` manual, `3f4cdcd7` build, `5293d8a4` build, `5dea0f3b` manual. Each deploy reverted the previous lane's content. `parent-coach-ethics` was live right after the `0c0d558` build; a manual deploy seven hours later took it back to a 404.

Fixed 2026-08-12: `CLAUDE.md`'s Deployment norm no longer tells every agent session to append a local `wrangler deploy` on every repo change, and the manual path is now break-glass only (section 7). See `parent-coach-desk-RESYNC-RUNBOOK.md` for the one-time resync this required.

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
| 3 | Penny / Ed | `git fetch` + `git pull --rebase origin main`, then `git push origin main` |
| 4 | Workers Builds | Build and deploy |

Penny flipping `draft: false` is the approval. Nothing else gates it, and nothing else should.

The rebase before push is mandatory, not optional. BabyLoveGrowth writes commits directly to `origin/main` via the GitHub Contents API, out from under any local clone — a push that skips the rebase can silently revert whatever BabyLoveGrowth landed since the clone was last synced. That's exactly what happened for four days (section 1). Both scheduled tasks, `pcd-review-publish` and `pcd-editorial-writer`, were updated 2026-08-12 to fetch and rebase before committing.

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

These were wrong until 2026-08-12: the field was set to `*`, so every push triggered a build, including code-only pushes that were never meant to auto-ship. `ci-deploy-guard` correctly blocked those from deploying, so nothing bad shipped from it directly — but it meant Workers Builds was building on every commit instead of only the content commits it was meant for. Corrected 2026-08-12 to the content allowlist above.

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

### Update, 2026-08-12: still not resolved

The shape fix above did not fix it. There are still zero `api_reconciliation` rows in `external_article_receipts`. All six required secrets were confirmed present in the Cloudflare dashboard on 2026-08-12 — nothing is missing.

By elimination: `GITHUB_TOKEN` and the `PCD_OPS_DB` binding are proven good, because the webhook path uses both and has written 7 receipt rows and 7 GitHub commits. `BABYLOVE_WEBHOOK_TOKEN` is proven too — that's how the provider authenticates to us, and that works. `BABYLOVE_API_KEY` is the only one of the six used exclusively by reconciliation, and the code throws on a non-2xx from the provider's list endpoint before it writes anything to D1 — exactly the zero-rows-of-any-status signature observed.

**This points to `BABYLOVE_API_KEY` being invalid or expired.** This is a deduction from elimination, not a direct observation — the tail below is what confirms or kills it. If it shows `api_401` or `api_403`, regenerate the key in the BabyLoveGrowth dashboard and reset it with `npm exec wrangler -- secret put BABYLOVE_API_KEY --config wrangler.production.jsonc`.

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

**Never actually deployed, as of 2026-08-12.** The monitor above exists in `worker-cron/src/index.ts` (added 2026-08-10), but the live `parent-coach-playbook-cron` bundle only contains `fireCampsSweep`/`runScheduledSweep` — the worker was never redeployed after that commit landed. `deploy_lag_ok` and `deploy_lag` have never once logged, because the code that logs them has never shipped. This monitor would have caught the four-day overwrite bug in section 1 and didn't, because it wasn't live. Any future change to `worker-cron` must be followed by `npm exec wrangler -- deploy` from that directory, and the live bundle checked afterward to confirm the deploy-lag code actually made it — a green deploy is not proof by itself.

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
| An article was live, then vanished | A local `wrangler deploy` published a stale clone over production | Never deploy locally. Push to `origin/main` and let Workers Builds ship it |

---

## 7. What this does not do

Code changes do not auto-deploy, by choice. Anything outside the content allowlist ships from PowerShell after review. As of 2026-08-12 that manual path is break-glass only, per the updated `CLAUDE.md` Deployment norm — not a routine habit, and never run against a clone that's behind `origin/main` (see section 1 and `parent-coach-desk-RESYNC-RUNBOOK.md`).

There is no staging-before-production sequence and no automatic rollback on smoke failure. Both went with `deploy-workers.yml`. `scripts/deploy-remediation.mjs` and `scripts/smoke-worker-deployment.mjs` still exist and still work, but nothing forces them to run. Restoring the staging gate on top of Workers Builds is open work.

Nothing here reopens the human approval gate on BabyLoveGrowth content. `BABYLOVE_AUTOPUBLISH_ENABLED` is the only switch, and it is all or nothing.

---

## Changelog

**2026-08-12.** Corrected section 1: Workers Builds was never missing — it replaced `deploy-workers.yml` and works, verified in Cloudflare's build history. The real bug was that the manual local deploy path was never retired alongside it, so it and Workers Builds spent four days overwriting each other's articles (evidence: the alternating version history now quoted in section 1). Updated section 2's Ed/Penny row to ship by `git push` with a mandatory rebase first, not a local deploy. Updated section 3 to note the build watch paths were wrongly set to `*` until today. Updated section 4 to record that the 2026-08-10 shape fix did not resolve reconciliation, and added the elimination-based deduction that `BABYLOVE_API_KEY` is the remaining suspect. Updated section 5 to flag that the deploy-lag monitor has never actually been deployed. Added a failure-mode row for the vanishing-article bug in section 6. Noted in section 7 that the manual deploy path is now break-glass only, matching the updated `CLAUDE.md`. If this disagrees with notes from before 2026-08-12, this version is correct — the earlier ones described a bug that didn't fully exist and missed the one that did.
