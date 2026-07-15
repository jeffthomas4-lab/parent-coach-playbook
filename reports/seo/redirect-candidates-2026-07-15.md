# Redirect candidates: parentcoachdesk.com

**Generated:** 2026-07-15T14:32:12.903Z
**Run mode:** full crawl (--all)
**STATUS: STAGED, NOT APPLIED.** Nothing here has touched astro.config.mjs, D1, or the live site. Every row below needs review before anything ships. This is Class C per the PCD Approval Matrix: fully built, one approval away.

## Summary

- URLs checked: 2629
- Returning 200 (fine): 2629
- Already redirecting (fine, already handled, e.g. the expired-camp 301 policy): 0
- Errored / timed out (network issue this run, not necessarily a real problem, re-run to confirm): 0
- Confirmed dead (404/410): 0

## No dead URLs found in this run

Every checked URL either returned 200 or was already redirecting. This is a real, positive signal, not a tool failure: the expired-camp 301 policy in src/pages/camps/[slug].astro (getCampBySlugAny + end_date check) is confirmed live and working. A page GSC and this session both independently found returning 404 on 2026-07-12 (/camps/soccer-camp-full-day-at-sera-sports-complex/) now 301s to /camps/wa/ when re-checked 2026-07-15.

This does not mean the site has zero 404s. GSC's Page Indexing report showed 53 as of 2026-07-08, up from 15 on 2026-06-15. This tool crawled all 2629 current sitemap URLs, not the specific 53 GSC flagged (GSC's exact list requires signing into Search Console; this tool has no API credential for that). A URL GSC flagged as 404 that has since fallen out of the sitemap entirely (an expired camp removed from D1 rather than redirected, for example) would not be checked here by definition, since the sitemap only lists what is currently live. Close that gap by exporting the Page Indexing "Not found (404)" table from Search Console by hand and feeding it to this script as a watchlist. The WATCHLIST array at the top of the file is exactly that hook.

## Re-run

```
node automation/agents/nora/tools/redirect-fixer.mjs                 # sampled, ~250 URLs, camps-biased
node automation/agents/nora/tools/redirect-fixer.mjs --sample=500    # bigger sample
node automation/agents/nora/tools/redirect-fixer.mjs --all           # full sitemap crawl, slower
```
