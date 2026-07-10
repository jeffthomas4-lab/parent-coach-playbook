# Website Resolution Hit-Rate Test

**Owner: Jeff Thomas. Written: June 15, 2026.**
**Purpose: decide whether the 195,342 IRS org stubs can be enriched into a real database before spending on full-file enrichment.**

This is the gate. Run it on 2,000 orgs before paying to resolve all 195k. One number comes out: the percent of stubs that resolve to a confidently-correct website. That number decides the whole national-coverage story.

The same discipline the directory uses on the email-inference test (D-016). Measure on a sample, set a threshold, then commit or reprioritize.

---

## What we are testing

We hold 195,342 IRS EO BMF org records. Each has name, city, state, zip, and EIN. None has a website. The question: if we feed name plus city to a third party that runs a Google search per org and returns the top result, what fraction come back with the org's actual website, correctly matched, not a wrong site that looks right.

Three outcomes per org:

- **Resolved-correct.** The returned domain is the org's own site, confirmed by the match rules below.
- **No-result.** No usable website exists (the org lives on Facebook, a registration platform, or has no web presence). Returns a social URL, a directory page, or nothing.
- **Wrong-match.** A URL comes back that is plausible but belongs to a different org, a national parent, a news article, or another chapter in another state. The dangerous bucket.

The headline metric is the resolved-correct rate. The wrong-match rate is the second number that matters, because it sets how much manual review the full run needs.

---

## The sample

2,000 orgs, drawn to mirror the real file, not cherry-picked. Stratify so the result generalizes:

- **Geography.** Pull only WA and OR records. This is the Phase 1 territory and the geography we will crawl first, so a clean read here is the one that matters.
- **NTEE spread.** Sample proportionally across the three kept code groups: N (recreation/sports), O (youth development), and the arts-education A subset. A type that resolves at 80% and one that resolves at 20% should both show up at their real weight.
- **Name-commonness spread.** Deliberately include both distinctive names ("Tacoma Rainiers Youth Baseball") and generic ones ("Boys & Girls Club," "Youth Soccer Association"). The generic names are where wrong-match lives, and we need to see that rate honestly.

Pull the sample with one query against the `organizations` table: `record_source='import'` and `source_dataset='irs_eo_bmf'` and `state IN ('WA','OR')`, then stratified-random down to 2,000.

---

## The search string

One query format, applied to every org. Keep it simple and consistent so the hit rate reflects the method, not query tinkering.

Primary: `"{name}" {city} {state}`

The org name in quotes forces Google to weight the exact name. City and state unquoted let Google disambiguate location. Example: `"Metro Parks Tacoma" Tacoma WA`.

Have the third party (Outscraper, Serper, or SerpAPI) return, per org, the top 3 organic results and the Google Maps website field if a Maps panel fires. For each returned result capture: the resolved domain, the page title, and the result snippet. We need the title and snippet to run the match rules. A bare URL is not enough to score confidence.

Do not run name-only or add NTEE keywords in this test. We are measuring the cheapest repeatable method. If it passes, we ship it. If it fails, fancier queries are a separate experiment.

---

## Match-confidence rules

Every returned result gets scored before it is trusted. Auto-accept only on a strong match. Everything else drops to review or reject.

**Accept (resolved-correct) when both hold:**

1. **Name match.** The org name and the page title or domain share a strong token overlap. Token-set ratio of 85 or higher after dropping stopwords and corporate suffixes (Inc, Foundation, Association, Club). "Metro Parks Tacoma" vs a page titled "Metro Parks Tacoma | Parks & Recreation" passes. "Boys & Girls Club" vs "Boys & Girls Clubs of America" does not, because the national parent is not the local chapter.
2. **Geography match.** The city appears on the page (snippet or title), or the domain is a local TLD pattern, or the Maps panel address city equals the org city. A WA org resolving to a domain whose contact page says Portland OR fails geography.

**Review (ambiguous) when:**

