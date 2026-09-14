# GSC Review, parentcoachdesk.com

**Date:** 2026-09-13
**Window:** last 7 days (Sep 5-11) vs prior 7 days (Aug 29-Sep 4)
**Prior file:** `reports/seo/gsc-review-2026-08-16.md` (four weeks back — no reports filed for 08-23, 08-30, or 09-06; the Sunday cadence has a gap worth someone checking)

## Takeaways

The camps directory has collapsed and nobody flagged it. Live count is 17 camps, 0 added in the last 30 days, only nine states with any listing at all (AZ, CA, CO, FL, GA, IL, MA, NC, WA). `sitemap-camps.xml` backs this up: 37 URLs discovered, down from 311 a month ago, and it hasn't been re-read by Google since Aug 28 while the main sitemap read fresh on Sep 6. Whatever fed this directory has been dry for a month.

The expired-camp redirect policy is broken as a result, not fixed. I pulled two live 404 examples from GSC's list and checked them by hand: an expired Pennsylvania camp and an expired Minnesota camp both redirect to their state hub (`/camps/pa/`, `/camps/mn/`) and both hubs return a real, confirmed 404 (checked the network response code directly, not just the rendered page). That's a regression, not a lag artifact: the 2026-08-16 report spot-checked this exact `/camps/mn/` URL and confirmed it resolved. It doesn't anymore, because Minnesota and Pennsylvania no longer have any live camps to generate a hub page for. Every expired camp in a now-empty state is dead-ending in a bare 404, which is exactly what the July hygiene fix was built to stop.

Search performance is still statistical noise: 0 clicks, 1 impression this week vs 2 the prior week, nothing clearing Google's anonymization threshold either week. Not the story this week.

Indexed count held at 57 for the first time in a month, breaking the 90-61-57 slide. Discovered-not-indexed kept unwinding, 1,423 down to 1,261, continuing to give back the spike from two weeks ago. Both readable as the indexing queue settling, not a site problem, and consistent with last week's read.

## Recommended actions

**Needs you.** The camps pipeline needs a look: is data-acquisition still running, did the D1 import job stop, or did something intentionally prune the directory to 17 listings? I don't have D1 access from this session to check `activity-radar` directly.

**Update, 2026-09-14:** the redirect-to-empty-hub bug itself is fixed and staged, not just diagnosed. `src/pages/camps/[slug].astro`'s expired-camp branch now checks `listCitiesInState` before sending someone to `/camps/{state}/`, and falls back to `/camps/` if that state has zero live camps. This does not fix the data pipeline — that's still an open question above — but it stops future emptied-out states from 404ing on their own expired-camp redirects. Not built or pushed; see the PowerShell block below.

Watch indexed count next week to see if 57 holds a second week, which would actually call the three-week slide over.

## What moved

Clicks: 0 last 7 days vs 0 prior 7 days. Impressions: 1 vs 2. Average CTR: 0% both windows. Average position: 11 vs 4 (both single-digit-impression numbers, not meaningful on their own).

## Pages worth a look (position 8-20)

None. One impression this week isn't enough data for a page-level position read.

## The queries

Nothing clears Google's anonymization threshold in either 7-day window (current or prior). The compare view's query table is empty both sides.

## Indexing and sitemap

Indexed: 57, unchanged from last week (was 61 the week before, 90 the week before that). Not indexed: 2.98K across 8 reasons, down slightly from 3.15K. By reason: Not found (404) 121, up from 117. Alternate page with proper canonical tag 38, down from 39. Blocked by robots.txt 31, unchanged. Page with redirect 8, up from 4. Soft 404: 1, unchanged. Crawled - currently not indexed: 1,507, unchanged. Discovered - currently not indexed: 1,261, down from 1,423. Duplicate, Google chose different canonical: 17, down from 24.

Spot-checked two live 404-flagged camp URLs from GSC's current examples list: a Gettysburg College volleyball camp (expired) redirects to `/camps/pa/`, which returns 404. A Stillwater soccer camp (expired) redirects to `/camps/mn/`, which also returns 404 — confirmed via the actual network response code, not just page content. Both were policy-correct as of the 2026-08-16 review. Root cause: Pennsylvania and Minnesota no longer have any live camps in the directory, so their state hub pages don't exist to redirect into. See Takeaways.

Both sitemaps read Success. `sitemap.xml` (index): 2,095 discovered, down from 2,321, last read Sep 6. `sitemap-camps.xml`: 37 discovered, down sharply from 311, last read Aug 28 — eight days stale relative to the main sitemap, consistent with the directory having stopped changing.

Crawl Stats for parentcoachdesk.com, last 90 days: 2.07K total requests, robots.txt reports all files valid, no host-level problems flagged.

## Errors needing action

Camps directory pipeline stall and the resulting dead-end 404s on expired-camp redirects into empty-state hubs. Flagged above as needs-you; not something I can fix or fully diagnose from this session.

parentcoachplaybook.com (old domain, Change of Address) still shows "This site is currently moving to parentcoachdesk.com." No errors, migration not cancelled. Its own robots.txt report still flags 4 files with critical errors, same as prior reviews — the retiring domain on its way out, not worth chasing.

## Content ideas

Nothing new to mine. Still no queries clearing the threshold.

## Single highest-impact fix this week

The camps directory stall and the broken expired-camp redirect it's causing. This isn't the "nothing new, keep executing the plan" week — something that worked a month ago (confirmed working in the 08-16 review) doesn't work now, and it's a live regression a parent could hit today, not a GSC lag artifact. Needs Jeff's eyes on the data pipeline before it's a code fix.

## Run notes

Two things this run couldn't verify or complete, flagged rather than glossed over:

- **Kill switch / run logging.** Could not confirm `agent_registry.status` for `nora` or write the `agent_runs` row via `scripts/agent-run-client.mjs` — the sandbox shell failed to mount this session's files (a tracked Windows-update issue, unrelated to this task), so the Node script never ran. This report exists; the D1 run-log entry does not. Worth a manual entry or a rerun once the sandbox is healthy.
- **Maintenance mode check.** The scheduled-task brief for this run assumed an August-through-November maintenance idle and said to run report-only if active. I checked `PCD-OPERATING-MANUAL.md` section 3.4 directly rather than trust that assumption: the automatic idle was removed 2026-08-01, so this ran as a normal full weekly review, not report-only. The scheduled task's own trigger description should probably drop the maintenance-mode framing since the manual it points to no longer has one.
