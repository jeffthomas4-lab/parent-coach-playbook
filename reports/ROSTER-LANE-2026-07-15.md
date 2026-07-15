# Agent Roster Lane — 2026-07-15

**Scope:** finish the roster `PCD-AUTOMATION-BUILD-PLAN.md` names. Nora, Ed, and Frida were built 2026-07-13. This lane built the remaining four: Hal, Ranger, Vera, Sunny. Plus the audit's section 10 documentation drift, and the run-log wire the Friday Letter, seasonal, and freshness tasks still owed.

**Governed by:** the build plan, `PCD-AUTOMATION-AUDIT-2026-07-14.md` (sections 8, 9, 10), the PCD Operating Manual, the Forge Command constitution, `automation/SKILL-TEMPLATE.md`, `automation/APPROVAL-MATRIX.md`.

**Result:** the roster is complete. Seven agents, seven specs, seven skill files, seven registry rows, seven kill switches, seven Slack lines, seven maintenance rules. Six active, one paused on purpose. Nothing scheduled, nothing deployed, no git command run, and the HUMAN GATE did not move one inch.

---

## 1. Hal — affiliate ops (S5, S6)

**One-line job.** Keeps PCD's only live revenue mechanism honest: checks that every affiliate link still lands where it should, reconciles what the networks actually paid, and tracks the eight pending applications and every page's disclosure.

**Approval posture:** Class A and B. Reports only; Jeff applies and pays. No Class C, no Class D.

**Success metric.** Every slug in `affiliates.json` checked inside 35 days per `reports/link-health/STATE.md`, and zero browser-confirmed broken links unreported past one weekly cycle. Monthly: every pending network carries a status and a days-since count, and any revenue that arrives lands in a file rather than in memory. That second number's honest baseline is zero, because no revenue has ever been recorded anywhere in the file tree.

**The two things his skill insists on.** Space Amazon requests 5 to 10 seconds apart and re-check every flag in a real browser before reporting it. The 2026-07-06 run flagged 6 of 65 links and all 6 were fine: Amazon's bot detection returns an interstitial carrying the words "currently unavailable." A link-health report that cries wolf six times teaches Jeff to ignore the seventh.

**Where the payment line sits.** First in his forbidden list, not last. Hal is the agent standing nearest the money on this roster, so his spec names every adjacent thing he may not touch: no payout setting, no bank or tax detail, no order, no application submitted, no Associates or CJ account change even when Chrome access is granted. Read the numbers, close the tab.

**Maintenance mode.** Both checks keep running August through November. They are read-only and they watch the only revenue surface PCD has, and a link that dies in September is dead either way. Every draft and swap holds for December as a `needs_you` item, except a broken link on a top-traffic page, which is ten minutes of Jeff's time and is money.

**Files:** `automation/agents/hal/SPEC.md`, `automation/agents/hal/SKILL.md`. Registry: `hal`, active.

---

## 2. Ranger — camp discovery, data quality, and the database safety net (S7, S8, Open Item 10)

**One-line job.** Owns the camp data layer end to end: turns unverified org stubs into listings a parent can use, keeps the live directory clean, and holds the backup and rollback path that makes any of it safe to undo.

**Approval posture:** Class D and C. He carries the roster's only Class D, and the boundary is the entire control: an organization website update plus a camp-scan queue insert, for a record at 75 confidence or higher with no needs-review flag. Nothing else. Every delete and every bulk fix is Class C, staged, with the exact statement written out and Jeff's hand on it.

**Success metric.** Three numbers, because he carries three obligations and averaging them would hide the one that matters. Accept rate and confident-website rate per run, tracked over time. Zero expired sessions and dead links live past a weekly cycle. And the gap in days between the newest backup and last night's write, which is currently undefined.

**The call worth flagging.** `scripts/BACKUP-PROVING-LOG.md` has zero rows. The 2026-07-13 note said "tonight is run one" and that run never happened. So the database `org-discovery-daily-worklist` writes to every night has never been backed up, and Ranger's spec holds that he **adds no new autonomous write scope until that log reads three**. Same reasoning that already caps Vera to anonymize rather than delete: a destructive or unattended write with no rollback is a bet that nothing goes wrong. He cannot start the clock himself; the runs need Cloudflare credentials the sandbox does not hold, and a real `wrangler d1 export` attempt has already failed with `user auth missing api token non interactive`.

**He never deletes.** Not a duplicate, not an expired session, not an orphaned queue row that looks obviously dead. That holds after the backup exists too, because a backup makes a mistake survivable rather than making the delete his decision.

