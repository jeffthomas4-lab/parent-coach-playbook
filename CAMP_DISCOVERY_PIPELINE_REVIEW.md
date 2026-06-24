# Camp Discovery Pipeline: Outside Review + Corrected Plan

Date: 2026-06-23
Scope: the pasted "ParentCoachDesk Camp Discovery + Cloudflare Worker" plan, reviewed against everything already built across parent-coach-playbook and ActivityRadar.
Posture: outside consultant, website infrastructure. Direct read.

---

## Headline: the system in the pasted plan already exists. It is ActivityRadar.

The pasted prompt is written as a clean-sheet build. It is the third copy of a system you have already built and largely shipped. Building it would waste months and fork a schema that is already live and already holding your data.

Here is the ground truth, pulled from the repos, not from the plan:

**A shared Cloudflare D1 named `activity-radar` (id `8cc3694a-...`) already holds 196,252 organizations.** That is 910 orgs derived from your camp migration plus **195,342 youth-activity nonprofits loaded from the IRS Exempt Organizations Business Master File** (NTEE codes N, O, and the arts-education subset of A). This is the "192,000 organizations" from the conversation. They are already imported. Each stub carries its EIN and `source_dataset='irs_eo_bmf'`, is marked `record_source='import'`, `record_status='unverified'`, has no programs or lat/lng yet, and is hidden from parent search until a discovery pass enriches and promotes it.

**The org-centric schema the plan asks for is built and migrated.** `organizations`, `programs`, `sessions`, `activity_categories`, `trust_signals`, `search_events`, plus carried-forward operational tables (claims, reviews, featured listings, domain_quality, geocoded_addresses). Field names follow the F&F Entity Dictionary. The 1,701 approved camp rows are already migrated in as programs under deduplicated orgs.

**The workers the plan asks for already exist** on the same shared D1: an hourly `activityradar-enrichment` cron worker, a `camp_scan_queue` that fires automatically when an org website is found, and a Yelp enrichment worker. There is also a demand-triggered `enrichment_queue` whose priority climbs every time a parent searches an org.

**The "one database, two front doors" decision is already settled and documented.** ActivityRadar is the structured-search door. parentcoachdesk.com/camps is meant to become an editorial filtered view (`program_type='camp'`) reading the SAME database. parent-coach-playbook does not own org data and should not grow its own org schema. (`ActivityRadar/00-ARCHITECTURE.md`.)

**You also already wrote the spend gate.** `ActivityRadar/buildout/WEBSITE-RESOLUTION-HIT-RATE-TEST-2026-06-15.md` says: before paying to resolve websites for all 195k stubs, run a 2,000-org WA/OR sample through name+city search, measure the resolved-correct rate, and only buy full-file enrichment if it clears 60%.

So Parts 2, 3, 4, 8, 11, 12 of the pasted plan are re-implementations of shipped code. The schema, the IRS backbone, the workers, the import path, the review queue, the confidence model, the public verification fields: built.

---

## What the pasted plan got right (keep these ideas, they are already in the build)

- Organization as the permanent object, programs/camps hanging off it. Correct, and already the schema.
- Provenance per source URL, confidence, refresh cadence. Already modeled.
- 10-engine search rotation for the discovery pass. Good hygiene, and it belongs in the discovery step that is not yet built.
- The minor-data and legal guardrails (Part 7): block `/admin`, `/login`, `/checkout`; red-flag roster/DOB/medical/parent-email; respect robots.txt; store facts and short excerpts, never full page bodies. Non-negotiable for a parent-facing youth product. Make sure these are wired into the discovery worker explicitly.
- Public "Last verified on [date]" + confidence + claim/edit/remove. Correct framing. Never "guaranteed accurate."

## What the pasted plan got wrong

