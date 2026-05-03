# Camps bulk import

Four files. One workflow. Goes from "I want a list of camps" to "they're live on parentcoachplaybook.com" in five steps.

## What's in this folder

```
imports/
  CAMP-SEARCH-LOG.md               persistent memory: areas searched, domains visited, batch history
  camps-template.xlsx              the spreadsheet you give to Claude in Chrome
  claude-in-chrome-prompt.md       the prompt that drives the search
  import-camps.py                  the script that turns the filled sheet into SQL
  README.md                        this file
  out/                             generated SQL files land here (gitignored)
```

`CAMP-SEARCH-LOG.md` is the single source of truth for what we have already searched. Read it before starting a batch. The Claude-in-Chrome prompt now reads it directly. The import script appends to it after every successful run when you pass `--anchor`.

## The flow

1. Open `CAMP-SEARCH-LOG.md`. Pick the next anchor city from the `Expansion path`, or confirm the area you want to fill out next. Note any domains in the registry that need a re-check.
2. Open `claude-in-chrome-prompt.md`. Edit the SEARCH AREA and TARGET COUNT lines if you want a different radius or volume.
3. Hand the prompt to Claude in Chrome. Let it run. It will return two fenced blocks: a CSV of camps and a markdown block of log updates.
4. Paste the log block's tables into `CAMP-SEARCH-LOG.md` (Domain Registry rows, Search Areas update for the anchor row, any permanent skip additions).
5. Open `camps-template.xlsx`. Delete row 2 (the yellow EXAMPLE row). Paste the CSV data starting at row 2.
6. Save the file. From the project root, pass `--anchor` so the import logs the batch:

   ```powershell
   cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook"
   python imports/import-camps.py imports/camps-template.xlsx --anchor "Tacoma, WA (25mi)"
   ```

7. The script geocodes each address (1 sec per unique address, polite to Nominatim), writes `imports/out/camps-import-YYYY-MM-DD.sql`, and appends a row to `CAMP-SEARCH-LOG.md` Batch History. Run the SQL:

   ```powershell
   npx wrangler d1 execute parent-coach-playbook --file=imports/out/camps-import-2026-05-03.sql --remote
   ```

   Use `--local` first if you want a dry run against the local D1.

## What the script writes

Every row becomes one `INSERT INTO camps` with:

- `status='approved'` and `verified=1` (you ran it, you trust it)
- `submitted_by_email='jeffthomas@pugetsound.edu'`
- `reviewed_by='jeff (bulk import)'`, `reviewed_at` = now
- A fresh UUID for `id`, a unique slug derived from the camp name
- `latitude` / `longitude` from Nominatim if the address resolves, NULL otherwise
- A `submitters` upsert so the trust counter stays accurate

The whole batch runs inside a `BEGIN TRANSACTION ... COMMIT;` block. Either everything lands or nothing does.

## Flags worth knowing

```
--no-geocode            Don't hit Nominatim. lat/lon stay NULL. Useful for re-runs.
--status pending        Insert as pending instead of approved (queue for review).
--submitter EMAIL       Different submitter email.
--out PATH              Write SQL somewhere other than imports/out/.
--skipped PATH          Write the failed-validation CSV somewhere specific.
--anchor "City, ST (Nmi)"  Anchor area string for this batch. Required if you want
                        the script to append a row to CAMP-SEARCH-LOG.md.
--no-log                Skip the log append even if --anchor is set.
```

## Validation rules

The script enforces the same rules as the public `/api/camps/submit` endpoint:

- Required: name, sport, age_min, age_max, start_date, end_date, address, city, state, zip, description
- Ages between 3 and 22, age_min <= age_max
- Dates strict YYYY-MM-DD, start_date <= end_date
- description 30-4000 chars
- day_or_overnight in {day, overnight}
- skill_level in {beginner, intermediate, advanced, all}
- spots_status in {open, waitlist, full}
- contact_email valid format if present
- ZIP is 5 digits

Rows that fail get dumped to `camps-import-DATE-skipped.csv` with a reason column. Fix them in the spreadsheet, re-run.

## Re-running and idempotency

The script generates a new UUID per row every run. Running twice on the same spreadsheet creates duplicate camps. Either:

- Delete imported rows from the spreadsheet before adding new ones, or
- Keep one spreadsheet per import batch (e.g., `camps-2026-summer.xlsx`, `camps-2026-fall.xlsx`)

If you already imported a batch and need to undo:

```powershell
npx wrangler d1 execute parent-coach-playbook --command "DELETE FROM camps WHERE submitted_at = '2026-05-03T17:42:11+00:00'" --remote
```

(grab the timestamp from the SQL file's header comment)

## Editing the prompt

The Claude in Chrome prompt is a working draft. Things to tune over time:

- **SEARCH AREA**: swap Tacoma for wherever you're looking
- **TARGET COUNT**: 40-60 is a starting point, scale up or down
- **Sources to search**: add the directories that actually paid off, drop the ones that didn't
- **Field rules**: if validations get stricter on the site (e.g., longer description minimum), update both the validator in `import-camps.py` and the prompt rules in lockstep

## Schema reference

Source of truth: `migrations/0001_init_camps.sql` + `migrations/0002_phase2_camps.sql` + `migrations/0003_claim_listings.sql`. The script writes 30 columns. Everything else uses defaults from the schema (e.g., `is_claimed=0`, `hero_photo_key=NULL`).
