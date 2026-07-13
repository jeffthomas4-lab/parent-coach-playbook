# PCD Session Two Input: Phases 4 and 5 raw material

**Status: deferred input, not adopted scope.** Nothing in this file is part of the governing PCD Operating Manual. The manual stays at Phases 1 to 3 complete, 4 to 10 stubbed. This file exists so the usable Phase 4 (prompt architecture) and Phase 5 (agent design) material from the three external reviews survives until that session, instead of getting lost or bolted onto a document scoped to something else.

**Source:** the Pass 1 inventory of `PCD-MANUAL-RECONCILIATION-MEMO-2026-07-13.md`, adjudicated 2026-07-13. Three sources fed that memo: a Gemini review (GEM), a ChatGPT review (CR), and a ChatGPT full-draft rewrite (CD). Item numbers below match the memo's inventory tables. The full verbatim review text was pasted into the reconciliation session and was not saved as a standalone file, so this document works from the memo's one-line description of each item. Where Session Two needs the full original wording, it isn't here and would have to be re-pulled from the three sources.

**Governed by the same constitution as the manual.** Forge Command Master Plan v2.1, the ten named rules, the section 10 failure modes. Nothing here overrides the eight-agent working-set cap, the existence test, or the manual-3x gate. Every item below is raw material to build from, not a pre-approved design.

---

## 1. Class A/B/C/D action matrix and the "Stage" concept

CD-2 proposed four action classes: Analyze, Draft, Stage, Act. CD-3 paired that with four risk tiers and escalation rules. GEM-8 proposed a "Staged Payload" architecture where agents write to a staging area instead of acting directly.

The adjudication treated this as the one genuinely additive governance idea in the whole batch. The manual's HUMAN GATE already splits work into unattended (report, draft) and gated (send, purchase, delete, publish). What the reviews add is a class between Draft and Act: a prepared, reviewable change set that isn't committed yet. Call it Stage.

Phase 4 should design this as a refinement of the existing gate, not a replacement:

- **Analyze:** read-only. No output changes anything. Existing SOPs like S1 (GSC review) already work this way.
- **Draft:** produces a document a human reads and may act on (S9 articles, S10 newsletter). Nothing ships without Jeff.
- **Stage:** a prepared change set sitting in a review queue, ready to commit with one approval. This is new. It fits S4 (deletion) and S8 (camp data quality bulk fixes) better than a flat Draft, because the change is already fully formed and just needs a yes.
- **Act:** the one existing exception, S7 camp discovery, which writes enrichment data autonomously inside a confidence threshold instead of per-run approval.

**Staging destination, resolved (Jeff's call, 2026-07-13):** GEM-13 asked whether Stage lives as local markdown files or a Notion Review Queue database page. Neither. Staged drafts and reports post a notification to the existing Slack channel Jeff already checks, with a link to the markdown draft. One place to check. Notion Review Queue and scattered local files are both out. Phase 4 builds the Stage class against this destination, not an open question.

---

## 2. Standard agent spec template

CD-5 proposed an agent spec template around eighteen fields. CR-16 asked for a matching "AI Department Playbook" document.

Reject the reinvention. Master Plan section 7 already defines the required skill template fields, and any PCD agent spec in Phase 5 builds from those, not a new list:

- One clearly defined purpose and a measurable success metric
- Human approval required for anything touching customers, money, legal, or published content
- A kill switch: independent enable and disable
- Version-controlled prompt or skill file
- Evidence attached to every recommendation
- Every run logged per Master Plan section 8, no silent failures
- Idempotent, safe to retry
- Justifies its own existence (Master Plan section 1 test) or gets deleted

Where the CD/CR field lists add something genuinely new that isn't covered above, name it in Phase 5 as an addition to this template, not a parallel one. Two candidates worth a look then: a stated rollback path (see section 7 below) and a named owner workstream (the manual already has this in section 1.3).

---

## 3. Prompt frame and per-SOP reasoning question sets

GEM-1 through GEM-7 each proposed a purpose-built prompt for one SOP: a Blueprint Ingest brief for S9, a Freshness Audit rewrite prompt for S11, a GSC Consolidation prompt for S1 and Open Item 2, a Multi-Draft prompt for S10, a Discovery Guardrail prompt for S7, a Compliance Officer prompt for S4, and a Link Remediation prompt for S5. GEM-11 and GEM-12 proposed next-session prompts for a logging wrapper and the S4 skill template. CR-2 asked for a reasoning question set attached to every SOP. CR-3 asked for decision trees. CR-13 and CD-12 asked for a prompt library and a standard prompt frame.

The adjudication's read: several of the GEM prompts just restate rules the manual already governs (S7's 75-confidence threshold, the no-Amazon-in-email rule on S10, the 30-day SLA on S4). That's a validation signal that the reviewers understood the manual correctly, not new scope. The real Phase 4 work is building one standard prompt frame, then filling it in per SOP as each one clears manual-3x and gets promoted.

Phase 4 should design the frame with these slots, informed by what the GEM prompts were reaching for:

- **Purpose:** one sentence, tied to the SOP it serves.
- **Inputs:** what the agent reads before it acts (live data source, prior run's output, the governing file).
- **Reasoning steps:** the decision points the agent has to reason through, not just execute. This is the CR-3 "decision tree" idea, scoped to what a given SOP actually needs, not a generic framework bolted onto all twelve.
- **Guardrails:** the specific thresholds and rules that already exist in the manual (75 confidence, never-store-PII, no-Amazon-in-email, 30-day SLA) restated in the prompt so the agent can't drift from them.
- **Output shape:** report, draft, or staged change set, per the Class A/B/C/D matrix in section 1 above.
- **Logging:** what gets written to `agent_runs` per Master Plan section 8.

Build the S4 prompt first when Phase 4 starts. It's the one SOP with a July build date (manual section 5), so it needs the frame before the others do.

---

## 4. Intake taxonomy and tag list

CD-6 proposed an intake system with a tag taxonomy, referenced in the CD draft as an appendix.

The one-line description in the memo doesn't carry the actual tag list, so there's nothing to reproduce here. What's worth carrying forward: PCD already has an informal intake shape across S4 (deletion requests), S12 (inbound triage across three aliases), and Red Wall and Family Firewall routing. Phase 5's version of this should start from those three real intake points rather than a generic taxonomy, and add tags only where the existing routing genuinely can't express something.

---

## 5. Per-department eval questions

CD-8 proposed an evaluation system with eval questions per department, tied to Phase 9 (QA and evals) in the manual's own table of contents.

Same note as the intake taxonomy: the memo's one-line summary doesn't carry the actual question sets. Phase 9 already has a natural anchor point: skill-creator's eval tooling (named as a Phase 9 prerequisite in the manual). When Phase 9 starts, build department eval questions from skill-creator's format, using the five PCD workstreams in section 1.3 as the department list, not a reinvented set.

---

## 6. Error recovery and rollback for the autonomous write path

CR-6 asked for error recovery on every process (API failure, worker crash, camp URL changes). CR-8 and CD-16 asked for rollback: snapshots, version history, backups, one-click restore.

This is not purely deferred. It fed the new Open Item 10 in the manual (camp-database backup, restore, and rollback, scheduled to stand up before the discovery pass scales). What stays here for Phase 5 and Phase 7 design work once that Open Item is picked up:

- **Scope:** the `activity-radar` D1 database that S7 (`org-discovery-daily-worklist`) writes to every day, autonomously, with no human per-run approval.
- **What exists today:** git backup and a git rollback path for site source. Nothing equivalent for the database.
- **What Phase 7 needs to design:** a D1 backup cadence, a documented restore procedure, and a rollback path for a bad batch write. CR-6's API-failure and worker-crash cases apply directly to the Cloudflare Worker crons named in the manual (`activityradar-enrichment`, `activityradar-yelp`).
- **Not in scope for this:** rollback or backup design for any other PCD system. The other nine scheduled tasks write reports or drafts, not live database mutations, so they don't carry the same exposure.

---

## 7. Maintenance-mode toggle and per-task pause/degrade matrix

GEM-9 proposed a global `PCD_MAINTENANCE_MODE` toggle with an S4 bypass. CD-9 proposed a per-task pause-versus-degrade matrix.

**The underlying question is now resolved (Jeff's call, 2026-07-13, Open Item 5 in the manual).** During the fall idle every PCD scheduled task runs maintenance-only: it pauses or degrades to report-only, with no writes and no active build work, S7's autonomous camp writes included. The only exceptions are the year-round S4 deletion watch and the critical escalations (lapsed domain, failed payment, uptime, security). What's left for Phase 7 is the build, not the decision:

- **Global toggle:** one flag that idles PCD's scheduled tasks during the August-through-November football season, with S4 exempted so the deletion and opt-out monitor keeps running.
- **Per-task matrix:** since the resolved rule applies the same treatment to all ten tasks (pause or degrade, no writes), CD's per-task matrix is mostly moot as a design question. Kept as a build checklist so Phase 7 can confirm each task's actual behavior matches the rule, not as an open decision.
- **Phase 7 dependency:** this needs Phase 6 logging live first, so a paused or degraded task still shows its state in the run log instead of going silent.

---

## 8. Run-log schema note

CD-7 proposed a detailed run-log field schema. CR-9 asked for expanded audit logs on every run.

Reject the reinvention here too. Master Plan section 8 already defines the schema: `agent_runs` (run_id, agent, venture, started_at, finished_at, status, summary, needs_you, needs_you_items, outputs, error) and `agent_registry` (agent, venture, purpose, status, owner_email_alias, skill_location, last_run_at, success_metric), both in the existing `forge-command` D1. When Phase 6 wires PCD's scheduled tasks to logging, it writes to these two tables. It does not invent a new field list.

---

## 9. What was deliberately left out of this file

Per the adjudication memo, these items were rejected outright and are not carried forward as input to any phase:

- **The full "PCD AI Operating Manual Draft" (CD-1).** Would have replaced the manual's Phases 1-to-3 scope with a sprawling all-at-once document. Breaks failure mode 5.
- **Roughly thirty named agents (CD-11) and six to eight new departments (CR-15, CD-10's Ads/Partnerships department).** Breaks the working-set cap and section 1.4's no-new-departments decision.
- **Inter-agent handoffs (CR-14).** Breaks failure mode 2, recursive automation.
- **Build-all-logging-now and build-the-OS-now as a directive (T1, T5 in the memo).** Inverts the manual's distribution-first sequencing.

If Jeff's ambition shifts toward the portfolio-reuse vision some of these were reaching for, that's a constitution-level change, not a Phase 4 or 5 design choice, and it reopens the working-set cap conversation named in the memo's closing section.
