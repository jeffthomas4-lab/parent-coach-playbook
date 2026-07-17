import fs from 'node:fs';

export const REQUIRED_ACCESS_PATHS = ['/admin*', '/api/admin*'];
const PROTECTED_ROUTE_COUNT = JSON.parse(
  fs.readFileSync(new URL('../automation/protected-route-contract.json', import.meta.url), 'utf8'),
).routes.length;

export function validateAccessPolicyEvidence(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['packet must be an object'], valid: false, complete: false };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (!['pending', 'exported'].includes(value.state)) errors.push('state must be pending or exported');
  if (value.contains_tokens !== false || value.contains_secret_values !== false) errors.push('packet must explicitly exclude tokens and secret values');
  const complete = value.state === 'exported';
  if (complete) {
    for (const field of ['exported_at', 'team_domain', 'audience_tag', 'export_method', 'export_hash']) {
      if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required when exported`);
    }
    if (value.team_domain !== 'fieldforge.cloudflareaccess.com') errors.push('team_domain does not match production configuration');
    if (value.audience_tag !== 'f62ae793e5e4685b8490c8f16ab196069649420860eec79d860921ae4b65aa23') errors.push('audience_tag does not match production configuration');
    if (!Array.isArray(value.applications) || value.applications.length === 0) errors.push('applications are required when exported');
    for (const path of REQUIRED_ACCESS_PATHS) {
      if (!value.applications?.some((app) => Array.isArray(app.paths) && app.paths.includes(path))) errors.push(`Access export does not cover ${path}`);
    }
    for (const app of value.applications ?? []) {
      if (app.domain !== 'parentcoachdesk.com') errors.push('Access application domain must be parentcoachdesk.com');
      if (!Array.isArray(app.policies) || app.policies.length === 0) errors.push('each Access application requires policies');
      if (app.policies?.some((policy) => policy.decision === 'allow' && policy.include_everyone === true)) errors.push('allow-everyone policy is prohibited');
      if (!app.policies?.some((policy) => policy.decision === 'allow' && Number(policy.include_selector_count) > 0)) errors.push('each Access application requires a bounded allow policy');
    }
  }
  return { errors, valid: errors.length === 0, complete: complete && errors.length === 0 };
}

export function validateAuthenticatedAccessEvidence(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['packet must be an object'], valid: false, complete: false };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (!['pending', 'complete'].includes(value.state)) errors.push('state must be pending or complete');
  if (value.tokens_retained !== false || value.cookies_retained !== false) errors.push('probe evidence must not retain tokens or cookies');
  const complete = value.state === 'complete';
  if (complete) {
    if (value.contract_route_count !== PROTECTED_ROUTE_COUNT) errors.push(`contract_route_count must be ${PROTECTED_ROUTE_COUNT}`);
    for (const field of ['observed_at', 'allowed_identity_class', 'denied_identity_class', 'evidence_hash']) {
      if (typeof value[field] !== 'string' || !value[field].trim()) errors.push(`${field} is required when complete`);
    }
    if (!Array.isArray(value.allowed_results) || value.allowed_results.length !== PROTECTED_ROUTE_COUNT) errors.push(`allowed_results must cover all ${PROTECTED_ROUTE_COUNT} routes`);
    if (!Array.isArray(value.denied_results) || value.denied_results.length !== PROTECTED_ROUTE_COUNT) errors.push(`denied_results must cover all ${PROTECTED_ROUTE_COUNT} routes`);
    if (value.allowed_results?.some((item) => item.edge_authorized !== true || item.mutation_invoked !== false)) errors.push('allowed probes must pass the edge without invoking mutations');
    if (value.denied_results?.some((item) => item.edge_blocked !== true || item.origin_reached !== false)) errors.push('denied probes must be blocked before origin');
  }
  return { errors, valid: errors.length === 0, complete: complete && errors.length === 0 };
}

export const loadAccessEvidence = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
