# Plan: ParentCoachDesk autonomous operations learning program

**Plan ID:** 019  
**Author:** Codex  
**Date:** 2026-07-17  
**Status:** Awaiting Jeff  

## Objective

Build the complete ParentCoachDesk autonomous operations vision as a governed, multi-phase learning and implementation program. ParentCoachDesk is the concrete production application; the program intentionally teaches the full lifecycle of product architecture, Cloudflare development, data engineering, editorial operations, affiliate operations, AI-assisted automation, compliance, security, observability, recovery, and eventual platform extraction.

This is a master program plan, not authorization to implement every phase at once. Each implementation increment remains a separately approved Tier 2 or Tier 3 child plan with a bounded diff, dedicated branch or worktree, handoff, independent Codex review, Jeff merge approval, and separate deployment approval.

## Tier

Tier 3. The destination spans schemas, migrations, authentication, production data, crawling, publishing, email, affiliate revenue, analytics, AI providers, scheduled work, security, privacy, accessibility, and multiple Cloudflare services. Individual child increments may be Tier 2 when genuinely bounded, but this governing program is architectural.

## Business outcome

ParentCoachDesk becomes a trustworthy parent-facing product and a portfolio-grade production system whose operating capabilities are observable, testable, documented, recoverable, and progressively automated.

The program succeeds even if the initial commercial thesis changes. It produces:

- a functioning and measurable ParentCoachDesk product;
- practical full-stack, data, cloud, security, compliance, and operations experience for Jeff;
- a documented Cross-Model Critic development method using Claude Code for implementation and Codex for architecture and independent review;
- reusable modules proven inside a real application before extraction;
- evidence about demand, accuracy, maintenance cost, and monetization that guides product changes without terminating the learning program.

## Governing interpretation of the north-star architecture

The master architecture is adopted as a destination, subject to these controlling interpretations:

1. **Build the whole curriculum, not the whole system at once.** A phase graduates only when it is usable, tested, documented, recoverable, and observable.
2. **ParentCoachDesk first.** Every capability must solve a named ParentCoachDesk problem before it may become a shared abstraction.
3. **Forge OS is earned.** Until Phase 12, “Forge OS” is a direction and package boundary, not a separate product or permission to create a generalized framework.
4. **Vertical slices precede horizontal platforms.** The first instance of a pattern is application code. The second proves recurrence. Only then may the third become a shared module.
5. **Business measurement informs rather than cancels learning.** Weak traffic, conversion, or revenue changes the product proposition and priority order; it does not invalidate the program.
6. **Autonomy is risk-based.** Confidence never overrides action class, legal constraints, data sensitivity, or explicit human gates.
7. **Evidence outranks generated confidence.** Confidence is metadata. Provenance, validation, evaluation history, and human correction determine trust.
8. **No silent staleness.** Time-sensitive claims have a verification state and recheck policy. Failed verification becomes visible and queues work.
9. **No hidden control planes.** D1-backed operational state is authoritative. Slack, Notion, email, dashboards, and model conversations are projections or interfaces.
10. **No production automation through consumer AI subscriptions.** Claude Code and Codex build and review the platform. Unattended model calls use explicit APIs, budgets, schemas, evaluations, and provider controls.

## Current-state evidence

This section is a routing snapshot, not a substitute for `coordination/CURRENT_STATE.md`. Re-verify it when any child plan begins.

- **Documented as deployed and confirmed live in the current-state ledger, 2026-07-17:** ParentCoachDesk runs on a production Cloudflare Worker, has an isolated staging Worker, and protects administrative routes with Cloudflare Access.
- **Verified in code:** the application uses Astro 7, the Cloudflare adapter, TypeScript, Vitest, Wrangler, Tailwind, Leaflet, WorkOS packages, and Sentry packages.
- **Verified in code:** the repository already contains D1 migrations, an activity directory, R2-backed photo/evidence concepts, camp administration, affiliate content, editorial content, newsletter integration, operational APIs, release-evidence tooling, backup scripts, and extensive tests.
- **Verified in code:** `DATA-MAP.md` inventories current personal-data flows and identifies an unresolved search-event retention conflict.
- **Verified in code:** Plans 012 and 013 already define the operational substrate, first demand loop, public-directory readiness, owner boundary, and paid-product direction. This plan does not supersede their approved architectural decisions.
- **Verified in code:** `PCD-AI-OS/` is a north-star design containing foundations, department concepts, safety rules, and a phased roadmap. It is design input, not proof that those systems run.
- **Verified by tests according to the current-state ledger, 2026-07-17:** the then-current suite passed 565 unit tests and 44 integration tests; future child plans must re-run current commands and must not reuse these results as fresh evidence.
- **Not verified for this plan:** final customer readiness, counsel disposition, production activation of default-off operations schemas, end-to-end accessibility evidence, notification receipt, all retention enforcement, or full restoration readiness.
- **Verified in code at plan-authoring time:** the working tree contains unrelated modified and untracked files. Implementers must preserve them and use an isolated worktree when overlap is possible.

## Program definition of done

A capability is **designed** when requirements, risks, contracts, and acceptance criteria exist.

A capability is **built** when its approved code and migrations exist and local validation passes.

A capability is **staging-proven** when it operates against isolated staging resources with failure, retry, and rollback evidence.

A capability is **production-ready** when the applicable security, privacy, accessibility, legal, data, observability, and recovery gates pass.

A capability is **running** only when live activation and monitoring are confirmed.

A capability is **graduated** only when all seven statements are true:

- deployable;
- tested;
- documented;
- recoverable;
- observable;
- correctly permissioned;
- useful to a named user or operator workflow.

No document may collapse these states into “done.”

## Canonical system boundaries

### ParentCoachDesk repository

Owns:

- public parent experience;
- editorial and directory domain models;
- organization, location, program, camp-session, activity, product, article, citation, source, and correction semantics;
- public and protected PCD APIs;
- PCD-specific telemetry;
- PCD admin interfaces;
- PCD adapters into the shared operational runtime;
- brand voice, editorial policy, affiliate policy, and parent-facing disclosures.

### Operational runtime

The architecture approved by Plans 012 and 013 names Forge Command as the canonical shared runtime. It owns:

- workflow definitions and versions;
- scheduled work and durable work items;
- leases, retries, dead letters, idempotency, and cancellation;
- action policies, maintenance mode, budgets, and scoped credentials;
- approval records and immutable decision history;
- agent/run health and cross-workflow operational summaries.

It does not own ParentCoachDesk domain records or silently become a second CMS.

### External services

- Cloudflare provides edge compute, bindings, storage, queues/workflows where justified, access protection, rate limiting, bot controls, and operational telemetry.
- GitHub is canonical for code, migrations, prompts, policies, schemas, evaluations, and reviewable configuration.
- Kit or a successor email provider owns subscriber delivery mechanics, consent status, unsubscribes, suppression, bounce handling, and campaign delivery.
- Slack, Notion, and email may notify or project state; they are not authoritative workflow databases.
- Model providers perform bounded inference through the AI gateway; they do not schedule themselves or hold authoritative state.

### Confidential portfolio boundary

No phase of this plan authorizes reading, indexing, importing, or modifying MedConfRadar’s confidential core data-broker directory. A future reuse proposal must treat it as a separate security and compliance boundary and requires explicit Jeff authorization.

## Target logical architecture

