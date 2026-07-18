# PCD AI Operating System: Roadmaps and Build-Out Program

**Version:** draft 0.1, 2026-07-18
**Status:** Execution and learning program. This file turns the 00 through 06 design into running code, one governed phase at a time. It builds nothing by itself. It orders what gets built, in what sequence, to what standard, and what each phase teaches.
**Relationship to 00-FOUNDATIONS.md:** Subordinate. Foundations sets the principles, the roster, the action and risk classes, and the confidence bands. This file schedules their adoption. Where the two disagree, Foundations wins until Jeff amends it.
**Relationship to PCD-OPERATING-MANUAL.md:** Subordinate. The manual (v1.4) governs how PCD runs today. Every phase below graduates into the manual through the same gates everything else clears. Nothing here overrides the constitution, the HUMAN GATE, the RED WALL, or maintenance mode.

This is the file that answers a different question than the rest of the folder. The other files ask "what is the company." This one asks "what do we build Monday, why that and not the next thing, how do we know it is done, and what does Jeff learn by building it."

---

## 1. Why this file reads differently

Jeff's stated objective for this program is not "validate ParentCoachDesk as fast as possible." It is "use a real business to learn the full lifecycle of building a secure, compliant, automated software company." That objective changes the math.

Under a pure business-validation lens, most of the 17 departments are premature. Under a learning lens, they are the curriculum, and the discipline is building them in an order where each one teaches a real layer and leaves the product healthier than it found it. The business remains measured. Weak traffic changes the product strategy. It does not end the program.

Two outside reviews (Claude and ChatGPT) and Jeff converged on the same governing rule: keep the whole architecture, but convert it into a sequence of completed, production-quality capabilities, never 30 half-built systems running at once. This file is that sequence.

---

## 2. Starting truth, honest

Design from this, not from zero. Numbers are the 2026-07-14 audit and the 2026-07-15 verification, held to the "designed vs built vs running" rule.

- **Product is roughly 90% built. Distribution is roughly 10% built.** Any phase that moves traffic, links, subscribers, or revenue outranks any phase that makes the machine more elegant. This is the binding constraint and it sets the phase order.
- **Automation is ~70% on analysis and drafting, ~10% on shipping.** The agents draft and report. Almost nothing crosses the last inch to shipped. The rules-watcher writes drafts nothing publishes. The Friday Letter is written weekly and has never been sent.
- **Seven agents exist, specced and registered** (Barnabus, Nora, Ed, Frida, Hal, Ranger, Vera; Sunny built and paused). They are governed on paper and, Vera excepted, ungoverned in production until each deployed prompt reads its own skill file and logs.
- **Five known leaks were in flight as of the 2026-07-15 handoff:** the deletion monitor pointed at the wrong inbox, a camps cron frozen since May 9, a burned OpenAI key, a stale revenue build, a never-sent newsletter. Plus one live bug: 296 of 1,554 camp pages return HTTP 500 on a null `session_end_date`.
- **Calendar constraint:** PCD idles August through November. Report-only, no writes, no build work, with the S4 deletion watch as the single year-round exception. It is 2026-07-18 now. The pre-August window is short, so Phase 0 and Phase 1 are the only phases that realistically land before the idle. The rest resume in December.
- **Priority note, from My Company.md:** LegisRadar is the stated Priority 1 "until fully working." This program is portable to LegisRadar and every Field & Forge site. See section 9 for the one decision that resolves this.

---

## 3. How every build session runs (the rules that do not change)

These bind each phase. A phase is not done unless all of them are satisfied.

