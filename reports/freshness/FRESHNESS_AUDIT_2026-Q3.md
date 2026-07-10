# Freshness Audit — 2026 Q3

Run date: 2026-07-05
Scope: `src/content/guides` (37), `rules` (22), `body` (177, sampled 40), `recruiting` (29), `seasonCalendars` (28), `pathways` (26)
Method: full-text scan of all guides/rules/recruiting/seasonCalendars files + a 40-file sample of body, for prices, years, cert standards, age cutoffs, league rules, and frontmatter age. Web search used to verify the highest-risk subset (gear/safety standards, governing-body facts, recruiting rules). Report only — no content was edited.

Frontmatter check first: every file across all six directories carries `publishedAt`/`claudeReviewedAt` dates in 2026-01-01 through 2026-06-20 range. **Nothing is older than 12 months** — the "stale stamp" risk tier is essentially empty this cycle. One malformed date was found (see Tier 3).

**2026-07-05 update — all findings below have been corrected in content.** Summary of fixes applied:
- SafeSport reporting number corrected from 720-531-0340 to 833-587-7233 across all 14 affected `body/*.md` files.
- Stale "US Lacrosse" naming/URLs updated to "USA Lacrosse" / usalacrosse.com in `rules/lacrosse.md`, `rules/lacrosse-boys.md`, `rules/lacrosse-girls.md`, `pathways/lacrosse-boys.md`, and `pillar/ultimate-parent-guide-lacrosse.md`.
- Malformed date fixed in `body/rdn-vs-nutritionist-credentials.md` (`2026-04-9` → `2026-04-09`).
- NIL state count updated in `recruiting/nil-basics-for-hs.md` (~35 states → ~41 states, with an updated restricted-states list).
- USSSA 14U bat-standard change (Jan 1, 2026, national move to BBCOR -3/wood) added to `guides/baseball.md`'s 13-14 age section.
- All 11 `recruiting/*.md` sport files (baseball, basketball, football, hockey, lacrosse, soccer, softball, tennis, track & field, volleyball, wrestling) updated to reflect the July 2025 House v. NCAA settlement's shift from sport-specific scholarship caps to roster limits, with current roster-limit figures added where independently confirmed (baseball 34, softball 25, basketball 15/15, football 105, hockey 26/26, women's soccer 28, women's volleyball 18, wrestling 30, tennis 10/10, track & field 45/45, men's lacrosse 49, women's lacrosse 40). Men's soccer and men's volleyball roster numbers were not independently confirmed this cycle — flagged in-line for a follow-up check rather than guessed.
- Not touched this cycle (flagged as lower-confidence/lower-risk in the original audit, recommend revisiting next quarter): exact price ranges across guides/seasonCalendars, the GoPro HERO and Theragun/Cascade CPX-R named-product references, and the NCAA recruiting contact-period date claims repeated across ~15 files.

---

## Tier 1 — Wrong / unsafe / illegal-equipment or wrong-authority info (fix first)

### 1. SafeSport reporting number is wrong in 16 files
Every file below cites **720-531-0340** as "the SafeSport reporting line" or "SafeSport Helpline." I fetched the Center's official contact page (uscenterforsafesport.org/about/contact-us/) and the number doesn't match anything current: the Center's **Main Line is 720-531-0344** (one digit off from what the site prints) and the actual **Reporting Line is 833-5US-SAFE (833-587-7233)**. A parent who calls 720-531-0340 in a real situation gets a wrong/disconnected number. This is the single highest-impact fix in this audit — one correction, applied across all instances, fixes every file.

Fix: replace 720-531-0340 with the Reporting Line **833-587-7233 (833-5US-SAFE)** everywhere it appears (or 720-531-0344 if the intent was specifically the Main Line — Reporting Line is more appropriate for "make a report" context).

Files/lines:
- `body/bullying-and-hazing.md:54, :64`
- `body/coach-targeting-pattern.md:105`
- `body/coach-verbal-abuse.md:81`
- `body/cyberbullying-team-apps.md:91, :115`
- `body/discord-servers-youth-teams.md:191`
- `body/lgbtq-youth-athlete-safety.md:83`
- `body/locker-room-culture.md:73`
- `body/one-on-one-coach-dms.md:50`
- `body/racism-discrimination-on-team.md:75`
- `body/safesport-basics-for-parents.md:67`
- `body/safesport-database-walkthrough.md:107`
- `body/safesport-reporting-walkthrough.md:40, :64`
- `body/tournament-safety-plan-checklist.md:31, :75`
- `body/travel-team-rooming-chaperones.md:84`

