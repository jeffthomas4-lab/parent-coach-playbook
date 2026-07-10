# ActivityRadar: Full Org List, Acquisition Workflow, and Go-To Strategy

**Owner: Jeff Thomas. Written: June 15, 2026.**
**Companion to `00-ARCHITECTURE.md`. Read that first for the schema and the one-database-two-front-doors model.**

This answers four things you asked. Will the Google-search deal give us every org URL. What the full acquisition-to-camp workflow looks like. Who we are up against and how we win. What the money looks like long term.

---

## The short answer on the Google deal

No. Buying Google search results will not give you every organization URL. It gives you a big, cheap first layer and nothing close to complete.

Two hard caps make "every" impossible from Google alone. Google's own Places API returns 20 results per page and stops at 60 total for a text search, 20 for a nearby search. So one query for "youth soccer Tacoma" never returns more than 60 places no matter how many exist. You get the 60 with the strongest Google Business Profiles, not the full set.

The deeper problem is what Google knows. Google Maps only lists entities that have a Google Business Profile. A private dance studio has one. A volunteer-run rec soccer league that registers through a city website does not. A parks-and-rec department shows up as one pin, not as the 40 programs it runs. School enrichment, church leagues, and small club teams are mostly invisible to Maps. Those are exactly the organizations we want, and they are the ones a Google scrape misses.

So the Google deal is a layer, not the answer. It is the right tool for Tier 4 (private enrichment businesses with storefronts), and it is close to useless for the volunteer and municipal supply that makes up most of youth activity.

---

## What the Google layer is actually good for, and what it costs

Run it as a grid, not a single search. You tile the map: every activity category crossed with every city or ZIP cluster in the target geography, each as its own query, so the 60-result cap stops biting because each tile is small enough to return everything in it. This is standard Maps-grid scraping.

The economics are not the constraint. Outscraper runs about $3 per 1,000 results and drops to roughly $1 per 1,000 past 100k results a month. SerpAPI is around $0.015 a call if we want raw SERP HTML instead of structured Maps data. Covering WA and OR across 40-plus categories and a few hundred geographic tiles is a few hundred dollars, not a budget item to agonize over.

What the Google layer returns is a business shell: name, address, category, phone, website URL, review count. That is enough to create a stub org record and, crucially, the website URL we then crawl for programs. It never returns program-level data. A studio found through Maps is a stub until the discovery agent visits its site and pulls the actual classes. The OS already says this in chapter 05-09. Nothing here contradicts the plan; it sharpens it.

---

## The real workflow: five layers stacked, not one source

The full org list comes from stacking sources that each cover what the others miss. We already have two of the five live. Think of it as a funnel from "exists on paper" down to "live, searchable, trusted."

**Layer 1: The registration backbone (built).** 195,342 youth-activity nonprofits loaded from the IRS Exempt Organizations Business Master File, NTEE codes N, O, and the arts-education slice of A. This is the spine: every registered nonprofit that runs recreation, youth development, or arts programming, keyed by EIN, name, city, state. It is the one source that is genuinely close to "every" for the nonprofit half of the market. The catch is they are address-only stubs with no website, no programs, no lat/lng. They are hidden from parent search until enriched.

**Layer 2: The camp seed (built).** 910 organizations and 1,701 programs migrated from the Parent Coach Desk camps table. This is the only layer with real program data attached today. It is the proof the schema works end to end.

**Layer 3: Structured municipal and franchise sources (next, highest value per hour).** Parks-and-rec departments, YMCAs, and Boys and Girls Clubs publish program catalogs in semi-consistent formats, often on the same registration platforms (CivicRec, ActiveNet, RecTrac, Daxko). These are Tier 1 in the OS for a reason: one parks department is 40 programs with dates, ages, and prices, and the YMCA national network repeats the same site structure across hundreds of branches. Crawling 5 registration platforms gets us most of the municipal supply in the country. This is where the program data density lives.

