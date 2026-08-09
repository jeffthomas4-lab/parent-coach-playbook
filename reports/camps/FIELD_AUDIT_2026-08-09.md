# Field Audit — 2026-08-09

50 audited, 19 fixed (38 fields), 5 clean, 26 need Jeff. 1,772 of 1,972 remaining — ~36 nights left (projected completion ~2026-09-14).

Run ID: `cass-2026-08-09`

## Fixed

**dangling_separator_fragment** (name field, 38 rows) — collapsed ` -  (` to ` (`:

- 2dcc3da0 — Nike Soccer Camp in Park City — "...City -  (July 6–10, 2026)" → "...City (July 6–10, 2026)"
- 31c512dc — Nike Soccer Camp in Park City — "...City -  (July 13–17, 2026)" → "...City (July 13–17, 2026)"
- 41302de0 — Nike Soccer Camp in Park City — "...City -  (June 15–19, 2026)" → "...City (June 15–19, 2026)"
- 5f7c1d88 — Nike Soccer Camp at Eastern Florida State College — "...College -  (July 13–17, 2026)" → "...College (July 13–17, 2026)"
- 8a828049 — Nike Girls Soccer Camp at Purdue University — "...University -  (June 21–24, 2026)" → "...University (June 21–24, 2026)"
- adc8b082 — Nike Soccer Camp at Eastern Florida State College — "...College -  (July 6–10, 2026)" → "...College (July 6–10, 2026)"
- bbe39179 — Nike Soccer Camp in Park City — "...City -  (June 29–July 3, 2026)" → "...City (June 29–July 3, 2026)"
- bce96747 — Nike Soccer Camp with Ole Soccer - Trumbull — "...Trumbull -  (Aug. 3–7, 2026)" → "...Trumbull (Aug. 3–7, 2026)"
- f0b271d6 — Nike Soccer Camp with Ole Soccer - Trumbull — "...Trumbull -  (July 27–31, 2026)" → "...Trumbull (July 27–31, 2026)"
- 1c2f955f — Nike Soccer Camp powered by Steel Sports - Olin College — "...College -  (June 22–25, 2026)" → "...College (June 22–25, 2026)"
- 1f99de5e — Nike Soccer Camp at Snohomish Sports Dome — "...Dome -  (July 7–9, 2026)" → "...Dome (July 7–9, 2026)"
- 3d463d4d — Nike Soccer Camp at Eastern Florida State College — "...College -  (July 20–24, 2026)" → "...College (July 20–24, 2026)"
- 4097038f — Nike Soccer Camp in Cape Cod — "...Cod -  (July 13–16, 2026)" → "...Cod (July 13–16, 2026)"
- 60115921 — Nike Soccer Camp powered by Steel Sports - Olin College — "...College -  (July 20–23, 2026)" → "...College (July 20–23, 2026)"
- 939408f3 — Nike Soccer Camp powered by Steel Sports - Olin College — "...College -  (Aug. 10–13, 2026)" → "...College (Aug. 10–13, 2026)"
- c9b1c319 — Nike Soccer Camp in Georgetown — "...Georgetown -  (June 22–26, 2026)" → "...Georgetown (June 22–26, 2026)"
- d3526cfe — Nike Soccer Camp in Cape Cod — "...Cod -  (July 20–23, 2026)" → "...Cod (July 20–23, 2026)"
- 0db008c9 — Nike Soccer Camp in Toms River — "...River -  (Aug. 10–14, 2026)" → "...River (Aug. 10–14, 2026)"
- 47a11c48 — Nike Soccer Camp at Lovett School — "...School -  (June 8–12, 2026)" → "...School (June 8–12, 2026)"
- 288386ef — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (July 6–10, 2026)" → "...Course (July 6–10, 2026)"
- 4504f2b7 — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (July 27–31, 2026)" → "...Course (July 27–31, 2026)"
- 49e49e24 — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (June 29–July 3, 2026)" → "...Course (June 29–July 3, 2026)"
- 57c5812b — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (June 8–12, 2026)" → "...Course (June 8–12, 2026)"
- 84b3fe6b — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (June 15–19, 2026)" → "...Course (June 15–19, 2026)"
- 8ae51a15 — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (Aug. 3–7, 2026)" → "...Course (Aug. 3–7, 2026)"
- 91208560 — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (Aug. 10–14, 2026)" → "...Course (Aug. 10–14, 2026)"
- 98fbb874 — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (June 22–26, 2026)" → "...Course (June 22–26, 2026)"
- c5deabcb — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (July 20–24, 2026)" → "...Course (July 20–24, 2026)"
- 06978404 — Nike Golf Camp at Arcadia Golf Course — "...Course -  (June 22–26, 2026)" → "...Course (June 22–26, 2026)"
- 25ba6960 — Nike Golf Camp at Arcadia Golf Course — "...Course -  (July 13–17, 2026)" → "...Course (July 13–17, 2026)"
- 292a18b4 — Nike Golf Camp at Arcadia Golf Course — "...Course -  (July 6–10, 2026)" → "...Course (July 6–10, 2026)"
- 5f02a4cd — Nike Golf Camp at Arcadia Golf Course — "...Course -  (June 8–12, 2026)" → "...Course (June 8–12, 2026)"
- 62a8ae53 — Nike Golf Camp at Arcadia Golf Course — "...Course -  (June 1–5, 2026)" → "...Course (June 1–5, 2026)"
- 98e08f8b — Nike Golf Camp at Arcadia Golf Course — "...Course -  (July 20–24, 2026)" → "...Course (July 20–24, 2026)"
- 9dd0c0bc — Nike Golf Camp at Arcadia Golf Course — "...Course -  (Aug. 3–7, 2026)" → "...Course (Aug. 3–7, 2026)"
- a80f44e0 — Nike Golf Camp at Rancho San Joaquin Golf Course — "...Course -  (July 13–17, 2026)" → "...Course (July 13–17, 2026)"
- b7d0dbfb — Nike Golf Camp at Arcadia Golf Course — "...Course -  (July 27–31, 2026)" → "...Course (July 27–31, 2026)"
- e95beb6f — Nike Golf Camp at Arcadia Golf Course — "...Course -  (June 15–19, 2026)" → "...Course (June 15–19, 2026)"