**He never moves the threshold.** 75 is Jeff's number, in writing, in the Approval Matrix. Moving it on his own accept-rate data is exactly the failure the threshold exists to prevent.

**Maintenance mode.** S7's autonomous writes **stop** August through November, per Jeff's call of 2026-07-13. Not degrade. Stop. It is the one place on the roster where maintenance removes a capability rather than a cadence, and the reason is that four months of unattended production writes with nobody reading the accept rate is precisely the risk section 5.3 names. S8 keeps running report-only; the backup gap gets reported all four months.

**Open Item 4, proposed not adopted.** His spec proposes the periodic audit all three external reviews landed on: quarterly, read the accept rate from `agent_runs`, sample 20 accepted records against their real websites, count how many a human would have rejected, check the PII guardrail against what actually landed. Over 10 percent false accepts and the threshold moves up, by Jeff. This needs Jeff's yes to become a cadence.

**Files:** `automation/agents/ranger/SPEC.md`, `automation/agents/ranger/SKILL.md`. Registry: `ranger`, active.

---

## 3. Vera — compliance (S4)

**One-line job.** Watches `support@parentcoachdesk.com` for deletion and opt-out requests, finds the record, and stages a ready-to-commit fix inside the 30-day DATA-MAP SLA.

**Approval posture:** Class B and C. Monitor and draft; Jeff deletes. She queues `anonymize`, never `delete`, until the backup exists.

**This was a reconcile, not a build.** `agents/pcd-deletion-monitor/SKILL.md` (v1.2) **is** Vera. Live, daily 7:04 AM, registry row active, last run 2026-07-15 07:05. Building a second deletion agent under a nicer name would have produced the duplicate-row problem Ed's spec already flags against the retired `editorial` row, on the one agent where a duplicate means each file looks like the other one is watching the clock. So:

- Her skill file stays where it runs. `automation/agents/vera/SKILL.md` is a pointer and a delta list, not a copy.
- Her registry row stays `pcd-deletion-monitor`, purpose updated to name her.
- **The rename to `vera` is deferred, deliberately.** Her skill writes `agent = 'pcd-deletion-monitor'` in its STEP 0 guard payload and STEP 6 logging contract. Renaming the key without changing those in the same commit leaves the finish call stamping `last_run_at` on zero rows and CANARY counting failures for an agent with no registry row. The one agent watching a legal SLA would go quiet in the way that is hardest to notice. One commit, both halves, whoever owns that file next.

**Her maintenance rule is the only one on the roster that reads "no change."** Section 3.4 names two things that survive the fall idle and the S4 watch is the first. Same daily pass in October as in July. Writing it any other way would be writing a compliance gap into a design document.

**CANARY does not apply to her, and that is now a real conflict.** Her spec forbids auto-pause: pausing the only watch on a legal SLA converts a loud failure into a silent one, which is exactly the 2026-07-14 incident, where her guard tripped correctly, logged `failed` with `needs_you` unset, and the task got switched off with nothing saying a word. But `POST /api/agent-runs` auto-pauses any agent that fails twice in 24 hours. The moment she calls the endpoint, the endpoint overrides her spec. **The endpoint needs a Vera exemption, or wiring her to it re-creates the incident with a nicer mechanism.** In the handoff.

**Files:** `automation/agents/vera/SPEC.md` (the nine fields and the reconcile record), `automation/agents/vera/SKILL.md` (pointer). Skill that runs: `agents/pcd-deletion-monitor/SKILL.md` — read, not edited, per the lane boundary. Registry: `pcd-deletion-monitor`, active.

---

## 4. Sunny — support (S12)

**One-line job.** Triages the mail arriving at PCD's three public aliases, drafts a reply for each one that deserves a human answer, and flags anything Red Wall or family-adjacent to Jeff without touching it.

**Approval posture:** Class B only. Drafts only; a human sends.

**Success metric.** Every message carries a triage decision and, where warranted, a draft within one business day, with zero Red Wall or family-adjacent messages handled as ordinary support mail. The target on that second number is zero, permanently.

**Her triage order is the design.** Four questions per message, and the first two can stop the run for that message before any text exists. Red Wall first: a parent naming their child, a player writing about themselves, anything touching a recruit, prospect, player, or family gets labeled, flagged, and **no draft at all**. Not a careful draft, not a generalized one. Deletion requests second: those are Vera's, with a legal clock, so Sunny labels and names the handoff and never stages or replies. If Vera has not picked one up by the next run, that is a `needs_you` item, because a request sitting between two agents is a request nobody has.

