# Link earning run: parentcoachdesk.com

**Date:** 2026-09-30
**Agent:** Lonnie, run 6
**Window:** since run 5, 2026-09-23 (7 days)

---

## GSC check: unchanged, still not a real link

External links in GSC still read **Total 7**, all from parentcoachplaybook.com pointing at the homepage with anchor text "parent coach desk," the same Change-of-Address migration artifact. Freshest Links reading available this run: Nora's Class A GSC review dated 2026-09-21 (`reports/seo/gsc-review-2026-09-21.md`), nine days old, which re-confirmed External 7 and "No new third-party backlinks." Lonnie still has no Search Console UI or `pull-gsc.mjs` path in this Shell session, so the Links number is carried from that Nora capture rather than a fresh Lonnie UI click. Pattern unchanged across runs 1 through 6. No target has reached `sent`, so this could not be anything else. Per the maintenance-mode rule this does not go to Slack on its own.

---

## Ledger

| Status | Before (2026-09-23) | After (2026-09-30) |
|---|---|---|
| identified | 0 | 0 |
| researched | 12 | 15 |
| drafted | 23 | 25 |
| sent | 0 | 0 |
| replied | 0 | 0 |
| landed | 0 | 0 |
| declined | 0 | 0 |
| dead | 1 | 1 |
| **Total entries** | **36** | **41** |

WoW notes: Moved 2 researched to drafted via pitches. Added 5 new researched targets. Net researched 12 → 15; drafted 23 → 25.

No target has moved to `sent`. That is Jeff's call, always.

## Stalled: four sendable pitches now past 56 days

The 13 media/press targets in `drafted` since 2026-07-13 (79 days) remain structurally blocked: `AUTHOR_REVEALED` in `src/data/site.ts` re-confirmed `false` this run.

The real stall, flagged at 49 to 51 days last run, is now at 56 to 58 days with nothing sent:

- **WIAA Health & Wellness** — drafted 2026-08-03, 58 days.
- **Special Olympics Washington, Unified Champion Schools** — drafted 2026-08-03, 58 days.
- **Washington Youth Soccer, Concussion & SCA Awareness** — drafted 2026-08-05, 56 days.
- **Pierce County Parks and Recreation** — drafted 2026-08-05, 56 days, named contact (Lisa Welch, Recreation Supervisor).

Four finished, verified pitches sitting untouched for eight weeks. Maintenance mode: not Slacked this run (silent unless a real external link lands or the run fails). Still the highest-leverage thing in the pipeline when Jeff is ready to send.

Also past 30 days in drafted (sendable, non-reveal): Tacoma Public Schools Unified Sports (drafted 2026-09-09, 21 days, under 30), South Sound Flag Football (2026-09-09, 21 days). Metro Parks Tacoma and SOWA Pierce County (2026-09-16) at 14 days. YMCA Pierce/Kitsap and WA District 2 Little League (2026-09-23) at 7 days.

---

## New targets added (5)

All verified live this run via direct fetch. Priority stayed PNW, with one Oregon expansion.

1. **Pacific Northwest AAU** (pnaau.org, PNW, governing body). Membership hub for 35+ sports, Lystedt Law concussion forms, office email nwsports@pnaau.org. Gap: no first-season or cost explainer for AAU families. Researched, not yet pitched.
2. **Central Kitsap Soccer Club** (cksoccer.org, WA, club). 2026 Fall Rec fee table live ($145 / $175 late) for U7-U19, Silverdale PO Box. Match for first-season soccer and soccer-cost pages. Researched, not yet pitched.
3. **King County Play Equity Coalition** (kcplayequity.org, PNW, nonprofit). Live homepage with Aug 30 2026 Our Space in Sport conference at Federal Way High School; info@kcplayequity.org. Match for cost and affordability guides. Researched, not yet pitched.
4. **Spokane Parks and Recreation, Youth Sports** (my.spokanecity.org/recreation/sports/youth/, WA, facility). NFL Flag ages 5-16 plus Skyhawks camps; named contact Adriano Eva (aeva@spokanecity.org). Eastern WA parks reach beyond Puget Sound. Researched, not yet pitched.
5. **Portland Parks and Recreation, Youth Volleyball** (portland.gov/parks/sports/volleyball, PNW, facility). Fall 2026 games Sept 19-Oct 17 still listed; $165 independent fee with scholarship note; named contacts Tyler Dean and Jennifer Rounseville. Oregon expansion. Researched, not yet pitched.