19 of these 38 (all the Rancho San Joaquin and Arcadia golf rows) are logged `needs_human` below for a second, unresolved issue — the category flag.

## Needs Jeff

**Off-taxonomy `activity_category = 'golf'` — 26 rows.** Golf has no canonical slug in the 24-category enum per the quality framework; this is a known taxonomy gap, not a data typo, so nothing was auto-remapped. Tonight's batch happened to be almost entirely US Sports Camps' Nike golf inventory (Rancho San Joaquin GC and Arcadia GC), which surfaced nearly all of the ~28 golf rows documented in the framework in one run:

- 08a4252b, 1c316afb, 30a6024f, 696f5dc3, cbae7c85, ffdf987b, 3ad59544 — Nike Golf Camp at Peacock Gap Golf Club (7 sessions, name already clean)
- 288386ef, 4504f2b7, 49e49e24, 57c5812b, 84b3fe6b, 8ae51a15, 91208560, 98fbb874, c5deabcb, a80f44e0 — Nike Golf Camp at Rancho San Joaquin Golf Course (10 sessions, name fixed above)
- 06978404, 25ba6960, 292a18b4, 5f02a4cd, 62a8ae53, 98e08f8b, 9dd0c0bc, b7d0dbfb, e95beb6f — Nike Golf Camp at Arcadia Golf Course (9 sessions, name fixed above)

Proposal: either widen the enum to add `golf` as its own canonical slug, or remap it into an existing catch-all if one exists. Given this is now ~26 of ~28 total golf rows in one place, this is worth deciding now rather than letting it re-surface piecemeal — it would likely close out the entire golf backlog in one pass once Jeff picks a slug.

## New rules earned

None new tonight. The golf taxonomy gap is already documented in the framework (rule 5, off-taxonomy categories with no canonical home) — this run just confirms it's real volume, not a one-off.

## Progress

- Remaining: 1,772 of 1,972 approved rows still queued (`data_audit_version < 1`).
- Pace: 50 rows/night.
- Projected completion: ~36 more nightly runs, around 2026-09-14.
