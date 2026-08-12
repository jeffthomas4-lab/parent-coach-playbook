# Field Audit — 2026-08-11

50 audited, 32 fixed (40 fields), 11 clean, 7 need Jeff. 1,622 of 1,972 approved remaining — ~33 nights left at this pace.

Run ID: `cass-2026-08-11`

## Fixed

**Dangling separator fragments (name field)** — collapsed `" -  ("` to `" ("`. 28 rows, name only unless noted:

- prog-414509c7 — Nike Soccer Camp at University of Wisconsin - Parkside
- prog-2cf5f347 — Nike Soccer Camp at Claremont-Mudd-Scripps Colleges
- prog-0e68a6b6 — Nike Soccer Camp in Westlake - Austin
- prog-69fc895e — Nike Girls Soccer Camp at Academy of the Sacred Heart
- prog-4818463c — Nike Tennis Camp at Lewis & Clark College (name + description entity)
- prog-6f5213f6 — Nike Baseball Camp at Gwinnett Field, directed by Gwinnett Stripers
- prog-b6a16dbc — Nike Baseball Camp St. Ignatius College Preparatory
- prog-da959d64 — Nike Baseball Camp at Raimondi Park, directed by Oakland Ballers
- prog-56494ba6 — Nike Volleyball Camp at Arizona Christian University
- prog-6544e719 — Nike Boys Soccer Camp at University of Portland
- prog-6da2dd61 — Nike Soccer Camp St. Ignatius College Preparatory (name + description misspelling)
- prog-fad079f8 — Nike Soccer Camp at Minnesota State University Mankato (name + description entity)
- prog-f84e6529 — Nike Soccer Camp at Indian Woods Middle School
- prog-1e65d92a — Nike Soccer Camp at Brookfield Sports Complex (name + description entity)
- prog-50d30d95 — Nike Soccer Camp in Chicago (name + description entity)
- prog-22ae7778 — Nike Soccer Camp with Prospect Soccer Academy - Lake Forest
- prog-0d5fa534 — Nike Boys Soccer Camp at Montreat College
- prog-15119821 — Nike Soccer Camp at Northern Arizona University - Flagstaff
- prog-e9e55165 — Nike Girls College ID Soccer Camp - Kalamazoo College
- prog-a5b9ec5d — Nike Soccer Camp at University of Utah
- prog-675567d3 — Nike Tennis Camp at University of Illinois (June 11–19) — also flagged, see Needs Jeff
- prog-0771f216 — Nike Tennis Camp at University of Illinois (June 15–19) — also flagged, see Needs Jeff
- prog-7af9b9d6 — Nike Tennis Camp at The Tennis Academy of Utah
- prog-78fbc22a — Nike Baseball Camp Central Park (name + description entity x3)
- prog-a643c8d2 — Nike Baseball Camp at Eckerd College
- prog-b68d60a9 — Nike Soccer Camp at Sofive - Alameda
- prog-33edd94e — Nike Soccer Camp at Cabrillo College
- prog-bc339ccd — Nike Soccer Camp at Glendale Sports Complex

**HTML entity decode** (`&amp;` → `&`) — 8 rows, description only (beyond the ones already listed above with a name fix):

- prog-3bcfa102 — Nike Baseball Camp at Boise State University - Day Camp
- prog-089ca11b — Nike Baseball Camp at Boise State University - Overnight Camp
- prog-6d5cf5e2 — Nike Volleyball Camp in Austin - Individual Skills Camp
- prog-16214f54 — Nike Soccer Camp at Lake Forest Academy - Day Camp I
- prog-d5108745 — Nike Volleyball Camp in Austin - Serving & Passing Clinic
- prog-750cf3dd — Nike Soccer Camp at Seattle University - All Skills

**Misspelling** — `enviroment` → `environment`, 1 row (also had name fix, counted above):

- prog-6da2dd61 — Nike Soccer Camp St. Ignatius College Preparatory

## Needs Jeff

- **prog-393bfce5** — Nike Basketball Camp Salesian College Preparatory - High Intensity Camp. Structured `age_min`/`age_max` are both 3, but the description says "players entering 6th-8th grade" (typically ages 11–14). The 3/3 value looks like a scrape artifact, not a real age range. Didn't want to guess a replacement.
- **prog-b8b1eccc, prog-a8f52e15, prog-013ac229, prog-186613d5** — four sibling sessions of Nike Basketball Camp Winsor School - Complete Skills Camp (same description template, different dates/prices). `age_min` is 11 on all four, but the shared description also describes a "Player Development" tier for "ages 10 and under." Unclear whether the structured range should drop to cover that tier or if these specific sessions are High-Performance-only. Flagging once for the pattern, applies to all four IDs.
- **prog-675567d3, prog-0771f216** — two sibling Nike Tennis Camp at University of Illinois listings (same description). Description reads "Champagne-Urbana" — the University of Illinois is in Champaign-Urbana, IL, so this is almost certainly a typo. Not applying since it's a proper noun/place name and outside auto-fix authority. Proposed correction: "Champaign-Urbana." Names were fixed (dangling separator) regardless.

## New rules earned

- **Missing space at scraper sentence-merge points** — hit the 3x bar decisively tonight, ~23 instances across 8 rows: prog-7b971a15 (1), prog-22ae7778 (4: "environment.Prospect", "session.Held", "excellence.This", "environment.Hear"), prog-b8b1eccc/a8f52e15/013ac229/186613d5 (shared template, ~4 each), prog-d61dd15a and prog-f965b146 (shared template, "program.But"). Pattern: a `.` or `!` or `:` immediately followed by a capital letter with no space, where the preceding word isn't a known abbreviation. Proposing as AUTO-FIX for the next ruleset version: insert a single space at the merge point. None of these were applied tonight — logged only, per the 3x-this-run rule for new proposals.
- **Single-occurrence watch item, not yet a rule**: prog-78fbc22a has "PItching Consultant" (stray capital) in its description — one occurrence, below the 3x bar, not fixed.

## Progress

- 350 of 1,972 approved rows audited (1,622 remaining).
- ~33 nights left at 50 rows/night.
- Projected completion: mid-September 2026 at current pace.