- It assumes zero prior work. The single most expensive error here. It would rebuild ActivityRadar under a new name in parent-coach-playbook's own D1.
- The 5-month, 1,250/day national browser march. You do not crawl 195k stubs blind. You run the hit-rate gate first, then enrich only what resolves, and you discover by geography you can sell against (Ring 1 Puget Sound first), not a flat national sweep. Browser search at that volume also trips bot detection, Google first.
- It conflates two runtimes. The schedulable half (verify, scan, extract, refresh) is a Cloudflare cron worker and already exists. The discovery half (org stub -> website URL) is a Chrome agent session or a paid SERP API (Outscraper/Serper/SerpAPI per your own gate doc), run in capped batches against the enrichment queue. Keep them separate.

---

## The real remaining work (this is the actual to-do list)

Your own docs already name what is not done. None of it is "build the schema" or "build the worker." It is:

1. **Run the website-resolution hit-rate gate.** Pull the 2,000-org WA/OR stratified sample from `organizations` where `source_dataset='irs_eo_bmf'`. Run name+city search (Outscraper is the cheap first choice per your doc). Score with the match-confidence rules. Read the five numbers. The go/no-go threshold is already set: 60% resolved-correct = buy full-file enrichment; 40-60% = enrich only the NTEE bands that passed; under 40% = municipal-platform crawl (ActiveNet, CivicRec, Daxko, YMCA, Boys & Girls Club) jumps ahead of IRS-first. **This gate decides everything downstream. It runs before any large spend or crawl.**
2. **Geocode the IRS stubs.** ZIP centroids now (you have the Census gazetteer in `buildout/gaz`), exact geocode when a site address is found. Without lat/lng the stubs cannot appear in radius search.
3. **Build the website-discovery pass** (the part that is genuinely missing). Feed the enrichment queue, run org -> website resolution with the 10-engine rotation or a SERP API, write candidates with confidence, and let the existing `camp_scan_queue` + enrichment worker take it from there. Wire in the Part 7 guardrails here.
4. **Promote enriched orgs.** Any stub that comes back with a confident website and at least one live program flips `record_status` from `unverified` to `active` and enters parent search.
5. **Re-point parentcoachdesk.com/camps to the shared `activity-radar` D1** (the documented Phase 5). Add the second D1 binding to `parent-coach-playbook/wrangler.jsonc`, rewrite `/camps` to read the shared API filtered to `program_type='camp'`, verify nothing on the live site regresses.

Sub-agents, defined as reusable roles that mirror the Field & Forge directory agents you already wrote briefs for, not a new camp-only vocabulary:
- **Coverage-Planner** — picks the next geography/ring and the day's capped batch off the enrichment queue.
- **Discovery agent** — runs org -> URL resolution (Chrome rotation or SERP API), writes candidates.
- **Confidence-Scoring agent** — one shared scoring function, not a camp-only fork.
- **Review agent** — drains the low-confidence and guardrail-flagged queue.

---

## Sequence before any scrape

Gate: nothing scrapes at scale until the hit-rate test has a number and Ring 1 is proven.

1. Run the hit-rate gate on the WA/OR 2,000-org sample. Read the five numbers.
2. Geocode the Ring 1 (Puget Sound) stubs.
3. Build the discovery pass with guardrails. Run it on Ring 1 only, capped daily.
4. Let the existing enrichment + camp_scan workers process Ring 1. Confirm guardrails block what they should, no minor data lands, the review queue catches low confidence.
5. Promote the Ring 1 orgs that resolve. Re-point parentcoachdesk.com/camps to the shared DB and verify the live site.
6. Only then open the throttle, geographically (Ring 1 -> Oregon -> Idaho) and seasonally, never a flat national 1,250/day march.

---

## Bottom line

Does the plan make sense? The architecture does, and you already proved it by building it. ActivityRadar is the org-intelligence system the pasted prompt describes: shared D1, 196k orgs including the full IRS backbone, org/program/session schema, enrichment and camp-scan workers, search UI, demand logging, and a written spend gate.

So the honest move is not to build the pasted plan. It is to finish ActivityRadar's open passes: run the hit-rate gate, geocode and discover Ring 1, promote what resolves, and re-point parentcoachdesk to the shared database. Build the discovery pass and prove it on a few hundred Puget Sound orgs before pointing anything at 195,000.

The thing that is missing is not infrastructure. It is the discovery pass and the decision the gate test produces. Everything else is already standing.
