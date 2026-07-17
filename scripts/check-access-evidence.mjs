#!/usr/bin/env node
import { loadAccessEvidence, validateAccessPolicyEvidence, validateAuthenticatedAccessEvidence } from './access-evidence.mjs';

const [policyFile, probeFile] = process.argv.slice(2);
if (!policyFile || !probeFile) { console.error('usage: node scripts/check-access-evidence.mjs <policy.json> <probe.json>'); process.exit(2); }
const policy = validateAccessPolicyEvidence(loadAccessEvidence(policyFile));
const probe = validateAuthenticatedAccessEvidence(loadAccessEvidence(probeFile));
const errors = [...policy.errors.map((item) => `policy: ${item}`), ...probe.errors.map((item) => `probe: ${item}`)];
if (errors.length) { console.error(`Access evidence failed:\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`Access evidence structure passed; policy=${policy.complete ? 'complete' : 'pending'}, authenticated_probes=${probe.complete ? 'complete' : 'pending'}.`);
