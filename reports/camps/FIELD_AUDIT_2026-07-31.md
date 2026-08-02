# Camp Field Audit — 2026-07-31

**50 audited, 34 fixed (50 fields), 4 clean, 12 need Jeff. 1,922 of 1,972 remaining — ~39 nights left.**

Run ID: `cass-2026-07-31`. First night of the full sweep (migration 0019 applied, RULESET_VERSION 1).

## Fixed

### Rule: dangling_separator_fragment (46 rows — name field)

Scraper left ` -  (` before the date parenthetical; collapsed to ` (`.

- 796ac566 — Nike Soccer Camp at Fore Kicks II Sports Complex — name
- 4b720d2f — Nike Soccer Camp at Framingham State University (Aug. camp) — name
- 285bdf82 — Nike Soccer Camp at Framingham State University (July 27–30) — name
- 3671d464 — Nike Soccer Camp at Bancroft School - Worcester — name
- e2d6eb3c — Nike Soccer Camp at Thayer Sports Center (June 29–July 2) — name
- e57d726e — Nike Soccer Camp at Thayer Sports Center (July 13–17) — name
- 05119f3d — Nike Soccer Camp at Georgetown High School — name
- cfdcb62b — Nike Soccer Camp with Soccer IQ Academy in Colorado Springs — name
- bbdada35 — Nike Soccer Camp with Soccer IQ Academy - High School Players - Westlands Park — name
- 6ccbf1fc — Nike Soccer Camp in Holmdel — name
- 6b6bd3ea — Nike Soccer Camp at Saint Leo University (June 1–5) — name
- 9ce52c94 — Nike Soccer Camp at Saint Leo University (June 22–26) — name
- 338fa831 — Nike Soccer Camp at Saint Leo University (July 27–31) — name
- d22f05c8 — Nike Soccer Camp with PDA Hibernians (June 28–July 2) — name
- 5bf3958a — Nike Soccer Camp with PDA Hibernians (Aug. 3–7) — name
- 1c787b1b — Nike Soccer Camp in Pennington — name
- 6844b25b — Nike Soccer Camp at Revolution Park in Charlotte — name
- ca4040fc — Nike Soccer Camp in Matthews — name
- 4390f3de — Nike Soccer Camp at Saint Anselm College — name
- 8beb293f — Nike Soccer Camp at Stevenson School - Pebble Beach (June 22–26) — name
- 046cef3a — Nike Soccer Camp at Stevenson School - Pebble Beach (July 13–17) — name
- b25443dc — Nike Soccer Camp in Frederick (June 29–July 3) — name
- e091213e — Nike Soccer Camp in Frederick (July 13–17) — name
- c9526fe2 — Nike Soccer Camp at Franklin Pierce University (June 22–26) — name
- 9fc3794d — Nike Soccer Camp at Franklin Pierce University (July 7–10) — name
- 9a25c9e8 — Nike Soccer Camp at Ranney School - Tinton Falls — name
- 20b7eaf1 — Nike Soccer Camp with Blue Devils Soccer Academy (June 29–July 2) — name
- 782f252c — Nike Soccer Camp with Blue Devils Soccer Academy (July 6–9) — name
- c5b75806 — Nike Soccer Camp at Northeast Regional Park in Davenport — name
- 5e865da2 — Nike Soccer Camp at Nazareth University — name
- 425c5ce8 — Nike Soccer Camp at North Park University — name
- 851a3831 — Nike Soccer Camp at Oklahoma Christian University (June 15–18) — name
- e1943f30 — Nike Soccer Camp at Oklahoma Christian University (June 22–25) — name
- e7328c57 — Nike Soccer Camp at Oklahoma Christian University (July 20–23) — name

(12 more dangling-separator fixes landed on rows also flagged `needs_human` for a second issue — see below.)

### Rule: html_entity_decode (4 rows — description field)

`&amp;` decoded to `&`.

- d22f05c8 — Nike Soccer Camp with PDA Hibernians — description
- 5bf3958a — Nike Soccer Camp with PDA Hibernians — description
- dff3a89c — Nike Soccer Camp in Chester Springs (Gold & Gray Soccer Academy) — description
- bdd86dac — Nike Soccer Camp at Centre Square Park (Gold & Gray Soccer Academy) — description

### Clean (4 rows, no defects)

a13afd69, 66fae216, 2e4a9691, 192a0322 — Nike Soccer Camp in Costa Mesa (I/II) and Nike Soccer Camp with Futeballer (All Skills / High School Players).

## Needs Jeff (12 rows)

Name separator was fixed on all 12; each also carries a second issue that needs a call.

**Off-taxonomy category, content says otherwise (8 rows)** — `activity_category` doesn't match what the camp actually is:

- dff3a89c — Nike Soccer Camp in Chester Springs — category is `baseball`, camp is soccer (Gold & Gray Soccer Academy). Propose: `soccer`.
- bdd86dac — Nike Soccer Camp at Centre Square Park — category is `baseball`, camp is soccer (same org). Propose: `soccer`.
- ea2959a4 — Nike Soccer Camp w/ French Football Federation - New Rochelle — category is `football`, camp is soccer (org name uses British "football"). Propose: `soccer`.
- 8d7ed156 — same org, Randall's Island (June 15–19) — category `football` → propose `soccer`.
- 5aa27d9c — same org, Randall's Island (June 22–26) — category `football` → propose `soccer`.
- 820980a3 — same org, Randall's Island (June 29–July 3) — category `football` → propose `soccer`.
- f26d1dc5 — same org, Randall's Island (Aug. 17–21) — category `football` → propose `soccer`.
- 770c5ed4 — same org, Randall's Island (Aug. 24–28) — category `football` → propose `soccer`.

**Brand-name inconsistency (2 rows)** — not touched, proper noun:

- 96a7cd6a — Nike Soccer Camp Presented by Salsa's11 - Apex (June 29–July 3) — name reads "Salsa's11" (no space), description consistently writes "Salsa's 11." Propose renaming to match.
- 7053d2f5 — same org, Apex (July 27–31) — same issue.

**Run-on text in description (1 row)**:

- 639c0f21 — Nike Soccer Camp in Kansas City — description reads "...Refine Soccer Training Kansas CityRefine Soccer Training strives..." — missing space/period at a sentence boundary. Propose inserting a period: "Kansas City. Refine Soccer Training strives..."

**Pronoun mismatch (1 row)**:

- 61d601ba — Nike Soccer Camp in Webster — description credits "Diana Groth, Assistant Women's Soccer Coach at Nazareth University, and **his** staff." Propose "her staff."

## New rules earned

- **French Football Federation org rows mistagged `football`.** Six of eight `activity_category` misfires tonight came from one organization whose name contains "Football" (British usage = soccer) but whose camps are tagged with PCD's American-football category. If this source keeps producing new listings, a source-specific remap (org "French Football Federation" → force category `soccer`) would catch it at submission instead of at audit.
- **Concatenated-sentence run-ons.** Saw one clear case tonight (Kansas City row) where a scraper glued two sentences with zero space/punctuation between them. Not the same defect as the double-space rule (rule 3) — that collapses 2+ spaces, this has 0. Worth watching for a second and third occurrence before writing an auto-fix rule; for now it's a needs_human case each time.

## Progress

1,922 of 1,972 approved rows remaining. At 50/night that's ~39 more nights — projected completion around 2026-09-08 if the run continues nightly without gaps.
