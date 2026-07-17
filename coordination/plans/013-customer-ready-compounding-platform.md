# Plan: Customer-ready, compounding Parent Coach Desk platform

**Plan ID:** 013
**Author:** Codex
**Date:** 2026-07-16
**Status:** Architecture decisions approved; implementation not started
**Tier:** 3

## Objective

Make Parent Coach Desk a production-ready public camp directory for parents while establishing the shared, governed operating substrate that lets the product improve from aggregate demand, supply, content, and operational signals. Camp-owner accounts and paid camp products are the next product increment and must be anticipated by the architecture, but they do not block the public-directory release.

This is the master product plan. Plan 012 remains the detailed implementation plan for the operational substrate and first demand-gap loop.

## Approved architecture decisions

Jeff approved the following on 2026-07-16:

1. **Forge Command is the canonical shared runtime** for Field & Forge production agents.
2. **D1 is authoritative operational state.** Notion, Slack, and other interfaces are projections and notification surfaces, not control planes.
3. **Demand intelligence is privacy-bounded:** aggregate/pseudonymous events, no child profiles, no unnecessary raw IP retention, and short retention for sanitized raw behavioral events.
4. **Initial customer release is the public directory.** Camp-owner accounts and paid camp products follow quickly but do not delay the initial production-readiness gate.
5. **Personas and workflows are separate.** Personas provide human-facing ownership; stable workflow IDs are the executable, permissioned runtime units.
6. **Additional agents are built as capacity permits**, but only after their required shared controls exist and each passes the existence test in this plan.

## Product outcome

The public release must let a parent reliably discover camps, understand the provenance and freshness of listings, subscribe with informed consent, and request a correction or removal. Operational failures must be visible and recoverable.

The compounding system must convert privacy-safe demand and supply signals into ranked opportunities, approved improvements, and measured outcomes. It must not require a persistent parent or child profile.

## Canonical system boundary

- **Parent Coach Desk repository:** customer experience, directory and content domain logic, PCD schemas, product telemetry, public APIs, protected PCD administration, and PCD workflow adapters.
- **Forge Command:** scheduling, workflow definitions, scoped credentials, durable work, leases, retries, approvals, budgets, audit history, dead letters, health, and cross-venture operating summaries.
- **Claude and Codex:** development, research, drafting, implementation, and review tools. They may be bounded reasoning executors, but never the authoritative scheduler, approval system, or production state store.
- **Field & Forge `agent-runtime`:** a source of reusable modules and contracts. It is not a second canonical control plane. Inventory, port, and then explicitly retire, park, or retain it only as a venture-specific worker.

No third agent runtime may be introduced without a replacement ADR identifying which existing runtime it supersedes.

## Workstreams

### A. Public-directory production readiness

1. Define and test the primary parent journeys: arrive, search/filter, inspect camp, follow the authoritative source, subscribe, report an error, request removal, and contact support.
2. Establish listing-state and freshness rules: discovered, unverified, verified, seasonal, registration open/closed, correction requested, removal requested, removed, do-not-contact, and do-not-republish.
3. Display appropriate source, verification, freshness, affiliate, sponsorship, and editorial disclosures.
4. Complete privacy, terms, cookie/telemetry disclosure, data-retention, correction/removal, copyright, accessibility, and support policies. Legal conclusions require qualified human review.
5. Verify mobile usability, accessibility, performance, SEO metadata, canonical URLs, structured data, sitemap integrity, and broken-link behavior.
6. Verify newsletter consent, confirmation, unsubscribe, suppression, and failure handling without sending a production campaign as part of testing.
7. Complete service monitoring, independent health checks, alert routing, error taxonomy, dependency inventory, backup evidence, restore rehearsal, incident runbooks, and rollback ownership.
8. Preserve Cloudflare Access around every admin, preview, evidence, approval, and administrative API surface.

**Release Gate A:** the public directory may be called customer-ready only when the journey matrix passes, critical accessibility/security defects are closed, public policies match actual behavior, monitoring and rollback are tested, and no unresolved silent-failure path can corrupt or publish directory data.

### B. Shared operational substrate

Execute Plan 012 with Forge Command as the selected runtime rather than creating a PCD-local coordinator:

1. Reconcile the existing Forge Command runtime and Field & Forge agent-runtime module inventory.
2. Define venture, persona, workflow, action-class, credential-scope, and data-scope contracts.
3. Add durable work, idempotency, leases, bounded retries, dead letters, dispatch-time policy, approvals, immutable audit records, and cost controls.
4. Establish a protected approval queue backed by D1.
5. Run staging, canary, and shadow validation before any real dispatch.
6. Resolve duplicate schedulers and obsolete Pages deploy-hook behavior through separately approved external changes.

**Release Gate B:** no migrated workflow runs autonomously until it has a stable workflow ID, version, owner, least-privilege scope, idempotency strategy, retry cap, health expectation, shutdown path, and tested approval behavior.

