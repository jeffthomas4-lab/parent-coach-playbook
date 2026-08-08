# Field Audit — 2026-08-07

50 audited, 43 fixed (44 fields), 7 clean, 5 need Jeff. 1,822 of 1,972 remaining — ~37 nights left (projected completion ~2026-09-13).

Run ID: `cass-2026-08-07`

## Fixed

**dangling_separator_fragment** (name field, 42 rows) — collapsed ` -  (` to ` (`:

- 6c9d97c4 — Nike Soccer Camp at Charlotte Prep School — "...School -  (June 22–26, 2026)" → "...School (June 22–26, 2026)"
- 09547311 — Nike Soccer Camp at Charlotte Prep School — "...School -  (July 27–31, 2026)" → "...School (July 27–31, 2026)"
- bc64f5b3 — Nike Soccer Camp with SoCal Reds FC - Irvine — "...Irvine -  (June 8–12, 2026)" → "...Irvine (June 8–12, 2026)"
- 7f4ebc0c — Nike Soccer Camp with SoCal Reds FC - Irvine — "...Irvine -  (Aug. 3–7, 2026)" → "...Irvine (Aug. 3–7, 2026)"
- aee2e06b — Nike Girls Soccer Camp at Wartburg College — "...College -  (June 26–28, 2026)" → "...College (June 26–28, 2026)"
- 12578844 — Nike Boys Soccer Camp at Wartburg College — "...College -  (July 17–19, 2026)" → "...College (July 17–19, 2026)"
- b6adde34 — Nike Soccer Camp w/ French Football Federation, Pier 5 Brooklyn — "...Park -  (July 6–10, 2026)" → "...Park (July 6–10, 2026)"
- 0eb4239d — same venue — "...Park -  (July 13–17, 2026)" → "...Park (July 13–17, 2026)"
- dbc47634 — same venue — "...Park -  (July 20–24, 2026)" → "...Park (July 20–24, 2026)"
- 23532389 — same venue — "...Park -  (July 27–31, 2026)" → "...Park (July 27–31, 2026)"
- 13b0f056 — Nike Soccer Camp at Kalamazoo College — "...College -  (June 15–18, 2026)" → "...College (June 15–18, 2026)"
- 965aebb1 — Nike Soccer Camp at Kalamazoo College — "...College -  (Aug. 3–6, 2026)" → "...College (Aug. 3–6, 2026)"
- 2296b568 — Nike Soccer Camp in Murfreesboro — "...Murfreesboro -  (June 1–5, 2026)" → "...Murfreesboro (June 1–5, 2026)"
- e7ca99c7 — Nike Soccer Camp in Murfreesboro — "...Murfreesboro -  (July 27–31, 2026)" → "...Murfreesboro (July 27–31, 2026)"
- 2136a504 — Nike Soccer Camp in Norwalk — "...Norwalk -  (June 22–26, 2026)" → "...Norwalk (June 22–26, 2026)"
- e80de929 — Nike Soccer Camp in Norwalk — "...Norwalk -  (July 27–31, 2026)" → "...Norwalk (July 27–31, 2026)"
- 4f7b4f81 — Nike Soccer Camp in Ankeny — "...Ankeny -  (June 29–July 3, 2026)" → "...Ankeny (June 29–July 3, 2026)"
- bf54aa21 — Nike Soccer Camp in Ankeny — "...Ankeny -  (July 13–17, 2026)" → "...Ankeny (July 13–17, 2026)"
- c98612f5 — Nike Soccer Camp at Lincoln University of Missouri — "...Missouri -  (June 29–July 2, 2026)" → "...Missouri (June 29–July 2, 2026)"
- 3a1c6214 — Nike Soccer Camp at Westtown School — "...School -  (July 20–24, 2026)" → "...School (July 20–24, 2026)"
- ee89af83 — Nike Soccer Camp at Iron Peak Sports & Events — "...Events -  (July 13–17, 2026)" → "...Events (July 13–17, 2026)"
- 8a840ebc — Nike Soccer Camp in Hillsboro — "...Hillsboro -  (June 15–18, 2026)" → "...Hillsboro (June 15–18, 2026)"
- e6da9085 — Nike Soccer Camp in Hillsboro — "...Hillsboro -  (June 29–July 3, 2026)" → "...Hillsboro (June 29–July 3, 2026)"
- 441efacd — Nike Soccer Camp w/ UK Soccer School at Austin Peace Academy — "...Academy -  (June 1–5, 2026)" → "...Academy (June 1–5, 2026)"
- ce2f39bb — same camp — "...Academy -  (July 27–31, 2026)" → "...Academy (July 27–31, 2026)"
- b962757c — Nike Soccer Camp in Keller — "...Keller -  (June 15–18, 2026)" → "...Keller (June 15–18, 2026)"
- 5782d33d — Nike Soccer Camp at Greensboro Day School — "...School -  (July 13–17, 2026)" → "...School (July 13–17, 2026)"
- ef0044ed — Nike Soccer Camp at Greensboro Day School — "...School -  (July 27–31, 2026)" → "...School (July 27–31, 2026)"
- 1bcc6081 — Nike Soccer Camp Portland State University — "...University -  (June 22–26, 2026)" → "...University (June 22–26, 2026)"
- 21cf02fb — Nike Soccer Camp Portland State University — "...University -  (July 6–10, 2026)" → "...University (July 6–10, 2026)"
- cd265e3f — The Soccer Academy at University of Washington — "...Washington -  (July 20–23, 2026)" → "...Washington (July 20–23, 2026)"
- 4c970f10 — The Soccer Academy at University of Washington — "...Washington -  (July 27–30, 2026)" → "...Washington (July 27–30, 2026)"
- ddabe0af — Nike Soccer Camp in Burnt Hills — "...Hills -  (Aug. 10–14, 2026)" → "...Hills (Aug. 10–14, 2026)"
- d4463160 — Nike Soccer Camp in Fort Mill — "...Mill -  (June 8–12, 2026)" → "...Mill (June 8–12, 2026)"
- c11cde80 — Nike Soccer Camp in Fort Mill — "...Mill -  (July 6–10, 2026)" → "...Mill (July 6–10, 2026)"
- 003b5c5d — Nike Soccer Camp in Hagerstown Fieldhouse — "...Fieldhouse -  (June 29–July 3, 2026)" → "...Fieldhouse (June 29–July 3, 2026)"
- c82c5deb — Nike Soccer Camp at the University of Hartford — "...Hartford -  (July 6–10, 2026)" → "...Hartford (July 6–10, 2026)"
- 24d43907 — Nike Soccer Camp at the University of Hartford — "...Hartford -  (July 13–17, 2026)" → "...Hartford (July 13–17, 2026)"
- 5357ca88 — Nike Soccer Camp at Westminster University — "...University -  (July 13–16, 2026)" → "...University (July 13–16, 2026)"
- a93b29c2 — Nike Indoor Soccer Camp at Rancho Solano Preparatory School — "...School -  (June 8–12, 2026)" → "...School (June 8–12, 2026)"
- 018a1a87 — Nike Soccer Camp at George Fox University — "...University -  (June 22–25, 2026)" → "...University (June 22–25, 2026)"
- 6afb2e63 — Nike Soccer Camp at George Fox University — "...University -  (July 27–30, 2026)" → "...University (July 27–30, 2026)"

