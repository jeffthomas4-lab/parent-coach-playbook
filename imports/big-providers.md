# Big provider registry

Living list of national / multi-tenant platforms that the harvester should hit. Curate this once, point the harvester at each row, scale.

Three tiers:
- **Tier 1 — operator with national sitemap.** Single domain, thousands of camp pages with schema.org Event data. Harvester goes brrr.
- **Tier 2 — registration platform / multi-tenant.** Hundreds of operators on one platform, each with their own subdomain or path. Aggregator-level integration unlocks all tenants at once.
- **Tier 3 — directory of locations.** A national org with hundreds of independent local branches (YMCAs, B&G Clubs, Pop Warner). Need to walk the directory first to discover branches, then harvest each.

Status legend: ✓ done · 🟡 partial · ⏳ planned · ⛔ blocked

---

## Tier 1 — National operators with their own domain

Run `--sitemap <domain>` directly. Filter as needed.

| Domain | Provider | Sitemap | Notes | Status |
|---|---|---|---|---|
| ussportscamps.com | US Sports Camps / Nike branded camps | https://www.ussportscamps.com/sitemap.xml | 17,577 URLs. Best-in-class JSON-LD Event data. ~398 soccer-camp URLs alone. Filter: `<sport>.*camp-`. | 🟡 (soccer + baseball ran) |
| skyhawks.com | Skyhawks Sports Academy | https://www.skyhawks.com/sitemap.xml | Multi-sport youth camps national. Confirm JSON-LD coverage. | ⏳ |
| imgacademy.com | IMG Academy | https://www.imgacademy.com/sitemap.xml | High-end residential camps; small but high-margin operator. | ⏳ |
| galileo-camps.com | Galileo Learning | https://galileo-camps.com/sitemap.xml | West Coast / national STEM-arts day camps. | ⏳ |
| steveandkates.com | Steve & Kate's Camp | https://steveandkates.com/sitemap.xml | National traditional day camps. | ⏳ |
| challengersports.com | Challenger Sports | https://challengersports.com/sitemap.xml | Soccer focus. JSON-LD blocks Organization/WebPage only — likely Tier 3. | ⛔ (no Event schema) |
| kidztoprosacademy.com | KidzToPros | https://kidztoprosacademy.com/sitemap.xml | National multi-sport. Verify schema. | ⏳ |
| britishsoccer.com | British Soccer Camps | https://britishsoccer.com/sitemap.xml | Soccer national. | ⏳ |
| campusbrands.com / breakthroughbasketball.com | Breakthrough Basketball | https://breakthroughbasketball.com/sitemap.xml | Already pulled in Tacoma batch. National camps. | 🟡 |
| ussportcamps.com | (alt domain — check for redirect) | — | Confirm vs ussportscamps.com. | ⏳ |
| nbcsoccercamps.com | NBC Camps | https://nbcsoccercamps.com/sitemap.xml | Christian-affiliated, multiple sports incl basketball/volleyball. | ⏳ |
| 5startennis.com | 5 Star Tennis Camps | https://5startennis.com/sitemap.xml | Tennis national. | ⏳ |

## Tier 2 — Registration platforms (multi-tenant, must walk per-tenant)

Each tenant typically has its own subdomain or path. Get the tenant list, run harvester per tenant.

