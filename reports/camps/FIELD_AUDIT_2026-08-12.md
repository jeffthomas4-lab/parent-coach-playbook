# Camps field audit — 2026-08-12

50 audited, 25 fixed (33 fields), 17 clean, 8 need Jeff. 1,572 of 1,972 approved remaining — ~63 nights left at this pace.

run_id: `cass-2026-08-12`

## Fixed

### Dangling separator artifact (name) — rule `dangling_separator`, 29 rows

Scraper left `" -  ("` where a venue/session name was empty. Collapsed to `" ("`.

- prog-81681e84 "Nike Soccer Camp at University of Houston" — name: `...Houston -  (June 15–19, 2026)` → `...Houston (June 15–19, 2026)`
- prog-d51557a2 "Nike Soccer Camp at Admiral Farragut Academy" — same pattern, June 15–19
- prog-cc4ce171 "Nike Soccer Camp at Maryville University" — same pattern, June 15–19
- prog-615156d6 "Nike Soccer Camp at University of Charleston" — same pattern, June 15–19 (also see entity fix below)
- prog-ebbc4155 "College Soccer Academy iD Camp in Seattle - Girls" — same pattern, June 19 (also see entity fix below)
- prog-86e60a6e "Nike Soccer Camp at Benedictine University" — same pattern, June 19–21 (also flagged needs_human below)
- prog-6e3ae60b "Nike Soccer Camp at Albright College" — same pattern, June 18–21 (also flagged needs_human below)
- prog-1bee103b "Nike Boys Soccer Camp Sacred Heart University" — same pattern, June 21–24
- prog-c1385f12 "Nike Baseball Camp at Bosse Field" — same pattern, June 22–24
- prog-d012acea "Nike Girls Soccer Camp Sacred Heart University" — same pattern, June 21–24 (also flagged needs_human below)
- prog-13437000 "Nike Soccer Camp with Zico F.C. at Clement Park" — same pattern, June 22–25
- prog-2bdbc6c5 "Nike Soccer Camp in Bellevue" — same pattern, June 22–25
- prog-40737f76 "Nike Soccer Camp with Player ONE Performance - UC Santa Cruz" — same pattern (trailing), June 21–25 (also flagged needs_human below)
- prog-60d68501 "Nike Tennis Camp at Club at Sunset" — same pattern, June 22–25
- prog-801c43c2 "Nike Baseball Camp at Seattle University" — same pattern, June 22–25
- prog-841a5f32 "Nike Soccer Camp at Upper 90 - Forth Worth/Arlington" — same pattern (trailing), June 22–25
- prog-a5df475e "Nike Soccer Camp at University of Utah" — same pattern, June 22–25
- prog-05ebb9c5 "Nike Baseball Camp at University of La Verne" — same pattern, June 22–25
- prog-1e361dfc "Nike Baseball Camp at AdventHealth Stadium" — same pattern, June 23–25
- prog-62df7f38 "Nike Baseball Camp at San Marcos High School" — same pattern, June 22–25
- prog-73aa0843 "Nike Baseball Camp at University of San Francisco" — same pattern, June 22–25
- prog-b5e1778b "Nike Baseball Camp at Sierra Canyon School" — same pattern, June 22–25
- prog-e8144096 "Nike Soccer Camp at Wright State University" — same pattern, June 22–25
- prog-1fb6c4ce "Nike Girls Soccer Camp at University of Portland" — same pattern, June 22–25
- prog-34029a4a "Nike Soccer Camp at Concordia University - St. Paul" — same pattern (trailing), June 22–25
- prog-5c3d4a0a "Nike Boys Soccer Camp at University of Portland" — same pattern, June 22–25
- prog-873ba5ca "Nike Soccer Camps with 90+ Training - Marietta" — same pattern (trailing), June 22–25
- prog-ebc5f26d "Nike Soccer Camp at Worcester State University" — same pattern, June 22–25
- prog-ecd7a40c "Nike Soccer Camp at Ohio Wesleyan University" — same pattern, June 22–25 (also see entity fix below)

### HTML entity decode (description) — rule `html_entity`, 3 rows

