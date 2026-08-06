# PCD Coverage Report, August 2026

Prepared by Cal. First run of this report, so most figures below are the baseline rather than a trend. Where a prior weekly report from another crew exists, I used it instead of re-deriving the number.

## Method note on this run

Two data sources named in the brief were not reachable this session. The Cloudflare D1 MCP server was disconnected mid-session (confirmed through ToolSearch returning no match on any `d1_*` tool), so I could not query the `programs`/`organizations` D1 directly and could not read `agent_runs`. For the camps directory I substituted the crew's own most recent weekly review (`reports/camps/CAMPS_REVIEW_2026-07-30.md`) and field audit (`reports/camps/FIELD_AUDIT_2026-07-31.md`), both read-only markdown already on disk. For crew health I used git log and the crew's own report files instead of `agent_runs`. Everything else below is computed directly from the content tree.

Also worth naming up front: `PCD-AI-OS/08-roadmaps.md` states PCD idles August through November, report-only, no writes or build work, with the S4 deletion watch as the sole exception. Today, August 3, is the first day of that window. This report is exactly the kind of activity the idle period allows.

## 1. Content inventory

1,865 files across 14 collections in `src/content/`.

| Collection | Files |
|---|---|
| articles | 815 |
| coachingTips | 577 |
| body | 177 |
| scripts | 53 |
| recruiting | 29 |
| guides | 37 |
| pathways | 26 |
| decisions | 26 |
| seasonCalendars | 28 |
| news | 22 |
| rules | 22 |
| resources | 18 |
| adaptive | 18 |
| pillar | 17 |

Over the last 31 days (since 2026-07-03), 161 new content files were added and 924 files were touched in total (added or edited) per git log, out of the full 1,865. That is roughly half the corpus touched in a month, which tracks with an active Ed/Flo/Penny pipeline. No prior coverage report exists to compare collection-by-collection change, so this is the starting baseline for next month's diff.

