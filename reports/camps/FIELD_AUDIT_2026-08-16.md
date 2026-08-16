# Camps Field Audit — 2026-08-16

50 audited, 12 fixed (15 fields), 32 clean, 6 need Jeff. 1,422 of 1,972 remaining — ~29 nights left.

Run ID: `cass-2026-08-16`. RULESET_VERSION: 1.

## Fixed

**Dangling separator (`name`)** — collapsed ` -  (` to ` (`:

- prog-29d4cfed — Nike Girls Soccer Camp Sacred Heart University: "...University -  (June 25–28, 2026)" → "...University (June 25–28, 2026)"
- prog-52dbebdf — Nike Soccer Camp at Saint Johns Northwestern Academies: dangling separator fixed (also see entity fix below)
- prog-623f9b3e — Nike Soccer Camp at Ridgefield Academy: dangling separator fixed (also see entity fix below)
- prog-049460fe — Nike Soccer Camp in Bellevue: "...Bellevue -  (June 29–July 2, 2026)" → "...Bellevue (June 29–July 2, 2026)"
- prog-1a01043f — Nike Basketball Camp Mass Maritime Academy: "...Academy -  (June 29–July 2, 2026)" → "...Academy (June 29–July 2, 2026)"
- prog-5ced9f40 — Nike Baseball Camp at San Marcos High School: "...School -  (June 29–July 2, 2026)" → "...School (June 29–July 2, 2026)"
- prog-5c0ac193 — Nike Baseball Camp at University of San Francisco: "...Francisco -  (June 29–July 2, 2026)" → "...Francisco (June 29–July 2, 2026)"
- prog-329c2fb3 — Nike Baseball Camp at In The Net: "...Net -  (June 29–July 2, 2026)" → "...Net (June 29–July 2, 2026)"
- prog-46edc04b — Nike Baseball Camp St. Ignatius College Preparatory: "...Preparatory -  (June 29–July 2, 2026)" → "...Preparatory (June 29–July 2, 2026)"
- prog-8d6e1b82 — Nike Baseball Camp at Saint Joseph's University: "...University -  (June 29–July 2, 2026)" → "...University (June 29–July 2, 2026)"
- prog-75a93160 — Nike Volleyball Camp at Emmanuel College: "...College -  (June 29–July 2, 2026)" → "...College (June 29–July 2, 2026)"
- prog-1a008e85 — Nike Soccer Camp St. Ignatius College Preparatory: dangling separator fixed (also see misspelling fix below)

**HTML entity (`description`)** — decoded `&amp;` to `&`:

- prog-52dbebdf — Nike Soccer Camp at Saint Johns Northwestern Academies: "2024 &amp; 2025" → "2024 & 2025"
- prog-623f9b3e — Nike Soccer Camp at Ridgefield Academy: "Camp Director &amp; Founder" → "Camp Director & Founder"

**Misspelling (`description`)**:

- prog-1a008e85 — Nike Soccer Camp St. Ignatius College Preparatory: "competitive enviroment" → "competitive environment"

## Needs Jeff

- **prog-9e605791** — Nike Soccer Camp at Endicott College (Overnight Camp): `day_or_overnight` = "day" but the name and description describe a combined Girls Overnight + Coed Day listing. Proposed: change to "overnight" or "both". Not applied — not sure which is intended as the primary listing.
- **prog-2de9f911** — Nike Soccer Camp at Oak Brook Sports Core: `age_min`=10, `age_max`=22, but description states "ages 6-17." Proposed: age_min=6, age_max=17. Not applied — scraper source unclear which is right.
- **prog-3cfa501a** — Nike Basketball Camp Salesian College Preparatory (Complete Skills Camp): `age_min`=3, `age_max`=3 — implausible for a camp description referencing 6th-8th grade players. No age range given for the Complete Skills division specifically in the description, so no confident correction. Needs source check.
- **prog-f01c64c0** — Nike Tennis Camp at University of Denver (Day/Overnight Camp): `day_or_overnight` = "day" but this is explicitly a combined Day/Overnight listing. Proposed: "overnight" or "both". Not applied.
- **prog-0fe6dff6** — Nike Baseball Camp at University of Denver (Overnight Camp): `day_or_overnight` = "day" but the name explicitly says "Overnight Camp." Proposed: "overnight". Not applied.
- **prog-ed308cba** — Boys & Girls Club D.A. Gonyea Summer Program: `price`=0 and `price_type`='free', but `price_text` states "$215/week (reduced lunch $115/week, free lunch $65/week) plus $25 registration" — a sliding-scale price, not free. Proposed: price_type='per_week', price=215. Not applied — exact tier depends on family eligibility.

## New rules earned

**`day_or_overnight` contradicts the name/description.** Saw this 3 times tonight (prog-9e605791, prog-f01c64c0, prog-0fe6dff6) — all Nike Sports Camps listings where the row is `day_or_overnight='day'` but the name or description explicitly describes an overnight or combined day/overnight program. This looks like a scraper default (defaults every US Sports Camps row to "day" unless told otherwise) rather than a one-off. Proposed rule for RULESET_VERSION 2: if the name contains "Overnight" and `day_or_overnight='day'`, flag needs_human (or auto-correct to "overnight" if Jeff wants it mechanical — the case for combined listings like "Day/Overnight Camp" is genuinely ambiguous and should stay needs_human).

## Progress

1,422 of 1,972 approved rows remaining. At 50 rows/night: ~29 nights left, projected completion around 2026-09-14.
