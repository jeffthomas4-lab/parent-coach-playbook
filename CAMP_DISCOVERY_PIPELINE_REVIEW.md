# Camp Discovery Pipeline: Outside Review + Build Plan

Date: 2026-06-23
Scope: the pasted "ParentCoachDesk Camp Discovery + Cloudflare Worker" plan, reviewed against what is already live in this repo.
Posture: outside consultant, website infrastructure. Direct read, not a cheerleader.

---

## The one thing to fix before anything else

The pasted plan is a clean-sheet design. It assumes you are starting from zero. You are not.

This repo already runs about 70% of what that plan describes, in production, against a live D1 database. The plan would have you build a second, parallel system next to the one you already have, with a colliding schema and a duplicate worker. That is the expensive mistake here, and it is the only one that actually matters today.

The right move is not "build the plan." It is "extend what exists." Same outcome, a quarter of the work, and you do not orphan the data already in the database.

---

## What you already have (and the plan ignores)

Live D1 database `parent-coach-playbook` (id `8336fa9f-...`), with these tables already in production:

- `camps` — the destination table. Already has `confidence`, `source_domain`, `url_health_status`, `url_last_checked_at`, `reject_reason_code`, `awaiting_review`. The pasted plan proposes a fresh `camps` table with different column names. That is a rename for no reason and it breaks every page already querying the live one.
- `search_anchors` — geographic search areas with expansion **rings** (ring 1 = Puget Sound core), status (`not_started` → `in_progress` → `saturated` → `diminishing`), and recheck timing. **This is your discovery queue.** The plan wants to invent one. You built it in migration 0007.
- `search_domains` — the domain registry: per-domain result state (`camps_extracted`, `partial`, `blocked`, `stale_listings`, `no_camps`), `camps_pulled`, `next_recheck_after`, `permanent_skip`. **This is your "don't rediscover a known site" layer.** The plan calls that a long-term goal. You already shipped it.
- `search_batches` — one row per import run, with rejected counts. That is your batch audit trail.
- `domain_quality` — per-domain approved/rejected/confidence rollups. That is source-trust scoring, already running.
- `link_health` + the `parent-coach-playbook-link-checker` worker — a Cloudflare cron worker that re-checks ~50 URLs per run on a 180-day rolling cadence, follows redirects, records status codes, finds Wayback snapshots. **This is your verification/refresh worker.** The plan proposes `parentcoachdesk-camp-refresh-worker` to do the same job from scratch.
- `submitters` + trust tiers, `awaiting_review` (bulk imports go live immediately but stay in the admin queue), claim-listing tables, featured listings.
- An import pipeline: `scripts/process-imports.py`, `scripts/import-camps-csv.mjs --auto-approve` gated by `BULK_IMPORT_TOKEN`, plus the `imports/` folder full of harvested CSVs by sport (basketball, soccer, baseball, tennis, volleyball, golf) and a working `claude-in-chrome-prompt.md`.
- A second cron worker (`parent-coach-playbook-cron`) firing the Pages deploy hook daily so future-dated content goes live.

So the discovery queue, the domain registry, the refresh worker, the confidence column, the review queue, and the Chrome harvest flow all exist. The plan's Parts 2, 3, 4, 8, 11, and 12 are largely re-implementations of shipped code.

---

## Where the pasted plan is genuinely right

Credit where due. Keep these ideas, they are better than what is in the repo today:

1. **Separate `organizations` from `camps`.** Right now a camp row carries its own org data inline. The plan's instinct to make the **organization** the permanent object, with camps as one extracted product hanging off it, is correct and is the thing worth adding. This is the single upgrade that makes the system reusable for ActivityRadar/SightSmash later. Add an `organizations` table and a foreign key. Do not rebuild `camps` around it; extend.
2. **`organization_sources` provenance.** Storing each URL (homepage, programs page, registration, social, third-party registrar) with robots state and content hash is good and you do not have it cleanly today. Add it.
3. **Search-engine rotation across 10 engines.** Sound bootstrap hygiene. Your existing Chrome flow leans on a smaller set. Spreading load is the right call.
4. **The legal/minor-data guardrails (Part 7).** Block `/admin`, `/login`, `/checkout`; red-flag roster/DOB/medical/parent-email; respect robots.txt; store facts and short excerpts, never full page bodies. This is non-negotiable for a parent-facing youth product and it should be written down exactly as the plan has it.
5. **Public "Last verified on [date]" + confidence + claim/edit/remove.** Correct framing. Never say "guaranteed accurate." Keep this.

