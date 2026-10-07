# Freshness Audit: 2026 Q4

Run date: 2026-10-05 (scheduled S11, quarterly day 5)
Machine: DESKTOP, repo HEAD b101c5c7 (main, up to date with origin)
Mode: report only. No content was edited, nothing committed, nothing deployed.

## What was checked

- 1,288 files across `articles` (890), `body` (177), `guides` (37), `recruiting` (29), `pathways` (26), `decisions` (26), `rules` (22), `seasonCalendars` (28), `adaptive` (18), `resources` (18), `pillar` (17). 1,282 are live (`draft` not true).
- `factCheckGoodThrough`: present on 140 live pieces. 0 lapsed. 6 lapse before 2027-01-05.
- Seasonal phrasing ("this spring", "this summer", and similar) and dated-season references.
- Every rules-watch report from 2026-07-07 through 2026-09-28 (`reports/rules-watch/`), cross-checked against live text.
- Q3 audit fixes (`reports/freshness/FRESHNESS_AUDIT_2026-Q3.md`) re-grepped for regressions.
- Dead links: all 47 entries in `imports/DEAD-LINKS-LOG.md` matched against content, then a live HTTP spot-check of 80 outbound links and 67 `/go/` affiliate links on 16 high-traffic hubs.

Ranking note: GSC has no usable page-level traffic yet (57 pages indexed, about 1 click a week as of the 2026-09-21 review), so "traffic potential" here means sport-hub status, internal references across the repo, affiliate-link density, and cornerstone status (pillar guides).

## Tier 1: wrong or safety-relevant claims (fix first)

1. **Pre-House-settlement scholarship math is still live on the pillar guides and four recruiting articles.** Q3 fixed `recruiting/*.md` but missed these. They now contradict the site's own recruiting pages (roster-limit model since July 2025).
   - `pillar/ultimate-parent-guide-baseball.md:189` (11.7 split among 35+), `-basketball.md:156` (13 per team), `-football.md:195` (FBS 85), `-softball.md:150` (12), `-volleyball.md:153` (up to 12), `-lacrosse.md:160` (12.6 / 12), `-hockey.md:161` (18), `-gymnastics.md:149` (12), `-swimming.md:167` (9.9 / 9.9), `-wrestling.md:180` (9.9)
   - `articles/baseball-recruiting-what-parents-need-to-know.md:48`, `articles/softball-recruiting-what-parents-need-to-know.md:48`, `articles/volleyball-recruiting-what-parents-need-to-know.md:50`
   - Pillars carry 2 to 13 affiliate links each. One shared callout pattern (copy the wording from `recruiting/baseball.md:38`) fixes all of them.
2. **Hockey neck guard framed as optional.** `articles/what-you-actually-need-for-first-year-hockey.md:78` ("Some leagues require it... You decide based on your kid's risk tolerance") and `:90` ("Neck guard (if required)"). USA Hockey has required neck laceration protection for youth players since Aug 2024 (confirmed in RULES_2026-07-14). Contradicts `body/hockey-equipment-safety.md:40`. Safety claim, actively wrong: **urgent**.
3. **Soccer goalkeeper hold time.** `rules/soccer.md:53` says 6 seconds. IFAB Law 12 moved to 8 seconds (corner kick) for 2025-26, and NFHS adopted 6 to 8 for 2026-27 (RULES_2026-07-28). `rules/soccer.md` is a top hub (116 repo references); its `factCheckGoodThrough: 2027-05-01` did not catch this.
4. **Texas WBGT framed as optional.** `body/humidity-dew-point-practice-modifiers.md:109-119` lists Texas under programs that "should invest in a WBGT reader." UIL now requires WBGT (RULES_2026-08-11 flagged it; still unfixed).
5. **Girls' lacrosse mouthguard color rule, unconfirmed.** `articles/girls-lacrosse-goggles-and-stick-rules.md:36` says high school mouthguards "can't be clear or white." 2026 changes dropped the color rule on the boys' side; the girls' side was never confirmed (RULES_2026-07-07). Needs Jeff's call or a primary-source check, not a guess.

## Tier 2: lapsing fact-checks, dated figures, real dead link

6. `guides/baseball.md` (good through 2027-01-01). The biggest hub on the site (153 repo references, 31 `/go/` links). Re-verify bat standards and prices for the 2027 season before January. Pair with `articles/usa-vs-usssa-bats.md` (also 2027-01-01).
7. `body/youth-wrestling-safety-briefing.md` lapses **2026-10-15**, ten days out, just ahead of wrestling season. Text already reflects the 19% female body-fat floor; this is a re-verify and date bump.
8. `pillar/ultimate-parent-guide-volleyball.md:107-111` describes a single libero. NFHS allows two liberos per set for 2026-27 (RULES_2026-09-08). Still true for most club play, so a one-line add, not a rewrite.
9. `articles/how-much-does-competitive-cheer-cost.md:36` cites "2025-26 season" fee sheets. The 2026-27 all-star season is underway; refresh the figures or the year label.
10. `recruiting/nil-basics-for-hs.md` (2026-12-31). State count drifts; recheck the ~41 figure and restricted list.
11. `articles/youth-sports-costs.md` (2026-12-31) and `articles/youth-hockey-recruiting-guide.md` (2026-12-01).
12. Real dead link: `body/recovery-basics.md` cites the 2009 NSCA youth resistance training position statement at a journals.lww.com URL that 404s. It has been in DEAD-LINKS-LOG since 2026-05-06 and is still live.

## Tier 3: carryovers and low priority

13. Still open from Q3: `guides/video-tracking-gear.md:53` ("current base HERO"), `guides/recovery-gear.md:71` ("$300 Theragun"), and the sport-by-sport NCAA contact-period pass across ~15 recruiting files.
14. `articles/what-has-to-be-signed-before-football-practice.md:34` says "Practice opens August 19 under WIAA rules this year." Fine now; refresh next July.
15. 13 live pieces use "this spring" or "this summer." All read as evergreen scenarios or anecdotes (spring-sport intros, summer-planning pieces). No action.

## Verified clean

- No lapsed `factCheckGoodThrough` dates anywhere.
- Q3 fixes held: 0 hits for the old SafeSport number (720-531-0340), "US Lacrosse"/uslacrosse.org, or "35 states" NIL. Female wrestling 12% figure is corrected in both files.
- Link spot-check: all 67 `/go/` links return 302. 77 of 80 outbound links resolve; the 3 misses (naia.org, publications.aap.org, on3.com) are 403 bot blocks, not dead pages.
- The other 37 DEAD-LINKS-LOG matches in content are the same 403 bot-block pattern (AAP Pediatrics, Royal Academy of Dance, USGA, TeamManager help). Not dead for readers.

## Run notes

- Maintenance mode is off (`PCD_MAINTENANCE_MODE` false, per RULES_2026-09-28), so S11 would normally let Ed draft the top 1 to 3 rewrites. This routine is set to report-only, so nothing was drafted. Items 1 to 3 are the drafting candidates if Jeff wants them.
- `writeAgentRun()` not called: `PCD_AGENT_RUNS_TOKEN` is not in the DESKTOP runtime environment.
- The routine's saved prompt still points at the retired Claude Scheduled path; the in-repo S11 procedure (`automation/agents/ed/SKILL.md`) was used instead.
