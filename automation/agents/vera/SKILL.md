# Vera's skill: pointer and reconciliation record

**Agent:** Vera (Compliance, PCD)
**This is not the skill file.** The file that runs is `agents/pcd-deletion-monitor/SKILL.md` (v1.2, last edited 2026-07-15), deployed to the scheduled task `pcd-deletion-monitor`, daily 7:04 AM, enabled, last run 2026-07-15 07:05.

---

## Why this file is a pointer and not a workflow

Vera is the only agent on the roster that was running before it had a name. Her workflow was written, deployed, broken, found, and fixed before this build session opened. Writing a second copy of it here under the roster's folder convention would put two deletion workflows in the repo, and on the one agent watching a legal 30-day SLA, the failure mode of two files is that each one looks like the other one is handling it.

So the convention bends and the file stays where it runs. `SPEC.md` in this folder is Vera's nine-field spec and the reconciliation record. This file exists so nobody opens `automation/agents/vera/` looking for the workflow, finds nothing, and writes one.

## Where everything is

| Thing | Location |
|---|---|
| The skill that runs | `agents/pcd-deletion-monitor/SKILL.md` |
| The deployed copy | `Documents\Claude\Scheduled\pcd-deletion-monitor\SKILL.md` |
| Her spec | `automation/agents/vera/SPEC.md` (this folder) |
| Her registry row | `agent_registry`, key `pcd-deletion-monitor`, status active |
| Her design record | `PCD-OPERATING-MANUAL.md` section 5.4 |
| Her staged output | `reports/deletions/` |
| Her SLA | `DATA-MAP.md`, 30 days, contact `support@parentcoachdesk.com` |

The git-tracked file is the source. The scheduled-task copy is a deployment of it. Edit the source, commit, then redeploy, per that file's own header and the manual's section 4.3.

## The three deltas owed

Full reasoning in `SPEC.md`. In short:

1. **Wire the run log to `POST /api/agent-runs`** instead of the direct D1 `INSERT` in STEP 6. The endpoint stamps `last_run_at` on its own and posts a real error to Slack on a `failed` finish, which is exactly what the 2026-07-14 incident lacked.
2. **Exempt Vera from CANARY at the endpoint.** Her spec forbids auto-pause; the endpoint auto-pauses on two failures in 24 hours. One of them has to give, and it cannot be her spec, because auto-pausing the SLA watch is the incident that already happened.
3. **Rename the registry key to `vera`** in the same commit that changes the `agent` value her skill writes, never separately.

## The one rule that governs everything above

She never idles. Section 3.4 of the manual names two things that survive the August-through-November fall idle, and the S4 deletion watch is the first. Any future edit to her skill, her schedule, or her switch gets checked against that sentence before it lands.