Considered and skipped this run: King County Youth & Amateur Sports Grants page (grant program for orgs, weak parent-audience link target vs Play Equity). DY Sports basketball tournaments nested under PN AAU (kept under the AAU target rather than a separate club entry).

---

## Pitches drafted this run (2)

Pulled from the `researched` backlog, prioritized on named contacts and geographic tie.

- `pitch-boys-girls-clubs-south-puget-sound-youth-sports-2026-09-30.md`, targeting BGCSPS youth sports. Re-verified live: Fall 2026 soccer and volleyball still listed; Benton Lefton now published as Volunteer and Recreation Manager (leftonb@bgcsps.org). Pitch points at first-season soccer and what-youth-sports-cost. Addressed to Benton Lefton.
- `pitch-pacific-northwest-swimming-outreach-2026-09-30.md`, targeting PNS Outreach / financial assistance. Re-verified live: Outreach membership still $0 to the athlete, Barbara Weist still at diversity@pns.org. Pitch points at what-youth-sports-cost and the cost calculator for Outreach families. Addressed to Barbara Weist.

Both checked against anti-AI writing rules before saving (About Me/Anti AI Writing.txt is missing from the DESKTOP repo this run; applied the standing skill rules and prior-pitch pattern): no banned filler words, no em dashes, 3-sentence paragraph cap, coach-parent voice markers present. Sign-off stays "PCD Owner" (no public Jeff Thomas naming).

---

## Stalled or flagged

- The four idle pitches above, now 56 to 58 days old, remain the headline stall. Silent on Slack under maintenance mode.
- 13 media/press targets still gated on the November `AUTHOR_REVEALED` flip, re-confirmed `false` this run. Structural, not neglect.
- Rob Rossi's pitch still needs a rewrite for The Athletic, flagged since run 1. Still gated on the reveal regardless.
- `About Me/Anti AI Writing.txt` is not present on the DESKTOP checkout (no About Me folder). Lonnie applied skill-level rules and the established pitch voice; restore the file to the repo when convenient so future runs can read it literally.
- Backlog not yet pitched: USA Football Health & Safety, Adaptive Sports NW, ParentMap, Seattle Adaptive Sports, PNW Pop Warner, Gig Harbor Now, Seattle Parks Youth Sports, Active Youth Coalition, Washington Youth Soccer TOPSoccer, plus this run's five new targets.

## Run logging

`PCD_AGENT_RUNS_TOKEN` is still not present in the DESKTOP Shell environment. Sixth consecutive run (1 through 6) not reflected in the `agent_runs` table. Same gap Nora flagged on 2026-09-21.

## Git housekeeping

Committed with `scripts/safe-commit.sh` on `main`. Not pushed, per standing rule.

## Next run

Send is Jeff's call. The four idle pitches (WIAA, SOWA Unified Champion Schools, Washington Youth Soccer concussion page, Pierce County Parks) are eight weeks old and still the single highest-leverage thing in this pipeline. Otherwise: pitch Adaptive Sports NW, Seattle Adaptive Sports, PNW Pop Warner, Seattle Parks, Active Youth Coalition, TOPSoccer, USA Football, Gig Harbor Now (reveal-independent), ParentMap (reveal-independent), and this run's five new targets. Rewrite Rob Rossi for The Athletic. Re-check GSC for movement off 7 once a Lonnie-side GSC path exists again. Restore `About Me/Anti AI Writing.txt` to the DESKTOP repo.
