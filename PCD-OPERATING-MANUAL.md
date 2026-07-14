# ParentCoachDesk Operating Manual

**Venture:** ParentCoachDesk.com (Field & Forge Ventures, Forge Command Track V2)
**Source of truth:** this markdown file. Notion mirrors it under the PCD Command Center page.
**Version:** 1.2, 2026-07-13. Design session, first pass (v1.0), a three-source feedback reconciliation (v1.1), then Session Two adding Phases 4 and 5 (v1.2).
**Scope so far:** Phases 1 to 5 (business architecture, SOP documentation, workflow mapping, prompt architecture, agent design). Phases 6 to 10 are stubbed with prerequisites.
**Governed by:** Forge Command Master Plan v2.1, the ten named rules, the section 10 failure modes, and the Personal AI Organization Blueprint. Where any of those conflict with this manual, they win.
**v1.2 changes:** Session Two wrote Phases 4 and 5, grounded in the ten live PCD SKILL.md files read from the scheduled-tasks store, not a hypothetical library. Phase 4 is the prompt-management framework: the real inventory, naming convention, storage and version control (the prompts live outside git, a named finding), versioning, ownership, the frame-and-class content standard, testing and regression, evaluation, and lifecycle. Phase 5 is the operational org chart: every agent with the skill-template fields plus supervisor, human owner, and an R1/R2/R3 risk class, each tagged live, working-set, or future-menu, with the nightly `org-discovery-daily-worklist` (R3) given the strictest treatment and an honest guardrail-by-guardrail read against section 7. Appendix A drafts the unapplied Open Item 1 venture-file fix. Design only, no agent built or scheduled.
**v1.1 changes:** Adjudicated 46 feedback items from three external reviews (Gemini, ChatGPT review, ChatGPT full-draft rewrite). Rejected the build-the-AI-OS-now direction and the roughly thirty-agent, six-department expansion; routed the Phase 4 and 5 material to a Session Two input file. Accepted: workflow-driven agent growth, the July build of the S4 monitor, and a new Open Item for camp-database safety. Full adjudication in PCD-MANUAL-RECONCILIATION-MEMO-2026-07-13.md.

This is a design document. It builds no agents, no automations, and no schedules. It maps how ParentCoachDesk already runs, names the standing processes, and sets the order the work should mature in.

---

## 0. How to read this manual

The manual has five working phases and a set of reference sections. Phase 1 is the business architecture: what PCD is, what constrains it, and which departments hold the work. Phase 2 is the SOPs: the standing processes, each with a trigger, an owner, steps, and an approval gate. Phase 3 is the workflow map: how work moves, what already runs on a schedule, and what idles during football season. Phase 4 is the prompt architecture: how the ten live agent prompts are named, stored, versioned, owned, tested, evaluated, and retired. Phase 5 is the agent design: the operational org chart, every agent with its skill-template fields, supervisor, human owner, and risk class.

Two rules sit above every design choice here. No agent exists unless it saves real time, improves a decision, reduces risk, or increases revenue (Master Plan section 1). No agent gets built until its recurring task has been done by hand at least three times (decision 6). Every proposed agent below states how it clears both.

One caution before the architecture. The venture file `ventures/parentcoachdesk.md` (2026-07-12) describes PCD's automation as mostly paused and unbuilt. That is no longer true. Ten PCD scheduled tasks run live today, including a daily autonomous discovery agent that writes to the shared database. Section 3.2 inventories them, and the reconciliation of the venture file against that reality is Open Item 1.

---

# Phase 1: Business architecture

## 1.1 What PCD is, in real numbers

ParentCoachDesk.com is a live content and directory site for youth sports parents. It runs on Cloudflare Pages (project `parent-coach-playbook`, domain parentcoachdesk.com) and carries 805 articles across its content collections. Revenue is one live mechanism: Amazon Associates plus three smaller affiliate networks, with 135 live picks and 8 networks pending application.

The camps directory sits on a shared ActivityRadar D1 database of 196,252 organizations. Only 910 of those (1,701 programs) are enriched and visible in parent-facing search. The other 195,342 are unverified IRS Business Master File stubs, hidden until a discovery pass enriches them.

The site is well built and barely found. The 2026-07-12 Organic Search Audit is blunt: the domain is one month old for search purposes, carries zero external backlinks, and has zero organic clicks two weeks running. Google has crawled 1,206 pages and refused to index them. The technical SEO is clean; the problem is authority and distribution, not plumbing.

## 1.2 The binding constraint

Distribution is the constraint. Everything else is ahead of it in the build and behind it in value. The audit states it plainly: the product is 90 percent built and distribution is 10 percent built.

This single fact orders the whole manual. Any process that moves traffic, links, or revenue ranks ahead of any process that makes the internal system more elegant. The maturity roadmap in section 5 is built on that priority and nothing else.

## 1.3 Departments: the five workstreams plus shared functions

PCD does not get its own department taxonomy invented for it. The Blueprint's departments map onto PCD's five existing workstreams plus three shared portfolio functions. The rule from the binding: invent a new department only where the existing ones genuinely cannot hold the work.

The five PCD workstreams and their Blueprint mapping:

| PCD workstream | Blueprint department(s) it covers | What it owns at PCD |
|---|---|---|
| Site operations and security | Engineering, Operations, Security, Architecture | The Pages deploy, the STANDARD-AUDIT pillars, the security gate, TypeScript and test debt |
| Camp lead generation | Data Stewardship, Product Management | The 196,252-org database, the discovery and enrichment pass, promotion to parent-facing search |
| Marketing | Marketing, Business Intelligence, Sales | SEO and analytics, the newsletter, distribution, the traffic bet |
| Editorial | Content, Research, Ethics and QA | Articles on the Three Drives framework, the gear-guide matrix, seasonal planning, freshness |
| Affiliate buying guides | Marketing (revenue), Finance (partial) | The 135 live picks, link health, network applications, revenue reconciliation |

The three shared portfolio functions that reach into PCD from Forge Command:

| Shared function | Role at PCD | Working-set agent |
|---|---|---|
| Barnabus (chief of staff) | Carries PCD status in the daily briefing and weekly review from the run log and Notion | Barnabus |
| Finance | Cash flow, subscriptions, affiliate revenue, tax and invoice reminders across the portfolio | Finance (ships September) |
| Support/Ops | Inbound triage across venture domains, including PCD's three aliases | Support/Ops (ships September) |

## 1.4 Do any new departments need inventing?

No. The five workstreams plus the three shared functions hold every piece of PCD's real work. Two boundary calls are worth stating so they do not drift.

