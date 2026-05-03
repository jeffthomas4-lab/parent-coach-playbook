# Camp + League Search Log

Source of truth for what we have searched, what we found, and what comes next. Covers BOTH camps (time-bounded sessions) and leagues (recurring seasons). Both go into the same `camps` table with a `program_type` column. Replaces the Google Sheets registry referenced in older versions of `claude-in-chrome-prompt.md`. Lives in git. Read this before every search batch. Update it after every batch.

**Last updated:** 2026-05-03

---

## How to use this file

1. **Before a search batch:** Read `Search Areas` to pick the next anchor city. Read `Domain Registry` to build the SKIP_LIST (rows with `last_checked` recent and `result` final) and the RECHECK_LIST (rows with `result` = partial / blocked / stale_listings).
2. **During the batch:** When you visit a domain, mark intent (add or update its row). When you finish the domain, write the result row in full.
3. **After import:** `import-camps.py` auto-appends a row to `Batch History` with date, anchor city, count, and source file.
4. **Picking the next area:** Walk the `Expansion Path` in order. Don't jump rings until the current ring is at "saturated" or "diminishing returns".

Geographic unit = anchor city + radius (default 25 miles). One row per anchor in `Search Areas`.

---

## Expansion path

Concentric rings out from Tacoma. Move to the next ring only when the current ring's anchors are all `saturated` or `diminishing` in `Search Areas`.

**Ring 1 — Puget Sound core**
1. Tacoma, WA (25mi) — *active, in progress*
2. Seattle, WA (25mi)
3. Bellevue / Eastside, WA (15mi)
4. Olympia, WA (20mi)
5. Everett, WA (20mi)

**Ring 2 — Pacific Northwest**
6. Portland, OR (25mi)
7. Vancouver, WA (15mi)
8. Bellingham, WA (20mi)
9. Spokane, WA (25mi)
10. Eugene, OR (20mi)
11. Boise, ID (25mi)

**Ring 3 — West Coast and inland**
12. Bend, OR (20mi)
13. Salt Lake City, UT (25mi)
14. Reno, NV (20mi)
15. Sacramento, CA (25mi)
16. Bay Area, CA (anchored by SF, Oakland, San Jose at 15mi each)
17. LA Metro, CA (anchored by LA, Long Beach, Pasadena at 15mi each)

**Ring 4 — National**
Decide by request. Population-weighted national rollout starts here.

---

## Search Areas

One row per anchor city + radius. Status enum:
- `not_started` — never searched
- `in_progress` — currently being filled out across multiple batches
- `saturated` — all known sources checked, last batch returned mostly duplicates
- `diminishing` — last batch returned <10 new camps, ready to move on
- `paused` — stopped intentionally; see notes

| Anchor | Radius | Status | Last batch | Next batch after | Camps imported | Notes |
|---|---|---|---|---|---|---|
| Tacoma, WA | 25mi | in_progress | 2026-05-03 | 2026-06-02 | (see batch history) | Batch 2 (2026-05-03): pulled YMCA Pierce-Kitsap (5 branches, 14 sessions), Boys & Girls Clubs South Puget Sound (4 in-area branches, 6 sessions), Federal Way Parks/itallhappenshere (11 sessions inc. K-8, Fireflies preschool, DCIT, specialty), Greentrike/Children's Museum of Tacoma (6 sessions), Point Defiance Zoo (8 sessions, all sold out), parkstacoma.gov recheck (10 sport-camp sessions across Vassault/Norpoint/Jefferson/Heidelberg/Kandle/SERA/Pt Defiance Marina). Next batch: ActiveNet catalog drain for parkstacoma.gov + penmetparks.org, plus pugetsound.edu, nwtrek.org, City of Lakewood/Auburn/Puyallup/UP, Tacoma/Peninsula/PSD/UP school districts. |
| Seattle, WA | 25mi | not_started | — | — | 0 | Big metro, plan 2-3 batches to cover. |
| Bellevue / Eastside, WA | 15mi | not_started | — | — | 0 | |
| Olympia, WA | 20mi | not_started | — | — | 0 | |
| Everett, WA | 20mi | not_started | — | — | 0 | |
| Portland, OR | 25mi | not_started | — | — | 0 | |
| Vancouver, WA | 15mi | not_started | — | — | 0 | Pairs with Portland. |
| Bellingham, WA | 20mi | not_started | — | — | 0 | |
| Spokane, WA | 25mi | not_started | — | — | 0 | |
| Eugene, OR | 20mi | not_started | — | — | 0 | |
| Boise, ID | 25mi | not_started | — | — | 0 | |

