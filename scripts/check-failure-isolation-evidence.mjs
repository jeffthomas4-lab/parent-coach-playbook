#!/usr/bin/env node
import { loadFailureIsolationEvidence, validateFailureIsolationEvidence } from './failure-isolation-evidence.mjs';

const file = process.argv[2];
if (!file) { console.error('usage: node scripts/check-failure-isolation-evidence.mjs <receipt.json>'); process.exit(2); }
const result = validateFailureIsolationEvidence(loadFailureIsolationEvidence(file));
if (!result.valid) { console.error(`Failure isolation evidence failed:\n- ${result.errors.join('\n- ')}`); process.exit(1); }
console.log('Local failure-isolation evidence passed. Environment drill and human alert receipt remain pending.');