Customer Success and Customer Support from the Blueprint do not get separate PCD departments. PCD has no logins, no subscriptions, and no paying customers yet. The only customer-facing surface is inbound email, which Support/Ops covers, and the eventual $79/yr camp listings, which stay unbuilt and unlaunched until the compliance Critical in Open Item 7 closes.

Sales does not get a separate department either. The affiliate model is transactional, not a pipeline, so affiliate revenue lives inside Marketing and Affiliate, not a CRM. If paid camp listings ever launch, that becomes a real Sales question and gets revisited then, not now.

The one genuine gap is not a missing department. It is a missing owner. No working-set agent owns SEO and traffic monitoring, even though that is the binding constraint and the work already runs on a schedule (section 3.2). That gap is named in the org chart (section 4) and sequenced first in the roadmap (section 5).

---

# Phase 2: SOP documentation

## 2.1 How to read the SOPs

Each SOP is a standing process, not an agent. Some are already backed by a live scheduled task; some are still done by hand; some are documented here before their first run so the process exists before the automation does. The "Manual 3x" column is the decision-6 gate: a process cannot become an owned agent until it has been run by hand three times.

Every SOP names its approval gate. The HUMAN GATE rule holds across all of them: sends, purchases, deletions, and publications require Jeff's sign-off. Agents draft, organize, analyze, and recommend. They do not ship.

## 2.2 SOP index

| # | SOP | Owner workstream | Cadence | Backing scheduled task | Manual 3x |
|---|---|---|---|---|---|
| S1 | Weekly SEO and GSC review | Marketing | Weekly | `weekly-gsc-review`, `pcd-gsc-analytics-report` | Cleared (4 instances on file) |
| S2 | Deploy and backup | Site ops | On source change | none (manual, per Deployments.md) | Cleared |
| S3 | Standard audit pass | Site ops | On source change | none (`/web:` slash commands) | Cleared |
| S4 | Data-deletion request handling | Support/Ops | On request | none (unmonitored today) | Not cleared |
| S5 | Affiliate link health | Affiliate | Weekly | `pcd-link-health-monitor` | Running |
| S6 | Affiliate revenue reconcile | Affiliate, Finance | Monthly | `pcd-affiliate-reconciler` | Running |
| S7 | Camp discovery and enrichment | Camp lead gen | Daily | `org-discovery-daily-worklist` | Running (autonomous) |
| S8 | Camps directory data quality | Camp lead gen | Weekly | `pcd-camps-data-steward` | Running |
| S9 | Editorial content pipeline | Editorial | Continuous | `pcd-seasonal-content-scheduler`, `pcd-rules-watcher` | Running |
| S10 | Friday Letter newsletter | Marketing | Weekly | `pcd-friday-letter-draft` | Running (draft only) |
| S11 | Content freshness audit | Editorial | Quarterly | `pcd-freshness-audit` | Running |
| S12 | Inbound triage | Support/Ops | On arrival | none (Jeff reads directly) | Not cleared |

## 2.3 The SOPs

### S1. Weekly SEO and GSC review

**Trigger:** Monday morning, and any deploy that changes routing or indexing.
**Steps:** Pull live Google Search Console for sc-domain:parentcoachdesk.com. Record clicks, impressions, average position, indexed versus not-indexed counts, the 404 trend, and any new external backlink. Compare against the prior week. Flag regressions and name the single highest-impact fix.
**Approval gate:** Report only. No changes ship from this SOP; fixes route to Site ops as their own sessions.
**Backing tasks:** `weekly-gsc-review` (Mon) and `pcd-gsc-analytics-report` (Mon). These overlap and should be reconciled (Open Item 2).
**Note:** This is the first recurring task PCD cleared for automation. It is still unassigned to a named owner in the org chart.

### S2. Deploy and backup

**Trigger:** any change to files under `Outputs/parent-coach-desk`.
**Steps:** `npm run build`, then `git add -A` and commit with a specific one-line message, then `npx wrangler pages deploy dist --project-name parent-coach-playbook --branch main`, then `git push`. Build first to verify compile; commit before deploy so wrangler sees a clean tree.
**Approval gate:** Jeff runs the deploy. The manual and any session hand over the paste-ready PowerShell block; they never deploy on his behalf.
**Backing task:** none. This stays a human-run command per the Deployment and Backup norms.

### S3. Standard audit pass

**Trigger:** any session that touches site source, before the final commit.
**Steps:** Run the relevant `/web:` reviewers against the project. `/web:commit-check` runs on the session diff every time. `/web:audit` runs all ten pillars and writes STANDARD-AUDIT.md. No site reaches deploy with an open Critical in any pillar.
**Approval gate:** Report and fix within the session. No customer-facing or money-touching change ships without Jeff.
**Backing task:** none. These are slash commands run inside a working session, the same cross-portfolio operation Press uses.

### S4. Data-deletion request handling

