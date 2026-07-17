import fs from 'node:fs';

const requiredBindings = {
  ACCESS_AUD: 'plain_text', ACCESS_TEAM_DOMAIN: 'plain_text', ADMIN_EMAILS: 'plain_text',
  ASSETS: 'assets', BULK_IMPORT_TOKEN: 'secret_text', CRON_KEY: 'secret_text',
  DB: 'd1', FORGE_DB: 'd1', GITHUB_TOKEN: 'secret_text', PHOTOS: 'r2_bucket',
  SESSION: 'kv_namespace', SITE_URL: 'plain_text',
};

export function validateWorkerRollbackTarget(value, now = Date.now()) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['receipt must be an object'], valid: false };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  for (const field of ['observed_at', 'expires_at', 'worker_name', 'active_deployment_id', 'target_version_id', 'script_etag']) {
    if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required`);
  }
  if (value.worker_name !== 'parent-coach-desk') errors.push('worker_name must be parent-coach-desk');
  if (value.target_version_id !== value.active_version_id) errors.push('target must have been the active version at observation');
  if (value.traffic_percentage !== 100) errors.push('target must have received 100 percent of traffic at observation');
  if (value.candidate_usage !== 'next_release_only') errors.push('candidate_usage must be next_release_only');
  if (Date.parse(value.expires_at) <= now) errors.push('receipt is expired');
  if (!value.bindings || typeof value.bindings !== 'object' || Array.isArray(value.bindings)) errors.push('bindings must be an object');
  else for (const [name, type] of Object.entries(requiredBindings)) {
    if (value.bindings[name] !== type) errors.push(`binding ${name} must be present as ${type}`);
  }
  if (!Array.isArray(value.health_evidence) || value.health_evidence.length < 2) errors.push('at least two health evidence references are required');
  if (value.storage_rollback_included !== false) errors.push('receipt must state that storage rollback is not included');
  if (value.pages_is_rollback_target !== false) errors.push('Pages must not be designated as the rollback target');
  if (!value.predecessor_finding || value.predecessor_finding.safe !== false) errors.push('unsafe predecessor finding is required');
  for (const prohibited of ['binding_values', 'secret_values', 'token_values', 'credentials']) {
    if (Object.prototype.hasOwnProperty.call(value, prohibited)) errors.push(`receipt must not contain ${prohibited}`);
  }
  return { errors, valid: errors.length === 0 };
}

export function loadWorkerRollbackTarget(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