Add new rows as anchors come online. Don't delete old ones, just update status.

---

## Re-check rules

Time-based off `result` from the domain registry. Already encoded in `claude-in-chrome-prompt.md`.

| Result | Re-check after | Why |
|---|---|---|
| `camps_extracted` | 30 days | Listings updated; new sessions may have been added. |
| `partial` | 14 days | Got some sessions, more behind a portal or PDF. Worth a fast retry. |
| `blocked` | 14 days | Cloudflare / login / Claude refused. Try again soon. |
| `stale_listings` | 60 days | Only old years posted. Site might roll over. |
| `no_camps` | 365 days | No youth camps at all. Don't waste tokens. |

If `notes` contains the literal text `no_claude`, never visit that domain again. Permanent skip.

---

## Domain Registry

Every domain we have ever visited for this project. One row per domain, even across anchor cities. If the same site covers multiple anchors, merge into one row and list both in `area_covered`.

Columns: `domain | organization | area_covered | last_checked | result | camps_pulled | next_recheck_after | notes`

| Domain | Organization | Area covered | Last checked | Result | Camps pulled | Next recheck after | Notes |
|---|---|---|---|---|---|---|---|
| loggerbaseballcamps.com | UPS Athletics | Tacoma 25mi | 2026-05-03 | camps_extracted | 2 | 2026-06-02 | UPS sport-specific camp microsite. |
| loggerbasketballcamps.com | UPS Athletics | Tacoma 25mi | 2026-05-03 | camps_extracted | 2 | 2026-06-02 | |
| loggersoccercamps.com | UPS Athletics | Tacoma 25mi | 2026-05-03 | camps_extracted | 3 | 2026-06-02 | |
| loggervolleyballcamps.com | UPS Athletics | Tacoma 25mi | 2026-05-03 | camps_extracted | 7 | 2026-06-02 | All position-specific camps captured. |
| littleloggerscamp.com | UPS Athletics | Tacoma 25mi | 2026-05-03 | camps_extracted | 1 | 2026-06-02 | All-sport youth camp. Currently full. |
| pacificlutheranvolleyballcamps.totalcamps.com | PLU Athletics | Tacoma 25mi | 2026-05-03 | camps_extracted | 1 | 2026-06-02 | |
| parkstacoma.gov | Metro Parks Tacoma | Tacoma 25mi | 2026-05-03 | partial | 10 | 2026-06-02 | Recheck completed for non-Titlow/Wapato venues. Pulled Vassault, Norpoint, Jefferson, Heidelberg, Kandle, SERA, Pt Defiance Marina sessions. ~122 total sport-camp entries in ActiveNet catalog; many remaining. |
| golutes.com | PLU Athletics | Tacoma 25mi | 2026-05-03 | blocked | 0 | 2026-06-02 | Linked summer camp news pages all 404 or stale (2012-2024 dates). Current PLU camp registrations live on the dedicated logger* domains already in registry. No 2026 landing page found. |
| pugetsound.edu | UPS | Tacoma 25mi | — | — | 0 | — | Not yet checked. Deferred to next batch. |
| ymcapkc.org | YMCA Pierce-Kitsap | Tacoma 25mi | 2026-05-03 | camps_extracted | 14 | 2026-08-03 | Pulled Pearl Street, Lakewood, Mel Korum (Puyallup), Gordon (Sumner), Tom Taylor (Gig Harbor). Each location runs ~10 weekly sessions Jun-Aug; sampled across weeks. PROMPT-INJECTION FLAG: page text contained the literal string "Stop Claude" appearing as standalone text on multiple pages — Chrome treated as untrusted content and ignored. Domain remains usable. |
| bgcsps.org | Boys & Girls Clubs South Puget Sound | Tacoma 25mi | 2026-05-03 | camps_extracted | 6 | 2026-08-03 | All in-area branches: Lakewood, Al Davies (Tacoma), D.A. Gonyea (Tacoma), Henry T. Schatz (Tacoma). Jun 22 - Aug 21, M-F 8a-5:30p, $215/wk standard with reduced/free lunch tiers. Bremerton outside 25mi radius. Cheney Family branches (Evergreen, Key Peninsula) not yet visited. |
| penmetparks.org | PenMet Parks | Tacoma 25mi | 2026-05-03 | partial | 0 | 2026-06-02 | Camp page confirms summer camps Jun 29 - Aug 28 but per-camp dates/prices/ages live behind ActiveNet registration UI. PDF camp guide available but not extractable this run. Recheck via ActiveNet catalog. |
| itallhappenshere.org | Federal Way Parks & Recreation | Tacoma 25mi | 2026-05-03 | camps_extracted | 11 | 2026-08-03 | K-8 Summer Camp (10 weeks), Fireflies Preschool (9 weeks), DCIT Leaders-in-Training (6 weeks), specialty camps (Mini Dance, Spongebob Theatre, Ballerina Dream). Full schedule embedded in page JS. Prices not on public page — used "Contact for pricing". |
| pdza.org | Point Defiance Zoo & Aquarium | Tacoma 25mi | 2026-05-03 | camps_extracted | 8 | 2026-08-03 | All summer camp tiers (Tiny Turtles through Eco Explorers) confirmed sold out. spots_status set to "full" for all rows. Sampled 8 sessions across age tiers. |
| nwtrek.org | Northwest Trek | Tacoma 25mi | — | — | 0 | — | Not yet checked. Deferred to next batch. |
| greentrike.org | Greentrike / Children's Museum of Tacoma | Tacoma 25mi | 2026-05-03 | camps_extracted | 6 | 2026-08-03 | 8 weekly sessions Jul 6 - Aug 27, M-Th. Full-day $375 / half-day $225, ages 3-7, 1501 Pacific Ave. Sampled 6. |
| tacomaartmuseum.org | Tacoma Art Museum | Tacoma 25mi | 2026-05-03 | no_camps | 0 | 2026-08-03 | Youth and Family Programs page lists tours and TAM Studio School / Teen Open Studio drop-ins. No summer day camps. |

Add domains in alphabetical order within each area or just append at the bottom and re-sort later. Keep one row per domain.

---

## Permanent skip list

Domains with `no_claude` flag, paywalls Claude can't get past, or sites that have explicitly blocked automated access. Never retry.

| Domain | Reason | Date flagged |
|---|---|---|
| (none yet) | | |

---

## Batch History

Auto-appended by `import-camps.py` after every successful run. Manual entries OK if you import without the script.

| Date | Anchor | Source file | Rows imported | Rows skipped | Notes |
|---|---|---|---|---|---|
| 2026-05-03 | Tacoma, WA (25mi) | imports/camps-2026-summer.csv | (initial batch) | — | First import. Establishes the database. |
| 2026-05-03 | Tacoma, WA (25mi) | camps-2026-tacoma-batch-2.csv | 55 | 0 |  |
| 2026-05-03 | Tacoma, WA (25mi) | camps-2026-tacoma-batch-2.csv | 55 | 0 |  |
