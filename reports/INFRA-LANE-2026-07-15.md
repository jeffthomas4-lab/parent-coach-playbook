# Infra and data lane, 2026-07-15

**Scope:** audit items P0.1 (deletion monitor), P0.2 (dormant cron), P1.6 (D1 identity, Open Item 6), P1.9 (backup clock, Open Item 10).
**Method:** every claim below was checked against live Cloudflare (Workers API, both D1 databases, the live site) rather than against the local repo. Where the audit and the live account disagreed, the account won. Three audit findings turned out to be wrong; they are corrected here.

---

## Headline

The two P0 items were both real, and both had a different root cause than the audit assumed.

The deletion monitor was not canary-paused. It tripped its account guard, which means it is blind rather than broken, and re-enabling it alone does not fix it.

The cron is not sweeping a dead database. It is not sweeping at all, and the database it would sweep is the live one.

---

## 1. Deletion monitor (P0.1)

### What I found

Not a CANARY auto-pause. There is exactly one failure row in `agent_runs`, on 2026-07-14:

```
run_id  6e7425ea-a8d7-4370-ad84-b4ba9a9265c3
status  failed
error   account guard: connected to pugetsound.edu, not the portfolio inbox
```

The agent's STEP 0 account guard did its job perfectly. The connected Gmail is the university coaching inbox, not the portfolio inbox `jeff@coachjeffthomas.com` that `support@parentcoachdesk.com` forwards into. The agent refused to read a single message and stopped, which is exactly right and is a locked constitutional rule.

The CANARY rule also could not have fired. It needs two failures in 24 hours; there was one. The task was switched off by hand.

### The finding under the finding

The guard fired loudly and then whispered. It wrote `status=failed` but left `needs_you` at its default of 0, so Barnabus's morning briefing never surfaced it. Nothing was watching a legal 30-day SLA, and nothing said so.

That is the actual defect. A guard that stops the agent but does not escalate converts a safety feature into silence.

### What re-enabling does and does not do

I re-enabled it. It is armed for 2026-07-16 14:03 UTC and `agent_registry.status` is back to `active`.

It will still trip the guard every morning until the Gmail connection is changed, because the guard is correct and I did not weaken it. What changes is that each trip now writes `needs_you = 1` with an explicit high-urgency item naming the fix, so it nags daily in the briefing instead of dying quietly. A daily loud failure is the correct state for a compliance agent that cannot see its inbox. It is strictly better than a disabled task, which is invisible.

The SLA is still unwatched until Jeff connects the portfolio inbox. That is handoff item H1 and it is the only thing that actually closes P0.1.

---

## 2. The dormant cron (P0.2)

### What I found

The cron worker is deployed and its code is real. I pulled the deployed bundle for `parent-coach-playbook-cron` and diffed it against `worker-cron/src/index.ts`: identical. Last modified 2026-05-06.

The sweep endpoint is alive and correctly configured. A POST to `https://parentcoachdesk.com/api/cron/camps-sweep` with no key returns `{"ok":false,"error":"forbidden"}` and HTTP 403. That 403 matters more than it looks: the route checks `if (!env?.DB)` and returns a 500 `database not available` *before* it checks the key. Getting a 403 rather than a 500 proves the D1 binding on production is present and healthy.

So the endpoint works, the worker exists, and the sweep still has not run since 2026-05-09.

### Why

Two independent cron paths both call the same endpoint, and neither is confirmed working:

| Path | Schedule | State |
|---|---|---|
| `parent-coach-playbook-cron` worker | 13:00 UTC daily | Fires, but silently skips the sweep if `CRON_KEY` or `SWEEP_URL` is unset on the worker. Not readable without Jeff's CLI. |
| `.github/workflows/camps-sweep-cron.yml` | 09:17 UTC daily | Gets a 403 every day. `SECURITY-AUDIT.md` confirms the GitHub Actions repo secret `CRON_KEY` is unset. |

The GitHub path is loud but nobody reads the Actions tab. The worker path is silent by construction. Between them the sweep has been down about nine weeks with no signal.

### The freeze is on the live database, not the legacy one

The audit guessed the cron was "either dead or sweeping a dead database." It is the first, and the damage is on the live data:

```
activity-radar, approved and future programs
  total                658
  ever URL-checked     104
  never checked        554
  last check           2026-05-09T22:18:02Z
```

554 approved listings have never had their URL checked. Dead links are being served to parents right now. Repointing the sweep at a different database was not the fix, because it was already pointed at the right one.

### What I changed

