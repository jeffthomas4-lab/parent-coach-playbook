# Link earning run: parentcoachdesk.com

**Date:** 2026-08-05
**Agent:** Lonnie, run 2
**Window:** since run 1, 2026-08-03 (2 days)

---

## GSC check: unchanged, still not a real link

External links in GSC still reads **Total 7**, same as run 1, all still from parentcoachplaybook.com pointing at the homepage with anchor text "parent coach desk." Nothing moved. This is the same Change-of-Address migration signal flagged last run, not new evidence anything in this pipeline landed. No `sent` targets exist yet, so there is nothing else it could be. Per the maintenance-mode rule, this does not go to Slack again since it is not a new reading and nothing broke.

---

## Ledger

| Status | Count |
|---|---|
| identified | 0 |
| researched | 7 |
| drafted | 17 |
| sent | 0 |
| replied | 0 |
| landed | 0 |
| declined | 0 |
| dead | 1 |
| **Total** | **25** |

No target has moved to `sent`. That is Jeff's call, always.

**Staleness check:** the 13 original media/press targets have been in `drafted` since 2026-07-13, 23 days. Not flagged as a stall: every one is structurally blocked on the `AUTHOR_REVEALED` flip (target November, per `strategy/AUTHOR-REVEAL-CHECKLIST.md`), same as last run. Nothing else is over 30 days in `drafted`.

---

## New targets added (5)

Prioritized Pierce County and Puget Sound over national, per the standing brief, and closed out last run's honorable mention.

1. **Tacoma Public Schools, Unified Sports** (tacomaschools.org, WA, school). Mt. Tahoma and Lincoln both won 2026 state Unified Basketball titles; the program actively recruits students with and without intellectual disabilities. Matches unified-sports-explained and special-olympics-guide-for-parents. Researched, not yet pitched.
2. **Pierce County Parks and Recreation** (piercecountywa.gov, WA, facility). Jeff's own county. Runs the rec-level baseball, basketball, soccer, and flag football leagues families land in after pricing out travel ball, plus a Special Olympics Pierce County program. Matches PCD's cost-comparison articles and rules-at-a-glance guides directly. Pitched this run.
3. **ParentMap** (parentmap.com, PNW, press). Seattle's main regional parenting outlet, actively publishing through mid-2026, with an open editorial-submissions page. Their sports coverage is lifestyle and safety, not a coach's-eye view, which is the gap Jeff's byline fills. Researched, not yet pitched; likely also gated on the author reveal, though a reveal-independent guest-pitch angle is worth drafting later.
4. **Seattle Adaptive Sports** (seattleadaptivesports.org, PNW, nonprofit). Western Washington's leading adaptive sports org, a Move United chapter, fills the Puget Sound geographic gap next to Adaptive Sports NW (which covers Oregon and SW Washington, already in the pipeline). Researched, not yet pitched.
5. **South Sound Flag Football League** (ssffl.net, PNW, league). Real, currently active Pierce/King County flag football and cheer league. PCD's flag football library (rules for parents, first-season guide, tackle-vs-flag age guide) is a direct match for a parent registering a first-timer. Researched, not yet pitched.

Ruled out this run: Boys & Girls Clubs of South Puget Sound's youth sports page (bgcsps.org/youth-sports) looked promising but its published season dates read 2017/18, a strong signal the page itself is stale and not actively maintained even though the domain is live. Skipped rather than added on unverifiable currency. Also checked and skipped: Washington State PTA (no specific sports-facing asset to point at) and the Autism Society of Washington (page fetches returned empty content both attempts, could not verify what's actually on it this run).

---

## Pitches drafted this run (2)

- `pitch-washington-youth-soccer-concussion-awareness-2026-08-05.md`, targeting Washington Youth Soccer's Concussion & SCA Awareness page. Carried over from last run's `researched` backlog. A name (Dan Rubin) surfaced in search but wasn't confirmed against the org's own staff page, so the draft is addressed generically.
- `pitch-pierce-county-parks-recreation-2026-08-05.md`, targeting Pierce County Parks and Recreation's sports hub and Special Olympics Pierce County page. Lisa Welch, Recreation Supervisor, surfaced via the county's own staff directory as a likely contact; needs reconfirmation before sending.

Both checked against the anti-AI writing guide before saving.

---

## Stalled or flagged

- 13 media/press targets still gated on the November `AUTHOR_REVEALED` flip. Same structural blocker as last run, not neglect.
- Rob Rossi's pitch still needs a rewrite reflecting his move to The Athletic (flagged last run, untouched this run since WA governing-body and nonprofit targets are the higher priority right now).
- Still not pitched from the `researched` backlog: USA Football Health & Safety, Adaptive Sports NW (both carried from run 1), plus the three new researched targets added this run (Tacoma Public Schools Unified Sports, ParentMap, Seattle Adaptive Sports, South Sound Flag Football League).

---

## Run logging

`PCD_AGENT_RUNS_TOKEN` is still not present in this session's environment, so `scripts/agent-run-client.mjs` refused before making a network call, same failure as run 1. This run is not reflected in the `agent_runs` table. Flagging again: this needs provisioning for on-demand runs, separate from whatever the scheduled Wednesday task uses.

## Next run

Pitch the backlog: USA Football, Adaptive Sports NW, Tacoma Public Schools Unified Sports, Seattle Adaptive Sports, South Sound Flag Football League all have real assets identified and just need the pitch written. Rewrite the Rob Rossi pitch for The Athletic. Re-check GSC to see if the 7 parentcoachplaybook.com links hold, grow, or fall as the Change-of-Address migration settles. Consider whether a reveal-independent guest-contribution pitch to ParentMap is worth drafting ahead of the November flip, since it doesn't strictly require the "anonymous, now revealing" story the other 13 media pitches lean on.
