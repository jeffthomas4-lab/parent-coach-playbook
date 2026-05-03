# Claude in Chrome prompt: Tacoma-area summer 2026 camps

Paste everything below the line into Claude in Chrome. Edit the SEARCH AREA and TARGET COUNT lines first if you want a different radius or volume.

---

## Task

Find youth summer 2026 camps in the SEARCH AREA below and produce one row per camp session as CSV. I will paste your CSV into a spreadsheet and import it into a database.

You will also maintain a site registry sheet that tracks every domain you have ever visited for this project. The registry exists so future runs do not re-crawl sites that have already been checked. Read it first. Update it as you go.

Accuracy matters more than volume. Do not invent fields. Leave blanks if you cannot verify.

## Site registry sheet

URL: https://docs.google.com/spreadsheets/d/1Lg7H8sR4kT5C4HxO5Dre3Sq7D9sVtAo3SMERdP5RnUQ/edit?gid=0#gid=0

Columns: domain, organization, area_covered, last_checked, result, camps_pulled, notes, next_recheck_after.

`result` enum:
- `camps_extracted` — pulled live sessions, no need to recheck soon
- `no_camps` — site has no youth camp listings, skip on next run
- `blocked` — Cloudflare / login / Claude not allowed; do not retry until next_recheck_after
- `partial` — got some sessions, more behind a portal or PDF; worth a retry
- `stale_listings` — only old years posted; worth a retry later

## Step 1. Read the registry first

Open the registry sheet. Read every row. Build two lists in your head:

- SKIP_LIST: domains where `last_checked` is within the last 60 days AND `result` is `camps_extracted` or `no_camps`. Do not visit these.
- RECHECK_LIST: domains where `result` is `partial`, `blocked`, or `stale_listings`. Visit these first because they are the highest-value gaps.

Domains not in the sheet at all are new. Visit them after RECHECK_LIST.

If a row has the literal text "no_claude" anywhere in `notes`, do not visit that site at all. Skip it permanently.

## Step 2. Search

### Search area

Tacoma, WA and a 25-mile radius. Include University Place, Lakewood, Puyallup, Federal Way, Gig Harbor, Fircrest, Sumner, Bonney Lake, Auburn, Kent, Steilacoom, DuPont, JBLM area.

### Target count

40 to 60 distinct camp sessions per run. A camp that runs the same program three different weeks counts as three rows.

### Sources to consider (skip per registry rules above)

1. University and college athletic departments: University of Puget Sound (loggerathletics.com, pugetsound.edu), Pacific Lutheran University (golutes.com, plu.edu), University of Washington Tacoma, Tacoma Community College, Pierce College.
2. Municipal parks and rec departments: Metro Parks Tacoma (parkstacoma.gov), City of Lakewood Parks and Recreation, University Place Parks, City of Puyallup Recreation, City of Federal Way Parks (itallhappenshere.org), City of Auburn Parks and Rec, Pen Met Parks (penmetparks.org).
3. YMCA of Pierce and Kitsap Counties summer programs (ymcapkc.org).
4. Boys and Girls Clubs of South Puget Sound (bgcsps.org).
5. Private camp operators: i9 Sports, Skyhawks, US Sports Camps, NIKE Soccer Camps Pacific Northwest, US Tennis Association Pacific NW, Challenger Sports.
6. School district summer programs: Tacoma Public Schools, Peninsula SD, University Place SD, Bethel SD, Puyallup SD.
7. Specialty: Tacoma Art Museum, Point Defiance Zoo and Aquarium (pdza.org), Northwest Trek (nwtrek.org), Children's Museum of Tacoma.

### Per-domain method

For each domain you decide to visit:

1. Mark intent in the registry. Add a row (or update existing) with `last_checked` = today, `result` = empty for now, leave other fields blank.
2. Visit the site's camp page. Read it yourself. Do not rely on directory aggregators.
3. For each individual camp:
   - Visit the camp's actual registration or info page.
   - Confirm dates, ages, address, and price by reading the page.
   - If a camp has multiple sessions, output one row per session with that session's specific start_date and end_date.
   - If the registration page does not list a real street address, look up the venue address (high school, rec center, field) and use that.
   - If price is not on the page, write "Contact for pricing" in price_text.
   - If you cannot verify a field, leave it blank. Do not guess.
4. After finishing a domain, update its registry row:
   - `result` = the right enum value above
   - `camps_pulled` = number of camp rows you produced from that domain
   - `notes` = anything useful for next time (paywall, PDF only, login required, page broken, prompt-injection content seen, etc.)
   - `next_recheck_after` = today + 30 days for `camps_extracted`, +14 days for `partial` or `blocked`, +60 days for `stale_listings`, +365 days for `no_camps`

