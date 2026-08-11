# Field Audit — 2026-08-10

50 audited, 32 fixed (37 fields), 15 clean, 3 need Jeff. 1,672 of 1,972 approved remaining — ~34 nights left at this pace.

Run ID: `cass-2026-08-10`

## Fixed

**Dangling separator fragments (name field)** — collapsed `" -  ("` to `" ("`. 27 rows, name only:

- prog-908867eb — Nike Tennis Camp at Auburn University → dropped dangling `-`
- prog-046e4092 — Nike Soccer Camp in Norman Oklahoma
- prog-09d67505 — Nike Baseball Camp at Herr-Baker Field, directed by Fond du Lac Dock Spiders
- prog-e92d2d38 — Nike Soccer Camp at The National Sports Center in Blaine
- prog-49c7f66c — Nike Tennis Camp at University of Illinois (June 7–11)
- prog-ae7d7f30 — Nike Baseball Camp With Legacy 3 42 Outlaws at Rockford University
- prog-be7cba0f — Nike Soccer Camp at Wright State University
- prog-82e77267 — Nike Soccer Camp with JM Soccer Academy in Las Vegas
- prog-0b0a29b0 — Nike Soccer Camp at USC Upstate
- prog-a69888a3 — Nike Soccer Camp at Texas Woman's University
- prog-804c687e — Nike Soccer Camp in Minooka
- prog-6d0566f8 — Nike Soccer Camp in Naples
- prog-2bc0da83 — Nike Soccer Camp at Metropolitan State University of Denver
- prog-74f43deb — Nike Soccer Camp at Life University
- prog-9fc3fc0c — Nike Basketball Camp at Monrovia Community Center
- prog-8b1a22fa — Nike Baseball Camp at Dana Hills High School
- prog-02a0727a — Nike Baseball Camp at Eckerd College
- prog-0b25b2be — Nike Soccer Camp at Sofive - Alameda
- prog-0ad0127e — Nike Soccer Camp at Cabrillo College
- prog-aa99d302 — Nike Soccer Camp at Biola University
- prog-d7b5e403 — Nike Soccer Camp at University of Houston
- prog-05bbaf17 — Nike Soccer Camp in St. Charles
- prog-5b8030a3 — Nike Soccer Camp at Admiral Farragut Academy
- prog-23ade794 — Nike Soccer Camp at Maryville University
- prog-03c79925 — Nike Soccer Camp with Oglethorpe University
- prog-6bf93991 — Nike Tennis Camp at University of Illinois (June 7–15)
- prog-75eb7afe — Nike Tennis Camp at University of Illinois (June 11–15)

**Dangling separator + HTML entity decode** — 3 rows, both name and description:

- prog-c3c7ec39 — Nike Tennis Camp at Lewis & Clark College — name fixed; description `Lewis &amp; Clark` → `Lewis & Clark`
- prog-a8e6f255 — Nike Soccer Camp in Grayslake — name fixed; description `2024 &amp; 2025` → `2024 & 2025`
- prog-b5bc8353 — Robert Morris University Girls Soccer Camp — name fixed; description `Coach &amp; Camp Director` → `Coach & Camp Director`

**HTML entity decode only** — 1 row, description:

- prog-21b180da — Nike Soccer Camp in Schaumburg — `2024 &amp; 2025` → `2024 & 2025`

**Dangling separator + misspelling fix** — 1 row:

- prog-890b4f55 — Nike Soccer Camp St. Ignatius College Preparatory — name fixed; description `enviroment` → `environment`

## Needs Jeff

- **prog-22183417** — Nike Baseball Camp at Southeastern University. Description says "ages 6-13," structured fields say age_min 6 / age_max 8. Proposed: widen age_max to 13 to match description, but didn't want to guess which is authoritative. Name's dangling separator was fixed regardless.
- **prog-b26a9ad8** — Nike Tennis Camp at University of Hawaii, Manoa - Half Day Camp. Description is entirely about a separate "ADULT TENNIS CAMP" offering, not the youth camp the row represents (ages 6–18). Looks like the wrong description got attached during scraping. Needs a rewrite from the source page, not a guess.
- **prog-da4ebeb5** — Nike Volleyball Camp at Benedictine University - Little Volleys Half Day Camp. Description says "ages 7–18," structured fields say age_min 7 / age_max 12. Since the row name specifically says "Little Volleys" (implying a younger sub-camp), the structured 7–12 is plausibly correct and the description is generic boilerplate for the whole event — but that's a guess, so flagging instead of fixing.

## New rules earned

- **Missing space at scraper sentence-merge points.** Saw a description with two words jammed together (`hercoaching`) and another with two sentences fused across a stripped paragraph break (`campus living.Using a blend`, `game.Open to boys`). Only 2 rows this run, short of the 3-occurrence bar, but the pattern is mechanical: insert a space where a lowercase letter runs directly into an uppercase word, or where a `.` is immediately followed by a capital letter with no space and the preceding word isn't a known abbreviation. Worth watching — propose as an AUTO-FIX rule once it shows up 3+ times in a single run.

## Progress

- 300 of 1,972 approved rows audited (1,672 remaining).
- ~34 nights left at 50 rows/night.
- Projected completion: mid-September 2026 at current pace.
