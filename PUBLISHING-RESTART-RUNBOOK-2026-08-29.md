# Publishing restart runbook, 2026-08-29

**What this fixes:** parentcoachdesk.com has published nothing new from either content lane since 2026-08-21,
and the automatic deploy rail has been dead since 2026-08-19. Five articles were cleared out of the editorial
backlog today and are sitting in your local clone unpushed. This runbook ships them and repairs the three
things that will stop the next batch if they stay broken.

Everything here needs credentials that live on your machine. Run it from PowerShell, in order. Steps 1 and 2
are the ones that get today's articles live; steps 3 through 6 are what stop this from happening again in a
week.

---

## What is actually wrong, in one paragraph

Cloudflare Workers Builds last shipped a commit on **2026-08-19** (`cc4b4d77`). It has not fired since. The
only reason the site is current at all is that someone ran a break-glass local `wrangler deploy` on 08-27,
which landed `0ae2dcd0` and is why `/build-info.json` says `builtBy: "local"`. That deploy went out **one
commit behind** `origin/main`, so the BabyLoveGrowth quarantine fix (`05b81759`) has never reached production.
Meanwhile Dana has held nine consecutive nights, and on 08-27 and 08-28 she ran and left no commit and no
hold-state entry at all, which is the same silent-death signature as the 08-17 to 08-25 blackout when Ed and
Penny fired nightly and produced nothing. Dana already diagnosed that one herself: `git status` hangs
indefinitely on this mount with `core.preloadIndex` at its repo default.

---

## Step 0: clear the stale git lock that is killing tonight's runs

There is a zero-byte `.git/HEAD.lock` sitting in the repo right now, timestamped **2026-08-28 21:27**. That is
the exact minute Penny's last commit landed (`86b6acdf`, Fri Aug 28 21:27:22). She left it behind.

That lock is almost certainly why Dana produced nothing at 11 PM on 08-28: no commit, no hold-state update,
no trace. It is still there, so tonight's Ed, Penny, and Dana runs will hit the same wall. `reports/ops/stale-locks.log`
shows this is chronic, not a one-off: locks were cleared on 08-27, twice on 08-28, and twice more at 04:17
and 04:20 UTC on 08-29, one of them 12.8 hours old.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"
npm run git:unlock
```

Do this before anything else in this document. Do step 5 as well, in the same sitting: the lock thrashing and
the `core.preloadIndex` hang are the two halves of why agents have been dying without leaving a message.

---

## Step 1: verify the content build, then push

Five files changed today (`src/content/articles/`), plus `editorial-queue.md` and a new
`scripts/check-voice-rubric.mjs`. **The build was never verified**, because the sandbox that made these edits
cannot run it: `node_modules` here holds Windows-native binaries (`lightningcss.linux-x64-gnu.node` is
missing on Linux). You are the first machine that can prove these files compile.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"

# The new rubric checker should report 5/5 clean.
node scripts/check-voice-rubric.mjs `
  src/content/articles/making-it-fun-for-everyone-when-your-own-kid-is-struggling.md `
  src/content/articles/the-kid-on-your-team-who-is-mean-to-your-kid.md `
  src/content/articles/is-fall-ball-worth-it.md `
  src/content/articles/fall-ball-softball-whats-different.md `
  src/content/articles/when-the-cuts-list-goes-up.md

# The real gate: does it build.
npm run build:production
```

**Stop if the build fails.** The likely failure is a content-collection schema error in one of the five
frontmatter blocks. Fix it before going further; nothing below helps if the build is broken.

```powershell
# Manifest name assertion. MUST print parent-coach-desk, not parent-coach-desk-staging.
(Get-Content dist\server\wrangler.json -Raw | ConvertFrom-Json).name

# The tree is dirty with other agents' unstranded output, not just today's editorial work.
# Look before you sweep: 21 entries, and only 6 of them are this backlog clearance.
git -c core.preloadIndex=false status --short
```

Today's editorial work is these seven paths. Commit them on their own so the change is readable later:

```powershell
git add editorial-queue.md scripts/check-voice-rubric.mjs PUBLISHING-RESTART-RUNBOOK-2026-08-29.md `
  src/content/articles/making-it-fun-for-everyone-when-your-own-kid-is-struggling.md `
  src/content/articles/the-kid-on-your-team-who-is-mean-to-your-kid.md `
  src/content/articles/is-fall-ball-worth-it.md `
  src/content/articles/fall-ball-softball-whats-different.md `
  src/content/articles/when-the-cuts-list-goes-up.md

git commit -m "Clear the editorial backlog: publish 4, schedule 1, add the voice-rubric checker"
```