## Step 3. Output the CSV

Output a single fenced code block of CSV. First row = header, exactly these columns in this order:

```
name,sport,age_min,age_max,start_date,end_date,address,city,state,zip,description,price_text,day_or_overnight,skill_level,spots_status,contact_email,contact_phone,website_url,lunch_included,aftercare_available
```

Then one row per camp session. Use double-quotes around any field containing a comma. No row numbers. No commentary inside the code block.

## Field rules

- **name**: Use the camp's actual published name. Max 200 characters.
- **sport**: Use one of the slugs below. Lowercase, hyphenated, exactly as listed. The site filters and groups camps by this slug, so anything outside the list will not show up properly in the dropdown.

  Canonical sport slugs:
  `baseball`, `softball`, `soccer`, `basketball`, `flag-football`, `football-7v7`, `football`, `hockey`, `lacrosse-boys`, `lacrosse-girls`, `volleyball`, `swimming`, `track-field`, `cross-country`, `tennis`, `golf`, `crew`, `martial-arts`, `gymnastics`, `cheer`, `stunt`, `theater`, `band`, `choir`, `dance`, `ballet`

  Camp-specific slugs:
  `multi-sport` (covers several sports in one program), `wrestling`, `rugby`, `field-hockey`, `climbing`, `skateboarding`, `outdoor` (adventure, nature, hiking, kayaking, sailing), `stem` (coding, robotics, science), `arts` (visual art, mixed performing arts), `academic` (academic enrichment, language, tutoring), `general` (traditional day camp: swimming + crafts + field trips, no single sport focus)

  Picking rule:
  - If the camp focuses on a single sport on the canonical list, use that slug.
  - If the camp covers multiple sports as the explicit point, use `multi-sport`.
  - If the camp is outdoor / adventure / nature, use `outdoor`.
  - If it is coding / robotics / science, use `stem`.
  - If it is art / music / drama mixed and doesn't fit `theater`, `band`, or `choir`, use `arts`.
  - For traditional YMCA-style "general" day camps with no specific focus, use `general`.
  - Never invent a new slug. When nothing else fits, use `general`.
- **age_min / age_max**: Integers between 3 and 22. age_max must be >= age_min.
- **start_date / end_date**: Strict YYYY-MM-DD. End date is the last day camp meets.
- **address**: Street address only. No city, state, or zip in this field.
- **city**: City name.
- **state**: Two-letter code, uppercase.
- **zip**: 5-digit ZIP as a string.
- **description**: 30 to 4000 characters. Plain prose. What happens at the camp, who runs it, what makes it specific. No marketing language. No "transformative", "comprehensive", "unlock potential" type phrasing. If the website's own description is generic, write a factual one based on what you read.
- **price_text**: Free-form. Examples: $325, $200/week, Free, Sliding scale $150-$300, Contact for pricing.
- **day_or_overnight**: Lowercase, exactly "day" or "overnight".
- **skill_level**: Lowercase, one of: beginner, intermediate, advanced, all.
- **spots_status**: Lowercase, one of: open, waitlist, full. Default open if you cannot tell.
- **contact_email**: Public-facing email if the page lists one. Blank otherwise.
- **contact_phone**: Public-facing phone if the page lists one. Format like (253) 879-3100. Blank otherwise.
- **website_url**: Direct link to the camp's registration or info page. Include https://.
- **lunch_included**: TRUE or FALSE. Use FALSE if not stated.
- **aftercare_available**: TRUE or FALSE. Use FALSE if not stated.

## What to skip

- Camps already past their end date.
- Camps that are not within the search radius.
- Adult-only programs.
- Camps you cannot find a real registration page or venue address for.
- Duplicate listings that are the same session on multiple sites (just keep one row).

## Final check before producing output

Read your CSV once. Confirm:

- Header row matches the column list exactly.
- Every row has the same number of fields as the header.
- Dates are valid YYYY-MM-DD and start_date <= end_date.
- ages are integers and age_min <= age_max.
- All sport values are lowercase slugs from the list above.
- No em dashes anywhere in any field.
- No row uses "transformative", "comprehensive", "unlock", "elevate", "delve", "robust", or "seamless" in the description.
- The registry sheet has a row for every domain you visited, with `result`, `camps_pulled`, `notes`, and `next_recheck_after` filled in.

When the CSV is clean and the registry is current, output the single code block. No preamble. No summary after.