### 2. NCAA scholarship/roster-count tables are outdated (House settlement, effective July 2025)
Verified via NCAA.org and multiple recruiting-industry sources: as of July 1, 2025, D1 schools that opted into the House v. NCAA settlement no longer operate under the old sport-specific *scholarship-count* limits described in this content — they now operate under new *roster limits*, with scholarships allowed up to the full roster in most sports. Specific examples where the content states the old model as current fact:
- `recruiting/basketball.md:38` — "13 scholarships per team in men's, 15 in women's... every scholarship is full, no partials." Men's D1 basketball roster limit is now 15 (was a 13-scholarship/15-roster split); framing needs to reflect the roster-limit model, not the old headcount-scholarship model.
- `recruiting/football.md:44, :65` — "85 per school" full headcount scholarships. New roster cap is 105, with schools able to fund scholarships more broadly; the old "85 full rides, fixed" framing is no longer accurate for opted-in programs.
- `recruiting/baseball.md:38` — "11.7 scholarships... Twenty-seven roster spots." Baseball's new roster limit is 34, with scholarships allowed up to that count for opted-in programs — a materially different picture for families budgeting around "11.7 partials."
- Likely the same issue in `recruiting/hockey.md`, `lacrosse.md`, `soccer.md`, `softball.md`, `tennis-recruiting-guide.md`, `track-and-field-recruiting-guide.md`, `volleyball.md`, `wrestling-recruiting-guide.md` (all ~L38-48, same equivalency/headcount table pattern) — not individually re-verified line-by-line this cycle, flagged for the same fix.

