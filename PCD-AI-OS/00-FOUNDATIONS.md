# PCD AI Operating System — Foundations

**Version:** draft 0.1, 2026-07-15
**Status:** North-star design. Nothing in this folder builds an agent, a schedule, or a queue.
**Company-OS status (2026-07-18):** The parts of this design that govern the company today are consolidated into `strategy/PARENT-COACH-PLAYBOOK-COMPANY-OPERATING-SYSTEM.md`. This folder remains the detailed future-state AI design and cannot expand current authority on its own.
**Relationship to PCD-OPERATING-MANUAL.md:** That manual (v1.4) governs how PCD runs today. This folder designs where it is going: the full AI operating system Jeff commissioned on 2026-07-15. The v1.1 reconciliation rejected building the AI OS immediately, and that call stands. What changed is that Jeff ordered the design layer written now, so the build gates below become the adoption mechanism, not a reason to leave the destination unmapped. Pieces of this design graduate into the operating manual one workflow at a time, through the same gates everything else clears.

Every design agent writing a file in this folder reads this file first and treats it as canonical. Where a department design conflicts with this file, this file wins until Jeff amends it.

---

## 1. Company context

ParentCoachDesk.com is becoming the operating system for parents looking for youth activities, camps, and sports information. It is one venture inside Field & Forge Ventures, so every system designed here should be modular and reusable by sibling ventures (LegisRadar, MedConfRadar, future builds). Design for the portfolio, deploy for PCD.

**Real numbers, 2026-07-15:** ~805 articles, ~200 PNW camp listings live on a 198,287-org ActivityRadar D1 database, 135 affiliate picks, zero recorded revenue, zero organic clicks, a live-but-never-sent newsletter list, no social accounts. Per the 2026-07-14 automation audit: ~70% automated on analysis and drafting, ~10% automated on shipping.

**The binding constraint is distribution.** The product is 90% built; distribution is 10% built. Any system that moves traffic, links, subscribers, or revenue outranks any system that makes the machine more elegant.

**Hard calendar constraints:** PCD idles August through November (football season, maintenance mode: report-only, no writes, no build work; the S4 deletion watch is the only year-round exception). The two 2026 success metrics are the Chain Reaction manuscript and UPS football finishing 4th in conference. This design must assume the founder is unavailable four months a year, which is an argument for the AI OS, and also a constraint on how fast it gets built.

**The goal is not to replace people.** It is to eliminate repetitive work while increasing quality, with human approval at every decision that matters.

## 2. Current automation estate (design from this, not from zero)

Seven named agents exist, specced and registered: Barnabus (chief of staff, portfolio), Nora (SEO/GSC), Ed (editorial), Frida (newsletter), Hal (affiliate ops), Ranger (camp data), Vera (deletion/compliance monitor), plus Sunny (support triage, built, paused). Eleven Cowork scheduled tasks run them. Three Cloudflare Workers run the site, cron, and camp enrichment. A run-log endpoint (`POST /api/agent-runs`, bearer-token, idempotent, Slack-alerting, CANARY-pausing) went live 2026-07-15. A separate task is currently fixing the audit's five leaks (deletion monitor re-enable, dormant cron, hardcoded key, stale Gear Files build, never-sent newsletter). This design assumes those leaks close.

The existing estate is the seed of this org, not a legacy to route around. Every department design must state which existing agents, tasks, workers, and D1 tables it grows from.

## 3. Non-negotiable principles

These come from the Forge Command constitution and the v1.x manual. They bind every department and every agent designed in this folder.

