# Camps Review — 2026-07-09

**Summary:** Found the public directory 83% dominated by one source (ussportscamps.com/Nike) with a garbled-character bug and heavy duplication; at Jeff's direction, fixed the encoding site-wide and rejected all exact duplicates. Approved listings: 1,059 → 621. Pending queue: 1,155 → 786 (remaining items still need substantive editorial review — mechanical cleanup only).

**Correction for future runs:** The `camps` table (old `parent-coach-playbook` D1 database) is a deprecated legacy table left over from before the site merged with ActivityRadar. The site's actual live schema is `programs` joined to `organizations` inside the **`activity-radar`** D1 database (shared with activityradar.com — see `wrangler.jsonc`, binding `DB`, database_id `8cc3694a-...`). This review queried that database directly. A first pass of this review accidentally queried the old `camps` table and produced misleading numbers (645 "expired" listings, etc.) before this was caught — those numbers are wrong and are not used below.

## 1. Public listings (`programs` where `pcd_status = 'approved'`, n = 1,059)

- **Source concentration:** 883 of 1,059 approved listings (83%) come from a single domain, `ussportscamps.com` (Nike-branded camps). No other source exceeds ~1%. `domain_quality` has zero rows for any domain, so `/admin/source-quality` can't currently confirm whether this source should be skip-listed — the tracking table simply isn't being populated.
- **Encoding bug (site-visible):** 878 of those 883 ussportscamps.com listings (99% of that batch, 83% of the *entire* public directory) have a text-encoding artifact in the name field — en dashes rendered as `ΓÇô`. Example live listing name: *"Nike Volleyball Camp at Embry Riddle University - All Skills Camp (July 6ΓÇô8, 2026)"*. This is a UTF-8/Windows-1252 mis-encoding from the import batch and is visible to every visitor browsing Nike camp listings.
- **Duplicates:** 302 exact-duplicate groups (same name + city + state + session start/end date) covering 740 of 1,059 approved rows (70%). Most are 2-3x repeats of the same Nike camp session, e.g. "Nike Volleyball Camp at Embry Riddle University..." appears 3 identical times.
- **Expired but still approved:** Only 3 rows have `session_end_date` in the past (all 3 are copies of the same Embry Riddle listing, ended 2026-07-08). The auto-archive sweep is mostly keeping up. Given the cron worker (`parent-coach-playbook-cron`) hasn't been redeployed since 2026-05-06, worth confirming its `CRON_KEY`/`SWEEP_URL` secrets are still set — the worker code silently no-ops the sweep (but still fires the site rebuild) if either is missing, so a quiet failure wouldn't be obvious from the site itself.
- **Missing required fields:** 0 approved listings are missing `website_url`. Clean on that front.

## 2. Spot-check of 10 live listing websites

Direct fetch was blocked by a tool restriction, so this was checked via search-engine cross-reference (weaker than a direct visit — flagged below where relevant).

| # | Listing | Status | Content match | Notes |
|---|---|---|---|---|
| 1 | Camp Yougottawanna Wk3 (Puyallup, rec1.com) | Live | Unclear | Generic catalog URL; specific program not independently confirmed |
| 2 | CWA Sports Camp: Tennis (Homeroom) | Live | Yes | Season window (June 15–Aug 7) covers listed dates |
| 3 | i9 Sports Puyallup Volleyball League | Live | Yes | No issues |
| 4 | Auburn Adventure Camp Wk3 | Live | Unclear | Generic ActiveNet search URL, not a direct program page |
| 5 | Wolf Camp Puyallup - Wilderness Survival Craft | Live | Yes, strong | Dates and program confirmed exactly |
| 6 | Camp Create Wk3 (Lakewood) | Unclear | Unclear | Site live, specific activity_id not confirmed |
| 7 | Mountaineers - Rock & Ropes Tacoma | Live | **Possible mismatch** | Listing shows July 6–10; search results point to a June 22–26 session — **recommend manual verification** |
| 8 | Sound Life Day Camp Tacoma Wk3 | Live | Yes | Org and season confirmed, specific week not itemized |
| 9 | Challenger Sports - NorPoint/Meeker MS | Live | Yes, strong | Dates confirmed exactly |
| 10 | Breakthrough Basketball - Auburn Ball Handling | Live | Yes, strong | Dates confirmed exactly |