**html_entity_decode** (description field, 2 rows) — `&amp;` → `&`:

- 3a1c6214 — Nike Soccer Camp at Westtown School — "Justin Marriott &amp; his True Balance..." → "Justin Marriott & his True Balance..."
- ee89af83 — Nike Soccer Camp at Iron Peak Sports & Events — "Iron Peak Sports &amp; Events" and "Justin Marriott &amp; his" → both decoded to `&`

Rows b6adde34, 0eb4239d, dbc47634, 23532389 got the name fix above but are logged `needs_human` below for a second, unresolved issue — the category flag.

## Needs Jeff

- **b6adde34** — Nike Soccer Camp with the French Football Federation, Pier 5 Brooklyn Bridge Park (July 6–10). `activity_category = football` but the name and description are unambiguously soccer ("Nike Soccer Camp," "soccer training camp," French football federation = soccer in French usage). Propose `activity_category = soccer`. Not applied — no exact remap rule covers "football → soccer" and I don't auto-correct category drift outside the four listed remaps.
- **0eb4239d** — same camp, July 13–17 session. Same issue, same proposed fix.
- **dbc47634** — same camp, July 20–24 session. Same issue, same proposed fix.
- **23532389** — same camp, July 27–31 session. Same issue, same proposed fix.
- **d8f04f00** — Nike Soccer Camp in Livermore - Day Camp (June 22–26). `age_min/age_max` = 8–16, but description reads "young athletes aged 6-16." One of the two is wrong and I can't tell which without the source page — propose `age_min = 6` to match the description, but did not apply. Flagging in case the age fields are the actual scrape target and the description is boilerplate copy shared across other Nike camps.

## New rules earned

None yet — only one instance of the age-field-vs-description mismatch (d8f04f00) tonight, below the 3-occurrence bar for a proposed rule. Watching for repeats; if it recurs, propose an AUTO-FIX-adjacent rule: when a description states an explicit age range and it disagrees with `age_min`/`age_max`, flag `needs_human` (same treatment as price/price_text disagreement).

## Progress

- Remaining: 1,822 of 1,972 approved rows still queued (data_audit_version < 1).
- Pace: 50 rows/night.
- Projected completion: ~37 more nightly runs, around 2026-09-13.
