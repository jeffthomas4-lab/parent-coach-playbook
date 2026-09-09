# Link earning run: parentcoachdesk.com

**Date:** 2026-09-09
**Agent:** Lonnie, run 3
**Window:** since run 2, 2026-08-05 (35 days, longest gap yet between runs)

---

## GSC check: unchanged, still not a real link

External links in GSC still reads **Total 7**, same as runs 1 and 2. All seven are still from parentcoachplaybook.com pointing at the homepage with anchor text "parent coach desk," the same Change-of-Address migration artifact flagged twice already. Nothing moved. No target has reached `sent`, so there is no other source this could be. Per the maintenance-mode rule this does not go to Slack on its own, but see the stall below, which does.

---

## Ledger

| Status | Count |
|---|---|
| identified | 0 |
| researched | 9 |
| drafted | 19 |
| sent | 0 |
| replied | 0 |
| landed | 0 |
| declined | 0 |
| dead | 1 |
| **Total** | **29** |

No target has moved to `sent`. That is Jeff's call, always.

## Stalled: 4 ready pitches, 35+ days untouched, not blocked by anything

The 13 media/press targets sitting in `drafted` since 2026-07-13 are not the problem this run; they are structurally blocked on the November `AUTHOR_REVEALED` flip (`src/data/site.ts` line 60, re-checked live this run, still `false`), same as every prior run.

The real stall is four targets that have **no structural blocker at all** and have sat drafted for 35 to 37 days:

- **WIAA Health & Wellness** — drafted 2026-08-03, 37 days. `pitch-wiaa-health-wellness-2026-08-03.md`.
- **Special Olympics Washington, Unified Champion Schools** — drafted 2026-08-03, 37 days. `pitch-special-olympics-washington-unified-champion-schools-2026-08-03.md`.
- **Washington Youth Soccer, Concussion & SCA Awareness** — drafted 2026-08-05, 35 days. `pitch-washington-youth-soccer-concussion-awareness-2026-08-05.md`.
- **Pierce County Parks and Recreation** — drafted 2026-08-05, 35 days, has a named contact (Lisa Welch, Recreation Supervisor). `pitch-pierce-county-parks-recreation-2026-08-05.md`.

Four finished pitches to real, verified, currently-active organizations, none of them waiting on anything, sitting untouched for over a month. This is the definition of a pipeline stall per the standing rule: a drafted pitch nobody sent is not progress. These are the four most likely to land something before the media targets even become sendable in November.

---

## New targets added (4)

All PNW, all verified live via direct fetch this run, all with a specific real page and asset match, none invented.

1. **YMCA of Pierce and Kitsap Counties, Youth Sports** (ymcapkc.org, WA, facility). Runs the entry-level rec leagues, soccer, flag football, tee ball, volleyball, basketball, cheer, that most first-time PCD readers land in. Fall 2026 season confirmed live: practices started Sept 8, games run through Oct 31. Researched, not yet pitched.
2. **Washington District 2 Little League** (wad2llb.org, WA, governing body). The actual Little League district covering Pierce County, confirmed against littleleaguewa.org's own district map; District 8 (a name that surfaced in an earlier search) is King County, not Pierce. Hosting the 2026 WA State 9-11 Softball tournament at Gig Harbor Little League this July, confirmed via current front-page content. Researched, not yet pitched.
3. **Special Olympics Washington, Pierce County Area** (specialolympicswashington.org/areas/pierce-county/, WA, nonprofit). A different page from the Unified Champion Schools target already in the pipeline: this is the local area page, with a named Area Advisor, Cheyenne Terry, and an active fall recruiting need for flag football and bowling unified partners. Researched, not yet pitched.
4. **Metro Parks Tacoma, Youth Sports** (parkstacoma.gov, WA, facility). Jeff's own city. Runs rec leagues across nearly every sport PCD covers, plus a Financial Assistance program for cost-barrier families and an ADA accommodations page, both close matches for PCD's cost-comparison and adaptive content. Fall 2026 schedule confirmed current through November. Researched, not yet pitched.

Ruled out this run: South Sound Magazine (southsoundmag.com), a Tacoma lifestyle print outlet that looked promising in search results. The live site returned almost no readable content on repeated fetches, one headline about a coworking space and nothing else, no sports section, no verifiable contact page. Skipped rather than pitched on unverifiable current content, same standard applied to Boys & Girls Clubs of South Puget Sound last run.

---

## Pitches drafted this run (2)

Pulled from the `researched` backlog per last run's own next-step list, prioritized on direct geographic tie to Jeff over the rest of that backlog (USA Football, Adaptive Sports NW, ParentMap, Seattle Adaptive Sports all still open, see below).

- `pitch-tacoma-public-schools-unified-sports-2026-09-09.md`, targeting Tacoma Public Schools' Unified Sports page. Re-verified live: the page still names Mt. Tahoma's and Lincoln's 2026 state Unified Basketball titles and publishes a real contact, Athletics@tacoma.k12.wa.us, directly on the page.
- `pitch-south-sound-flag-football-league-2026-09-09.md`, targeting South Sound Flag Football League's contact form. Re-verified live (copyright 2025, GoDaddy Website Builder, working form). Correction while drafting: the flag football assets actually live at `parentcoachdesk.com/drive-there/...`, not `/articles/...` as the shorthand in the target record implied. Confirmed the real URLs by pulling live links off the site itself rather than trusting the asset shorthand; noted the correction in the target record so it doesn't get inherited wrong again.

Both checked against the anti-AI writing guide before saving: no banned words, no em dashes, 3-sentence paragraph cap, specific real details (Mt. Tahoma, Lincoln, flag pulls, sideline) standing in for generic claims.

---

## Stalled or flagged

- The four ready-and-idle pitches above are the headline stall this run and are going to Slack.
- 13 media/press targets still gated on the November `AUTHOR_REVEALED` flip, re-confirmed `false` in `src/data/site.ts` this run. Structural, not neglect.
- Rob Rossi's pitch still needs a rewrite reflecting his move to The Athletic, flagged twice now (run 1, run 2), untouched a third time. Low priority since it's also gated on the reveal, but flagging the repeat.
- Backlog still not pitched: USA Football Health & Safety, Adaptive Sports NW, ParentMap, Seattle Adaptive Sports (all carried from earlier runs), plus this run's four new targets (YMCA Pierce/Kitsap, Washington District 2 Little League, Special Olympics WA Pierce County, Metro Parks Tacoma).
- `PCD_AGENT_RUNS_TOKEN` status unknown going into this run; see Run logging below.

## Run logging

Attempted `scripts/agent-run-client.mjs` with agent name `lonnie` for both start and finish. See commit for outcome; if the token is still unprovisioned this is the third consecutive run not reflected in the `agent_runs` table, same gap flagged in runs 1 and 2.

## Next run

Send is Jeff's call, but the four idle pitches (WIAA, SOWA Unified Champion Schools, Washington Youth Soccer, Pierce County Parks) are the highest-leverage thing sitting in this pipeline right now, more than any new target Lonnie could add. Otherwise: pitch USA Football, Adaptive Sports NW, ParentMap, Seattle Adaptive Sports, and this run's four new WA targets from the `researched` backlog. Rewrite the Rob Rossi pitch for The Athletic. Re-check GSC for movement off 7. Reconsider whether South Sound Magazine is worth a second look once its site actually renders content, or whether to drop it from consideration entirely.
