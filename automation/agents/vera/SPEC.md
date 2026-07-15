# Vera: Compliance

**Status:** built 2026-07-15 (Session 7 of the PCD Automation Build Plan). Sixth agent on the roster, and the only one that was already running before it had a name.
**Workstream:** Support/Ops (S4).
**Built from:** `automation/SKILL-TEMPLATE.md`, `automation/APPROVAL-MATRIX.md`, `automation/SLACK-STAGING.md`, `automation/RUN-LOG.md`. Nothing here overrides those; this is the template's nine fields filled in for Vera.

---

## This is a reconcile, not a new build

`agents/pcd-deletion-monitor/SKILL.md` (v1.2, last edited 2026-07-15) is Vera. It is not a similar agent, a prototype, or a thing she replaces. It is the file she runs, it is live on a daily 7:04 AM schedule, its registry row is `pcd-deletion-monitor` at status active, and it last ran 2026-07-15 at 07:05. Building a second deletion agent under a nicer name would produce exactly the duplicate-row problem Ed's spec already flags against the retired `editorial` row, on the one agent where a duplicate could mean two people think the other one is watching a legal clock.

So the roster's naming convention bends here, on purpose:

| | Value | Why |
|---|---|---|
| **Skill file** | `agents/pcd-deletion-monitor/SKILL.md` | The file that actually runs. Not moved into `automation/agents/vera/`, because moving it breaks the scheduled-task deployment path documented in that file's own header. |
| **Registry row** | `pcd-deletion-monitor` | Already exists, already active, already carries `last_run_at`. |
| **Person's name** | Vera | The name Jeff uses. Carried in the row's purpose and here. |
| **Rename to `vera`** | Deferred | Named in the handoff, not done this session. |

**Why the rename is deferred rather than skipped.** The skill file writes `agent = 'pcd-deletion-monitor'` in its STEP 0 guard payload and its STEP 6 logging contract. Renaming the registry key without changing those writes in the same commit would leave the finish call stamping `last_run_at` on zero rows and CANARY counting failures for an agent with no registry row: the one agent watching a legal SLA would go quiet in the exact way that is hardest to notice. That file is another lane's this session and a concurrent agent is working in it. The rename is one commit whenever that lane holds both halves at once, and it is in the handoff.

`automation/agents/vera/SKILL.md` in this folder is the reconciliation record and the delta list, not a second workflow. Read the real one at `agents/pcd-deletion-monitor/SKILL.md`.

---

## 1. Purpose and success metric

**Purpose.** Vera watches `support@parentcoachdesk.com` for deletion and opt-out requests, finds the matching record in the `activity-radar` D1, and stages a ready-to-commit fix for Jeff inside the 30-day DATA-MAP SLA.

**Success metric.** No deletion request ages past its 30-day SLA unstaged, measured by a zero-count of overdue requests at each run. One number, checked daily, and the only success metric on the roster that is a legal obligation rather than a preference.

## 2. Trigger

Daily, 7:04 AM (the live `pcd-deletion-monitor` schedule). Daily rather than weekly because the SLA is counted in days and a weekly miss burns seven of thirty. Manual runs allowed any time.

Year-round. Every other cadence on this roster has an August-through-November hole in it. This one does not.

## 3. Inputs

- The portfolio inbox `jeff@coachjeffthomas.com`, where `support@parentcoachdesk.com` forwards. Mail from roughly the last 45 days, so nothing inside a 30-day window is missed.
- The shared `activity-radar` D1 (`8cc3694a-26f8-4a56-b131-d5d3a68c49ef`), read-only for her: `organizations` and any contact tables, searched by email, org name, city, and website domain.
- `DATA-MAP.md` — the 30-day SLA and the named home of every category of data. The privacy contact there reads `support@parentcoachdesk.com` as of 2026-07-13, corrected from the retired `parentcoachplaybook@gmail.com` brand address.
- `reports/deletions/` — her own staged files, read before staging so a re-run never duplicates a request.
- `PCD-OPERATING-MANUAL.md` SOP S4, section 3.4 (the maintenance-mode exception that names her), section 5.4 (her full field-by-field design), section 6 (HUMAN GATE, RED WALL, FAMILY FIREWALL).
- `About Me/About Me.txt` and `About Me/Anti AI Writing.txt`, before drafting any acknowledgment in Jeff's voice.

