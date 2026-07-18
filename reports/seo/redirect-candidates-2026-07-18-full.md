# Redirect candidates: parentcoachdesk.com

**Generated:** 2026-07-18T07:49:55.352Z
**Run mode:** full crawl (--all)
**STATUS: STAGED, NOT APPLIED.** Nothing here has touched astro.config.mjs, D1, or the live site. Every row below needs review before anything ships. This is Class C per the PCD Approval Matrix: fully built, one approval away.

## Summary

- URLs checked: 1971
- Returning 200 (fine): 1971
- Already redirecting (fine, already handled, e.g. the expired-camp 301 policy): 0
- Errored / timed out (network issue this run, not necessarily a real problem, re-run to confirm): 0
- Confirmed dead (404/410): 0
- Required sitemap failures: 1

## Required sitemap coverage failure

- /sitemap-camps.xml: 0 URLs

This run is not a clean 404 audit. An empty or unavailable required sitemap leaves that surface untested and must not be reported as zero broken URLs.

## No dead URLs found in this run

Every checked URL either returned 200 or was already redirecting. This is a real, positive signal, not a tool failure: the expired-camp 301 policy in src/pages/camps/[slug].astro (getCampBySlugAny + end_date check) is confirmed live and working. A page GSC and this session both independently found returning 404 on 2026-07-12 (/camps/soccer-camp-full-day-at-sera-sports-complex/) now 301s to /camps/wa/ when re-checked 2026-07-15.

This does not mean the site has zero 404s. GSC's exact list requires a Search Console export or API credential. A URL that has fallen out of the sitemap is checked only when supplied through the built-in WATCHLIST or --watchlist=<project-relative CSV-or-text-file>.

## Re-run

```
node automation/agents/nora/tools/redirect-fixer.mjs                 # sampled, ~250 URLs, camps-biased
node automation/agents/nora/tools/redirect-fixer.mjs --sample=500    # bigger sample
node automation/agents/nora/tools/redirect-fixer.mjs --all           # full sitemap crawl, slower
node automation/agents/nora/tools/redirect-fixer.mjs --watchlist=reports/seo/gsc-404-export.csv
```
