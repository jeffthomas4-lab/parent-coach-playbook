# Parent Coach Desk launch authorization matrix

**Updated:** 2026-07-17  
**Purpose:** Turn the remaining release-gate decisions into bounded, reviewable actions. This does not authorize a production customer-data write, payment flow, or owner-account launch by itself.

## Current release state

The public directory and Plan 015 editorial-repository repair are deployed. The production release packet remains **not ready**: eight gates are unpassed. The attached release evidence is authoritative: `coordination/release-evidence/rc01.json`.

## Decisions and approvals needed

| Gate | Decision / action needed from Jeff | What Codex may do after the approval | Proof that closes or advances the gate |
|---|---|---|---|
| `r2_recovery` | Choose one: **(A)** accept the empty production `PHOTOS` bucket (0 objects / 0 B) as `not_applicable`, or **(B)** require an offsite R2 copy process now despite its empty scope. | Record the owner disposition; for B, include R2 in the immutable batch/retrieval rehearsal. | Signed owner disposition, or immutable copy plus retrieval/hash proof. |
| `database_backup` | Choose the provider and approve the model. Recommended: a **separate AWS recovery account**, S3 Versioning + Object Lock Compliance mode, 90 daily recovery points plus 12 monthly. | Create the approved account/bucket/roles; upload production-derived encrypted-in-transit exports; retrieve and restore into isolated local targets. | Immutable-retention settings, separated permissions, manifest checks, retrieval/restore proof on three separate days. |
| `notification_receipt` | Create or repoint a **fresh staging-only** Slack incoming webhook to `#pcd-alerts`; store it as the staging Worker secret `SLACK_WEBHOOK_URL`. Do not paste its value into chat or Git. Then say “staging Slack ready.” | Run one already-approved synthetic staging notification drill; inspect Resend and `#pcd-alerts`; record human acknowledgement. | Provider delivery, visible channel receipt, and Jeff acknowledgement for the same drill ID. |
| `authenticated_access_probes` | Sign into Cloudflare Access in the in-app browser using each allowed and denied identity as appropriate, then say “Access probe ready.” | Perform only the prepared 37-route allowed/denied **GET-only** probe; do not submit forms or call mutation endpoints. | Redacted live allowed/denied results for the protected-route contract. |
| `customer_journeys` | Name a reviewer for the manual accessibility pass, or perform it yourself using `automation/mobile-web-contract.json`: touch, screen reader, 200% zoom, safe area/keyboard, constrained network, and error/retry paths. | Capture only agreed read-only visual/browser evidence; support a staging synthetic form rehearsal only under a separate authorization. | Named reviewer/date plus the required journey artifacts; no claim of WCAG certification. |
| `failure_isolation` | After staging Slack is ready, approve a bounded staging failure/receipt rehearsal. | Exercise only synthetic staging paths and record isolation/recovery behavior; no production data writes. | Environment-level failure, recovery, and receipt evidence. |
| `open_risk_decision` | Obtain written counsel/policy-owner disposition using `coordination/COUNSEL-REVIEW-PACKET-2026-07-17.md`, then explicitly accept or close each remaining release risk. | Record the reviewed versions, owner, due dates, conditions, and compensating controls in release evidence. | Written disposition and traceable closure or accepted exception. |
| `migration_approval` / Plan 017 | Only after backup/recovery, notification, staging rehearsal, and counsel conditions pass: approve the exact production change request naming DB `b38d5f37-54df-4e0f-9706-023edc12c7fe`, migrations `0011`–`0022`, immutable batch ID, expected empty precondition, observation period, and one non-personal synthetic request. | Reverify the precondition, apply only the approved migration range, deploy only the reviewed `TRUST_INTAKE_ENABLED=true` change, and perform the single approved proof. | Exact migration/deploy receipt, one case/outbox record, no directory write, protected-queue visibility, acknowledgement, and post-observation. |
| Plan 015 live proof | Select one non-customer editorial article in protected admin and approve it once. | No automation: the human action alone creates the GitHub content write. | Live admin/GitHub write receipt for the selected article. |

## Approval boundaries

- Never paste API keys, Slack webhooks, provider credentials, backup contents, customer rows, or R2 object names in chat, Git, or release evidence.
- “Approve all” is not sufficient for an immutable backup account, production migration, or production synthetic write: each requires the exact scope in the matrix so recovery, retention, and rollback are reviewable.
- A successful deployment does not close a release gate. Each row needs the listed proof.
- Owner accounts and paid products remain future increments. They require their own external-user authentication, authorization, counsel, Stripe/webhook, refund, and disclosure approvals before activation.

## Recommended next reply

Reply with the row labels and your selections, for example:

```text
r2_recovery: A
database_backup: AWS, approve 90 daily / 12 monthly and account/bucket/role creation
notification_receipt: staging Slack ready
authenticated_access_probes: ready
customer_journeys: Jeff will review by <date>
failure_isolation: approved after Slack is ready
```

This creates a clear, auditable authorization record without exposing a secret.
