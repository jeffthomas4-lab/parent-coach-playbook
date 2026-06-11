# Coverage audit — 2026-06-10

Run per NEXT_AUDIT.md across the 26 SPORTS activities and five age buckets. Reads counted by explicit `sport` + `age` frontmatter, so multi-sport reads (the site's largest category) don't appear in sport cells; the read counts understate true coverage but correctly show where no sport-specific read exists.

## The matrix

| Activity | 5–7 | 8–10 | 11–12 | 13–14 | 15+ | all-ages | Guide | Sizing | Pathway | Calendar | Cost | Gaps |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| baseball | 4 | 2 | 1 | 1 | 0 | 3 | Y | Y | Y | Y | Y | 1 |
| dance | 2 | 1 | 5 | 1 | 0 | 2 | Y | Y | Y | Y | Y | 1 |
| soccer | 1 | 2 | 0 | 0 | 0 | 3 | Y | Y | Y | Y | Y | 3 |
| football | 0 | 1 | 1 | 0 | 0 | 0 | Y | Y | Y | Y | Y | 3 |
| band | 0 | 2 | 2 | 6 | 0 | 2 | Y | Y | Y | — | — | 4 |
| ballet | 1 | 3 | 3 | 3 | 0 | 0 | Y | Y | — | — | — | 4 |
| volleyball | 0 | 1 | 0 | 0 | 0 | 0 | Y | Y | Y | Y | Y | 4 |
| basketball | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | Y | Y | Y | 5 |
| hockey | 1 | 0 | 0 | 0 | 1 | 2 | Y | Y | — | — | Y | 5 |
| lacrosse-boys | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | Y | Y | Y | 5 |
| gymnastics | 0 | 0 | 0 | 0 | 0 | 1 | Y | Y | Y | Y | Y | 5 |
| theater | 0 | 1 | 5 | 4 | 0 | 0 | Y | Y | — | — | — | 5 |
| choir | 0 | 2 | 4 | 4 | 0 | 0 | Y | Y | — | — | — | 5 |
| swimming | 0 | 0 | 0 | 0 | 0 | 2 | Y | Y | Y | — | Y | 6 |
| cheer | 0 | 1 | 0 | 0 | 0 | 2 | Y | Y | — | — | Y | 6 |
| flag-football | 1 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 7 |
| cross-country | 0 | 0 | 1 | 0 | 0 | 0 | Y | Y | — | — | — | 7 |
| tennis | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | Y | 7 |
| softball | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |
| football-7v7 | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |
| lacrosse-girls | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |
| track-field | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |
| golf | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |
| crew | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |
| martial-arts | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |
| stunt | 0 | 0 | 0 | 0 | 0 | 0 | Y | Y | — | — | — | 8 |

Surfaces complete: guides 26/26, sizing 26/26 (template-generated for every guide). Surfaces incomplete: pathways 10/26, calendars 8/26, sport-specific cost profiles 12/26 (the calculator falls back to a generic profile, so it functions for all, but the sport-specific defaults that make the cost pages credible exist for fewer than half).

Note: the cost cluster and first-season hubs shipped 2026-06-10 added sport-tagged reads for soccer, baseball, hockey, cheer, band, flag-football, volleyball, and cross-country that appear in the counts above. Yesterday's matrix would have looked worse.

## Patterns before the punch list

The 15+ column is empty for 25 of 26 activities. That's not 26 separate gaps, it's one editorial decision: the site under-serves high school parents in sport-specific terms. Worth one deliberate wave rather than incidental fills.

Lacrosse-girls has full infrastructure parity on guides but nothing else, while lacrosse-boys has everything. Same household, same search queries, half the coverage.

## Punch list, ordered by parents blocked

1. **Basketball reads, zero at every age.** The most-played youth sport in America has no sport-tagged read. First-season hub plus a cost page (profile already exists in costDefaults) is the fastest fix, matching the fall-sports pattern shipped today.
2. **Softball, zero on five of six surfaces.** Massive participation, complete infrastructure gap: no pathway, calendar, cost profile, or reads. Baseball content adapts cheaply here; baseball-to-softball is the highest-leverage adaptation in the repo.
3. **Flag football pathway + calendar.** The fastest-growing youth football format, registration is now, and today's first-season hub will pull traffic with nowhere deeper to send it.
4. **Cheer pathway + calendar.** Cost page and packing list shipped today; the pathway ("what good looks like at 7, 10, 13") is the missing piece of a now-strong cluster.
5. **Hockey pathway + calendar.** Same cluster logic: cost page exists as of today, gear guide is deep, structure pages missing.
6. **Track-field and cross-country everything.** Spring and fall halves of the same running family, both at zero or near-zero. One pathway + calendar pair each, plus the XC first-season hub already shipped.
7. **Lacrosse-girls parity pass.** Pathway, calendar, cost profile, and at least two reads, adapted from the boys' versions with the real rule and gear differences.
8. **Swimming calendar.** Pathway and cost exist; the year-round club calendar is the missing piece and the sport's defining parent problem.
9. **Tennis and golf pathways.** Individual sports where "what good looks like at each age" is the top parent anxiety and lessons are the cost driver. Cost profile exists for tennis, not golf.
10. **The 15+ wave, one read per major sport.** Varsity-parent content: tryout odds, the bench year, the last season. The scripts and drive-home library already speak to this age emotionally; the sport-tagged versions don't exist.

## Editorial principle check (locked item)

Spot-checked: /start-here/ and popularReads do not lead with recruiting content. Compliant as of this audit.

## Fill wave shipped same day (2026-06-10, second session)

The punch list above is now substantially closed. What shipped:

- **Pathways: 26/26.** 15 new files (hockey, flag-football, football-7v7, lacrosse-girls, cross-country, track-field, tennis, golf, crew, martial-arts, cheer, stunt, theater, choir, ballet). 7v7, crew, and stunt start their bands at the ages the activity actually exists, stated in ltadStage.
- **Calendars: 26/26 sports covered.** 17 new scenario files, one per missing sport, hs-lacrosse-spring-girls named to pair with the boys' file.
- **Cost profiles: 26/26.** 27 new profiles across the 13 missing activities, two levels each, ballet three (rec/travel/elite). New source consts per governing body; methodology page picks them up automatically.
- **Lacrosse-girls parity:** first-season read plus goggles-and-stick rules read, both sport-tagged.
- **The 15+ wave:** 8 sport-tagged varsity-parent reads (baseball ace workload, basketball tryout odds, soccer club-vs-school, football roster math, volleyball bench year, softball junior-year cut, hockey juniors math, track stopwatch). Six link the 4-percent rule.
- **Theater travel packing list:** ITF/Thespys + state festivals + show trips, sport: theater, 15-plus.

Punch list items 1 and 2 (basketball, softball first-season hubs) had already shipped in the morning session. Remaining known gap: nothing at the infrastructure level. Next soft spots are read depth for tennis/golf/crew/martial-arts/stunt (zero sport-tagged reads, but full structure pages now exist) and the multi-sport read library still dwarfing sport-tagged coverage, which is by design.

## Next audit

Re-run after the next content wave. The matrix script lives in this audit's session log; rebuilding it takes one pass over content frontmatter plus site.ts.