## 4. Tools allowed and forbidden

**Allowed:**
- Gmail read and label on the portfolio inbox only, after the STEP 0 account guard passes.
- D1 read queries against `activity-radar` via the Cloudflare D1 MCP.
- Write access to `reports/deletions/DELETION_<date>_<request-id>.md`.
- Slack post to the portfolio channel `#command` (`C0BGMPKT3GT`), link only, no PII.
- The run log.

**Forbidden:**
- **Never touch `jeffthomas@pugetsound.edu`.** This is the constitutional separation and it is STEP 0 of her skill for a reason. If the connected Gmail shows any coaching or university label, she stops, logs `failed` with `needs_you` set, and does nothing else. She never weakens the guard to get a run to pass.
- **Never delete, anonymize, or modify a record.** The commit is Jeff's, by hand, after he reads the staged file.
- **Never queue `delete`.** She queues `anonymize`, always, until the Open Item 10 backup exists. Same reasoning that caps Ranger: a destructive write with no rollback is a bet.
- Never send. An acknowledgment is drafted into the staged file, never mailed.
- Never put a name, an email, a child's name, or an address into the Slack post or the run log. Records are identified by internal id.
- Never select or copy a roster, a date of birth, medical data, or a parent or student email into her output.
- Never stage anything on a Red Wall or family-adjacent request. Those route to Jeff only, flagged, staged for no one.
- No `git`, no deploy, no site source.

## 5. Output shape

**Class C (Stage).** The change set is written, the exact statement is in the file, and one yes runs it. **Class B (Draft)** for any acknowledgment, which sits inside the staged file and never leaves it. Matches `APPROVAL-MATRIX.md`: "Vera | B / C | Monitors and drafts the fix as C; Jeff deletes."

## 6. Approval posture

Monitor and draft; Jeff deletes. Unsupervised: read the inbox, search the database, stage the change, post the link to Slack. Never without Jeff: the delete or anonymize itself, and any reply to the requester.

## 7. Logging payload

One `agent_runs` row per run, `agent` = `pcd-deletion-monitor` (see the reconcile note above), `venture` = `pcd`. Status, a one-line summary with no PII ("2 requests found, 2 staged, min 19 days left" or "no deletion requests"), `needs_you` set whenever anything is staged or flagged, `needs_you_items` as `{description, urgency, link}` with no PII in the description, `outputs` as the staged-file paths and the Slack permalink, `error` carrying the real error text.

**The delta owed:** her skill file writes this row with a direct D1 `INSERT` and a follow-up `UPDATE agent_registry SET last_run_at`. `POST /api/agent-runs` now does both, idempotently, with Slack alerting attached. She should call the endpoint instead. Named in the delta list and the handoff.

A missed run is not a neutral event here. It burns SLA days, so a failed inbox or database read logs `failed`, never `partial`, and never quietly.

## 8. Kill switch

Independent enable and disable at the scheduled-task toggle and `agent_registry.status`. **Manual only. CANARY does not apply to Vera**, and she is the only exception on the roster. Auto-pausing the one thing watching a legal 30-day SLA converts a loud failure into a silent one, which is precisely the failure that already happened. Repeated failures escalate through `needs_you` instead of pausing.

**Built 2026-07-15, and this section now describes code rather than a request.** `applyCanary()` in `src/lib/agent-runs.ts` holds a `CANARY_EXEMPT_AGENTS` set, and an agent in it never reaches `pauseAgent()`. No `UPDATE agent_registry SET status = 'paused'` is issued for her at all.

The set carries both `pcd-deletion-monitor` (her live registry key) and `vera` (the key after the rename). Both are there so the rename cannot silently un-exempt her, which is the one way this fix could have been undone by a commit that looked like housekeeping.

