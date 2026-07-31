#!/usr/bin/env node
// RETIRED FROM ci:release AND ci.yml on 2026-07-31 (STANDARD-AUDIT item 57).
//
// This checked a receipt file frozen at cut time. The receipt goes stale the
// moment the next release ships (it was three days old and already wrong
// during the 2026-07-30 incident, item 56), and remediation no longer reads
// it at all — the rollback target is now resolved live from
// `wrangler versions list` at the moment of failure, in
// scripts/deploy-remediation.mjs. A gate that no longer feeds anything
// downstream just fails on its own expiry schedule with no upside, per the
// Website Build Standard's Pillar 8 rule that a gate which no longer guards
// anything is a scheduled outage.
//
// The receipt's binding-parity check (does production still declare the
// expected D1/R2/KV/rate-limit bindings) is not lost: `check:production-manifest`
// (scripts/check-deployment-manifest.mjs) already asserts the exact production
// binding set on every push, against the live built manifest rather than a
// snapshot that ages.
//
// Left in the tree for manual, non-gating use only: run it by hand against a
// freshly-cut receipt (scripts/observe-worker-rollback-target.mjs) if you want
// a point-in-time binding snapshot for an incident writeup. Do not wire this
// back into CI or a deploy workflow without re-reading item 57.
import { loadWorkerRollbackTarget, validateWorkerRollbackTarget } from './worker-rollback-target.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/check-worker-rollback-target.mjs <receipt.json>');
  process.exit(2);
}
try {
  const result = validateWorkerRollbackTarget(loadWorkerRollbackTarget(file));
  if (result.errors.length) {
    console.error(`Worker rollback target failed:\n- ${result.errors.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Worker rollback target receipt passed. This validates the target only; it does not rehearse or execute rollback.');
} catch (error) {
  console.error(`Worker rollback target could not be read: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exit(1);
}