The rest of the dirty tree is other agents' held output: Donny's Minnesota worklist under
`buildout/hit-rate-test/out/`, Arnie's `reports/affiliate/DEPLOYED_2026-08-27.md` and `-28`, the 08-27 camps
review, and `reports/ops/stale-locks.log`. Unstranding those in a second commit is the normal move here (commit
`46603379` did exactly this on 08-17), and leaving them is what keeps tripping Dana's dirty-tree guard on
arrival.

One untracked file deserves a look before you decide: **`src/pages/api/admin/babylove/reconcile.ts`**, an admin
route for triggering BabyLoveGrowth reconciliation by hand that has never been committed. Given reconciliation
has been dead for seventeen days, that route is either the manual kick you want in step 4 or dead code. Read
it before committing or deleting it.

```powershell
git add -A
git commit -m "Unstrand held agent output: discovery worklist, affiliate reports, camps review, lock log"
git fetch origin
git log --oneline origin/main..HEAD    # expect your new commits plus the 2 already local
git push origin main
```

After the push, `origin/main` carries everything. **Do not run `wrangler deploy` yet.** Step 2 decides whether
you need to.

---

## Step 2: fix Workers Builds, the actual root cause

This is the step that matters most. Everything else is a symptom of this.

Go to the Cloudflare dashboard: **Workers & Pages → parent-coach-desk → Settings → Build**.

Check, in this order:

1. **Is the GitHub connection still authorized?** A revoked or expired GitHub App installation is the most
   common cause of builds silently stopping rather than failing. There is no failed build to look at in that
   case, which matches what you are seeing: the build history simply ends on 08-19.
2. **If the connection is live, look at the build history.** If builds are firing and failing, read the last
   failed log. A failing build shows up in the list; a disconnected repo does not.
3. **Check the production branch is still `main`** and the build command and output directory match what
   `npm run build:production` produces.

Once it is reconnected, push an empty commit and watch it fire:

```powershell
git commit --allow-empty -m "Trigger Workers Builds after reconnect"
git push origin main
```

Then confirm the build actually shipped, rather than trusting a green checkmark:

```powershell
# Wait a few minutes, then:
curl https://parentcoachdesk.com/build-info.json
```

You want `builtBy: "workers-builds"` and a `commit` matching `git rev-parse HEAD`. **`builtBy: "local"` means
it did not work.**

### If you cannot get Workers Builds back today

Fall back to one manual deploy so today's articles and the quarantine fix go live. This is break-glass, and it
is safe **only** because you pushed in step 1, so local and origin are identical:

```powershell
npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars --dry-run
npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars
```

Running this from a clone that is behind `origin/main` is what deleted BabyLoveGrowth articles in August. Never
run it without pushing first.

---

## Step 3: confirm the BabyLoveGrowth lane is unjammed

Once production is carrying `05b81759`, quarantined articles return `200` instead of a retryable `503`, which
lets BabyLoveGrowth's delivery queue advance past a stuck item instead of retrying it forever.

Here is what the receipts show, and why this matters. Deliveries ran near-daily from 08-01 to 08-21. Then
nothing for six days. Then on 08-27, one delivery arrived: a **retry of article 674263 from August 1**
(`usa-vs-usssa-bats`), which quarantined as `slug_collision` because that slug published back on 08-02. A queue
that resumes by re-sending its oldest item is a queue that backed up, not a provider that stopped writing.

Watch the next reconciliation tick (`:17` past every sixth hour UTC) to see the lane move:

```powershell
npm exec wrangler -- tail parent-coach-desk --format pretty
```

- `babylove_reconciliation_completed` means healthy. Check `listing_size`.
- `api_401` or `api_403` confirms the dead key in step 4.
- `babylove_reconciliation_unavailable` means a binding is missing.

---