```text
Parents / organization representatives / Jeff
                    |
          ParentCoachDesk Worker
        public UI + protected admin
                    |
      ---------------------------------
      |               |               |
  Domain services   Command adapter   Event adapter
      |               |               |
 activity D1       operations D1    Queue/event log
 normalized data   approvals/work    compact IDs only
      |               |               |
 evidence metadata   operational runtime / Workflows
      |                               |
      R2 evidence, media, imports, exports, backups
                                      |
                deterministic tools -> AI gateway
                                      |
                         approved model providers
```

Architecture rules:

- Prefer Cloudflare bindings over calling Cloudflare’s REST API from a Worker.
- Keep slow, scheduled, retryable, rate-limited, or failure-prone work off the interactive request path.
- Use Queues for discrete asynchronous jobs and Workflows for explicit durable multi-step state machines; do not adopt either only to satisfy the north-star vocabulary.
- Queue messages carry stable identifiers, versions, correlation IDs, and object keys—not complete webpages or large model payloads.
- Stream or size-bound crawl responses; never load unbounded responses into Worker memory.
- Do not store request-specific mutable state at module scope.
- Every promise is awaited, returned, explicitly ignored, or passed to the execution context.
- Generate binding types from Wrangler configuration; do not maintain hand-written binding interfaces that can drift.
- Store secrets only in approved secret systems. Configuration names may be documented; values may not.
- Use service bindings for internal Worker-to-Worker calls when components are separated.

## Core domain model

The target is a relational entity-and-claim model, not an immediate graph database.

### Stable entities

- `brands`
- `organizations`
- `organization_names`
- `organization_websites`
- `organization_locations`
- `organization_contacts`
- `facilities`
- `activities`
- `programs`
- `camp_sessions`
- `age_ranges`
- `registration_destinations`
- `products`
- `merchants`
- `affiliate_links`
- `articles`
- `buying_guides`
- `newsletter_issues`

### Trust and evidence entities

- `sources`
- `source_captures`
- `claims`
- `claim_values` or typed domain projections
- `verification_attempts`
- `confidence_assessments`
- `change_sets`
- `corrections`
- `removal_requests`
- `do_not_republish_records`
- `content_versions`

Every time-sensitive public fact must be traceable to a source capture or an approved authoritative submission. A fact’s record must distinguish observed value, normalized value, publication state, verifier, verification method, last-verified time, expiry/recheck time, and supersession history.

### Operational entities

- `workflow_definitions`
- `workflow_versions`
- `work_items`
- `workflow_runs`
- `steps`
- `events`
- `approvals`
- `approval_decisions`
- `leases`
- `retry_attempts`
- `dead_letters`
- `agent_policies`
- `prompt_versions`
- `budgets`
- `usage_records`
- `incidents`
- `notifications`
- `audit_events`

### Measurement entities

- `search_events` with approved minimization and retention;
- `content_metrics_daily`;
- `directory_metrics_daily`;
- `affiliate_click_events` and provider-supplied conversion aggregates;
- `newsletter_metrics_daily`;
- `experiments`, `variants`, and `experiment_observations`;
- `opportunities` and `opportunity_outcomes`;
- `assumptions` and `assumption_reviews`;
- `agent_evaluations`.

### Data-model constraints

- Stable IDs never encode mutable names or URLs.
- Source history is append-only; corrected projections may change, but evidence is not overwritten.
- Publication is a state transition, not the presence of a row.
- Commercial status never changes verification status.
- Organization ownership, directory verification, editorial endorsement, sponsorship, and affiliate relationships are separate concepts.
- Public data, personal data, operational data, raw crawl evidence, and analytics have separately documented retention and access policies.
- Schema migrations are forward-only by default, rehearsed against staging, and paired with a data rollback or compensating plan.

## Universal workflow contract

Every automated workflow must define:

- stable workflow ID and semantic version;
- human owner and technical owner;
- purpose and measurable value;
- trigger and scheduling authority;
- typed input and output schemas;
- data classification and permitted stores;
- allowed tools, outbound domains, and credential scopes;
- action class: Analyze, Draft, Stage, or Act;
- risk class and approval policy;
- idempotency key and duplicate behavior;
- timeout, lease, retry cap, backoff, and dead-letter behavior;
- cancellation and kill-switch behavior;
- model policy, maximum cost, and deterministic fallback;
- logging, metrics, tracing, and alert thresholds;
- test fixtures, evaluation set, and minimum score;
- maintenance-mode behavior;
- rollback or compensation procedure;
- retirement condition.

No prompt alone satisfies this contract.

## Human approval policy

### Permanently human-approved

- production deployment and primary-branch merge;
- production schema migration or bulk data change;
- purchases, refunds, payouts, pricing, and payment movement;
- publication of new editorial content until a separately approved policy allows a bounded exception;
- legal, medical, health, safety, or high-consequence claims;
- external email campaigns and partnership outreach;
- mass affiliate-link replacement;
- destructive deletion, organization removal, or do-not-republish adjudication;
- security policy, data-retention policy, or privacy-policy changes;
- new vendor, new category of personal data, or new cross-border data flow;
- secrets, DNS, authentication-provider, and production access-policy changes.

### Eligible for later bounded autonomy

Only after measured evaluation and explicit approval:

- recomputing freshness scores;
- marking a link unavailable without substituting a product;
- retrying transient failures;
- capturing a versioned source snapshot;
- queuing a recheck;
- updating an internal aggregate metric;
- suppressing an obviously duplicate work item;
- low-risk metadata corrections sourced from an already approved authoritative feed.

### Approval integrity

An approval binds the approver, decision, timestamp, exact payload hash, evidence set, policy version, and expiry. Material payload changes invalidate approval. Slack may deep-link to the protected record; the authoritative decision is recorded through the protected command service.

## Cross-cutting release gates

Every child plan identifies which gates it changes and produces evidence for them.

### Gate 1: product and UX

- Named user and job-to-be-done.
- Happy path, empty state, partial state, error state, and recovery state.
- Mobile and slow-network behavior.
- No public surface exposes an internal confidence score without explaining what it means.

### Gate 2: accessibility

- Automated checks plus manual keyboard and screen-reader evidence for changed journeys.
- Focus order, names, errors, live regions, contrast, zoom/reflow, and reduced-motion behavior.
- Generated or third-party components receive the same review as hand-authored UI.

### Gate 3: privacy and data governance

- `DATA-MAP.md` updated before collection ships.
- Purpose, minimization, retention, deletion, access, export, and vendor transfer documented.
- No child profiles, household profiles, health data, or unnecessary stable visitor identity.
- Search and behavior telemetry is bounded, bot-filtered where practical, and not silently repurposed.
- Counsel reviews customer-facing legal conclusions and unresolved jurisdictional rules.

### Gate 4: security

- Threat model for new trust boundaries.
- Authentication and object-level authorization tests.
- Least-privilege bindings and outbound-domain restrictions.
- Input validation, output encoding, rate limiting, abuse controls, and prompt-injection defenses.
- Secrets scan, dependency audit, security headers, and sensitive-log review.

### Gate 5: data quality and trust

- Required provenance and freshness fields.
- Golden fixtures include ambiguous, expired, duplicate, adversarial, JavaScript-heavy, and no-result examples.
- Field-level accuracy and false-publication thresholds are specified before scaling.
- Failed verification degrades visibly and cannot silently certify data.

### Gate 6: observability and operations

- Structured logs with environment, workflow/run/work-item/entity IDs, version, attempt, duration, outcome, and error code.
- Success, failure, retry, dead-letter, cost, queue-depth, and human-review metrics.
- Alert owner, routing, deduplication, and escalation path.
- Runbook and operational dashboard entry.

### Gate 7: recovery