**Registered `paused`, no schedule, on purpose.** She reads mail on Jeff's behalf, and the account guard has to be confirmed against the live connected inbox first. Vera's guard tripped on the wrong inbox two days ago; an agent that *drafts replies* on `jeffthomas@pugetsound.edu` would be a Red Wall exposure, not an inconvenience. Her skill carries the same STEP 0 guard and the same stop-and-escalate-loudly rule.

**Maintenance mode.** She holds August through November. Inbound mail is the one place where degrading to report-only is worse than stopping: a triage log nobody reads for four months is a list of unanswered people, and Jeff's inbox already shows him that list.

**One reconcile owed, not this lane's call.** A portfolio `support` row sits paused, purpose "inbound triage across venture domains," scheduled to ship in September. It overlaps Sunny's PCD-only scope, the same shape as the retired `editorial` row against Ed, but retiring or re-scoping it is a Forge Command decision. Two rows that both think they own PCD's inbox is the drift this session was closing.

**Files:** `automation/agents/sunny/SPEC.md`, `automation/agents/sunny/SKILL.md`. Registry: `sunny`, paused.

---

## 5. The eight artifacts, per agent

| Artifact | Hal | Ranger | Vera | Sunny |
|---|---|---|---|---|
| Name and one-line job | yes | yes | yes | yes |
| Spec on the section 7 fields | yes | yes, plus both Phase-5 additions | yes | yes |
| Skill file that runs the workflow | yes | yes | `agents/pcd-deletion-monitor/SKILL.md` | yes |
| Run-log wire to `agent_runs` | `POST /api/agent-runs` | `POST /api/agent-runs` | direct D1 insert today, endpoint owed | `POST /api/agent-runs` |
| Kill switch | `hal`, CANARY on | `ranger`, CANARY on | manual only, CANARY exempt | `sunny`, CANARY on |
| Registry row | active | active | active (`pcd-deletion-monitor`) | paused |
| Slack staging line | yes | yes, names the delete | yes, `#command` | yes, counts only |
| Manual-mode rule | report-only, keeps running | S7 writes stop, S8 report-only | never idles | holds |

Ranger is the only agent carrying the two optional Phase-5 additions the skill template allows (a stated rollback path and a named owner workstream), because he is the only one that needs them.

---

## 6. Run-log wires this lane owed

The Worker lane built `POST /api/agent-runs` and named the debt: "Friday Letter, seasonal, and freshness have no logging and no Slack contract at all. That is the agent-roster lane." Paid:

| Skill | Change |
|---|---|
| `automation/agents/frida/SKILL.md` | start call added before the work, finish call replacing the generic "log one row" line |
| `automation/agents/ed/SKILL.md` | same, covering all three of his cadences: rules watch, seasonal plan, freshness audit |
| `automation/agents/nora/SKILL.md` | same, tied to her Class A "post only if it surfaces something" rule, which the endpoint's `needs_you` behavior implements exactly |
| Hal, Ranger, Sunny | wired at build |

The endpoint's own behavior does a job the skills used to have to remember: a `failed` finish posts the real error to Slack, a `needs_you` finish posts whatever the status, a clean run posts nothing. That is the Class A and Class B staging convention, enforced by the wire rather than by each agent's discipline. Which is the whole reason Vera's 2026-07-14 escalation gap is worth closing at the endpoint rather than in her prose.

---

## 7. Documentation drift (audit section 10)

**Fixed, `PCD-OPERATING-MANUAL.md` (now v1.4):**
- The deleted `pcd-gsc-analytics-report` is out of the SOP index (2.2), the S1 backing-task line, the task inventory (3.2), the weekly cadence (3.3), the prompt inventory (4.1), and the naming-convention note (4.2). It has not existed since 2026-07-13. Verified against the live scheduled-task list, not inferred.
- Both org charts (4 and 5.2) now key on the seven built agents instead of task IDs, a stale `editorial` row, and a "planned" `pcd-deletion-monitor`. 3.2 and 4.1 gained an Owner column.
- 5.4 records that Vera shipped and what her guard-trip incident taught.
- 5.5's future-menu list is closed, with each agent's honest decision-6 standing: cleared as a real test (Nora, Ed), cleared only as "running" (Frida, Hal, Ranger), does not need it (Vera, Sunny), genuinely blocking (`pcd-backup`).
- Open Item 3 is now half closed rather than open: the wire exists and every roster skill calls it; nine deployed prompts still do not.