**Trigger:** any deletion request landing at `support@parentcoachdesk.com` (changed 2026-07-13 from the retired `parentcoachplaybook@gmail.com` brand address as part of the July dead-brand purge; forwards to `jeff@coachjeffthomas.com` per S12).
**Steps:** Acknowledge, locate the record in the `activity-radar` D1, delete or anonymize, confirm to the requester, log the action. The DATA-MAP.md SLA is 30 days and does not pause for football season.
**Approval gate:** Jeff approves the deletion. This is the one standing watch that runs year-round.
**Backing task:** none yet, and that is the risk. Nothing currently monitors that inbox for a request. Building this monitor is the one PCD automation that maintenance mode does not idle (section 3.4), and it is scheduled to be built in July 2026 before the idle (Jeff's call, 2026-07-13). It is a monitor-and-draft: it watches the inbox, locates the record, and stages the deletion for Jeff. The deletion itself stays behind the HUMAN GATE, so this does not require the manual-3x clearance that an autonomous action would.

### S5. Affiliate link health

**Trigger:** weekly.
**Steps:** Crawl every `/go/` affiliate redirect, check for dead targets, redirects, and broken destinations, and report failures with the article they sit in.
**Approval gate:** Report only. Link fixes route to Editorial or Site ops.
**Backing task:** `pcd-link-health-monitor` (Mon 7:04).

### S6. Affiliate revenue reconcile

**Trigger:** monthly, day 2.
**Steps:** Pull affiliate network reports, reconcile against the AFFILIATE_MASTER_LIST, check the status of the 8 pending network applications, and summarize revenue by network. Feed the numbers to Finance for the portfolio P&L.
**Approval gate:** Report only. Application submissions and payout changes are Jeff's action.
**Backing task:** `pcd-affiliate-reconciler` (monthly, day 2).

### S7. Camp discovery and enrichment

**Trigger:** daily.
**Steps:** Cut the day's batch from the Business Master File stubs, search each org's website in Claude-in-Chrome, score confidence, accept records at or above 75 confidence with no needs-review flag, and push accepted rows to the `activity-radar` D1 as website updates plus a camp-scan queue insert. Confirm the push landed with a count query.
**Approval gate:** This is the one SOP that writes to the live database autonomously. It does not touch customer email or published articles, so it clears the HUMAN GATE as data enrichment, not publication. It does change what parents see in search, so its confidence threshold and its guardrails (never store rosters, DOB, medical, or parent and student emails) are the control, and they need a periodic human audit (Open Item 4).
**Backing task:** `org-discovery-daily-worklist` (daily 9:02 PM).
**Note:** the venture file says this pipeline has never run. It runs every day. That is the sharpest discrepancy in Open Item 1.

### S8. Camps directory data quality

**Trigger:** weekly.
**Steps:** Check the camps directory for stale listings, expired camps that should redirect rather than 404, duplicate records, and orphaned queue rows. Report and stage fixes.
**Approval gate:** Report and stage. Bulk changes to parent-facing records get a human review.
**Backing task:** `pcd-camps-data-steward` (Thu 4:07).

### S9. Editorial content pipeline

**Trigger:** continuous, with a monthly plan and a weekly rules watch.
**Steps:** Plan seasonal content against the calendar (tryouts, registration, tournaments, back-to-school). Watch for youth-sports rule and equipment changes and draft "This Season" updates. Write against the Three Drives framework and the gear-guide matrix. All content begins with research, not generation (SOURCE RULE).
**Approval gate:** Draft only. No article publishes without Jeff. Voice follows the VOICE RULE and the anti-AI writing guide.
**Backing tasks:** `pcd-seasonal-content-scheduler` (monthly) and `pcd-rules-watcher` (Tue).

### S10. Friday Letter newsletter

**Trigger:** each Wednesday, for Friday send.
**Steps:** Study 3 to 5 recent articles for voice, identify the week's new content, pick the seasonal moment, pick one archive piece to resurface, and draft the letter with subject line and two alternates. Never include Amazon affiliate links in email (Amazon agreement); non-Amazon `/go/` links sparingly.
**Approval gate:** Draft only, saved to `reports/friday-letters/`. Jeff edits and pastes into Kit. The agent never sends.
**Backing task:** `pcd-friday-letter-draft` (Wed 8:03).

### S11. Content freshness audit

**Trigger:** quarterly (January, April, July, October).
**Steps:** Scan the article base for stale facts, dated seasonal references, and dead links. Rank refresh candidates by traffic potential and staleness.
**Approval gate:** Report and stage. Rewrites route through Editorial and publish only with Jeff.
**Backing task:** `pcd-freshness-audit` (quarterly, day 5).

### S12. Inbound triage

**Trigger:** email arriving at `editor@`, `partnerships@`, or `support@parentcoachdesk.com`.
**Steps:** Cloudflare Email Routing labels by destination address. Editorial owns `editor@` and `partnerships@`; Support owns `support@`. Draft a reply, flag anything that needs Jeff, hold anything Red Wall or family-adjacent.
**Approval gate:** Draft only. A human sends every reply. Today all three aliases forward to `jeff@coachjeffthomas.com` and Jeff reads each one directly, because both owning agents sit paused.
**Backing task:** none yet. This is the work Support/Ops picks up in September.

---

# Phase 3: Workflow mapping

## 3.1 The core flow

Work enters PCD through one of four doors: an inbound email, a scheduled task firing, a source-code change, or a Jeff-initiated session. Every door lands the work in one of the five workstreams. The workstream produces a draft, a report, or a staged change, never a shipped one, unless the action clears the HUMAN GATE.

The gate is the constant. A report or a draft can be produced unattended. A send, a purchase, a deletion, or a publication waits for Jeff. The one documented exception is S7 camp discovery, which writes enrichment data to the database autonomously and is controlled by a confidence threshold and a periodic audit instead of a per-run approval.

Every run should write one row to `agent_runs` in the `forge-command` D1 so the work is visible and no failure is silent. Most PCD scheduled tasks do not do this yet (Open Item 3). Barnabus reads that log plus Notion to carry PCD's status into the daily briefing.

## 3.2 What already runs on a schedule

Jeff asked for this explicitly, and it is the most important correction the manual makes. PCD is not a paused venture waiting for automation. It has ten live scheduled tasks plus two portfolio-level tasks that cover it. This inventory is part of the standing operating picture and should be checked at the top of any PCD session and refreshed whenever a new task is scheduled.

| Task ID | Schedule | Workstream (SOP) | Output type | Writes live? |
|---|---|---|---|---|
| `org-discovery-daily-worklist` | Daily 9:02 PM | Camp lead gen (S7) | DB enrichment | Yes, to `activity-radar` D1 |
| `pcd-link-health-monitor` | Mon 7:04 AM | Affiliate (S5) | Report | No |
| `weekly-gsc-review` | Mon 8:08 AM | Marketing (S1) | Report | No |
| `pcd-gsc-analytics-report` | Mon 7:40 AM | Marketing (S1) | Report | No |
| `pcd-rules-watcher` | Tue 7:08 AM | Editorial (S9) | Draft | No |
| `pcd-friday-letter-draft` | Wed 8:03 AM | Marketing (S10) | Draft | No |
| `pcd-camps-data-steward` | Thu 4:07 AM | Camp lead gen (S8) | Report or stage | No |
| `pcd-seasonal-content-scheduler` | Monthly, day 1 | Editorial (S9) | Plan | No |
| `pcd-affiliate-reconciler` | Monthly, day 2 | Affiliate, Finance (S6) | Report | No |
| `pcd-freshness-audit` | Quarterly | Editorial (S11) | Report | No |
| `barnabus-morning-briefing` | Daily 6:31 AM | Chief of staff (portfolio) | Briefing | No |
| `barnabus-weekly-review` | Sun 4:30 PM | Chief of staff (portfolio) | Review | No |

One more task touches PCD files without owning PCD work: `cowork-folder-weekly-scan` (Sun 10 PM) hashes the whole Cowork folder, including the PCD outputs, and stages changed files as Notion Raw Sources for the Second Brain. It is a knowledge-ingest task, not a PCD process, and it is listed here only so its file access is not mistaken for a PCD agent.

**Two Cloudflare Worker crons, not Cowork scheduled tasks (added 2026-07-13, ActivityRadar merge WP-9).** `activityradar-enrichment` (hourly) and `activityradar-yelp` (daily 3:00 AM) run as Cloudflare Workers against the shared `activity-radar` D1, not as Cowork scheduled tasks, so they don't appear in the table above. They are part of the same standing operating picture: `activityradar-enrichment` is the low-level camp-scan/scrape worker that S7's daily discovery agent feeds queue rows to, and `activityradar-yelp` enriches camp records with Yelp data. Both worker names are historical identifiers kept unchanged on purpose (see ACTIVITYRADAR-MERGE-PLAN.md); they are PCD's camp data layer, not a separate product's infrastructure.

## 3.3 The weekly cadence

The PCD scheduled load is front-loaded onto Monday and spread thin across the rest of the week. This is the shape of the week as it fires today:

- **Daily:** camp discovery (9 PM), Barnabus briefing (6:31 AM)
- **Monday:** link health (7:04), GSC analytics (7:40), GSC review (8:08)
- **Tuesday:** rules watcher (7:08)
- **Wednesday:** Friday Letter draft (8:03)
- **Thursday:** camps data steward (4:07)
- **Sunday:** Barnabus weekly review (4:30 PM)
- **Monthly:** seasonal content (day 1), affiliate reconcile (day 2)
- **Quarterly:** freshness audit

Monday is heavy with three overlapping marketing and affiliate reports. Consolidating the two GSC tasks (Open Item 2) would thin it.

## 3.4 Maintenance mode: August through November

PCD idles during football season. The live site is Cloudflare-hosted and needs no attention to keep serving. The rule is simple: content, marketing, camp lead-gen, and the STANDARD-AUDIT fixes all hold until December.

During the idle every PCD scheduled task runs maintenance-only: it pauses or degrades to report-only, with no writes and no active build work. That includes the editorial pipeline, the Friday Letter, seasonal planning, the SEO fix work, the camp discovery build-out, and S7's autonomous camp writes, which stop for the season (Jeff's call, 2026-07-13, resolving Open Item 5).

