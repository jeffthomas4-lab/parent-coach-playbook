# PCD Skill Template

**Status:** foundation document, Session 0. Every agent in the PCD roster (Nora, Ed, Frida, Hal, Ranger, Vera, Sunny) gets built from this shape. Do not reinvent it per agent.

**Source:** Forge Command Master Plan section 7 (the skill template guardrails) and section 8 (the run-log schema), plus the Class A/B/C/D matrix from the Session Two input file. Nothing here overrides those documents. If this file and the Master Plan disagree, the Master Plan wins.

---

## The nine required fields

Every PCD agent spec fills in all nine. None get skipped, and none get replaced with a different field list.

**1. Purpose and success metric.** One sentence naming the job. One measurable number that tells Jeff the agent is working: a count, a rate, a time saved. Not a vibe.

**2. Trigger.** What starts the run: a Cowork schedule, a manual call, an event. Name the cadence if one exists.

**3. Inputs.** What the agent reads before it acts: the live data source, the prior run's output, the governing SOP. List them by name and location.

**4. Tools allowed and forbidden.** The exact tool list the agent may call. Anything touching a live parent-facing record, a send, a payment, or a delete is named here and marked forbidden unless the action class is D (see APPROVAL-MATRIX.md).

**5. Output shape.** Report, draft, or staged change set, mapped to the Class A/B/C/D matrix. Say which class the agent's normal output lands in.

**6. Approval posture.** Who signs off and on what, tied to the HUMAN GATE. Class A needs no sign-off. Class B and C need Jeff. Class D is Jeff only, and only inside a named confidence threshold if it runs unattended at all.

**7. Logging payload.** What gets written to `agent_runs` on every run: start, finish, status, summary, needs_you flag and items, outputs, error. See RUN-LOG.md for the live schema. A run that doesn't log didn't happen.

**8. Kill switch.** An independent enable and disable, separate from every other agent's switch. Flipping one agent off never touches another.

**9. Existence test.** The agent justifies itself against Master Plan section 1: it saves meaningful time, improves decision quality, reduces risk, or increases revenue. If it can't clear one of those, it doesn't get built, or it gets retired if it already was.

---

## Carried-forward guardrails (apply to all nine fields, not a tenth field)

These aren't separate spec fields. They're constraints that shape how the nine above get filled in.

- **One clearly defined purpose.** Field 1 stays one sentence. An agent with two jobs is two agents.
- **Human approval for anything touching customers, money, legal, or published content.** This is the HUMAN GATE. Field 6 always routes these through Jeff.
- **Version-controlled skill file.** The actual skill markdown lives in the repo, not a chat draft. Every change is a commit.
- **Evidence on every recommendation.** A draft or report without a source link doesn't ship. This is the SOURCE RULE from the Master Plan constitution.
- **Idempotent, safe to retry.** Running the skill twice on the same input produces the same result, not a duplicate.
- **Manual-mode behavior.** What the agent does during the fall idle (August through November). Maintenance-only for everyone except Vera, per Master Plan section 4 and the Session Two input file item 7.

---

## Two open additions flagged in the Session Two input, not yet adopted

The Session Two input file names two candidates worth a look when a given agent's spec needs them: a stated rollback path, and a named owner workstream. Neither is a required field yet. If an agent build needs one, name it in that agent's spec as an addition to this template, not a parallel template.

---

## How an agent build uses this file

1. Pull the SOP the agent is built from (the PCD Operating Manual).
2. Fill all nine fields above, in order.
3. Write the skill file that runs the workflow.
4. Wire the run-log calls (RUN-LOG.md has the exact schema).
5. Add the kill switch.
6. Add the row to `agent_registry`.
7. Add the Slack staging line (SLACK-STAGING.md).
8. Write the manual-mode rule.

This is the same list as PCD-AUTOMATION-BUILD-PLAN.md section "What each agent build produces." One list, one source.
