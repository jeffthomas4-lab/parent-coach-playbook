# Link earning run: parentcoachdesk.com

**Date:** 2026-09-23
**Agent:** Lonnie, run 5
**Window:** since run 4, 2026-09-16 (7 days)

---

## GSC check: unchanged, still not a real link

External links in GSC still read **Total 7**, all from parentcoachplaybook.com pointing at the homepage with anchor text "parent coach desk," the same Change-of-Address migration artifact. Freshest Links reading this run: Nora's Class A GSC review dated 2026-09-21 (`reports/seo/gsc-review-2026-09-21.md`), two days old, which re-confirmed External 7 and "No new third-party backlinks." Lonnie had no Search Console UI or `pull-gsc.mjs` path in this Shell session, so the Links number is carried from that Nora capture rather than a fresh Lonnie UI click. Pattern is unchanged across runs 1 through 5. No target has reached `sent`, so this could not be anything else. Per the maintenance-mode rule this does not go to Slack on its own.

---

## Ledger

| Status | Before (2026-09-16) | After (2026-09-23) |
|---|---|---|
| identified | 0 | 0 |
| researched | 11 | 12 |
| drafted | 21 | 23 |
| sent | 0 | 0 |
| replied | 0 | 0 |
| landed | 0 | 0 |
| declined | 0 | 0 |
| dead | 1 | 1 |
| **Total entries** | **33** | **36** |

WoW notes: removed one duplicate `special-olympics-washington-pierce-county` researched row left behind when that target moved to drafted last run (unique ids now 36). Moved 2 researched to drafted via pitches. Added 4 new researched targets. Net researched 11 → 12; drafted 21 → 23.

No target has moved to `sent`. That is Jeff's call, always.

## Stalled: four sendable pitches now past 49 days

The 13 media/press targets in `drafted` since 2026-07-13 (72 days) remain structurally blocked: `AUTHOR_REVEALED` in `src/data/site.ts` re-confirmed `false` this run.

The real stall, flagged at 42 to 44 days last run, is now at 49 to 51 days with nothing sent:

- **WIAA Health & Wellness** — drafted 2026-08-03, 51 days.
- **Special Olympics Washington, Unified Champion Schools** — drafted 2026-08-03, 51 days.
- **Washington Youth Soccer, Concussion & SCA Awareness** — drafted 2026-08-05, 49 days.
- **Pierce County Parks and Recreation** — drafted 2026-08-05, 49 days, named contact (Lisa Welch, Recreation Supervisor).

Four finished, verified pitches sitting untouched for seven weeks. Maintenance mode: not Slacked this run (silent unless a real external link lands or the run fails). Still the highest-leverage thing in the pipeline when Jeff is ready to send.

---

## New targets added (4)

All verified live this run via direct fetch. Priority stayed PNW and WA.

1. **Pacific Northwest Swimming, Outreach (Financial Assistance)** (pns.org, WA, governing body). Reported as added on 2026-09-16 but was missing from `targets.json` after that commit. Re-verified and restored this run: free outreach membership under 250% FPL, meet-entry and training offsets, named contact Barbara Weist (diversity@pns.org), copyright 2026. Researched, not yet pitched.
2. **Seattle Parks and Recreation, Youth Sports** (seattle.gov/parks/sports/youth-sports, PNW, facility). Citywide Athletics with live 2026 windows: Track and Field $95 (Apr 18-May 23), Volleyball $95 (fall), Basketball $150 (Jan-Mar). Financial-aid note and PKS_CYA@seattle.gov published on page. Researched, not yet pitched.
3. **Active Youth Coalition** (activeyouthcoalition.com, WA, nonprofit). South Pierce County access coalition (Bethel and Franklin Pierce districts). Cross-referenced from Pierce County Parks' free T-ball/coach pitch page as the funding partner. Researched, not yet pitched.
4. **Washington Youth Soccer, TOPSoccer** (washingtonyouthsoccer.org/programs/topsoccer/, WA, governing body). Distinct from the existing WYS concussion target: disability/outreach soccer, 23 local programs, Tacoma listed. Match for PCD adaptive and Special Olympics guides. Researched, not yet pitched.

Considered and skipped this run: Bellevue Parks and Federal Way youth sports URLs (404 on the candidates tried). Wisconsin Youth Soccer (wrong state). City of Tacoma "Tacoma Sports" URL resolved to a generic city homepage with no youth-sports program content.

---

## Pitches drafted this run (2)

Pulled from the `researched` backlog, prioritized on direct geographic tie and a named contact.

- `pitch-ymca-pierce-kitsap-youth-sports-2026-09-23.md`, targeting the YMCA Pierce/Kitsap youth sports hub. Re-verified live: fall games Sept 26-Oct 31 still listed; registration noted as ended. Pitch points at first-season soccer and the what-youth-sports-cost calculator. Addressed generically (phone only).
- `pitch-washington-district-2-little-league-2026-09-23.md`, targeting WA District 2 Little League. Re-verified live: Pat Ryan still published as District Administrator at Pat.Ryan@WAD2LLB.org; 2026 state 9-11 softball at Gig Harbor still featured. Pitch points at first-season softball and how-much-does-youth-baseball-cost. Addressed to Pat Ryan.

Both checked against the anti-AI writing guide before saving: no banned words, no em dashes, 3-sentence paragraph cap, specific real details (Oct 31 games, Gig Harbor state tournament) standing in for generic claims. Sign-off stays "PCD Owner" (no public Jeff Thomas naming).

---

## Stalled or flagged

- The four idle pitches above, now 49 to 51 days old, remain the headline stall. Silent on Slack under maintenance mode.
- 13 media/press targets still gated on the November `AUTHOR_REVEALED` flip, re-confirmed `false` this run. Structural, not neglect.
- Rob Rossi's pitch still needs a rewrite for The Athletic, flagged since run 1. Still gated on the reveal regardless.
- Housekeeping: duplicate SOWA Pierce County researched row removed this run.
- Backlog not yet pitched: USA Football Health & Safety, Adaptive Sports NW, ParentMap, Seattle Adaptive Sports, PNW Pop Warner, Boys & Girls Clubs of South Puget Sound, Gig Harbor Now, plus this run's four new targets.

## Run logging

`PCD_AGENT_RUNS_TOKEN` is still not present in the DESKTOP Shell environment. `node scripts/agent-run-client.mjs preflight` failed with "PCD_AGENT_RUNS_TOKEN is not available in the runtime secret environment." Fifth consecutive run (1 through 5) not reflected in the `agent_runs` table. Same gap Nora flagged on 2026-09-21.

## Git housekeeping

Committed with `scripts/safe-commit.sh` on `main`. Not pushed, per standing rule.

## Next run

Send is Jeff's call. The four idle pitches (WIAA, SOWA Unified Champion Schools, Washington Youth Soccer concussion page, Pierce County Parks) are seven weeks old and still the single highest-leverage thing in this pipeline. Otherwise: pitch USA Football, Adaptive Sports NW, Seattle Adaptive Sports, YMCA is done, WA District 2 is done, Boys & Girls Clubs SPS, PNW Pop Warner, ParentMap (reveal-independent angle), Gig Harbor Now (reveal-independent), and this run's four new targets. Rewrite Rob Rossi for The Athletic. Re-check GSC for movement off 7 once a Lonnie-side GSC path exists again.