`worker-cron/src/index.ts` rewritten so nothing fails quietly:

- Missing `CRON_KEY` or `SWEEP_URL` throws with a message naming what is missing and how to set it. It no longer returns.
- A non-2xx from the sweep throws. A 403 adds an explicit key-mismatch hint, since that is the likeliest cause.
- A 200 carrying `ok:false` throws. Previously any response at all was logged as fine.
- `approved_future_count === 0` throws, repeating the blackout alarm where the scheduled failure is visible.
- The `scheduled` handler now awaits its work instead of using `ctx.waitUntil`. This one is easy to miss: `waitUntil` detaches the promise from the handler, so a rejection inside it never marks the run failed. Every throw above would have been swallowed if this line had stayed.
- `fireDeploy` returns a 502 Response rather than throwing, because the fetch handler needs a Response. On the cron path that resolved and counted as healthy, so a failing deploy hook also showed green. It is now wrapped so a bad deploy fails the invocation too.
- Both jobs run via `Promise.allSettled`, so a broken sweep never cancels the deploy, and either failure fails the run.

`worker-cron/wrangler.toml`:

- `SWEEP_URL` moved from a secret to a plain var, pinned to the production endpoint. It is a public URL and was never a secret. Making it one meant an unset value silently disabled the sweep, which is half the bug.
- Added `[observability] enabled = true`, since throwing is only useful if the logs are on.

`worker-cron/package.json`: removed the `secret:sweep` script, which now sets a value that config overrides. Added `secret:list`.

`worker-cron/README.md`: documented the failure policy, the config split, and the two-cron-paths problem.

Typecheck passes clean against `@cloudflare/workers-types` (tsc 5.9.3, exit 0).

### Recommendation: kill one of the two cron paths

Keep the worker, delete `.github/workflows/camps-sweep-cron.yml`. The worker already owns the deploy hook, needs no GitHub secret, and survives the Pages to Workers migration. Running both means sweeping twice a day; the sweep is idempotent so it is waste rather than damage, but two half-configured paths is how this went unnoticed for nine weeks.

I did not delete the workflow. It sits in `.github/`, outside my lane, and it is one line of Jeff's judgment.

---

## 3. D1 identity conflict, Open Item 6 (P1.6)

### The conflict does not exist

Open Item 6 reads: "`wrangler.jsonc` binds `activity-radar`; Deployments.md targets `parent-coach-playbook`."

Those are two different kinds of name. `wrangler.jsonc` binds a **database** called `activity-radar`. Deployments.md's `--project-name parent-coach-playbook` names the **Cloudflare Pages project**, which is not a database. Both are correct and always were. The item was a category confusion, not a conflict.

### The audit's claim that production points at the legacy DB is wrong

Verified three ways:

1. **Schema.** The legacy `parent-coach-playbook` D1 has the retired flat `camps` table and no `organizations` or `programs` table. `activity-radar` has `organizations` and `programs` and no `camps` table. They are mutually exclusive shapes.
2. **Code.** Every camps query in `src/lib/camps-db.ts` reads `programs` and `organizations`. Against the legacy DB every camps page would throw `no such table: programs`. The site would be down, not stale.
3. **Live proof.** Program slug `eastlake-lacrosse-association-sammamish-wa-1425-boys-and-girls-youth-lacrosse-summer-camp-2026-07-20` was created in `activity-radar` on 2026-07-14, five weeks after the legacy DB froze, and exists in no other database. `https://parentcoachdesk.com/camps/<that slug>/` returns **HTTP 200**.

The live site reads `activity-radar`. The binding is right. **No change to `wrangler.jsonc` was needed and none was made.**

An early check nearly misled me here: four slugs sampled off the live `/camps/` index exist in *both* databases, because the legacy DB is a pre-fork copy. Overlapping rows prove nothing. Only a row created after the freeze date can tell the two apart.

### Retirement plan for the legacy database

Nothing needs migrating. Table by table, verified:

| Table | Legacy | activity-radar | Call |
|---|---|---|---|
| `camps` | 2,035 | table absent | Superseded by `programs`. Dead schema. |
| `camp_reviews` | 0 | 0 | Nothing to lose. |
| `camp_claims` | 0 | 0 | Nothing to lose. |
| `org_suggestions` | 0 | 0 | Nothing to lose. |
| `submitters` | 3 | 0 | All three are Jeff's own bulk-import accounts. No third-party data. |
| `geocoded_addresses` | 432 | 1 | Cache. Rebuildable. See below. |
| `domain_quality` | 12 | 0 | Discovery tuning heuristic. Rebuildable. |
| `search_domains` | 52 | 0 | Discovery tuning heuristic. Rebuildable. |

