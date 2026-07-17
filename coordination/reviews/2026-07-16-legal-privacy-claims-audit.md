# Legal, Privacy, Consumer-Claim and Accessibility Audit — 2026-07-16

## Scope and limitation

This is a technical and operational risk review, not legal advice or a certification. It compares repository behavior and source configuration with public statements in `terms.astro`, `disclosure.astro`, `accessibility.astro`, intake pages and current feature flags. Live provider settings, contracts, entity records, actual data inventories and jurisdiction-specific legal conclusions remain unverified unless stated otherwise.

## Evidence states

- **Verified code:** current repository source, tests and source deployment configuration.
- **Verified local behavior:** test/build results recorded on 2026-07-16.
- **Documented intent:** public copy or operating-plan language not yet proved against live systems.
- **Unverified live state:** provider dashboards, contracts, production telemetry settings, actual retention execution and third-party program status.

## Current positive controls

1. Public camp imports enter pending moderation; approval requires date and status eligibility checks.
2. Claiming, public reviews, structured trust intake and demand telemetry are default-off in production source configuration.
3. Trust intake, when enabled in an approved environment, rejects sensitive-data categories in the UI, uses bounded inputs and durable retry identity, and separates response drafting, human approval and future delivery.
4. GA loading requires affirmative local consent, honors DNT/GPC, and fails closed when geographic exclusion lookup fails. EU/EEA/UK/Swiss exclusion is implemented in client code.
5. Public notices identify Kit, Cloudflare Web Analytics, Google Analytics and Nominatim data flows and provide correction/deletion contact paths.
6. Affiliate relationships and the Amazon Associate statement are disclosed; content metadata includes an affiliate-disclosure field.
7. Terms distinguish directory information from inspection, safety verification, endorsement and professional advice.
8. The route inventory classifies 134 source routes; 37 administrative routes require Cloudflare Access plus the declared application control; all anonymous POST routes have an explicit rate-limit class.

## Verified gaps and risk decisions

| Priority | Finding | Evidence | Required control or decision |
|---|---|---|---|
| Stop-ship for new paid/owner features | No customer identity, owner agreement, commercial terms, refund/cancellation, tax, entitlement or payment-dispute implementation is live | Feature flags and Business OS gates | Keep owner and paid products disabled until counsel/CPA/provider gates and end-to-end tests pass |
| High | Current privacy copy is not a substitute for a verified record of processing | Provider behavior is described publicly, but live settings/contracts, data locations, retention and deletion execution are not fully evidenced | Complete controller/entity identity, vendor contracts/DPA status, jurisdiction analysis, retention schedule and request drill with qualified counsel |
| High | Nominatim is called directly from the browser and exposes the visitor's network request to that provider | Directory location tool and CSP | Replace or proxy before scale; confirm usage policy, attribution, rate limits, minimization and privacy notice |
| High | Accessibility evidence is incomplete | Mobile contract is pending; prior audit has manual gaps | Public copy now states WCAG 2.2 AA is a target, not achieved conformance; complete independent/manual journey evidence before stronger claims |
| High | Directory truth and commercial assertions require continuing substantiation | Source audit and remediation queue remain open | Close record-level conflicts, preserve provenance/freshness, label commercial influence, and retain evidence for objective claims |
| Medium | Analytics statements depend on live configuration outside the repository | Client code is bounded; dashboards and Cloudflare settings were not inspected in this audit | Verify production GA property controls, Cloudflare analytics fields/retention, access roles and deletion/export procedures |
| Medium | Affiliate program status and link-level disclosure cannot be inferred from source declarations alone | Affiliate registry and public disclosure exist | Audit current program membership, link health, inline material-connection notices and FTC placement on rendered pages |
| Medium | Copyright intake is operationally described but statutory-agent and repeat-infringer decisions are undocumented | Terms and trust categories | Counsel to decide DMCA safe-harbor posture, designated-agent registration, required notice/counter-notice process and records |
| Medium | Photo language assumes ownership and guardian consent, but evidence retention and disputes are not fully specified | Terms and admin photo workflow | Define consent evidence, provenance, retention, removal urgency, child-image escalation and takedown audit trail before public owner uploads |
| Medium | Entity/contact disclosure is incomplete for future commerce | Public pages name Field & Forge Ventures and email only | Before transactions, verify legal entity/trade name, service/contact address, governing-law/enforceability and consumer notices with counsel |
| Locally remediated; rendered/live proof pending | The consent preference itself used local storage without a public preference-reset control | Consent banner source | Footer now exposes Privacy choices; withdrawal sets the GA disable flag, removes accessible `_ga*` cookies and is described in the notice. Verify rendered keyboard/focus behavior and production effect before closure |
| Locally remediated; rendered/live proof pending | Affiliate copy included unsupported personal-use endorsements | Public disclosure, About page and guide notice | Removed the personal-use assertions, retained clear affiliate identification, and added a source contract that rejects their reintroduction; verify material-connection placement and active program terms on rendered/live pages |

## Claims that must remain prohibited

- “SOC 2 compliant,” “SOC 2 certified,” or “SOC 2 audited” without the applicable independent report and correct scope.
- “ISO certified” or “ISO/IEC 42001 compliant” without accredited certification or evidence supporting the precise scoped statement.
- “WCAG compliant,” “fully accessible,” or equivalent while journey/manual evidence is pending.
- “Verified,” “safe,” “accredited,” “insured,” “best,” or similar camp claims unless the displayed definition and current evidence support that record.
- Any implication that payment affects verification confidence, organic ranking or recommendation without conspicuous, accurate labeling and approved commercial rules.

## Next evidence order

1. Rendered mobile/accessibility journey matrix and preference-reset behavior.
2. Live read-only analytics/provider configuration and vendor register reconciliation.
3. Directory remediation decisions and post-change source sample.
4. Privacy-request and deletion tabletop using synthetic data in staging.
5. Qualified legal review before owner identity, reviews, uploads, email delivery or commerce activation.

## Read-only Kit subscription-page observation, 2026-07-16

The public hosted Kit URL linked by the site rendered a name field, email field, subscribe button, and an unsubscribe-at-any-time notice. No email address was entered and no subscription was submitted. This narrow observation does **not** establish double opt-in, consent-record retention, confirmation/redirect behavior, unsubscribe processing, suppression, delivery failures, provider roles, retention, or a production email program. Local copy now states that those controls remain a required controlled proof before marketing delivery activation.
