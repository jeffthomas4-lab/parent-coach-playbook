# PLAT-009 production CRM producer disabled contract — local evidence

Status: **LOCAL PASS / REMOTE RELEASE HOLD**
Recorded: 2026-09-07
Implementation candidate: `b7976193a8c1f2c81d42d54c045bfaf1fd6efecf`

## Requirement

Prepare Parent Coach Desk production to connect to the portfolio CRM without activating either
the live producer or the historical transfer. The deployment contract must name the exact future
receiver, include the bounded minute scheduler and transport-secret declaration, retain the
existing source and target identities, and reject any production manifest that enables a producer
mode or chooses an activation boundary before its separately approved gate.

## Implemented contract

- production Service Binding `CRM_ADAPTER` targets Worker `field-forge-crm`;
- production declares, but does not store, `PCD_CRM_ADAPTER_HMAC_SECRET`;
- the existing six-hour scheduler is retained and the bounded minute scheduler is declared;
- `PCD_CRM_ADAPTER_ENABLED` and `PCD_CRM_BACKFILL_ENABLED` are both exactly `false`;
- producer workspace `pcd-activity-radar`, target workspace `ws-sightsmash`, and source
  `source-pcd-activity-radar` are fixed by the production manifest;
- `PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent and the manifest validator rejects its presence;
- the manifest validator rejects a missing or renamed receiver binding, scheduler drift, an
  enabled producer mode, missing secret declaration, or identity drift;
- no Worker deploy, D1 mutation, provider/resource/secret change, boundary selection, row copy,
  export, send, or production activation occurred in this lane.

## Red-first evidence

The focused contract suite failed four tests before the production manifest and validator were
changed: the CRM Service Binding, minute scheduler, transport-secret declaration, and disabled
producer contract were absent. Those failures were retained as production contract regression
tests.

## Verification

- focused deployment-authority and production-manifest tests: **10/10 PASS**;
- `npm run check:production-manifest`: PASS after a complete production build;
- `npm run check`: **645 files, 0 errors, 0 warnings, 398 existing hints**;
- `git diff --check`: PASS before the candidate commit;
- scope review: only the four named configuration, validator, and regression-test files entered
  the candidate; pre-existing generated link-manifest and social-card changes stayed unstaged;
- QA pass: unsafe missing-binding, scheduler-drift, and enabled-flag cases are rejected;
- security pass: no secret value is present and both write-producing modes remain disabled;
- efficiency pass: disabled execution performs no CRM query, binding call, or queue work;
- simplicity pass: the existing manifest and validator paths were extended; no alternate config
  authority, runtime abstraction, or dependency was added.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: O(1) while disabled;
- DB query count on primary path: 0 attributable to CRM while disabled;
- external API calls: 0 attributable to CRM while disabled;
- queue jobs created: 0;
- expected memory behavior: O(1), because neither producer mode executes;
- likely scaling bottleneck: once separately activated, the already measured conservative
  ten-event-per-minute receiver pump, not this disabled deployment contract.

## Dependency decision

The previously completed live npm, PyPI, and GitHub review found no package that improves the
existing D1 outbox, HMAC, Service Binding, and deployment-manifest contract without creating a
second authority or unnecessary runtime weight. This slice uses the existing repository and
Cloudflare primitives and adds no dependency.

## Remaining gate boundary

This candidate is ready to be included in a later exact production deployment candidate, but it
does not authorize deployment or activation. The receiver resources must first be created and
read back so provider-assigned identifiers can be frozen into the production receiver candidate.
Producer deployment, secret value creation, migrations, historical data transfer, live activation,
and production verification remain separate exact actions.