---

## Where the plan is wrong or risky

**The 5-month math is the real problem, and the plan buries it.** 190,000 orgs at 1,250 searches/day is 152 days of someone (or some browser) running Chrome searches every single day without a miss. That is not a bootstrap, that is a part-time job for half a year, and it assumes zero days lost. Three hard truths:

- **You do not need 192,000 orgs to launch.** ParentCoachDesk's value is camps a parent can actually drive to. Ring 1 (Puget Sound) is a few hundred orgs. The first 1,000 good camps beat 50,000 mediocre national rows nobody clicks. Discovery should be demand-pulled by geography you can monetize, not a national sweep. The plan even says "beachhead," then immediately specs a 190k national crawl. Pick one. It is the beachhead.
- **The 192,000-org list already exists, and so does the gate for it.** It is the IRS Exempt Organizations Business Master File in `Outputs/ActivityRadar/buildout/bmf/` (eo1/eo2/eo3, 195,342 stubs), filtered to NTEE groups N, O, and the A arts subset. Each stub has name, city, state, zip, EIN, and **no website**. You already wrote the decision gate: `ActivityRadar/buildout/WEBSITE-RESOLUTION-HIT-RATE-TEST-2026-06-15.md`. That doc says run a 2,000-org WA/OR sample through name+city search, measure the resolved-correct rate, and only buy full-file enrichment if it clears 60%. **That gate runs before any national worker. It is step zero, and you already designed it.** The pasted plan ignores it and would start crawling 195k stubs with no idea what fraction even have a findable site.
- **Browser search at that volume looks like a bot and will get blocked**, Google first. The plan acknowledges this, then sets a pace that runs into it daily for 5 months. Sustainable means seasonal and geographic, not 1,250/day forever.

**"Claude Chrome searches 500–1,250 orgs/day" is not a schedulable task, it is a human or an always-on agent session.** The instruction said build a *scheduled task*. A Cloudflare cron cannot drive Claude-in-Chrome. So be clear about which half runs where: the **worker** (verify, crawl, extract, refresh) is schedulable and should be a cron. The **discovery** half (org → URL) is a Chrome agent session you trigger, in capped daily batches, against a queue. Two different runtimes. The plan blurs them.

**AI extraction cost and drift.** "Use AI only when deterministic fails" is right, but at scale even 10% AI fallback across tens of thousands of pages is real money and real variance. Cap it, log every AI extraction with its source hash, and keep the human review queue as the backstop. You already have `awaiting_review` for exactly this.

**Schema collision.** Adopting the plan's table definitions verbatim drops a second `camps`/`crawl_jobs`/`review_queue` set beside your live ones. Migrations must be additive (`ALTER TABLE`, new tables with FKs), never a parallel universe.

---

## Recommendation: extend, don't rebuild

Same destination as the pasted plan. Different, cheaper route that respects what is already shipped and already holding data.

**Keep and reuse:** `camps`, `search_anchors` (discovery queue), `search_domains` (known-site registry), `search_batches`, `domain_quality`, `submitters`, `awaiting_review`, the link-checker worker, the import scripts, the Chrome harvest prompt.

**Add (the real new work):**

- `organizations` table — the permanent entity. `camps.organization_id` FK added via additive migration.
- `organization_sources` table — per-URL provenance, robots state, content hash, source type.
- A `crawl_jobs` queue table — but feed it from `search_domains`/`organizations`, not a new parallel store.
- Worker upgrade: extend the existing link-checker worker (or add a sibling worker on the same D1 binding) to do homepage verify → camp-page discovery → extraction → write camps + sources. Reuse its cadence logic.
- The 10-engine rotation + the minor-data guardrails, wired into the Chrome discovery prompt you already have.
- Public verification fields on camp pages.