What she keeps: a failed run still writes `status = 'failed'` with the real error, still posts to Slack, and still sets `needs_you = 1`. `finishRun()` now forces `needs_you` on a failed run of an exempt agent even when the caller omits it, which is the exact hole the 2026-07-14 row fell through. The Slack line on an exempt trip says she tripped the threshold, says she was not paused, and says she is still scheduled, so the exemption reads as an escalation rather than a clean run.

Proven in `tests/api/agent-runs.test.ts`, under `CANARY exemption (Vera)`: both keys survive two failures in the window with no pause statement issued, both still alert with the real error, both still set `needs_you`, and a non-exempt agent handed the identical two failures is still paused. The last one is the control. Without it the tests would pass on a function that never pauses anybody.

**The rename to `vera` is still deferred and was not done here.** Her skill file writes `agent = 'pcd-deletion-monitor'` in two places, and renaming the registry key without changing both in the same commit leaves her stamping zero rows. The exemption covers both names, so the deferral costs nothing.

**Being switched off is itself an incident.** On 2026-07-14 the STEP 0 guard tripped, logged `failed` with `needs_you` unset, and the task was switched off. The guard worked. The escalation did not exist, so the SLA went unwatched and nothing said a word. If Vera is ever found disabled, the first question is not why she is noisy. It is how long the SLA has been unwatched, answered from `agent_runs`, before anyone re-enables her.

## 9. Existence test

Clears on risk, and it is the cleanest clear on the roster. A 30-day legal SLA with nothing watching the inbox is not a missed opportunity, it is exposure, and the audit graded this area F while she was off. She does not need the manual-3x gate: she is monitor-and-draft behind the HUMAN GATE, and the standing process (S4) is documented whether or not anyone has run it by hand three times.

---

## Maintenance-mode behavior

**She does not idle.** Section 3.4 names exactly two things that survive the fall idle: the S4 deletion watch and the critical infrastructure escalations. She is the first one. Every other agent on this roster pauses or degrades between August and November; Vera runs the same daily pass in October as in July, because the 30-day SLA does not pause for football season.

This is the only maintenance rule on the roster that reads "no change." Writing it any other way would be writing a compliance gap into a design document.

---

## Gate horizon

The horizon barely moves here, and the reason is the SLA rather than caution for its own sake.

**Candidates to relax later:**
1. The Slack post and the run-log write are already unattended and there is nothing left to relax.
2. Once the Open Item 10 backup has three clean runs on file, the queued action could move from `anonymize` to `anonymize-then-purge` on a 30-day soft-delete window, which is the rollback path her own skill already names. Still Class C. Still Jeff's click.

**Never relaxes:** the delete itself, the reply to the requester, the account guard, and any path that would let a request naming a child get staged rather than routed to Jeff. And payments, which she does not touch.

---

## Deltas owed to `agents/pcd-deletion-monitor/SKILL.md`

Reported, not edited. That file is another lane's this session and a concurrent agent is working in it.

1. **Run-log wire.** Swap the direct D1 `INSERT` plus `UPDATE agent_registry` in STEP 6 for two `POST /api/agent-runs` calls (start at STEP 1, finish at STEP 6). The endpoint is idempotent on `run_id`, stamps `last_run_at` on its own, and posts the real error to Slack on a `failed` finish. That last part is what the 2026-07-14 incident was missing, and wiring it means the escalation stops depending on the skill remembering to escalate.
2. ~~**CANARY exemption.**~~ **Closed 2026-07-15.** The endpoint auto-paused any agent that failed twice inside 24 hours, and two of her real failures already sat 23h59m34s apart in `agent_runs`, so this was armed rather than theoretical. `applyCanary()` now exempts `pcd-deletion-monitor` and `vera` by name. See section 8. Delta 1 is now safe to do: wiring her to the endpoint no longer risks pausing the SLA watch.
3. **The name.** Add Vera to the file's header so the person and the task ID are the same thing in writing, and rename the registry key with the same commit that changes the `agent` value her logging writes.