**Fixed, `Outputs/Forge Command/ventures/parentcoachdesk.md`:** it and the manual now agree on who is active. Affiliate broken out of editorial's scope under Hal, camp lead gen given Ranger as owner with the backup gap named rather than smoothed, support and compliance added as a workstream, the "cleared but unassigned" GSC section closed under Nora, and the roster stated as complete.

**Fixed, the deletion contact.** The venture file named `parentcoachplaybook@gmail.com` in three places (key contacts, maintenance mode, continuity) after the July purge retired it. All three now read `support@parentcoachdesk.com`, and each names Vera as the thing watching it. `DATA-MAP.md` was already correct as of 2026-07-13; the venture file was the one still pointing at a dead address, which mattered because it was the file describing what happens if Jeff is unreachable for a month.

**Reported, not edited (other lanes' files):**
- `KIT_SETUP.md` line 52 still links `https://parentcoachplaybook.com/welcome/`. The distribution lane fixed the rest of that file today and missed one. One-line fix; that lane's.
- **imagegen's default save path** could not be verified from this lane. The skill lives outside the connected folders and the audit's claim (that it points at the dead `parent-coach-playbook` name) could not be confirmed or refuted. Someone with reach should check it rather than trust either the audit or this line.

---

## 8. What this lane did not do

No git command, no `npm run build`, no deploy. No scheduled task created, updated, enabled, or disabled. No edit to `src/`, `worker-cron/`, `wrangler.jsonc`, `kit-emails/`, `public/`, or `agents/pcd-deletion-monitor/`, which was read and reconciled against but never touched, since a concurrent lane owns it.

The gate did not move. Every agent still drafts, stages, monitors, or reports. Payments stay gated permanently and Hal's spec is where that line is carried, since he is the one who stands nearest it.

---

## HANDOFF

### Needs Jeff — P0

1. **Start the backup clock.** Three runs of `scripts/backup-activity-radar.ps1`, on three separate days, from your own machine. Commands in `BACKUP.md` under "Starting the clock." The proving log has zero rows, `org-discovery-daily-worklist` has been writing to `activity-radar` nightly for two days on top of the gap that was already there, and Ranger holds his own write scope flat until that log reads three. Same-day runs do not count: they prove the script works without proving it survives a fresh shell or an expired wrangler session.

2. **Resolve the Vera-versus-CANARY conflict.** Her spec forbids auto-pause. The endpoint auto-pauses on two failures in 24 hours. Wiring her to the endpoint as-is re-creates the 2026-07-14 incident with better tooling. The fix is an agent exemption in `src/lib/agent-runs.ts`'s `applyCanary`, which is the Worker lane's file. Until then her direct D1 insert is the safer of two imperfect options and should stay.

3. **Set `FORGE_DB` and `AGENT_RUNS_TOKEN`.** Every roster skill now calls the endpoint. Without the binding it 500s; without the token it 503s. Seven agents' logging depends on two settings. Details in `reports/WORKER-PLATFORM-LANE-2026-07-15.md`.

### Needs Jeff — decisions

4. **Sunny's enable.** Confirm the connected Gmail is `jeff@coachjeffthomas.com` and not the university inbox, then say the word and she gets a daily schedule after Vera's 7:04. Registered paused until you do. This is a Red Wall question, not a convenience one.

5. **The staging channel.** `SLACK-STAGING.md`'s open item is still open. Vera posts to `#command` (`C0BGMPKT3GT`). Do the other six agents' drafts land there alongside Barnabus, or in a PCD channel of their own? Nobody posts blind until you answer.

6. **Ranger's Open Item 4 audit.** Quarterly, sample 20 accepted records, count the false accepts, move the threshold if it is over 10 percent. Proposed in his spec, needs your yes to be a cadence.

### For the next roster session

7. **Phase 6 is the last inch.** Ten deployed prompts under `Documents\Claude\Scheduled\` still run their own text and ignore these specs. Every artifact above is real and none of it reaches production until each task's prompt points at its skill file. The org charts say "Partial" for that reason and will keep saying it however good the specs get.
8. **Vera's rename** to `vera`: one commit, moving the registry key and the `agent` value her skill writes together, never separately.
9. **The portfolio `support` row** versus Sunny. Forge Command's call, following the `editorial`-versus-Ed precedent.
10. **`KIT_SETUP.md` line 52** and the imagegen save path, both named in section 7.