1. **One vertical slice at a time.** Build one complete pathway end to end (data, worker, auth, UI, log, gate, deploy) before widening it. The slice is not the cheap way. It is the correct way to learn systems engineering: understand every layer on one path, then extend the pattern.
2. **One capability at a time.** A session finishes its capability, tests it, documents it, logs it, and reports before the next starts. Nothing half-built moves forward.
3. **The constitution gates hold.** HUMAN GATE on sends, purchases, payments, deletions, publications. RED WALL and FAMILY FIREWALL on anything touching recruits, players, children, or families. SOURCE RULE on every claim. VOICE RULE and the anti-AI writing guide on every word. CANARY auto-pause on two failures in 24 hours, Vera excepted.
4. **The Website Build Standard pillars in scope get checked and fixed.** No capability ships with an open Critical in any pillar it touches. Update `STANDARD-AUDIT.md` and `SECURITY-AUDIT.md`. Run the relevant `/web:` reviewer. Run `/web:commit-check` on the session diff before the final commit.
5. **Prompts as code.** Every agent prompt lives in git with a version, an owner, an input and output schema, and test cases. The current out-of-git SKILL.md storage is a named defect; closing it is part of Phase 0.
6. **Deploy and back up through the norm.** PowerShell only. Deploy commands come from `About Me/Deployments.md`, never invented. Order is build, test, git add and commit, wrangler deploy, git push. A planning-only change skips the wrangler step and says so.
7. **QA before close.** Any session that touches a user-facing feature runs the QA norm: happy path, chaos path, and the emotion check for the relevant parent persona. Log Criticals and Highs before closing.
8. **Designed vs built vs running, always.** Every status line in every doc distinguishes the three. Do not round up. A finished-looking table that implies more than shipped is itself a defect.

**The Claude and Codex handoff, per capability:**

1. Write the spec as a work item: goal, acceptance criteria, the pillars in scope, known risks, the commands to verify.
2. Claude Code builds on a feature branch and writes the tests.
3. Automated tests run (Vitest unit and integration, Playwright where a page changed).
4. Codex reviews the diff against the spec, adds missing tests, flags defects. It gets the full context, never just "review Claude's work."
5. Claude addresses findings. `/web:commit-check` runs on the diff.
6. Jeff approves anything the HUMAN GATE covers.
7. Merge, deploy to the staging worker, smoke test, promote to production.

**Definition of done, global.** A capability is done when it is deployable, tested, documented, recoverable, logged, gated, and standard-clean. Seven words. If any one is missing, it is in progress, not done.

---

## 4. The learning spine

The program teaches these layers in roughly this order. Each maps to phases in section 5, so the curriculum and the build are the same list read two ways.

| # | Layer learned | Where it is taught |
|---|---|---|
| 1 | Product requirements, architecture, decisions | Phase 0, and every spec |
| 2 | Git, branches, reviews, environments | Phase 0 |
| 3 | Data modeling and migrations | Phase 3 (deep), Phase 0 (first contact) |
| 4 | Workers, D1, R2, Queues, Workflows | Phase 1 and Phase 3 |
| 5 | Auth, authorization, tenant boundaries | Phase 1 and Phase 7 |
| 6 | Crawling, extraction, provenance, data quality | Phase 3 |
| 7 | Editorial production and content lifecycle | Phase 1 and Phase 2 |
| 8 | Affiliate tracking and disclosure control | Phase 4 |
| 9 | Search, geography, public UX | Phase 5 |
| 10 | Email, newsletters, consent | Phase 2 |
| 11 | Analytics and experimentation | Phase 6 |
| 12 | AI gateway, prompts, evals, approval policy | Phase 6, with roots in Phase 0 |
| 13 | Security, privacy, accessibility, compliance | Every phase; hardened in Phase 7 |
| 14 | Observability, incident response, backup, restore | Phase 7, with roots in Phase 0 |
| 15 | Scaling, cost, reusable platform extraction | Phase 8 |

---

## 5. The phases

Ordered by dependency first, then by the distribution-is-the-constraint rule. Each phase names the real PCD work, the layer it teaches, what it depends on, its definition of done, the standard and constitution gates it must clear, and the graduation into the manual. Status column uses designed / built / running honestly.

### Phase 0: Stabilize the live system (pre-August)

**Goal.** Close the five leaks and the one live bug, and make the agent estate actually observable, so nothing burns silently during the four-month idle.

