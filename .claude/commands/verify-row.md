# /content-audit

Audit existing content for quality and integrity issues before a quarterly review or before turning on a new section.

**Usage:** `/content-audit [scope]`

Scope options: `articles`, `coaching-tips`, `gear`, `affiliates`, `full`

## Steps

1. Delegate to `data-quality` subagent:

   > Audit [scope] in parentcoachdesk.com for content integrity issues. Check: (1) missing bluf fields in articles and coaching tips, (2) affiliateSlug references in gear guides that don't exist in affiliates.json, (3) sport values not in the SPORTS array in src/data/site.ts, (4) banned words from the anti-AI writing guide in body copy, (5) gendered defaults (he/she for generic kids or parents), (6) acronyms used without expansion on first use (AED, CPR, EMS, etc.), (7) /go/[slug]/ links in content that reference slugs not in affiliates.json, (8) Amazon URLs in affiliates.json missing ?tag=parentcoachpl-20. Output per issue: FILE | ISSUE_TYPE | FIELD | DETAIL | FIX. Safe fixes (tag normalization, lazy loading attributes) can be applied directly. Editorial copy issues escalate to Jeff.

2. Apply safe fixes directly
3. Flag editorial issues for Jeff — never rewrite article body copy autonomously

**Output:** Issue count by type. Applied fixes list. Escalations for Jeff.
