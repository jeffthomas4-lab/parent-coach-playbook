# Next audit — coverage matrix

When the next audit runs, verify completeness of these five surfaces across every activity × age. The activity universe is the SPORTS list in `src/data/site.ts`. Age buckets: 5–7, 8–10, 11–12, 13–14, 15+.

## 1. Reads (per age, per activity)

For every (activity, age) pair, there should be at least one read. A read is an article in `src/content/articles/` filtered by `sport` and `age` frontmatter. Output a matrix: rows = activities, columns = age buckets, cell = count of reads. Flag any zero cells.

## 2. Buying guides (per activity)

For every activity, there should be a guide in `src/content/guides/`. For activities where sizing matters (cleats, sticks, helmets, instruments, leotards, pointe shoes, etc.), there should also be a sizing guide section or sub-page. Flag any activity missing a base guide. Flag any activity where sizing matters but no sizing guidance exists.

## 3. Age pathways (per activity)

For every activity, there should be a pathway in `src/content/pathways/` covering the same age buckets above. Flag any activity missing a pathway. Flag any pathway missing an age bucket.

## 4. Season calendars (per activity)

For every activity, there should be a calendar in `src/content/seasonCalendars/`. Flag any activity missing a calendar.

## 5. Cost calculator (per activity)

`src/data/costDefaults.ts` should have defaults for every activity at every tier (rec, club, travel, etc. as relevant). Flag any activity not represented in costDefaults.

## Deliverable shape

The audit should produce a single coverage table — one row per activity, columns for each surface, with a checkmark or count and the count of missing pieces. End with a punch list of the top gaps to fill, ordered by how many parents the gap blocks (popular activities first).

## Editorial principle (locked)

Cornerstone pieces are the total-person, emotional reads. Recruiting is its own pillar, not a cornerstone. The cornerstone surface area on `/start-here/` and `/search/` popularReads must not lead with recruiting content.