## Step 4: rotate BABYLOVE_API_KEY, because you are flying blind

`BABYLOVE_API_KEY` is used only by reconciliation, and reconciliation has written **zero rows in seventeen
days**. Every receipt in `external_article_receipts` came in via `source: 'webhook'`. The code throws on a
non-2xx from the provider's list endpoint before it writes anything, which is exactly the zero-rows signature.

This is why you cannot answer the question that matters: did BabyLoveGrowth send articles you dropped, or did
they stop sending? Reconciliation is the only thing that reads their side. It has been dead since roughly
08-12, and the 08-12 runbook predicted this and it was never done.

```powershell
# Presence is not the question. Validity is. This just confirms it is still set.
npm exec wrangler -- secret list --config wrangler.production.jsonc

# Regenerate the key in the BabyLoveGrowth dashboard first, then:
npm exec wrangler -- secret put BABYLOVE_API_KEY --config wrangler.production.jsonc
```

After the next reconciliation tick, compare their published count against your receipt count. That number is
the honest answer to how many articles the outage actually cost.

---

## Step 5: stop the agents dying silently

Dana documented this and nobody acted on it. On this mount, `git status` hangs indefinitely (near-zero CPU,
90 seconds and counting) when `core.preloadIndex` is left at its repo-config default of `true`. Every agent
that shells out to git is exposed. That is the most likely explanation for the 08-17 to 08-25 blackout, and
for Dana producing nothing on 08-27 and 08-28.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"
git config core.preloadIndex false
git config --get core.preloadIndex   # expect: false
```

One line, permanent for this clone, and it is the cheapest fix in this document.

---

## Step 6: deploy the watchdog that should have caught all of this

`worker-cron/src/index.ts` has carried a `deploy_lag` / `deploy_lag_ok` monitor since the 2026-08-10 commit.
It compares `/build-info.json` against the tip of `main` and alerts once production has been behind for 12
hours. The live `parent-coach-playbook-cron` bundle has never contained it, because the worker was never
redeployed after that commit landed.

Production sat ten days stale and the alarm built to catch exactly that has never once run.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk\worker-cron"
npm exec wrangler -- deploy
```

A green `wrangler deploy` is not proof. Verify the live bundle actually contains the deploy-lag code, or watch
the next cron tick for `deploy_lag_ok`, before you trust the monitor.

---

## How to know the whole thing worked

Four checks. All of them have to pass together.

1. `https://parentcoachdesk.com/build-info.json` reports `builtBy: "workers-builds"` and your latest commit.
2. `https://parentcoachdesk.com/drive-home/when-the-cuts-list-goes-up/` loads.
3. `https://parentcoachdesk.com/game/parent-coach-ethics/` still loads. That is the BabyLoveGrowth article the
   local deploy lane used to delete. If it 404s, a local deploy clobbered origin again.
4. A new BabyLoveGrowth receipt appears in `external_article_receipts` with `status: 'published'` and a
   `provider_article_id` you have not seen before.

Check 4 is the one that proves the BabyLoveGrowth lane is genuinely alive rather than just quiet.

---

## The thing this runbook does not fix

**The revision loop has no worker.** Ed's task pulls a new topic every night. Penny bounces drafts to
`needs-revision`. Nothing routes a bounced draft back through Ed. That is why five pieces stacked up over
thirteen days and why three of them sat in `ready-for-jeff` with nobody telling you they were there.

Two changes close it, and neither is in this runbook because they are edits to the scheduled tasks, not
commands to paste:

1. Ed's `pcd-editorial-writer` skill should work the `needs-revision` queue **before** drafting anything new,
   the way Penny's already prioritizes re-reviews over fresh drafts.
2. Penny's `pcd-review-publish` skill should surface the `ready-for-jeff` count in its Slack summary, and
   escalate anything sitting in that state more than three days. A hold that nobody sees is a hold that
   becomes a stale article, which is exactly what happened to the football-forms piece: it died waiting on a
   five-word sentence-rhythm quibble while its August 19 hook expired.

Both tasks should also run `node scripts/check-voice-rubric.mjs` instead of reading for the mechanical items.
Those are arithmetic, and three review rounds were spent on arithmetic a script does in 40 milliseconds.
