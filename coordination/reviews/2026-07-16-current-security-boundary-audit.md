# Current security-boundary audit

Date: 2026-07-16
Scope: current repository implementation and point-in-time evidence. This record supersedes undated conclusions in `SECURITY-AUDIT.md`; dated historical evidence remains useful but must not be read as current state.

## Verified controls

- The production Worker architecture and application-level administrative gate are represented in current code. Cloudflare Access remains required around every administrative page and API.
- The protected-route contract currently contains 37 paths. Fresh anonymous, read-only probes redirected all 37 to the configured Access host. Authenticated allowed-user and denied-user probes remain a release gate.
- Public anonymous writes have separate, fail-closed rate-limit bindings and contract tests. API and administrative responses are no-store; public HTML follows the cache-policy contract.
- Repository secret scanning covers current content and added lines in full Git history. The point-in-time dependency audit reported no known vulnerabilities.
- Staging operational-database migrations and a disposable restore rehearsal completed without activating a feature or mutating production.

## Open security and privacy risks

1. **Alternate Pages hostname:** the historical Pages artifact anonymously exposes old administrative HTML and is not a safe rollback target. Containment needs an approved Cloudflare change and a replacement rollback artifact.
2. **Access evidence:** export and retain the live Access application/policy configuration, then perform authenticated allowed-user and denied-user read-only probes before release.
3. **Unsafe-HTML inventory:** `set:html` and `innerHTML` are used throughout the site. The shared `renderTitle()` primitive now escapes input before adding its one allowed `<em>` tag, and `ArticleCard` uses that primitive. Direct title replacements, administrative preview rendering, calculators, search rendering, and JSON script embedding still require a source-by-source contract review. Do not treat CSP as a substitute for output encoding.
4. **CSP debt:** `style-src 'unsafe-inline'` remains because inline styles are prevalent. Script execution remains more tightly constrained, but removing inline-style permission requires a measured style migration and browser regression pass.
5. **Location privacy/vendor policy:** ZIP geocoding sends user input from the browser to Nominatim and server-side directory workflows also call Nominatim. The disclosure covers the browser path, but usage-policy compliance, request identification, throttling, retention, and a first-party proxy/provider decision remain required before scale.
6. **Mobile directory defect:** live `/camps/` overflow at 320 px and 390 px is release-blocking until a rendered candidate is verified at all contract widths and with zoom, landscape, keyboard, safe-area, reduced-motion, and slow-network scenarios.
7. **Operational proof:** backup/restore, R2 recovery, rollback, failure-isolation, notification receipt, and post-deploy observation evidence remain incomplete. These are release gates, not documentation suggestions.
8. **Assurance claims:** the program is being designed toward SOC 2 and ISO/IEC 42001 readiness. No public claim of certification, compliance, or conformance is authorized without scoped independent evidence and legal review.

## Release posture

No production deployment is authorized by this audit. Customer readiness requires every release-control gate to pass or to have an explicit, named, time-bounded risk acceptance. Agent autonomy must remain proposal-first for publishing, outbound communication, spending, credentials, destructive actions, and production data changes.
