# Competitor intelligence runbook

Operator guide for the competitor intelligence subsystem in `src/lib/intel/`. Written for Jeff to run this himself.

## 1. What it does

The system fingerprints a youth sports organization's public website to figure out which club-management, registration, payments, streaming, or communications software that organization already runs. It stores the result against the organization's existing row in the `activity-radar` D1 database, in a new `org_tech_stack` table keyed to the same `organizations.id` every other Parent Coach Desk feature already uses.

Every change to that belief gets logged in `org_tech_history`, so you can see when an org first showed up on a competitor's platform, when it switched, or when a human confirmed or rejected a detection. A scoring pass turns the detected stack plus what the directory already knows about that org (program count, age span, site freshness) into one priority number, so you know who to call first.

## 2. Policy, stated plainly

A prospect organization's own website gets crawled on the scheduled sweep. A competitor's own website never gets fetched by an automated run, full stop. This is enforced in code, not just in this doc: `policyFromEnv()` in `config.ts` always returns `allowCompetitorProperties: false`, and the only code path that can flip it to `true` is `runApprovedRun()` in `pipeline.ts`, which only runs after a human has approved that specific run.

Fetching a competitor's own property at all, meaning SportsGravy's marketing site, a competitor's product SPA, or anything on a competitor's canonical domain or subdomain, requires a `competitor_property` run type. That run has to be proposed through `POST /api/admin/intel/runs`, then approved through a separate call to `POST /api/admin/intel/runs/:id/approve`. Two different admin actions, every time, no exceptions, no auto-approval anywhere in the code.

Every fetch this system makes, prospect or (if ever approved) competitor, follows the same rules:

- Obeys `robots.txt`, checked at most once a day per domain, and treated as disallowed on any ambiguous or failed check.
- Runs at 6 requests per minute per domain, set in `config.ts`.
- Uses conditional requests (`If-None-Match` / `If-Modified-Since`), so an unchanged page costs the target site a 304, not a full re-download.
- Never stores raw HTML. `org_tech_signals.matched_value` holds a truncated evidence snippet, capped at 500 characters in app code (`MAX_MATCHED_VALUE_LENGTH` in `src/lib/intel/types.ts`), never the page itself.
- Refuses to run at all without a real, contactable identity in the User-Agent and operator contact vars. See the setup section below.

## 3. First-time setup

Do these in order.

### Apply the migration

`migrations-activity-radar/0016_competitor_intelligence.sql` creates eight new tables: `competitors`, `org_tech_signals`, `org_tech_stack`, `org_tech_history`, `intel_runs`, `intel_review_queue`, `org_opportunity_scores`, `intel_fetch_log`. It is additive only. No existing table is touched.

This is a production database migration. Take a current backup before you run it. See `BACKUP.md`: D1 Time Travel gives you 7 to 30 days of point-in-time recovery depending on plan, but a fresh independent export is still the right habit before any schema change. The exact command is in the PowerShell block at the end of this doc.

### Set the three Worker vars

Read out of `src/lib/intel/config.ts`, exact names, do not guess these.

| Variable | What it's for | What a good value looks like |
|---|---|---|
| `INTEL_USER_AGENT` | Identifies the crawler in every outbound request's `User-Agent` header. `fetchPublicPage()` refuses to run at all if this is empty. The code will not send an unidentified bot at someone else's server. | Something a site owner can actually recognize and look up, e.g. `ParentCoachDeskBot/1.0 (+https://parentcoachdesk.com/about)` |
| `INTEL_OPERATOR_CONTACT` | A real way for a site owner to reach you if the crawler is doing something they don't like. Also required for `fetchPublicPage()` to run. | A real URL or mailto a site owner could use, e.g. `mailto:support@parentcoachdesk.com` or `https://parentcoachdesk.com/contact` |
| `INTEL_SWEEP_ENABLED` | The on/off switch for the scheduled cron sweep. Checked with a strict `=== 'true'` string comparison in `isFeatureEnabled()`. Anything else, including unset, is off. | `true` once you're ready for the cron to run unattended. Leave unset for the first manual pass. |

None of these three are currently declared in `wrangler.production.jsonc`'s `secrets.required` list. That list only checks `AGENT_RUNS_TOKEN`, `BULK_IMPORT_TOKEN`, `CRON_KEY`, `GITHUB_TOKEN`, `BABYLOVE_API_KEY`, `BABYLOVE_WEBHOOK_TOKEN`. Wrangler will not stop a deploy if you forget one of the intel vars. The code just fails closed at runtime instead: no user agent or contact means every fetch returns `policy_incomplete` and nothing happens. Set them anyway before you expect the sweep to do anything.

### Seed the competitors table