What does not pause: the data-deletion watch (S4), because its 30-day SLA runs year-round. What Barnabus escalates as genuinely urgent: a lapsed domain, a failed Cloudflare or Kit payment, or a deletion request going unanswered. Everything else holds until the December quarterly close.

---

# Phase 4: Prompt architecture

Phase 4 governs how PCD's agent prompts are named, stored, versioned, owned, tested, evaluated, and retired. It describes the real inventory, not a hypothetical library. The honest headline is that these prompts run in production today but sit outside most of the discipline this phase defines, and closing that gap is sequenced, not immediate.

## 4.1 The current prompt inventory

Every PCD agent is a `SKILL.md` file behind a Cowork scheduled task. There are ten PCD prompts, plus the two Barnabus portfolio prompts that also read PCD state. Each file is YAML frontmatter (name, description) over a prose body; the scheduler injects an autonomous-run preamble and expects a closing `<run-summary>`.

| Task (SKILL.md) | SOP | Cadence | Action class | Writes live? | Logs to agent_runs? |
|---|---|---|---|---|---|
| `org-discovery-daily-worklist` | S7 | Daily 9:02 PM | Act | Yes, `activity-radar` D1 | No |
| `weekly-gsc-review` | S1 | Mon 8:08 AM | Analyze | No | No |
| `pcd-gsc-analytics-report` | S1 | Mon 7:40 AM | Analyze | No | No |
| `pcd-link-health-monitor` | S5 | Mon 7:04 AM | Analyze | No | No |
| `pcd-rules-watcher` | S9 | Tue 7:08 AM | Draft | No | No |
| `pcd-friday-letter-draft` | S10 | Wed 8:03 AM | Draft | No | No |
| `pcd-camps-data-steward` | S8 | Thu 4:07 AM | Stage | No | No |
| `pcd-seasonal-content-scheduler` | S9 | Monthly d1 | Draft | No | No |
| `pcd-affiliate-reconciler` | S6 | Monthly d2 | Analyze | No | No |
| `pcd-freshness-audit` | S11 | Quarterly | Analyze | No | No |
| `barnabus-morning-briefing` | portfolio | Daily 6:31 AM | Draft | Log only | Yes |
| `barnabus-weekly-review` | portfolio | Sun 4:30 PM | Draft | Log only | Yes |

Barnabus is the reference build. It opens a run record, writes exactly one `agent_runs` row even on failure, dedupes before posting, and carries the voice, Red Wall, family, and source rules in the prompt. None of the ten PCD prompts does any of that yet, and that difference is the spine of the gaps below.

## 4.2 Naming convention

The convention is `pcd-<function>`, and eight of the ten follow it. Two do not: `weekly-gsc-review` predates the prefix and overlaps `pcd-gsc-analytics-report` on the same Monday (Open Item 2), and `org-discovery-daily-worklist` predates the merge and keeps its historical name on purpose, like the `activity-radar` and `parent-coach-playbook` identifiers. New PCD prompts take the `pcd-` prefix from creation, and renaming the two legacy tasks waits for Phase 7, because a scheduled-task rename changes the stored path in 4.3.

## 4.3 Storage and version control

The prompts do not live where the manual's "markdown is the source of truth" rule assumes. Each `SKILL.md` sits at `C:\Users\jeffthomas\Documents\Claude\Scheduled\<taskId>\SKILL.md`, outside the git-backed `Claude Cowork\Outputs` tree. So the design docs are versioned and the running prompts are not: they have no history, no diff, and no backup beyond the live file.

The fix is to make `Outputs/parent-coach-desk/agents/` the git-tracked source for each PCD prompt, and treat the scheduled-task copy as a deployment of that source. A prompt change lands in the repo first, gets committed, then is copied to the scheduled-task path. This is a Phase 6 build item; naming it is Phase 4's job.

## 4.4 Versioning

No PCD prompt carries a version today. The standard is a `version` and `last_edited` line in the frontmatter, bumped on every change, with the change recorded in this manual's review log or the decision log. Versioning stays manual and fragile until the git mirror in 4.3 exists, which is the real mechanism.

## 4.5 Ownership

Every prompt maps to one of the five workstreams (section 1.3), and through the workstream to a human owner. That owner is Jeff today and becomes Editorial, Support/Ops, or Finance as those working-set agents go live. Barnabus is the standing supervisor: it reads the run log and carries each agent's state into the briefing, so a failing prompt surfaces without Jeff hunting for it. The owner belongs in the frontmatter so a broken run has a name attached, not just a red status.

## 4.6 What a prompt contains: the frame and the action class

Two content standards sit inside every prompt. The action class sets output governance, and the six-slot frame sets structure.

