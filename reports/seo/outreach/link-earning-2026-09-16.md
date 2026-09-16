# Link earning run: parentcoachdesk.com

**Date:** 2026-09-16
**Agent:** Lonnie, run 4
**Window:** since run 3, 2026-09-09 (7 days)

---

## GSC check: unchanged, still not a real link

External links in GSC still reads **Total 7**, checked live this run. All seven are still from parentcoachplaybook.com pointing at the homepage with anchor text "parent coach desk," the same Change-of-Address migration artifact flagged in every run so far. Internal links read 966. Nothing has moved off 7 since the property was created. No target has reached `sent`, so this could not be anything else. Per the maintenance-mode rule this does not go to Slack on its own.

---

## Ledger

| Status | Count |
|---|---|
| identified | 0 |
| researched | 11 |
| drafted | 21 |
| sent | 0 |
| replied | 0 |
| landed | 0 |
| declined | 0 |
| dead | 1 |
| **Total** | **33** |

No target has moved to `sent`. That is Jeff's call, always.

## Stalled: same four pitches, now past 40 days

The 13 media/press targets in `drafted` since 2026-07-13 (65 days) are still not the problem: `AUTHOR_REVEALED` in `src/data/site.ts` is re-confirmed `false` this run, same structural block as every prior run.

The real stall, flagged last run at 35 to 37 days, is now at 42 to 44 days with nothing sent:

- **WIAA Health & Wellness** — drafted 2026-08-03, 44 days.
- **Special Olympics Washington, Unified Champion Schools** — drafted 2026-08-03, 44 days.
- **Washington Youth Soccer, Concussion & SCA Awareness** — drafted 2026-08-05, 42 days.
- **Pierce County Parks and Recreation** — drafted 2026-08-05, 42 days, named contact (Lisa Welch, Recreation Supervisor).

Four finished, verified pitches sitting untouched for six weeks is a bigger stall than last run's flag, not a smaller one. This goes to Slack.

---

## New targets added (4)

All verified live this run via direct browser render, not just a search snippet. Priority stayed PNW and WA per the standing brief.

1. **Pacific Northwest Region Pop Warner** (pnwpopwarner.org, PNW, governing body). Regional governing body for Pop Warner tackle football and cheer across WA, OR, AK, and MT. Site is heavy on Hall of Fame and All-American news, copyright 2026, but has no parent-facing explainer on tackle-vs-flag age decisions, a real match for PCD's football library. Internal sub-pages (Locations, Our Staff) would not resolve past the homepage on repeated navigation, a CMS quirk rather than a dead site. Researched, not yet pitched.
2. **Boys & Girls Clubs of South Puget Sound, Youth Sports** (bgcsps.org, WA, facility). Ruled dead on 2026-08-05 for showing stale 2017/18 season dates. Reversed that call this run: the page's top-level fetch still renders as an empty shell, but the rendered site confirms a live Fall 2026 Soccer League with registration through Sept 21, 2026. Ten sites across Pierce, Kitsap, and Mason counties. Researched, not yet pitched.
3. **Pacific Northwest Swimming, Outreach (Financial Assistance)** (pns.org, WA governing body). The USA Swimming LSC covering western Washington. Its Outreach program waives membership and meet fees for swimmers below 250% of the federal poverty line, a direct match for PCD's cost-comparison and swim content. Named contact: Barbara Weist, PNS Diversity, Equity & Inclusion Vice Chair. Copyright 2026, confirmed live. Researched, not yet pitched.
4. **Gig Harbor Now, sports desk** (gigharbornow.org, PNW, press). Hyperlocal nonprofit newsroom a few miles from campus, publishing through June 2026 (Sports Beat all-league selections, byline Dennis Browne, June 12). Unlike the 13 national media targets, this one does not need to wait on the author reveal since the angle is local-coach-as-resource, not the anonymous-to-named story. Researched, not yet pitched; the pitch template needs a rewrite from the reveal-dependent version before drafting.

Considered and skipped this run: Washington State Wrestling Association (washingtonstatewrestling.com). Site is live but its featured content, the schedule note and the club rankings table, is dated to the 2024-25 season with no visible 2026 update. Skipped on unverifiable currency rather than added on a stale front page, same standard as the Boys & Girls Clubs call in run 2 and South Sound Magazine in run 3.

---

## Pitches drafted this run (2)

Pulled from the `researched` backlog, prioritized on direct geographic tie to Jeff (his own city, his own county) over the rest of the backlog.

- `pitch-metro-parks-tacoma-youth-sports-2026-09-16.md`, targeting Parks Tacoma's youth sports hub. Re-verified live: fall 2026 baseball/softball, basketball, and volleyball registration windows all current. Checked the Coaching Information and Opportunities section directly this run per last run's own note; still no individual name published, so the pitch is addressed generically through the site's contact page.
- `pitch-special-olympics-washington-pierce-county-2026-09-16.md`, targeting the Pierce County area page. Re-verified live: Cheyenne Terry still published as Area Advisor at Cterry@sowa.org, flag football and bowling Unified partner recruiting still listed. Addressed to her directly.

Both checked against the anti-AI writing guide before saving: no banned words, no em dashes, 3-sentence paragraph cap, specific real details (Verlo Playfield, Sept 21 registration deadline, flag football and bowling) standing in for generic claims.

---

## Stalled or flagged

- The four idle pitches above, now 42 to 44 days old, are the headline stall and go to Slack.
- 13 media/press targets still gated on the November `AUTHOR_REVEALED` flip, re-confirmed `false` this run. Structural, not neglect.
- Rob Rossi's pitch still needs a rewrite reflecting his move to The Athletic, flagged in runs 1 through 3, untouched a fourth time. Still gated on the reveal regardless, so low priority, but the repeat count is climbing.
- Backlog not yet pitched: USA Football Health & Safety, Adaptive Sports NW, ParentMap, Seattle Adaptive Sports, YMCA of Pierce and Kitsap Counties, Washington District 2 Little League, plus this run's four new targets (PNW Pop Warner, Boys & Girls Clubs of South Puget Sound, Pacific Northwest Swimming Outreach, Gig Harbor Now).

## Run logging

Attempted `scripts/agent-run-client.mjs` with agent name `lonnie` for both start and finish. See commit for outcome.

## Next run

Send is Jeff's call, but the four idle pitches (WIAA, SOWA Unified Champion Schools, Washington Youth Soccer, Pierce County Parks) are six weeks old now and the single highest-leverage thing in this pipeline. Otherwise: pitch USA Football, Adaptive Sports NW, ParentMap, Seattle Adaptive Sports, YMCA Pierce/Kitsap, Washington District 2 Little League, and this run's four new targets from the `researched` backlog. Write a reveal-independent pitch template for Gig Harbor Now (and reconsider whether ParentMap needs the same treatment). Rewrite the Rob Rossi pitch for The Athletic. Re-check GSC for movement off 7.