- Rollback target identified and verified safe.
- Backup scope includes all changed durable stores.
- Restore or compensating procedure rehearsed in isolation when autonomous writes are introduced.
- Reprocessing is idempotent and does not duplicate publication, charges, emails, or affiliate changes.

### Gate 8: financial and vendor controls

- Metered services have daily/monthly caps and alert thresholds.
- Cost per processed organization, verified session, content item, model call, and human review is measured when applicable.
- Vendor failure, quota exhaustion, and termination/export paths are documented.

### Gate 9: legal and editorial integrity

- Affiliate and sponsorship disclosures are accurate and proximate.
- Image, quotation, trademark, and source-use rights are tracked.
- Crawl policy, robots handling, terms-of-service risk, correction, takedown, and do-not-republish procedures exist.
- Safety-sensitive content uses qualified review and dated sources.

## Infrastructure component map

| Need | Initial component | Introduce when | Do not use it for |
|---|---|---|---|
| Public and admin application | Astro on Cloudflare Workers | Already selected | Unbounded background crawling inside requests |
| Relational domain data | D1 activity/domain database | Existing; evolve through migrations | Raw HTML, large screenshots, or opaque model transcripts |
| Operational state | D1 operations/runtime database | Existing approved direction | Duplicating domain truth or acting as a CMS |
| Evidence and media | R2 | Evidence capture, uploads, exports, backups | Authoritative relational state without metadata |
| Discrete async jobs | Cloudflare Queues | Volume/retry needs exceed request handling | Vague agent-to-agent messaging or large payload transport |
| Durable state machines | Cloudflare Workflows | A named process spans durable steps, waits, or retries | Replacing a simple queue consumer or hiding state transitions |
| Schedules | Cron Triggers or operational scheduler | One authoritative schedule per workflow | Duplicate GitHub and Cloudflare schedules for the same job |
| Internal service calls | Service bindings | A Worker boundary is justified | Public HTTP calls between trusted internal Workers |
| Staff access | Cloudflare Access plus application authorization | Existing | Customer organization identity |
| Public form abuse protection | Turnstile plus rate limits and validation | Public mutation/intake forms | Replacing authorization or input validation |
| Customer identity | Deliberately selected external-user auth boundary | Phase 7 | Reusing staff Access as a customer account system |
| Search | Indexed D1 queries and precomputed facets | Phase 3 | Pretending SQL search has typo/relevance features it lacks |
| Browser retrieval | Browser Rendering or approved controlled runner | Only for measured JS-only sources | Rendering every crawled page by default |
| Analytics | First-party events plus approved aggregate providers | When a decision consumes the metric | Stable child/household profiling |
| AI inference | Shared gateway to approved providers | Phase 10 or earlier bounded evaluated need | Direct calls scattered through workflows |
| Email delivery | Approved transactional and newsletter providers | Phase 6/7 | Building a custom bulk sender on Workers or Gmail |
| Error monitoring | Cloudflare observability, with Sentry where justified | Existing/Phase 11 | Logging sensitive payloads or substituting alerts for recovery |

Before a child plan uses a Cloudflare product, it must verify current documentation, pricing, quotas, configuration schema, and type definitions. This plan intentionally avoids freezing drift-prone platform limits or prices.

## Agent and workflow catalog

Personas provide human-readable accountability; stable workflow IDs are the executable units. A named persona is not automatically an active autonomous agent.

| Persona / function | Candidate workflow | Inputs | Outputs | Maximum initial action | Admission evidence |
|---|---|---|---|---|---|
| Barnabus / executive office | `pcd-executive-daily-briefing` | Aggregated health, approvals, demand, revenue, incidents | Daily exception/opportunity brief | Analyze | Reconciled metrics and owned delivery channel |
| Ranger / camp data | `pcd-camps-source-recheck` | Due claims, source URLs, prior hashes | Evidence capture and proposed change set | Stage | Golden-set accuracy, crawl policy, idempotency, recovery |
| Ranger / discovery | `pcd-camps-organization-discovery` | Approved source lists and coverage gaps | Candidate organizations with evidence | Draft | Duplicate controls and cohort accuracy |
| Ed / editorial | `pcd-editorial-brief-builder` | Approved opportunity, sources, editorial policy | Versioned research brief | Draft | Source and voice evaluation |
| Ed / editorial | `pcd-editorial-refresh-review` | Decay signals, current article, sources | Proposed refresh with claim changes | Stage | Citation, regression, and rollback tests |
| Nora / SEO and marketing | `pcd-seo-technical-audit` | Crawl/index, sitemap, links, performance | Prioritized technical recommendations | Analyze | Reproducible diagnostics and false-positive sample |
| Nora / seasonal planning | `pcd-seasonal-opportunity-planner` | Calendar, demand, supply, prior performance | Approved-calendar candidates | Draft | Lead-time and duplication rules |
| Hal / affiliate | `pcd-affiliate-link-health` | Redirect registry, merchant responses, placement map | Availability flags and replacement candidates | Stage | Merchant policy, disclosure, and rollback tests |
| Frida / newsletter | `pcd-newsletter-issue-draft` | Approved content, directory changes, segment policy | Accessible issue draft and QA report | Stage | Consent boundary and link/disclosure checks |
| Sunny / customer success | `pcd-support-triage` | Inbound support messages | Classification and response draft | Draft | Privacy redaction and escalation accuracy |
| Vera / compliance | `pcd-privacy-deadline-monitor` | Privacy/correction cases and deadlines | Escalations and status report | Analyze | Zero missed synthetic deadlines and alert receipt |
| Vera / trust | `pcd-trust-correction-router` | Correction/removal submissions | Deduplicated case and routing recommendation | Stage | Abuse, identity, and do-not-republish tests |
| Iris / intelligence | `pcd-demand-gap-analysis` | Aggregated search, content, and supply metrics | Evidence-backed opportunity cards | Draft | Privacy thresholds and deterministic reproduction |
| Ana / analytics | `pcd-metric-reconciliation` | Source events and dashboard aggregates | Reconciliation result and anomaly report | Analyze | Known-total fixtures and drift alerts |
| Remy / reviews | `pcd-review-moderation-assist` | Submitted reviews and policy | Risk labels and moderation recommendation | Draft | Safety, defamation, bias, and appeal fixtures |
| Sal / partnerships | `pcd-partnership-qualification` | Public organization/commercial signals | Qualified lead and outreach draft | Draft | Legal basis, opt-out, accuracy, and human-send gate |
| Penny / finance | `pcd-unit-economics-brief` | Costs, revenue aggregates, human time | Unit economics with uncertainty notes | Analyze | Source reconciliation and attribution caveats |
| Wes / engineering | `pcd-platform-health-summary` | Logs, health checks, deploy and dependency data | Incident/maintenance recommendations | Analyze | Alert quality and runbook mapping |
| Locke / security | `pcd-security-control-monitor` | Approved control evidence and scans | Findings requiring human disposition | Analyze | Sanitization and verified tool output |
| Piper / product | `pcd-product-opportunity-review` | Demand, journey, support, experiment results | Prioritized product proposal | Draft | Evidence links and assumption register |
| Max / automation | `pcd-workflow-performance-review` | Run, cost, retry, approval, correction metrics | Pause/retain/retire recommendation | Draft | Independent evaluation and no self-approval |

### Agent admission sequence

1. A human performs or supervises the workflow enough times to document reality.
2. The workflow passes the existence test: it saves time, improves a decision, reduces risk, or increases measured value.
3. A typed contract, fixtures, policy, owner, budget, kill switch, and retirement rule are approved.
4. The workflow runs locally or against fixtures.
5. It runs in staging in Analyze mode.
6. It runs in shadow mode against real inputs without external effects.
7. Draft or Stage authority is approved only after evaluation evidence.
8. Act authority, if ever appropriate, receives a separate Tier 3 plan and narrow scope.

