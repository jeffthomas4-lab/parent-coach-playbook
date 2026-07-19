--- name: linda-affiliate-degradation-weekly description: Weekly browser-verified check of affiliate link CONTENT degradation (out-of-stock, redirect-to-search, domain change) and a hard-404 backstop, on a slug-based monthly rotation. Reports only; never edits or deploys. ---

This is an automated run of a scheduled task. The user (Jeff) is not present. Execute autonomously, make reasonable choices, and note them. This task is READ-ONLY: you report, you never edit affiliates.json, never deploy, never push. End your response with <run-summary>one line: X checked, Y confirmed issues, Z false positives dismissed, plus any unconfirmed count</run-summary>.

You maintain the affiliate links for parentcoachdesk.com. Repo: find the mounted "Claude Cowork" folder, then Outputs/parent-coach-desk. Affiliate slugs and destinations live in src/data/affiliates.json; links are served to users via https://parentcoachdesk.com/go/[slug]/ with rel="sponsored nofollow noopener".

WHAT THIS TASK IS FOR — read carefully, it changed:
There is a daily-cron link-checker Worker in the repo (worker-link-checker/) meant to catch hard 404s on every link, so this task can focus on content-level degradation a status check misses. IMPORTANT: as of 2026-07-18 that worker was NOT deployed and confirmed:  no link_health table exists in the parent-coach-playbook D1, and no link-checker worker is live. So until Jeff confirms the daily worker is deployed and the link_health table is populating, DO NOT assume 404s are covered elsewhere — treat hard 404s as in-scope this run too. Once the worker is confirmed live (a populated link_health table with recent last_checked dates), you can revert to degradation-only and let the worker own 404s.

Also note a separate affiliate governance/lifecycle system may touch these slugs (src/data/affiliate-governance.json, reports/affiliate/lifecycle.json, a monthly reconciler). When you suggest a swap, flag it for review; do not assume you are the only system on that slug.

STEP 1 — Load the slug list and rotation state.
Read src/data/affiliates.json (all slugs). Read reports/link-health/STATE.md — it tracks each slug's last-checked date individually (slug -> date), NOT index ranges (index ranges break when slugs are added/removed/reordered, which happens often).

STEP 2 — Pick this run's batch, REVENUE-WEIGHTED then oldest.
Target ~65 slugs (roughly total slugs / 4, so every slug is covered ~monthly; scale the batch if affiliates.json grows). Within that budget, order by:
  a. slugs placed on your highest-traffic pages first (a dead link on a page nobody visits costs nothing; a dead link on a top page costs real money) — infer traffic from which guides/articles are most linked, or from any analytics you can read;
  b. then never-checked slugs;
  c. then oldest last-checked date.
Update each checked slug's date in STATE.md after the run.

STEP 3 — Check each selected slug for CONTENT degradation, not just status.
Look for: out-of-stock / "currently unavailable"; a redirect to a generic Amazon search or category page instead of the specific product; a changed merchant domain. If you hit a hard 404, report it too (see the premise note above — don't assume it's caught elsewhere yet).
Also confirm the /go/[slug]/ redirect itself resolves to the intended destination (a broken redirect is invisible to a destination-only check).
AMAZON THROTTLING — space Amazon/amzn.to requests at least 5-10 seconds apart (30s is safest). Sub-second spacing trips Amazon's bot detection, which returns a CAPTCHA/"currently unavailable" page that looks like a real stockout. This caused 6 false positives on 2026-07-06. Keep Amazon fetch volume low; prefer browser verification of genuine suspects over re-fetching everything.

STEP 4 — Two-tier verification, REQUIRED before reporting anything broken/degraded.
Re-check each flag in a real browser (Claude in Chrome: navigate, then read the stock/availability status). Only report broken/degraded if the browser confirms it. Note per flag whether it was confirmed or a dismissed bot-detection false positive.
FALLBACK (unattended, Chrome not connected): do NOT report anything as broken from a raw fetch. List those under "Unconfirmed — needs manual browser recheck" with the reason. Reporting raw-fetch results as broken is exactly the false-positive failure this task guards against.

STEP 5 — Spot-check 10 random live pages from https://parentcoachdesk.com/sitemap-content.xml for broken internal links. Cloudflare email-obfuscation links (/cdn-cgi/l/email-protection#...) always 404 under plain HTTP because they need client-side JS — that is expected, do not report them.

STEP 6 — Write a dated report to Outputs/parent-coach-desk/reports/link-health/LINK_HEALTH_[date].md:
  - One-line summary at top: X checked, Y confirmed issues, Z false positives dismissed, plus any Unconfirmed count.
  - Confirmed broken/degraded links (browser-confirmed only), each with the slug, what's wrong, and a suggested replacement product/ASIN or slug to swap.
  - Any Unconfirmed flags.
  - A short "what changed since last week" note.
Recommendations only. Do NOT edit affiliates.json and do NOT deploy — Jeff reviews and pushes.