**Real work.**

- Ship the null `session_end_date` fix for the 296 camp pages returning 500. Fix the three sibling files carrying the latent version.
- Close the five audit leaks: connect Vera's inbox correctly, revive the camps cron, rotate the OpenAI key, redeploy the stale Gear Files build, send the first newsletter and wire the Kit welcome incentive.
- Set the production bindings that unblock logging: `FORGE_DB`, `AGENT_RUNS_TOKEN`, so `POST /api/agent-runs` stops returning 500 or 503 and every agent writes one row per run.
- Point each deployed scheduled-task prompt at its version-controlled skill file. This is the last inch on the roster: governed on paper becomes governed in production.
- Start the backup proving clock: three clean runs of `backup-activity-radar.ps1` on three separate days. This gate caps Ranger's write scope until it reads three rows.
- Move prompts into git (close the out-of-git SKILL.md defect).

**Teaches.** Deploy pipeline, secrets and bindings, git discipline, first contact with D1 and migrations, what "governed in production" actually requires.

**Depends on.** Nothing. This is the floor.

**Definition of done.** All four verify checks in the 2026-07-15 handoff pass. `agent_runs` shows rows for every PCD agent. Backup log reads three rows. Zero camp pages return 500. `STANDARD-AUDIT.md` Ops and Test pillars updated.

**Gates.** HUMAN GATE unchanged. `/web:commit-check` on the diff. QA chaos path on the camp-page fix.

**Graduation.** The manual's task inventory reconciles with what actually runs. Documentation drift items from the audit's section 10 close.

### Phase 1: The shipping loop (pre-August, the keystone)

**Goal.** Build the one pathway everything else reuses: a Stage-class change becomes a shipped change on one approval. This is the last inch, built once, correctly.

**Real work.**

- Approve-to-publish: a Slack approval action flips `draft: false`, commits the markdown to GitHub, and fires the deploy hook. Wire the four Slack secrets and the approver list from the handoff.
- The Approval Queue as designed in Foundations section 4: one queue, one card format (evidence, recommended action, confidence score, one-tap approve or reject), Slack plus a Notion row.
- The `events` table and the first namespaced events (`pcd.editorial.draft_ready`, `pcd.editorial.published`).
- Verify the Access JWT signature on the admin cookie path. This closes the phase-2 auth debt and is the natural place to learn real authorization.

**Teaches.** Worker routes and API design, authentication and signature verification, the event bus, and the HUMAN GATE expressed as code rather than a habit.

**Depends on.** Phase 0 (logging and secrets live).

**Definition of done.** A rules-watcher draft goes from flagged to live on one Slack tap, with the commit on GitHub, a new deployment, and the outcome posted back to the thread. Ed's drafts and the freshness queue both flow through it. Admin auth runs the verified path with no LEGACY warning in the tail.

**Gates.** HUMAN GATE is the whole point: publication requires the tap. Security pillar re-audited (auth changed). QA happy and chaos path on the publish flow.

**Graduation.** Editorial moves from "drafts only, Jeff publishes" to "staged, Jeff approves in one tap." The gate relaxes for its lowest-risk action, exactly as the build plan's horizon rule intends. Payments never relax.

### Phase 2: Distribution wiring (the binding constraint)

**Goal.** Turn on the channels that move subscribers and traffic. This phase outranks the deeper platform work because distribution is 10% built and it is the constraint.

**Real work.**

- Kit welcome automation delivering the 28-page guide, the six-email sequence, sender-domain verification. Send Friday Letter No. 1 if Phase 0 has not already.
- Per-article OG image generation through the imagegen skill and the Pillow card system, feeding the AI-citation SEO strategy.
- JSON-LD emission verified and a 404-to-redirect fixer that stages redirect rules for approval.
- One social channel, draft-and-stage, consuming the seasonal task's existing social queue. One channel owned, not five half-run.

**Teaches.** Email and consent mechanics, deliverability, SEO assets as a build output, the marketing loop from signal to staged post.

