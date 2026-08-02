# Parent Coach Desk Worker deployment

Production is Cloudflare Worker `parent-coach-desk`. The Pages project is a
separately governed rollback target, not the normal deployment path.

## Normal path

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

## Emergency path

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
