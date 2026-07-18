# Redirect candidates: parentcoachdesk.com

**Generated:** 2026-07-18T07:50:07.480Z
**Run mode:** sampled (1 of 1971 sitemap URLs, biased toward camps + watchlist)
**STATUS: STAGED, NOT APPLIED.** Nothing here has touched astro.config.mjs, D1, or the live site. Every row below needs review before anything ships. This is Class C per the PCD Approval Matrix: fully built, one approval away.

## Summary

- URLs checked: 1
- Returning 200 (fine): 0
- Already redirecting (fine, already handled, e.g. the expired-camp 301 policy): 0
- Errored / timed out (network issue this run, not necessarily a real problem, re-run to confirm): 0
- Confirmed dead (404/410): 1
- Required sitemap failures: 1

## Required sitemap coverage failure

- /sitemap-camps.xml: 0 URLs

This run is not a clean 404 audit. An empty or unavailable required sitemap leaves that surface untested and must not be reported as zero broken URLs.

## Proposed redirects

| Dead URL | Status | Proposed target | Match confidence |
|---|---|---|---|
| /camps/soccer-camp-full-day-at-sera-sports-complex/ | 404 | /camps/ | low (hub fallback) (score 0.25) |

### Read before pasting anything

"low (hub fallback)" rows mean no live URL shared enough slug vocabulary to be a confident match. The proposed target is the generic /camps/ or homepage hub, not a specific page. Paste those only if the hub is genuinely the right landing spot; otherwise pick a target by hand.

## Paste-ready astro.config.mjs snippet (NOT applied, review every row above first)

```js
  // Staged by Nora (redirect-fixer.mjs), reviewed row-by-row before pasting.
  redirects: {
    '/camps/soccer-camp-full-day-at-sera-sports-complex': '/camps/',
  },
```

## Re-run

```
node automation/agents/nora/tools/redirect-fixer.mjs                 # sampled, ~250 URLs, camps-biased
node automation/agents/nora/tools/redirect-fixer.mjs --sample=500    # bigger sample
node automation/agents/nora/tools/redirect-fixer.mjs --all           # full sitemap crawl, slower
node automation/agents/nora/tools/redirect-fixer.mjs --watchlist=reports/seo/gsc-404-export.csv
```
