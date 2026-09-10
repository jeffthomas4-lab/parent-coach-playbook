# Directory index policy, 2026-09

**Agent:** Dex (`pcd-directory-index-policy`)
**Run date:** 2026-09-05. The actual scheduled cron fired the day before (2026-09-04, 7:45 AM Pacific, `lastRunAt` confirmed in the task registry) but landed no report, no data file, and no commit — see the addendum at the bottom. This is the recovery pass for the September cycle, same pattern as August's preview-run-plus-addendum, just in the other order.
**Prior Dex report:** `reports/seo/directory-index-2026-08.md` (2026-08-03/04).
**Raw capture:** `reports/seo/data/2026-09-05-dex-camp-population-scoring.json`.
**Data source:** own-site crawl only this run. GSC could not be reached by either path — see section 1. Numbers below come from live sitemap fetches, the `activity-radar` D1 (read-only), and git history.

---

## 1. The ratio — no new observation, and a worse reason than last time

**Last confirmed GSC coverage numbers: Aug 16 review.** 57 indexed, ~3.15K not indexed (8-reason breakdown in `reports/seo/gsc-review-2026-08-16.md`), against 2,321 sitemap URLs. Nobody has pulled GSC since. That is **20 days with zero fresh index data**, not just from this agent, from Nora too: `weekly-gsc-review` shows as enabled with `lastRunAt` 2026-08-31, but no `gsc-review-2026-08-23.md` or `-08-31.md` file exists anywhere in the repo or git history. Its last run produced nothing either.

**Why I couldn't get a fresh read.** Both fallback paths in my own charter failed, for two different reasons:

1. `scripts/seo/pull-gsc.mjs` still does not exist. The GSC service-account decision (`SEO-OS-ARCHITECTURE.md` section 10, decision #1, "blocks the MVP") is still open. No credential of any kind for Search Console appears in `.env` or `.env.example`. This has now been open for **five weeks** since it was flagged as the single blocking dependency.
2. The Claude-in-Chrome fallback, which is what closed this exact gap in August, now routes `search.google.com` and even `myaccount.google.com` through a **University of Puget Sound SSO login screen**, not a Field & Forge Google identity. I stopped there and did not attempt to sign in. Per the portfolio/pugetsound.edu separation that governs every PCD and Barnabus agent, and per the standing rule against entering credentials on an agent's behalf, that is not a wall I should climb, it's one that needs a real fix: either the browser session driving these scheduled tasks needs a Field & Forge Google account signed in, or the service account from item 1 needs to exist so no browser is in the loop at all.

**This is a harder failure than August's.** Last month the dashboard was reachable but frozen (stale by 11 days). This month it is not reachable at all through either sanctioned path. That should move up the priority list, not stay parked behind "not MVP-blocking during maintenance mode" — and maintenance mode itself doesn't excuse it anymore either (see the correction in section 7): `PCD_MAINTENANCE_MODE` is `false` right now. This is a normal operating month, not an idle one, and the system that's supposed to watch the index every week has been blind for three.

**What I can confirm without GSC.** Publishing volume, from live sitemaps, fetched today:

| | Jul (GSC) | Aug 3 (Dex) | Sep 5 (this run) |
|---|---|---|---|
| `sitemap-content.xml` | — | 2,002 | **2,042** |
| `sitemap-camps.xml` | 1,056 (Jul 9) → 480 (Jul 31) | 218 | **21** |
| Total published | ~3,024 | ~2,220 | **~2,063** |

Content volume is flat-to-up. Camps collapsed 218 → 21, a 90 percent drop in five weeks. Section 2 is why, and it is not the healthy pruning it looks like at first glance.

---

## 2. Why camps collapsed to 21 — a broken sweep, not a quality gate

The sitemap only lists camps where `pcd_status = 'approved' AND session_end_date >= today` (`src/pages/sitemap-camps.xml.ts` → `listAllCampSlugsApproved`). I queried the underlying `activity-radar` D1 directly (read-only, per my charter and per the SEO-OS architecture's explicit grant of read access to that database):

| `pcd_status` | Count |
|---|---|
| approved | 1,972 |
| pending | 137 (119 per Ranger's Sept 3 count, plus drift since) |
| rejected | 857 |

Of the 1,972 **approved** rows: only **21 (1.1%)** have a future `session_end_date` and actually appear anywhere public. **1,295 (65.7%)** have a past `session_end_date` and are still marked approved. **656 (33.3%)** have no `session_end_date` at all, which means they can never be archived by the date check and never show up in the sitemap either — they just sit there, permanently invisible and permanently un-cleaned.

That 65.7 percent figure matches Ranger's `CAMPS_REVIEW_2026-09-03.md` exactly, which already diagnosed the mechanism: **the daily cron sweep that's supposed to auto-archive expired approved camps has never worked.** I checked independently: zero rows in the entire `rejected` table carry `reject_reason_code = 'past-date'`, which is the code the sweep is supposed to write. Not one, ever. Ranger has flagged "fix the daily cron sweep (create the `scheduler_attempts` table)" as an open recommendation across at least four consecutive weekly reviews now.

**The distinction that matters for my charter:** this is not the directory getting more selective. It's a bug in the archiving layer accidentally producing something that looks, from the sitemap's vantage point, like aggressive quality pruning. Nobody decided to publish 21 camps instead of 218. A broken sweep plus an unworked 119-row (now larger) pending queue produced that number as a side effect. If someone fixes the sweep and separately clears the pending backlog without re-running an eligibility check first, the directory could refill overnight with the same defects that were already live in the 21 I did score — see section 3. **Don't let a data-layer fix double as a quality decision. They're different jobs and only one of them is mine.**

---

## 3. Full-population scoring: all 21 live camp pages, not a rotating slice

My charter asks for a rotating slice of 40-60 pages each month. The live population is smaller than the smallest slice size, so I scored all 21 instead of sampling. This is a one-month exception, not a new method — once the directory refills, rotation resumes.

Same rubric as August (`+20` complete normalized record, `+20` cross-listing at the same address, `+15` real sport-specific gear/equipment block, `+15` substantive About text ≥40 words, `+10` verification stamp; `-15` raw category token visible in the UI, `-15` About text under 40 words, `-15` title is a scraped or status fragment, `-10` ages not provided). Full detail per page in `reports/seo/data/2026-09-05-dex-camp-population-scoring.json`.

| | Aug 3 (n=50) | Sep 5 (n=21, full population) |
|---|---|---|
| Median | 40 | **30** |
| Mean | 41.1 | **23.3** |
| Range | 0–80 | **0–40** |
| Raw category token visible in UI | 27 of 50 (54%) | **19 of 21 (90%)** |
| Real equipment/gear block | 13 of 50 (26%) | **1 of 21 (5%)** |
| Cross-listing at same address | 31 of 50 (62%) | **0 of 21 (0%)** |
| "Bring lunch" logistics template line | 46 of 50 (92%) | **21 of 21 (100%)** |

Every signal moved the wrong direction, and the ceiling dropped: nothing in the current population scores above 40, where August had four pages at 80. The four template fixes I recommended in August (suppress the raw category token, make the verification stamp honest, extend the gear block, suppress "Bring lunch" when fields are unknown) were not shipped. `git log` confirms no commits touching the camp template files since August 16.

**The finding that matters more than the score drop: six of the 21 live listings are categorically ineligible, independent of score.**

`CAMPS_APPROVAL_THRESHOLD.md`'s hard disqualifiers include "clearly not a youth activity (adult-only...)." Six of the 21 live URLs are **"Nike Adult Tennis Camp"** listings — adult beginner tennis, doubles matchplay, that kind of thing. Nothing youth about them. They score 30 on my rubric (complete record, substantive copy, verification stamp, minus the category-token penalty), which would clear most reasonable differentiation thresholds. **Score is the wrong lens for these six. They should not exist on this site regardless of how well-formed the page is**, and Ranger's four most recent weekly reviews don't mention this defect, so it's a genuinely new finding, not a duplicate flag.

Two more pages are broken in a way no threshold catches either:

- One page's title, About block, and H1 are all the identical scraped date fragment ("August 31 - September 7, summer classes start September 8"), zero real description, and a CSS rule (`#block-e5523619bdd33f20c92f { --stroke-style: none... }`) leaks into the visible page text as plain characters, meaning a template or sanitization bug, not just thin content.
- One page's title is literally "The camp" (Pacific Arts Association), a fragment with no identifying information at all.
- One page's title reads "All 2026 PSGW Summer Camp Weeks Are Full" — a guitar workshop page actively advertising, to search engines and parents, that the thing it's for is sold out, with no next-season pointer or waitlist link.

Scores by page:

| Score | n | Pages |
|---|---|---|
| 0 | 5 | the scraped-fragment page, the "weeks are full" page, Camp Fire (thin, no price), one i9 league (39-word About, one word short), Pacific Arts ("The camp") |
| 30 | 15 | every remaining Nike listing (including all 6 adult-tennis pages), the other two i9 leagues, the volleyball listing |
| 40 | 1 | the Pro Football Camp listing — the only page with a real equipment block and no raw category token |

---

## 4. The `/adaptive/` question — confirmed still closed, and the fix from August landed

No new work needed here. Recapping so this doesn't get re-opened by accident: the August report closed this correctly. The 1,208 pages in "Discovered, currently not indexed" on 2026-07-28 were never the `/adaptive/` collection (which has 19 URLs total); that was a sampling artifact from GSC's alphabetical example ordering. The real content is the May/June `coaching-tips` / `drive-home` / `drive-there` batch, sitting on a crawl-budget ceiling.

The one real defect from that investigation — `/adaptive/` had zero navigational internal links despite being three months old — **is fixed.** Commit `36263e83` (2026-08-08, "Link /adaptive/ from Reads nav and footer to de-orphan the silo") added it to `READS_NAV` in `src/data/site.ts` and to `Footer.astro`. I checked both files live this run: the entry is there, rendering under the Reads dropdown as "Adaptive athletes." Good — this is a closed loop, not just a closed conversation. Nothing further to do until fresh GSC data can confirm whether `/adaptive/`'s coverage state moved.

---

## 5. Keep, improve, pull — reframed for a 21-page population

The August keep/improve/pull split (18% keep, 46% improve, 36% pull, out of 50) doesn't translate cleanly to a population this small and this different in composition. Here's the honest version:

**Remove regardless of score (6 pages).** The six adult-only Nike tennis listings. This isn't a differentiation call, it's an eligibility call the intake pipeline already has a rule for and didn't apply. Recommend Ranger's admin queue reject these on `not-youth-activity`, the same code the approval framework already defines.

**Fix or pull (3 pages).** The scraped-fragment page (title/About/H1 all identical, plus the CSS leak), the "weeks are full" page (either update it with next-season info or pull it — advertising a sold-out camp with no path forward serves nobody), and the "The camp" fragment-title page.

**Keep as-is, genuinely fine (12 pages).** The remaining Nike and i9 listings: complete records, real prices, real age bands, just still carrying the raw-category-token bug and missing the gear layer, both fixable in the template rather than the data.

**No pull-from-sitemap threshold decision needed this month.** At 21 live pages, of which 6 are outright ineligible, there's no meaningful "which fraction to cut" question left to answer with a differentiation number. That question returns the moment the pending queue (137 rows and growing) gets worked and the archive sweep gets fixed. When it does, two things need to happen in order, not in parallel: **first** fix the eligibility gate so adult-only and fragment-title records can't re-enter approved status, **then** decide the differentiation threshold from August (proposed: commercial ≥45, community/nonprofit no threshold, both still Jeff's numbers to set). Fixing the sweep and refilling the directory before the eligibility gate is tightened would just reproduce this month's problem at ten times the volume.

---

## 6. Corrections and open items

**Correction to my own charter's framing, and to `SEO-OS-ARCHITECTURE.md` section 3.4.** The doc that spawned this agent describes an August-through-November calendar-driven maintenance idle. `PCD-OPERATING-MANUAL.md` section 3.4 was updated 2026-08-01 to remove that: maintenance mode is now the `PCD_MAINTENANCE_MODE` toggle only, and it currently reads `false` in `wrangler.production.jsonc`. This is a normal operating month. That makes the three-week GSC blackout in section 1 a live-operations problem, not a dormant-season one worth deferring.

**Correction owed to `SEO-OS-ARCHITECTURE.md` agent D description, again.** It still frames camps as "both the largest page-count source and the largest not-indexed source." The August report already corrected the page-count half (camps were 9.8% of published URLs then). Now camps are 1.0% of published URLs (21 of 2,063). The description needs the update; I'm flagging, not editing outside my own reports, same as August.

**New, for Ranger and whoever owns the admin queue:** six live camp records violate the stated not-youth-activity disqualifier. This wasn't caught by four consecutive weekly camps-data-steward reviews, because it's not the kind of thing that review's checklist currently looks for (duplicates, dead links, expired sessions). Worth adding "adult-only program despite youth-camp categorization" as a checked defect class, since the same intake pipeline that let six of these through will keep letting more through.

**Still open, unchanged from August:**
- `scripts/agent-run-client.mjs` needs `PCD_AGENT_RUNS_TOKEN`. Still absent from `.env`. Still can't log this run's start/finish to `/api/agent-runs`.
- Crawl Stats still never pulled (Nora's open thread since July 28).
- The `discovered_not_indexed` template attribution from August is still alphabetically biased and still needs redoing once real API access exists.

**New this run:**
- GSC access is now blocked by an SSO routing problem, not just a stale dashboard. See section 1.
- The daily camps-sweep is confirmed never to have written a single `past-date` rejection, ever. Ranger's independent finding, corroborated here from a different angle (index-economics rather than data-quality).
- The scheduled 2026-09-04 Dex run produced no report, no data file, no commit. Whatever it hit, it left no trace to diagnose from; worth checking agent-run logs if `PCD_AGENT_RUNS_TOKEN` ever gets set, because right now there's no record of what happened.

### For Jeff

1. **The GSC access chain is broken two ways now, not one**, and it blocks Dex, Nora, and Lonnie's link-watch alike. The service-account decision from 2026-07-31 (section 10, decision #1 in the architecture doc) is the actual fix; the browser fallback was always a stopgap and it just stopped working too.
2. **Six adult-only tennis listings are live on a youth-sports directory**, findable by anyone including Google, in direct violation of the approval policy you set. Small in count, easy to fix, worth doing this week rather than waiting for the monthly cycle.
3. **The camps directory looks like it shrank to 21 pages through cleanup. It didn't.** The archive sweep has been silently broken since at least July, per Ranger, and 1,951 of 1,972 "approved" records are dead or unreachable. Whoever fixes that sweep should NOT also flip the 119+ pending queue live in the same motion without a look at whether the same disqualifier gap that let the tennis camps through is still open.
4. The August publish-threshold question (commercial ≥45, community/nonprofit uncapped) is still yours to set, still evidence-backed, and now moot at this population size until the queue gets worked. Nothing new needed from you there this month beyond noting it's still waiting.

---

## Addendum: the 2026-09-04 scheduled fire

The task registry shows `pcd-directory-index-policy` fired on schedule, 2026-09-04, 7:45 AM Pacific (day-4 cron, jitter 351s). No `reports/seo/directory-index-2026-09.md`, no `reports/seo/data/2026-09-*` file, and no commit from that run exist anywhere in git history or the working tree. Whatever happened, it produced no artifact and no error trail I can find from the outside — `PCD_AGENT_RUNS_TOKEN` still isn't set, so even a failure wouldn't have logged anywhere retrievable. Given the SSO-routing problem found in section 1 was almost certainly present the day before too, the most likely explanation is the same GSC access failure stopped that run before it could write anything, with no fallback report-what-you-found step taken. This report, dated the next day, is the recovery pass. Recommend treating "the scheduled run fired but wrote nothing" as its own alert condition once agent-run logging works, since right now that failure mode is invisible.
