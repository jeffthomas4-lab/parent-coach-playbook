# Parent Coach Desk Worker deployment

Production is Cloudflare Worker `parent-coach-desk`. The Pages project is a
separately governed rollback target, not the normal deployment path.

## Normal path (current, local — as of 2026-08-05)

GitHub Actions was removed from every repo on 2026-08-05 after it burned the
monthly allotment in four days. `.github/workflows/deploy-workers.yml`, the
protected `production` Environment gate, and the BabyLove release classifier's
auto-approval path are all gone. There is no merge-to-`main` auto-deploy. The
CI path is preserved below under "Retired CI path" for whoever restores it.

Production ships from a local shell:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"
npm ci
npm run build:production
(Get-Content dist\server\wrangler.json -Raw | ConvertFrom-Json).name
```

**The fourth line must print `parent-coach-desk`.** If it prints
`parent-coach-desk-staging`, stop — the build did not pick up
`wrangler.production.jsonc` and the deploy below would ship the staging Worker.

```powershell
npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars --dry-run
npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars
node scripts/build-static-asset-proof.mjs --sha (git rev-parse HEAD) --output coordination/release-evidence/asset-proof-prod.json
node scripts/smoke-worker-deployment.mjs --origin https://parentcoachdesk.com --target production --asset-proof coordination/release-evidence/asset-proof-prod.json
```

### Two traps this path has already hit

**Plain `npm run build` deploys to staging and reports success.** The build
generates `dist/server/wrangler.json`, and plain `build` stamps it
`"name": "parent-coach-desk-staging"`. Only `npm run build:production` sets
`WRANGLER_CONFIG_PATH=wrangler.production.jsonc`. Wrangler gives no warning; the
single tell is the closing `Uploaded parent-coach-desk-staging` line under a
128-row module table. Hence the name assertion above.

**An empty `node_modules` fails without halting the build.** `npm run build`
chains `check:content-lengths && build:manifest && build:og:safe && astro build`.
The first two are plain node scripts and pass with no dependencies installed;
`build:og:safe` swallows its own failure by design. `astro build` then dies with
`'astro' is not recognized` at the end of the chain, and wrangler deploys
whatever stale `dist/` is still on disk. On 2026-08-05 that shipped a day-old
staging build. Hence `npm ci` leading the block.

The smoke script requires `--asset-proof <file>`; it throws a usage error
without it. Generate the proof with `scripts/build-static-asset-proof.mjs`
against the same `dist/client` that was just deployed.

Staging is the same flow with plain `npm run build` and
`--target staging --origin https://parent-coach-desk-staging.eepskalla.workers.dev`.

## Retired CI path (Actions removed 2026-08-05 — historical)

1. Merge a reviewed, green pull request to `main`.
2. `.github/workflows/deploy-workers.yml` builds separate staging and production
   artifacts from the same immutable commit.
3. Each artifact records its Git SHA and SHA-256 digest. Deployment jobs verify
   both before extracting it.
4. Staging deploys the verified generated `dist/server/wrangler.json` and passes
   target-specific smoke tests.
5. The release classifier checks whether the immutable commit is the governed
   normalization child of exactly one BabyLoveGrowth article commit. It fails
   closed unless the combined diff contains only that article and
   `reports/editorial/editorial-refresh-queue.json`, with matching provider ID,
   slug, phase, and published frontmatter.
6. Every release waits at the protected GitHub `production` Environment.
   After the same full build, staging deploy, checksum, and smoke gates pass,
   a parallel job may approve that one pending deployment through GitHub's
   deployment-review API only when the classifier proves an eligible
   content-only BabyLove release. All other releases still require Jeff.
7. Production dry-runs and deploys the same verified generated manifest, then
   records version and secret-name evidence and runs public smoke tests.
   Eligible BabyLove releases also prove the exact article route, canonical,
   H1, indexability, and absence of visible provider promotion.

Each build also selects one content-hashed Astro CSS/JS asset and records its
exact byte length and SHA-256 next to the artifact. Post-deploy smoke must fetch
that exact path and match those bytes. The workflow performs a full deploy only;
gradual or mixed-version traffic is prohibited until a separate asset-skew
design and rehearsal are approved.

The GitHub Environments must restrict deployment to `main`. Disable protection
bypass where the repository plan supports it. Store separate
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` values in `staging` and
`production`; never store the production token as a repository-wide secret.
The repository-scoped `BABYLOVE_PUBLISH_TOKEN` is also the deployment reviewer
for eligible content-only releases and therefore requires Contents write plus
Deployments write for this repository. The approval script is not a general
bypass: it only targets the current run's pending `production` Environment and
runs only from the checksummed classifier output for the exact allowlisted
two-file lineage. Keep `prevent_self_review` disabled for this machine reviewer.
Set the Environment variable `DEPLOY_GATE_CONFIGURED=true` only after its branch
restriction and appropriate reviewer policy have been verified. The workflow
fails closed when that marker is absent. Changes to the classifier, deploy
workflow, or smoke scripts require review as production authorization code.

## Emergency path (retired with the CI path above)

Use the workflow's `workflow_dispatch` entry with a full commit SHA. The
workflow refuses commits not already contained in `main` and uses the same
artifacts, staging proof, production Environment approval, and smoke tests.
There is no normal local-token bypass. A true break-glass deployment requires a
separately approved incident, credential rotation after use, and an evidence
receipt.

## Runtime secrets

Worker runtime secrets remain managed with `wrangler secret put`; CI deployment
does not carry their values. The first CI deployment must compare secret names
before and after deployment. Never print or place secret values in artifacts,
logs, prompts, skill files, or GitHub variables.

`wrangler.production.jsonc` declares the four required runtime secret names.
Current Wrangler validates their presence before deploy; the declaration never
contains values and does not create, rotate, or retrieve a secret. Staging
intentionally has no required-secret declaration because its secret-dependent
features remain unavailable or fail closed.

## Rollback

Before enabling production deployment, rehearse rollback on staging and record
the before/after version IDs. A code rollback does not reverse a database
migration. Schema changes use expand, compatible deploy, backfill/verify, and a
later contract release after the rollback window closes.
