# PCD Automation Build Plan: the office roster

**Date:** 2026-07-13. **Roster completed 2026-07-15.**
**Status:** all seven built. Nora, Ed, Frida (2026-07-13), then Hal, Ranger, Vera, Sunny (2026-07-15). Six active in `agent_registry`, Sunny paused by design. Every one has the eight artifacts below. What remains is not a build: it is the wiring, and it is named in "Where this stands" at the bottom.
**Goal:** every PCD workflow becomes a named, documented, logged agent before August. Built one at a time, Sonnet does most of the work, each fully documented so Jeff can talk to the person doing the job.
**Governed by:** the PCD Operating Manual v1.4 and the Forge Command constitution. This plan does not override them; it promotes the standing SOPs into agents under the same rules.

---

## The two operating rules for this build

**No artificial cap.** We build every workflow, and we add an agent when a real workflow needs one, with a purpose. Not agents for the sake of a roster, and not a ceiling that blocks a needed one. Each agent earns its place by owning real work. Growth is driven by the work, not by a number.

**The gate has a horizon.** Today every agent drafts, stages, monitors, and prepares, then stops at the HUMAN GATE for anything that sends, publishes, deletes, or spends. That is where we start, not where we end. As each agent proves itself, the gate relaxes for its lower-risk actions, so the work moves without Jeff in every loop. One thing never relaxes: payments. Money movement stays gated permanently.

Because the roster grows and the gate loosens over time, the run log and kill switches get built first, not last. That is the foundation, already done. An agent that logs every run and can be killed with one switch is one you can safely trust with more. The foundation is what earns the relaxation.

---

## Build order

Session 0 is the shared spine. Then one agent per session, in this order. Distribution is still the constraint, so the SEO and distribution agent goes first and does the real July fixes as its opening job.

| # | Agent | Workflow (SOP) | What the person does | Approval posture | Built | Registry |
|---|---|---|---|---|---|---|
| 0 | Foundation | none | Run log, registry, skill template, approval matrix, Slack staging | n/a | 07-13 | n/a |
| 1 | **Nora** | S1 | SEO and distribution: weekly GSC, indexing triage, outreach drafts. First job: the July hygiene fixes and the author reveal | Reports and drafts; Jeff ships | 07-13 | active |
| 2 | **Ed** | S9, S11 | Editorial: seasonal plan, rules watch, briefs, source packs, first drafts, refresh queue | Drafts only; Jeff publishes | 07-13 | active |
| 3 | **Frida** | S10 | Newsletter: the Friday Letter draft, subject plus two alternates | Draft only; Jeff sends | 07-13 | active |
| 4 | **Hal** | S5, S6 | Affiliate ops: link health, revenue reconcile, disclosure and application status | Reports only; Jeff applies and pays | 07-15 | active |
| 5 | **Ranger** | S7, S8 | Camp discovery and data quality, plus the DB backup and rollback | Writes enrichment under threshold; audited; deletes gated | 07-15 | active |
| 6 | **Vera** | S4 | Compliance: watches the inbox for deletion and opt-out, stages the fix | Monitor and draft; Jeff deletes. Year-round | 07-15 | active (key `pcd-deletion-monitor`) |
| 7 | **Sunny** | S12 | Support: inbound triage, reply drafts, Red Wall and family flags | Drafts only; a human sends | 07-15 | paused, no schedule |

Every spec lives at `automation/agents/<name>/SPEC.md`, every skill at `automation/agents/<name>/SKILL.md`. Vera is the one exception and it is deliberate: her skill is `agents/pcd-deletion-monitor/SKILL.md`, because she was running before she had a name and moving the file would break the deployment path. `automation/agents/vera/SKILL.md` is a pointer to it, not a copy.

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

One agent carries a written exception to that last item. Vera's spec exempts her from CANARY, because auto-pausing the only thing watching a legal 30-day SLA converts a loud failure into a silent one, which is the exact incident that happened to her on 2026-07-14. Her repeated failures escalate through `needs_you` instead. Every other agent auto-pauses normally.

---

## Where this stands (2026-07-15)

The roster is done. The wiring is not, and the difference is worth stating plainly rather than letting a finished-looking table imply more than it should.

**What is real today.** Seven agents, seven specs on the section 7 fields, seven skill files, seven registry rows, seven kill switches, seven Slack lines, seven maintenance rules. `POST /api/agent-runs` exists and every skill file calls it at start and finish. The approval postures in the table above are enforced in every spec's tools list, not just described.

**What is not.** The ten deployed prompts under `Documents\Claude\Scheduled\` still run their own older text. They do not read these specs and, Vera excepted, they log nothing. So an agent is governed on paper and ungoverned in production until Phase 6 points the deployed prompt at its skill file. That is the last inch and it is the whole distance.

**Three switches only Jeff can throw:** the `FORGE_DB` binding and the `AGENT_RUNS_TOKEN` secret (without them the endpoint 500s or 503s, and nothing logs no matter how well it is wired), the Slack channel the roster stages into, and Sunny's enable after the account guard is confirmed.

**One thing that should not wait for December.** `scripts/BACKUP-PROVING-LOG.md` has zero rows. Ranger writes to the production database parents read, every night, and it has never been backed up. Three runs, three separate days, Jeff's own machine, commands in `BACKUP.md`.

**The gate did not move this session, and payments never move.** Every agent still drafts, stages, monitors, or reports. The horizon in the second operating rule above is real and each spec names its own candidates to relax, in order, with what has to be true first. None of them relaxed today.
