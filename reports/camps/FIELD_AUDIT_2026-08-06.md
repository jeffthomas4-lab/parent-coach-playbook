# Camp Field Audit — 2026-08-06

**50 audited, 46 fixed (63 fields), 0 clean, 4 need Jeff. 1,872 of 1,972 remaining — ~38 nights left.**

Run ID: `cass-2026-08-06`. RULESET_VERSION 1.

## Fixed

### Rule: dangling_separator_fragment (41 rows — name field)

Scraper left ` -  (` before the date parenthetical; collapsed to ` (`.

- 2458ebba — Nike Soccer Camp in Holmdel — name: `Nike Soccer Camp in Holmdel -  (Aug. 24–28, 2026)` → `Nike Soccer Camp in Holmdel (Aug. 24–28, 2026)`
- de1b99d3 — Nike Soccer Camp in Huntersville — name: `Nike Soccer Camp in Huntersville -  (Aug. 3–7, 2026)` → `Nike Soccer Camp in Huntersville (Aug. 3–7, 2026)`
- 4e0a5fe3 — College Soccer Academy iD Camp in Seattle - Boys — name: `College Soccer Academy iD Camp in Seattle - Boys -  (June 19, 2026)` → `College Soccer Academy iD Camp in Seattle - Boys (June 19, 2026)`
- 0232619e — Nike Soccer Camp with San Diego Surf - Chula Vista — name: `... - Chula Vista -  (July 6–9, 2026)` → `... - Chula Vista (July 6–9, 2026)`
- a083314c — Nike Soccer Camp with San Diego Surf - San Marcos — name: `... - San Marcos -  (July 13–16, 2026)` → `... - San Marcos (July 13–16, 2026)`
- 586bffa4 — Nike Soccer Camp with San Diego Surf - San Diego — name: `... - San Diego -  (July 27–30, 2026)` → `... - San Diego (July 27–30, 2026)`
- 2c67fe80 — Nike Soccer Camp at Gaston Day School (June 8–12) — name: `... School -  (June 8–12, 2026)` → `... School (June 8–12, 2026)`
- 3de91d0c — Nike Soccer Camp at Gaston Day School (July 6–10) — name: `... School -  (July 6–10, 2026)` → `... School (July 6–10, 2026)`
- b69025a0 — Nike Soccer Camp in Stuart (June 22–26) — name: `Stuart -  (June 22–26, 2026)` → `Stuart (June 22–26, 2026)`
- 1ccb894a — Nike Soccer Camp in Stuart (July 20–24) — name: `Stuart -  (July 20–24, 2026)` → `Stuart (July 20–24, 2026)`
- 2239a2d3 — Nike Soccer Camp in Kansas City — name: `Kansas City -  (June 8–12, 2026)` → `Kansas City (June 8–12, 2026)`
- 13fa6d91 — Nike Soccer Camp in Frederick — name: `Frederick -  (July 27–31, 2026)` → `Frederick (July 27–31, 2026)`
- 599544bc — Nike Soccer Camp in Randolph (July 13–17) — name: `Randolph -  (July 13–17, 2026)` → `Randolph (July 13–17, 2026)`
- 93cbed2c — Nike Soccer Camp in Randolph (July 20–24) — name: `Randolph -  (July 20–24, 2026)` → `Randolph (July 20–24, 2026)`
- 5f2f3e2a — Nike Soccer Camp in Sioux Falls — name: `Sioux Falls -  (June 8–12, 2026)` → `Sioux Falls (June 8–12, 2026)`
- 18eee34d — Nike Soccer Camp in Tinton Falls — name: `Tinton Falls -  (July 20–24, 2026)` → `Tinton Falls (July 20–24, 2026)`
- c6d002b4 — Nike Soccer Camp with Futeballer at In The Net (June 15–18) — name: `In The Net -  (June 15–18, 2026)` → `In The Net (June 15–18, 2026)`
- 61452489 — Nike Soccer Camp with Futeballer at In The Net (July 27–30) — name: `In The Net -  (July 27–30, 2026)` → `In The Net (July 27–30, 2026)`
- 03c083dd — Nike Soccer Camp in Chester Springs (June 22–26) — name: `Chester Springs -  (June 22–26, 2026)` → `Chester Springs (June 22–26, 2026)`
- 390e0d85 — Nike Soccer Camp in Chester Springs (July 6–10) — name: `Chester Springs -  (July 6–10, 2026)` → `Chester Springs (July 6–10, 2026)`
- 0b0fe1ff — Nike Soccer Camp in Chester Springs (July 20–24) — name: `Chester Springs -  (July 20–24, 2026)` → `Chester Springs (July 20–24, 2026)`
- 41d20cfc — Nike Soccer Camp in Hamilton — name: `Hamilton -  (June 29–July 2, 2026)` → `Hamilton (June 29–July 2, 2026)`
- f0565a46 — Nike Soccer Camp in Big Sky — name: `Big Sky -  (July 20–23, 2026)` → `Big Sky (July 20–23, 2026)`
- 1005292f — Nike Soccer Camp in Whitefish - Flathead Valley — name: `Flathead Valley -  (June 22–26, 2026)` → `Flathead Valley (June 22–26, 2026)`
- e9eb7627 — Nike Soccer Camp at Lost Nation Sports Park - Willoughby (June 22–26) — name: `Willoughby -  (June 22–26, 2026)` → `Willoughby (June 22–26, 2026)`
- 9aa7940c — Nike Soccer Camp at Lost Nation Sports Park - Willoughby (July 13–17) — name: `Willoughby -  (July 13–17, 2026)` → `Willoughby (July 13–17, 2026)`
- 460c643e — Nike Soccer Camp at in Frisco — name: `at in Frisco -  (June 15–18, 2026)` → `at in Frisco (June 15–18, 2026)` (also flagged `needs_human`, see below)
- db2bb5f0 — Nike Soccer Camp with Ekkono at Maryland SoccerPlex — name: `SoccerPlex -  (Aug. 3–7, 2026)` → `SoccerPlex (Aug. 3–7, 2026)`
- 89880569 — Nike Girls Soccer Camp at University of Cincinnati — name: `Cincinnati -  (June 29–July 2, 2026)` → `Cincinnati (June 29–July 2, 2026)`
- f3cc78fd — Nike Soccer Camp in Metairie - New Orleans (June 8–12) — name: `New Orleans -  (June 8–12, 2026)` → `New Orleans (June 8–12, 2026)`
- ff5d83ee — Nike Soccer Camp in Metairie - New Orleans (July 27–31) — name: `New Orleans -  (July 27–31, 2026)` → `New Orleans (July 27–31, 2026)`
- ee12dece — Nike Soccer Camp in St. George — name: `St. George -  (June 8–11, 2026)` → `St. George (June 8–11, 2026)`
- 60eefb23 — Nike Soccer Camp in Salt Lake City — name: `Salt Lake City -  (July 27–30, 2026)` → `Salt Lake City (July 27–30, 2026)`
- 563c3728 — Nike Soccer Camp in Elk Grove (July 6–10) — name: `Elk Grove -  (July 6–10, 2026)` → `Elk Grove (July 6–10, 2026)`
- fe8a3125 — Nike Soccer Camp in Elk Grove (July 13–17) — name: `Elk Grove -  (July 13–17, 2026)` → `Elk Grove (July 13–17, 2026)`
- 00d1f3c3 — Nike Soccer Camp at Le Five Indoor Soccer - West Sacramento (June 15–19) — name: `Sacramento -  (June 15–19, 2026)` → `Sacramento (June 15–19, 2026)`
- 5e50d4a4 — Nike Soccer Camp at Le Five Indoor Soccer - West Sacramento (June 29–July 3) — name: `Sacramento -  (June 29–July 3, 2026)` → `Sacramento (June 29–July 3, 2026)`
- 1857b614 — Nike Soccer Camp at DeSales University (June 15–18) — name: `University -  (June 15–18, 2026)` → `University (June 15–18, 2026)`
- 6664dac6 — Nike Soccer Camp at DeSales University (Aug. 10–13) — name: `University -  (Aug. 10–13, 2026)` → `University (Aug. 10–13, 2026)`
- ef0034ae — Nike Soccer Camp with Beyond the Baller - Santa Barbara — name: `Santa Barbara -  (Aug. 3–7, 2026)` → `Santa Barbara (Aug. 3–7, 2026)`
- 6fbc0ff1 — Nike Soccer Camp at Let's Play Soccer - Houston — name: `Houston -  (June 22–25, 2026)` → `Houston (June 22–25, 2026)`

