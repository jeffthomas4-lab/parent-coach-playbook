# parentcoachdesk.com — Full Site Audit
**Date:** June 11, 2026  
**Scope:** Backend, frontend, security, SEO, performance, growth readiness

---

## What's Actually Working

Start here because most audits skip it and that's a mistake. You can't prioritize fixes if you don't know what's already load-bearing.

**Infrastructure is genuinely solid.** Astro hybrid (static + SSR at the edge) on Cloudflare Pages with D1 is the right stack for this site. Static pages go out of Cloudflare's 300+ edge nodes. The camps feature runs SSR without touching a cold server. Cache headers are correctly tiered: hashed assets at 1 year, HTML at 1 day edge / 5 min browser, admin routes at no-store. That's not default behavior. Someone thought it through.

**Security posture is above average for a content site.** You have HSTS with preload, X-Frame-Options: DENY, CORP: same-origin, Referrer-Policy, Permissions-Policy. The CSP exists, which puts you ahead of 90% of sites this size. Admin routes have a second layer of belt-and-suspenders headers beyond the Cloudflare Access policy. The CSRF protection in admin-auth.ts (Origin + Referer double-check) is real implementation, not a comment saying "add CSRF later." Affiliate redirect links correctly carry rel="sponsored nofollow noopener." Amazon and CJ network links don't get UTMs incorrectly appended.

**SEO fundamentals are in place.** Article schema, BreadcrumbList, WebSite with SearchAction, per-article OG images built at deploy time, canonical URLs on every page, lastmod on the sitemap, RSS feed, AI bot directives in robots.txt (explicit allow for citation-building), proper hreflang-equivalent setup. The `bluf` field in content frontmatter feeding featured snippets is a real strategy, not a checkbox. Author schema has a one-flag reveal switch for when you go public with your identity.

**Content volume is not the problem.** 372 articles, plus guides, coaching tips, scripts, decisions, rules, season calendars, adaptive content, recruiting, pathways, and news. 1,329 total content files. The site is not thin. Thin content is not why you're not getting traffic yet.

---

## Security: What Needs Fixing

### Critical: Unverified JWT

The `admin-auth.ts` file decodes the Cloudflare Access JWT from the CF_Authorization cookie **without verifying the signature.** The comment in the code flags this explicitly ("Hardening for phase 2: verify the JWT signature against Access JWKs"). The current logic relies on Cloudflare being the only entity that can set that cookie domain. That's correct in production but it's a gap that gets flagged in security audits. If Cloudflare Access is misconfigured or bypassed (staging environment, a future migration), nothing verifies the token is real.

**Fix:** Add JWK signature verification. Cloudflare publishes Access public keys at `https://<your-team>.cloudflareaccess.com/cdn-cgi/access/certs`. Verify in `getAdminEmailFromCookie()`. This is a standard Web Crypto API call in the Workers runtime.

### Moderate: CSP Uses `unsafe-inline` for Scripts

The Content-Security-Policy in `_headers` allows `'unsafe-inline'` in `script-src`. This is required because the GA4 snippet and other inline scripts in BaseLayout use `is:inline`. The problem is `unsafe-inline` is the main protection XSS gets from CSP, and you've opted out of it.

**Fix path (short-term):** Replace `'unsafe-inline'` with a per-script hash. Astro can generate CSP hashes for inline scripts. It's a config change and some setup in `astro.config.mjs`. Not a weekend project but not months either.

**Fix path (long-term):** Move the GA4 snippet to a Partytown worker or a Cloudflare Worker proxy so no inline scripts are needed. Nonce-based CSP is the gold standard.

### Low: npm Audit Shows 12 Vulnerabilities (5 High)

Running `npm audit` against the current `node_modules` shows:

- `devalue` 5.6.3-5.8.0: high severity, fixable with `npm audit fix`
- `fast-xml-builder`: two CVEs (attribute quote bypass, comment regex bypass), fixable with `npm audit fix`
- `undici` in miniflare: high severity (Cloudflare devtools dep, doesn't ship to production)
- `ws` WebSocket disclosure: moderate (also devtools)
- Astro core and `@astrojs/cloudflare`: flagged as outdated, fix requires major version bump

The devtools-only vulns (undici, ws, esbuild) don't affect production. The `devalue` and `fast-xml-builder` ones do need patching.

**Fix:** Run `npm audit fix` for the safe fixes. The Astro + `@astrojs/cloudflare` major bump (4.x to 5.x) needs a test run first. Astro 5 has breaking changes in content collections.

### Low: Rate Limiting on Public API Endpoints

`/api/camps/submit` and `/api/camps/check` have no rate limiting. The honeypot field catches simple bots but a targeted script can hit the submit endpoint at volume and fill your D1 with garbage. No code in the codebase uses Cloudflare's rate limiting rules API or any middleware to throttle.

**Fix:** Add a Cloudflare Rate Limiting rule in the dashboard for `/api/camps/*`: 10 requests per IP per minute. No code change needed. Dashboard config only.

---

## SEO: What's Missing

### Missing: Internal Linking Is Thin

You have 372 articles and almost no cross-links between them in the body copy. Related articles are surfaced in the sidebar via the `phase` filter, but that's recency-based. Google's link graph for the site is essentially flat. Every article is one link from the homepage and zero links deep from other articles.

This is the biggest SEO gap on the site. Google uses internal links to understand topic authority. A site that covers youth sports costs but has no link from the cost calculator piece to the travel baseball cost breakdown piece, or from the concussion piece to the body section hub, looks like a collection of standalone documents, not an authority on the topic.

**Fix (short-term):** Add 2-3 cross-links in the body copy of every new article going forward. Pick them from the existing content, same topic or adjacent.

**Fix (long-term):** Build a script that scans article bodies and suggests cross-link candidates by keyword overlap. Add a `related_slugs` field to frontmatter that renders as inline contextual links in the article body. Three sessions to build, indefinite return.

### Missing: No `<link rel="sitemap">` in the HTML Head

The sitemap URL is in robots.txt (correct) but not in the HTML `<head>` of each page as a `<link rel="sitemap" type="application/xml" href="/sitemap.xml">`. Some crawlers check both places.

**Fix:** One line in `BaseLayout.astro` head.

### Missing: No Structured Data on Key Tool Pages

The cost calculator, the youth sports pendulum, the scripts section — these are tools, not articles. They'd benefit from `SoftwareApplication` or `WebApplication` schema. Right now they render with no structured data at all, which means no rich results eligibility for them in Google.

**Fix:** Add schema to the four tool pages. One template, four implementations.

### Gap: No FAQ Schema on FAQ-Format Articles

Several articles answer a series of questions (the decision guides, the rules explainers). FAQ schema puts those Q&A pairs directly in the search result as expandable accordion items. That's a significant click rate lift for informational queries.

**Fix:** Add a `faqs` array to content frontmatter schema. If present, render `FAQPage` JSON-LD in ArticleLayout.

### Gap: Lastmod Dates in Sitemap Are Unreliable

The sitemap dynamic SSR uses `publishedAt` as `lastmod`. For static URLs (the pillar pages, the homepage, the tools), it uses `new Date().toISOString()` — which means every deploy tells Google every static page was updated today, whether it was or not. Google will stop trusting your lastmod signals.

**Fix:** Track real modification dates for static pages. Either a hand-maintained `PAGES_UPDATED` map in a data file, or pull git commit times in the build script and expose them.

### Gap: No Canonical Tag on RSS/Sitemap Responses

The RSS feed at `/rss.xml` and sitemap at `/sitemap.xml` don't carry canonical headers. Minor, but worth noting.

---

## Frontend: Performance and UX

### The Hero Image Loads Well

`loading="eager"` and `fetchpriority="high"` on the hero image in `index.astro` is correct. This is what Google uses for LCP measurement. Good.

### Font Loading Has a FOUT Risk

You're loading four font families via `@fontsource` (Fraunces, Mulish, Inter, JetBrains Mono). Fontsource loads via npm imports in CSS. Metric-adjusted fallbacks exist in `tailwind.config.mjs` which shows someone did the FOUT homework. But four font families is heavy. Inter and Mulish serve the same role (body sans). You can likely drop Inter entirely since Mulish is doing that job.

### No Image Lazy Loading Strategy for Article Lists

Article cards throughout the site don't lazy-load images. Some article pages have hero images. When those load in the feed (6 cards at a time), they all fire at once. Not catastrophic, but addressable.

**Fix:** Add `loading="lazy" decoding="async"` to all card-level images. The three drive images on the homepage already do this correctly.

### Cost Calculator and Pendulum Need Preloading

Both tools are high-value, high-conversion pages. They're not prerendered (no `export const prerender = true`). If they're static tools with no server data needed, they should be static. Check whether they need SSR; if not, flip them to static and they'll be served from the edge instantly instead of waiting for a Worker response.

---

## Backend: Camps Feature

The camps D1 database implementation is more sophisticated than you need to be at current traffic levels, which is fine. The auto-approve logic (trusted submitter based on history, bulk import token), the fuzzy duplicate detection, the URL health pre-flight check, the domain quality scoring — this is built for scale.

Two gaps worth noting:

**The BULK_IMPORT_TOKEN comparison is plain string equality.** The comment in submit.ts acknowledges this ("constant-time-ish compare"). In a Workers runtime there's no timing attack surface here (no `crypto.timingSafeEqual` in the standard Web Crypto API for strings), but if you ever move this to Node, plain equality is vulnerable to timing attacks on secret comparison. Non-critical at current scale.

**The `shouldAutoApprove` function trusts submitter history entirely.** If a malicious actor submits five legitimate camps to build trust, then submits junk, it gets auto-approved. This is probably acceptable given the admin review queue, but the `awaiting_review` flag for bulk imports doesn't exist for trusted-submitter auto-approvals. Worth closing that gap by setting `awaiting_review=1` on all auto-approvals, not just bulk imports.

---

## The Growth Plan

### Short-Term (Next 90 Days)

These don't require building anything new. They're fixes to things already in place.

1. **Patch npm vulnerabilities.** `npm audit fix` takes 10 minutes. `devalue` and `fast-xml-builder` are real issues.

2. **Add rate limiting to `/api/camps/*` in Cloudflare dashboard.** 10 requests per IP per minute. 15 minutes in the dashboard.

3. **Add `<link rel="sitemap">` to BaseLayout head.** One line.

4. **Fix sitemap lastmod for static pages.** Static pages reporting today's date on every deploy is poisoning your crawl signals.

5. **Add cross-links in new article body copy going forward.** Not retroactive yet. Just discipline on new articles.

6. **Drop Inter from the font stack.** Mulish covers the same role. One fewer network dependency.

7. **Add Cloudflare Rate Limiting rule for admin routes** (`/admin/*`). Even with Access in front, belt-and-suspenders.

### Medium-Term (90-180 Days)

These require a session or two of building.

1. **Internal link audit script.** Scan article bodies for keyword matches against other articles. Output a CSV of "Article A should link to Article B." Work through it over time. This is the highest-return SEO action on the site.

2. **FAQ schema implementation.** Add `faqs` to content frontmatter. Render `FAQPage` JSON-LD in ArticleLayout when present. Decision guides and rules pages are the priority targets.

3. **WebApplication schema for tools.** Cost calculator, pendulum, scripts browser, season calendar. Four pages, one schema template.

4. **CSP hash-based inline scripts.** Replace `unsafe-inline` with per-script hashes. Astro has a config path for this.

5. **JWT signature verification in admin-auth.ts.** Pull the Access JWKs and verify. Close the phase 2 gap that's documented in the code.

6. **Flip static tool pages to `prerender = true`.** Cost calculator and pendulum don't need SSR. Static = instant.

### Long-Term (6-12 Months)

These matter more as traffic climbs.

1. **Content consolidation pass.** At 372 articles you're approaching the point where similar-topic pieces start competing against each other in Google. Run a topic clustering analysis. Identify cannibal pairs. Merge or establish a clear primary/supporting hierarchy with cross-links.

2. **Author reveal.** The `AUTHOR_REVEALED` flag in `site.ts` is already wired. When you go public with your identity, the `Person` schema replaces `Organization` everywhere automatically. Your coaching credentials and D3 platform are legitimate authority signals. Running anonymous limits E-E-A-T (experience, expertise, authoritativeness, trustworthiness) signals that Google is increasingly weighting.

3. **Structured data audit after content consolidation.** Once the topic hierarchy is cleaner, add `isPartOf` relationships in article schema to build a topic graph Google can read.

4. **Core Web Vitals monitoring.** Set up a Cloudflare Worker that samples CrUX data monthly or pull it from Google Search Console. At 5K+ monthly visitors you'll start seeing real field data. Track LCP, INP, CLS per page type. The homepage hero image is the LCP candidate; it's optimized now but will need watching as the page gets heavier.

5. **Email list integration to site analytics.** You're on Kit. You have newsletter signups. Build a loop: what articles drive the most signups, what signup-to-read behavior looks like, what content the email list clicks back on. That loop tells you what to write next better than any keyword tool.

---

## Priority Order if You Only Have One Session Per Month

If bandwidth is the constraint, do this in order:

- Session 1: npm audit fix + sitemap lastmod fix + sitemap link in head
- Session 2: Rate limiting in Cloudflare dashboard + admin JWT hardening
- Session 3: Internal link script (build it) + first pass of cross-link additions
- Session 4: FAQ schema in ArticleLayout
- Session 5: CSP hash migration
- Session 6: Author reveal prep (sameAs array, updated About page)

Everything else is real but can wait until you're consistently over 10K monthly visitors, when the compounding effects of the structural fixes above will already be in motion.

---

*Audit performed June 11, 2026 against the local source tree. Live site was not crawled; findings are code-based. Run a GSC coverage report alongside this to catch anything the static analysis missed.*
