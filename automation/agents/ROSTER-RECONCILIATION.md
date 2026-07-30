# PCD agent roster reconciliation — 2026-07-29

Why this file exists: `automation/agents/` holds seven SPECs from the PCD Automation Build Plan (built 2026-07-13 to 2026-07-15). Separately, ~23 Claude scheduled tasks run PCD work daily under different names. A third list, the `agent_registry` table in the `forge-command` D1, is what `/admin/agents` actually renders. All three disagree. This maps them.

**Decision (Jeff, 2026-07-29): the scheduled tasks are the source of truth.** Where a SPEC and a scheduled task describe the same job, the task wins and the SPEC becomes a design record, not an instruction.

## The map

| SPEC | Workstream | Live scheduled task(s) | Registry row | State |
|---|---|---|---|---|
| **Nora** — SEO & distribution | S1 | `weekly-gsc-review` (Sun 9:00 PM) | `nora`, active, last ran 2026-07-28 | **Live.** Fully reconciled — the one agent where all three lists agree. |
| **Ed** — editorial | S9, S11 | `pcd-editorial-writer` (daily 6:15 AM) + `pcd-review-publish` (Penny, daily 9:00 PM) + `pcd-blog-refresher` (Flo) + `pcd-freshness-audit` | `ed`, active, **never ran** | **Live, unlogged.** The work runs; the registry has no evidence because the tasks don't POST to `/api/agent-runs`. Ed's single SPEC has since been split across four named tasks. |
| **Vera** — compliance | S4 | `pcd-deletion-monitor` (daily 7:04 AM) | `pcd-deletion-monitor`, active, last ran 2026-07-29 | **Live.** Vera's own SPEC already states she *is* `pcd-deletion-monitor` — a reconcile, not a new build. Correct as written. |
| **Frida** — newsletter | S10 | `pcd-friday-letter-draft` (Wed 8:03 AM) | `frida`, active, **never ran** | **Live, unlogged, duplicate row.** Frida's SPEC was written to give the "unowned Wednesday scheduled task" an owner — that task is `pcd-friday-letter-draft`, and it is still running unowned. |
| **Hal** — affiliate ops | S5, S6 | Split four ways: `pcd-link-health-monitor` (Linda), `pcd-affiliate-replacement-sourcer` (Arnie), `pcd-alfred-affiliate-link-deploy` (Alfred), `pcd-affiliate-reconciler` | `hal`, active, **never ran** | **Superseded.** Hal's one-agent design was replaced by a four-stage pipeline with a human gate between sourcing and deploy. The pipeline is better; Hal never ran. |
| **Ranger** — camp data + backup | S7, S8, Open Item 10 | Split five ways: `pcd-camps-data-steward`, `pcd-evergreen-daily`, `org-discovery-daily-worklist`, `pcd-camp-info-requests`, `pcd-backup` | `ranger`, active, **never ran** | **Superseded.** Same story as Hal. |
| **Sunny** — support | S12 | **None.** | `sunny`, paused, never ran | **Not implemented, and nothing covers it.** See below. |

Also in the registry: `editorial` (status `retired`, venture `pcd, press`) — a stale row predating Ed, safe to drop. `pcd-backup` sits at status `paused` while the `pcd-backup` scheduled task runs every Saturday, so that row is simply wrong.

## The one real gap: Sunny

Sunny is the only roster agent with no live equivalent. Her job is triaging mail to PCD's three public aliases and drafting replies. Nothing in the scheduled-task list does this — `jarvis-desk-triage` is the pugetsound.edu coaching inbox and is deliberately walled off from portfolio work, and `pcd-deletion-monitor` reads support@ but only for deletion and opt-out requests.

So mail to PCD's public aliases that is neither a deletion request nor spam is currently going unanswered by anything. That is a coverage gap, not dead code. It should not be deleted on the "never ran" rule with the other two.

## What was and was not done here

**Not deleted.** No SPEC folder was removed. Hal and Ranger describe work that is genuinely running under other names, so their SPECs are the design record for live behavior; deleting them loses the reasoning and keeps none of the risk. Sunny is an open gap, not dead weight. Each SPEC instead carries a status header pointing at its successor.

**Still owed, and it is the thing that actually fixes `/admin/agents`:** the scheduled tasks do not call `POST /api/agent-runs`, so the registry cannot show what ran. `scripts/agent-run-client.mjs` already exists as the caller. Until each task posts a start and a finish, `/admin/agents` will keep showing an empty run list next to a registry full of agents that appear active and idle. `automation/TASK-RUN-LOG-RECONCILIATION.md` tracks this and still marks every PCD task `pending` for run proof.

## Registry SQL for Jeff (writes — run these yourself)

These correct `agent_registry` in `forge-command` (`747cf988-a557-48bd-9d03-bea09e184f94`) so `/admin/agents` stops implying that four agents are active and merely quiet. Read the map above before running; the retirements are judgment calls, not mechanical.

```sql
-- Superseded by named scheduled-task pipelines. Retire, do not delete:
-- the row is the only record that the design was considered.
UPDATE agent_registry SET status = 'retired' WHERE venture = 'pcd' AND agent IN ('hal', 'ranger', 'frida');

-- Stale pre-Ed duplicate.
UPDATE agent_registry SET status = 'retired' WHERE agent = 'editorial' AND venture = 'pcd, press';

-- Wrong: the pcd-backup scheduled task runs every Saturday.
UPDATE agent_registry SET status = 'active' WHERE agent = 'pcd-backup' AND venture = 'pcd';

-- Sunny stays 'paused' on purpose: not superseded, not implemented, still owed.
```

Deliberately not included: any statement touching `ed`, `nora`, or `pcd-deletion-monitor`. Those three are live and correct; `ed` shows no runs only because the writer task does not log them yet, and retiring it would hide a working agent.