**Sub-agents (the part you asked to build before scraping):** define them as reusable roles, mirroring the Field & Forge directory agents you already wrote briefs for (Coverage-Planner, Confidence-Scoring, Change-Detection, Entity-Resolution). Do not invent a new agent vocabulary for camps. The healthcare directory already solved confidence scoring, change detection, and entity resolution as agent briefs. Port the same roles:
  - **Coverage-Planner** — picks the next anchor/ring and the day's org batch from the queue. Caps the batch.
  - **Discovery agent** — runs the Chrome org → URL pass with engine rotation, writes candidates.
  - **Verification/Extraction agent** — the worker logic above.
  - **Confidence-Scoring agent** — one scoring function, shared with the directory, not a camp-only fork.
  - **Review agent** — drains the low-confidence / guardrail-flagged queue.

---

## Phased build order (before any scrape)

Decisions made (2026-06-23): extend the live system, not rebuild. Ring 1 Puget Sound first. The 192k list is the IRS EO BMF already in ActivityRadar.

Gate: nothing scrapes until phases 1–4 are built and tested on Ring 1 only.

1. **Align the `organizations` schema with ActivityRadar, don't fork it.** Your ActivityRadar hit-rate doc already specifies the org schema: `record_source`, `source_dataset='irs_eo_bmf'`, `record_status` (`unverified` → `active`), confidence tagging, `social_only`/`review` buckets, geocode-from-ZIP. Use those exact fields so ParentCoachDesk and the national ActivityRadar backbone are one schema, not two. This is the single most important decision: PCD Ring 1 is the proving ground, ActivityRadar is where the national backbone lives, and they must share the org table or you rebuild later.
2. **Additive schema migration** — `organizations` (ActivityRadar fields), `organization_sources`, `camp.organization_id`, `crawl_jobs`. New migration files `0011`–`00NN`, applied to remote D1. No table renames.
3. **Worker** — extend/clone the link-checker worker: verify candidate URL → discover camp pages → extract → write `camps` + `organization_sources` → update confidence → set `next_recheck_after`. Cron-scheduled. Tested against ~25 known Ring 1 orgs first.
4. **Scheduled task + sub-agents** — the Coverage-Planner scheduled task that proposes the daily capped batch; the agent role definitions; the Chrome discovery prompt updated with 10-engine rotation and the Part 7 guardrails.
5. **Dry run on Ring 1 (Puget Sound) only.** Real but small. Verify guardrails actually block what they should, verify no minor data lands, verify the review queue catches low confidence.
6. **Then, and only then, open the throttle** — and even then geographically (Ring 1 → Oregon → Idaho), seasonally, not a flat 1,250/day national march.
7. **National enrichment is its own gated decision, owned by ActivityRadar.** Before spending on full-file resolution of the 195k IRS stubs, run the WA/OR 2,000-org hit-rate sample you already specced. If resolved-correct clears 60%, buy the enrichment; between 40 and 60, enrich only the NTEE bands that passed; below 40, the municipal-platform crawl (ActiveNet, CivicRec, Daxko, YMCA, Boys & Girls Club) jumps ahead of IRS-first. That gate runs before any national worker, and its output feeds the same `organizations` table Ring 1 uses.

---

## Bottom line

Does the plan make sense? The architecture instinct does: organization as the permanent object, camps as the first product, provenance and confidence and a refresh loop around it. That is the right system.

The execution plan as written does not, for one reason: it rebuilds what you already shipped and commits you to a 5-month national crawl when a Ring-1 beachhead launches faster and is the stated strategy anyway. Extend the live system, add the `organizations`/`sources` layer, reuse the workers and queue you already have, port the directory agents instead of inventing camp-only ones, and discover by geography you can sell against rather than by raw count.

Build the infrastructure first, as you said. Then scrape Ring 1. Prove the loop on a few hundred orgs before you point it at 192,000.