No agent approves its own work, changes its own policy, increases its budget, expands its tool access, or suppresses its own failures.

## SOP catalog

SOPs are written when their phase is designed and must be runnable by Jeff or another authorized human without relying on chat history.

| Operating area | Required SOPs before graduation |
|---|---|
| Release and environments | Branch/worktree setup; local validation; staging deploy; production approval; smoke test; rollback; release evidence |
| Schema and data | Migration authoring; compatibility test; staging rehearsal; production change request; reconciliation; rollback/compensation |
| Backup and recovery | Backup creation; integrity verification; isolated restore; application verification; failed-backup incident |
| Camp discovery | Source eligibility; crawl policy; duplicate organization handling; difficult-site escalation; cohort promotion |
| Camp verification | Evidence capture; field validation; ambiguity handling; approval; public verification; recheck; stale/unverifiable display |
| Corrections and removal | Intake; identity/risk triage; SLA; evidence review; correction; removal; do-not-republish; appeal |
| Editorial | Opportunity intake; research; brief; draft; edit; fact check; policy QA; approval; publish; refresh; correction; retirement |
| Affiliate | Program-policy review; link creation; disclosure check; health monitoring; replacement approval; rollback; reporting reconciliation |
| Newsletter | Consent verification; issue assembly; QA; send approval; suppression; complaint/bounce handling; deletion; provider outage |
| Search and local pages | Query QA; relevance review; no-result analysis; local utility threshold; index/noindex decision; consolidation |
| Organization accounts | Claim proof; membership grant; invitation; recovery; role change; dispute; suspension; termination |
| Support and partnerships | Triage; escalation; response approval; outreach approval; opt-out; relationship record update |
| Analytics | Event change control; data-quality reconciliation; dashboard certification; experiment design; experiment closeout |
| AI and prompts | Prompt change; schema change; evaluation; provider/model change; injection test; budget incident; rollback; retirement |
| Security | Access review; secret rotation; dependency finding; abuse incident; vulnerability intake; disclosure response |
| Privacy and compliance | Data-map change; vendor review; request handling; retention enforcement; deletion proof; counsel escalation |
| Platform operations | Alert triage; queue backlog; dead letter; schedule failure; provider outage; cost overrun; incident/postmortem |
| Executive office | Daily briefing review; approval prioritization; weekly operating review; monthly assumption/evolution review |

Every SOP includes: purpose, owner, trigger, prerequisites, permissions, ordered steps, expected evidence, stop conditions, escalation, rollback/compensation, completion record, and review cadence.

## Cost and capacity ledger

The original architecture’s dollar figures are not adopted as a budget. Phase 0 creates the authoritative ledger below and each phase fills measured values.

| Component | Fixed commitment | Meter | Hard cap | Alert threshold | Unit metric | Owner |
|---|---:|---|---:|---:|---|---|
| Workers | TBD | Requests and compute | TBD | TBD | Cost per 1,000 useful requests | Jeff |
| D1 domain | TBD | Reads, writes, storage | TBD | TBD | Cost per verified organization/session | Jeff |
| D1 operations | TBD | Reads, writes, storage | TBD | TBD | Cost per completed workflow | Jeff |
| R2 | TBD | Storage and operations | TBD | TBD | Evidence bytes per verified claim | Jeff |
| Queues/Workflows | TBD | Operations/compute | TBD | TBD | Cost per completed durable lifecycle | Jeff |
| Browser rendering | TBD | Browser time | TBD | TBD | Cost per JS-only source successfully verified | Jeff |
| AI providers | TBD | Tokens/inference units | TBD | TBD | Cost per accepted evaluated output | Jeff |
| Geocoding/maps | TBD | Requests/tiles | TBD | TBD | Cost per new or changed location | Jeff |
| Transactional email | TBD | Messages | TBD | TBD | Cost per successful required notification | Jeff |
| Newsletter | TBD | Subscribers/messages | TBD | TBD | Cost per confirmed engaged subscriber | Jeff |
| Monitoring | TBD | Events/storage | TBD | TBD | Cost per actionable incident detected | Jeff |
| Human review | Time | Reviewer minutes | Capacity limit | Backlog age | Minutes per verified claim/content item | Jeff |

No phase may replace `TBD` with remembered pricing. It must use current provider documentation or invoices and record the date, plan, included allowances, overage basis, and tax/commitment assumptions.

## Master phase roadmap

Phases are sequential at the gate level, not necessarily at the file-edit level. Research and design for later phases may proceed, but implementation may not create a second control plane or bypass unmet dependencies.

### Phase 0 — Reconcile, stabilize, and authorize the baseline

**Purpose:** establish a trustworthy starting point and finish the current customer-readiness gates before expanding the system.

**Learning objectives:** Git/worktrees, evidence labels, environments, release gates, incident handling, configuration, and restoration fundamentals.

**Work:**

- disposition the current dirty worktree without overwriting unrelated changes;
- reconcile `CURRENT_STATE.md`, Plans 012–018, `PCD-AI-OS/`, the operating manual, deployed resources, and the current release packet;
- finish or explicitly defer every pending launch-authorization item;
- resolve the search-event retention conflict in `DATA-MAP.md` through owner and counsel disposition plus verified enforcement;
- prove notification receipt, authenticated access, accessibility journeys, failure isolation, and recovery requirements already in the launch matrix;
- create a service, binding, secret-name, schedule, database, bucket, and third-party inventory without recording secret values;
- establish cost and error baselines.

**Graduation criteria:**

- current-state claims are fresh and evidence-labeled;
- the full local validation suite passes or every known exception is explicitly accepted;
- production and staging resource boundaries are proven;
- unresolved launch gates have named owners and dispositions;
- rollback and recovery evidence meets the current release contract;
- no accidental deployment, data mutation, or unreviewed merge occurs.

**Child-plan routing:** Plans 014–018 remain controlling for their bounded scopes. Do not rewrite them into this plan.

### Phase 1 — Prove one complete trusted camp record lifecycle

**Purpose:** establish the canonical vertical slice reused by directory automation.

**Learning objectives:** domain modeling, D1 migrations, R2 evidence, Worker APIs, protected review UI, idempotency, and publication state.

**Work:**

- choose 25–50 fixture organizations and 100 pilot organizations representing easy, ambiguous, expired, duplicate, JavaScript-heavy, blocked, missing, and adversarial pages;
- define the typed organization/program/session/claim/source model and map current tables into it without destructive replacement;
- implement tiered retrieval: authoritative structured source, sitemap/feed, bounded HTTP, browser rendering only when justified, then human-assisted capture;
- persist raw or normalized evidence in R2 with hashes and retention metadata;
- deterministically parse before model escalation;
- validate required fields, compare with current projections, and produce an immutable proposed change set;
- present evidence and differences in protected admin;
- approve, reject, request correction, or mark unverifiable;
- publish the approved projection and verify the public page;
- schedule a recheck and prove repeated processing is idempotent.

**Graduation criteria:**

- 100 pilot organizations complete the lifecycle without bulk publication;
- field-level precision/recall is measured separately for dates, price, ages, location, registration URL, status, and organization identity;
- zero known high-risk incorrect records auto-publish;
- every published time-sensitive claim has source, method, last-verified, and next-check metadata;
- reviewer effort and total cost per verified session are measured;
- failure, retry, dead-letter, rejection, and rollback paths are demonstrated.

### Phase 2 — Data-quality department and scalable camp operations

