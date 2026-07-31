# Audit: Pillars 2, 3, 5 (Privacy, Consent and Analytics, Terms and Legal)

Branch: `audit/full-standard-2026-07-30`. Scope: `disclosure.astro`, `terms.astro`, `ConsentBanner.astro`, `BaseLayout.astro`, every third-party script/font/embed/pixel, `DATA-MAP.md`, `CONTACT-DATA-MAP.md`, and any route that writes personal data, including the new `org_contacts` PII layer in `PCD_OPS_DB` that landed in the prior session and was not yet in the data map.

## Pillar 2 — Privacy: fixed

**Found.** `org_contacts` (migration `migrations-pcd-ops/0028_org_contacts.sql`, access layer `src/lib/org-contacts.ts`) is a named-human PII table — full name, title, role, direct email, direct phone for camp/program staff — documented in `CONTACT-DATA-MAP.md` but absent from `DATA-MAP.md` and from the live privacy policy. It is compiled by two daily agents (`org-discovery-daily-worklist`, `pcd-evergreen-daily`) from an organization's own public contact/staff pages. The person named in the row never gave PCD this information directly, which is exactly the "data about people who never asked" case Pillar 2 names.

**Fixed:**
- `DATA-MAP.md` — added `org_contacts` to the data-home note, the personal-data table, the third-party table (Turnstile and dark Sentry too, see Pillar 3), the retention table, and the deletion-path table.
- `REGULATORY-RISK.md` — written at the project root (did not exist before this pass). Names the data, its two source agents, and the laws plausibly in play: state data-broker registries, CCPA/CPRA's indirect-collection notice question, GDPR Article 14 if the discovery scope ever expands past US organizations, Washington My Health My Data (low relevance, listed for completeness), and FTC Section 5 as the practical gate. Documents what the schema already does to reduce exposure (`is_public` defaults 0 and only a human can flip it, names never syndicate even when a channel is public, `do_not_contact` is checked before every write and survives re-discovery, soft-delete only). Names the human gate: a lawyer's read before migration 0028 is applied to production or the table is used for outreach, which is Jeff's to schedule.
- `disclosure.astro` — added a policy bullet describing the compiled staff-contact data, stating plainly it is not submitted by the person, and pointing to `/trust/` as the opt-out path. Also added a matching bullet for reader testimonials (`proof_inbox`), which was live in `DATA-MAP.md` as a disabled feature but missing from the policy even though camp reviews and claims got the same disabled-feature treatment.
- `DATA-MAP.md` — added a one-line self-service-account-deletion waiver: this site has no user accounts, so there is nothing to log into or delete from a danger zone. Per Pillar 2's own instruction, this is stated as a waiver rather than invented as a finding.

**Left open, correctly not touched:** the search-events retention conflict (12 months in `DATA-MAP.md` vs. 90 days in the archived ActivityRadar map) predates this session and needs Jeff's confirmation of which figure the code actually enforces, not an assumption from this pass.

## Pillar 3 — Consent and Analytics: pass (verified live)

Ran the pre-consent test against the deployed site, not just the source. `curl`'d the live homepage cold, no cookie jar: zero `Set-Cookie` header on the response, zero `googletagmanager`/`google-analytics`/`gtag(` string anywhere in the raw HTML. GA4 exists only as a same-origin bundled module, gated in `BaseLayout.astro` on `localStorage.getItem('pcd_consent') === 'yes'` before it ever appends the GA script tag, with an EU/EEA/UK/CH geofence (`/cdn-cgi/trace`) and a DNT/GPC check on top, both fail-closed. Reject ("No thanks") sits in the same row, same size, same click distance as Accept.

**Found and fixed:** Cloudflare Turnstile (`challenges.cloudflare.com`) loads unconditionally on the site's 4 public forms and is in the CSP and in `src/lib/turnstile.ts`, but was not in `DATA-MAP.md`'s third-party table. Added, marked essential/no-consent-needed under Pillar 3's own security-cookie exception — it does not need to move behind the banner, it needed to be on the paper trail. Low severity: it was never hidden from users or from the CSP, just missing from the map.

**No other silent third party.** Grepped `src/` and `public/` for external script/iframe/CDN references; the matches were editorial citation links in `public/link-manifest.json` (outbound article references, not page-load resources) and API calls to vendors already mapped (Nominatim, Kit, Cloudflare, dark Sentry).

## Pillar 5 — Terms and Legal: fixed

Re-verified live: `/terms/` and `/disclosure/` both return 200, both linked in the footer, confirmed by fetching the deployed homepage. Pierce County venue and the Field & Forge Ventures operator name are both present in `terms.astro`'s closing section. No payment is taken anywhere on the site (affiliate links only pay PCD, never the reverse), so refund/billing terms are correctly absent. No user accounts, so the account-deletion-in-ToS requirement is waived for the same reason as the Pillar 2 waiver — `/trust/` is the deletion/access path both legal pages already point to. COPPA: `terms.astro` requires interactive-feature users to be 13+ and `disclosure.astro` states no knowing collection under 13; both held up under this pass's hard look.

**Found and fixed:** neither legal page mentioned `org_contacts` before this pass. `disclosure.astro` now does (see Pillar 2 fix). `terms.astro` did not need a matching change — it is the visitor-facing UGC/acceptable-use document and `org_contacts` is not user-submitted content.

## What changed (file paths)

1. `DATA-MAP.md` — `org_contacts` added throughout, Turnstile and dark-Sentry added to the third-party table, account-deletion waiver added, last-updated date bumped.
2. `CONTACT-DATA-MAP.md` — cross-reference to `REGULATORY-RISK.md` added, Status table updated.
3. `REGULATORY-RISK.md` — new file, project root.
4. `src/pages/disclosure.astro` — new bullets for `org_contacts`, reader testimonials, and Turnstile; effective date bumped to July 30, 2026.
5. `STANDARD-AUDIT.md` — Pillar 2, 3, 5 rows updated; open items #58-60 added; Definition of Done checklist and header last-updated line updated.

## Still open

- **#59, human gate.** Lawyer's read of `REGULATORY-RISK.md` before migration 0028 lands in production or `org_contacts` is used for outreach. Jeff's to schedule.
- **Pre-existing, not re-litigated.** The search-events retention conflict (item flagged in `DATA-MAP.md` since a prior session) still needs Jeff's call on which figure (12 months vs. 90 days) the code should actually enforce.
- **Pre-existing, out of this pass's scope.** Pillar 1's open HIGH (#17, unrotated OpenAI key) and Pillar 9's fail status are unrelated to privacy/consent/legal and were not touched.

## What Jeff has to run himself

- Schedule the lawyer's read of `REGULATORY-RISK.md` before applying migration 0028 or using `org_contacts` for outreach.
- Confirm which search-events retention window (12 months or 90 days) is correct and fix the code/doc to match.
- No dashboard steps, no secrets, and no deploy were touched by this pass — all changes are source and markdown on the audit branch.
