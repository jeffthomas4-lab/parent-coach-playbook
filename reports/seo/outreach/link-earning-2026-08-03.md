# Link earning run: parentcoachdesk.com

**Date:** 2026-08-03
**Agent:** Lonnie, run 1 (first run; `targets.json` did not exist before this session)
**Window:** N/A, no prior run to diff against

---

## The headline: External links is no longer 0

GSC's Links report for sc-domain:parentcoachdesk.com now shows **External links: Total 7**, checked live via browser this run. Every prior review (this file's own read-before-every-run source, `ORGANIC-SEARCH-AUDIT.md`, and the most recent `gsc-review-2026-07-28.md`) had this at zero since the property was created June 10, 2026.

Read the source before celebrating: all 7 links come from **parentcoachplaybook.com**, the retired predecessor domain that GSC shows mid-Change-of-Address migration, all pointing at the homepage with anchor text "parent coach desk." This is not a third-party site vouching for PCD. It is the old domain's own migration signal to the new one. It did not come from anything in this pipeline; nothing in `targets.json` has moved past `drafted` or `researched`, and Jeff has not sent anything yet.

It is still the first non-zero reading GSC has ever shown for this property, and per the standing brief that is the trigger to flag it, so it is going to Slack as a needs-you item with that context attached. Worth confirming whether Google credits Change-of-Address migration links the same way it credits an independent backlink, or whether this reading changes once the CoA finishes and the old domain's data ages out.

---

## Ledger, first count

| Status | Count |
|---|---|
| identified | 0 |
| researched | 4 |
| drafted | 15 |
| sent | 0 |
| replied | 0 |
| landed | 0 |
| declined | 0 |
| dead | 1 |
| **Total** | **20** |

No target has moved to `sent` yet; that step is Jeff's, always.

---

## What changed this run

`targets.json` did not exist. Built it by migrating the 15 targets from `reports/seo/outreach-batch-1-2026-07-13.md` into the schema, then verified every URL live and corrected what had gone stale in three weeks:

- **Target 3** (Francoeur/Lee/Williams): the original entry named the show "Play Fearless," which does not exist with these three hosts. The real show is **The Pure Athlete Podcast**. Corrected the name and URL; the existing pitch text still reads fine since it never named the show directly, but the subject line needs the correct name before it goes out.
- **Target 10** (Rob Rossi): no longer at the Pittsburgh Tribune-Review. He is now a Senior Writer at **The Athletic**, covering the Penguins and Pittsburgh sports. The drafted pitch leans on his old "Brain Waves" column, and whether that angle survived the move to The Athletic is unverified, so this target moved back from `drafted` to `researched` pending a rewrite.
- **Target 11** (Missy Isaacson / ESPNw): ESPNw folded into espn.com years ago and Isaacson has not written there since 2017. Marked **dead**. She now appears to freelance under her own site if the girls'/women's-sports angle is worth re-scoping later.
- **Targets 12-13** (regional press): found the actual current beat reporters. Jon Manley at The News Tribune (Tacoma), Nathan Joyce at The Seattle Times. Both moved to `drafted` with names ready to drop into the placeholder once send date approaches; both should be reconfirmed close to send since desk staffing turns over.
- **Targets 1, 2, 4-9, 14, 15**: verified live, unchanged otherwise.

**Standing blocker on all 15 media/press targets:** every pitch in this batch is written around the "anonymous author, now revealing" story. `AUTHOR_REVEALED` in `src/data/site.ts` is still `false`, with a target reveal date of November per `strategy/AUTHOR-REVEAL-CHECKLIST.md`. None of these 15 can send before that flips and the `[REVEAL DATE]` placeholders get filled. That is a real gate, not neglect, so none of them count as a stall even though they have sat in `drafted` since July 13.

---

## New targets added (5)

Prioritized Pacific Northwest and the governing bodies PCD already cites, per the standing brief.

1. **WIAA Health & Wellness** (wiaa.com/health-wellness, WA, governing_body). Their page is the state-mandated hub for heat, cardiac, and concussion protocols; PCD's parent-facing safety content (heat-cramps-protocol, AED-location-field-readiness) is a plain-language companion to it. Pitched this run.
2. **Washington Youth Soccer, Concussion & Sudden Cardiac Arrest Awareness** (washingtonyouthsoccer.org, WA, governing_body). Built to walk parents through WA's HB 1824/SB 5083 compliance; currently links only to legal PDFs. Matches PCD's soccer rules guide and safety content. Researched, not yet pitched.
3. **Special Olympics Washington, Unified Champion Schools** (specialolympicswashington.org, WA, nonprofit). Actively recruits schools and families into the program each year. Matches PCD's unified-sports-explained and special-olympics-guide-for-parents. Pitched this run.
4. **USA Football, Health & Safety** (usafootball.com/health-safety, national, governing_body). Central youth-football safety hub; matches PCD's football rules guide and safety content. Researched, not yet pitched. Ranked below the three WA targets since it is national, not PNW.
5. **Adaptive Sports NW** (adaptivesportsnw.org, PNW, nonprofit). Serves parents of kids with physical/visual disabilities researching sport options, matching PCD's adaptive-sports guides. Researched, not yet pitched.

Honorable mention, not added as a full target: Tacoma Public Schools' own Unified Sports page, a WA school-athletics-department fit for the same unified-sports assets. Worth adding next run.

Ruled out: commercial youth-sports franchises (e.g. i9 Sports Puget Sound) surfaced in the search but were excluded as link-exchange-adjacent rather than genuine editorial fits.

---

## Pitches drafted this run (2)

- `pitch-wiaa-health-wellness-2026-08-03.md`, targeting WIAA's Health & Wellness team. No named contact found; Jeff needs to find the actual staff contact before sending.
- `pitch-special-olympics-washington-unified-champion-schools-2026-08-03.md`, targeting SOWA's Unified Champion Schools program. Same gap: no named contact yet.

Both checked against the anti-AI writing guide before saving.

---

## Stalled or flagged

- 15 media/press targets structurally blocked on the November `AUTHOR_REVEALED` flip. Not a stall, a scheduled gate. Revisit once the flip date is set.
- Target 10 (Rob Rossi) needs a rewritten pitch reflecting his move to The Athletic before it goes back to `drafted`.
- Target 11 (Missy Isaacson) is dead as originally scoped; could be re-opened as a pitch to her personal site if the girls'/women's-sports angle still matters.

---

## Run logging

Could not POST start/finish to `/api/agent-runs`: `PCD_AGENT_RUNS_TOKEN` was not present in this session's environment, so `scripts/agent-run-client.mjs` refused before making a network call (credential check fails closed, by design). This run is not reflected in the `agent_runs` table. Worth checking whether the token needs provisioning for on-demand runs specifically, separate from the scheduled Wednesday task.

## Next run

Pitch the 3 remaining researched WA/national governing-body and nonprofit targets (Washington Youth Soccer, USA Football, Adaptive Sports NW). Find named contacts for the two pitches drafted this run. Consider adding Tacoma Public Schools' Unified Sports page. Re-check GSC External links to see if the 7 from parentcoachplaybook.com holds, grows, or is a migration artifact that settles back toward zero.
