# Post queue

> **Read this first. The site does NOT publish itself.**
>
> It used to. Under Cloudflare Pages, a daily cron fired a deploy hook, Pages
> rebuilt, and any post whose date had arrived went live with no button to push.
>
> **The Pages-to-Workers cutover removed that deploy hook and nothing replaced
> it.** `worker-cron/src/index.ts` says so in its own header: "The obsolete
> Pages deploy hook was removed after the Pages-to-Workers cutover." That worker
> now does exactly one job, the camps-quality sweep. Nothing rebuilds the site
> on a schedule.
>
> This file described the old behavior until 2026-07-28, which is how a week of
> finished content sat unpublished while the docs insisted it would ship itself.

This file is the operator manual. It now describes what actually happens.

---

## How publishing actually works today

Production is the Cloudflare **Worker** `parent-coach-desk`. It ships one way:

1. Content lands on a branch (agents commit there; most cannot push).
2. Someone pushes the branch and opens a PR to `main`.
3. CI runs `npm run ci:release` on the `build-production` job.
4. The PR merges to `main`, triggering `.github/workflows/deploy-workers.yml`.
5. Staging deploys, smoke tests run.
6. **A human approves the protected `production` environment.**
7. Production deploys, smoke tests run, auto-rollback on failure.

Step 6 is a deliberate gate, not an accident. It is also why there is no such
thing as automatic publishing right now: nothing reaches the live site without a
person clicking approve.

There is no local deploy command for this repo. `wrangler pages deploy … parent-coach-playbook`
targets a RETIRED Pages project, reports success, and does not touch the live
site (confirmed 2026-07-22). Do not use it.

---

## What future-dating still does, and what it does not

`src/lib/publishFilter.ts` is still the single gate. `isLive(data)` returns true
only when `!draft && publishedAt <= now`, and every listing page, static path
generator, RSS feed, sitemap, and the search index calls it.

**Still true:** a future-dated post is excluded from the build. Date something
for next Friday and it will not appear until a build runs on or after that date.

**No longer true:** that a build will run on that date. Builds happen only on a
deploy. If nobody merges and approves between now and then, the post never
appears, and nothing reports that it is overdue.

Future-dating is now a *filter*, not a *scheduler*. Read it as "not before this
date" rather than "on this date."

**Practical consequence for the agents:** Ed dates evergreen pieces
`publishedAt: today` precisely so they are immediately eligible. That is correct
under the current model. Anything dated forward is parked until a human ships a
build after that date.

---

## Queue a post

1. Write the post in `src/content/articles/your-slug.md` like normal.
2. Set `publishedAt` to the earliest date it may appear.
3. Set `draft: false` when it is ready for the world (Penny does this after review).
4. Commit. Agents use `sh scripts/safe-commit.sh "message" path/one path/two` —
   plain `git commit` hangs on this repo's Windows mount.
5. Push the branch, open a PR to `main`, merge, approve `production`.

```yaml
---
title: "What you say in the *first 90 seconds* shapes the next week"
dek: "Under 15 words."
phase: "drive-home"
sport: "baseball"
age: "8-10"
publishedAt: 2026-06-13     # earliest date it may appear
draft: false
---
```

A post with `draft: true` never publishes regardless of date.

---

## Check whether the live site is behind

This is the check that would have caught the July 21-to-28 gap. From the repo root:

```powershell
node scripts/check-publish-queue-drift.mjs
```

It compares every locally date-eligible piece against the live sitemap and
prints anything that should be on the site but is not, with how long it has been
waiting. Exit code 1 when drift is found, so it can be wired into a scheduled
job or run before opening a PR. Add `--json` for machine-readable output.

---

## Do you want automatic publishing back?

A real decision, not a bug to fix, because it trades directly against the
protected production gate you deliberately put in place.

**Option A: leave it manual.** Content ships when you merge and approve. Honest,
already true, no new machinery. The cost is that finished work sits until you
remember, which is exactly what just happened for a week.

**Option B: scheduled build, still gated.** Add a `schedule:` trigger that
dispatches `deploy-workers.yml` against `main`. Staging deploys automatically,
production waits at the gate. Turns "remember to ship" into "approve the daily
run." Cheap, keeps the gate, but produces a prompt every day whether or not
anything is queued, which invites rubber-stamping.

**Option C: scheduled build, drift-triggered.** Same as B, but a daily job runs
`check-publish-queue-drift.mjs` first and dispatches only when the live site is
actually missing eligible content. No noise on days with nothing to ship. Still
stops at the production gate.

**Option D: remove required reviewers from the `production` environment.** True
hands-off publishing, the old Pages behavior restored. Also removes the human
check in front of every production deploy, code included, not just content. Not
recommended without splitting content deploys from code deploys first.

C is the closest thing to the old experience without giving up the gate.

---

## What can go wrong

**Content is committed but not live.** Almost always the branch was never merged
to `main`. Agents commit to a working branch and most cannot push (no git
credentials in their sandbox). Run `git log origin/main..HEAD --oneline` to see
what is stranded. By far the most common cause.

**A post's date passed and it still is not up.** No build has run since that
date. Nothing schedules builds anymore. Merge and approve, or run
`check-publish-queue-drift.mjs` to confirm what is waiting.

**A post built but did not appear on the homepage.** The homepage surfaces the
freshest few; the post is probably live at its real URL, just below the fold.
Check `/reads/`. Note that homepage ordering uses `freshnessDate()`, which
prefers `editorial.jeffReviewedAt` or `claudeReviewedAt` over `publishedAt`, so
a re-reviewed old post can outrank a genuinely new one.

**Two posts dated for the same day.** Both publish. No one-a-day spacing is
enforced. Deliberate.

**Anything referencing a Pages deploy hook, `npm run secret:hook`, or the
`parent-coach-playbook` Pages project.** Retired. If you find such a reference
in another doc it is stale, and worth fixing there rather than working around.
