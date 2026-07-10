# Standard Audit — ActivityRadar (activityradar.com)

Tracks this project against `About Me/Website-Build-Standard.md`. No open Critical blocks launch.

Last updated: 2026-07-07 (Pillar 6 accessibility re-verified against WCAG 2.1 AA; three fixes made — see Pillar 6 row. Changes are code-only and need a redeploy to reach the live site.)

| # | Pillar | Status | Note |
|---|--------|--------|------|
| 1 | Security | fixed | Google Fonts CDN removed; CORS locked; Turnstile added to forms. Admin token-in-URL is MEDIUM (deferred). See `SECURITY-AUDIT.md`. |
| 2 | Privacy | fixed | `/privacy` page added; `DATA-MAP.md` complete. Policy matches the map. |
| 3 | Consent & Analytics | fixed | Cloudflare Web Analytics beacon added (cookieless, no consent banner needed). No other third-party analytics. |
| 4 | UI & Design System | fixed | JetBrains Mono self-hosted via @fontsource. Tailwind token system consistent. All components use named classes. |
| 5 | Terms & Legal | fixed | `/terms` page added. `/privacy` page added. Both linked in footer. |
| 6 | Accessibility | fixed | Re-verified 2026-07-07: full source pass against WCAG 2.1 AA. Confirmed good: html lang, unique titles, skip link, landmarks, labeled inputs (incl. both autocomplete comboboxes with aria-expanded/listbox/keyboard support), role=alert on form errors, th scope=col on admin tables, prefers-reduced-motion in global.css, focus-visible ring. Confirmed the rust token was already darkened to `#a4552a` (tailwind.config.mjs, dated 2026-07-07 by an interrupted prior session) — computed ratios: white-on-rust 5.4:1, rust-on-white 5.4:1, rust-on-cream 5.0:1, rust tags 4.7:1, all pass. Fixed this pass: (1) `org/[slug].astro` had an `<a>` (Register) nested inside the program-card `<a>` plus a non-functional `onClick` attribute — converted card to div + stretched program-name link, Register link now a valid sibling with new-tab announcement; (2) breadcrumb `<nav>`s on 6 pages had no accessible name while the header nav is labeled — added `aria-label="Breadcrumb"`; (3) admin/gaps 401 response HTML lacked `lang`/`<title>` — added. |
| 7 | Tech Stack Norms | pass | Cloudflare Pages + Astro hybrid, D1, R2. Deploy per `About Me/Deployments.md`. No CDN fonts or external JS except Cloudflare-owned (Turnstile, Web Analytics). |
| 8 | Operations & Reliability | not yet run | New pillar added 2026-07-05 from the best-practices intake (`About Me/Website-Build-Standard.md`). Needs a first `/web:ops` pass: logging, error tracking, uptime/business-metric monitoring, tested backups, incident runbook, load testing. |
| 9 | Testing & CI | not yet run | Pillar added 2026-07-05 (consultant pass). Data app sharing the canonical D1: Vitest suite (happy/failure/auth per route), npm audit gate, ci.yml. |
| 10 | SEO & Discoverability | not yet run | Pillar added 2026-07-05. Public directory site: full baseline (titles, meta, OG, sitemap, robots, Search Console). |

## Open items (not blocking — act before significant traffic)

- **Pillar 6 ACTION (Jeff)** — Redeploy so the 2026-07-07 accessibility fixes (org-page card markup, breadcrumb labels, admin 401 page) and the darkened rust token reach the live site.
- **Pillar 1 MEDIUM** — `admin/gaps.astro` uses token-in-URL auth. Move behind Cloudflare Access before launch.
- **