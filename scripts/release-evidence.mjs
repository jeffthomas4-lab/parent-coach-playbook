import fs from 'node:fs';

export const REQUIRED_GATES = [
  'source_commit', 'production_manifest', 'tests_and_build', 'secret_scan',
  'access_policy', 'anonymous_access_probes', 'authenticated_access_probes',
  'database_backup', 'database_restore', 'r2_recovery', 'rollback_target',
  'rollback_rehearsal', 'customer_journeys', 'notification_receipt',
  'failure_isolation', 'open_risk_decision', 'deploy_approval',
  'migration_approval', 'post_deploy_observation',
];

const states = new Set(['pass', 'fail', 'pending', 'not_applicable']);

export function validateReleaseEvidence(value, phase = 'closeout') {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['packet must be an object'], ready: false };
  for (const field of ['release_id', 'environment', 'created_at', 'expires_at']) {
    if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required`);
  }
  if (value.environment !== 'production') errors.push('environment must be production');
  if (!value.gates || typeof value.gates !== 'object' || Array.isArray(value.gates)) {
    errors.push('gates must be an object');
    return { errors, ready: false };
  }
  for (const gate of REQUIRED_GATES) {
    const item = value.gates[gate];
    if (!item || typeof item !== 'object') { errors.push(`${gate} is required`); continue; }
    if (!states.has(item.state)) errors.push(`${gate}.state is invalid`);
    if (typeof item.summary !== 'string' || !item.summary.trim()) errors.push(`${gate}.summary is required`);
    if (!Array.isArray(item.evidence)) errors.push(`${gate}.evidence must be an array`);
    if (item.state === 'pass' && (!Array.isArray(item.evidence) || item.evidence.length === 0)) errors.push(`${gate} cannot pass without evidence`);
    if (item.state === 'not_applicable' && (typeof item.approved_by !== 'string' || !item.approved_by.trim())) errors.push(`${gate} not_applicable requires approved_by`);
  }
  const expired = typeof value.expires_at === 'string' && Date.parse(value.expires_at) <= Date.now();
  if (expired) errors.push('packet is expired');
  const phaseGates = phase === 'predeploy' ? REQUIRED_GATES.filter((gate) => gate !== 'post_deploy_observation') : REQUIRED_GATES;
  const ready = errors.length === 0 && phaseGates.every((gate) => ['pass', 'not_applicable'].includes(value.gates[gate]?.state));
  return { errors, ready };
}

export function loadReleaseEvidence(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
