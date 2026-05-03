# Claude in Chrome prompt: Peachjar flyers

Paste everything below the line into Claude in Chrome. Edit the SCHOOL URL line if it changes year-over-year. The prompt fetches the live Peachjar Flyer Log from GitHub so duplicate flyers are automatically skipped across sessions.

---

## Task

Pull every active Peachjar flyer for my son's school that is a youth camp or league signup, and produce CSV rows for the parentcoachplaybook.com database. I am already logged into peachjar.com in this browser session so you have access to the school's flyer board.

You will also produce a log update showing every flyer you saw — imported or not — so we don't reprocess them next time.

Accuracy matters more than volume. Don't invent fields. Leave blanks if you can't verify.

## Step 1. Read the flyer log first

Navigate to this URL and read the Seen Flyers table:

  https://raw.githubusercontent.com/jeffthomas4-lab/parent-coach-playbook/main/imports/PEACHJAR-FLYER-LOG.md

Build a SKIP_LIST = every flyer URL already in the table. You will not process those again, regardless of classification.

Also read the `Active filter rules` section at the top of that file. Apply those rules as you classify flyers.

## Step 2. Visit the school's Peachjar board

SCHOOL URL: https://my.peachjar.com/jar?audienceId=61436&tab=school&districtId=2591&audienceType=school

Open the URL. You will see a list of active flyers from the school's "jar" view. Each flyer has:
- A title and an organization
- A posted date
- An "active until" / expiration date
- A flyer image (PDF or image) you may need to read visually for details
- Sometimes: a registration link, contact info, dates, prices

For each flyer on the board:

1. Note the flyer's permanent URL (this is the dedupe key).
2. If the URL is in SKIP_LIST, skip it entirely. Don't even open it.
3. If the URL is new, click into the flyer. Read the title, image, and any text content.
4. Classify it:
   - `camp` if it's a time-bounded session (1 day to 2 weeks) that meets all the import criteria
   - `league` if it's a recurring season with practices and games (8-16 weeks)
   - `event` if it's a one-time event (open house, fundraiser, fun night)
   - `class` if it's an ongoing class or lesson (music, art, tutoring) — log but don't import
   - `announcement` if it's school news, PTA, parent survey — log but don't import
   - `expired` if its end date is before today — log but don't import
   - `incomplete` if you can't extract enough to import — log but don't import
   - `duplicate` if the same program is already known under another flyer — log but don't import
5. Only `camp` and `league` get a CSV row. Everything else gets a log row only.

## Step 3. Output as you go

Same incremental pattern as the main camps prompt: emit a CSV block for each flyer you import, then emit the final log block at the end. Don't batch everything to the end — Chrome can get cut off, and we don't want to lose work.

### CSV blocks (one per imported flyer)

For each flyer classified as camp or league, output a fenced CSV block:

````
```csv
# flyer: <full Peachjar flyer URL>
name,sport,age_min,age_max,start_date,end_date,address,city,state,zip,description,price_text,day_or_overnight,skill_level,spots_status,contact_email,contact_phone,website_url,lunch_included,aftercare_available,program_type,registration_deadline,schedule_text
"Example Camp",baseball,8,14,2026-06-22,2026-06-25,...,camp,,
```
````

The `# flyer:` comment line lets us trace each row back to its source flyer.

For website_url, prefer the registration page from the flyer image. If no registration page, use the Peachjar flyer URL itself.

### Field rules and sport slugs

Same 23-column schema as `claude-in-chrome-prompt.md`. Don't reinvent. Specifically:

- **sport**: lowercase slug from this list ONLY:
  baseball, softball, soccer, basketball, flag-football, football-7v7, football, hockey, lacrosse-boys, lacrosse-girls, volleyball, swimming, track-field, cross-country, tennis, golf, crew, martial-arts, gymnastics, cheer, stunt, theater, band, choir, dance, ballet, multi-sport, wrestling, rugby, field-hockey, climbing, skateboarding, outdoor, stem, arts, academic, general
- **program_type**: exactly `camp` or `league`.
- **registration_deadline**: YYYY-MM-DD for leagues' signup cutoff. Blank for camps.
- **schedule_text**: free-form for leagues like "Practice Tue/Thu 6-7:30, games Saturdays". Blank for camps.
- **day_or_overnight**: `day` for leagues always.
- **lunch_included / aftercare_available**: TRUE/FALSE. FALSE if not stated. Leagues use FALSE.
- **description**: 30 to 4000 characters, plain prose. NO em dashes. NO words like "transformative", "comprehensive", "unlock", "elevate", "delve", "robust", "seamless".

If a field is not on the flyer, leave it blank. Don't guess.

### Final block: the log update

After all CSV blocks, output ONE markdown fenced block with two sub-sections:

```markdown
### Seen Flyers rows (paste into PEACHJAR-FLYER-LOG.md Seen Flyers table)

| Flyer URL | Title | Posted | End date | Classification | Imported | Notes |
|---|---|---|---|---|---|---|
| https://app.peachjar.com/flyers/<id> | Example Title | 2026-04-15 | 2026-06-30 | camp | Y | brief note |
| https://app.peachjar.com/flyers/<other-id> | School Open House | 2026-04-20 | 2026-05-15 | event | N | one-time, not imported |

(one row per flyer you encountered, including ones you skipped because they were already in SKIP_LIST — re-list those with their existing classification so the log stays complete; or note "(seen, in skip list, no change)" instead)

### Run summary (paste into Run History table)

| Date | Flyers seen | New | Imported (camps) | Imported (leagues) | Skipped | Notes |
|---|---|---|---|---|---|---|
| 2026-05-03 | 24 | 8 | 3 | 1 | 4 | brief note about what was strong this run |
```

If you re-saw a flyer that was already in SKIP_LIST, you can omit it from the Seen Flyers table to keep the paste short. Just add a line in the Run summary Notes like "16 flyers were already in skip list and not re-listed".

## Final check before output

For every CSV row:
- Header has 23 columns matching the list above.
- Every row has 23 fields.
- Dates are YYYY-MM-DD and start_date <= end_date.
- Ages are integers, age_min <= age_max.
- Sport is a valid slug.
- program_type is `camp` or `league`.
- No em dashes anywhere.
- No banned words in descriptions.

For the final log block:
- Every new flyer URL has a Seen Flyers row.
- Run summary has counts that add up.

Output incrementally: CSV per flyer, then the log block at the end. No preamble. No commentary between blocks.