Two things worth stating plainly. No user-contributed content is stranded, since reviews, claims and suggestions are all empty. And no personal data is trapped outside the DATA-MAP's named home: I masked and checked all three `submitters` rows and they are `je***@pugetsound.edu` (288 submissions), `je***@gmail.com` (1), and `pa***@gmail.com` (2,430). Those are Jeff's import accounts, not members of the public. If any had been a real parent, this would have been a privacy finding and a deletion-SLA problem, because the deletion monitor only searches `activity-radar`.

On the 432 cached geocodes: they are migratable. The legacy key is a SHA-256 hash with the plaintext in `address_canonical`, and `activity-radar` keys on that same plaintext (`address_key`, for example `1500 n warner st|tacoma|WA|98416`), so `INSERT OR IGNORE ... SELECT address_canonical, latitude, longitude, cached_at` would work.

I am recommending against it anyway. It is a cache, the pipeline already refills it on its own (the one row in `activity-radar` was geocoded 2026-07-14), and the sampled address was already present. Migrating it means writing and testing a cross-database transfer to save a few hundred Nominatim calls the pipeline makes for free. `scripts/backfill-geocode.mjs` already exists if it is ever wanted.

Recommended sequence, all Jeff's calls, none taken:

1. Export a final snapshot of the legacy DB (handoff H4). Do this before anything else touches it.
2. Leave it in place, untouched, for a soak period. It costs nothing and it is the only rollback if a claim above is wrong.
3. Delete after the soak, once the backup clock has cleared and the sweep is confirmed running. **Deletion is gated to Jeff. I did not delete anything.**
4. Retire `migrations/` (the legacy folder) in favor of `migrations-activity-radar/`, per the retirement rule. Not done; the folder is shared and it is a separate call.

Open Item 6 is updated in `PCD-OPERATING-MANUAL.md` with all of the above.

### Correcting a third audit finding

The audit says the sweep alert message "references tables that don't exist (copy-paste drift from ActivityRadar)." It does not. The message reads "Check pcd_status on the programs table," and I confirmed `programs` exists in `activity-radar` and carries a `pcd_status` column. The message is accurate against the database the route is actually bound to.

That finding was true when the app read the legacy DB, and it resolved itself when the app migrated. No fix needed, and none made. This is the one item in my scope that turned out to be a non-issue.

---

## 4. Backup clock, Open Item 10 (P1.9)

### The clock reads zero, not one

`agent_registry.pcd-backup.last_run_at` is null. No export has ever run.

The script header said "Run 1: tonight, 2026-07-13" and the operating manual's log says the same. That was a plan. The 2026-07-13 session could not execute it, because the Cowork sandbox holds no Cloudflare credentials, and its own `agent_runs` row admits as much. The sentence has been read since as though the run happened.

So `org-discovery-daily-worklist` has written to `activity-radar` every night since with no backup, which is the exact risk Open Item 10 was opened to close.

### What I changed

The root cause is that the run count lived in a header comment. A comment records an intention and nothing checks it against reality.

`scripts/backup-activity-radar.ps1` now appends one row per clean run to `scripts/BACKUP-PROVING-LOG.md`, created on first run and git-tracked (unlike `backups/`, which is gitignored). Only a run that reaches the end, past the export and the size sanity check, is counted. The script prints which run it just logged and how many remain, and refuses to imply the gate is clear before three rows exist.

The header now states the count is zero and points at the ledger as the only count that governs.

`BACKUP.md`: added "Starting the clock" with the exact command, the Task Scheduler block for after the gate clears, and a corrected Layer 1 path (it pointed at the dead `parent-coach-playbook` folder).

`PCD-OPERATING-MANUAL.md`: Open Item 10 corrected to say the clock is at zero and why.

### I did not schedule it

Decision 6 says three manual runs first, and the gate is unmet at zero. Setting up the schedule now would be the same shortcut that produced the phantom run 1. The Task Scheduler command is written down in BACKUP.md and stays unrun until the ledger has three rows.

One caveat worth knowing before that schedule goes in: Task Scheduler only fires when the machine is on, so a closed laptop at 2 AM skips the backup and the miss looks identical to a success. D1 Time Travel (30-day point-in-time restore, no export, no dependency on this machine) is the stronger protection for the bad-write case and is already on. This script's real job is the offline dump Time Travel cannot give you.

---

## What I did not touch

