# /billing-check

Run the affiliate revenue audit.

**Usage:** `/billing-check`
**Run quarterly (next: September 2026) or before any change to affiliates.json.**

## Steps

1. Read `src/data/affiliates.json` — full list of affiliate slugs and destinations
2. Delegate to `billing-finance` subagent:

   > Audit the parentcoachdesk.com affiliate revenue setup. Check: (1) every Amazon destination URL contains `?tag=parentcoachpl-20`, (2) no amzn.to short links present, (3) all `/go/[slug]/` destinations resolve to live product pages (spot-check top 20 by placement count), (4) CJ network links carry the correct affiliate ID, (5) non-Amazon links have UTM parameters (`utm_source=parentcoachdesk`, `utm_medium=affiliate`, `utm_campaign=[campaign]`), (6) FTC disclosures present on all gear hub and affiliate-heavy pages. Output per-check Pass/Fail/Not Implemented with file:line for each Fail.

3. For any dead affiliate link: flag for Jeff review — product swaps are editorial decisions
4. For any missing affiliate tag: fix in `affiliates.json` directly

**Output:** Per-check status table. Summary: all-pass / issues-found / escalated-to-Jeff.