| Platform | Tenant URL pattern | Notes | Status |
|---|---|---|---|
| Daxko (YMCA backbone) | operations.daxko.com / tenants on own domains | Most US YMCAs run on Daxko. Tenant program data exposed via /Programs/Search. May need direct API or per-Y crawl. | ⏳ |
| ActiveNet (Active Network) | apm.activecommunities.com/<tenant>/Activity_Search/ | Hundreds of city parks departments. Examples: parkstacoma, lakewoodparksandrec, federal way (itallhappenshere), penmetparks, auburnwa. Tenant URL pattern is consistent. Detail page often gated. | 🟡 (case-by-case in Tacoma batch) |
| ASAP Connected | online.asapconnected.com | Federal Way uses it. Documented JSON API. | ⏳ |
| rec1.com | <tenant>.rec1.com | Smaller cities. | ⏳ |
| Sawyer (HiSawyer) | hisawyer.com/<tenant>/schedules | Independent schools (Annie Wright). Schedules API endpoint visible. | 🟡 |
| Homeroom | homeroom.com/sites/<tenant>/camp | Independent schools (Charles Wright Academy). | 🟡 |
| TotalCamps | <tenant>.totalcamps.com | College sport-specific camps (PLU volleyball was on this). Tenant per program. | ⏳ |
| JumpForward | (varies) | College recruiting + camp registrations. | ⏳ |
| CommunityPass | register.capturepoint.com | Towns and small parks departments. | ⏳ |
| Tyler Tylerhost | tylerhost.net | Government rec system. PDF-heavy (Bonney Lake). Hard. | ⛔ |
| Camp Network (campnetwork.com) | campnetwork.com/<slug> | Aggregator with ~10K listings. Aggregator policy says no — verify they pull operator pages, then we crosscheck and only keep operator-confirmed rows. | ⏳ |
| ActivityHero (vertical SaaS) | activityhero.com | Competitor with 4M parents. Already a customer-facing front-end; not a backbone we'd ingest. Skip ingesting their data; differentiate on parent UX. | ⛔ |

## Tier 3 — National directories of independent locations

Walk the directory first to discover branch URLs, then harvest each branch.

| Org | Discovery URL | Branch count | Approach | Status |
|---|---|---|---|---|
| YMCA of the USA | https://www.ymca.net/find-your-y | ~2,600 branches | Many on Daxko (Tier 2). Smaller Ys often have their own WordPress site with no schema. Discover all branches via find-a-Y, then per-branch harvest, fall back to Chrome for the long tail. | ⏳ |
| Boys & Girls Clubs of America | https://www.bgca.org/find-a-club | ~5,000 clubs | Most clubs have websites; few have schema. Discover then per-club Chrome run. Some chapters span multiple clubs (e.g., bgcsps.org for South Puget Sound). | ⏳ |
| Pop Warner (football) | https://www.popwarner.com/find-program | Thousands of leagues | League-level, not camp-level. Use for the league side of the database. | ⏳ |
| Little League | https://www.littleleague.org/play-little-league/find-a-league/ | Thousands of leagues | Same as Pop Warner. | ⏳ |
| AAU clubs | https://aausports.org/clubs | Tens of thousands across sports | League/team data, not camps. | ⏳ |
| First Tee chapters | https://firsttee.org/find-a-chapter/ | ~150 chapters | Golf programs + camps. | ⏳ |
| US Soccer state associations | https://www.ussoccer.com/state-associations | 55 state-level orgs | Each state has its own youth website. League data primarily. | ⏳ |
| College athletic departments | NCAA member directory | ~1,100 D1/D2/D3 schools | Athletic camps under sport-specific subdomains (loggerbaseballcamps.com, etc.) or TotalCamps. UPS, PLU, UW already pulled in Tacoma batch. | ⏳ |

## Tier 4 — Municipal sources we've already mapped

The CAMP-SEARCH-LOG.md domain registry is the source of truth for individual cities. As we go national, mirror that pattern: per-anchor city, per-domain notes.

---

## How to use this list

1. Pick a Tier 1 row that's `⏳`. Run the harvester against its sitemap with appropriate filter. Move to `🟡` once partial, `✓` when saturated.
2. For Tier 2: pick a platform, identify the top 20 tenants in your active anchor city, harvest each.
3. For Tier 3: not yet — these need a discovery step (walking the find-a-X directory) before the harvester can do its thing. Build that directory walker as a separate script when you get to it.

Update this file when you change a status, add a row, or learn something new about a provider's schema coverage.
