# CRM Gate 9C-P17-B-R15-A1 execution receipt

Status: **HOLD — mandatory rollback completed; R15 producer was not uploaded**

Executed: 2026-09-15 UTC

## Authority and frozen inputs

Owner approval was given for Gate 9C-P17-B-R15-A1 exactly as recorded at evidence commit
`3a6ef6358c5a0bfcb883ac1efab86eeb48a0ac1b`.

The action preflight recomputed and matched the frozen producer candidate
`12d2015cca1ebf66df540eb8c62c36f18dd4c60b`, producer tree
`04a64f2c061070cfd7fe0a1fac26a292e853bb54`, producer source/test/harness hashes,
producer build aggregate `2affffa6afb09beb74537afc5839dbd459f4dbb0ffcc47107fb6f1211740202b`,
and enabled manifest hash `3a0e5c3bb37309394c5e97076f32895b289f15462198ac0b42a87a043555ccc8`.

It also recomputed and matched receiver candidate
`7358b69328ab4be707a7424788a09794e7a01882`, receiver tree
`ca2a5486d4e69ee063c9783ab0df2ac3db559d97`, receiver source/test hashes, provider
receipt byte hash `090e289687fd1277b5747faf1daff8999e3d3d3a854fc2dc7143440aad316b09`,
canonical receipt hash `d5a83c5b95ce2d977ff83019b3a01faaab77a84118e9eea8122bbff7c913499c`,
generated production configuration hash
`2337fe5d2bfb89c5e1a994d602ae8a0d47d6fa677f930ec0dbcaddb1c9ae9ada`, and receiver
build aggregate `f6e83ec3e18c037315b083a72d395c4f978ca267f1b9df20db7e86de6121fa32`.

## Pre-action evidence

Authenticated Wrangler account `d42a1d557371024c855bc44a2c4aa28c` matched. The active producer was the
recorded drifted version `f370b4dd-7d51-40d5-b8c7-025ed278c5ee` alone at 100 percent and the
active receiver was rollback version `d969492c-5b4c-4811-895d-80706836b1d5` alone at 100 percent.
Exact corrective R13 version `43244bc7-9300-4a9d-a9a6-e2da43aba6af` was available.

Every D1 preflight was a direct `d1 execute --command` SELECT and returned `success=true`,
`changes=0`, `rows_written=0`, and `changed_db=false`. The frozen source inventory remained
198,287 organizations and 141 contacts. The run remained `scanned`, with both source scans
complete, 198,287 eligible organizations, 141 rejected contacts, 94,887 delivered organization
events, 103,400 pending events, zero retry/leased/dead/exhausted events, no lease, no reconciliation
failure or halt, and no reconciliation window. The receiver had exactly 94,887 organizations,
SightSmash workspace projections, PCD receipts, and organization clocks at high-water 94,887,
with zero people, contact points, workspace contacts, consent events, contact clocks, or bad
reconciliation runs.

Fresh pre-action Time Travel bookmarks were captured without restoration:

- directory D1: `00004a8f-00000000-000050e7-e58232c1be4679519d7cdd2b0c0b37b9`;
- PCD operations D1: `00000116-00000000-000050e7-cc8a9b517b011c8c1f8a9cd939804b88`;
- CRM D1: `0000008e-00009b90-000050e7-5702027839651def02939af95c94c69e`.

## Authorized execution and abort

One inactive receiver version was uploaded from the exact receiver candidate and config:

- version: `f4138b4a-aed1-4501-84f2-86f250e713d2`;
- tag: `crm-p17b-r15-receiver-7358b69328ab`.

Its readback matched the expected `fetch`, `queue`, and `scheduled` handlers, production D1,
private R2 bucket, jobs Queue, assets binding, unchanged non-secret variables, and all seven secret
bindings by name. The existing jobs Queue consumer remained attached to `field-forge-crm` with
batch size 5, max wait 5000 ms, max retries 5, and the unchanged dead-letter Queue.

The receiver was promoted alone to 100 percent in deployment
`ea101c32-bb11-4c93-89d4-e451dbd9d63a`. Cloudflare Access continued to protect `/` and
`/health`; the public privacy-request route returned 200 with the expected security headers. Both
workspaces remained active with one active admin each. Only `ws-sightsmash` had organization
projections, and the zero-contact and zero-reconciliation-finding boundaries remained intact.

Corrective R13 was then promoted alone to 100 percent in deployment
`01b7adea-c2a1-401f-9f71-f9a6820ccd5d`. Its version readback retained the required
`CRM_ADAPTER` Service Binding, exact production databases, both true producer flags, frozen source
boundary/bookmarks/policy/manifest, and unchanged secret-name set.

The mandatory next-complete-minute check at `2026-09-15T21:34:44.8967690Z` did not advance the
run: delivered remained 94,887 and pending remained 103,400, with no lease, retry, dead event,
reconciliation error, or contact row. This crossed the gate's explicit abort threshold.

## Mandatory rollback and final state

R13 remained active alone at 100 percent. The receiver was restored alone to exact rollback
version `d969492c-5b4c-4811-895d-80706836b1d5` in deployment
`23bb4e43-17d5-4f00-8715-d5465e5b4349`.

Post-rollback SELECTs again returned `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`. The run remains safely stalled at 94,887 delivered and 103,400 pending, with
zero retry/leased/dead events, no lease, and no reconciliation failure or halt. The receiver remains
at exact parity with 94,887 organizations and has zero people, contact points, workspace contacts,
consent events, contact clocks, or bad reconciliation runs.

A bounded live tail proved observability was functioning by capturing a Worker-handled
`/sitemap-camps.xml` request on exact R13, but captured no scheduled invocation across the
following complete minute boundary. The evidence is consistent with the production minute Cron
being absent or non-firing. No trigger mutation was authorized by R15-A1, so no trigger was changed.

The R15 producer candidate was neither uploaded nor promoted. The final versions list has no
`crm-p17b-r15-producer-12d2015cca1e` tag. No database, migration, Queue, R2, KV, Access,
Turnstile, DNS, route, domain, secret, source boundary, source policy, contact, export, or send
change occurred.

## Decision

Gate 9C-P17-B-R15-A1 is a truthful **HOLD**. The next separately scoped action must restore and
prove the two frozen `parent-coach-desk` Cron triggers before repeating the receiver/R13/R15
promotion sequence. Existing source and receiver data are consistent and recoverable.
