# PCD Test Architecture

Date: 2026-07-16
Status: local enforcement implemented; remote branch-protection evidence pending

## Same-change definition of done

Every feature change includes its tests in the same implementation conversation and commit. Tests cover success, expected failure, authorization denial and retry/recovery behavior proportional to risk. Authentication work must cover login, logout, invalid credentials, lockout/rate limiting, recovery, renewal and revocation before promotion.

Account deletion and data-subject request implementation is customer-launch-critical. Unit tests ship with each state-machine, authorization, disposition and provider-adapter change. The integration suite must cover validated-request deactivation, session/token revocation, machine- and human-readable export, retry/dead-letter handling, legal holds, cross-tenant denial, idempotency and conflicting duplicates, partial database/object/provider failure, resumability, downstream processor propagation, final verification/completion receipts and immutable-backup age-out behavior. An agent cannot approve its own deletion exception or legal interpretation. Documentation and compile proofs do not satisfy this contract.

## Suites

- `npm run test:unit`: fast isolated function/handler/contract tests. Integration paths listed in `test-classification.ts` are excluded.
- `npm run test:unit:coverage`: the same fast suite with V8 coverage. Statements, branches, functions and lines each fail below 60%.
- `npm run test:integration`: only the explicit multi-module, Worker/API/storage and user-path files in `test-classification.ts`.
- `npm test`: complete local regression suite; useful before handoff but not the CI classification authority.

The push-time coverage scope is `src/lib/**/*.ts`, `src/pages/api/**/*.ts` and `src/worker.ts`. The four integration composition roots explicitly listed in `integrationOnlySource` are excluded only from the unit metric and remain in the integration suite. Generated declarations are excluded. Any new exclusion requires an alternate test layer, reason and review; reducing scope or thresholds to make CI pass is prohibited.

## CI event mapping

- Every branch push: locked install and `test:unit:coverage`.
- Pull request to `main`: unit/coverage plus integration/build/security/release-contract job.
- Merge/push to `main`: unit/coverage plus integration/build/security/release-contract job.
- Release: the separate approval packet adds rendered mobile/accessibility, provider, recovery and live read-only checks as applicable.

Remote branch protection and required-check configuration remain unverified until read from the source-control provider. A workflow file is not proof that merging cannot bypass it.

## Flaky-test rule

Retries do not turn a flaky test green. Quarantine requires owner, issue/incident reference, reason, expiry and replacement evidence. Expired quarantine fails the release gate.
