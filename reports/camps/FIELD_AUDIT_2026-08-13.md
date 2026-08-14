# Camps field audit — 2026-08-13

50 audited, 9 fixed (11 fields), 40 clean, 1 need Jeff. 1,522 of 1,972 approved remaining — ~31 nights left at this pace.

run_id: `cass-2026-08-13`

## Fixed

### Dangling separator artifact (name) — rule `dangling_separator_fragment`, 9 rows

Scraper left `" -  ("` where a venue/session name was empty. Collapsed to `" ("`.

- prog-479d13dc "Nike Soccer Camp in Lake Geneva" — name: `...Lake Geneva -  (June 22–26, 2026)` → `...Lake Geneva (June 22–26, 2026)` (also see entity fix below)
- prog-85ab2438 "Nike Soccer Camp at Cabrillo College" — same pattern, June 22–26
- prog-1471437e "Nike Soccer Camp at Biola University" — same pattern, June 22–26
- prog-762ff378 "Nike Soccer Camp in Vallejo" — same pattern, June 22–26
- prog-1f3c8e9e "Nike Soccer Camp with Prospect Soccer Academy - Laguna Niguel" — same pattern (trailing), June 22–26
- prog-03d20ae8 "Nike Soccer Camp in Springfield" — same pattern, June 22–26 (also see entity fix below)
- prog-7cc6d454 "Nike Soccer Camp at Gettysburg College" — same pattern, June 22–26
- prog-15c51f27 "Nike Soccer Camp with Next Star at Howard University" — same pattern, June 22–26
- prog-09f79e68 "Nike Basketball Camp Game Time at the Grounds" — same pattern, June 22–26

### HTML entity decode (description) — rule `html_entity_decode`, 2 rows

- prog-479d13dc "Nike Soccer Camp in Lake Geneva" — description: `2024 &amp; 2025 by players` → `2024 & 2025 by players`
- prog-03d20ae8 "Nike Soccer Camp in Springfield" — same template text, same fix

## Needs Jeff

- **prog-4670313f** "Boys & Girls Club Lakewood Summer Program - Week 1" — `price = 0` and `price_type = free`, but `price_text = "$215/week (reduced lunch $115/week, free lunch $65/week) plus $25 registration"`. This isn't actually a free camp; the free/reduced tiers are lunch-based financial aid, not the base price. Propose `price = 215`, `price_type = per_session`, and keep `price_text` as is. Not applied — this is a judgment call on which number is "the" price, not a mechanical fix.

## New rules earned

- **Missing space after sentence-ending punctuation before a capitalized word ("word!Word", "word:Word").** Hit repeatedly tonight across 7 rows sharing the ASA/Nike Basketball (Saint Anselm College, Winsor School) template — e.g. "new themed weeks!Shooting and Scoring Week", "Games Week:Get ready for non-stop action", "score big!Contest and Games Week." All from the same `ussportscamps.com` source template. The 2026-08-12 report flagged this pattern twice and held it below the 3+ threshold; tonight's run clears that bar. Proposed rule: insert a single space where `[.!?:]` is immediately followed by an uppercase letter with no space between, description field only, high confidence (auto-fixable next version).
- **DB Skimboarding Camp tagged `camp_general` instead of a sport-specific category.** Single occurrence tonight (prog-b4cf3a79), not yet a pattern — noting for awareness, not proposing a rule. `camp_general` isn't wrong per the current taxonomy, just non-specific; watch for repeats before proposing a remap.

## Progress

- Remaining: 1,522 of 1,972 approved rows still below RULESET_VERSION 1.
- Rate: 50 rows/night.
- Projected completion: ~31 more nightly runs (~mid-September 2026) at the current pace, unless batch size or cadence changes.
