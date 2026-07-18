#!/usr/bin/env node
import { loadAccessEvidence, validateAccessPolicyEvidence, validateAuthenticatedAccessEvidence } from './access-evidence.mjs';

const args = process.argv.slice(2);
const requireComplete = args.includes('--require-complete');
const files = args.filter((arg) => arg !== '--require-complete');
const [policyFile, probeFile] = files;
if (!policyFile || !probeFile || files.length !== 2) { console.error('usage: node scripts/check-access-evidence.mjs [--require-complete] <policy.json> <probe.json>'); process.exit(2); }
const policy = validateAccessPolicyEvidence(loadAccessEvidence(policyFile));
const probe = validateAuthenticatedAccessEvidence(loadAccessEvidence(probeFile));
const errors = [...policy.errors.map((item) => `policy: ${item}`), ...probe.errors.map((item) => `probe: ${item}`)];
if (requireComplete && !policy.complete) errors.push('policy: complete exported Access evidence is required for production deployment');
if (requireComplete && !probe.complete) errors.push('probe: complete allowed/denied authenticated evidence is required for production deployment');
if (errors.length) { console.error(`Access evidence failed:\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`Access evidence structure passed; policy=${policy.complete ? 'complete' : 'pending'}, authenticated_probes=${probe.complete ? 'complete' : 'pending'}.`);