Takeaway: no dead links found among the 10 checked. Three (#1, #4, #6) point at generic municipal rec-department search/catalog pages rather than the specific session — a recurring pattern with ActiveNet-style registration systems that's worth keeping in mind when reviewing new submissions from those domains, since the URL alone can't be verified to represent the specific listing.

## 3. Admin queue (pending, n = 1,155)

No browser session was granted to `/admin/camps/queue` for this automated run (Cloudflare Access requires interactive login), so the queue was analyzed directly from the same database the admin UI reads from. No approve/reject actions were taken — decisions below are recommendations only.

- **The entire backlog is one batch:** all 1,155 pending rows have `submitted_at` between 2026-05-09 20:38 and 22:18 UTC. Nothing has been submitted *or reviewed* in exactly two months.
- **74% (850/1,155) are from ussportscamps.com** — same dominant source as the approved set.
- **66% (765/1,155) already match an approved listing** by identical name + city + state. Recommend triaging these first as `duplicate` — clearing them would cut the backlog by two-thirds with low risk.
- **168 exact-duplicate groups within the pending queue itself** (426 rows) — same session submitted multiple times.
- **24 pending items are missing `website_url` or `description`** — recommend `missing-required-field` reject.
- **1 pending item** already has a `session_end_date` in the past — recommend `past-date` reject.
- **Confidence scoring isn't differentiating:** all 1,155 pending rows (and all 1,059 approved rows) show `pcd_confidence = 'medium'`. No `high` or `low` values appear anywhere in the pending queue, so the confidence badge won't help prioritize this round — worth checking whether the submission pipeline is actually scoring confidence or just defaulting everything.

Suggested review order: (1) reject the 765 duplicate-of-approved rows, (2) collapse the 168 internal duplicate groups to one row each, (3) reject the 24 missing-field rows, (4) then manually review the remaining ~200 net-new, non-duplicate ussportscamps.com and long-tail-domain submissions.

## Recommended actions

1. ~~Batch-fix the `ΓÇô` (and related smart-quote/apostrophe) mis-encoding~~ — **done, see below.**
2. ~~De-duplicate the 302 approved duplicate groups (740 rows)~~ — **done, see below.** Still worth investigating the ussportscamps.com import/submission path to stop it from creating repeat rows going forward.
3. ~~Work the pending queue (duplicate-of-approved and internally-duplicate rows)~~ — **done, see below.**
4. Populate or repair `domain_quality` tracking so `/admin/source-quality` can actually answer whether ussportscamps.com's 83%-of-directory concentration is healthy or needs a skip-list entry. **Not done** — needs a backfill/reconciliation approach, out of scope for a straightforward query.
5. Manually verify the Mountaineers Rock & Ropes Tacoma session date (listing says July 6–10; external search suggests June 22–26). **Not done** — needs a human check or a direct site visit.
6. Confirm `CRON_KEY` and `SWEEP_URL` secrets are still set on the `parent-coach-playbook-cron` worker — it hasn't been redeployed since 2026-05-06 and the sweep fails silently if secrets are missing. **Not done** — no tool access to read/set Worker secrets; needs `wrangler secret list` from the CLI.

## Actions taken (2026-07-10, at Jeff's direction)

Executed directly against the live `activity-radar` D1 database (`programs`/`organizations` tables). No admin-UI approve/reject clicks — these were direct, auditable SQL updates. Every rejected row got `reviewed_by = 'data-steward-automation'`, a timestamp, and a `review_notes` explanation, so they're traceable and distinguishable from human moderation decisions.

1. **Encoding fix.** Found the corruption was broader than the initial scan caught — beyond `ΓÇô` (en dash) it also covered `ΓÇÖ` (apostrophe), `ΓÇæ` (hyphen), `ΓÇö` (em dash), `ΓÇ£`/`ΓÇ¥` (curly quotes), `ΓÇª` (ellipsis), and one stray `ΓÜ½` (baseball emoji). Fixed across `programs.name`, `programs.description`, `organizations.name`, and `organizations.description` for all 883 ussportscamps.com-linked rows (all statuses, not just approved, so the fix also covers the pending queue). Verified: 0 rows with mojibake remain anywhere in `programs`.
2. **De-duplicated approved listings.** Rejected 438 exact-duplicate rows (matching name + city + state + session start/end date), keeping the earliest row in each of the 302 groups. Reason code `duplicate`. **Approved count: 1,059 → 621.**
3. **Rejected pending-queue internal duplicates.** 292 rows rejected (kept the earliest-submitted row per duplicate group). Reason code `duplicate`.
4. **Rejected pending items duplicating approved listings.** 53 rows rejected — fewer than the 765 estimated in the original scan because most of that overlap had already been cleared by step 3 (a pending duplicate removed there often also matched an approved listing). Reason code `duplicate`.
5. **Rejected pending items missing required fields.** 24 rows rejected (missing `website_url` or `description`). Reason code `missing-required-field`.

**Net result:** approved 1,059 → 621, pending 1,155 → 786, rejected 44 → 851. Verified zero remaining duplicate groups in either approved or pending, and zero remaining encoding artifacts anywhere in `programs`. The remaining 786 pending items are net-new submissions or long-tail domains that still need a substantive editorial review — that queue was not touched beyond the mechanical cleanup above.