**Layer 4: The Google and Yelp grid (the deal you asked about).** Runs against Tier 4: private studios, dojos, music schools, coding camps, tutoring. Fills in the for-profit storefront supply that is invisible to the IRS file and not on a municipal platform. Returns shells, feeds the crawler. Cheap, broad, shallow.

**Layer 5: Demand-driven and claimed (continuous).** The search-event log tells us what parents looked for and did not find. "Robotics camp, age 12, Tacoma, zero results" becomes a targeted discovery job. And every org that claims its listing stops being scraped and starts maintaining its own data. Layer 5 is the flywheel: the product tells the crawler where to dig, and the orgs that care fill in their own records for free.

The IRS backbone tells us who exists. The municipal and franchise crawl plus the Google grid tell us their websites. The website crawl turns websites into programs. The claim flow and the demand log keep it current. That is the whole machine.

---

## The bottleneck is not finding orgs, it is enriching them

We already have 196,252 org records. The number that matters is how many are live and useful, which today is 910. The work is not acquisition. It is the climb from stub to searchable: geocode the address, find the website, crawl the website, extract programs and sessions, score confidence, surface it.

So the build order is enrichment, not more raw imports. In sequence: geocode the 195k stubs off ZIP centroids (the centroid table is already loaded), resolve a website for each stub (this is where a Google or Bing lookup by name plus city earns its keep, matching an IRS name to a real domain), crawl the resolved sites for programs, and promote any org that comes back with at least one live program. Everything else stays a hidden stub until it earns promotion or a parent search points us at it.

The Google deal helps most here, not at discovery. Its best job is website resolution for the stubs we already hold, not finding new names. That reframes the spend: we are not buying a list, we are buying URLs for a list we already own.

---

## Who we are up against

The field splits into two kinds of competitor, and neither is built the way we are.

**Registration-software marketplaces: ActivityHero, Sawyer, KidPass.** These are the real ones. ActivityHero claims 4 million families and 400k email subscribers and sells registration and marketing software to providers; the directory is a byproduct of who signed up for the software. Sawyer pitched itself as the OpenTable of kids' activities and is registration-software-first. KidPass runs a membership model where parents pay a subscription to book classes.

Their structural weakness is the same one: their directory only contains organizations that adopted their booking software. That is a supply-constrained directory. A parks department running ActiveNet, a volunteer soccer league, a church basketball program, none of them are on Sawyer because none of them switched their registration to Sawyer. These platforms are deep on the few thousand providers who pay them and blind to everyone else.

**Generic local directories: Google, Yelp, Facebook, Nextcaller-style local search.** Broad but unstructured. No age filter, no "open registration now," no program-level view, no trust signals built for parents. A parent ends up where chapter 07-01 describes: five tabs, three unanswered phone calls, no confidence.

Nobody is running the scrape-everything, structure-it, stay-neutral model on the full universe of supply regardless of what software the org uses. That gap is the opening.

---

## How we win: coverage they cannot match and neutrality they cannot offer

Three real points of difference, in order of how defensible they are.

**Coverage independent of adoption.** We list an organization whether or not it pays us, uses our software, or has ever heard of us. ActivityHero cannot list an org that did not onboard. We can list all 196,252 and climb them over time. In a single metro that is the difference between a few hundred providers and a few thousand. Coverage is the product. It is also the moat the OS already names: a two-year scraping head start is a two-year gap for anyone starting from supply-side software.

**Neutral ranking.** Results order by distance and record quality, not by who paid. The registration marketplaces have a structural conflict: their revenue comes from the providers in the directory, so the directory tilts toward paying providers. We can promise a parent the ranking is honest because we do not need the org to pay to appear. Trust is the thing a parent is actually buying, and it is the thing a pay-to-list model cannot sell.

**Demand intelligence as a private asset.** Every search builds a map of what parents want and where it does not exist. After a year that data tells us which categories are underserved in which ZIPs. It prioritizes the crawler, it feeds Parent Coach Desk's content calendar, and later it is sellable on its own. The marketplaces see registrations. We see the searches that never converted, which is the more valuable signal.