### Rule: whitespace_collapse (9 rows — name field)

`Camp  with` (double space) collapsed to `Camp with`. All 9 rows are the FourSoccer x Nike Soccer Camp - Washington DC series.

- 76b3aba3 — name: `Nike Soccer Camp  with FourSoccer - Washington DC - Day Camp (June 22–26, 2026)` → `Nike Soccer Camp with FourSoccer - Washington DC - Day Camp (June 22–26, 2026)`
- 2e2746c3 — name: `...Camp  with FourSoccer...(June 29–July 3, 2026)` → `...Camp with FourSoccer...(June 29–July 3, 2026)`
- d7a72221 — name: `...Camp  with FourSoccer...(July 6–10, 2026)` → `...Camp with FourSoccer...(July 6–10, 2026)`
- 58da40ce — name: `...Camp  with FourSoccer...(July 13–17, 2026)` → `...Camp with FourSoccer...(July 13–17, 2026)`
- 1c5f9422 — name: `...Camp  with FourSoccer...(July 20–24, 2026)` → `...Camp with FourSoccer...(July 20–24, 2026)`
- a7ff53e2 — name: `...Camp  with FourSoccer...(July 27–31, 2026)` → `...Camp with FourSoccer...(July 27–31, 2026)`
- 8f1c183c — name: `...Camp  with FourSoccer...(Aug. 3–7, 2026)` → `...Camp with FourSoccer...(Aug. 3–7, 2026)`
- f04e2a48 — name: `...Camp  with FourSoccer...at Horace Mann ES (Aug. 10–14, 2026)` → `...Camp with FourSoccer...at Horace Mann ES (Aug. 10–14, 2026)`
- af728a8c — name: `...Camp  with FourSoccer...at Horace Mann ES (Aug. 17–21, 2026)` → `...Camp with FourSoccer...at Horace Mann ES (Aug. 17–21, 2026)`

