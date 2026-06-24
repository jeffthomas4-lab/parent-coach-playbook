# /data-import-check

Validate a bulk content import before anything goes live.

**Usage:** `/data-import-check [file-path or description]`

Applies to: coaching tips batch, gear guide entries, camp listings, affiliate slug batches.

## Steps

1. Identify the import file or describe what's being imported
2. Delegate to `data-acquisition` subagent:

   > Validate the import at [file-path] for parentcoachdesk.com. Import type: [coaching-tips / gear / camps / affiliates]. Check: (1) deduplication — flag any record that matches an existing entry by name within edit distance 2, (2) required fields present for the type (see data-acquisition agent for field lists), (3) for affiliates: every Amazon URL has ?tag=parentcoachpl-20, no amzn.to short links, (4) sport values match the canonical SPORTS array in src/data/site.ts, (5) no banned words from the anti-AI writing guide in any body copy, (6) no gendered defaults (he/she for generic kids or parents). Output: TOTAL | ACCEPTED | FLAGGED | REJECTED | DUPLICATES. For rejected and flagged: row number, field, reason.

3. Never write flagged or rejected rows to the site
4. Queue all flagged rows for Jeff review before proceeding

**Output:** Import summary table. List of rejected rows with reasons. List of flagged rows for Jeff review.