**Depends on.** Phase 1 (the staging and approval surface exists).

**Definition of done.** A new subscriber receives the guide automatically. The newsletter has a real issue history. Every new article ships a unique OG image. Indexing trend turns (crawled-not-indexed shrinks). One social channel posts on the draft-and-stage pattern.

**Gates.** Consent and privacy pillars (Kit, UTM, first-party analytics). HUMAN GATE on every send. Amazon-links-in-email ban enforced.

**Graduation.** Frida and Nora move from draft-only to staged-and-approved. Marketing scope widens from SEO to channels per the Foundations roster.

### Phase 3: Camp data quality and provenance

**Goal.** Make the directory trustworthy at the record level, because a wrong directory is worse than none. This is the deep data-engineering phase.

**Real work.**

- Resolve the D1 identity conflict (Open Item 6): confirm which database the live site reads, migrate, retire the stale `parent-coach-playbook` DB.
- Provenance model on every time-sensitive claim: source, confidence, last-verified, verification method, expiry or recheck date, change history. R2 holds the raw evidence capture (HTML snapshot, screenshot, extraction JSON) keyed by org and date.
- Revive the URL-health sweep against the correct database, on a schedule, with loud failure.
- Transactional email for submitters (confirmations), the first real outbound email code in the Workers.
- Backup on a schedule once the proving clock closes.

**Teaches.** Data modeling and migrations for real, crawling and extraction tiers, provenance as a first-class schema concern, R2 as an evidence layer.

**Depends on.** Phase 0 (backup clock), Phase 1 (approval queue for enrichment above threshold).

**Definition of done.** Every published camp claim has provenance and a recheck date. Failed verification makes uncertainty visible rather than silently going stale. One database, not two. Submitters get a confirmation.

**Gates.** Privacy pillar and `DATA-MAP.md` updated. RED WALL and FAMILY FIREWALL on any child-adjacent data. Ranger's R3 write scope stays gated until backup and audit conditions hold.

**Graduation.** Ranger's Camp Directory department moves from "org-discovery writes at 75 confidence" to a fuller data-quality function with provenance enforced.

### Phase 4: Affiliate integrity and revenue tracking

**Goal.** Make the money layer correct and measured. Revenue is currently zero recorded, and one revenue section was shipping on a stale build.

**Real work.**

- Confirm `/what-to-buy/` runs the current build. Verify one `/go/` link lands on the merchant with the associate tag intact, end to end.
- Stage link swaps as approvals instead of report-only. Broken-link and out-of-stock detection feeds the Approval Queue.
- Revenue events: record clicks and conversions per link, per article, per merchant. First cut at revenue-per-content.
- Disclosure controls checked on every buying guide (FTC), tracked in the Legal pillar.

**Teaches.** Affiliate tracking, financial intelligence (revenue attributed to content), disclosure compliance as a control, not a footnote.

**Depends on.** Phase 1 (approvals), Phase 2 (traffic to convert).

**Definition of done.** Every `/go/` link verified live with tag. Link swaps flow through approval. Revenue-per-article exists as a number, even if the number is small. Disclosures pass on every guide.

**Gates.** Legal pillar (disclosures). HUMAN GATE on link changes at scale. Payments never move autonomously, permanently.

**Graduation.** Hal's department moves from link-health reporting to staged revenue operations.

### Phase 5: Search, geography, public experience

**Goal.** Make the parent-facing product do the one thing a directory can do that an AI summary cannot: verified, filterable, local, current.

**Real work.**

- D1-backed search with normalized fields, filters (location, distance, activity, age, date, day or overnight, price, registration status, verified status).
- Geohash or equivalent, precomputed city and county and metro relationships, geocoding cached forever unless the address changes.
- The parent query experience built on verified data with visible verification dates.

**Teaches.** Search without reaching for Algolia or Elasticsearch first, geography without a geospatial cluster first, UX built on trust signals.

**Depends on.** Phase 3 (the data is trustworthy and provenance-stamped).

