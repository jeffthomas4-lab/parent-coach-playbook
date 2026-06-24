# /security-check

Full security audit of parentcoachdesk.com. Covers the four known gaps plus a full sweep.

**Usage:** `/security-check`
**Run after any change to admin-auth.ts, _headers, wrangler.jsonc, or the camps API.**

## Steps

1. Delegate to `security-engineer` subagent:

   > Audit parentcoachdesk.com for security issues. Stack: Astro hybrid on Cloudflare Pages, Cloudflare D1 for camps, Cloudflare Access protecting /admin/*, admin-auth.ts for session verification, affiliates.json and /go/ redirect handler for affiliate links. Four known gaps to prioritize: (1) admin-auth.ts decodes the Cloudflare Access JWT without verifying the signature — verify against Cloudflare JWK endpoint, (2) CSP in _headers uses unsafe-inline for script-src — report fix path, (3) npm audit shows production-relevant CVEs in devalue and fast-xml-builder — run npm audit fix for safe patches, (4) /api/camps/* has no rate limiting — confirm Cloudflare dashboard rule exists or flag as missing. Also check: affiliate redirect allowlist (no open redirect), rel="sponsored nofollow noopener" on affiliate links, /go/ blocked in robots.txt, admin routes not accessible at non-admin URLs. Output: Critical / High / Medium / Low findings with file:line and exact fix for each Critical and High.

2. For any Critical: block deploy until resolved
3. For any High: fix within 7 days, note in session summary

**Output:** Security Engineer Report with executive summary, findings by severity, and files changed.