### C. First compounding intelligence loop

1. Capture sanitized search and filter demand events without stable visitor identity.
2. Prioritize zero-result and weak-result demand.
3. Aggregate only above privacy and recurrence thresholds.
4. Compare demand with current directory and content coverage.
5. Generate evidence-backed, deduplicated opportunity cards.
6. Require protected human disposition.
7. Create at most Draft-class downstream work from an approval.
8. Measure whether the resulting directory/content improvement changed search success, engagement, or conversion.

**Release Gate C:** the loop must reproduce its metrics deterministically, stay within the approved collection/retention contract, avoid duplicate or low-evidence cards, and demonstrate at least one useful measured improvement before additional intelligence agents are prioritized.

### D. Camp-owner product increment

Design now; implement after Gate A:

1. Camp-owner identity and organization membership.
2. Claim initiation and proof-of-control verification.
3. Role-based authorization and account recovery.
4. Proposed edits with provenance and review rather than direct overwrites of trusted fields.
5. Owner dashboard for listing status, freshness, corrections, and support.
6. Abuse, impersonation, ownership dispute, suspension, and audit procedures.
7. Clear separation between ownership verification, directory verification, and commercial status.

**Release Gate D:** a verified owner can manage only authorized organizations; every claim and edit is auditable; disputes and recovery are runnable; Access remains on staff administration while customer authentication uses a deliberately designed external-user boundary.

### E. Paid camp products

Implement only after the owner boundary is stable:

1. Product catalog and entitlements for enhanced profiles, featured placements, sponsorships, or packages.
2. Stripe-hosted payment flows where practical; never handle card data directly.
3. Webhook authenticity, idempotent fulfillment, reconciliation, refunds, cancellations, tax/legal review, and customer support.
4. Explicit labeling of paid placement.
5. Organic ranking, verification confidence, and editorial judgment remain independent of payment.
6. Revenue attribution and commercial reporting without expanding parent behavioral profiling.

**Release Gate E:** payment, entitlement, invoice/refund, cancellation, failed-payment, and support journeys pass in a test environment; commercial influence is visibly disclosed; no agent may charge, refund, alter price, or grant paid entitlement without the approved policy and human gates.

### F. Continuous assurance and litigation-risk reduction

Security, privacy, legal exposure, operational safety, and platform best practices are continuous workstreams. A launch audit is a baseline, not a permanent certification.

1. Maintain a versioned control register mapping each meaningful risk to its owner, evidence, test or review method, review frequency, last result, exceptions, and remediation deadline.
2. Maintain a data inventory and flow map covering collection, purpose, lawful/contractual basis where applicable, processors, storage, access, retention, deletion, export, and incident handling.
3. Threat-model every new trust boundary: public forms, search telemetry, customer identity, camp claims, staff administration, agents, connectors, payments, webhooks, queues, D1/R2, and third-party content.
4. Review terms, privacy disclosures, affiliate/sponsorship disclosures, intellectual-property practices, correction/removal handling, marketing consent, accessibility exposure, child-directed-product risk, and paid-product policies before the corresponding feature is enabled.
5. Require qualified counsel for legal conclusions or material risk acceptance. Agent and engineering audits identify issues and evidence; they do not represent legal advice or certify compliance.
6. Run automated dependency, secret, configuration, authentication, authorization, input-validation, logging/privacy, accessibility, broken-link, and infrastructure checks in CI where reliable.
7. Perform manual abuse-case and business-logic review where scanners are insufficient, especially claims, ownership disputes, paid ranking, refunds, moderation, publishing, agent tools, and administrative actions.
8. Re-audit production configuration and actual behavior after deployment; repository configuration alone is not evidence of live protection.
9. Track findings by severity, affected release, exploitability/exposure, compensating control, owner, due date, and verified closure. Never silently accept or delete findings.
10. Conduct periodic restore, incident, credential-compromise, unauthorized-claim, erroneous-publication, payment-dispute, data-deletion, and agent-runaway exercises without causing production side effects.

#### Assurance cadence

- **Every design:** data classification, threat model, legal/policy triggers, authorization boundary, failure modes, abuse cases, and rollback.
- **Every change:** diff review, tests proportional to risk, dependency/secret checks, schema and migration review, logging review, and documentation impact.
- **Every staging release:** end-to-end journeys, authorization matrix, negative tests, accessibility sampling, telemetry verification, and rollback rehearsal where changed.
- **Every production release:** explicit approval, dry-run evidence, Access and binding verification, smoke tests, monitoring confirmation, and post-release review.
- **Weekly:** failed runs, dead letters, suspicious access, stale dependencies/findings, data-quality regressions, broken links, and approval-queue aging.
- **Monthly:** Cloudflare/security posture, permissions, secrets inventory, retention/deletion evidence, dependency posture, accessibility regression, affiliate/sponsorship disclosures, and incident metrics.
- **Quarterly:** full threat-model refresh, privacy/data-flow audit, vendor/processor review, recovery exercise, agent authorization review, commercial/legal workflow review, and outside specialist review where risk warrants it.
- **Before camp-owner or paid-product launch:** focused identity, authorization, impersonation, payments, refunds, commercial disclosure, tax, consumer-protection, and contract review.

