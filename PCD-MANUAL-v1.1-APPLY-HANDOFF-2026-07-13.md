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
4. **FTC affiliate disclosure is confirmed covered on the site (2026-07-13).** Per-page `BuyingGuideDisclosure` component (cites FTC 16 CFR Part 255, renders above the first affiliate link), auto-shown by `ArticleLayout` on any article with a `/go/` link, plus inline gear-card lines, a sitewide footer backstop, and a `/disclosure/` page. STANDARD-AUDIT legal pillar marked fixed. No manual edit needed for pages. The only residual is the newsletter; the manual already governs email affiliate links in S10.
5. **Staging destination: the existing Slack channel is the single place Jeff checks.** Staged drafts and reports post a notification to that channel with a link to the markdown draft. Not Notion, not scattered local files. One place, links out to the file. This resolves the staging question (GEM-13).
6. **Maintenance mode: during the fall idle, everything runs maintenance-only.** Every PCD scheduled task pauses or degrades to report-only, no writes, no active build work, including S7's autonomous camp writes. The only exceptions are the year-round S4 watch and the critical escalations (lapsed domain, failed payment, uptime, security). This resolves Open Item 5.

All escalations from the memo are now decided. Nothing is left open.

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

### Edit 6: Open Item 5, resolved

Find Open Item 5:
`5. **Maintenance-mode pause-versus-degrade is undecided per task.** Section 3.4 names the idle but not which of the ten tasks pause fully and which degrade to report-only. Decide before fall camp.`

Replace with:
`5. **Maintenance-mode rule (resolved 2026-07-13).** During the fall idle every PCD scheduled task runs maintenance-only: it pauses or degrades to report-only, with no writes and no active build work, S7's autonomous camp writes included. The only exceptions are the year-round S4 deletion watch and the critical escalations (lapsed domain, failed payment, uptime, security). The mechanism (a global PCD_MAINTENANCE_MODE toggle with an S4 bypass) is a Phase 7 build item; the ChatGPT per-task matrix is kept as reference in the Session Two input file.`

### Edit 9: Section 3.4, encode the maintenance-only rule

Find, in section 3.4:
`What pauses: the editorial pipeline, the Friday Letter, seasonal planning, the SEO fix work, and the camp discovery build-out. During the idle these scheduled tasks either pause or degrade to report-only, which is a task-by-task call to make before camp starts (Open Item 5).`

Replace with:
`During the idle every PCD scheduled task runs maintenance-only: it pauses or degrades to report-only, with no writes and no active build work. That includes the editorial pipeline, the Friday Letter, seasonal planning, the SEO fix work, the camp discovery build-out, and S7's autonomous camp writes, which stop for the season (Jeff's call, 2026-07-13, resolving Open Item 5).`

### Edit 7: New Open Item 10

Add a new item after Open Item 9:
`10. **No backup, rollback, or error recovery for the camp database S7 writes to.** \`org-discovery-daily-worklist\` mutates the \`activity-radar\` D1 autonomously every day, but there is no documented backup cadence, restore path, rollback procedure, or error-recovery plan if a batch writes bad data. Site source has git backup and a git rollback path; the database a daily autonomous agent changes has neither. Because the writes are already daily, stand up a D1 backup cadence now, and document a restore-and-rollback procedure before the discovery pass scales (Jeff's call, 2026-07-13). Surfaced independently by all three external reviews.`

### Edit 8: Review log row

Add a new row to the section 8 table:
`| 2026-07-13 | Reconciliation pass, v1.1. Sources: Gemini review, ChatGPT review, ChatGPT full-draft rewrite | Adjudicated 46 items across 3 sources against the constitution. Rejected the build-the-AI-OS-now direction and the roughly thirty-agent, six-department expansion as violations of failure mode 5, the working-set cap, and section 1.4; the recursive inter-agent-handoff idea rejected under failure mode 2. Routed the Phase 4 and 5 material (prompt frames, agent spec template, Class A/B/C/D matrix, eval questions, intake taxonomy) to PCD-SESSION-TWO-INPUT-from-reviews-2026-07-13.md. Accepted: workflow-driven agent growth (section 4), the July build of the S4 monitor (S4, section 5), Open Item 4 reinforcement, new Open Item 10 for camp-database safety, and the resolution of Open Item 5 (fall idle runs maintenance-only). Jeff's other calls (2026-07-13): FTC disclosure confirmed covered on the site, and staged drafts surface in the existing Slack channel with a link to the markdown, one place to check. Full adjudication in PCD-MANUAL-RECONCILIATION-MEMO-2026-07-13.md. |`

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
   - The staging convention (Jeff's call, 2026-07-13): staged drafts and reports post to the existing Slack channel with a link to the markdown draft, so there is one place to check. Notion Review Queue and scattered local files are both out.

2. **Re-mirror** the full v1.1 manual to the Notion "PCD Operating Manual" page. If the PCD Command Center page still does not exist (it did not as of 2026-07-12 per the Organic Search Audit), mirror to the closest existing "ParentCoachDesk.com" page and flag that the Command Center page is still uncreated.

3. **Log the revision to the Field & Forge Decision Journal**, both `Outputs/Forge Command/decision-log.md` and the Notion Decision Journal. One entry, naming the three sources and the headline changes: rejected the AI-OS-now pivot and the agent/department expansion, adopted workflow-driven agent growth, scheduled the S4 monitor for July, opened the camp-database safety item, resolved the fall idle to maintenance-only, confirmed FTC disclosure is covered on the site, and set Slack as the single staging surface.

4. **Deploy and back up** per the Deployment and Backup norms once the files are written.
