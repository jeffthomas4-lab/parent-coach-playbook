import fs from 'node:fs';

export const REQUIRED_FAILURES = [
  'd1_unavailable', 'forge_unavailable', 'scheduler_target_unhealthy',
  'notification_delivery_uncertain', 'public_monitor_dependency_failure',
];

export function validateFailureIsolationEvidence(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['receipt must be an object'], valid: false };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (value.exercise_type !== 'local_integrated_simulation') errors.push('exercise_type must be local_integrated_simulation');
  if (value.external_changes?.length !== 0) errors.push('external_changes must be empty');
  if (value.human_alert_received !== false) errors.push('human_alert_received must remain false');
  if (!Array.isArray(value.scenarios)) errors.push('scenarios must be an array');
  else for (const id of REQUIRED_FAILURES) {
    const scenario = value.scenarios.find((item) => item?.id === id);
    if (!scenario) { errors.push(`scenario ${id} is required`); continue; }
    if (scenario.state !== 'pass') errors.push(`scenario ${id} must pass`);
    if (typeof scenario.invariant !== 'string' || !scenario.invariant.trim()) errors.push(`scenario ${id}.invariant is required`);
    if (!Array.isArray(scenario.evidence) || scenario.evidence.length === 0) errors.push(`scenario ${id}.evidence is required`);
  }
  if (value.release_gate_closed !== false) errors.push('release_gate_closed must remain false until environment evidence exists');
  return { errors, valid: errors.length === 0 };
}

export const loadFailureIsolationEvidence = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