- prog-615156d6 "Nike Soccer Camp at University of Charleston" — description: `2017 &amp; 2019 NCAA` → `2017 & 2019 NCAA`
- prog-ebbc4155 "College Soccer Academy iD Camp in Seattle - Girls" — description: `coaching &amp; recruiting` / `rules &amp; camps` → `coaching & recruiting` / `rules & camps`
- prog-ecd7a40c "Nike Soccer Camp at Ohio Wesleyan University" — description: `training &amp; skill instruction` → `training & skill instruction`

### Whitespace + misspelling (description) — rules `whitespace`, `misspelling_new`, 1 row

- prog-95d055bc "Puget Sound Non-contact Youth Football Camp" — collapsed a double space and trimmed trailing whitespace; fixed "Unviersity" → "University" (not yet on the misspelling list — see New rules earned). Also flagged needs_human below for category.

## Needs Jeff

- **prog-16da5164** "Logger Girls Flag Football Camp" — `activity_category = camp_general` but description is a flag football camp ("Four day flag football camp for girls at University of Puget Sound..."). Propose `football`. Not auto-fixed: `camp_general` isn't on the exact remap list.
- **prog-95d055bc** "Puget Sound Non-contact Youth Football Camp" — same category mismatch (`camp_general` vs. a non-contact football camp description). Propose `football`. Description whitespace/typo already fixed (see above).
- **prog-86e60a6e** "Nike Soccer Camp at Benedictine University" — description says "fully immersive overnight experience" and "overnight eligibility beginning at age 9," but `day_or_overnight = day`. Propose `overnight`.
- **prog-6e3ae60b** "Nike Soccer Camp at Albright College" — description says campers "live on campus, creating an immersive overnight camp experience," but `day_or_overnight = day`. Propose `overnight`.
- **prog-d012acea** "Nike Girls Soccer Camp Sacred Heart University" — description says campers "are housed in campus dormitories" in a "residential setting," but `day_or_overnight = day`. Propose `overnight`.
- **prog-069c0833** "Nike Baseball Camp at University of Denver - Overnight Camp" — name and description both explicitly describe an overnight camp, but `day_or_overnight = day`. The paired Day Camp listing (prog-0b8e1706) is correctly tagged `day`. Propose `overnight`.
- **prog-40737f76** "Nike Soccer Camp with Player ONE Performance - UC Santa Cruz" — description says "immersive overnight experience" and "this overnight Nike Soccer Camp," but `day_or_overnight = day`. Propose `overnight`.
- **prog-5b0641f6** "Nike Soccer Camp at Jessup University - Overnight" — name itself says "- Overnight," but `day_or_overnight = day`. The paired Day Camp listing (prog-91def404) is correctly tagged `day`. Propose `overnight`.

Not applied because `day_or_overnight` correction isn't on the current AUTO-FIX list — see New rules earned.

## New rules earned

- **`day_or_overnight` mismatch vs. name/description.** Hit 6 times this batch (86e60a6e, 6e3ae60b, d012acea, 069c0833, 40737f76, 5b0641f6), all in the same Nike Sports Camps / ussportscamps.com source, all mislabeled `day` when the name or description explicitly says "Overnight." Two paired rows (Day Camp variants of the same host site) were correctly tagged `day`, so this looks like a scraper defect specific to the Overnight variant, not a source-wide issue. Proposed rule: if name contains "- Overnight" or "Overnight Camp," or description contains "overnight camp," "overnight experience," or "housed in ... dormitories" / "residential," and `day_or_overnight = day`, flip to `overnight` (high confidence — auto-fixable next version).
- **"Unviersity" as a second transposition of University.** Same target word as the existing `Univeristy` → `University` rule but a different letter swap. Worth adding to the misspelling list alongside the existing entry.
- **Missing space after a sentence period ("word.Word").** Saw it twice (prog-1fb6c4ce: "...to help you improve.Players leave camp..."; prog-34029a4a: "...focused training.An amazing opportunity..."). Only 2 instances — below the 3+ threshold — flagging for awareness, not proposing a rule yet. Watch for a third occurrence.

## Progress

- Remaining: 1,572 of 1,972 approved rows still below RULESET_VERSION 1.
- Rate: 50 rows/night.
- Projected completion: ~63 more nightly runs (~mid-October 2026) at the current pace, unless batch size or cadence changes.