**Purpose:** scale the verified lifecycle without sacrificing trust.

**Learning objectives:** queues, workflows, concurrency, rate limits, incremental crawling, change detection, and operational dashboards.

**Work:**

- define explicit state machines for organization discovery, website verification, source discovery, extraction, comparison, approval, publication, and revalidation;
- introduce Queues only for high-volume discrete jobs and Workflows only for durable multi-step lifecycles;
- add per-domain politeness, robots/policy checks, conditional retrieval, content hashing, and skip-unchanged behavior;
- implement retry classification, backoff, circuit breaking, quarantine, and dead letters;
- build freshness and confidence calculations from observable inputs;
- add correction, removal, ownership dispute, and do-not-republish flows;
- scale in controlled cohorts: 100 → 1,000 → 5,000 → larger cohorts;
- require an explicit gate review between cohorts.

**Graduation criteria:**

- each cohort meets predeclared accuracy, cost, crawl-policy, failure, and reviewer-capacity thresholds;
- queue depth, age, completion, retries, dead letters, and cost are visible;
- a stopped or degraded crawler cannot silently mark records current;
- correction and removal SLAs are measurable;
- scale increases never bypass evidence or approval policy.

### Phase 3 — Parent-facing directory, search, and geographic experience

**Purpose:** turn trusted data into a differentiated product.

**Learning objectives:** search relevance, normalized filters, geography, caching, performance, accessibility, and public trust design.

**Work:**

- build D1-backed search with normalized fields and precomputed facets before adopting a dedicated search vendor;
- support location, distance, activity, age, dates, day/overnight, price, registration, and verification filters where data quality supports them;
- cache normalized geocoding results and precompute city/county/metro relationships;
- display source, verification date, freshness state, material restrictions, and authoritative registration destination;
- design no-results, low-confidence, stale, and temporarily unavailable states;
- instrument privacy-bounded search success, refinement, no-result, outbound-registration, correction, and subscription events;
- test performance and accessibility across representative devices and network conditions.

**Graduation criteria:**

- a parent can find verified nearby options by age and date and understand when information was checked;
- relevance and latency baselines exist;
- no-result and stale-data states are honest and actionable;
- accessibility and customer-journey gates pass;
- demand metrics are useful without creating child or household profiles.

### Phase 4 — Editorial operating system

**Purpose:** manage the complete lifecycle of trustworthy editorial content.

**Learning objectives:** content schemas, research workflows, citations, editorial QA, publication approvals, refreshes, and retirement.

**Work:**

- define content types, ownership, risk levels, required citations, voice rules, and lifecycle states;
- create topic/opportunity intake from search demand, seasonality, support, coverage gaps, and human ideas;
- version briefs, research packets, prompts, drafts, edits, fact checks, schema, media rights, and approvals;
- require primary/authoritative sources for claims where available;
- run grammar, readability, voice, duplicate, link, schema, accessibility, policy, and citation checks;
- implement content decay triggers using traffic, ranking, broken links, expired claims, product changes, and editorial review dates;
- support correction, version rollback, consolidation, redirect, archive, and retirement;
- preserve Markdown/Git where it remains useful while preventing a second canonical content state.

**Graduation criteria:**

- one article completes the entire lifecycle with auditable inputs and approval;
- every public factual claim class has a sourcing rule;
- refresh and retirement queues operate without silently deleting content;
- voice and quality evaluations have a maintained golden set;
- publication rollback is demonstrated.

### Phase 5 — Affiliate revenue operating system

**Purpose:** make affiliate operations accurate, compliant, measurable, and reversible.

**Learning objectives:** redirect architecture, merchant/product modeling, disclosures, availability checks, attribution, and revenue analytics.

**Work:**

- normalize products, merchants, programs, affiliate links, campaigns, disclosures, and guide placements;
- verify redirect destinations, tags, status codes, and broken-link behavior;
- monitor availability, discontinuation, version changes, price bands where permitted, and merchant-policy constraints;
- distinguish product facts, editorial recommendations, sponsorship, and affiliate relationships;
- stage replacements with evidence and require approval for material or mass changes;
- ingest provider reporting or approved aggregates without claiming conversions the site cannot observe;
- calculate revenue per article, guide, product, merchant, campaign, and traffic source;
- maintain rollback for link and recommendation changes.

**Graduation criteria:**

- all affiliate surfaces carry correct disclosures;
- every tracked redirect is verified end to end;
- broken or unavailable products degrade safely;
- revenue attribution limitations are documented;
- replacement and rollback paths are tested;
- cost and revenue are visible without overstating profitability.

### Phase 6 — Newsletter and audience operating system

**Purpose:** build consent-respecting audience growth and repeat engagement without building a mail-delivery provider.

**Learning objectives:** consent, deliverability, segmentation, suppression, transactional versus marketing email, templates, approvals, and metrics.

**Work:**

- reconcile signup forms, consent language, confirmation, unsubscribe, suppression, retention, and deletion with the data map and provider behavior;
- define national, regional, activity, seasonal, and age-oriented content segments without creating unnecessary child profiles;
- generate newsletter briefs and drafts from approved content and directory changes;
- validate links, disclosures, subject lines, previews, accessibility, and rendering;
- require human send approval;
- handle provider outages, bounces, complaints, suppressions, and export/termination;
- measure subscription source, confirmation, engagement, unsubscribe, and downstream actions.

**Graduation criteria:**

- consent and deletion journeys are proven end to end;
- a real issue can be drafted, reviewed, approved, delivered, and measured;
- Amazon or other program-specific email restrictions are enforced where applicable;
- provider failure does not lose authoritative consent or suppression state;
- no bulk campaign is sent by Gmail or a custom Worker mail loop.

### Phase 7 — Organization intelligence, claims, partnerships, and support

**Purpose:** turn organizations into maintained records and add safe external collaboration.

**Learning objectives:** customer identity, tenancy, object authorization, organization claims, proposed edits, disputes, support queues, and CRM boundaries.

**Work:**

- implement external organization-representative authentication separately from staff Access;
- define organization membership, roles, invitations, recovery, suspension, and audit;
- require proof of control and human-reviewed ownership claims;
- accept proposed edits as evidence-backed change sets rather than direct overwrites;
- distinguish verification, ownership, paid status, sponsorship, and editorial treatment;
- build support, correction, privacy, safety, and dispute queues with SLAs;
- identify partnership opportunities and generate drafts, but retain human relationship and outreach decisions;
- add premium listings or paid products only through a separate commerce child plan.

**Graduation criteria:**

- representatives can affect only explicitly authorized organizations;
- ownership disputes and recovery are runnable;
- every edit and role change is audited;
- commercial status cannot buy verification or suppress corrections;
- support and privacy deadlines are observable;
- no outreach occurs without human approval.

### Phase 8 — SEO, local expansion, reputation, and seasonal planning

**Purpose:** operate discoverability and freshness as measured systems rather than mass page generation.

**Learning objectives:** technical SEO, structured data, page-quality controls, seasonal calendars, reputation signals, and programmatic-page governance.

**Work:**

- monitor crawl/indexing, canonicals, sitemaps, redirects, internal links, duplication, schema, accessibility, performance, and content decay;
- create local pages only when they contain sufficient verified local supply, original utility, and differentiated answers;
- define minimum-value and automatic noindex/retirement thresholds for programmatic pages;
- maintain a seasonal calendar ahead of registration and buying windows;
- monitor high-value public changes to organizations and programs using approved sources;
- stage recommendations rather than blindly rewriting pages;
- connect demand, coverage, freshness, and editorial queues.