The one thing the marketplaces have that we do not is registration itself. They book the class and take the transaction. We send the parent to the org's own registration page. We should not chase booking early. It pulls us into payments, refunds, and provider software support, which is their game and their cost structure. We stay the map. Booking is a Year 3-plus question, and only if the demand data says parents want to complete in-product.

---

## Long-term revenue model

The OS monetization chapter (07-08) is right for Phase 1 and I would not rewrite it. Enhanced listings at $49 a month, camp promotion at $149 a window, org subscriptions at $249 a month, then API licensing. The Year 3 PNW target of roughly $317k and the Year 4 national target near $1.1M ARR are the near-term plan. Hold that.

What I would add is the layer that makes ActivityRadar worth more than a directory: the data itself becomes the product. We are already building the most complete structured database of who runs what youth activity, where, for whom, with what trust signals. That asset has buyers beyond the orgs listed in it.

Three long-term revenue layers stacked on top of the listing business:

The first is intelligence licensing, the same play running on the healthcare side with the Directory. Pediatric networks, school districts, insurers building family-wellness benefits, and city health departments all want "what activities exist near this family and are they any good," and none of them will build the database themselves. This is the API tier in 07-08, and it is the highest-margin line because the data is built once at crawl time and served many times at query time.

The second is the demand-data product. Aggregate, de-identified search intelligence sold to the people who plan supply: parks departments deciding what to fund, franchises deciding where to open, sports-equipment and youth-brand marketers deciding where the unmet demand is. We never sell a parent's data. We sell the pattern: "robotics demand in South Sound is triple the supply." That is a report nobody else can produce because nobody else holds the searches.

The third is lead flow to providers, priced on performance, not placement. Not pay-to-rank, which poisons trust. A clean referral fee or qualified-click model where an org pays only when a parent we sent actually registers. It keeps ranking neutral because position is still earned by quality and distance; the org just pays for the outcome after the fact.

The shape of the long-term business: a free parent product that is the best place to find activities, funded near term by org listings and promotion, and funded long term by selling the intelligence the parent product generates. Same architecture as the healthcare unit. Free public-facing front, monetized data engine behind it.

---

## What gates this, honestly

The enrichment hit-rate gates everything. If we can resolve a website for 70 percent of the 195k IRS stubs and pull at least one program from most of those sites, the database becomes real fast and cheap. If website resolution comes back at 20 percent because small nonprofits do not have findable sites, the backbone stays a list of names and the useful database is only as big as Layers 2 through 4. Run that test before committing to the national-coverage story. It is the same kind of hit-rate gate the Directory has on email inference, and it deserves the same respect.

Second gate: crawl quality on messy municipal sites. Parks-and-rec catalogs are semi-structured at best. If the program extractor handles the top 5 registration platforms cleanly, we get most of Layer 3 for low effort. If every site needs a custom parser, Layer 3 gets expensive. Build to the platforms, not to individual sites.

Legal footprint stays where 05-09 put it: public pages only, respect robots.txt, rate-limit, no auth bypass, no personal data on staff or kids. Google Places and Yelp through their APIs are clean commercial use within their terms. Nothing here moves us outside that line.

---

## Next concrete steps

1. Run the website-resolution hit-rate test on a 2,000-org sample of the IRS stubs in WA and OR. Name plus city against a search lookup, measure what percent resolve to a real domain. This single number decides whether the backbone is a database or a phone book.
2. Build the program extractor against the top 5 municipal registration platforms (ActiveNet, CivicRec, RecTrac, Daxko, and one more once we see the WA and OR distribution). That is the highest program-density work per hour.
3. Stand up the Google and Yelp grid scoped to Tier 4 in Pierce and King counties as the first geographic proof, and point it at website resolution for existing stubs first, new-name discovery second.
4. Ship the search UI (phase 4 in the architecture doc) so the demand log starts collecting. Every day without it is demand intelligence we are not capturing.

The Google deal is worth doing. Just not as the way to get every org. Get the IRS backbone enriched, crawl the municipal platforms for real program data, and use Google to resolve URLs and fill the for-profit storefront gap. That is the full org list, and it is most of the way to the go-to aggregator.
