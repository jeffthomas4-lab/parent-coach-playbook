# PCD Automation Build Plan: the office roster

**Date:** 2026-07-13
**Goal:** every PCD workflow becomes a named, documented, logged agent before August. Built one at a time, Sonnet does most of the work, each fully documented so Jeff can talk to the person doing the job.
**Governed by:** the PCD Operating Manual v1.1 and the Forge Command constitution. This plan does not override them; it promotes the standing SOPs into agents under the same rules.

---

## The two operating rules for this build

**No artificial cap.** We build every workflow, and we add an agent when a real workflow needs one, with a purpose. Not agents for the sake of a roster, and not a ceiling that blocks a needed one. Each agent earns its place by owning real work. Growth is driven by the work, not by a number.

**The gate has a horizon.** Today every agent drafts, stages, monitors, and prepares, then stops at the HUMAN GATE for anything that sends, publishes, deletes, or spends. That is where we start, not where we end. As each agent proves itself, the gate relaxes for its lower-risk actions, so the work moves without Jeff in every loop. One thing never relaxes: payments. Money movement stays gated permanently.

Because the roster grows and the gate loosens over time, the run log and kill switches get built first, not last. That is the foundation, already done. An agent that logs every run and can be killed with one switch is one you can safely trust with more. The foundation is what earns the relaxation.

---

## Build order

Session 0 is the shared spine. Then one agent per session, in this order. Distribution is still the constraint, so the SEO and distribution agent goes first and does the real July fixes as its opening job.

| # | Agent | Workflow (SOP) | What the person does | Approval posture |
|---|---|---|---|---|
| 0 | Foundation | none | Run log, registry, skill template, approval matrix, Slack staging | n/a |
| 1 | **Nora** | S1 | SEO and distribution: weekly GSC, indexing triage, outreach drafts. First job: the July hygiene fixes and the author reveal | Reports and drafts; Jeff ships |
| 2 | **Ed** | S9, S11 | Editorial: seasonal plan, rules watch, briefs, source packs, first drafts, refresh queue | Drafts only; Jeff publishes |
| 3 | **Frida** | S10 | Newsletter: the Friday Letter draft, subject plus two alternates | Draft only; Jeff sends |
| 4 | **Hal** | S5, S6 | Affiliate ops: link health, revenue reconcile, disclosure and application status | Reports only; Jeff applies and pays |
| 5 | **Ranger** | S7, S8 | Camp discovery and data quality, plus the DB backup and rollback | Writes enrichment under threshold; audited; deletes gated |
| 6 | **Vera** | S4 | Compliance: watches the inbox for deletion and opt-out, stages the fix | Monitor and draft; Jeff deletes. Year-round |
| 7 | **Sunny** | S12 | Support: inbound triage, reply drafts, Red Wall and family flags | Drafts only; a human sends |

Site operations and the deploy (S2, S3) stay Jeff-plus-Claude-Code sessions per Master Plan section 14. They are not agents. If Jeff later wants a draft-only deploy-preflight helper, it gets added then, not now.

Barnabus, the chief of staff, already exists and carries this whole roster in the daily briefing.

---

## What each agent build produces

Every session delivers the same set, so each agent is fully documented and truly owned:

1. **A name and a one-line job.** The person and what they do.
2. **An agent spec** on the Master Plan section 7 skill-template fields: purpose, success metric, trigger, inputs, tools allowed and forbidden, output schema, approval posture, logging payload, kill switch, maintenance-mode behavior, existence test.
3. **The skill file** that actually runs the workflow, version-controlled.
4. **A run-log wire** to agent_runs, so no run is silent.
5. **A kill switch**, independent enable and disable.
6. **A registry row** in agent_registry.
7. **A Slack staging line**, so its drafts land in the one place Jeff checks.
8. **A manual-mode rule**: what it does during the fall idle (maintenance-only for all but Vera).

---

## Sequencing rule

One agent at a time. A session finishes its agent, logs it, and reports before the next starts. Nothing half-built moves forward. Each build still honors the constitution: the HUMAN GATE, the RED WALL and FAMILY FIREWALL, the SOURCE RULE, the VOICE RULE and the anti-AI writing guide, and the CANARY auto-pause on a double failure.
