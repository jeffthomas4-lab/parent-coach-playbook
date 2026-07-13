# PCD Operating Manual v1.1: Apply Handoff (for a Sonnet session)

**Date:** 2026-07-13
**From:** Reconciliation pass (Opus). Adjudication is complete and approved by Jeff.
**Governing doc being edited:** `Outputs/parent-coach-desk/PCD-OPERATING-MANUAL.md` (v1.0).
**Companion:** `PCD-MANUAL-RECONCILIATION-MEMO-2026-07-13.md` holds the full 46-item adjudication and reasoning.

This is a mechanical apply. Jeff approved the change set below. Make exactly these edits, no more. Do not expand scope into Phases 4 to 10. Voice rules apply to every word added: plain language, no em dashes, no AI-tell words, three-sentence paragraph max.

---

## Jeff's approved decisions (2026-07-13)

1. **Agent growth is workflow-driven, not lean and not all-at-once.** Add an agent only when a specific workflow is being built for automation. Never speculatively, never in a batch. Each still clears the existence test and the manual-3x gate. This rejects the reviewers' roughly thirty agents and six new departments while recording Jeff's intent to grow the working set over time.
2. **Build the S4 deletion and opt-out monitor in July, before the idle.** Monitor and draft only. Deletion itself stays behind the HUMAN GATE.
3. **Add an Open Item for camp-database safety** and schedule a backup, restore, and rollback plan before the discovery pass scales.

Not decided yet, leave open, do not apply: FTC affiliate disclosure coverage, the staging destination (markdown vs Notion Review Queue), and the maintenance-mode per-task pause/degrade decision itself.

---

## Edits to make

### Edit 1: Version header

Change the version line from:
`**Version:** 1.0, 2026-07-13. Design session, first pass.`
to:
`**Version:** 1.1, 2026-07-13. Design session, first pass (v1.0), then a three-source feedback reconciliation (v1.1).`

Add directly beneath the "Governed by" line a new line:
`**v1.1 changes:** Adjudicated 46 feedback items from three external reviews (Gemini, ChatGPT review, ChatGPT full-draft rewrite). Rejected the build-the-AI-OS-now direction and the roughly thirty-agent, six-department expansion; routed the Phase 4 and 5 material to a Session Two input file. Accepted: workflow-driven agent growth, the July build of the S4 monitor, and a new Open Item for camp-database safety. Full adjudication in PCD-MANUAL-RECONCILIATION-MEMO-2026-07-13.md.`

### Edit 2: Section 4, working-set framing

Find, in the section 4 intro paragraph:
`The working set is capped at about eight agents portfolio-wide and does not grow until Jeff promotes something.`

Replace with:
`The working set is capped at about eight agents portfolio-wide and does not grow until Jeff promotes something. Promotion is workflow-driven. The set grows one agent at a time, and only when a specific workflow is being built for automation, never speculatively and never as a batch. Each new agent still clears the existence test and the manual-3x gate before it earns a row. This is the standing answer to the three external reviews that proposed roughly thirty agents and six new departments at once (Jeff's call, 2026-07-13).`

### Edit 3: S4 SOP, backing-task note

Find, at the end of the S4 SOP:
`**Backing task:** none, and that is the risk. Nothing currently monitors that inbox for a request. Building this monitor is the one PCD automation that maintenance mode does not idle (section 3.4).`

Replace with:
`**Backing task:** none yet, and that is the risk. Nothing currently monitors that inbox for a request. Building this monitor is the one PCD automation that maintenance mode does not idle (section 3.4), and it is scheduled to be built in July 2026 before the idle (Jeff's call, 2026-07-13). It is a monitor-and-draft: it watches the inbox, locates the record, and stages the deletion for Jeff. The deletion itself stays behind the HUMAN GATE, so this does not require the manual-3x clearance that an autonomous action would.`

### Edit 4: Section 5 roadmap, July block

Find, at the end of the "Now to fall camp (July, before the idle)" paragraph:
`These are the only work that moves causes 1 and 2 from the audit, and they are low effort. Nothing internal competes with them for July.`

Replace with:
`These are the only work that moves causes 1 and 2 from the audit, and they are low effort. One internal build joins them, and only one. The S4 data-deletion and opt-out monitor gets built in July before the idle, because its 30-day compliance SLA runs year-round and nothing watches the inbox today. Everything else internal still waits behind distribution.`