- `src/pages/api/cron/camps-sweep.ts` and `src/lib/camps-db.ts`: read for evidence, not edited. `src/` belongs to another lane and is under active migration work.
- `.github/workflows/camps-sweep-cron.yml`: recommended for deletion, not deleted.
- `wrangler.jsonc`: verified correct, deliberately unchanged.
- No database rows deleted. No email sent. No deploy. No git commands.

## A note on method

The bash sandbox mounts a snapshot taken at session start and does not see edits made through the file tools. My first typecheck ran against the pre-edit file and reported a syntax error at a line that is a comment in the current version. Anyone verifying this work through the sandbox will read stale files. The typecheck was rerun by reconstructing the worker inside the sandbox and passed clean.

---

## HANDOFF: what only Jeff can do

**H1. Connect the portfolio inbox to `pcd-deletion-monitor`. This is the only thing that closes P0.1.**
The task is re-enabled and will fail loudly every morning at 07:04 until this is done. It needs the Gmail connection for `jeff@coachjeffthomas.com` (where `support@parentcoachdesk.com` forwards), not `jeffthomas@pugetsound.edu`. Do not work around the account guard; it is correct. Until this lands the 30-day SLA is unwatched, and it has been since at least 2026-07-14.

**H2. Check what secrets the cron worker actually has.** I cannot read Worker secrets.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk\worker-cron"
npm install
npm run secret:list
```

Expect `DEPLOY_HOOK_URL`, `MANUAL_TRIGGER_KEY`, `CRON_KEY`. If `CRON_KEY` is missing, that is the nine-week silent skip, and the new code turns it into a red run instead. If `SWEEP_URL` is listed, it is now harmless and overridden by the var; remove it if you like.

**H3. Make the cron worker's `CRON_KEY` match the site's.** `SECURITY-AUDIT.md` confirms `CRON_KEY` exists as a Pages secret but the value was never printed, so I cannot tell whether the worker's copy matches. If they disagree the sweep gets a 403, which now throws. Simplest path is to rotate both together to one new value you generate:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
npx wrangler pages secret put CRON_KEY --project-name parent-coach-playbook
cd worker-cron
npx wrangler secret put CRON_KEY
```

Then either set the GitHub secret to the same value or delete the workflow (see the recommendation above):

```powershell
gh secret set CRON_KEY --repo jeffthomas4-lab/parent-coach-playbook
```

**H4. Snapshot the legacy DB before it is retired.** One command, and it is the prerequisite to ever deleting it:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
npx wrangler d1 export parent-coach-playbook --remote --output "backups\d1\LEGACY-parent-coach-playbook-final-2026-07-15.sql"
```

**H5. Start the backup clock. Three runs, three separate days.**

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
.\scripts\backup-activity-radar.ps1
```

Run it today, then on two more days. The script logs each run to `scripts\BACKUP-PROVING-LOG.md` and tells you the count. The runs must be on different days to be worth anything: three in one afternoon prove the script works, not that it survives a fresh shell or an expired wrangler session, which is the failure the gate exists to catch. Do not schedule it until the ledger shows three rows.

**H6. Decide the two cron paths.** Keep the worker, delete `.github/workflows/camps-sweep-cron.yml`. My recommendation, your call, one line.

**H7. Verify the sweep after the next deploy.** Once `CRON_KEY` is confirmed and the worker is redeployed:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk\worker-cron"
npm run tail
```

Trigger the cron from the Cloudflare dashboard. Healthy looks like `camps sweep ok:` and a JSON body. Anything else now throws and shows red. Then confirm the freeze has broken:

```sql
SELECT COUNT(*) AS approved_future,
       SUM(CASE WHEN url_last_checked_at IS NOT NULL THEN 1 ELSE 0 END) AS ever_checked,
       MAX(url_last_checked_at) AS last_check
FROM programs
WHERE pcd_status = 'approved' AND session_end_date >= date('now');
```

Baseline as of today: 658 approved and future, 104 ever checked, last check 2026-05-09. `last_check` moving off May 9 is the proof that P0.2 is actually closed. Expect it to climb slowly; the sweep caps at 25 URLs per run, so 554 unchecked listings take about three weeks to work through.

**Not blocking, worth knowing.** `https://parentcoachdesk.com/camps/pro-football-camp-colorado-spgs-co-5884-profootballcamp/` returns HTTP 500. Its `session_end_date` is null, which the sibling row (dated 2027-06-23) has set. Likely a null-date crash on the detail page, hit while proving the D1 binding. Not my lane and not in scope, but it is a live 500 on a real listing and belongs to whoever owns `src/`.
