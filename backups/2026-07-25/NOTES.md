# Backup run notes — 2026-07-25

Database: `activity-radar` (uuid `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`), confirmed as the production DB bound to the `parent-coach-desk` Worker via `wrangler.production.jsonc` (`d1_databases[0].database_name = "activity-radar"`).

## What's fully captured and verified (file row count == COUNT(*))

| table | rows |
|---|---|
| activity_categories | 24 |
| d1_migrations | 11 |
| geocoded_addresses | 1 |
| trust_signals | 9 |
| sqlite_sequence | 1 |
| accreditations | 0 |
| camp_claims | 0 |
| camp_reviews | 0 |
| domain_quality | 0 |
| domain_skip_list | 0 |
| featured_listings | 0 |
| org_claims | 0 |
| org_suggestions | 0 |
| reviews | 0 |
| search_anchors | 0 |
| search_batches | 0 |
| search_domains | 0 |
| sessions | 0 |
| submitters | 0 |

19 tables, 46 rows total, all verified clean.

## What's NOT captured this run

| table | row count (COUNT(*)) | status |
|---|---|---|
| organizations | 198,287 | not exported |
| enrichment_queue | 182,884 | not exported |
| programs | 2,763 | not exported |
| zip_centroids | 33,791 | not exported (1 page of 500 sampled, not written) |
| link_health | 681 | not exported |
| search_events | 163 | not exported |
| programs_staging | 106 | not exported |
| camp_scan_queue | 673 | **partial** — `camp_scan_queue.json` has 60 of 673 rows only |
| _cf_KV | unknown | inaccessible — query returns `SQLITE_AUTH`, this is a Cloudflare-internal D1 Sessions API bookmark table, not application data |

## Why

This backup runs through the Cloudflare D1 MCP query tool (`d1_database_query`), which is a request/response SQL interface, not a bulk export API. There is no `wrangler d1 export` available in this run's shell (no Cloudflare API token in the sandbox — `wrangler whoami` returns not authenticated), so the only path to pull rows is paginated `SELECT ... LIMIT n OFFSET n` calls, with each page's JSON result relayed through the agent's own context window.

Two hard limits collided:
1. Any single query result over roughly 25,000–50,000 characters gets diverted to a side file that this session's Bash/Read tools cannot reach (it lives outside the four mounted paths), so pages have to stay small to come back inline.
2. `organizations` and `programs` rows are wide (~1,000–3,000 bytes each after JSON-encoding all columns). At a safe page size, `organizations` alone would need on the order of 2,000+ round trips. `enrichment_queue` (182,884 narrow rows) and `zip_centroids` (33,791 small rows) are large on row count even though each row is cheap. None of this is achievable in a single agent session without risking a corrupted or silently-truncated export, which is worse than an honest partial one.

`camp_scan_queue.json` is left partial (60/673) rather than deleted, since real data is still real data, but it should not be treated as a restorable table dump.

## Recommendation

This class of backup needs a path that never routes bulk rows through the LLM context:
- Provide a Cloudflare API token to the backup task's shell so `npx wrangler d1 export --remote` can run directly and produce a real SQL dump server-side, or
- Add a dedicated bulk-export tool to the Cloudflare MCP server, or
- Build a small Worker/cron route that reads D1 and writes a full dump straight to R2 or the git repo via the GitHub API, with no agent in the loop for the data itself.

Until one of those exists, treat this backup as a partial, non-clean run. It should not count toward the Phase 0 proving clock.
