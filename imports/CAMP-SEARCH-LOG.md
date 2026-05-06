# Camp + League Search Log

Source of truth for what we have searched, what we found, and what comes next. Covers BOTH camps (time-bounded sessions) and leagues (recurring seasons). Both go into the same `camps` table with a `program_type` column. Replaces the Google Sheets registry referenced in older versions of `claude-in-chrome-prompt.md`. Lives in git. Read this before every search batch. Update it after every batch.

**Last updated:** 2026-05-06

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
| Tacoma, WA | 25mi | in_progress (approaching diminishing) | 2026-05-06 | 2026-05-20 | (see batch history) | Batch 3 (2026-05-06): 30 rows pulled across 5 productive operators — 7 Lakewood Camp Create, 7 Metro Parks Tacoma at new verified venues (STAR/Eastside/People's CC), 1 PenMet Tennis Camp, 10 Puyallup Camp Yougottawanna, 5 Auburn (3 teen Adventure Camps + 2 theatre camps at Les Gove Park). Continuation pass also confirmed: tacomaschools.org / puyallupsd.org / bethelsd.org / cityofup.com / pugetsound.edu / nwtrek.org all no_camps; skyhawks.com blocked (try partner-portal workaround); firstteesouthpugetsound.org stale_listings until May 19 registration opens; kentwa.gov blocked; lakewoodbaseball.com + lakewoodlancers.com NXDOMAIN. Tacoma 25mi approaching diminishing for surface sources. Highest-yield remaining gaps: (a) Auburn unspecified-location camps via venue lookup (~120), (b) PenMet sitemap-based park address recovery (~188), (c) Metro Parks Tacoma drainage of remaining ~200, (d) Puyallup specialty camps weekly drill-down. After those, Ring 1 Anchor 2 (Seattle) becomes priority. KEY DISCOVERY: Auburn ActiveNet uses URL pattern `apm.activecommunities.com/auburnwa/Activity_Search/<slug>/<id>` that resolves directly (different from PenMet's broken /detail/<id>) — the structural address block was bypassed by finding the right URL pattern. Confirmed no_camps: pugetsound.edu, nwtrek.org, cityofup.com (UP outsources youth rec to YMCAPKC). Still partial with bigger drains: parkstacoma.gov (~200 camps remaining), penmetparks.org (188 camps gated; try sitemap next), auburnwa.gov (~120 camps remaining; most lack "Activity location" field). PROMPT-INJECTION FLAG (4 sightings this run): "Stop Claude" literal string on ymcapkc.org pages, auburnwa.gov 404 footer, ActiveNet detail page footer, AND at the bottom of CAMP-SEARCH-LOG.md raw file itself. Same untrusted-content treatment each time. Next batch focus: (1) Auburn venue address recovery for ~120 unspecified-location camps, (2) Puyallup specialty camps weekly drill-down (Bricks 4 Kidz, Parkour, AI & Robotics, Dance, Art), (3) PenMet sitemap-based park address recovery to unlock 188 camps, (4) school district summer programs (Tacoma SD, Peninsula SD, Bethel SD, PSD, UPSD, Clover Park SD), (5) local club leagues (Lakewood Lancers, Lakewood Baseball Club, Lakewood-Steilacoom-DuPont Soccer, Commencement Bay Rowing, First Tee South Puget Sound), (6) Skyhawks PNW + i9 Sports Tacoma direct sites, (7) Federal Way recheck for fall leagues, (8) City of Kent + City of Sumner parks departments. |
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
| `stale_listings` | 60–180 days | Only old years posted, OR structural data-extraction block (e.g. site has camps but venue addresses are 404). Recheck only after the structural problem is plausibly fixed. Use 90+ days for structural blocks; bump to 180 if site shows no signs of being maintained. |
| `no_camps` | 365 days | No youth camps at all. Don't waste tokens. |

