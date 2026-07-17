# Parent Coach Desk — Counsel Review Packet

**Prepared:** 2026-07-17  
**Purpose:** Obtain written legal advice before customer-facing identity, owner-management, reviews, uploads, marketing-email, payment, or commerce features are activated. This is an engineering evidence packet, not legal advice or a legal-compliance claim.

## Decision requested

Please provide written advice that identifies:

1. The jurisdictions and rules that apply to the intended launch and the facts that control that conclusion.
2. Required changes to public Terms, Privacy and Disclosure, feature design, notices, consent, retention, and contracts before launch.
3. Features that must remain disabled until a separate review.
4. Any required insurance, entity/contact, tax, consumer, accessibility, advertising, or children/minor-data action.
5. A disposition: **approved**, **approved subject to listed conditions**, or **not approved**, with the reviewed artifact versions and date.

## Product currently in scope

Parent Coach Desk is a parent- and coach-facing editorial website with a directory of youth camps and leagues. It publishes informational content and public directory listings; it is not a medical, legal, financial, safety, accreditation, or camp-inspection service.

The staging Worker has an application administrator allowlist limited to `eepskalla@gmail.com` and `jeffthomas4@gmail.com`. Public parent-facing email remains staged. Internal alerts are designed to require both a privacy-safe Slack routing signal and email to an allowlisted administrator.

### Features deliberately disabled or not approved for launch

- Parent/customer identity and tenant features.
- Checkout, payment collection, and commerce activation.
- Camp-owner claims, owner-managed profiles, public reviews, and photo uploads.
- Marketing-email delivery and newsletter-provider activation proof.
- Search-demand telemetry.
- Production operational-database migration and production customer-data writes.

The public directory and the narrowly scoped Plan 015 editorial-approval repair are deployed to production. That deployment is not a customer-readiness certification: the independent backup/recovery, notification-receipt, complete customer-journey, authenticated Access, risk-disposition, and operational-migration release gates remain open. No customer operational data has been written to the dedicated production PCD operations database.

## Materials for review

| Topic | Source | Counsel question |
|---|---|---|
| Public Terms | `src/pages/terms.astro` | Is the governing-law, warranty, liability, intellectual-property, user-submission, photo-consent, and takedown language suitable for the actual entity, geography, and planned services? |
| Privacy and affiliate disclosure | `src/pages/disclosure.astro` | Does the notice accurately describe current collection, analytics, newsletters, directory submissions, children/minor posture, rights handling, affiliate relationships, and contact information? |
| Current data inventory | `DATA-MAP.md` | What privacy notice, retention, rights-request, vendor, and data-transfer obligations apply? |
| Technical security boundary | `SECURITY-AUDIT.md`, `coordination/reviews/2026-07-16-current-security-boundary-audit.md` | Are the described controls and public claims appropriately scoped? |
| Incident and recovery | `INCIDENT-RUNBOOK.md`, `coordination/release-evidence/recovery-tabletop-2026-07-16.json` | Does the incident, notification, backup, restoration, and communications plan meet required obligations? |
| Privacy-request lifecycle | `migrations-pcd-ops/0015_privacy_request_lifecycle.sql`, `migrations-pcd-ops/0021_privacy_execution_evidence.sql`, `src/lib/privacy-lifecycle.ts` | Are intake, identity verification, deadlines, extensions, exemptions, deletion, and evidence handling suitable? |
| Release controls | `coordination/release-evidence/rc01.json` | Which unresolved launch gates are legal stop-ship conditions? |
| Legal/privacy audit | `coordination/reviews/2026-07-16-legal-privacy-claims-audit.md` | Confirm, revise, or reject the open-item assessment and prohibited claims. |

## Data and vendor questions requiring explicit reconciliation

The packet intentionally identifies these discrepancies as unresolved. They must not be represented publicly as settled facts until counsel and product owners resolve them.

1. `DATA-MAP.md` describes the historical shared `activity-radar` D1 and R2 stores. The current release candidate prepares a separate Parent Coach Desk operational database and has a separate staging directory database/R2 bucket. Counsel should identify which data map and subprocessor/retention statements must be updated before the production architecture changes.
2. Search-event retention is explicitly unresolved in `DATA-MAP.md` (90 days versus 12 months); code, job behavior, and public language must converge on one approved policy.
3. The public notice names Kit and Google Analytics; transactional internal email is being configured with Resend and Slack only for controlled internal alerting. Counsel should identify whether the vendor register and notice need a pre-launch update, and which future customer-email conditions are required.
4. The site is parent-facing and says it does not knowingly collect under-13 information. Counsel should assess the actual forms, uploads, user-generated content, analytics, and intended audience for children/minor-data risk; do not infer that a parent-facing label alone resolves the analysis.
5. The site uses affiliate disclosure and directory language. Counsel should assess advertising/material-connection placement, endorsements, ranking/verification language, consumer notices, and prohibited claim controls.

## Evidence already available to counsel

- Current staging Worker deployed separately from production, with dedicated staging D1/R2/KV bindings and the two-address application allowlist.
- Fresh staging public checks passed for home, directory, privacy, terms, `/api/health`, and `/api/ready`; anonymous admin paths redirect through Cloudflare Access.
- Staging operations D1 export restored into an isolated local SQLite verification target: integrity check passed and foreign-key violation count was zero.
- Current local candidate passed 560 unit tests, 44 integration tests, Astro diagnostics with zero errors, and the exact production build/manifest contract.

These are engineering observations only. They are not a privacy, security, accessibility, insurance, legal, or customer-readiness certification.

## Counsel response template

```text
Matter: Parent Coach Desk launch review
Reviewed artifacts and versions:
Jurisdictions/rules assessed:

Required before launch:
1.
2.

May launch only if these features remain disabled:
1.
2.

Recommended but not launch-blocking:
1.

Public-language changes/redlines attached: yes/no
Required contracts, registrations, insurance, or vendor actions:

Disposition: approved / approved subject to conditions / not approved
Attorney / firm / jurisdiction:
Date:
```

## Engineering rule after review

No gate is marked passed from an informal verbal impression. Record the written disposition, reviewed versions, required conditions, responsible owner, and proof of each completed condition in the release evidence before enabling any affected feature.