### Rule: html_entity_decode (13 rows — description field)

`&amp;` decoded to `&`.

- 76b3aba3, 2e2746c3, d7a72221, 58da40ce, 1c5f9422, a7ff53e2, 8f1c183c, f04e2a48, af728a8c — FourSoccer x Nike Soccer Camp (Washington DC series) — description: `...Indoor Skills &amp; Cool‑Down Sessions...` / `...Afternoon Splash &amp; Recovery...` → `&` (both occurrences, same 9 rows also had the whitespace fix above)
- 4e0a5fe3 — College Soccer Academy iD Camp in Seattle — description: `...coaching &amp; recruiting at our events...abides by high school rules &amp; camps are open...` → `&`
- 03c083dd, 390e0d85, 0b0fe1ff — Nike Soccer Camp in Chester Springs (all 3 sessions) — description: `...with Gold &amp; Gray Soccer Academy...` → `...with Gold & Gray Soccer Academy...` (also flagged `needs_human`, see below)

### Clean (0 rows)

None of tonight's 50 came back clean — every row needed at least one field fix or a human flag.

## Needs Jeff (4 rows)

**Off-taxonomy category, content says otherwise (3 rows)** — `activity_category` doesn't match what the camp actually is:

- 03c083dd — Nike Soccer Camp in Chester Springs (June 22–26) — category is `baseball`, camp is soccer (Gold & Gray Soccer Academy). Propose: `soccer`.
- 390e0d85 — Nike Soccer Camp in Chester Springs (July 6–10) — same issue. Propose: `soccer`.
- 0b0fe1ff — Nike Soccer Camp in Chester Springs (July 20–24) — same issue. Propose: `soccer`.

**Missing venue token in name (1 row)**:

- 460c643e — Nike Soccer Camp at in Frisco (June 15–18) — name is missing the venue between "at" and "in Frisco." Description says the camp is "at the All Stars Arena in Frisco, TX." Propose renaming to "Nike Soccer Camp at All Stars Arena in Frisco." Only the dangling-separator fix was auto-applied; the venue insertion is a content call, not a mechanical string op.

## New rules earned

- **Scraper-glued sentences with a missing space after a period.** Seen 4+ times tonight — e.g. "...from the summer heat.This premier indoor..." (Le Five Indoor Soccer descriptions) and "...Andrews Osborne Academy.Hear from Camp Director..." (Lost Nation Sports Park descriptions). Proposed AUTO-FIX rule candidate: insert a space between a lowercase-or-punctuation character immediately followed by an uppercase letter that starts a new sentence, when preceded by a period with no space. This needs care to avoid misfiring on abbreviations and decimals (e.g. "U.S.", "3.5L") — recommend Jeff review a small sample before it goes on the auto-fix list. Not fixed tonight; no rule covers it yet.

## Progress

1,872 of 1,972 approved rows remaining. At 50/night that's ~38 more nights — projected completion around 2026-09-13 if the run continues nightly without gaps.
