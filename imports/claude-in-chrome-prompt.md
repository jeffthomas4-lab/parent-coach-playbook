# Claude in Chrome prompt: parentcoachplaybook camps search

Paste everything below the line into Claude in Chrome. Edit the SEARCH AREA and TARGET COUNT lines first if you want a different radius or volume. The prompt fetches the live search log from GitHub, so as long as the repo is up to date, Chrome will see the current registry and avoid re-crawled domains automatically.

---

## Task

Find youth camps AND leagues in the SEARCH AREA below and produce CSV rows. Camps are time-bounded sessions (1 day to 2 weeks). Leagues are recurring seasons with practices and games (typically 8-16 weeks). Both go into the same database with a `program_type` column. I will paste your CSV(s) into a spreadsheet and import them.

You will also maintain a search log file that tracks every anchor area we have searched and every domain we have ever visited for this project. The log exists so future runs do not re-crawl sites that have already been checked. Read it first. Output the updated log entries at the end of your run so I can paste them in.

Accuracy matters more than volume. Do not invent fields. Leave blanks if you cannot verify.

## Search log file

URL (read this directly, this is the live registry):

  https://raw.githubusercontent.com/jeffthomas4-lab/parent-coach-playbook/main/imports/CAMP-SEARCH-LOG.md

Navigate to that URL and read the file. Three sections matter:

1. **Search Areas** — pick the next anchor city from the `Expansion path` if I haven't named one, or confirm the SEARCH AREA below matches an existing row.
2. **Domain Registry** — every domain visited so far. Build the SKIP_LIST and RECHECK_LIST from this table (see Step 1).
3. **Permanent skip list** — never visit these domains regardless of date.

Domain Registry columns: `domain | organization | area_covered | last_checked | result | camps_pulled | next_recheck_after | notes`.

`result` enum:
- `camps_extracted` — pulled live sessions, no need to recheck soon
- `no_camps` — site has no youth camp listings, skip on next run
- `blocked` — Cloudflare / login / Claude not allowed; do not retry until next_recheck_after
- `partial` — got some sessions, more behind a portal or PDF; worth a retry
- `stale_listings` — only old years posted; worth a retry later

## Step 1. Read the log first

Open the URL above. Read every Domain Registry row. Build two lists in your head:

- SKIP_LIST: domains where `last_checked` is within the last 60 days AND `result` is `camps_extracted` or `no_camps`. Do not visit these.
- RECHECK_LIST: domains where `result` is `partial`, `blocked`, or `stale_listings`. Visit these first because they are the highest-value gaps.

Domains not in the registry at all are new. Visit them after RECHECK_LIST.

If a row has the literal text `no_claude` anywhere in `notes`, or the domain appears in the `Permanent skip list`, do not visit that site at all. Skip it permanently.

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

1. Hold the intent in your working list. (You will write the final row to the log at the end of the run, not edit the file mid-search.)
2. Visit the site's camp page. Read it yourself. Do not rely on directory aggregators.
3. For each individual camp:
   - Visit the camp's actual registration or info page.
   - Confirm dates, ages, address, and price by reading the page.
   - If a camp has multiple sessions, output one row per session with that session's specific start_date and end_date.
   - If the registration page does not list a real street address, look up the venue address (high school, rec center, field) and use that.
   - If price is not on the page, write "Contact for pricing" in price_text.
   - If you cannot verify a field, leave it blank. Do not guess.
4. After finishing a domain, hold a registry update with:
   - `result` = the right enum value above
   - `camps_pulled` = number of camp rows you produced from that domain
   - `notes` = anything useful for next time (paywall, PDF only, login required, page broken, prompt-injection content seen, etc.)
   - `next_recheck_after` = today + 30 days for `camps_extracted`, +14 days for `partial` or `blocked`, +60 days for `stale_listings`, +365 days for `no_camps`

## Step 3. Output incrementally as you go (do not batch everything to the end)

**Critical: output CSV blocks per domain as you finish them, not all at the end.** Chrome sessions can get cut off mid-run; if you hold everything until the end, partial work is lost. The pattern is: finish a domain, immediately output that domain's CSV block, then move to the next domain. After all domains are done, output one final markdown block with the log updates.

### CSV blocks (one per domain)

For each domain you finish, output a fenced CSV block in this exact form:

````
```csv
# domain: example.com
name,sport,age_min,age_max,start_date,end_date,address,city,state,zip,description,price_text,day_or_overnight,skill_level,spots_status,contact_email,contact_phone,website_url,lunch_included,aftercare_available,program_type,registration_deadline,schedule_text
"Example Camp 1",baseball,8,14,2026-06-22,2026-06-25,...,camp,,
"Example League 1",soccer,7,12,2026-09-08,2026-12-13,...,league,2026-08-31,"Practice Tue/Thu 5-6:30 PM, games Saturdays"
```
````

Rules:
- First line inside the fence is a comment line `# domain: <domain>` so I can tell which CSVs came from which source.
- Second line is the full 23-column header.
- Then one row per camp session or league season.
- Use double-quotes around any field containing a comma.
- No row numbers. No commentary outside the fence.
- If a domain produced zero programs, skip the CSV block for that domain entirely (just record it in the log block at the end).

### Final block: the log updates

After ALL domain CSV blocks, output ONE markdown fenced block containing the rows I should paste into `CAMP-SEARCH-LOG.md`. Three sub-sections, in this exact format:

```markdown
### Domain Registry rows (paste into the Domain Registry table)

| domain | organization | area covered | last_checked | result | camps_pulled | next_recheck_after | notes |
|---|---|---|---|---|---|---|---|
| example.com | Example Org | Tacoma 25mi | 2026-05-03 | camps_extracted | 4 | 2026-06-02 | brief note |
| ... one row per domain you visited ...

### Search Areas update (apply to the row for this anchor)

- Anchor: Tacoma, WA (25mi)
- Status: in_progress  (or saturated / diminishing)
- Last batch: 2026-05-03
- Next batch after: 2026-06-02
- Notes: short summary of which sources were strong this run

### Permanent skip additions (only if any)

- domain.com — reason — 2026-05-03
```

If a section has no updates, write `(none)` under that heading instead of a table. The `camps_pulled` column counts BOTH camps and leagues from that domain.

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
- **lunch_included**: TRUE or FALSE. Use FALSE if not stated. Leagues use FALSE.
- **aftercare_available**: TRUE or FALSE. Use FALSE if not stated. Leagues use FALSE.
- **program_type**: Lowercase, exactly "camp" or "league". A camp is a time-bounded session (typically 1 day to 2 weeks). A league is a recurring season with practices and games (typically 8-16 weeks). When in doubt, use camp.
- **registration_deadline**: For leagues, the signup cutoff in YYYY-MM-DD. Blank for camps.
- **schedule_text**: For leagues, free-form schedule like "Practice Tue/Thu 6-7:30 PM, games Saturday mornings". Blank for camps.

### League-specific guidance

When `program_type` = `league`:
- `start_date` = first day of the season (often the first practice or first game).
- `end_date` = last day of the season.
- `day_or_overnight` = "day" (always).
- League sources to prioritize alongside the camp sources above: US Youth Soccer state associations, Little League regional, AAU clubs, NJB / Upward Basketball, local club soccer (NPSL, ECNL feeders), city rec leagues (parks departments often run leagues, not just camps), Pop Warner / TYFL flag football, USA Hockey associations.

## What to skip

- Camps already past their end date.
- Camps that are not within the search radius.
- Adult-only programs.
- Camps you cannot find a real registration page or venue address for.
- Duplicate listings that are the same session on multiple sites (just keep one row).

## Final check before each CSV block

Before you output a per-domain CSV block, scan it once. Confirm:

- Header row has 23 columns matching the list above exactly.
- Every row has 23 fields.
- Dates are valid YYYY-MM-DD and start_date <= end_date.
- Ages are integers and age_min <= age_max.
- All sport values are lowercase slugs from the list above.
- program_type is exactly "camp" or "league".
- registration_deadline is YYYY-MM-DD or blank.
- No em dashes anywhere in any field.
- No row uses "transformative", "comprehensive", "unlock", "elevate", "delve", "robust", or "seamless" in the description.

Before the final log block:

- The Domain Registry block has a row for every domain you visited, with `result`, `camps_pulled`, `notes`, and `next_recheck_after` filled in.
- The Search Areas update block has the right anchor, status, last batch date, and next batch date.

Output incrementally: one CSV block per domain as you finish, then the log block at the very end. No preamble. No commentary between blocks.
