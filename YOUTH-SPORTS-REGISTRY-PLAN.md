# National youth sports registry: staged plan

**Date:** 2026-07-23. **Owner:** Jeff Thomas.
**Scope:** every recreation league, club league, and club in the country, captured into one registry. PCD is the public front door (camps today, clubs and leagues next). SightSmash gets a private sales view behind it. This closes PCD operating manual open item 8 (the lead-gen sub-plan that was never written as a staged plan) and extends it past camps.
**Input reviewed:** the ChatGPT "National Youth Sports Organization Capture System" plan, pasted 2026-07-23.

---

## The verdict on the ChatGPT plan

The architecture is right. We know because we built it twice: ActivityRadar is the youth-sports registry it describes, and the MedConfRadar directory workforce (23 registered agents: coverage planner, discovery, entity resolution, dedup, change detection, confidence scoring, suppression lock, contact gate) is the agent roster it describes. The 2026-06-23 outside review (`CAMP_DISCOVERY_PIPELINE_REVIEW.md`) caught the third clean-sheet copy of this system. The ChatGPT plan is the fourth.

So we do not build its schema, its five scheduled routines, or its national search march. We keep four of its ideas (section below) and spend the build time finishing the passes that are actually open.

## What is already standing

- Shared D1 `activity-radar` holds **196,252 organizations**: 910 from the camp migration plus 195,342 youth-activity nonprofits from the IRS EO Business Master File (NTEE N, O, and the arts-education slice of A), each with EIN and provenance, hidden from search until enriched. 1,701 approved camps are migrated in as programs.
- The org → program → session schema follows the F&F Entity Dictionary (entities 12 and 13). `organization_type` already includes `club_league`. `activity_category` is already a controlled vocabulary with soccer, basketball, volleyball, football, and the rest.
- Workers exist: hourly `activityradar-enrichment` cron, `camp_scan_queue` that fires when a website is found, demand-triggered `enrichment_queue` whose priority climbs with parent searches, `search_events` demand logging.
- The spend gate is written: 2,000-org WA/OR sample, name+city resolution, 60% resolved-correct buys full-file enrichment, 40-60% enriches only the NTEE bands that passed, under 40% flips to the municipal-platform crawl (ActiveNet, CivicRec, Daxko, YMCA, Boys & Girls Club).
- The minor-data guardrails are written: block /admin, /login, /checkout; red-flag roster, DOB, medical, parent-email content; respect robots.txt; store facts and short excerpts, never page bodies.
- The healthcare side proved the sensitive patterns: suppression enforced at reveal time so an opt-out survives every refresh (D-031), contact inference gated per domain, append-only conflict logging instead of silent overwrites.

The IRS backbone already contains the clubs and leagues. NTEE N is sports clubs, leagues, and recreation. "Capture every league and club in the country" is not a new acquisition problem. It is the same enrichment problem the camps already have.

## The four ChatGPT ideas we keep

1. **Technology signals.** Record which platform each org runs on (SportsEngine, TeamSnap, LeagueApps, GameChanger, GotSport, Exposure, Crossbar, Hudl, Veo, Pixellot, plus payments and email providers) as observed signals: provider, signal type, source URL, observed_at, confidence. Extracted by the existing enrichment worker, stored in a new dictionary-defined table. This is the SightSmash segmentation engine. "Volleyball club, three locations, separate registration vendor, no streaming" beats "club with an email address."
2. **Separate scores, not one lead score.** Directory confidence (we have it: record quality score), PCD usefulness, SightSmash fit, sponsored-content fit. The two fit scores live in a private sales table, never on the public record.
3. **Organization relationships.** Parent org, branch, club-owns-league, national affiliate, rebrand. The healthcare `relationships` edge table is the pattern. Needed the moment a YMCA branch and its metro association both resolve.
4. **The org-type coverage checklist.** PAL chapters, military-base programs, tribal programs, adaptive, homeschool, faith-based leagues. These become rows in the coverage planner's matrix, not new entity types. Most map to existing `organization_type` values; the gap list goes to the Entity Dictionary addendum first.

## What we reject

- A new schema. We extend the live one, dictionary entries before tables (the D-028 lesson).
- Claude as the crawler on a two-hour clock. Browser search at volume trips bot detection. The schedulable half is cron workers that already exist. The discovery half is capped SERP-API batches (Outscraper first, per the gate doc). Claude supervises and drains exceptions.
- The flat national 1,250/day march. Rings, gated by the hit-rate number and by geography we can sell against.
- Outreach blended into discovery. Separate system, last stage.

---

## The stages

### Stage 0: unblock and gate (now, inside PCD Phase 0)