- Name matches but geography is silent (no city anywhere, can't confirm it's the local one).
- Geography matches but name overlap is between 60 and 85 (partial: could be the org, could be a sibling).
- The only return is a Facebook, Instagram, or registration-platform URL (TeamSnap, LeagueApps, ActiveNet). These are real signal but not an owned website. Flag them as `social_only`, they are useful later but do not count as resolved-correct.

**Reject (no-result or wrong-match) when:**

- No result clears a 60 token-set ratio.
- The top result is a known directory (Yelp, Yellowpages, GuideStar, Cause IQ), a news domain, or a `.gov` page that is not the org's own.
- Name match is high but geography is wrong (the national parent or an out-of-state chapter). Log these explicitly as wrong-match, separate from no-result, because the two failures mean different things.

Set thresholds in config so they can be tuned after eyeballing the first 200. Do not hand-tune per org.

---

## The scorecard

Record one row per org in a results table (a CSV is fine for the test). Columns:

`org_id, name, city, state, ntee_group, name_commonness, query, top_domain, top_title, top_snippet, name_score, geo_match, classification`

Where `classification` is one of: `resolved_correct`, `social_only`, `review`, `no_result`, `wrong_match`.

Then a human spot-checks a random 200 of the auto-classified rows to measure the classifier itself. We need to know the auto-accept is not quietly passing wrong-matches. If the spot-check finds more than 5% of `resolved_correct` rows are actually wrong, tighten the rules and re-score before trusting the headline number.

Final report, five numbers:

- Resolved-correct rate (the headline).
- Social-only rate (recoverable later, not now).
- Review rate (human-cost driver for the full run).
- No-result rate (orgs with no findable web presence).
- Wrong-match rate, and what percent of those the rules caught vs let through.

Break each number down by NTEE group and by name-commonness, because the full-file decision may be "enrich type N and O, skip the arts subset" rather than all-or-nothing.

---

## The decision thresholds

Set the go/no-go before running, so the number decides, not the mood after.

**Resolved-correct at 60% or higher: go.** Buy the full-file enrichment. At 60%+ the backbone becomes a real, searchable database fast: roughly 117k of the 195k orgs get a website to crawl, and the IRS layer earns its place as the spine. Full run cost is $200 to $600 at Outscraper rates. Cheap against the payoff.

**Resolved-correct between 40% and 60%: go, but scoped.** Enrich only the NTEE groups and name-commonness bands that cleared 60% in the sample. Skip the bands that didn't. Partial backbone, but still worth the spend on the part that works.

**Resolved-correct below 40%: no-go on IRS-first.** The backbone stays a name-and-address list. Reprioritize: the municipal-platform crawl (ActiveNet, CivicRec, RecTrac, Daxko, YMCA, Boys & Girls Club) moves ahead of IRS enrichment, because that path delivers program data directly instead of fighting to find sites for orgs that don't have them. The IRS file stays as SEO surface and a merge target for later, not the primary acquisition engine.

Wrong-match rate has its own gate. If the rules let more than 10% wrong-matches through into resolved-correct even after tuning, do not auto-promote any resolved org to active without a crawl confirming the site is actually theirs. A wrong URL that crawls into a real-looking program record is worse than a missing one.

---

## After the test passes

The output of the full run is a website on each resolvable stub, plus a confidence tag. That feeds straight into the next steps from the strategy doc:

1. Geocode the resolved orgs (ZIP centroid now, exact geocode when a site address is found).
2. Crawl the resolved sites for programs (the discovery agent, OS 04-07).
3. Promote any org that comes back with at least one live program from `record_status='unverified'` to `'active'` so it enters parent search.

The `social_only` and `review` piles are a second pass, not waste. A Facebook-only org is a claim-flow target: invite them to claim their listing and fill their own data.

---

## What to hand me to run it

A 2,000-row CSV from the sample query, and the third-party choice (I'd start with Outscraper for the price). I'll write the query-builder, the match-scorer, and the scorecard. The only thing I can't do is decide the thresholds for you, and those are set above. Run it, read the five numbers, and the path picks itself.
