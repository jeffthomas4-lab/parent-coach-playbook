# Coverage matrix audit — 2026-05-06

Run against `NEXT_AUDIT.md`. Activity universe = the SPORTS list in `src/data/site.ts` (26 activities). Age buckets = 5-7, 8-10, 11-12, 13-14, 15+.

## Headline numbers

- **Articles tagged to a specific sport: 18 of 289 (6%).** The other 271 are tagged `multi-sport`, `multi-activity`, or `performing-arts`. The general-purpose voice content is doing the work, the long-tail (sport × age) surface area is empty.
- **Activity × age cells with at least one article: 8 of 130 (6%).** 122 cells have zero coverage.
- **Drills are heavy on a few sports.** 533 drills total, but baseball gets 116 and the 12 performing-arts/individual-sport activities together get under 30.
- **Pathways: 10 of 26 sports covered.** Same story for season calendars (10 of 26).
- **Cost calculator: 11 of 26 sports.** This is the lead-tool you push hardest. Every uncovered sport is a lost shareable.

## The matrix

Five surfaces per sport: buying guide, age pathway, season calendar, drills (count, threshold ≥5 to count as "real"), cost calculator coverage. STRONG = 4-5 of 5. partial = 2-3. GAP = 0-1.

| Sport               | Guide | Pathway | Calendar | Drills | Cost | Status  |
|---------------------|:-----:|:-------:|:--------:|:------:|:----:|---------|
| Baseball            |   Y   |    Y    |    Y     |  116   |  Y   | STRONG  |
| Soccer              |   Y   |    Y    |    Y     |   75   |  Y   | STRONG  |
| Basketball          |   Y   |    Y    |    Y     |   70   |  Y   | STRONG  |
| Tackle football     |   Y   |    Y    |    Y     |   31   |  Y   | STRONG  |
| Volleyball          |   Y   |    Y    |    Y     |   31   |  Y   | STRONG  |
| Lacrosse boys       |   Y   |    Y    |    —     |   26   |  Y   | STRONG  |
| Swimming            |   Y   |    Y    |    —     |   13   |  Y   | STRONG  |
| Gymnastics          |   Y   |    Y    |    Y     |    0   |  Y   | STRONG  |
| Dance               |   Y   |    Y    |    Y     |    0   |  Y   | STRONG  |
| Hockey              |   Y   |    —    |    —     |   31   |  Y   | partial |
| Softball            |   Y   |    —    |    —     |   50   |  —   | partial |
| Lacrosse girls      |   Y   |    —    |    —     |   26   |  —   | partial |
| Flag football       |   Y   |    —    |    —     |   23   |  —   | partial |
| Track & field       |   Y   |    —    |    —     |   13   |  —   | partial |
| Tennis              |   Y   |    —    |    —     |   13   |  Y   | partial |
| Cheerleading        |   Y   |    —    |    —     |    0   |  Y   | partial |
| Band                |   Y   |    Y    |    —     |    0   |  —   | partial |
| Cross country       |   Y   |    —    |    —     |    4   |  —   | GAP     |
| 7v7 football        |   Y   |    —    |    —     |    0   |  —   | GAP     |
| Golf                |   Y   |    —    |    —     |    0   |  —   | GAP     |
| Crew                |   Y   |    —    |    —     |    0   |  —   | GAP     |
| Martial arts        |   Y   |    —    |    —     |    0   |  —   | GAP     |
| Stunt & tumbling    |   Y   |    —    |    —     |    0   |  —   | GAP     |
| Theater             |   Y   |    —    |    —     |    0   |  —   | GAP     |
| Choir               |   Y   |    —    |    —     |    0   |  —   | GAP     |
| Ballet              |   Y   |    —    |    —     |    0   |  —   | GAP     |

## Article coverage by sport × age (live, non-draft only)

| Sport               | 5-7 | 8-10 | 11-12 | 13-14 | 15+ | All-ages | Total |
|---------------------|:---:|:----:|:-----:|:-----:|:---:|:--------:|:-----:|
| Baseball            |  4  |   2  |   1   |   1   |  0  |     2    |  10   |
| Soccer              |  0  |   2  |   0   |   0   |  0  |     2    |   4   |
| Hockey              |  1  |   0  |   0   |   0   |  1  |     0    |   2   |
| Tackle football     |  0  |   0  |   1   |   0   |  0  |     0    |   1   |
| Swimming            |  0  |   0  |   0   |   0   |  0  |     1    |   1   |
| All other 21 sports |  0  |   0  |   0   |   0   |  0  |     0    |   0   |

271 articles are tagged `multi-sport` / `multi-activity` / `performing-arts`. They serve the general parent. They don't capture queries like "soccer drills for 8 year olds" or "what does a 13-year-old swimmer need."

## The punch list, ordered by leverage

Leverage = (search volume of the sport) × (number of empty surfaces) × (whether the gap blocks shareable tools).

### Tier 1 — fill in the next 30 days

These activities have material search volume and the smallest fill cost.

1. **Softball pathway + season calendar + cost defaults.** 50 drills already exist. The structural pillar is half built. Three files closes it.
2. **Hockey pathway + season calendar.** 31 drills. Same shape.
3. **Lacrosse girls pathway + season calendar + cost defaults.** Already mirrors lacrosse boys structurally; the data is symmetric and easy.
4. **Cheerleading season calendar + drills (5-10).** Cost calc and pathway exist, but no drills means no library reason to come back.
5. **Track & field pathway + cost defaults.** Spring season is now; relevant traffic is happening.

### Tier 2 — fill in the next 90 days

6. **7v7 football pathway, calendar, drills, cost.** This is a fast-growth segment. Owning it is plausible.
7. **Golf, tennis, martial arts, gymnastics drills (5-10 each).** Pathway and calendar exist for some; the drills column is empty across them.
8. **Cross country drills + pathway + calendar.** 4 drills isn't enough to be the "real" library.
9. **Performing arts pathways (theater, band, choir, ballet, dance).** Dance and gymnastics already have STRONG status with zero drills, which suggests the model works without a drills library; copy that template to theater, band, choir, ballet.

### Tier 3 — long-tail, build over the year

10. **Article re-tagging.** Audit the 271 multi-sport articles. Roughly 30-40% of them have a clear primary sport that's just not tagged (e.g. dugout pieces are baseball-coded, sideline-yelling pieces split by sport). Re-tagging is low-effort and unlocks the activity × age long-tail.
11. **Sport landing pages (`/sports/{slug}/`).** STRATEGIC_AUDIT_2026-05-05.md ranks this #2 in growth opportunities. Each landing page aggregates everything tagged with that sport into one parent reference. 26 templated pages = a new SEO surface area.

## What "filling a cell" means here

A cell is filled when a parent searching "what to buy for an 11-year-old volleyball player" or "soccer drills for 5-year-olds" can find a real article on the site. The drill library counts. The age pathway page counts. A sport landing page that pulls everything tagged with that sport counts. A multi-sport article does not count for the long-tail — Google reads the page metadata and serves the result that's most specific to the query, not the most general.

## Editorial principle (locked, repeated from NEXT_AUDIT.md)

Cornerstone pieces stay total-person and emotional. Recruiting is its own pillar, not a cornerstone. The cornerstone surface area on `/start-here/` and `/search/` `popularReads` must not lead with recruiting.
