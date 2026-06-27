# Standard Audit: parent-coach-desk (parentcoachdesk.com)

Tracks this project against the Website Build Standard (`About Me/Website-Build-Standard.md`). One row per pillar. Status values: pass, fail, fixed, waived, not yet run. No site reaches the Deployment norm with an open Critical in any pillar.

Last updated: 2026-06-27 (retrofit scaffold, Pillar 1 seeded from SECURITY-AUDIT.md; pillars 2-7 to be run with the `/web:*` commands).

| # | Pillar | Status | Note |
|---|--------|--------|------|
| 1 | Security | pass | No Critical/High (2026-06-25). Turnstile waived (honeypot today); add before launch. See `SECURITY-AUDIT.md`. |
| 2 | Privacy | partial | `/disclosure/` page names the data home; DATA-MAP not yet completed. See `DATA-MAP.md`. |
| 3 | Consent & Analytics | not yet run | Run `/web:consent`. |
| 4 | UI & Design System | not yet run | Run `/web:ui`. |
| 5 | Terms & Legal | partial | `/terms/` and `/disclosure/` pages exist; full legal review not yet run (`/web:legal`). |
| 6 | Accessibility | not yet run | Run `/web:a11y`. |
| 7 | Tech Stack Norms | pass | Cloudflare Pages + Astro SSR, D1 `activity-radar`, R2 `activityradar-photos`. Deploy per Deployments.md. |

## Open items
- Add Turnstile to public forms before launch (Pillar 1 / Pillar 3).
- Complete DATA-MAP.md and confirm deletion path for submitter emails (Pillar 2).

## How to run
Full pass: `/web:audit`. Single pillar: `/web:security`, `/web:privacy`, `/web:consent`, `/web:ui`, `/web:legal`, `/web:a11y`. Update this table as each is run.
