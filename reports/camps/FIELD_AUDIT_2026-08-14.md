# Camps field audit — 2026-08-14

50 audited, 29 fixed (33 fields), 21 clean, 0 need Jeff. 1,472 of 1,972 approved remaining — ~30 nights left at this pace.

run_id: `cass-2026-08-14`

## Fixed

### Dangling separator artifact (name) — rule `dangling_separator`, 27 rows

Scraper left `" -  ("` where a venue/session name was empty (mostly the `ussportscamps.com` Nike Soccer template). Collapsed to `" ("`.

- prog-c174ba19 "Nike Basketball Camp Danvers Indoor Sports" — `...Sports -  (June 22–26, 2026)` → `...Sports (June 22–26, 2026)`
- prog-6e9511ab "Nike Basketball Camp Danvers Indoor Sports" — same pattern, June 23–26
- prog-9fff5912 "Nike Basketball Camp Danvers Indoor Sports" — same pattern, June 24–26
- prog-32713698 "Nike Basketball Camp Danvers Indoor Sports" — same pattern, June 25–26
- prog-4fef19d9 "Nike Baseball Camp at Charleston Southern University" — same pattern, June 22–26
- prog-422440be "Nike Baseball Camp at Long Beach City College" — same pattern, June 22–26
- prog-3301f721 "Nike Soccer Camp at Furman University" — same pattern, June 22–26
- prog-49eb2297 "Nike Soccer Camp at Marquette University" — same pattern (also see entity fix below)
- prog-7e43b4c9 "Nike Soccer Camp at Sports Reality" — same pattern, June 22–26
- prog-c08a5e2b "Nike Soccer Camp at Fredericksburg Field House" — same pattern, June 22–26
- prog-b8cba20e "Nike Soccer Camp at Virginia Beach Field House" — same pattern, June 22–26
- prog-fe18c208 "Nike Soccer & Swim Camp with HUB Sports at Windgate Ranch" — same pattern (also see entity fix below)
- prog-c379db64 "Nike Soccer Camp at Sofive - Alameda" — trailing dangling separator only, kept the legitimate "- Alameda"
- prog-7255daf5 "Nike Soccer Camp at Glendale Sports Complex" — same pattern, June 22–26
- prog-ce77103d "Nike Soccer Camp at Regis University" — same pattern, June 22–26
- prog-6d73bc29 "Nike Soccer Camp at the University of South Florida" — same pattern, June 22–26
- prog-1fa6e5ce "Nike Soccer Camp with JM Soccer Academy in Las Vegas" — same pattern, June 22–26
- prog-00782556 "Nike Soccer Camp in Winnetka" — same pattern (also see entity fix below)
- prog-0d4c573c "Nike Soccer Camp at Admiral Farragut Academy" — same pattern, June 22–26
- prog-bd7bc06b "Nike Soccer Camp St. Ignatius College Preparatory" — same pattern (also see misspelling fix below)
- prog-89dbe1f5 "Nike Soccer Camp with Prospect Soccer Academy - Memphis" — trailing dangling separator only, kept the legitimate "- Memphis"
- prog-61327ee7 "Nike Soccer Camp at Winsor School" — same pattern, June 22–26
- prog-4c49910c "Nike Soccer Camp at Maryville University" — same pattern, June 22–26
- prog-6bf74208 "Nike Soccer Camp at MidAmerica Nazarene College" — same pattern, June 22–26
- prog-a846302f "Nike Girls Soccer Camp in Eagle" — same pattern, June 22–26
- prog-88dbaa00 "Nike Boys Soccer Camp at Fairfield University" — same pattern, June 22–26
- prog-24364f9b "Nike Girls Soccer Camp University of Mary Washington" — same pattern, June 25–27

### HTML entity decode (description) — rule `html_entity_decode`, 5 rows

- prog-3a04e849 "Nike Soccer Camp at Seattle University - All Skills" — `Men's &amp; Women's Soccer coaches` → `Men's & Women's Soccer coaches`
- prog-86bbfd2d "Nike Soccer Camp at Seattle University - Elite" — same template text, same fix
- prog-49eb2297 "Nike Soccer Camp at Marquette University" — `Head Coach &amp; Camp Director` → `Head Coach & Camp Director`
- prog-fe18c208 "Nike Soccer & Swim Camp with HUB Sports at Windgate Ranch" — `Soccer &amp; Swim program` → `Soccer & Swim program`
- prog-00782556 "Nike Soccer Camp in Winnetka" — `Top-10 Nike Soccer Camp in 2024 &amp; 2025` → `...2024 & 2025`

### Misspelling (description) — rule `misspelling_fix`, 1 row

- prog-bd7bc06b "Nike Soccer Camp St. Ignatius College Preparatory" — `competitive enviroment.` → `competitive environment.`

## Needs Jeff

None this run.

## New rules earned

- **Missing space after sentence-ending punctuation before a capitalized word ("word!Word", "word:Word").** Flagged as a proposed rule in the 2026-08-13 report (7 rows that night) but not yet promoted into RULESET_VERSION 1, so it wasn't touched tonight either. It recurred across all 9 Nike Basketball/ASA rows in this batch (prog-85b2f616, prog-c174ba19, prog-6e9511ab, prog-9fff5912, prog-32713698, prog-9466c5c3, prog-696c995c, prog-30ec4f4c, prog-3a6a57e0) — e.g. "new themed weeks!Shooting and Scoring Week", "score big!Contest and Games Week:Get ready for non-stop action." Same `ussportscamps.com` ASA/Nike Basketball template both nights. Two nights of hits now comfortably clears the 3+ bar; recommending this graduate to an auto-fix rule in the next RULESET_VERSION (insert a single space where `[.!?:]` is immediately followed by an uppercase letter, description field only).

## Progress

- Remaining: 1,472 of 1,972 approved rows still below RULESET_VERSION 1.
- Rate: 50 rows/night.
- Projected completion: ~30 more nightly runs (~2026-09-13) at the current pace, unless batch size or cadence changes.