**Definition of done.** A parent can filter to verified, open, nearby camps by age and date, and see when each was last checked. Search latency and relevance measured, so any future search service is a documented decision, not a reflex.

**Gates.** Accessibility pillar (filters, results, keyboard and screen reader). UI pillar. QA emotion check with the parent personas.

**Graduation.** Product department (Piper, currently design) gets its first running function.

### Phase 6: Intelligence, analytics, experiments

**Goal.** Give the company memory and a feedback loop. Stand up the Intelligence Layer (Iris) and the AI gateway that governs cost.

**Real work.**

- The AI gateway abstraction from the stack advice: no workflow calls a model directly. The gateway decides whether AI is needed, which tier, whether a cached or deterministic result exists, and whether the budget allows it. Level 0 (code, regex, DOM, hashes) before any paid call.
- No-result search analysis, content-opportunity scoring, camp-density and local-coverage gaps, all feeding the editorial and directory queues.
- GA4 wired into a workflow instead of sitting unused in the footer. First-party privacy-conscious events.
- The "What Changed Overnight" briefing: discovered, updated, traffic, revenue, broken links, pages needing review, opportunities, decisions waiting. Barnabus already carries the roster; this is the daily newspaper about the business.
- The first experiment: one headline or CTA or subject-line test with tracked results.

**Teaches.** Analytics, experimentation, the AI gateway and prompt evaluations, approval policy tuned by confidence and risk instead of approve-everything.

**Depends on.** Phases 2 through 5 (there is signal to analyze and traffic to experiment on).

**Definition of done.** The morning briefing generates and lands where Jeff reads it. One experiment has a result. GA4 feeds one real decision. Every AI call routes through the gateway with a per-day budget cap.

**Gates.** Privacy pillar (analytics, retention). Intelligence store honors the FAMILY FIREWALL: no household, health, or child data enters it. Prompt-injection defenses on any agent reading fetched web text (untrusted data, never instructions).

**Graduation.** Iris (Intelligence Layer) and Ana (Analytics) get running functions. Approval postures start relaxing by confidence band per the Human Approval Matrix.

### Phase 7: Observability, security hardening, disaster recovery

**Goal.** Make the whole thing survivable and auditable. This is the phase that turns a working system into a production one.

**Real work.**

- Uptime and synthetic monitoring on the live URLs. Sentry where a data app with a paid API justifies it.
- Backup restore test, actually run. A backup is not real until it has been restored once.
- Security hardening pass: OWASP top ten review, rate limits on paid endpoints, Turnstile and CORS on public forms, error messages that do not leak, dependency scanning and Dependabot.
- Audit logs and data-retention policy. The SOC 2 direction as a roadmap, not an audit purchase.

**Teaches.** Observability, incident response, backup and restore for real, security as a standing pass rather than a one-time gate.

**Depends on.** The system exists and matters (Phases 1 through 6).

**Definition of done.** A restore has been performed and logged. Every paid endpoint is rate-limited. Uptime alerting fires on a real outage in a test. Ops and Security and Test pillars pass with no open Critical.

**Gates.** Security and Ops pillars, full. Incident runbook updated.

**Graduation.** Wes (Engineering), Locke (Security) get running functions.

### Phase 8: Forge OS extraction and the second brand

**Goal.** Only after a pattern has worked twice inside PCD, lift it into a reusable package and prove a second brand can stand on it. This is the payoff for the whole portfolio.

**Real work.**

- Extract the proven shared modules into brand-neutral packages: run log and registry, approval queue, event bus, AI gateway, observability, security baseline.
- Brand configuration and tenant boundaries. Trust boundaries and compliance requirements are per-brand, so operational data and access boundaries stay separate.
- Stand up the second brand (LegisRadar or MedConfRadar, depending on section 9) on the shared spine, and prove it reuses the infrastructure without copying it.

**Teaches.** Scaling, cost management across brands, the actual discipline of platform extraction (earned, not designed up front).

**Depends on.** A pattern proven twice in PCD. Not before.

