# Camps Field Audit — 2026-08-09

50 audited, 19 fixed (28 fields), 29 clean, 2 need Jeff. 1,722 of 1,972 remaining — ~35 nights left.

Run ID: `cass-2026-08-09`. Ruleset version: 1.

## Fixed

**Dangling separator fragments** (name, rule `dangling_separator_fix`) — 13 rows, name only:

- prog-53842831 — Nike Girls Soccer College iD Camp at University of San Diego — "...San Diego -  (May 9, 2026)" → "...San Diego (May 9, 2026)"
- prog-485af822 — Nike Tennis Camp at Auburn University — "...University -  (May 31–June 3, 2026)" → "...University (May 31–June 3, 2026)"
- prog-6db67905 — Nike Baseball Camp at The Ballpark, directed by Biloxi Shuckers — "...Shuckers -  (June 1–3, 2026)" → "...Shuckers (June 1–3, 2026)"
- prog-37b105bb — Nike Soccer Camp at Soccer Spectrum - Dallas — "...Dallas -  (June 1–4, 2026)" → "...Dallas (June 1–4, 2026)"
- prog-06e59623 — Nike Baseball Camp in Salt Lake City — "...City -  (June 1–4, 2026)" → "...City (June 1–4, 2026)"
- prog-e191040e — Nike Girls Soccer Camp Southeastern University — "...University -  (May 31–June 4, 2026)" → "...University (May 31–June 4, 2026)"
- prog-7f713a5a — Nike Boys Soccer Camp Southeastern University — same fix
- prog-8b255f44 — Nike Soccer Camp at Crossbar Academy - Tomball — "...Tomball -  (June 1–5, 2026)" → "...Tomball (June 1–5, 2026)"
- prog-ac3b55b2 — Nike Soccer Camp with Idaho Surf in Meridian — "...Meridian -  (June 1–5, 2026)" → "...Meridian (June 1–5, 2026)"
- prog-265ce510 — Nike Soccer Camp with JM Soccer Academy in Henderson — same fix
- prog-f8ce3b5f — Nike Soccer Camp at Admiral Farragut Academy — same fix
- prog-5316ff83 — Nike Soccer Camp at Dallas College - North Lake — "...North Lake -  (June 1–5, 2026)" → "...North Lake (June 1–5, 2026)"
- prog-b14411d3 — Nike Soccer Camp at Maryville University — same fix

**Dangling separator (name) + HTML entities (description)** — 5 rows:

- prog-0020da1a — College Soccer Academy ID Camp in Camarillo - Girls — name fix; description `&amp;` → `&` (2 instances)
- prog-258e74f3 — College Soccer Academy ID Camp in Camarillo - Boys — same
- prog-bd930455 — Nike Soccer Camp at Christ Presbyterian Academy — name fix; description `&amp;` → `&` (1 instance, "Boys & Girls Varsity Coach")
- prog-c3336e27 — Nike Soccer Camp at Agnes Scott College — name fix; description `&amp;` → `&` (4 instances, quoted director text)
- prog-ce26d1d0 — Nike Soccer & Swim Camp with HUB Sports at Windgate Ranch — name fix; description `&amp;` → `&` (1 instance, "Soccer & Swim program")

**HTML entities only:**

- prog-2f360774 — Nike Soccer Camp at Sofive Elkins Park - Free Clinic — description `&amp;` → `&` (2 instances, "Gold & Gray Soccer Academy")

## Needs Jeff

- **64c7eb46** / **f5c3bcd0** — Nike Golf Camp at Links and Tees Golf Facility (two sessions, June 8–12 and June 15–19). Name and description defects already fixed (dangling separator, HTML entities). `activity_category = 'golf'` has no canonical slug — the live 24-slug enum (`arts, arts_crafts, baseball_softball, basketball, camp, camp_arts, camp_general, camp_sports, camp_stem, coding_stem, dance, football, gymnastics, martial_arts, music, other, soccer, sports, stem, swimming, tennis, theater, track_field, volleyball`) has nothing for golf. This is the same taxonomy gap noted in the standing framework (~28 golf rows total across the directory). Your call: widen the enum to add `golf`, or remap to `sports`/`camp_sports`/`other`. Left untouched pending that decision.

## New rules earned

Nothing hit the 3+ threshold tonight. One near-miss worth flagging for pattern-watching, not yet a rule: prog-6db67905's description has a missing space after a period ("...competitive environment.Campers will learn...") — a run-on from HTML-tag stripping. Only seen once this batch; not auto-fixed since it's outside the current ruleset and risks over-fixing abbreviations elsewhere. Worth a rule ("missing space after period between sentences") if it recurs.

Also confirmed via `activity_categories` table lookup that `soccer` (285 approved rows) and `baseball_softball` are both canonical — no action needed on those, despite superficially resembling the golf gap.

## Progress

- Remaining: 1,722 of 1,972 approved rows still need a first pass.
- Pace: 50 rows/night.
- Projected completion: ~35 more nightly runs, around 2026-09-13.
