import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const inventory = fs.readFileSync(new URL('../automation/TASK-RUN-LOG-RECONCILIATION.md', import.meta.url), 'utf8');
export const EXPECTED_TASK_IDS = [...inventory.matchAll(/^\| `([^`]+)` \|/gm)].map((match) => match[1]);

export function validateAgentTokenRolloutEvidence(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['packet must be an object'], valid: false, complete: false };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (!['pending', 'complete', 'rolled_back'].includes(value.state)) errors.push('state must be pending, complete, or rolled_back');
  if (value.contains_secret_values !== false) errors.push('packet must explicitly exclude secret values');
  if (value.caller_secret_name !== 'PCD_AGENT_RUNS_TOKEN') errors.push('caller_secret_name must be PCD_AGENT_RUNS_TOKEN');
  if (value.worker_secret_name !== 'AGENT_RUNS_TOKEN') errors.push('worker_secret_name must be AGENT_RUNS_TOKEN');
  if (value.canary_task_id !== 'weekly-gsc-review') errors.push('weekly-gsc-review must remain the Nora canary');
  if (value.expected_caller_count !== EXPECTED_TASK_IDS.length) errors.push(`expected_caller_count must be ${EXPECTED_TASK_IDS.length}`);
  const strings = [];
  const collectStrings = (item) => {
    if (typeof item === 'string') strings.push(item);
    else if (Array.isArray(item)) item.forEach(collectStrings);
    else if (item && typeof item === 'object') Object.values(item).forEach(collectStrings);
  };
  collectStrings(value);
  const allowedNames = new Set(['PCD_AGENT_RUNS_TOKEN', 'AGENT_RUNS_TOKEN']);
  if (strings.some((item) => !allowedNames.has(item) && /bearer\s+[a-z0-9._~-]{12,}|(?:token|secret)_value|authorization\s*:/i.test(item))) errors.push('packet appears to contain credential material');

  const complete = value.state === 'complete';
  if (complete) {
    if (value.preflight_status !== 204) errors.push('complete rollout requires a 204 canary preflight');
    for (const field of ['observed_at', 'canary_start_ref', 'canary_finish_ref', 'canary_failure_ref']) {
      if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required when complete`);
    }
    if (typeof value.evidence_hash !== 'string' || !/^[a-f0-9]{64}$/i.test(value.evidence_hash)) errors.push('evidence_hash must be a SHA-256 hex digest when complete');
    const actual = Array.isArray(value.reconciled_task_ids) ? value.reconciled_task_ids : [];
    if (actual.length !== EXPECTED_TASK_IDS.length || new Set(actual).size !== actual.length || EXPECTED_TASK_IDS.some((id) => !actual.includes(id))) {
      errors.push('reconciled_task_ids must cover every current scheduled-task inventory row exactly once');
    }
    if (value.prior_credential_revoked !== true) errors.push('prior credential may be revoked only after complete reconciliation');
    if (value.rollback_performed !== false) errors.push('a completed rollout cannot also claim rollback');
  }
  if (value.state === 'rolled_back') {
    if (typeof value.rollback_ref !== 'string' || !value.rollback_ref.trim()) errors.push('rolled_back state requires rollback_ref');
    if (value.prior_credential_revoked !== false) errors.push('rolled_back state must preserve the prior credential');
  }
  return { errors, valid: errors.length === 0, complete: complete && errors.length === 0 };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const file = process.argv[2] ?? 'coordination/release-evidence/agent-token-rollout-pending.json';
  const packet = JSON.parse(fs.readFileSync(file, 'utf8'));
  const result = validateAgentTokenRolloutEvidence(packet);
  if (result.errors.length) {
    console.error('Agent token rollout evidence failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`Agent token rollout evidence passed; state=${packet.state}.`);
  }
}
