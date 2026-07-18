# Runbook — same-SHA staging deploy + rollback rehearsal (2026-07-18)

Owner-gated. Do not run until Group A of `coordination/JEFF-ACTION-PACKAGE-2026-07-18.md`
is done: the GitHub protected `production` and `staging` Environments exist, and the
scoped Cloudflare tokens (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) are placed in
each Environment. This drill closes the production-style `rollback_rehearsal` gap and
exercises the new `scripts/deploy-remediation.mjs` in a controlled way. It never touches
production data.

Run from the repo root with the deploy-hardening series already landed on `main`. Wrangler
must be authenticated for the staging target (staging-scoped token, `Workers Scripts:Edit`
only). Every command below targets the isolated staging Worker `parent-coach-desk-staging`
(the root `wrangler.jsonc` is the staging config; production uses `wrangler.production.jsonc`).
None point at production.

## 0. Preconditions (verify, do not skip)

```
git rev-parse HEAD                      # the landed candidate; record this SHA in evidence
node -v                                 # 22.x
npm ci
$env:CLOUDFLARE_API_TOKEN="<staging token>"     # PowerShell; never paste the value into chat or a file
$env:CLOUDFLARE_ACCOUNT_ID="<account id>"
```

## 1. Same-SHA staging deploy

The deployer rebuilds, verifies the generated manifest names only isolated staging
bindings (staging D1/R2, staging origin, all seven feature flags false), and refuses if a
production binding leaks in. Dry-run first, then confirm.

```
npm run deploy:staging:verified                 # builds + verifies, performs NO deploy
npm run deploy:staging:verified -- --confirm     # deploys the verified dist/server/wrangler.json to staging
```

Immediately capture the version now serving 100% of staging traffic. This is the recorded
good version the rehearsal rolls back to.

```
npm exec -- wrangler versions list --config wrangler.jsonc
# Record the active version id (100% traffic) as GOOD_VERSION_ID.
```

## 2. Post-deploy smoke (the trigger the remediation responds to)

```
node scripts/build-static-asset-proof.mjs --sha (git rev-parse HEAD) --output staging-static-asset.json
node scripts/smoke-worker-deployment.mjs --origin https://parent-coach-desk-staging.eepskalla.workers.dev --target staging --asset-proof staging-static-asset.json --report staging-smoke.json
```

A clean smoke returns a sanitized receipt and exits 0. That is the normal path; the CI
workflow already checksums and retains this receipt.

## 3. Rehearse the remediation paths

### 3a. Staging halt-and-alert path (exercises deploy-remediation.mjs directly)

The staging job carries the halt-and-alert path (staging has no committed rollback target,
so auto-rollback is deliberately not wired there). Confirm it fires loudly and exits
non-zero, exactly as the workflow's `if: always() && steps.smoke-staging.outcome == 'failure'`
step would.

```
node scripts/deploy-remediation.mjs --target staging --halt-only
# Expect: "DEPLOY HALTED: staging post-deploy smoke FAILED ..." and a non-zero exit code.
```

### 3b. Real traffic rollback (proves the exact command auto-remediation issues for production)

For production the remediation rolls traffic back to the recorded good version with
`wrangler versions deploy <id>@100%`. Rehearse that mechanism on staging by hand: deploy a
throwaway second version, confirm traffic moved, then roll back to `GOOD_VERSION_ID` and
re-smoke.

```
npm run deploy:staging:verified -- --confirm                          # creates a second staging version
npm exec -- wrangler versions list --config wrangler.jsonc    # note the new active id
npm exec -- wrangler versions deploy $GOOD_VERSION_ID@100% --config wrangler.jsonc --yes
node scripts/smoke-worker-deployment.mjs --origin https://parent-coach-desk-staging.eepskalla.workers.dev --target staging --asset-proof staging-static-asset.json --report staging-smoke-after-rollback.json
```

A clean smoke after the rollback proves traffic returned to the good version and the site
is healthy. This is the same `versions deploy <id>@100%` call `deploy-remediation.mjs`
issues automatically for production on a failed smoke (see
`rollbackWranglerArgs` and `tests/deploy-remediation.test.ts`).

## 4. Record evidence

Write a redacted receipt to `coordination/release-evidence/` capturing: the landed SHA,
`GOOD_VERSION_ID`, the pre- and post-rollback smoke results (pass/fail only, no cookies or
tokens), and the observed halt-alert exit for 3a. This is the artifact the production-style
`rollback_rehearsal` gate needs beyond the staging-only rehearsal already recorded in
`rc01.json`. Do not retain credentials in the receipt.

## 5. Stop here

Production auto-rollback runs only inside the gated GitHub Actions production deploy, which
requires the protected Environment, reviewer approval, and the production-scoped token.
Nothing in this runbook deploys to or rolls back production. Proceed to the production
deploy only through the reviewed pipeline per `JEFF-ACTION-PACKAGE-2026-07-18.md`.