PCD Phase 0 leaks stand in front of everything, and two of them are this system's own plumbing: the camps cron frozen since May 9 is the registry's heartbeat, and the 296-page 500 is the public surface this data feeds. Fix those per 08-roadmaps.

Then run the website-resolution hit-rate gate. Pull the 2,000-org WA/OR stratified sample from `organizations` where `source_dataset='irs_eo_bmf'`, resolve, score, read the five numbers. The gate decides everything downstream. Nothing scrapes at scale before the number exists.

### Stage 1: Ring 1, Puget Sound

Geocode the Ring 1 stubs (ZIP centroids from the Census gazetteer now, exact geocode when an address resolves). Build the discovery pass, the one genuinely missing piece: org stub to website URL, guardrails wired in, capped daily batches feeding the existing queues. Promote any stub that returns a confident website plus one live program from `unverified` to `active`.

Ring 1 is also the SightSmash beachhead on purpose. The founding cohort is one youth club plus the Northwest Conference, and the binder already called Tacoma and Puget Sound as the directory seeding priority. Prove the loop on a few hundred local orgs before pointing anything at 195,000.

### Stage 2: clubs and leagues become first-class on PCD

Entity Dictionary addendum first: add `program_type` values `league`, `club_season`, `clinic`, `tournament` beside `camp`; add the sport-alias map (fastpitch to softball, futsal to soccer, AAU to basketball plus affiliation) into the `activity_category` vocabulary; define `organization_relationships` and `technology_signals` tables. Then the PCD surface grows from /camps to a clubs-and-leagues view reading the same D1 with a different `program_type` filter. Same database, one more front door. No SightSmash code involved.

### Stage 3: the private sales view

Add technology-signal extraction to the enrichment worker. Build `sightsmash_fit` and `sponsored_content_fit` scoring in a private `sales_intelligence` table. SightSmash reads it by organization ID, read-only. The binder's boundary rule holds: directory layer public, operations and sales layers private, no D1 merge, join by ID. Anything that crosses into SightSmash proper stays governed by Plan 041 (H-053). Discovery lives at parentcoachdesk.com per D-048; there is no discover.sightsmash.com.

### Stage 4: rings out

WA, then OR and ID, then national. Each ring opens when the prior ring's coverage metrics hold and the gate result for its NTEE bands says enrichment pays. Seasonal cadence beats calendar cadence: registration windows and camp cycles set refresh priority through the demand-triggered queue that already exists.

### Stage 5: outreach, last and separate

No outreach system until there is something to sell. SightSmash's current path ships the parent scoring app before the ops platform, so SightSmash sales outreach waits for a sellable product. PCD sponsored and featured listings can monetize earlier, but the $79/yr listings are blocked on the open terms-of-use Critical until the lawyer pass closes it.

When outreach does get built: verified org, publicly listed business contact only, no guessed or pattern-inferred emails for this vertical, human approval per campaign, CAN-SPAM complete. One global suppression table shared across every F&F business, enforced at reveal time like the healthcare lock, so a club that opts out of SightSmash mail never gets a PCD sponsorship pitch by accident.

---

## Scheduled tasks (the actual answer to the original question)

Three, not five, and the heavy lifting is deterministic:

1. **Hourly:** the existing `activityradar-enrichment` cron, revived (Stage 0).
2. **Daily:** one capped discovery batch. A Cowork scheduled task runs the batch off the enrichment queue for the active ring, handles exceptions, and posts a run report (queries done, candidates, promotions, guardrail flags, review items).
3. **Weekly:** coverage and QA. Ring status, per-NTEE-band resolution rates, duplicate review queue depth, stale-record counts, next-ring recommendation.

Claude is the supervisor and exception handler: ambiguous dedup, guardrail-flagged pages, review-queue drains, coverage calls. The crawl itself is workers and capped API batches, same division of labor the healthcare unit runs on.

## Priority guard

Stages 0 through 2 are PCD Priority 1 work and fit the current build stack. Stage 3 is cheap once signals flow but is SightSmash-facing; it does not jump the parent scoring app in the queue. Stage 5 waits on product. If a session has to choose, the order is: Phase 0 leaks, hit-rate gate, Ring 1, and only then anything with SightSmash's name on it.

## Decisions to log in the Decision Journal on approval

1. ActivityRadar (the shared `activity-radar` D1) is the national youth sports registry for the whole portfolio. No parallel capture system gets built, in any repo, under any name.
2. Clubs and leagues ship as `program_type` extensions on the existing schema, Entity Dictionary first.
3. Sales intelligence is a private layer joined by organization ID. Public directory ranking never reads sales fields.
4. One global suppression table across all F&F outreach, reveal-time enforcement.
5. Outreach is a separate gated system and waits for a sellable SightSmash product.
