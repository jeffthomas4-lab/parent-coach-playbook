# /red-team

Attack simulation against a named scope. Use before launching any new user-facing feature.

**Usage:** `/red-team [scope]`

Scope options: `camps-submit`, `affiliate-redirects`, `admin`, `content-import`, `full`

## Steps

1. Delegate to `security-engineer` subagent with the specified scope:

   > Red-team [scope] on parentcoachdesk.com. Attempt to break or abuse each attack surface:
   >
   > camps-submit: submit garbage data, attempt SQL injection in camp name/city fields, submit at high volume to test rate limiting, attempt to bypass the honeypot field, attempt to inject a malicious URL into the camp website field, submit a duplicate of an existing camp.
   >
   > affiliate-redirects: attempt to craft a /go/[slug]/ URL that redirects to a non-allowlisted domain (open redirect), verify rel="sponsored nofollow noopener" is present on all rendered affiliate links, verify /go/ is blocked in robots.txt.
   >
   > admin: attempt to access /admin/* without Cloudflare Access authentication, attempt to craft a valid-looking JWT without the correct signature, check all admin API routes for missing auth middleware.
   >
   > content-import: attempt to inject banned words through bulk import, attempt to import a duplicate coaching tip, attempt to import an Amazon URL missing the affiliate tag.
   >
   > full: run all of the above.
   >
   > For each attack: ATTACK | RESULT (Blocked/Succeeded/Partial) | FINDING | FIX

2. Any Succeeded attack is a Critical finding — block deploy until resolved

**Output:** Attack results table. Summary: blocked / partial / succeeded. Recommended fixes for any succeeded or partial attacks.
