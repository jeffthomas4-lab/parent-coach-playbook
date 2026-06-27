# Standard Audit: parent-coach-desk (parentcoachdesk.com)

Tracks this project against the Website Build Standard (`About Me/Website-Build-Standard.md`). One row per pillar. Status values: pass, fail, fixed, waived, not yet run. No site reaches the Deployment norm with an open Critical in any pillar.

Last updated: 2026-06-27 (full /web:audit pass via 15 reviewers).

| # | Pillar | Status | Note |
|---|--------|--------|------|
| 1 | Security | pass | No Critical/High. 11-point gate confirmed. Admin behind CF Access + allowlist. D1 queries parameterized. See `SECURITY-AUDIT.md`. |
| 2 | Privacy | fixed | DATA-MAP.md completed: retention windows and deletion paths documented for every store. `/disclosure/` serves as the privacy policy; matches the map. |
| 3 | Consent & Analytics | open HIGH | GA4 fires for US non-DNT/GPC users without a consent banner. Mitigations: EU geo-fence, DNT/GPC honored, anonymize_ip, no signals. Cloudflare Web Analytics (cookieless) runs in parallel. Decision needed: add banner OR remove GA4 and rely on CF Analytics only. Not a legal violation for US-audience site but out of spec with the standard. Leaflet CSS/JS loaded from unpkg.com CDN (MEDIUM). web-vitals from cdn.jsdelivr.net (LOW, gated on GA4). |
| 4 | UI & Design System | pass | CSS custom properties for all 9 color tokens. Self-hosted fonts (Fraunces, Mulish, JetBrains Mono via @fontsource). Metric-adjusted fallbacks eliminate swap-CLS. Button variants (.btn, .btn-soft, .btn-ghost), tag pills, focus ring (*:focus-visible) all defined. Tokens extracted to TEMPLATES/web/design-tokens.css. |
| 5 | Terms & Legal | fixed | Terms of Service at /terms/, privacy at /disclosure/. Both linked in footer. Field & Forge Ventures operator name added to both pages. Governing law (Washington, USA) stated. Templates written to TEMPLATES/web/. |
| 6 | Accessibility | fixed | prefers-reduced-motion: added to global.css (was on accessibility page but not in CSS). Skip link, focus ring, semantic landmarks, ARIA on nav dropdowns all present. WCAG 2.1 AA conformance target stated on /accessibility/. |
| 7 | Tech Stack Norms | pass | Cloudflare Pages + Astro SSR. D1 (activity-radar), R2 (activityradar-photos). CF Access on admin routes. No keys in frontend. Build + wrangler per Deployments.md. GitHub backup under jeffthomas4-lab. |

## Open items

| # | Severity | Pillar | Item |
|---|----------|--------|------|
| 1 | HIGH | 3 — Consent | GA4 loads without consent banner for US users. Fix: add a lightweight banner that gates GA4, or remove GA4 and rely on Cloudflare Web Analytics alone (preferred per the standard). |
| 2 | MEDIUM | 3 — Consent | Leaflet CSS and JS loaded from unpkg.com CDN. SRI hash present. Fix: `npm install leaflet`, import CSS in component, switch map init from global `L` to bundled import, remove unpkg.com from CSP. |
| 3 | LOW | 3 — Consent / 7 — Tech | web-vitals loaded from cdn.jsdelivr.net. Only loads when GA4 loads. Fix: add `web-vitals` to package.json and import from bundle, or remove (GA4 tracks core metrics natively). |
| 4 | LOW | 4 — UI | NavBar uses hardcoded hex in inline style attributes (`color: '#C5713D'` / `'#2D2520'`) instead of CSS vars. Values match tokens. Fix before any rebranding. |
| 5 | INFO | 1 — Security | Admin-auth.ts decodes CF Access JWT without signature verification (trusts Access policy, not the token). Acceptable while Access policy is attached. Harden in phase 2: verify against JWKS. |

## Code-quality reviewers (non-pillar)

| Reviewer | Status | Note |
|----------|--------|------|
| /web:structure | pass | Conventional Astro 5 layout. .gitignore covers dist/, .env*, node_modules. Dead Sanity entries harmless. |
| /web:data-model | pass | D1 queries parameterized with .prepare().bind(). Dynamic column builder in updateCamp uses allowlist only. 10 forward-only migrations. |
| /web:naming | pass | Routes match URL patterns. Components PascalCase, utils camelCase. |
| /web:states | pass | DB availability check + try/catch + empty-state renders in camps/index.astro and SSR pages. |
| /web:errors | pass | Generic messages to client, detailed errors to console.error only. No stack traces in responses. |
| /web:performance | pass/open | Cache headers solid (1yr immutable for hashed bundles, edge cache for HTML). Fonts self-hosted. CLS fallbacks present. Open: Leaflet + web-vitals CDN (see open items 2–3 above). |
| /web:mobile | pass | Mobile-first nav with hamburger at lg:hidden. article-body responsive font. container-px 24px mobile padding. clamp() type scale. |
| /web:deploy | pass | Deploy commands match Deployments.md. wrangler.jsonc correct project/database bindings. |
| /web:demo-test | pass | npm run build passes cleanly (Astro build + worker bundle). OG images cached and unchanged. |

## Definition of done checklist

- [x] STANDARD-AUDIT.md exists at root — every pillar marked.
- [x] SECURITY-AUDIT.md (11-item gate) complete.
- [x] DATA-MAP.md exists and retention/deletion paths documented.
- [x] Privacy policy and Terms of Service live and linked in footer.
- [x] Accessibility pass (skip link, focus ring, ARIA, prefers-reduced-motion fixed).
- [x] Build compiles and deploys through Deployment norm.
- [ ] Open HIGH: GA4 consent banner or GA4 removal — must be resolved before international expansion.

No open Critical. Site is shippable for US audience.