**Definition of done.** A second brand runs a real workflow on the shared packages. The rule holds: PCD gets the feature first, Forge OS receives the reusable abstraction after it has worked twice.

**Gates.** Every pillar, per brand. Separate secrets, separate data, separate access.

**Graduation.** Forge OS stops being a naming convention and becomes a dependency. Max (Automation) gets a running function.

---

## 6. What never relaxes

Three things hold through every phase and every confidence band, forever:

1. **Payments.** Money movement stays gated permanently. No confidence score buys autonomy here.
2. **RED WALL and FAMILY FIREWALL.** Recruits, players, children, families route to Jeff only. Their data never enters drafts, logs, briefings, or the intelligence store.
3. **Deletions and the S4 legal clock.** The 30-day deletion and opt-out SLA runs year-round, through the idle, exempt from CANARY, escalating through `needs_you`.

---

## 7. Measurement

Per phase, one number that says it worked, tracked in the Analytics department once Phase 6 lands, tracked by hand before then.

| Phase | The number |
|---|---|
| 0 | `agent_runs` rows per day > 0 for every agent; camp 500s = 0 |
| 1 | Time from draft flagged to live, in minutes, on one tap |
| 2 | New subscribers receiving the guide automatically; newsletter issues sent |
| 3 | Percent of published camp claims with provenance and a recheck date |
| 4 | Revenue-per-article exists as a real number; `/go/` tag verified |
| 5 | Parent can filter to verified-open-nearby by age and date |
| 6 | Morning briefing lands daily; one experiment has a result |
| 7 | One restore performed and logged; uptime alert fires in test |
| 8 | Second brand runs one workflow on shared packages |

Business performance is one track, not the gate. Poor traffic changes the product proposition or the wedge. It does not stop the learning program.

---

## 8. Timing against the idle

It is 2026-07-18. The idle runs August through November.

- **Pre-August, realistic:** Phase 0 and the keystone of Phase 1. Close the leaks, ship the loop. That is the highest-value pre-idle work because it stops the silent burn and builds the pathway everything reuses.
- **During the idle:** report-only. The S4 watch runs. No writes, no build. Use the four months for the Chain Reaction manuscript and the season, which are the two 2026 success metrics.
- **December forward:** Phases 2 through 8 in order, distribution first.

Do not compress this against the idle. The maintenance-mode constraint is in the Foundations for a reason: the founder is unavailable four months a year, which is the argument for the AI OS and the limit on how fast it gets built.

---

## 9. The one decision, and the immediate next action

**The decision.** My Company.md names LegisRadar as Priority 1 "until fully working." This program is portable. Two clean options:

- **A. Keep PCD as the teaching ground.** PCD is the healthiest place to learn, because the estate is already 70% built and the loops are half-wired, so you close loops instead of scaffolding from scratch. Every pattern (approval queue, run log, event bus, AI gateway, deploy pipeline) is built PCD-first and reused on LegisRadar the moment it is proven. You learn on PCD, LegisRadar inherits.
- **B. Point the same program at LegisRadar now.** Honor the stated priority literally. The phase structure and the rules are identical; only the application layer changes. The cost is that LegisRadar is closer to greenfield, so you scaffold more and close fewer existing loops, which is slower learning.

My read: A. You get more learning per hour on PCD because the wiring is already there to finish, and LegisRadar gets the proven pattern handed to it rather than a first draft. But this is your priority call to make, not mine to assume.

**The immediate next action, either way:** Phase 0, and inside Phase 0, the 296-page 500 fix, because it is the one thing a parent can hit today. It ships through the standard deploy path, it teaches the pipeline end to end, and it is already written and waiting in `src/pages/camps/[slug].astro`. That is the first Monday-morning task.

---

*Files 05-platform-departments.md and 07-sops-events-agents.md are still unwritten, per the file map in 00-FOUNDATIONS.md. They are design files, not build files, and do not block Phase 0. Write them when the platform and event-map details are needed, not before.*
