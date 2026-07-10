# Chrome Discovery Playbook (no API)

How Claude-for-Chrome works a daily worklist. Goal of this pass is one thing only:
organization -> likely official website URL. Do not crawl the site. Do not pull camp
data. That happens later in the enrichment + camp_scan workers.

## Input

`worklist-YYYY-MM-DD.csv` from `discovery_batch.py`. One row per org, already assigned
a search engine and carrying a ready-to-open `search_url`. Up to 1,250 rows/day, spread
across 10 engines (Google 100, Bing 150, Brave 150, DuckDuckGo 150, Yahoo 125, Ecosia
125, Startpage 100, Qwant 100, Mojeek 125, Swisscows 125).

## Per-org loop

1. Open the row's `search_url` (already the right engine, already the query
   `"{name}" {city} {state}`).
2. Read the first page of results. Do not click into sites unless confidence is low.
3. One fallback only if the first query is empty: `"{name}" {city} youth sports` or
   `"{name}" {city} camp registration`. One fallback, then move on.
4. Decide accept / social / reject per the rules below, score confidence, write one
   JSON line to `results.jsonl`.
5. Random pause between searches. Keep the human rhythm. Do not hammer one engine.

## Accept the result as the website (no click needed) when

- the domain clearly matches the org name, and
- the result title clearly matches the org name, and
- the snippet shows the city or state.

Also accept a known registration-provider page that is clearly THIS org's:
SportsEngine, LeagueApps, Crossbar, TeamSnap, PlayMetrics, Stack Sports, GotSport,
Demosphere, Active, Jersey Watch, Blue Sombrero, LeagueLineup. Record it as the
registration source, not the owned site.

## Store as social, not website

Facebook / Instagram / a registration platform with no owned site behind it. Save the
URL in `social_url`, leave `website_url` empty, set `needs_review` if nothing better.

## Reject (not the website)

Yelp, news article, generic directory, GuideStar / Cause IQ, a school-district page
(unless the org is school-run), an unrelated business, an out-of-state chapter, a
national parent (e.g. "Boys & Girls Clubs of America" for a local club), a PDF, an
image result.

## Confidence

- 95 exact domain + name + city match
- 85 title and snippet strongly match
- 75 likely official, not perfect
- 60 possible, needs verification
- 50 uncertain
- 0 no result

Below 75: set `needs_review = true`, but still store the candidate if there is a
reasonable one.

## Guardrails (parent-facing youth product, non-negotiable)

- Never open or store anything behind `/admin`, `/login`, `/account`, `/dashboard`,
  `/cart`, `/checkout`, `/wp-admin`, `/private`.
- This pass records only org-level facts: name, website, city/state, source. Never
  store youth athlete data: rosters, jersey numbers, DOB, medical, allergy, emergency
  contact, parent or student emails. If a result surfaces that, do not store it; note
  `needs_review` and move on.
- Store the URL and the reason, not page bodies.

## Output: one JSON line per org -> results.jsonl

```json
{"org_id":"org-...","name":"Tacoma Soccer Club","city":"Tacoma","state":"WA","engine":"bing","query":"\"Tacoma Soccer Club\" Tacoma WA","website_url":"https://www.tacomasoccerclub.org","website_domain":"tacomasoccerclub.org","website_confidence":95,"website_discovery_reason":"Exact domain and title match, snippet shows Tacoma","social_url":"","needs_review":false}
```

`org_id` is copied straight from the worklist, so it maps back to the live
`organizations` row. `results.jsonl` is the resume ledger: `discovery_batch.py` skips
any org already in it, so tomorrow's worklist is the next undone slice of the queue.

## After a day's results land

Import the accepted candidates: set `website_url`, `website_confidence`,
`website_discovery_engine` on the org, flip `record_status` toward verification, and
enqueue the org for the enrichment + camp_scan workers. Anything under 75 confidence or
flagged goes to the review queue, not straight live.