1. **HUMAN GATE.** Sends, purchases, payments, deletions, and publications require Jeff's approval. Agents analyze, draft, and stage; they do not ship, except inside an explicitly designed Act-class scope.
2. **Action classes.** Every agent output is one of four classes. **Analyze:** read-only report. **Draft:** document a human may act on. **Stage:** fully-formed change set waiting on one approval. **Act:** autonomous execution inside a confidence threshold and a bounded scope, the rare exception, never the default.
3. **Risk classes.** R1 produces drafts/reports only. R2 stages changes a human commits. R3 writes to production autonomously. R3 agents require logging, an independent kill switch, version-controlled prompts, backup and rollback, and a periodic human audit before they run.
4. **Decision-6 (manual 3x).** No recurring task becomes an autonomous agent until a human has done it by hand at least three times. Monitor-and-draft agents behind the gate are exempt.
5. **Existence test.** No agent exists unless it saves real time, improves a decision, reduces risk, or increases revenue. Growth is workflow-driven, one agent at a time, never speculative, never batched.
6. **Logging contract.** An agent that does not log does not exist. One `agent_runs` row per run, even on failure. CANARY auto-pause on two failures in 24 hours. A disabled compliance agent is itself an incident.
7. **SOURCE RULE.** Content and intelligence begin with research, not generation. Every claim links to its source. Evidence attached to every recommendation.
8. **RED WALL and FAMILY FIREWALL.** Anything touching recruits, players, children, or families routes to Jeff only. Household, health, and child data never enter drafts, briefings, logs, or the intelligence store.
9. **RETIREMENT RULE.** Every agent and SOP has a defined end state. No zombie tasks survive a quarterly close.
10. **Maintenance mode.** A global PCD_MAINTENANCE_MODE toggle degrades every agent to report-only August through November, with a named bypass list (S4 deletion watch, security incidents, domain/payment failures).

## 4. Stack primitives

Design against these and nothing else unless a department makes the case for an addition:

- **Cloudflare:** Workers (APIs, crons), D1 (databases), R2 (files/backups), Queues (event bus), Email Routing (inbound), Pages/Workers hosting.
- **Notion:** system of record for dashboards, decision queues, CRM, and anything Jeff reads and edits by hand.
- **GitHub:** version control for site, workers, and every agent prompt (prompts-as-code; the current out-of-git SKILL.md storage is a named defect being fixed).
- **Claude Code / Claude Dispatch / Cowork scheduled tasks:** the agent runtime.
- **Slack:** the staging and approval surface (existing pattern: staged drafts post to the PCD channel with a link to the markdown).
- **Google Workspace / Kit (ConvertKit):** email and newsletter delivery.

**Shared OS infrastructure every department consumes** (designed once, in file 01, reused everywhere):

- `agent_runs` + `agent_registry` (exists): run log and kill switches.
- **Event bus:** an `events` table in D1 plus Cloudflare Queues. Agents emit and subscribe to namespaced events (`pcd.<domain>.<event>`, e.g. `pcd.editorial.draft_ready`, `pcd.camps.record_flagged`, `pcd.intel.opportunity_detected`).
- **Approval Queue:** one queue, not seventeen. Every Stage-class output lands as an approval card (Slack message + Notion row) with evidence, a recommended action, a confidence score, and one-tap approve/reject. Jeff's approval throughput is the scarcest resource in the company; the queue is designed around it.
- **Intelligence store:** D1 tables for signals and metrics, R2 for raw captures, Notion for surfaced dashboards. Specified in file 02.

## 5. Canonical department taxonomy and agent roster

Seventeen departments. Leads carry human names (existing names kept, new ones proposed, Jeff renames at will). Sub-agents carry task names: `pcd-<dept>-<function>`. Every lead's supervisor is Barnabus; every human owner is Jeff until stated otherwise.

| # | Department | Lead | Status | Grows from |
|---|---|---|---|---|
| 1 | Executive Office | Barnabus (+ Jarvis, portfolio orchestrator) | exists | barnabus-morning-briefing, weekly review |
| 2 | Intelligence Layer | **Iris** (new) | design | GSC reviews, freshness audits, camp coverage analysis |
| 3 | Editorial | Ed | exists | rules-watcher, seasonal scheduler, freshness audit |
| 4 | Buying Guides & Affiliate | Hal | exists | link-health monitor, affiliate reconciler |
| 5 | Camp Directory | Ranger | exists | org-discovery, camps data steward, enrichment workers |
| 6 | Sales | **Sal** (new) | design | nothing yet; gated on Open Item 7 legal terms |
| 7 | Marketing | Nora | exists (scope grows from SEO to all channels) | weekly-gsc-review, seasonal social queue |
| 8 | Customer Success | Sunny | built, paused | S12 inbound triage |
| 9 | Newsletter | Frida | exists | friday-letter-draft, Kit |
| 10 | Reviews | **Remy** (new) | design | empty camp_reviews tables |
| 11 | Engineering | **Wes** (new) | design | workers, deploy pipeline, site cron |
| 12 | Security | **Locke** (new) | design | security audits, JWT gap, secrets findings |
| 13 | Analytics | **Ana** (new) | design | GSC data, GA4 (unwired), affiliate numbers |
| 14 | Finance | **Penny** (new; reconcile with portfolio Finance agent shipping September) | design | affiliate reconciler outputs |
| 15 | Legal & Compliance | Vera (scope grows from deletion monitor) | exists | pcd-deletion-monitor, DATA-MAP, Open Item 7 |
| 16 | Product | **Piper** (new) | design | SITE_IMPROVEMENTS.md, backlog files |
| 17 | Automation | **Max** (new) | design | the audit process itself |