**Graduation criteria:**

- every indexed local page passes a documented utility threshold;
- no mass publishing occurs solely because a city/activity combination exists;
- technical defects feed owned queues with resolution SLAs;
- seasonal work is prepared ahead of demand windows;
- reputation signals are evidence-backed and defamation-sensitive changes require review.

### Phase 9 — Analytics, opportunity, experimentation, and financial intelligence

**Purpose:** teach the platform to measure outcomes and recommend improvements.

**Learning objectives:** event contracts, aggregation, experimentation, causal humility, opportunity scoring, and unit economics.

**Work:**

- define a versioned event taxonomy and analytics data contract;
- separate public product analytics from operational workflow metrics;
- create dashboards for acquisition, search success, directory freshness, editorial, affiliate, newsletter, workflow health, approvals, and cost;
- build the “What Changed Overnight?” executive briefing;
- add opportunity scoring for unanswered demand, local supply gaps, decaying content, broken journeys, and revenue potential;
- implement experiments with hypotheses, guardrails, variants, sample rules, stopping rules, and interpretation notes;
- track assumptions and schedule explicit assumption reviews;
- calculate content and workflow unit economics including human verification time.

**Graduation criteria:**

- dashboards reconcile to source data;
- one experiment completes without corrupting accessibility, trust, or privacy;
- one opportunity progresses from signal to approved action to measured outcome;
- the executive briefing is actionable rather than a metric dump;
- financial metrics state attribution and uncertainty honestly.

### Phase 10 — AI gateway, prompt lifecycle, and evaluated agents

**Purpose:** add AI where it has proven value while keeping cost, permissions, and quality controlled.

**Learning objectives:** provider abstractions, structured outputs, prompt versioning, evaluations, model routing, injection defense, budgets, and agent governance.

**Work:**

- require every unattended inference call to pass through the shared gateway;
- implement Level 0 deterministic handling before model selection;
- version task type, prompt, schema, policy, evaluation set, owner, and rollback version in Git;
- route by risk, value, evaluation result, latency, and budget—not brand preference;
- require structured outputs and validation before any downstream action;
- treat fetched pages, emails, uploaded documents, and user text as untrusted data rather than instructions;
- restrict tools, data, and outbound domains per workflow;
- cache only when inputs, policy version, privacy, and freshness rules permit it;
- evaluate accuracy, cost, latency, human edits, approval rate, false positives, false negatives, and downstream outcome;
- pause or retire agents that fail thresholds.

**Graduation criteria:**

- no production workflow calls a model provider directly;
- budgets fail closed or degrade deterministically;
- golden evaluations run in CI where feasible;
- prompt or model rollback is demonstrated;
- injection fixtures cannot change tools, permissions, or authoritative state;
- each running agent passes the existence test and has a retirement rule.

### Phase 11 — Platform health, security maturity, and disaster recovery

**Purpose:** make the complete system resilient and audit-ready without prematurely purchasing certification tooling.

**Learning objectives:** service-level objectives, incident response, threat modeling, audit evidence, backup/restore, dependency risk, and SOC 2 control mapping.

**Work:**

- define service inventory, owners, SLOs, error budgets, and dependency map;
- monitor Workers, D1, R2, Queues, Workflows, schedules, authentication, forms, search, email integrations, and model providers;
- conduct security review across authentication, authorization, injection, SSRF, secrets, supply chain, logging, abuse, and admin isolation;
- automate recoverable backups and perform periodic isolated restore tests;
- test incident notification, failover, rollback, key rotation, vendor outage, quota exhaustion, and corrupted-data scenarios;
- implement data-retention enforcement and deletion evidence;
- map existing controls to a pragmatic SOC 2 readiness roadmap while treating certification and legal attestation as future human-led projects;
- run accessibility and disaster-recovery exercises on a recurring schedule.

**Graduation criteria:**

- material services have SLOs and alert ownership;
- backup restoration is repeatedly demonstrated;
- incidents produce actionable evidence and postmortems;
- access reviews, dependency reviews, retention jobs, and recovery drills have a cadence;
- no Critical security, privacy, accessibility, or recovery defect is knowingly open for launch.

### Phase 12 — Forge OS extraction and second-application proof

**Purpose:** convert repeated, proven patterns into reusable portfolio infrastructure.

**Learning objectives:** package boundaries, tenant isolation, service contracts, migration compatibility, and platform product discipline.

**Entry requirements:**

- the candidate capability works in ParentCoachDesk;
- it has been used by at least two distinct ParentCoachDesk workflows or domains;
- the common contract and meaningful differences are documented;
- extraction reduces duplication without weakening brand-specific policy or data isolation.

**Work:**

- extract only proven modules such as event envelopes, run logging, approvals, policy evaluation, AI gateway, observability conventions, or release evidence;
- define brand adapters and explicit trust boundaries;
- keep brand databases, secrets, access, retention, and legal policies separate unless a specific shared design is approved;
- prove reuse in a second authorized application without copying implementation or combining restricted data;
- document versioning, compatibility, migration, ownership, support, and retirement.

**Graduation criteria:**

- a second application runs a real workflow on the extracted module;
- ParentCoachDesk continues to pass its tests and operational gates;
- tenant/brand isolation is tested;
- no confidential MedConfRadar boundary is crossed;
- the shared module has an owner, compatibility policy, and measurable maintenance benefit.

## Operating-system coverage matrix

| North-star system | Primary phase | Supporting phases | First proof |
|---|---:|---:|---|
| Editorial | 4 | 8, 9, 10 | One sourced article from brief through rollback |
| Affiliate revenue | 5 | 9, 11 | Verified redirect, disclosure, measured click, staged replacement |
| Camp discovery | 1–2 | 10, 11 | One verified session with evidence and recheck |
| Organization intelligence | 7 | 1–3 | One living organization record with preserved history |
| Blog growth | 4 | 8–9 | One demand-backed opportunity becomes measured content |
| SEO | 8 | 3–4, 9 | One detected defect progresses to verified resolution |
| Newsletter | 6 | 4, 9 | One consented subscriber journey and approved issue |
| Parent intelligence | 9 | 3, 11 | Aggregate no-result signal without stable child identity |
| Trust and accuracy | 1–2 | all | Public provenance and visible verification state |
| Local expansion | 8 | 2–3 | One useful local page meeting a supply threshold |
| Analytics | 9 | all | Reconciled executive and operational dashboards |
| Reputation monitoring | 8 | 2, 7 | Evidence-backed change staged for review |
| Seasonal planning | 8 | 4–6 | Calendar produces work before a demand window |
| Partnerships | 7 | 5, 9 | Qualified lead and human-approved outreach draft |
| Platform health | 11 | all | Alert, incident, recovery, and postmortem evidence |
| Knowledge/entity graph | 1 | 2–3, 12 | Relational entity relationships answer a compound query |
| Experiment engine | 9 | 3–6 | One governed test with a documented result |
| Content decay | 4 | 8–9 | A decaying page enters and exits refresh review |
| Opportunity engine | 9 | 3–8 | Signal → opportunity → approval → outcome |
| Competitive intelligence | 8 | 9–10 | One permitted evidence-backed comparison |
| Data quality | 1–2 | all | Field metrics, provenance, corrections, and rechecks |
| Compliance | 0 and 11 | all | Data map and release gates match actual behavior |
| Financial intelligence | 9 | 5–6 | Unit economics per content/workflow unit |
| Brand voice | 4 | 10 | Versioned rules and evaluated outputs |
| Agent performance | 10 | 9, 11 | Agent retained, paused, or retired from evidence |
| Institutional memory | 9–10 | all | Decisions, outcomes, prompts, and corrections remain queryable |
| Assumptions database | 9 | all | An assumption is tested and dispositioned |
| Human opportunity queue | 7 and 9 | 10 | High-value signal routes to Jeff without autonomous outreach |
| Overnight briefing | 9 | 11 | Daily exception-and-opportunity report |
| Business evolution review | 9 | 12 | Monthly evidence-backed architecture/product proposal |