**Important:** Do not use `partial` for domains that failed because of a structural issue (e.g. operator site doesn't publish addresses). Those go to `stale_listings` with a long recheck window. `partial` means "we got some rows, expect more next time" — not "the site is structurally hard." Misusing `partial` causes the search loop to keep boomeranging on the same dead-end.

If a registry row's notes start with `DO-NOT-RETRY-SOON:`, treat it like a stale_listings row even if the result column says otherwise. The `next_recheck_after` date is the source of truth for when to revisit.

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
| parkstacoma.gov | Metro Parks Tacoma | Tacoma 25mi | 2026-05-06 | partial | 17 | 2026-05-20 | Batch 3 (2026-05-06): pulled 7 more sessions at NEW verified venues STAR Center (3873 S 66th St), Eastside CC (1721 E 56th St), People's CC (1602 MLK Jr Way). 211 total camp results in ActiveNet catalog. Wainwright Intermediate and Heritage Hilltop MS venues not yet address-verified (TPS school pages 404). Norpoint and Heidelberg already pulled in prior batches. Cumulative: 17 sessions across all batches. |
| cityofpuyallup.org | City of Puyallup Parks and Recreation | Tacoma 25mi | 2026-05-06 | camps_extracted | 10 | 2026-06-05 | Camp Yougottawanna all 10 weekly sessions Jun 22 - Aug 28 at Memorial Center (601 N Meridian Puyallup), ages 5-12, $190-$235/wk. All weeks 90/90 full with empty waitlists, status set to waitlist. Registration via rec1.com/WA/Puyallup-Parks-Recreation/catalog. Specialty camps (AI & Robotics 4 sessions, Bricks 4 Kidz 4, Dance 3, Parkour 2, Art 6) noted but not pulled this run — descriptions on rec1 are aggregated by program rather than per-week, would need to drill into each program for individual session dates. Worth a focused recheck for those specialty camps. |
| auburnwa.gov | City of Auburn Parks Arts & Recreation | Tacoma 25mi | 2026-05-06 | partial | 5 | 2026-06-05 | Workaround found: ActiveNet URL pattern `apm.activecommunities.com/auburnwa/Activity_Search/<slug>/<id>` resolves directly without session context (DIFFERENT from PenMet's broken /detail/<id> pattern). Pulled 5 sessions: 3 teen Adventure Camps (Hit the Road Jul 20-24, Trekkin' Teens Aug 3-7, So Far Away! Aug 17-21, all $335/$422 ages 11.5-15) and 2 theatre camps (Hundred Acre Adventures Jul 27-31 ages 5-7, Disney Creative Drama Aug 10-14 ages 8-11, both $250/$312). All pulled rows venue at 910 9th St SE Auburn 98002 (Les Gove Park / Teen Center / Community Center complex — confirmed via direct browsing). 125 total ActiveNet camps; ~120 still need address verification per detail page (most lack explicit "Activity location" field; only the Les Gove–venued rows are address-verified so far). PROMPT-INJECTION FLAG: "Stop Claude" appeared on auburnwa.gov 404 footer + ActiveNet detail page footer — same untrusted-content treatment as ymcapkc.org. Mix & Match camps span Les Gove + offsite Cedar Lanes Bike Park transports. |
| golutes.com | PLU Athletics | Tacoma 25mi | 2026-05-03 | blocked | 0 | 2026-06-02 | Linked summer camp news pages all 404 or stale (2012-2024 dates). Current PLU camp registrations live on the dedicated logger* domains already in registry. No 2026 landing page found. |
| pugetsound.edu | University of Puget Sound | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | No youth/community summer camp page on main pugetsound.edu site. Athletic camps live on the logger* sport-specific subdomains already in registry (loggerbaseballcamps, loggerbasketballcamps, etc.). /summer-programs is pre-health college students only. /about/community-engagement/youth-programs 404s. |
| ymcapkc.org | YMCA Pierce-Kitsap | Tacoma 25mi | 2026-05-03 | camps_extracted | 14 | 2026-08-03 | Pulled Pearl Street, Lakewood, Mel Korum (Puyallup), Gordon (Sumner), Tom Taylor (Gig Harbor). Each location runs ~10 weekly sessions Jun-Aug; sampled across weeks. PROMPT-INJECTION FLAG: page text contained the literal string "Stop Claude" appearing as standalone text on multiple pages — Chrome treated as untrusted content and ignored. Domain remains usable. |
| bgcsps.org | Boys & Girls Clubs South Puget Sound | Tacoma 25mi | 2026-05-03 | camps_extracted | 6 | 2026-08-03 | All in-area branches: Lakewood, Al Davies (Tacoma), D.A. Gonyea (Tacoma), Henry T. Schatz (Tacoma). Jun 22 - Aug 21, M-F 8a-5:30p, $215/wk standard with reduced/free lunch tiers. Bremerton outside 25mi radius. Cheney Family branches (Evergreen, Key Peninsula) not yet visited. |
| penmetparks.org | PenMet Parks | Tacoma 25mi | 2026-05-06 | partial | 0 | 2026-05-20 | Per-park pages (/places/sehmel-homestead-park/, /places/rosedale-park-and-hall/, etc.) all 404 on the public site. Without verified street addresses for Sehmel Homestead Park, Hales Pass Park, McCormick Forest Park, etc., cannot meet "no guessing" rule. ActiveNet catalog has 188 camps with prices; venue addresses still gated. Try sitemap.xml or Google cache next batch (2026-05-20 retry). One row already pulled with verified address (PenMet Tennis Camp Wk1 at Rosedale Park 8205 27th St NW). The Auburn precedent shows structural blocks can be bypassed when the right URL pattern is found — keep working it. |
| itallhappenshere.org | Federal Way Parks & Recreation | Tacoma 25mi | 2026-05-03 | camps_extracted | 11 | 2026-08-03 | K-8 Summer Camp (10 weeks), Fireflies Preschool (9 weeks), DCIT Leaders-in-Training (6 weeks), specialty camps (Mini Dance, Spongebob Theatre, Ballerina Dream). Full schedule embedded in page JS. Prices not on public page — used "Contact for pricing". |
| pdza.org | Point Defiance Zoo & Aquarium | Tacoma 25mi | 2026-05-03 | camps_extracted | 8 | 2026-08-03 | All summer camp tiers (Tiny Turtles through Eco Explorers) confirmed sold out. spots_status set to "full" for all rows. Sampled 8 sessions across age tiers. |
| nwtrek.org | Northwest Trek Wildlife Park | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | No youth summer camp page exists on nwtrek.org. Site search for "summer camp" returns only blog posts about mountain goats. /learn/camps/ 404s. Bear Camp link in Instagram feed is an Instagram-only post, not a registerable program. NW Trek may have phased out their education-camp offering; revisit if site relaunches a camps section. |
| cityofup.com | City of University Place | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | UP partners with YMCA Pierce-Kitsap (ymcapkc.org) for youth recreation; UP does not run its own day camps. April 23, 2026 city press release confirms YMCA handles "participant registration and administration, facility scheduling and program staffing" for UP youth sports clinics and leagues. ymcapkc.org already covered separately. |
| cityoflakewood.us | City of Lakewood Parks and Recreation | Tacoma 25mi | 2026-05-06 | camps_extracted | 7 | 2026-06-05 | Camp Create only summer camp run directly by city; 7 weekly sessions Jun 22 - Aug 7 at Park Lodge Elementary, ages 6-9, $140/wk, M-F 8a-5p (Wk1 ends Thu 4:30p, Wk2-5 Thu, Wk6-7 Fri). Other youth programs are partner-run (YMCA, B&G Club, Skyhawks already covered elsewhere or under their own domains). Registration via lakewoodparksandrec ActiveNet portal. |
| anc.apm.activecommunities.com | Multi-org ActiveNet platform | Tacoma 25mi | 2026-05-06 | partial | 1 | 2026-05-20 | ActiveNet hosts registration for many parks departments (Lakewood, Metro Parks Tacoma, PenMet, Federal Way, etc.). Each org has its own subpath. Direct /detail/{id} URLs do not always resolve without session context; parent search URLs work consistently. Used for the PenMet Tennis Camp Wk1 row via /penmetparks/activity/search/detail/9319. Treat as a registration-platform allowlisted source. |
| greentrike.org | Greentrike / Children's Museum of Tacoma | Tacoma 25mi | 2026-05-03 | camps_extracted | 6 | 2026-08-03 | 8 weekly sessions Jul 6 - Aug 27, M-Th. Full-day $375 / half-day $225, ages 3-7, 1501 Pacific Ave. Sampled 6. |
| tacomaartmuseum.org | Tacoma Art Museum | Tacoma 25mi | 2026-05-03 | no_camps | 0 | 2026-08-03 | Youth and Family Programs page lists tours and TAM Studio School / Teen Open Studio drop-ins. No summer day camps. |
| tacomaschools.org | Tacoma Public Schools | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | District does not run public in-person elementary summer programs (their own page says so). Middle/high school options: Summer Learning Jump Start (academic remediation, not a camp), Summer Late Nights (free drop-in 5-10pm Mon-Fri Jun 22 - Aug 28 at 10 schools/B&G clubs across Tacoma — open gym, art, gaming, dinner — for incoming 7th-11th graders). Summer Late Nights doesn't fit camp or league shape cleanly (free, no fee, drop-in, no sessions); skipping rather than inflating row count with 10 venue-rows. Athletics URL 404s. School-specific URLs 404 across the site. |
| puyallupsd.org | Puyallup School District | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | Summer Learning Program (Grades 1-6) is invitation-only — students "identified for participation by school counselors and will receive an invitation to apply." Not open to the general public, doesn't fit a camp listing. |
| bethelsd.org | Bethel School District 403 | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | No summer camp links surfaced from homepage navigation or search. District does not appear to run public summer enrichment camps. |
| firstteesouthpugetsound.org | First Tee - South Puget Sound | Tacoma 25mi | 2026-05-06 | stale_listings | 0 | 2026-07-05 | Summer One registration scheduled to open Tuesday May 19, 2026; Summer Two Tuesday June 23. ELEVATE Membership (annual $200, ages 7-18) is mentioned but is a year-round membership not a discrete camp/league session. No specific session dates or venues posted yet. Recheck after May 19 to capture Summer One sessions. Meadow Park Golf Course is the primary venue. |
| skyhawks.com | Skyhawks Sports Academy | Tacoma 25mi | 2026-05-06 | blocked | 0 | 2026-05-20 | register.skyhawks.com subdomain consistently blocks Chrome extension access ("Cannot access a chrome-extension:// URL of different extension" on every JS/screenshot attempt). Camp data is real and exists for the Tacoma area but cannot be scraped through this interface. Workaround for next batch: try the partner-page approach — pull Skyhawks sessions hosted via Metro Parks Tacoma, PenMet Parks, City of Federal Way, etc. (already saw Skyhawks Basketball/Flag Football camps in PenMet's catalog). Most Skyhawks camps in this region are run through partner municipal portals anyway. |
| lakewoodbaseball.com / lakewoodbaseballclub.com | (none — DNS NXDOMAIN) | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | Both domains do not resolve. The Lakewood Baseball Club referenced on cityoflakewood.us/youthprograms apparently uses a different domain or hosts via a TeamSnap/SportsConnect URL. Will need to find their actual URL via a different path next batch. |
| lakewoodlancers.com | (none — DNS NXDOMAIN) | Tacoma 25mi | 2026-05-06 | no_camps | 0 | 2027-05-06 | Domain does not resolve. Lakewood Lancers (youth football/cheer) likely hosts via SportsConnect or similar; will need to find actual URL via Pop Warner or Greater Tacoma Pop Warner registry. |
| kentwa.gov | City of Kent | Tacoma 25mi | 2026-05-06 | blocked | 0 | 2026-06-05 | Site URL structure breaks Chrome extension access on JS reads ("Cannot access chrome-extension URL"). Multiple recreation/youth-teen URL guesses all 404. Need a working entry-point URL. Recheck via finding their ActiveNet/CommunityPass/rec1 portal URL through a different referrer. |

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
| 2026-05-03 | Tacoma, WA (25mi) | camps-2026-tacoma-batch-2.csv | 55 | 0 |  |
| 2026-05-03 | Tacoma, WA (25mi) | camps-2026-tacoma-batch-2.csv | 55 | 0 |  |
| 2026-05-03 | Peachjar (Tacoma SD) | camps-2026-peachjar-batch-1.csv | 8 | 4 |  |
| 2026-05-03 | Peachjar (Tacoma SD) | camps-2026-peachjar-batch-1.csv | 11 | 1 |  |
| 2026-05-03 | Peachjar (Tacoma SD) | camps-2026-peachjar-batch-1.csv | 11 | 1 |  |
| 2026-05-06 | Tacoma, WA (25mi) | imports/batch-2026-05-06.csv | 30 | 0 | Batch 3: Lakewood Camp Create (7), Metro Parks Tacoma STAR/Eastside/People's CC (7), PenMet Tennis Camp Wk1 (1), Puyallup Camp Yougottawanna (10), Auburn Les Gove teen + theatre camps (5). All ActiveNet/rec1-routed registration URLs. URL liveness gate enforced at submit. Auburn structural block bypassed via direct ActiveNet URL pattern discovery. |