A named lead in this table is an accountability slot, not a build commitment. Most sub-agents listed in department files will be future-menu for a long time. That is correct and should be stated plainly in every file.

## 6. Confidence threshold scheme

Anchored on the one live Act-class precedent (org-discovery's 75-confidence floor). Per-department tunable, but the default bands are:

- **≥ 90:** eligible for Act-class autonomy, only within a scope Jeff has pre-approved in the Human Approval Matrix, only for R3-qualified agents.
- **70–89:** Stage. Full change set to the Approval Queue.
- **50–69:** Draft with flagged uncertainty; a human decides whether it is worth finishing.
- **< 50:** log the signal, take no action, surface in the weekly review if it recurs.

## 7. Required templates

**Every department section answers all fourteen, under these exact headings:** Mission · Work performed · SOPs required · Fully automated tasks · AI-recommends tasks · Human-approval tasks · Success metrics · Owning agents · Triggering events · Data produced · Data consumers · Failure modes · Failure handling · Quality measurement · Continuous improvement. (Quality and CI may merge failure/quality subsections sensibly, but all fourteen answers must be present.)

**Every agent spec carries twelve fields:** purpose, responsibilities, triggers, inputs, outputs (with action class), human approval gates, escalation rules, failure recovery, confidence thresholds, logging contract, success metrics, risk class. Sub-agents may be specced in a compact table with those columns.

## 8. Writing standards for this folder

Jeff's project voice rules apply. No em dashes. Three-sentence paragraph maximum. Banned words include: delve, tapestry, leverage, robust, seamless, pivotal, transformative, foster, empower, innovative, journey, elevate, harness, unlock, comprehensive, streamline, dynamic. No fake wisdom triplets. Tables and Mermaid diagrams encouraged. Write like an operator, not a consultant deck: every section should survive the question "what would we actually do Monday morning."

Honesty rule from the v1.x manual carries over: distinguish "designed" from "built" from "running" in every table. Do not round up.

## 9. File map

| File | Contents | Deliverables covered |
|---|---|---|
| 00-FOUNDATIONS.md | this file | principles, roster, templates |
| 00-README.md | index, how to read, deliverable map | — |
| 01-executive-office.md | Executive Office, org chart, decision queue, approval queue, Human Approval Matrix | 1, 2 (partial), 11 |
| 02-intelligence-architecture.md | all 17 intelligence functions + platform architecture | 8, plus dept breakdown |
| 03-content-departments.md | Editorial, Buying Guides, Newsletter, Reviews | 2 (partial), 3 (partial) |
| 04-market-departments.md | Camp Directory, Sales, Marketing, Customer Success | 2 (partial), 3 (partial) |
| 05-platform-departments.md | Engineering, Security, Analytics, Finance, Legal & Compliance, Product, Automation | 2 (partial), 3 (partial) |
| 06-quality-and-risk.md | QA framework, weekly Executive Audit, KPI dashboards, risk register, continuous improvement | 9, 10, 12, 13 |
| 07-sops-events-agents.md | consolidated SOP list, event trigger map, agent registry, workflow diagrams | 3, 4, 5, 6 |
| 08-roadmaps.md | development order, automation roadmap, 90-day plan, 12-month roadmap, 5-year vision | 7, 14, 15, 16, 17 |