## Standard state machines

### Data claim

```text
DISCOVERED -> CAPTURED -> EXTRACTED -> VALIDATED -> COMPARED
   -> NEEDS_REVIEW -> APPROVED -> PUBLISHED -> PUBLIC_VERIFIED
   -> CURRENT -> DUE_FOR_RECHECK -> REVALIDATING
```

Terminal or side states: `REJECTED`, `UNVERIFIABLE`, `CORRECTION_REQUESTED`, `REMOVAL_PENDING`, `REMOVED`, `DO_NOT_REPUBLISH`, `FAILED_RETRYABLE`, `DEAD_LETTER`.

### Editorial content

```text
IDEA -> SCORED -> BRIEFED -> RESEARCHED -> DRAFTED -> EDITED
 -> FACT_CHECKED -> QA_PASSED -> APPROVED -> PUBLISHED
 -> MONITORED -> REFRESH_DUE -> UPDATED | CONSOLIDATED | RETIRED
```

### Affiliate placement

```text
CANDIDATE -> POLICY_CHECKED -> EDITORIALLY_REVIEWED -> APPROVED
 -> ACTIVE -> MONITORED -> CHANGE_DETECTED -> REVIEW_REQUIRED
 -> UPDATED | PAUSED | RETIRED
```

### Operational work item

```text
CREATED -> POLICY_CHECKED -> READY -> LEASED -> RUNNING
 -> SUCCEEDED | RETRY_WAIT | NEEDS_APPROVAL | CANCELLED | DEAD_LETTER
```

Approval success creates a new authorized command; it does not mutate and replay an old opaque agent response.

## Testing strategy

### Unit tests

- schema validation and normalization;
- state-transition guards;
- authorization and policy evaluation;
- idempotency and payload hashing;
- freshness, confidence, and scoring functions;
- disclosure and content-policy rules;
- event serialization and redaction;
- budget and model routing;
- retry classification and backoff.

### Integration tests

- Worker routes with generated binding types;
- D1 migrations and query plans against representative data volumes;
- R2 evidence writes/reads and missing-object behavior;
- Queue producer/consumer contracts and duplicate delivery;
- Workflow pause, retry, cancellation, and resume;
- external-provider adapters through fakes or approved sandboxes;
- authentication plus object-level authorization;
- deletion and retention across every store.

### Contract and evaluation tests

- model output schemas;
- prompt versions against golden fixtures;
- source-to-claim extraction scoring by field;
- adversarial prompt-injection and irrelevant-page fixtures;
- vendor response compatibility;
- event-version backward compatibility.

### End-to-end tests

- parent search-to-registration journey;
- correction/removal request;
- organization claim and proposed edit;
- editorial brief-to-publication and rollback;
- affiliate redirect and disclosure;
- newsletter consent-to-unsubscribe;
- approval decision with changed-payload invalidation;
- scheduled recheck through failure and recovery.

### Operational tests

- deploy and rollback rehearsal;
- isolated D1 restore;
- missing secret/binding;
- model quota exhaustion;
- email/newsletter outage;
- queue backlog and poison message;
- browser-rendering failure;
- stale lease and duplicate delivery;
- alert delivery and human receipt;
- maintenance mode and kill switch.

### Required validation reporting

Every handoff records the exact command, exit code, concise result, and relevant sanitized errors. Passing historical results may be cited as history but never substituted for current execution.

## Observability strategy

Every run and material request must be correlatable through:

- timestamp and environment;
- brand, workflow, workflow version, run, work item, and attempt;
- entity type and ID where permitted;
- action and risk class;
- prompt/model/policy versions where applicable;
- duration, outcome, retry classification, and error code;
- estimated or provider-reported cost;
- human-touch and approval result;
- redacted evidence references rather than sensitive payload dumps.

Dashboards are introduced in the order operators need them:

1. release and platform health;
2. trust/corrections/privacy deadlines;
3. camp pipeline and data quality;
4. approval queue and dead letters;
5. public search and directory utility;
6. editorial and affiliate freshness;
7. newsletter and audience;
8. agent performance and AI cost;
9. executive briefing and opportunity portfolio.

Alerts are reserved for conditions requiring action. Reports summarize trends. A dashboard with no owner or response procedure does not satisfy observability.

## Security and privacy requirements

- Preserve the repository’s Pre-Launch Security Gate and website standards as canonical; child plans cite rather than restate them.
- Cloudflare Access protects staff surfaces; external customer identity uses a deliberately separate boundary.
- Every protected operation performs application-level authorization, not merely authentication.
- Public forms use abuse controls, bounded input, validation, and safe error handling.
- Fetched web content and inbound messages are untrusted and cannot grant tools or alter system instructions.
- Outbound retrieval is restricted against SSRF, internal addresses, unexpected schemes, redirect abuse, oversized bodies, and unapproved domains where practical.
- Secrets never enter Git, plans, logs, fixtures, model prompts, or evidence packets.
- Personal and sensitive data is minimized before logs, analytics, queues, model calls, or third-party transfer.
- The family firewall prohibits child, health, household, player, or recruiting profiles in operational intelligence.
- Commercial relationships never influence verification outcomes without explicit public disclosure.
- Legal and compliance claims require qualified human review; this plan is engineering architecture, not legal advice.

## Cost-control strategy

- Establish cost baselines in Phase 0 and unit economics beginning in Phase 1.
- Prefer conditional retrieval, hashes, cached normalized results, incremental rechecks, and batching.
- Browser-render only when required and record why.
- Model routing begins at no-AI and uses the cheapest evaluated method that meets the task threshold.
- Every metered workflow has a maximum per item, per run, per day, and per month.
- Budget exhaustion degrades to deterministic handling, queues work, or stops safely; it never silently reduces verification quality while reporting success.
- Human review time is a cost and capacity metric.
- No plan relies on the original estimated monthly range without fresh provider pricing and measured usage.

## Deployment strategy

Each child increment follows:

1. approved plan and acceptance criteria;
2. isolated branch/worktree and preserved unrelated changes;
3. local tests and static validation;
4. schema compatibility and migration rehearsal where applicable;
5. Claude implementation handoff with committed bounded diff;
6. independent Codex review against requirements and full-file context;
7. correction commits and final verification;
8. Jeff merge approval;
9. staging deployment approval and evidence;
10. shadow/default-off/canary operation where meaningful;
11. Jeff production activation approval;
12. observation window, rollback decision, and operational documentation update.

Feature flags must default off when code can safely ship before operational activation. A flag is not a substitute for authorization, tests, or cleanup; every flag has an owner and removal condition.

## Rollback and disaster recovery

- Code rollback uses a verified safe Worker version, not an assumed historical artifact.
- Schema changes prefer expand/migrate/contract. Contract/destructive work is a later separately approved step.
- Data mutations record enough provenance and change-set information for compensation.
- Publication and affiliate changes are versioned and reversible.
- Emails, external messages, and payments are irreversible once executed; plans must prevent duplication and use staging/test modes rather than claim rollback.
- D1 exports, R2 evidence/media, Git history, configuration, prompt versions, and provider exports receive explicit recovery coverage.
- Restore tests use isolated targets and verify integrity plus representative application behavior.
- Recovery point and recovery time objectives are defined once measured business impact justifies them; until then, every system states its actual achievable recovery behavior.

