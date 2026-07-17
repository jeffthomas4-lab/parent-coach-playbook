import fs from 'node:fs';

export const REQUIRED_SCENARIOS = [
  'worker_code_regression', 'd1_bad_write', 'd1_schema_failure',
  'r2_object_loss', 'kv_session_loss', 'pages_fallback_request',
];

const validStates = new Set(['tabletop_pass', 'operational_gap', 'rejected']);

export function validateRecoveryTabletop(value) {
  const errors = [];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { errors: ['receipt must be an object'], valid: false };
  if (value.schema_version !== 1) errors.push('schema_version must be 1');
  if (value.exercise_type !== 'no_side_effect_tabletop') errors.push('exercise_type must be no_side_effect_tabletop');
  if (value.external_changes?.length !== 0) errors.push('tabletop must record zero external changes');
  if (value.rollback_executed !== false) errors.push('rollback_executed must be false');
  if (value.data_restore_executed !== false) errors.push('data_restore_executed must be false');
  if (value.operational_rehearsal_complete !== false) errors.push('operational_rehearsal_complete must remain false');
  if (!Array.isArray(value.scenarios)) errors.push('scenarios must be an array');
  else {
    for (const id of REQUIRED_SCENARIOS) {
      const scenario = value.scenarios.find((item) => item?.id === id);
      if (!scenario) { errors.push(`scenario ${id} is required`); continue; }
      if (!validStates.has(scenario.state)) errors.push(`scenario ${id} has invalid state`);
      for (const field of ['detection', 'containment', 'recovery_path', 'approval_boundary', 'verification', 'residual_gap']) {
        if (typeof scenario[field] !== 'string' || !scenario[field].trim()) errors.push(`scenario ${id}.${field} is required`);
      }
    }
  }
  const byId = Object.fromEntries((value.scenarios ?? []).map((item) => [item.id, item]));
  if (byId.worker_code_regression?.state !== 'tabletop_pass') errors.push('Worker code scenario must pass tabletop');
  if (byId.r2_object_loss?.state !== 'operational_gap') errors.push('R2 loss must remain an operational gap');
  if (byId.pages_fallback_request?.state !== 'rejected') errors.push('Pages fallback must be rejected');
  if (!String(byId.worker_code_regression?.recovery_path ?? '').includes('92516f62-b891-4903-94e1-204a972ee2ae')) errors.push('Worker scenario must name the pinned version');
  if (!String(byId.d1_bad_write?.recovery_path ?? '').match(/Time Travel|fresh target/i)) errors.push('D1 bad-write scenario must use an approved recovery mechanism');
  if (!String(byId.d1_schema_failure?.residual_gap ?? '').match(/migration|rehearsal/i)) errors.push('D1 schema scenario must preserve migration rehearsal gap');
  return { errors, valid: errors.length === 0 };
}

export const loadRecoveryTabletop = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