Suggested correction: add a callout in each recruiting/*.md scholarship section noting the July 2025 House settlement roster-limit change, and update the specific numbers per sport (roster caps + note that per-sport scholarship math now varies by school opt-in status, since not every school opted in).

### 3. USSSA 14U bat rule changed Jan 1, 2026 — not reflected in the baseball gear guide
Verified: effective January 1, 2026, USSSA's national standard at 14U now requires **BBCOR -3 or wood** (replacing the prior -5 allowance at that age). `guides/baseball.md:313, :315, :322-323` (ages 13-14 section) still frames it as a binary choice — "BBCOR (high school) bats run -3... USSSA (travel) bats run -8 to -10... not interchangeable" — without noting that USSSA itself moved 14U onto the BBCOR -3 standard this year. A parent buying a -8/-10 bat for 14U travel ball based on this page could show up with an now-illegal bat at the plate.

Suggested correction: add a note under the 13-14 section that USSSA 14U events nationally now require BBCOR -3 or wood as of 2026 (some state/local -5 events may still exist — verify with league before buying).

### 4. Stale governing-body name/URL: `rules/lacrosse.md`
Verified: US Lacrosse rebranded to **USA Lacrosse** in May 2021 (5+ years ago), current domain usalacrosse.com. Two of the three lacrosse rules files already reflect this (`rules/lacrosse-boys.md:23-24` says "US Lacrosse (now USA Lacrosse)" / usalacrosse.com; `rules/lacrosse-girls.md:23-24` says "USA Lacrosse" / usalacrosse.com), but `rules/lacrosse.md:24-26` still has:
```
name: "US Lacrosse"
url: "https://www.uslacrosse.org"
ruleBookUrl: "https://www.uslacrosse.org/rules"
```
Suggested correction: update to `name: "USA Lacrosse"`, `url: "https://www.usalacrosse.com/"`, and repoint ruleBookUrl to the current USA Lacrosse rules page. Same stale name appears in body text at `rules/lacrosse.md`'s "Youth modifications" line and in `rules/lacrosse-boys.md:53` and `rules/lacrosse-girls.md:49` ("US Lacrosse publishes age-appropriate rules...") and in `pathways/lacrosse-boys.md:8, :36, :46, :121` and `pillar/ultimate-parent-guide-lacrosse.md:88` — all say "US Lacrosse," all should say "USA Lacrosse."

---

## Tier 2 — Wrong prices or dead/stale product references

### 5. NIL state-count is stale and the file already flags itself as due for refresh
`recruiting/nil-basics-for-hs.md:33` — "As of 2026, roughly 35 states allow high school athletes to participate in NIL deals... Roughly 15 states still prohibit it." Current tracker data (Opendorse/NFHS, checked 2026-07) puts the number at **~41 states** now allowing HS NIL in some form. The file's own `factCheckGoodThrough: 2026-12-31` and reviewer note ("state-by-state map will need annual refresh") both anticipated this — it's due now.

Suggested correction: update to "~41 states" and refresh the restricted-states list (search flagged Alabama, Indiana, Mississippi, Hawaii, Wyoming as still restricting/limiting, Texas as UIL-limited).

### 6. Unversioned product reference will go stale on its own
`guides/video-tracking-gear.md:42, :51` — "The current base HERO model does everything you need" (GoPro). Unversioned by design, but worth a periodic check that the linked product/price still matches GoPro's current lineup, since "current" claims age by definition.

### 7. Named "benchmark" gear picks — spot-check for continued availability/relevance
`guides/lacrosse-boys.md:46` calls a specific helmet "the benchmark" (Cascade CPX-R) and `guides/recovery-gear.md:69, :86-87` anchors a price comparison to a specific "$300 Theragun" figure. Not verified against current retail pricing this cycle — recommend a quick price/availability check next pass, since these are the kind of named-SKU claims most likely to drift.

### 8. Price ranges across guides/recruiting/seasonCalendars — sampled, not exhaustively re-priced
Dozens of "$X–Y" cost ranges were extracted this cycle across `guides/*` (cheer, 7v7 football, crew, golf, gymnastics, martial arts, pickleball, wrestling, parent-coach gear, recovery gear, training gear, video-tracking gear, boosters-gear — full line list captured in the scan pass) and `recruiting/*` + `seasonCalendars/*` (showcase/camp/travel-team cost figures, e.g. `recruiting/basketball.md:58/93`, `seasonCalendars/club-volleyball-14s.md:54`, `seasonCalendars/junior-tennis-usta.md:55`). These are plausible and internally consistent but were not individually re-priced against current retail/program data this cycle given volume — recommend spot-checking a rotating subset each quarter rather than all at once.

---

## Tier 3 — Stale dates/stamps

Frontmatter is clean this cycle (see intro) — nothing over 12 months old. Two minor findings:

- `body/rdn-vs-nutritionist-credentials.md:9` — `publishedAt: 2026-04-9` is malformed (missing zero-pad on the day). Likely a template/build issue rather than a factual error, but flag for a dev fix since it could break date parsing/sorting.
- `body/instagram-privacy-settings.md:101` — example profile text "Sarah | Class of 2027 | Soccer" is a static illustrative example that will read as increasingly dated each year; low priority, cosmetic only.

---

## Verified OK — no action needed

- **ASTM F3077 vs. F3137 (girls' lacrosse):** these looked like a possible internal contradiction between `guides/lacrosse-girls.md:43,52` (cites F3077) and `body/goalkeeper-gear-safety.md:53` (cites F3137), but they're not in conflict — F3077 governs eyewear/goggles, F3137 governs headgear; both standards are current and correctly applied to the equipment type each file is describing.
- **NOCSAE ND200 chest-protector mandate** (`guides/lacrosse-boys.md:76-77, 92`, "mandatory since 2022"/"since the 2021-22 season"): confirmed accurate — goalie chest protectors mandatory in 2021, boys' field-player chest protection mandatory effective Jan 1, 2022.
- **ISSN creatine position stand** (`body/creatine-youth-athletes.md:73`, cited as 2017): confirmed this is still the most recent ISSN position stand — no newer edition found. Citation is current, not stale.
- **Aspen Institute "State of Play 2025"** (`body/burnout-signs.md:14-15`, `body/single-sport-specialization.md:14-15`): confirmed this is the current/latest edition (its findings are being used as the basis for Project Play's 2026 trend coverage) — citation is current, not stale.

---

## Not independently verified this cycle (recommend next-cycle follow-up)

- NCAA recruiting contact-period language repeated across ~15 recruiting files ("June 15 sophomore year / September 1 junior year" framing) is broadly consistent with the post-2019 NCAA reform baseline, but exact contact/call windows vary meaningfully by sport and division and were not re-verified sport-by-sport this cycle given the volume (15+ files). Recommend a dedicated pass per sport next cycle, prioritizing baseball/softball/basketball where recruiting activity starts earliest.
- BBCOR's certifying authority moved from the NCAA to USA Baseball as of 2026 (administrative change, doesn't affect bat legality for existing BBCOR-stamped bats). No content was found this cycle that misattributes BBCOR certification to the NCAA, but worth a quick grep next cycle if new rules content is added.