## Claude Code and Codex operating protocol

### Jeff

- approves scope, architectural decisions, purchases, external services, legal posture, production actions, merge, publication, sends, and irreversible operations;
- chooses learning pace and may reorder non-dependent work;
- decides whether business evidence changes the product proposition.

### Codex

- investigates current state and writes bounded child plans;
- identifies file-level changes, risks, edge cases, tests, and gates;
- independently reviews committed Claude diffs and runs proportional verification;
- reports defects by severity without silently implementing fixes unless explicitly assigned;
- reconciles completed capabilities back into this program and the current-state ledger.

### Claude Code

- implements approved child plans on isolated branches/worktrees;
- stops and reports plan defects rather than inventing architecture;
- writes tests and documentation with the code;
- runs required validation and records exact results;
- commits bounded work and produces an immutable handoff;
- never deploys, publishes, sends, purchases, changes secrets, or mutates production without explicit approval.

### Required handoff packet

- original child plan and acceptance criteria;
- commit or bounded commit range;
- changed-file list;
- migrations/configuration/external actions;
- exact commands and results;
- known limitations and deviations;
- risk areas and rollback procedure;
- sanitized evidence references;
- explicit list of actions not performed.

## Learning record

Each phase maintains a short learning note recording:

- concept learned;
- architectural decision and alternatives;
- implementation mistake or surprise;
- test or incident that changed understanding;
- what Jeff can now explain or operate without model assistance;
- reusable pattern earned;
- next knowledge gap.

The learning record is not a vanity journal. It should make future design decisions better and prevent repeated mistakes.

## Files likely affected

This master plan creates no implementation requirement by itself. Child plans will select from:

- `coordination/plans/` for bounded implementation plans;
- `coordination/CURRENT_STATE.md`, `HANDOFF.md`, `handoffs/`, `reviews/`, and release evidence;
- `PCD-AI-OS/` for north-star department and roadmap design;
- `src/` for public, admin, API, domain, policy, and Worker code;
- `migrations/`, `migrations-activity-radar/`, and `migrations-pcd-ops/` only under explicit database-boundary plans;
- `tests/` and staging fixtures;
- `prompts/` and evaluations for prompts-as-code;
- `scripts/` for validation, evidence, migration, recovery, and deterministic operations;
- `wrangler*.jsonc` for reviewed binding/configuration changes;
- `DATA-MAP.md`, security/audit documents, editorial standards, affiliate policy, runbooks, and the operating manual.

No child plan may assume this list authorizes touching every path.

## Non-goals

- No implementation, deployment, migration, production mutation, send, purchase, publication, or secret change is authorized by this document.
- No immediate construction of all named agents, departments, dashboards, queues, or workflows.
- No graph database, vector database, Elasticsearch, Kubernetes, Kafka, Airflow, Temporal, Snowflake, custom email sender, custom authentication system, or microservice-per-agent without a measured requirement and separate ADR.
- No claim that SOC 2 compliance, legal compliance, extraction accuracy, Google traffic, or profitability is guaranteed by architecture.
- No combining of portfolio data or access merely because code becomes reusable.
- No access to MedConfRadar’s confidential core data-broker logic.
- No autonomous collection or inference of child, household, health, recruiting, or player profiles.

## Failure modes

| Failure | Required system behavior |
|---|---|
| Source page unavailable | Preserve last verified value with visible age; do not report a new verification |
| Extraction ambiguous | Route to review or mark unverifiable; never fabricate a required field |
| Duplicate delivery | Idempotency prevents duplicate publication, message, mutation, or charge |
| Queue/workflow backlog | Surface depth and age; throttle producers; preserve interactive service |
| Model/provider unavailable | Deterministic fallback, deferred work, or fail closed according to policy |
| Budget exhausted | Stop/defer safely and alert; do not downgrade quality invisibly |
| Approval payload changes | Invalidate approval and require a new decision |
| Authentication succeeds but authorization fails | Deny without leaking object existence; audit the attempt |
| Retention/deletion job fails | Alert as a compliance incident with owned deadline |
| Crawl content contains instructions | Treat as data; tool and policy boundaries remain unchanged |
| Stale deployment or unsafe rollback | Stop promotion/rollback until a verified target exists |
| Analytics mismatch | Mark dashboard degraded; do not use unreconciled numbers for automation |
| Human approval backlog | Prioritize by risk/expiry/value; do not bypass the gate |
| Business demand is weak | Record evidence, revise wedge/value proposition, continue approved learning work |

## Acceptance criteria for this master plan

- [ ] Jeff explicitly approves or amends the governing interpretation.
- [ ] Every operating system in the north-star document maps to a phase and first proof.
- [ ] Current Plans 012–018 remain referenced rather than silently superseded.
- [ ] The plan distinguishes designed, built, staging-proven, production-ready, running, and graduated.
- [ ] Each phase names purpose, learning objectives, work, and measurable graduation criteria.
- [ ] Security, privacy, accessibility, data quality, observability, recovery, cost, legal/editorial, and human-approval gates apply across phases.
- [ ] Forge OS extraction is prohibited until repeated real use proves the abstraction.
- [ ] The Cross-Model Critic workflow defines clear Jeff, Claude, and Codex responsibilities.
- [ ] No wording in the plan authorizes production or external actions.
- [ ] The next child plan is selected only after current release-readiness work is reconciled.

## Human approval gates

1. **Program gate:** Jeff approves or amends Plan 019.
2. **Phase gate:** Jeff selects the next phase or permits limited overlap.
3. **Child-plan gate:** Jeff approves each Tier 2/3 implementation plan.
4. **External-service gate:** Jeff approves purchases, vendors, accounts, and credentials.
5. **Merge gate:** Jeff approves merge to the primary branch.
6. **Staging action gate:** Jeff approves deployments or external staging mutations where required.
7. **Production gate:** Jeff separately approves every production deploy, migration, activation, send, publication, bulk data action, and other material external mutation.
8. **Graduation gate:** Jeff accepts the evidence that a phase or capability has graduated.

## Open questions

These do not block approval of the program, but the relevant child phase cannot pass without disposition:

1. Which current launch gates remain after the active uncommitted release-readiness work is committed and independently reviewed?
2. What retention window and enforcement mechanism governs search events?
3. Which operational database boundaries from Plans 012–018 are final after production migration review?
4. What field-level accuracy thresholds will Jeff accept for each camp-data cohort?
5. Which crawl-policy and terms-of-service risks require counsel review before the 100-organization pilot?
6. Which newsletter provider and transactional-email provider are approved long term?
7. Which external organization authentication design is approved after the public-directory gate?
8. Which metrics define local-page utility strongly enough to permit indexing?
9. What annual and monthly learning budget may the AI gateway and browser rendering consume?
10. Which second application is authorized for Phase 12 without crossing confidential boundaries?

## Immediate next action after approval

Do not start a new platform build. First perform a bounded reconciliation of the current release state:

1. allow the active worktree owner to finish or hand off the existing changes;
2. refresh `coordination/CURRENT_STATE.md` from the resulting committed state;
3. independently review the current Plan 014–018 work and release packet;
4. close or disposition remaining Phase 0 gates;
5. then write the first new child plan for Phase 1’s trusted camp-record vertical slice, reusing rather than replacing the existing camp pipeline.

That child plan must name exact files, migrations, fixtures, field-level evaluation thresholds, staging resources, failure tests, rollback, and the first 100-organization cohort boundary.