The four action classes refine the HUMAN GATE rather than replace it. **Analyze** is read-only and hands back a report. **Draft** produces a document a human may act on, and nothing ships. **Stage** is a fully-formed change set waiting on one approval, which posts to the existing Slack channel with a link to the markdown (Jeff's call, 2026-07-13), not a Notion queue and not scattered files. **Act** is the one autonomous exception, org-discovery writing enrichment inside a confidence threshold. Nine of the ten PCD prompts are Analyze or Draft, `pcd-camps-data-steward` is the Stage case, and org-discovery is the lone Act.

The frame is the six things every prompt states: **purpose** (one sentence tied to the SOP), **inputs** (the live source, the prior run, the governing file), **reasoning steps** (the real decision points, not just mechanics), **guardrails** (the manual's thresholds restated so the agent cannot drift: 75 confidence, never store PII, no Amazon links in email, the 30-day SLA), **output shape** (report, draft, or staged set), and **logging** (the `agent_runs` row). Every prompt also carries the VOICE, RED WALL, and FAMILY FIREWALL rules, and any prompt that drafts outbound copy reads `About Me/About Me.txt` and `About Me/Anti AI Writing.txt` first. A review checks a prompt against these six slots plus its class.

## 4.7 Testing and regression

There is no test pass on any PCD prompt today. They are trusted because their output is inert for the Analyze and Draft nine, and self-checked for the one Act prompt, which runs a post-write count query to confirm the push landed. That is thin but not reckless, because the worst a Draft prompt can do is produce a bad draft a human discards at the gate.

The standard before a prompt change ships: run it once by hand against live data and read the output, and for the one Act prompt, run it against a capped batch and diff the database effect before trusting a full run. Regression risk is concentrated almost entirely in org-discovery, because it is the only prompt that mutates production. Phase 9 formalizes this into happy-path, failure-path, voice, and Red Wall and family checks.

## 4.8 Evaluation

Evaluation asks whether a prompt still earns its slot, not just whether it ran. The measure is the SOP's success metric read against the run log, once logging exists: did the GSC review catch the real regression, did the Friday Letter draft need heavy editing, did org-discovery's accept rate hold. Until `agent_runs` logging is wired (Open Item 3), evaluation is Jeff reading outputs, which works at ten tasks and will not scale. skill-creator's eval tooling is the Phase 9 anchor for turning this into a repeatable pass.

## 4.9 Lifecycle and approval

A PCD prompt's life runs in one line: a task done by hand at least three times (decision 6), promoted to a `SKILL.md` and a schedule, run under the frame, evaluated at the December close, and retired when its end state is reached (RETIREMENT RULE). Creating or changing a PCD prompt is Jeff's approval, and the change gets logged. The next prompt due is `pcd-deletion-monitor`, the S4 build cleared for July, written to the frame in 4.6 as a Stage-class agent and specced in Phase 5.

---

# Phase 5: Agent design

Phase 5 is the PCD operational org chart. It lists every agent that touches PCD, gives each the skill-template fields plus a supervisor, a human owner, and a risk classification, and tags each as one of three kinds. It reads alongside the function-level working-set view in section 4; this is the running-agent view, keyed by the actual scheduled task.

## 5.1 Risk classification

Risk is set by what an agent can change without a human in the loop, and it drives how much logging, testing, and audit each one needs.

- **R3, highest.** Writes to a production system autonomously with no per-run human gate. One agent qualifies: `org-discovery-daily-worklist`.
- **R2.** Prepares or hands over a change a human then commits: a deploy, a bulk data fix, a staged deletion. `pcd-camps-data-steward` and the planned `pcd-deletion-monitor`.
- **R1.** Produces a draft or report only; the worst case is a document a human discards. The other eight PCD prompts.

## 5.2 The org chart

Each row is one agent. The three tags are **live** (one of the ten PCD scheduled tasks running today), **working set** (a shared Forge Command agent PCD draws on: Editorial, Support/Ops, Finance), and **future-menu** (a candidate not yet built, with a decision-6 path). The supervisor for every PCD agent is Barnabus, which carries its state in the briefing from the run log; the human owner is Jeff until a working-set agent takes the workstream.

| Agent | Workstream / human owner | Tag | Class | Risk | Logs? | Meets section 7? |
|---|---|---|---|---|---|---|
| `org-discovery-daily-worklist` | Camp lead gen / Jeff | Live | Act | R3 | No | No, see 5.3 |
| `pcd-camps-data-steward` | Camp lead gen / Jeff | Live | Stage | R2 | No | Partial |
| `weekly-gsc-review` | Marketing / Jeff | Live | Analyze | R1 | No | Partial |
| `pcd-gsc-analytics-report` | Marketing / Jeff | Live | Analyze | R1 | No | Partial |
| `pcd-link-health-monitor` | Affiliate / Jeff | Live | Analyze | R1 | No | Partial |
| `pcd-affiliate-reconciler` | Affiliate, Finance / Jeff | Live | Analyze | R1 | No | Partial |
| `pcd-rules-watcher` | Editorial / Jeff | Live | Draft | R1 | No | Partial |
| `pcd-friday-letter-draft` | Marketing / Jeff | Live | Draft | R1 | No | Partial |
| `pcd-seasonal-content-scheduler` | Editorial / Jeff | Live | Draft | R1 | No | Partial |
| `pcd-freshness-audit` | Editorial / Jeff | Live | Analyze | R1 | No | Partial |
| `pcd-deletion-monitor` (planned) | Support/Ops / Jeff | Live, July build | Stage | R2 | Will | By design, see 5.4 |
| Editorial | Editorial, Affiliate / Jeff | Working set, paused | Draft | R1 | Pending | On build |
| Support/Ops | Inbound triage / Jeff | Working set, Sept | Draft | R1 | Pending | On build |
| Finance | Affiliate revenue / Jeff | Working set, Sept | Analyze | R1 | Pending | On build |
| SEO and traffic monitor | Marketing / Jeff | Future-menu | Analyze | R1 | n/a | On build |
| Barnabus | Portfolio / Jeff | Working set, live | Draft | R1 | Yes | Yes |

Every PCD agent carries the same skill-template fields: purpose, success metric, approval gates, kill switch, logging contract to `agent_runs`, idempotency, and the evidence rule, plus the two Phase-5 additions, a rollback path and a named owner workstream. The ten live prompts share one honest gap against those fields: none writes to `agent_runs` (Open Item 3), and their kill switch is only the scheduled-task enable flag, not an independent `agent_registry.status` with CANARY auto-pause. That is why every live row reads "Partial" and only Barnabus reads a clean "Yes." The two agents worth a full field-by-field treatment are the highest-risk live one and the one being built next.

## 5.3 The strictest case: org-discovery against the section 7 bar

`org-discovery-daily-worklist` is the only R3 agent in the portfolio and gets the strictest treatment. It runs unattended every night, searches org websites in the browser, and writes accepted results straight to the shared production `activity-radar` D1 with no per-run approval. Here is where it stands against each section 7 guardrail, honestly.

- **One purpose and a measurable success metric.** Pass on purpose: find and attach org websites. Partial on metric: it reports a confident-website rate and accepted-row count per run, but nothing tracks those over time, because it does not log.
- **Human approval for customer, money, legal, published.** It publishes nothing customer-facing and touches no money, but it does change what parents see in search by writing to the live org table without a gate. This is its weakest point, justified today only as data enrichment inside a 75-confidence, needs-review-false threshold.
- **Kill switch.** Fail against the template. The only control is the scheduled-task enable flag; there is no independent `agent_registry.status` and no CANARY auto-pause on repeated failure.
- **Version-controlled prompt.** Fail. The `SKILL.md` lives outside git (4.3), and the live file even carries a duplicated frontmatter block, a defect a review would catch.
- **Evidence on every recommendation.** Partial. It records a discovery reason and a confidence score per org, which is real evidence, but it is not linked anywhere durable for a later audit.
- **Every run logged, no silent failure.** Fail. No `agent_runs` row, only a run-summary line. A silently failed push is caught only by its own count query, which is good practice but not logging.
- **Idempotent, safe to retry.** Near pass. `results.jsonl` skips completed orgs, the importer recomputes ids from name, city, and state so a re-run does not double-write, and it unsticks orphaned queue rows each run.
- **Justifies its existence.** Pass. It is the only path that turns the 195,342 hidden stubs into searchable inventory, which is the venture's main unbuilt asset.

The verdict is that org-discovery earns its place and does not meet the section 7 bar. It fails on logging, kill switch, and version control, and its autonomous production write has no backup or rollback (Open Item 10). Until those close it stays a running script under watch, not an owned agent, and it keeps the strictest treatment: a capped daily batch, the 75-confidence floor, the never-store-PII guardrail, the post-write confirmation query, and a required periodic human audit of accept rate and guardrail compliance (Open Item 4). Wiring its logging, giving it an independent kill switch, and standing up the D1 backup and rollback are the three moves that would let it graduate.

## 5.4 The next build: pcd-deletion-monitor

This is the one agent cleared to build in July, and it is designed to meet the section 7 bar from day one. It is monitor-and-draft behind the HUMAN GATE, so it does not need the manual-3x clearance an autonomous action would.

- **Purpose.** Watch `support@parentcoachdesk.com` for deletion and opt-out requests, locate the record in `activity-radar`, and stage a ready-to-commit deletion inside the 30-day DATA-MAP SLA.
- **Success metric.** No deletion request ages past its 30-day SLA unstaged, measured by a zero-count of overdue requests at each run.
- **Approval gates.** Unsupervised: read the inbox, search the database, stage the change, post to Slack. Never without Jeff: the delete or anonymize itself, and any reply to the requester.
- **Kill switch.** Independent enable and disable at the scheduled-task toggle and `agent_registry.status`, with CANARY auto-pause on two failures in 24 hours. This is the one agent maintenance mode never idles, so the switch is manual only.
- **Logging contract.** One `agent_runs` row per run, no silent failure. A failed inbox or database read is logged as failed, because a missed run burns SLA days.
- **Idempotency.** It checks its prior run and the existing staged file by request id before staging, so a re-run never duplicates.
- **Evidence rule.** The staged item links to the source email and the matched record by id, so Jeff approves against evidence, not a summary.
- **Rollback path.** Deletion runs as anonymize-then-purge with a 30-day soft-delete window, pending Open Item 10's D1 backup; until that exists it anonymizes rather than hard-deletes so nothing is unrecoverable.
- **Supervisor and owner.** Supervisor Barnabus, human owner Support/Ops, risk R2, action class Stage.

Voice, Red Wall, and family firewall bind it like every PCD agent: any acknowledgment is drafted not sent, a request naming a child routes to Jeff only and stages nothing, and no PII enters the Slack post or the run log.

## 5.5 Future-menu and the decision-6 paths

The functions not yet agents each carry a decision-6 status, which names the manual task and how many times it has been done by hand.

- **SEO and traffic monitor (S1).** The weekly GSC review has four dated instances on file, so it clears manual-3x. It is future-menu, first in line at the December close once the July distribution work gives it real numbers to read.
- **The running eight (S5, S6, S8, S9, S10, S11).** These fire on schedule but were never run three times by hand as a deliberate test; their clearance is "running," which is not the same as a passed manual-3x. Each gets its full spec at promotion, wired to logging and a kill switch first, in the distribution-first order: affiliate and newsletter before editorial and data quality.

The working set stays capped at about eight portfolio-wide. Growth is workflow-driven, one agent at a time, only when a specific workflow is being built for automation, never speculative and never batched.

---

# Phases 6 to 10: table of contents and prerequisites

Phases 1 to 5 are complete above. The rest are stubbed. Each names what has to be true before it can start.

| Phase | Title | What it produces | Prerequisites |
|---|---|---|---|
| 6 | Logging and run-log wiring | Every PCD scheduled task writing to `agent_runs`; `agent_registry` rows for owned agents | `agent_runs` and `agent_registry` created in D1 (they do not exist yet); Open Item 3 closed |
| 7 | Scheduling and kill switches | Documented enable and disable per task, CANARY auto-pause on double failure, maintenance-mode toggles | Phase 6 logging live; section 3.4 pause-versus-degrade calls made |
| 8 | Dashboard and visibility | PCD's slice of the Forge Command command center, fed by the run log | Master Plan Phase D2 web app built; Phase 6 data flowing |
| 9 | QA and evals | A test pass on each owned agent: happy path, failure path, voice check, Red Wall and family firewall checks | Phase 5 agents exist; skill-creator eval tooling available |
| 10 | Maturity and scale review | The quarterly honest hour: which PCD process earned its place, what to pause, what to promote | First quarterly close (early December); real traffic and revenue numbers to judge against |

---

# 4. AI org chart

Each function is tagged as either a member of the Forge Command year-one working set or a future-menu candidate. The working set is capped at about eight agents portfolio-wide and does not grow until Jeff promotes something. Promotion is workflow-driven. The set grows one agent at a time, and only when a specific workflow is being built for automation, never speculatively and never as a batch. Each new agent still clears the existence test and the manual-3x gate before it earns a row. This is the standing answer to the three external reviews that proposed roughly thirty agents and six new departments at once (Jeff's call, 2026-07-13). Every future-menu row states its existence test (time, decision quality, risk, or revenue) and its manual-3x status.

| Function | Workstream | Tag | Existence test | Manual 3x | Approval posture |
|---|---|---|---|---|---|
| Barnabus (chief of staff) | Portfolio | Working set | Saves time: one briefing replaces scanning every venture | Live | Reports; never acts |
| Editorial | Editorial, Affiliate | Working set (registered `pcd, press`, status paused) | Revenue and time: content pipeline and gear guides | Cleared | Drafts only; Jeff publishes |
| Finance | Affiliate revenue, subscriptions | Working set (ships September) | Risk and decision: clean per-venture P&L | Pending | Reports; Jeff moves money |
| Support/Ops | Inbound triage (S12) | Working set (ships September) | Time and risk: triage across aliases | Not cleared | Drafts only; a human sends |
| SEO and traffic monitor | Marketing (S1) | Future-menu | Revenue: distribution is the binding constraint | Cleared (4 GSC reviews on file) | Reports only |
| Affiliate ops | Affiliate (S5, S6) | Future-menu | Revenue: link health protects earnings, reconcile tracks them | Running, not yet audited as 3x by hand | Reports; Jeff applies and changes payouts |
| Camp discovery | Camp lead gen (S7, S8) | Future-menu | Revenue and asset: enriches 195,342 hidden orgs | Running (autonomous) | Writes enrichment data; needs periodic audit |
| Newsletter | Marketing (S10) | Future-menu | Retention: turns visitors into a returning audience | Running (draft only) | Drafts only; Jeff sends |
| Site ops and security | Site operations | Not an agent | Stays Jeff-plus-Claude-Code sessions per Master Plan section 14 | n/a | Human sessions |

The honest tension: several future-menu functions already run as scheduled tasks even though no one has promoted them into the working set and given them a registry row and a logging contract. That is automation ahead of governance. The manual's position is that these tasks are grandfathered as running, but none of them counts as an owned working-set agent until it is registered, wired to the run log, and given a kill switch (Phases 6 and 7). Until then they are useful scripts, not agents, and Barnabus should carry them by their output, not assume they are logged.

---

# 5. Maturity roadmap

The order follows one rule from the binding: traffic and revenue-moving work ranks ahead of internal elegance, and everything respects the August-through-November idle. The audit's own 30/60/90 plan is the distribution spine; the internal wiring waits behind it.

**Now to fall camp (July, before the idle):** distribution first. Run the audit's day-0-to-30 fixes as sessions: the mojibake fix, the www-to-bare 301, the dead-brand link purge, the camp-page 301 policy, and the author reveal and first outreach push. These are the only work that moves causes 1 and 2 from the audit, and they are low effort. One internal build joins them, and only one. The S4 data-deletion and opt-out monitor gets built in July before the idle, because its 30-day compliance SLA runs year-round and nothing watches the inbox today. Everything else internal still waits behind distribution.

**The idle (August through November):** hold. PCD runs on its schedule at report-and-draft level or paused per section 3.4. Football season and LegisRadar (portfolio Priority 1) own the calendar. The only live watch is the data-deletion SLA.

**December (the first quarterly close):** judge and wire. Re-pull GSC and re-audit against the Organic Search Audit to see whether the July distribution work moved indexing and backlinks. Make the promotion calls: does the SEO monitor become an owned agent, does camp discovery get registered and logged. This is where Phases 6 and 7 (logging, registry, kill switches) land, because now there are real numbers to justify the wiring.

**2027 (post-close):** grow what earned it. Camp discovery scales the enrichment pass only if December shows the enriched orgs pull real search traffic. Editorial deepens the evergreen pages that rank. The dashboard (Phase 8) and QA (Phase 9) come last, because they make the system nicer to run, not more valuable to the business.

The sequencing keeps to failure mode 5 from the Master Plan: automate to serve acquisition, retention, product quality, or operational efficiency, never before. PCD's acquisition problem is distribution, so distribution is first and the internal build is last.

---

# 6. Governance: the ten rules as they bind PCD

The rules are the constitution and they hold here without exception. The four that bite hardest at PCD:

**HUMAN GATE.** No article publishes, no newsletter sends, no affiliate application submits, and no camp record is deleted without Jeff. Every drafting SOP above is draft-only by design.

**SOURCE RULE.** Content begins with research, not generation, and every claim in a report links to its source. The GSC and analytics SOPs pull live data; they do not estimate.

**RED WALL and FAMILY FIREWALL.** PCD is a parent-facing site, so inbound mail can carry player and family information. Anything touching recruits, players, or families routes to Jeff only, and household or health data never enters a PCD draft or briefing.

**RETIREMENT RULE.** Every PCD scheduled task has a defined end state. The camp discovery pass ends when the 195,342 stubs are resolved or judged not worth resolving. The July distribution sessions end when the audit's 30/60/90 plan is complete. No zombie tasks survive the December close.

---

# 7. Open items

1. **The venture file is out of date on automation.** `ventures/parentcoachdesk.md` (2026-07-12) says marketing, SEO, and camp lead-gen are not registry candidates and that the camp pipeline has never run. Ten PCD scheduled tasks are live, including the daily autonomous camp discovery agent. Reconcile the venture file against section 3.2. A proposed diff for the two stale statements is drafted in Appendix A; applying it to `ventures/parentcoachdesk.md` is the orchestrator's call, not this session's.
2. **Two overlapping GSC tasks.** `weekly-gsc-review` and `pcd-gsc-analytics-report` both fire Monday morning and both cover GSC. Confirm what each does and consolidate.
3. **No PCD task writes to `agent_runs`.** The logging contract says agents that do not log do not exist, and `agent_runs` and `agent_registry` do not exist in D1 yet. Nothing PCD runs is logged. This blocks Phase 6.
4. **Camp discovery writes live with no periodic human audit.** S7 pushes enrichment to the parent-facing database daily. Set a cadence for a human to audit its confidence threshold, its accept rate, and its guardrail compliance. All three external reviews (2026-07-13) independently landed on this gap, which raises its priority for the December close.
5. **Maintenance-mode rule (resolved 2026-07-13).** During the fall idle every PCD scheduled task runs maintenance-only: it pauses or degrades to report-only, with no writes and no active build work, S7's autonomous camp writes included. The only exceptions are the year-round S4 deletion watch and the critical escalations (lapsed domain, failed payment, uptime, security). The mechanism (a global PCD_MAINTENANCE_MODE toggle with an S4 bypass) is a Phase 7 build item; the ChatGPT per-task matrix is kept as reference in the Session Two input file.
6. **Two D1 database names for what may be one database.** `wrangler.jsonc` binds `activity-radar`; Deployments.md targets `parent-coach-playbook`. Confirm before the next migration (carried from the venture file).
7. **One compliance Critical open.** No terms of use for the camps directory's $79/yr listings, no UGC license, refund terms, or liability cap. Flagged for a lawyer pass. The paid-listings feature stays unlaunched until this closes.
8. **The camp lead-gen sub-plan is still unscoped as a staged plan.** S7 runs, but the staged rollout (hit-rate gate test, Ring 1 geocode, batch sizing) named in CAMP_DISCOVERY_PIPELINE_REVIEW.md is not written up as its own plan.

9. **ActivityRadar merge (2026-07-13): in progress, most code/docs work done this session.** Track V9 in the Forge Command Master Plan is resolved: ActivityRadar is PCD's camp data layer, not a standalone product. Full work-package status and evidence: `ACTIVITYRADAR-MERGE-PLAN.md` phase reports. Still open: Jeff's manual Cloudflare dashboard steps (activityradar.com 301, old Pages project delete, GitHub repo archive), the D1 backfill paste, and the final build/test/deploy/commit paste (see that file's Deploy block).

10. **No backup, rollback, or error recovery for the camp database S7 writes to.** `org-discovery-daily-worklist` mutates the `activity-radar` D1 autonomously every day, but there is no documented backup cadence, restore path, rollback procedure, or error-recovery plan if a batch writes bad data. Site source has git backup and a git rollback path; the database a daily autonomous agent changes has neither. Because the writes are already daily, stand up a D1 backup cadence now, and document a restore-and-rollback procedure before the discovery pass scales (Jeff's call, 2026-07-13). Surfaced independently by all three external reviews.

---

# 8. Review log

| Date | By | Notes |
|---|---|---|
| 2026-07-13 | Forge Command design session (PCD Operating Manual v1.0) | First pass. Phases 1 to 3 written; 4 to 10 stubbed with prerequisites. Five workstreams mapped to Blueprint departments; no new departments invented. Org chart tags each function working-set or future-menu with existence test and manual-3x status. Ten live PCD scheduled tasks inventoried in section 3.2 at Jeff's request; discrepancy with the venture file logged as Open Item 1. Maturity roadmap sequences distribution first, football-season idle respected. Decision to adopt per-venture Operating Manuals logged to the Field & Forge Decision Journal. |
| 2026-07-13 | Forge Command design session (PCD Operating Manual v1.2, Session Two) | Wrote Phases 4 and 5, grounded in the ten live PCD SKILL.md files (read via the scheduled-tasks tool), not a hypothetical library. Phase 4 is the prompt-management framework: the real inventory table, the naming convention (eight of ten carry the `pcd-` prefix), the storage finding (SKILL.md files live under `Documents\Claude\Scheduled\`, outside git, so the running prompts are not version-controlled), versioning, ownership, the frame-and-class content standard, testing and regression, evaluation, and lifecycle. Phase 5 is the operational org chart: every agent with skill-template fields plus supervisor (Barnabus), human owner, and an R1/R2/R3 risk class; each tagged live, working-set, or future-menu with its decision-6 path. The nightly `org-discovery-daily-worklist` (R3) gets the strictest treatment and an honest guardrail-by-guardrail read: it earns its place but does not meet the section 7 bar (fails logging, kill switch, version control; no DB backup or rollback). Added Appendix A: a proposed, unapplied diff reconciling Open Item 1's two stale venture-file statements. Design only; nothing built or scheduled. Decision logged; Notion mirror updated; the ventures file left untouched per the Session Two binding. |
| 2026-07-13 | Reconciliation pass, v1.1. Sources: Gemini review, ChatGPT review, ChatGPT full-draft rewrite | Adjudicated 46 items across 3 sources against the constitution. Rejected the build-the-AI-OS-now direction and the roughly thirty-agent, six-department expansion as violations of failure mode 5, the working-set cap, and section 1.4; the recursive inter-agent-handoff idea rejected under failure mode 2. Routed the Phase 4 and 5 material (prompt frames, agent spec template, Class A/B/C/D matrix, eval questions, intake taxonomy) to PCD-SESSION-TWO-INPUT-from-reviews-2026-07-13.md. Accepted: workflow-driven agent growth (section 4), the July build of the S4 monitor (S4, section 5), Open Item 4 reinforcement, new Open Item 10 for camp-database safety, and the resolution of Open Item 5 (fall idle runs maintenance-only). Jeff's other calls (2026-07-13): FTC disclosure confirmed covered on the site, and staged drafts surface in the existing Slack channel with a link to the markdown, one place to check. Full adjudication in PCD-MANUAL-RECONCILIATION-MEMO-2026-07-13.md. |

---

# Appendix A: proposed reconciliation fix for Open Item 1 (not applied)

Open Item 1 is the stale venture file. `ventures/parentcoachdesk.md` still states in two places that the camp pipeline has never run and that marketing has no registry candidate. Ten scheduled tasks run live, including the nightly autonomous camp discovery agent, so both statements are false as written.

Below is the proposed edit. It is not applied here. Per the Session Two binding, edits to `ventures/parentcoachdesk.md` are the orchestrator's call, so this appendix drafts the change and leaves the apply to that session.

**Change 1, the Camp lead generation workstream (the closing sentence).**

Current:

> Nothing in this pipeline has been run yet, so it clears none of the manual-three-times test and is not registered in `agent_registry`.

Proposed:

> This pipeline is live: the `org-discovery-daily-worklist` scheduled task runs it every night, searching org websites and writing accepted enrichments to the shared `activity-radar` D1 autonomously (see the PCD Operating Manual, section 3.2 and 5.3). It runs ahead of governance: no `agent_runs` logging, no independent kill switch, no database backup or rollback, so the manual grandfathers it as a running script under watch, not an owned `agent_registry` agent, until Phases 6 and 7 wire it. It does not clear the manual-three-times gate as a deliberate test; it clears it only as a thing already running.

**Change 2, the Marketing workstream.**

Current:

> No workstream document scopes this beyond the distribution gap named in Status. No recurring marketing task has been done three times anywhere in the file tree. Not a registry candidate yet.

Proposed:

> No workstream document scopes this beyond the distribution gap named in Status. Three marketing tasks do run live on a schedule: `weekly-gsc-review` and `pcd-gsc-analytics-report` (Monday) and `pcd-friday-letter-draft` (Wednesday), all report-or-draft only. The weekly GSC review has four dated instances on file, clearing the manual-three-times gate; it is the SEO and traffic monitor named as the first future-menu promotion at the December close (PCD Operating Manual, section 5.5). None is a registered `agent_registry` agent yet.

Both changes only bring the venture file into line with the live scheduled-task inventory and the Operating Manual. Neither adds scope, an agent, or a schedule.
