# Seasonal Content Plan — August 2026

**Run date:** 2026-08-03 (monthly, on-the-1st cadence — this run landed the 3rd)
**Window:** next 60 days, 2026-08-03 → 2026-10-02. Season calendar files are month-granularity only (no day-level dates), so the window is applied as full calendar months **Aug–Oct 2026**, which slightly overshoots 60 days into early October. Flagged where relevant.
**Repo path used:** `Field and Forge/parent-coach-desk` (the task brief's literal path, `Outputs/parent-coach-desk`, doesn't exist as a git repo with `src/content/seasonCalendars` — this is the only repo on disk with that directory and with the matching `reports/friday-letters`, `reports/social`, `reports/camps` structure, so it's treated as the intended target. Worth a one-line confirmation from Jeff if a different repo was meant.)
**Scope:** report only. No content, pages, or metadata were edited.

---

## Method

Read all 28 files in `src/content/seasonCalendars/`. For each, checked the Aug/Sep/Oct entries for `intensity: peak` or an explicit tryout, registration, season-opener, tournament, or camp-signup event. 22 of 28 sports clear that bar in some form; 16 clear it strongly (real, current-season action in the window) and 6 clear it only on a minor/optional note (e.g., optional fall ball, a secondary club's tryouts). 6 sports are dormant through the whole window and are excluded.

Sport hub pages and gear guides are both keyed off the `sport` slug in `src/data/site.ts` (`/sports/[slug]/` and `/what-to-buy/[slug]/`), not off the season-calendar filename — several calendar files share one hub (e.g. `hs-soccer-fall` and `year-round-ecnl-soccer` both roll up to `/sports/soccer/`).

---

## In-window sports — Tier 1 (real, current-season action Aug–Oct)

| Sport (calendar file) | Window event(s) | Hub | Gear guide | Articles (3–5) |
|---|---|---|---|---|
| **Football** — `hs-football-fall-pnw.md` | Practice opens Aug (WIAA date), Week 1 game Sep, homecoming/league play Oct | `/sports/football/` | `/what-to-buy/football/` (pub 2026-03-09) | `first-season-of-youth-football`, `football-recruiting-what-parents-need-to-know`, `youth-football-off-season-training-guide`, `football-highlight-film-that-gets-watched` |
| **Soccer** — `hs-soccer-fall.md` (boys HS) + `year-round-ecnl-soccer.md` (girls ECNL) | Two-a-days/first practice Aug, season opener + ECNL fall league Sep, standings/showcase Oct | `/sports/soccer/` | `/what-to-buy/soccer/` (pub 2026-02-09) | `varsity-soccer-tryouts-the-real-odds`, `first-season-of-youth-soccer`, `soccer-recruiting-what-parents-need-to-know`, `8-10-cleat-conversation`, `soccer-college-id-camp-guide` |
| **Cross country** — `hs-cross-country-fall.md` | Official practice + time trial Aug, invitationals Sep, big invites/league champs/district Oct | `/sports/cross-country/` | `/what-to-buy/cross-country/` (pub 2026-04-30) | `varsity-cross-country-the-real-odds`, `first-season-of-cross-country`, `cross-country-training-guide-parents`, `cross-country-recruiting-what-parents-need-to-know` |
| **Band** — `hs-marching-band-fall.md` | Camp continues/sectionals Aug, Friday games + first Saturday comps Sep, comp season peaks + state finals Oct | `/sports/band/` | `/what-to-buy/band/` (pub 2026-04-13) | `band-marching-band-camp`, `marching-band-competition-packing-list`, `drum-major-and-section-leader-the-real-odds`, `band-jazz-band-vs-concert-band` |
| **Hockey (12U travel)** — `youth-travel-hockey-winter.md` | **Tryouts land late Aug** — the most time-critical item this run — practices/league scheduling Sep, league games + first travel weekend Oct | `/sports/hockey/` | `/what-to-buy/hockey/` (pub 2026-03-16) | `youth-hockey-tryouts-what-to-expect`, `what-you-actually-need-for-first-year-hockey`, `hockey-game-day-packing-list`, `youth-hockey-equipment-guide-parents` |
| **Flag football (rec)** — `rec-flag-football-fall.md` | Late registration closes + team assignments Aug, first practice/games/jerseys Sep, regular season Oct | `/sports/flag-football/` | `/what-to-buy/flag-football/` (pub 2026-04-30) | `first-season-of-flag-football` (only dedicated piece — see gap note below) |
| **Club swimming** — `year-round-club-swimming.md` | Season break ends + fall club registration Aug, short-course season opens Sep, first meets Oct | `/sports/swimming/` | `/what-to-buy/swimming/` (pub 2026-04-30) | `varsity-swim-team-the-real-odds`, `swim-meet-weekend-logistics`, `swim-meet-packing-list`, `youth-swimming-cost-breakdown` |
| **Martial arts** — `year-round-martial-arts-belts.md` | Back-to-school enrollment wave Aug, **belt-testing window + fall tournament season Sep** | `/sports/martial-arts/` | `/what-to-buy/martial-arts/` (pub 2026-04-30) | `belt-mill-or-legitimate-school-the-advanced-level-test`, `belt-test-nerves-are-yours-not-kids`, `the-competitive-circuit-what-actually-exists-past-high-school` |
| **Basketball (AAU 12U)** — `aau-basketball-12u-year-round.md` | School-team tryouts + AAU resumes Sep, school ball begins/AAU coordination Oct | `/sports/basketball/` | `/what-to-buy/basketball/` (pub 2026-02-23) | `making-the-school-basketball-team`, `varsity-basketball-tryouts-the-real-odds`, `first-season-of-youth-basketball`, `basketball-aau-versus-high-school-the-july-choice` |
| **Theater** — `school-theater-production-year.md` | Fall-play auditions + crew signups Sep, rehearsals/set build Oct | `/sports/theater/` | `/what-to-buy/theater/` (pub 2026-04-06) | `theater-auditioning-for-the-high-school-musical`, `theater-when-the-role-is-too-small`, `theater-tech-week-survival`, `theater-the-first-read-through-week-one` |
| **Dance** — `dance-studio-recital-cycle.md` | Class registration Aug, classes resume + comp-team audition Sep, choreography/costume orders Oct | `/sports/dance/` | `/what-to-buy/dance/` (pub 2026-04-27) | `company-placement-and-team-tryouts-the-real-odds`, `dance-convention-weekends`, `dance-competition-costs-breakdown`, `competitive-dance-what-parents-need-to-know` |
| **Ballet** — `studio-ballet-nutcracker-year.md` | Level placement + class registration Aug, classes begin + **Nutcracker auditions Sep**, weekend rehearsals start Oct | `/sports/ballet/` | `/what-to-buy/ballet/` (pub 2026-04-30) | `ballet-the-audition-season-for-year-round-programs`, `trainee-second-company-placement-the-real-odds`, `ballet-the-pre-pointe-year`, `ballet-the-nutcracker-season` |
| **Choir** — `hs-choir-school-year.md` | School starts/all-state music released Aug, all-state/honor-choir first-round auditions Sep, **fall concert** + results Oct | `/sports/choir/` | `/what-to-buy/choir/` (pub 2026-04-20) | `choir-all-state-audition-prep`, `all-state-audition-prep-checklist-for-choir-kids`, `choir-show-choir-vs-concert-choir`, `choir-the-choir-tour` |
| **Crew** — `hs-crew-spring-racing.md` | Novice recruiting (no experience needed) Aug, fall season opens/novice classes Sep, head-race season peaks + Head of the Charles late Oct | `/sports/crew/` | `/what-to-buy/crew/` (pub 2026-04-30) | `varsity-crew-boat-selection-the-real-odds`, `crew-5am-different-clock-family`, `the-2k-erg-test-what-it-actually-measures`, `crew-recruiting-what-parents-need-to-know` |
| **Golf (junior)** — `junior-golf-summer.md` | PGA Jr. League all-star postseason begins Aug, regional postseason Sep, **National Championship Oct** | `/sports/golf/` | `/what-to-buy/golf/` (pub 2026-04-30) | `junior-golf-cost-breakdown`, `junior-golf-tournament-guide`, `varsity-golf-lineup-the-real-odds` |
| **Tennis (USTA junior)** — `junior-tennis-usta-year-round.md` | **National championship window** (hard-court nationals) Aug, scheduled down weeks Sep, fall local tournaments + technical rebuild Oct | `/sports/tennis/` | `/what-to-buy/tennis/` (pub 2026-04-30) | `varsity-tennis-the-real-odds-how-the-ladder-works`, `youth-tennis-cost-breakdown`, `usta-junior-tennis-levels-explained` |

## In-window sports — Tier 2 (minor/optional note only)

- **Club volleyball 14s** (`club-volleyball-14s.md`): Oct is "pre-tryout skill clinics"; the real USAV tryouts are Nov, just past the 60-day mark. Worth a light mention now, full push in next month's plan. → `/sports/volleyball/`, `/what-to-buy/volleyball/`.
- **Girls HS lacrosse** (`hs-lacrosse-spring-girls.md`): the only Aug note is "club tryouts for next year at many programs" — optional, club-level, not the HS season (spring). → `/sports/lacrosse-girls/`.
- **Boys HS lacrosse** (`hs-lacrosse-spring-boys.md`): Aug note is "fall ball begins for some" (optional, low stakes per the calendar's own language). → `/sports/lacrosse-boys/`.
- **Little League baseball** (`little-league-rec-baseball-spring.md`): Sep is optional fall-ball registration/start, explicitly lower-stakes than spring. → `/sports/baseball/`.
- **Rec fastpitch softball** (`rec-fastpitch-softball-spring.md`): same shape as baseball — optional fall-ball registration Sep. → `/sports/softball/`.

## Excluded (no tryout/registration/season-start/tournament/camp-signup event Aug–Oct)

All-star cheer (comp season starts Nov), 7v7 club football (dark until spring), HS boys basketball (tryouts land Nov, just past window), STUNT (off-season), HS track & field (off-season), gymnastics (competition season is Jan–Apr; Aug–Oct is generic skill-building with no named event).

## Content gap noticed (flagging, not fixing)

1. **No HS volleyball fall-season calendar file.** `club-volleyball-14s.md` is travel/USAV only. Girls HS volleyball is one of the biggest fall sports nationally and has no season-calendar entry, meaning it never surfaces in this monthly scan even though `/sports/volleyball/` has 20 articles. Worth a backlog item.
2. **Flag football is thin.** Only one dedicated article (`first-season-of-flag-football`) exists despite registration closing and season starting inside this window. Below the 3-article floor the task asks for.
3. **`football-7v7` and `lacrosse-boys` sport tags**: articles for boys lacrosse are tagged generically `"lacrosse"` rather than `"lacrosse-boys"` in a few places — didn't chase this down further since boys lacrosse is Tier 2 this run, but it may undercount matches on `/sports/lacrosse-boys/`.

---

## (a) Pages to refresh/verify before the window

All 16 Tier-1 gear guides were last touched **January–April 2026**, before this run — every one of them is entering its buying season in the next 60 days, so all 16 are candidates for a price/stock pass. Prioritized by how likely the stamped numbers are to be stale or safety-relevant:

**High priority (real dollar figures or governing-body rule stamps tied to a specific season):**
- `/what-to-buy/hockey/` and `/sports/hockey/` — tryout fees, skate-fitting guidance; tryouts are days to weeks away.
- `/what-to-buy/martial-arts/` — belt-testing fee range ("$40–100 per belt") quoted in the calendar note; verify against current dojo pricing before the Sep testing window.
- `/what-to-buy/golf/` — PGA Jr. League postseason/national-championship-window content; confirm dates and any registration/travel cost figures.
- `/what-to-buy/tennis/` — national-championship-window content; confirm USTA tournament fee/level info is current for the 2026–27 ranking year.
- `rules/football.md`, `rules/soccer.md`, `rules/basketball.md` (pub 2026-04-26) — pre-season is when parents actually read rule pages; spot-check against this year's NFHS/state association rule changes.
- `rules/hockey.md`, `rules/cross-country.md` (pub 2026-06-11, newest of the set — lower risk but still worth a skim).
- Girls lacrosse gear content (`girls-lacrosse-goggles-and-stick-rules`) — SEI-certification callouts are safety-relevant even though boys/girls lacrosse is Tier 2 this run; cheap to check now.

**Medium priority (season-start logistics, less likely to have hard numbers wrong):**
- `/what-to-buy/football/`, `/what-to-buy/soccer/`, `/what-to-buy/band/`, `/what-to-buy/swimming/`, `/what-to-buy/basketball/` — verify still-accurate registration windows, camp/fee mentions, and that outbound retailer links resolve.
- `/sports/crew/` and `/sports/theater/` and `/sports/choir/` — no `rules/` collection entries for these (arts activities don't have a rules page), so the hub's aggregated pillar/guide content is the only freshness surface; spot-check for dead links and any stale "this year's dates" language.

**Lower priority (evergreen, cost/logistics only, no rule-stamp risk):**
- `/what-to-buy/dance/`, `/what-to-buy/ballet/`, `/what-to-buy/theater/`, `/what-to-buy/choir/`, `/what-to-buy/cross-country/`, `/what-to-buy/flag-football/` — mostly gear/packing content, lower drift risk, worth a normal refresh pass.

**Structural note:** sport hub pages (`/sports/[slug]/`) are generated dynamically from `getCollection()` calls, not static content — they don't carry their own `publishedAt`, so "refreshing" a hub really means refreshing the underlying `guides`, `rules`, `pillar`, and `seasonCalendars` entries it aggregates. Nothing to touch on the hub template itself.

---

## (b) Newsletter queue — Friday Letters

Most recent Friday Letter on file is No. 3 (2026-07-31), which already resurfaced `august-first-the-pre-season-week` and ran two football/coaching pieces — don't repeat those. Recent letters have skewed heavily toward football/coaching; this window is a good chance to represent the other in-window sports for those readers.

Proposed sequence, in order of time-sensitivity:

1. **Week of 8/07 — Hockey tryouts.** Most urgent item in this whole plan: 12U tryouts land late this month. Lead: `youth-hockey-tryouts-what-to-expect`, paired with `what-you-actually-need-for-first-year-hockey` for families new to the sport.
2. **Week of 8/14 — What band camp actually looks like.** Camp is in progress now; parents of first-year marching band kids are living the "family vacation ends when band camp starts" reality the calendar itself calls out. Lead: `band-marching-band-camp`.
3. **Week of 8/21 — Registration/audition season for dance and ballet.** Both have registration open now and auditions landing in September (comp-team audition, Nutcracker auditions) — get ahead of it. Lead: `company-placement-and-team-tryouts-the-real-odds` + `ballet-the-audition-season-for-year-round-programs`.
4. **Week of 8/28 — Fall practice opens (soccer + cross country).** Two-a-days and official practice both start this window; use as the "first week back" issue. Lead: `first-season-of-youth-soccer` or `varsity-soccer-tryouts-the-real-odds`, archive-resurface a cross-country piece.
5. **Into September (flag as upcoming, not this month's batch):** choir/theater audition season (`choir-all-state-audition-prep`, `theater-auditioning-for-the-high-school-musical`), crew's "no experience needed" novice recruiting pitch (`crew-5am-different-clock-family`), and a golf/tennis postseason wrap once the PGA Jr. League and USTA national events close out.

---

## (c) Social queue — pin/post this month

Prioritized by what's actually actionable for a parent *this month* (registration open, tryout prep, gear-buying window), not evergreen content:

- **Hockey:** `youth-hockey-equipment-guide-parents` (equipment checklist) and `youth-hockey-tryouts-what-to-expect` — pin both now, tryouts are weeks away.
- **Band:** `band-marching-band-camp` + gear guide fee/equipment list (`/what-to-buy/band/`) — camp is happening in real time, high relevance.
- **Dance/Ballet:** `dance-competition-costs-breakdown` and `performing-arts-cost-breakdown` — registration/placement deposits are due now, cost-transparency content performs well at this exact moment.
- **Cross country / Soccer:** `8-10-cleat-conversation` (soccer gear) and the cross-country gear guide — practice opens this window, gear-buying is active.
- **Golf:** `junior-golf-cost-breakdown` — postseason travel costs are real for families right now.
- **Tennis:** `youth-tennis-cost-breakdown` — nationals-window travel costs, same logic as golf.
- **Flag football:** `first-season-of-flag-football` — the one asset available; also the clearest case in this plan for commissioning a short registration/gear checklist post given the content gap noted above.
- **Choir/Theater (stage for early Sep, not August):** `all-state-audition-prep-checklist-for-choir-kids` and `theater-auditioning-for-the-high-school-musical` — hold for the last week of August so they land right as auditions open.

---

## Notes for Jeff

- This is the first run of `pcd-seasonal-content-scheduler`; no prior `SEASONAL_PLAN` file existed to reconcile against (confirmed against `reports/social/SOCIAL_DRAFTS_2026-07-31.md`, which explicitly notes no seasonal-plan file exists and skips its category-c queue as a result — this file now unblocks that for the next social batch).
- File named `SEASONAL_PLAN_2026-08.md` (year-month) rather than a bare month name, to match the naming convention already established by `reports/friday-letters/`, `reports/social/`, and other monthly report families in this repo.
- No content, dates, or prices were edited. Everything above is a punch list for a human (or a separate editorial-refresh run) to action.