**Posts by sport against the 33-sport enum.** Counting both the singular `sport:` field and `sportTags:` arrays across all collections (excluding the catch-all `multi-sport`, `multi-activity`, and `performing-arts` entries, which aren't real single sports):

Thinnest five: rugby (0 articles), pickleball (0), field-hockey (2), wrestling (10), football-7v7 (11).

Two additional enum values sit at zero but are catch-all categories rather than distinct sports: `multi-activity` and `performing-arts`. Worth a look regardless, since they're in the enum and a parent could land on either as a real search term.

**Season coverage.** Fall sports enter their season inside the next two months (Aug 3 to Oct 3). I checked each for tryout, registration, and equipment content:

| Sport | Season file | Sport-tagged files | Tryout content | Registration content | Equipment content |
|---|---|---|---|---|---|
| Cross country | hs-cross-country-fall | 17 | 3 | 0 | 6 |
| Football | hs-football-fall-pnw | 58 | 3 | 5 | 21 |
| Soccer | hs-soccer-fall | 110 | 6 | 7 | 27 |
| Marching band | hs-marching-band-fall | 19 | 2 | 1 | 3 |
| Flag football (rec) | rec-flag-football-fall | 25 | 1 | 0 | 8 |

Two real gaps: cross country and rec flag football both have zero registration articles. The flag football season calendar file itself names "registration Jun-Aug" as the key window parents need covered, and that window is closing with nothing written for it. Tryout coverage is thin across the board relative to file counts, football especially (3 tryout pieces against 58 football-tagged files).

## 2. Editorial pipeline

`editorial.status` distribution across 1,695 files that carry the field:

| Status | Count |
|---|---|
| claude-reviewed | 1,616 |
| published | 51 |
| ready-for-jeff | 20 |
| needs-revision | 5 |
| jeff-approved | 2 |
| draft | 1 |

The approval bottleneck: 20 files sitting in `ready-for-jeff`, waiting on a decision that only you can make.

Separately, the boolean `draft: true` flag (distinct from `editorial.status`) is set on 8 files. Checked file modification times against a 14-day cutoff: all 8 were touched within the last week, so none are stale. Note this used filesystem mtime rather than git commit date, since per-file git log lookups were too slow to run reliably in this session's sandbox; mtime is a reasonable proxy here given how recent all 8 are.

## 3. Freshness

51 published posts. 48 of them (94%) have an `updatedAt` or `claudeReviewedAt` date within the last 90 days. Two published posts have no freshness date field at all: `usa-vs-usssa-bats.md` and `youth-sports-costs.md`. One more has a date field but it's older than 90 days.

33 of the 51 published posts carry a `factCheckGoodThrough` date. None are currently expired.

No prior coverage report exists in `reports/coverage/` to trend this against. Starting point for next month: 94% fresh, 0 expired fact-checks.

## 4. Camps directory

Pulled from the 2026-07-30 weekly camps review, the most recent available (D1 itself unreachable this session, see method note above).

- `pcd_status`: 1,777 approved, 151 pending (up from 107 the prior week), 857 rejected. Total 2,785.
- Approved by state: only 604 of 1,777 (34%) are in Washington. The rest span all 50 states, led by California (295), Massachusetts (99), Oregon (58), Illinois (50), Maine (47), and New York (45), then single and low double digits everywhere else. Most states outside that top seven carry thin coverage. The 2026-07-30 review also corrected a running assumption in the last three reviews that this is a WA-focused directory. It's documented as national with a PNW editorial focus, and region is no longer a valid rejection reason.
- Approved-but-expired listings (past `session_end_date`, still live): 960, up from 796 the week before, a jump of 164 in one week. Root cause carried forward across four consecutive reviews: the daily cron sweep has reportedly been broken since before 2026-07-09.
- No camp-category breakdown is available. The weekly reviews track approval status and state, not category, so I can't report category counts or a month-over-month category trend without a live D1 query.
- Separately, a nightly field-quality audit (data cleanup, not directory growth) is 1,922 of 1,972 rows into its sweep, at roughly 50 rows a night, projected to finish around 2026-09-08.
- 500 errors: the most recent Friday Letter (2026-07-31) did not flag any. Worth flagging anyway: the known 296-page camp 500 bug (a null `session_end_date` crashing `camps/[slug].astro`) was root-caused and fixed in source on 2026-07-20, but the most recent full standard audit (2026-07-31) still lists that pillar as failing because the fix wasn't confirmed live and reverified in production as of that pass. Someone should confirm it deployed.

## 5. Crew health trend

384 commits in the last 31 days. Named-agent cadence, from commit prefixes and standalone report files:

| Agent | Lane | Last seen | Count this window | Read |
|---|---|---|---|---|
| Ed | Drafting | 2026-08-03 (today) | 6 | Active |
| Penny | Editorial gate | 2026-08-03 (today) | 7 | Active |
| Flo | Freshness refresh | 2026-07-28 | 2 | Active, roughly weekly, due again |
| Sasha | Social drafts | 2026-07-29 | 3 | Active |
| Discovery | Org site discovery | 2026-07-24 | 4 | 10 days quiet, not yet 2 weeks, worth watching |
| rules-watch | Rules monitoring | 2026-07-28 (report file) | 5 reports since 07-07 | Active, weekly cadence, due again |

No "Backup:" commit prefix exists anywhere in this repo's git history. That's not necessarily a silent agent. Backups here run through a Cloudflare Cron worker (`worker-backup`) plus a local PowerShell export script, not a committing agent. Local D1 export snapshots exist for 2026-07-25 and 2026-08-01, so the mechanism is running. But `backups/backup-log.json` shows the Phase 0 "three clean runs" proving clock still sitting at 0 of 3. Both attempts (07-25 and 08-01) were blocked by the same root cause: the Cloudflare D1 MCP has no bulk or streaming export path, so the two largest tables (organizations, 198k rows; enrichment_queue, 183k rows) can't be pulled in one session without hitting a rate limit or the tool disconnecting mid-run. That is the same D1 MCP disconnection this report ran into today. **Action needed:** this needs a different export mechanism (wrangler CLI with a real API token, or a dedicated bulk-export tool) before the backup clock can ever reach three clean runs.

`agent_runs` itself (the per-run log every agent is supposed to write to) was not reachable this session for the same D1 reason, so I can't confirm daily run counts against it directly. The commit-log and report-file evidence above is the best available substitute.

One more stalled item worth naming: a notification delivery drill logged at `coordination/release-evidence/notification-drill-replacement-pending-2026-07-17.json` has sat in `pending_receipt_verification` since 2026-07-17, 17 days with no update. Nobody has confirmed the Slack or email receipt came through.

## 6. Flags

Checked against the Phase 0 bars in `PCD-AI-OS/08-roadmaps.md`:

- **`agent_runs` rows per day > 0 for every agent.** Cannot verify this run, D1 unreachable. Git and report-file evidence above shows five of six named lanes active within the last 10 days; only the backup mechanism shows a real stall, and that stall is documented (proving clock 0 of 3).
- **Camp 500s = 0.** Fixed in source 2026-07-20, not yet confirmed live. This is the single highest-visibility open item, since it's a page a parent can hit directly.
- **Backup proving clock.** 0 of 3 clean runs, blocked twice by the same D1 export limitation this session also hit. Needs a different export path to ever close.
- **Camps pending queue.** 151 items waiting, up from 107, and the 23-item scraped batch has sat unactioned for three straight weeks. None of the last three weeks' review recommendations have been acted on.
- **Release-evidence stall.** The 2026-07-17 notification drill is still unverified 17 days later.

Success criteria for this run: report written and committed, one Slack summary posted, bottlenecks and any silent agent named. Backup is the one lane that's genuinely stalled, and it's named above with the specific blocker.

**Addendum, written after the fact.** This report is staged (`git add`) but could not be committed. `.git/index.lock` and `.git/HEAD.lock` are both stuck in this checkout: one predates this session (same timestamp as the prior Arnie commit), one was left behind by this session's own failed commit attempt. Neither can be removed from this sandbox; every delete attempt returned "Operation not permitted," consistent with `STANDARD-AUDIT.md` Pillar 1's existing note about "dozens of stale-renamed lock/ref files from prior interrupted parallel-agent operations" in this exact repo. This is worth elevating past a low-priority audit line: if git writes are silently failing to commit across sessions the same way this one did, that would understate real editorial and ops activity in any commit-based crew health count, including the one in section 5 above. Someone with real filesystem access to this checkout should run `git gc` (or manually clear the two lock files) so the next session's commit isn't blocked before it starts.
