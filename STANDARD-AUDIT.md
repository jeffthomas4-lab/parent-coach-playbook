# Standard Audit: parent-coach-desk (parentcoachdesk.com)

Tracks this project against the Website Build Standard (`About Me/Website-Build-Standard.md`). One row per pillar. Status values: pass, fail, fixed, waived, not yet run. No site reaches the Deployment norm with an open Critical in any pillar.

Last updated: 2026-06-27 (full /web:audit pass; consent, Leaflet, web-vitals fixes applied).

| # | Pillar | Status | Note |
|---|--------|--------|------|
| 1 | Security | pass | No Critical/High. 11-point gate confirmed. Admin behind CF Access + allowlist. D1 queries parameterized. See `SECURITY-AUDIT.md`. |
| 2 | Privacy | fixed | DATA-MAP.md completed: retention windows and deletion paths documented for every store. `/disclosure/` serves as the privacy policy; matches the map. |
| 3 | Consent & Analytics | fixed | ConsentBanner component added to BaseLayout — GA4 loads only after localStorage `pcd_consent=yes`. EU geo-fence and DNT/GPC still apply. Leaflet and web-vitals moved from CDN (unpkg.com, cdn.jsdelivr.net) to npm bundles; both domains removed from CSP. Cloudflare Web Analytics runs consent-free. |
| 4 | UI & Design System | pass | CSS custom properties for all 9 color tokens. Self-hosted fonts (Fraunces, Mulish, JetBrains Mono via @fontsource). Metric-adjusted fallbacks eliminate swap-CLS. Button variants (.btn, .btn-soft, .btn-ghost), tag pills, focus ring (*:focus-visible) all defined. Tokens extracted to TEMPLATES/web/design-tokens.css. |
| 5 | Terms & Legal | fixed | Terms of Service at /terms/, privacy at /disclosure/. Both linked in footer. Field & Forge Ventures operator name added to both pages. Governing law (Washington, USA) stated. Templates written to TEMPLATES/web/. |
| 6 | Accessibility | fixed | prefers-reduced-motion: added to global.css (was on accessibility page but not in CSS). Skip link, focus ring, semantic landmarks, ARIA on nav dropdowns all present. WCAG 2.1 AA conformance target stated on /accessibility/. |
| 7 | Tech Stack Norms | pass | Cloudflare Pages + Astro SSR. D1 (activity-radar), R2 (activityradar-photos). CF Access on admin routes. No keys in frontend. Build + wrangler per Deployments.md. GitHub backup under jeffthomas4-lab. |
| 8 | Operations & Reliability | not yet run | New pillar added 2026-07-05 from the best-practices intake (`About Me/Website-Build-Standard.md`). This is the reference site for the standard — run `/web:ops` here first so its patterns (logging, monitoring, backup testing) become what the other sites copy, same as Pillar 4's tokens and Pillar 5's legal templates. |

## Open items

| # | Severity | Pillar | Item |
|---|----------|--------|------|
| 1 | LOW | 4 — UI | NavBar uses hardcoded hex in inline style attributes (`color: '#C5713D'` / `'#2D2520'`) instead of CSS vars. Values match tokens. Fix before any rebranding. |
| 2 | INFO | 1 — Security | Admin-auth.ts decodes CF Access JWT without signature verification (trusts Access policy, not the token). Acceptable while Access policy is attached. Harden in phase 2: verify against JWKS. |
| 3 | NOT YET RUN | 8 — Operations | Pillar 8 added 2026-07-05. Run `/web:ops` — as the reference site, do this one first. |

## Code-quality reviewers (non-pillar)

| Reviewer | Status | Note |
|----------|--------|------|
| /web:structure | pass | Conventional Astro 5 layout. .gitignore covers dist/, .env*, node_modules. Dead Sanity entries harmless. |
| /web:data-model | pass | D1 queries parameterized with .prepare().bind(). Dynamic column builder in updateCamp uses allowlist only. 10 forward-only migrations. |
| /web:naming | pass | Routes match URL patterns. Components PascalCase, utils camelCase. |
| /web:states | pass | DB availability check + try/catch + empty-state renders in camps/index.astro and SSR pages. |
| /web:errors | pass | Generic messages to client, detailed errors to console.error only. No stack traces in responses. |
| /web:performance | pass | Cache headers solid (1yr immutable for hashed bundles, edge cache for HTML). Fonts self-hosted. CLS fallbacks present. Leaflet and web-vitals now bundled — no CDN deps remaining. |
| /web:mobile | pass | Mobile-first nav with hamburger at lg:hidden. article-body responsive font. container-px 24px mobile padding. clamp() type scale. |
| /web:deploy | pass | Deploy commands match Deployments.md. wrangler.jsonc correct project/database bindings. |
| /web:demo-test | pass | npm run build (astro build + worker bundle) passes cleanly on all changes. |

## Definition of done checklist

- [x] STANDARD-AUDIT.md exists at root — every pillar marked.
- [x] SECURITY-AUDIT.md (11-item gate) complete.
- [x] DATA-MAP.md exists and retention/deletion paths documented.
- [x] Privacy policy and Terms of Service live and linked in footer.
- [x] Accessibility pass (skip link, focus ring, ARIA, prefers-reduced-motion fixed).
- [x] Build compiles and deploys through Deployment norm.
- [x] No open Critical or High items.
- [ ] Pillar 8 (Operations & Reliability, added 2026-07-05) — not yet run.

Pillars 1-7 pass or fixed. No open Criticals or Highs. Pillar 8 is new and outstanding; run `/web:ops` before calling this fully current against the standard.