### Edit 5: Open Item 4, reinforcement note

Append to the end of Open Item 4:
` All three external reviews (2026-07-13) independently landed on this gap, which raises its priority for the December close.`

### Edit 6: Open Item 5, proposed inputs

Append to the end of Open Item 5:
` Two proposed inputs for that Phase 7 decision are on the table: a global PCD_MAINTENANCE_MODE toggle that idles the crons with an S4 bypass, and a per-task pause-versus-degrade matrix drafted in the ChatGPT full-draft review. The per-task call stays Jeff's before fall camp.`

### Edit 7: New Open Item 10

Add a new item after Open Item 9:
`10. **No backup, rollback, or error recovery for the camp database S7 writes to.** \`org-discovery-daily-worklist\` mutates the \`activity-radar\` D1 autonomously every day, but there is no documented backup cadence, restore path, rollback procedure, or error-recovery plan if a batch writes bad data. Site source has git backup and a git rollback path; the database a daily autonomous agent changes has neither. Because the writes are already daily, stand up a D1 backup cadence now, and document a restore-and-rollback procedure before the discovery pass scales (Jeff's call, 2026-07-13). Surfaced independently by all three external reviews.`

### Edit 8: Review log row

Add a new row to the section 8 table:
`| 2026-07-13 | Reconciliation pass, v1.1. Sources: Gemini review, ChatGPT review, ChatGPT full-draft rewrite | Adjudicated 46 items across 3 sources against the constitution. Rejected the build-the-AI-OS-now direction and the roughly thirty-agent, six-department expansion as violations of failure mode 5, the working-set cap, and section 1.4; the recursive inter-agent-handoff idea rejected under failure mode 2. Routed the Phase 4 and 5 material (prompt frames, agent spec template, Class A/B/C/D matrix, eval questions, intake taxonomy) to PCD-SESSION-TWO-INPUT-from-reviews-2026-07-13.md. Accepted: workflow-driven agent growth (section 4), the July build of the S4 monitor (S4, section 5), Open Item 5 annotation, Open Item 4 reinforcement, and new Open Item 10 for camp-database safety. Still open for Jeff: FTC disclosure coverage, the staging destination, and the maintenance-mode per-task decision. Full adjudication in PCD-MANUAL-RECONCILIATION-MEMO-2026-07-13.md. |`

---

## After the edits

1. **Create the Session Two input file** at `Outputs/parent-coach-desk/PCD-SESSION-TWO-INPUT-from-reviews-2026-07-13.md`. This is where the good Phase 4 and 5 raw material goes so it is not lost and not merged into a Phases 1-to-3 manual. Header must say clearly: deferred input for Phases 4 and 5, not adopted scope. Include, drawn from the three reviews and reconciled to the constitution:
   - The Class A/B/C/D action matrix plus the "Stage" review-queue concept (a refinement of the HUMAN GATE, not a replacement).
   - A standard agent spec template, built on the Master Plan section 7 skill-template fields, not a reinvented one.
   - The standard prompt frame and the per-SOP reasoning question sets (the GEM prompts and the CR/CD question lists).
   - The intake taxonomy and tag list.
   - The per-department eval questions.
   - Error-recovery and rollback design notes for the autonomous write path (this feeds Open Item 10 and Phase 7).
   - The maintenance-mode toggle and per-task matrix (feeds Open Item 5 and Phase 7).
   - A one-line note that the run-log schema, when built in Phase 6, uses Master Plan section 8, not the reviewers' reinvented field lists.

2. **Re-mirror** the full v1.1 manual to the Notion "PCD Operating Manual" page. If the PCD Command Center page still does not exist (it did not as of 2026-07-12 per the Organic Search Audit), mirror to the closest existing "ParentCoachDesk.com" page and flag that the Command Center page is still uncreated.

3. **Log the revision to the Field & Forge Decision Journal**, both `Outputs/Forge Command/decision-log.md` and the Notion Decision Journal. One entry, naming the three sources and the headline changes: rejected the AI-OS-now pivot and the agent/department expansion, adopted workflow-driven agent growth, scheduled the S4 monitor for July, opened the camp-database safety item.

4. **Deploy and back up** per the Deployment and Backup norms once the files are written.