Run `migrations-activity-radar/seed/0001_seed_competitors.sql` with `wrangler d1 execute --file`, never `migrations apply` (see that file's own header). This gives you a full catalog of the platforms you track for the admin filters, even though only SportsGravy has real detection patterns today.

### First manual run, then turn on the sweep

Leave `INTEL_SWEEP_ENABLED` unset (or `false`) for your first pass. Go to `/admin/intel`, click "Propose org_sweep run," then approve it. Watch the run finish and check the review queue and detected stack before you trust the pipeline.

Once you're satisfied, set `INTEL_SWEEP_ENABLED=true` so the cron (`src/worker.ts`'s `scheduledReconciliationAndIntelSweep`) picks it up automatically on every tick.

## 4. Day-to-day operation

The admin page is `/admin/intel`, gated the same way every other admin route is: Cloudflare Access, `requireAdmin`, allowlist.

- **Summary tiles**: orgs with a detected stack, pending review count, signals in the last 30 days, last run time, plus a chip per competitor showing how many orgs are on it.
- **Review queue**: detections that scored between `REVIEW_CONFIDENCE` (25) and `AUTO_ACCEPT_CONFIDENCE` (60), or that came back flagged for some other reason. See the confidence model below. Each row shows the org (or "Unmatched organization" if the crawler couldn't tie the domain to a directory record), the domain, the competitor guess, the category, the confidence, why it landed here, and the raw evidence signals behind the score. Accept or reject it.
  - **Accept** promotes the detection into `org_tech_stack` with `status = 'confirmed'`, writes a `confirmed` row to `org_tech_history`, and marks the queue row resolved. A confirmed row is protected: a later sweep can log what it sees in history, but it can never downgrade or overwrite a human's confirmed or rejected verdict.
  - **Reject** marks the queue row `rejected` and leaves `org_tech_stack` untouched. It does not write a `rejected` status into `org_tech_stack` itself. There is no live path in the current UI that does; see the "not built yet" list below.
- **Detected stack**: everything that's either auto-accepted (confidence 60 or above) or that you've confirmed by hand, filterable by competitor and state, sortable by confidence.
- **Runs**: every sweep or crawl job, proposed through complete. Propose a fresh `org_sweep` run here if you don't want to wait for the cron. A `competitor_property` run shows a warning before you approve it, since approving it starts a real crawl of a competitor's own site.

## 5. The confidence model

Exact thresholds, from `src/lib/intel/config.ts`:

- **60 and above (`AUTO_ACCEPT_CONFIDENCE`)**: writes straight to `org_tech_stack` with `status = 'detected'`. No human touches it unless you go confirm it later from the Detected stack table.
- **25 to 59 (`REVIEW_CONFIDENCE` up to just under `AUTO_ACCEPT_CONFIDENCE`)**: lands in `intel_review_queue` as `status = 'pending'`. Nothing changes in `org_tech_stack` until you accept or reject it.
- **Below 25**: logged as a signal row in `org_tech_signals` only. No stack write, no review queue entry. The evidence exists if you ever want to dig into why a domain scored low, but nothing acts on it.

A detection can also land in the review queue instead of auto-accepting even above 60, in one case: if the crawler couldn't match the domain to an organization already in the directory (`org_unmatched`), it always goes to review, regardless of confidence, since there's no `org_id` to write a stack row against.

## 6. How to add a competitor

Adding a new platform is one new file plus one array entry. Nothing else in the engine changes.

1. Create `src/lib/intel/competitors/<id>.ts`, modeled on `sportsgravy.ts`. It exports one `CompetitorDefinition`: an `id` (slug), `displayName`, `canonicalDomain`, `category`, `migrationDifficulty`, a `patterns` array, and an optional `negativePatterns` array.
2. Add it to `COMPETITOR_DEFINITIONS` in `src/lib/intel/competitors/index.ts`. One import, one array entry.
3. Nothing else. `syncCompetitorCatalog()` upserts it into the `competitors` table automatically the next time a sweep runs, or when someone hits `POST /api/admin/intel/competitors`.

Worked example, shape only, weights realistic for the pattern class:

```ts
export const acmeClub: CompetitorDefinition = {
  id: 'acmeclub',
  displayName: 'AcmeClub',
  canonicalDomain: 'acmeclub.com',
  category: 'club_management',
  migrationDifficulty: 'medium',
  patterns: [
    {
      id: 'acmeclub.script.asset-domain',
      type: 'script_src',
      category: 'website',
      match: { kind: 'substring', value: 'assets.acmeclub.com' },
      weight: 45, // an asset served FROM a competitor-owned domain is near conclusive
      note: 'Verified 2026-08-06 via curl: acmeclub.com serves its widget JS from this exact host.',
    },
    {
      id: 'acmeclub.html.powered-by',
      type: 'html_text',
      category: 'website',
      match: { kind: 'regex', value: 'powered\\s+by\\s+acmeclub', flags: 'i' },
      weight: 30, // a "powered by" footer credit is strong, not conclusive on its own
      note: 'Verified against a real customer site footer.',
    },
    {
      id: 'acmeclub.html.brand-mention',
      type: 'html_text',
      category: 'website',
      match: { kind: 'substring', value: 'acmeclub' },
      weight: 10, // a bare text mention is weak. Could be an article, a comparison page, anything.
      note: 'Deliberately weak. Pair with a negative pattern for editorial or comparison mentions.',
    },
  ],
  negativePatterns: [
    {
      id: 'acmeclub.neg.self-property',
      type: 'url_pattern',
      category: 'website',
      match: { kind: 'regex', value: '^https?:\\/\\/([a-z0-9-]+\\.)?acmeclub\\.com', flags: 'i' },
      weight: 80,
      note: 'Suppresses false-positive self-detection when crawling the competitor\'s own domain.',
    },
  ],
};
```

The weighting rule to keep repeating while you write patterns: an asset actually served from a competitor-owned domain (a script src, an asset URL) is near conclusive, so weight it high. A "powered by" footer credit or an app-store id specific to that vendor is strong, so weight it in the middle. A bare text mention of the vendor's name is weak on its own; it shows up in blog posts and comparison articles about as often as on a real customer page. Weight it low, and pair it with a negative pattern for editorial mentions if you can.

## 7. What is deliberately not built yet

- **No search-API discovery.** This is seed-and-fingerprint only. The sweep only ever looks at organizations already sitting in the `activity-radar` directory. It cannot find a new organization on its own. If an org isn't in the directory, the crawler will never see it.
- **No contact discovery.** The system does not go looking for who to call at an organization. That's a separate concern, handled (where it exists at all) by the `org_contacts` layer documented in `CONTACT-DATA-MAP.md`, not by this subsystem.
- **No outreach generation.** No draft emails, no call scripts, nothing that turns a high-priority score into an action. The opportunity score and its rationale are the whole output.
- **No CRM export.** Nothing here pushes to Notion, a spreadsheet, or any external system. Reading the admin page or querying D1 directly is the only way to get this data out today.
- **No change alerting beyond `org_tech_history`.** If an org switches platforms, the only record is a new row in that table. Nothing pings Slack or sends an email when a stack changes.

## 8. Troubleshooting

**The sweep ran (or the cron fired) and did nothing.** Check `INTEL_SWEEP_ENABLED` first. `runOrgSweep()` returns immediately, before touching D1, if it isn't exactly `'true'`. If that's set, check `INTEL_USER_AGENT` and `INTEL_OPERATOR_CONTACT`. Both empty means `policyFromEnv()` hands back an incomplete policy, and the sweep logs `org_sweep_skipped` with `reason: policy_incomplete` and stops before creating a run row at all.

**Everything is coming back `rate_limited`.** This is the 6-requests-per-minute-per-domain gate in `fetcher.ts` tripping. It's keyed off `intel_fetch_log`, checking the most recent fetch to that domain across any path. If a lot of orgs share one domain (a shared subdomain platform, a franchise with many location subdomains under one root), or a prior run touched the same domains very recently, you'll see a wave of these. Not a bug. Wait for the window to clear, or check `intel_fetch_log` directly for the domain in question to see when it was last hit.

**Everything is coming back `robots_disallowed`.** Two ways this happens. The site's real `robots.txt` actually disallows the path you're hitting, which is working as intended and nothing to fix. Or the robots fetch itself failed, a 5xx or a timeout or anything that isn't a clean 200 or a 404, which the code treats as disallowed on purpose, per the "ambiguous means no" rule in `fetcher.ts`. Check `intel_fetch_log` for that domain's `/robots.txt` row: `status_code` tells you which case you're in.

**A run is stuck in `running`.** This is almost always a Worker execution that didn't finish cleanly: a crash, or a timeout that killed the `waitUntil()` before `markRunStatus(..., 'complete', ...)` ran. Check `wrangler tail` or the log stream around the time the run started for an unhandled error. There's no automatic timeout or auto-fail on a stuck run today. If you find one, the honest fix is to look at what actually happened in the logs before deciding whether to mark it `failed` by hand against D1.

## 9. PowerShell commands

Apply the migration. This is a production D1 write; confirm a current backup exists per `BACKUP.md` before running it.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"
npx wrangler d1 execute activity-radar --remote --file=./migrations-activity-radar/0016_competitor_intelligence.sql
```

Seed the competitors catalog. Safe to re-run, uses `INSERT OR IGNORE`.

```powershell
npx wrangler d1 execute activity-radar --remote --file=./migrations-activity-radar/seed/0001_seed_competitors.sql
```

Set the three Worker vars on the production Worker.

```powershell
npx wrangler secret put INTEL_USER_AGENT --config wrangler.production.jsonc
npx wrangler secret put INTEL_OPERATOR_CONTACT --config wrangler.production.jsonc
npx wrangler secret put INTEL_SWEEP_ENABLED --config wrangler.production.jsonc
```

Sanity check after the migration and seed both land.

```powershell
npx wrangler d1 execute activity-radar --remote --command "SELECT id, display_name, status FROM competitors ORDER BY display_name;"
```