#### Stop-ship conditions

A release stops when evidence shows or cannot reasonably exclude: exposed credentials; broken Access/admin authorization; cross-tenant or cross-owner access; uncontrolled production mutation; unreviewed collection of sensitive child/family data; missing consent or required disclosure for the enabled behavior; payment/webhook integrity failure; destructive migration without proven recovery; critical dependency vulnerability without an accepted compensating control; or an agent capable of bypassing its action/approval policy.

**Release Gate F:** no feature passes solely because code builds or an AI reviewer approves it. Required automated checks pass, applicable manual controls have evidence, high-severity findings are closed or explicitly accepted by Jeff with documented rationale and compensating controls, and any legal conclusion material to launch has been reviewed by qualified counsel.

## Agent expansion policy

Bandwidth determines when eligible agents are implemented, not whether controls are skipped. Every proposed agent must answer:

1. What recurring, verified problem does it solve?
2. Why is deterministic code alone insufficient?
3. What typed inputs and outputs does it use?
4. What is the maximum action class it can reach?
5. What evidence, confidence, and approval does that action require?
6. How is it idempotent, rate-limited, budgeted, observed, stopped, and rolled back?
7. What metric proves it creates value?
8. Which existing workflow would overlap with it?

Agent implementation order after the first demand loop should be selected from current evidence. Likely candidates are camp freshness/change detection, broken-link and affiliate health, coverage analysis, editorial refresh, founder briefing, and customer-support drafts. The order is not a permanent roster commitment.

## Recommended delivery sequence

1. **Architecture reconciliation:** canonicalize Forge Command and amend Plan 012 implementation paths.
2. **Public readiness audit:** produce the customer-journey matrix and release-gate defect list.
3. **Critical reliability repairs:** scheduler ownership, monitoring, backup/restore evidence, secrets/configuration gaps, and obsolete rollback hooks.
4. **Customer readiness implementation:** directory quality, disclosures, policies, support/correction/removal, accessibility, performance, and end-to-end tests.
5. **Shared substrate in staging:** durable work, policy, approvals, audit, health, and shadow mode.
6. **Public-directory release gate:** evidence-based go/no-go; no assumption that deployment alone equals readiness.
7. **Demand-gap loop:** report-only, then approved Draft-class output, then outcome measurement.
8. **Camp-owner foundation:** claims, roles, proposed edits, disputes, and owner dashboard.
9. **Paid products:** payments and entitlements after the owner authorization model is proven.
10. **Incremental agent expansion:** one bounded workflow at a time, driven by evidence and capacity.
11. **Continuous assurance:** run the cadence above throughout every step; findings may reorder or stop the delivery sequence.

## Verification strategy

- Unit, integration, security, migration, and policy-state tests.
- Parent and camp-owner journey tests across mobile and desktop.
- Accessibility checks plus manual keyboard/screen-reader sampling.
- Production-config dry runs with no deployment.
- Isolated database migration and restore rehearsals; never generated SQL directly against production.
- Seven-day coordinator shadow validation before dispatch.
- Four-week report-only validation for the first demand-gap loop.
- Synthetic failures for leases, retries, dead letters, stale approvals, telemetry loss, and unavailable projections.
- Independent verification that public functionality continues when telemetry or the agent runtime is unavailable.
- Evidence-backed security, privacy, legal/policy, accessibility, configuration, and business-logic audits at the cadence defined in Workstream F.

## Explicit exclusions

- No autonomous publishing, outbound communication, payment, refund, destructive action, secret change, or production-data mutation.
- No child profiles, household profiles, fingerprinting, cross-device identity, or sensitive-trait inference.
- No private-group monitoring or authenticated competitor scraping.
- No standalone intelligence product before PCD demonstrates useful internal intelligence.
- No automatic coupling between payment and organic rank or verification confidence.
- No deployment, remote migration, production schedule invocation, secret rotation, Access/DNS change, email/Slack send, merge, or push without Jeff's explicit approval at that stage.
- No representation that an AI or engineering audit is legal advice, a compliance certification, or a guarantee against litigation.

## Definition of success

PCD is successful when it is simultaneously:

- useful and trustworthy enough for parents to use today;
- operationally safe enough that failures are visible and recoverable;
- structured so camp owners and paid products can be added without replacing the directory's trust model;
- capable of learning from aggregate demand and supply signals;
- able to turn those signals into governed, measurable improvements; and
- inexpensive enough to operate while the audience and revenue are still developing.
