#!/usr/bin/env node
/**
 * Post-deploy auto-remediation.
 *
 * Closes the downtime gap in the deploy workflow: the smoke/health check runs
 * AFTER `wrangler deploy` has already put the new version live at 100 percent
 * traffic. Before this, a failed smoke only turned the CI run red and left the
 * broken version serving. This module is invoked when a post-deploy smoke check
 * fails and either:
 *   - rolls traffic back to the recorded good version id (production), or
 *   - halts and emits an unambiguous alert when no valid rollback target exists
 *     or the rollback itself fails.
 *
 * It never leaves a failed-smoke deploy live silently: every smoke-failure path
 * exits non-zero with a loud, specific message.
 *
 * The rollback command is executed through an injectable runner so the decision
 * logic is unit-tested against a mocked Wrangler CLI. The live staging rollback
 * drill remains a separate, owner-gated step.
 */
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { loadWorkerRollbackTarget, validateWorkerRollbackTarget } from './worker-rollback-target.mjs';

export const REMEDIATION_NONE = 'none';
export const REMEDIATION_ROLLED_BACK = 'rolled_back';
export const REMEDIATION_HALTED = 'halted';
export const REMEDIATION_ROLLBACK_FAILED = 'rollback_failed';

const valueAfter = (argv, flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

/**
 * The exact Wrangler arguments that shift 100 percent of traffic back to the
 * recorded good version. Kept as pure data so tests assert the invocation
 * without executing anything.
 */
export function rollbackWranglerArgs(target, versionId, configPath) {
  return [
    'versions', 'deploy', `${versionId}@100%`,
    '--config', configPath,
    '--yes',
    '--message', `auto-remediation: roll ${target} back to ${versionId} after post-deploy smoke failure`,
  ];
}

function defaultRunWrangler(args) {
  const npmCli = process.env.npm_execpath;
  const command = npmCli ? process.execPath : 'npm';
  const fullArgs = npmCli ? [npmCli, 'exec', '--', 'wrangler', ...args] : ['exec', '--', 'wrangler', ...args];
  return spawnSync(command, fullArgs, { stdio: 'inherit' });
}

/**
 * Decide and (optionally) execute remediation after a smoke check.
 *
 * @param {object} params
 * @param {boolean} params.smokeFailed  true when the post-deploy smoke check failed.
 * @param {'staging'|'production'} params.target
 * @param {object|null} params.rollbackTarget  parsed rollback-target receipt (null when unavailable).
 * @param {boolean} [params.haltOnly]  when true, never roll back; always halt+alert.
 * @param {(args:string[]) => {status:number|null}} [params.runWrangler]  injectable Wrangler runner.
 * @param {string} [params.configPath]
 * @param {number} [params.now]  epoch ms, for rollback-target expiry validation.
 * @param {(message:string) => void} [params.log]
 * @returns {{action:string, remediated:boolean, alert?:string, versionId?:string, errors?:string[], wranglerStatus?:number|null, reason?:string}}
 */
export function remediateAfterSmoke({
  smokeFailed,
  target,
  rollbackTarget,
  haltOnly = false,
  runWrangler = defaultRunWrangler,
  configPath = 'wrangler.production.jsonc',
  now = Date.now(),
  log = () => {},
}) {
  if (!['staging', 'production'].includes(target)) throw new Error('target must be staging or production');
  if (!smokeFailed) return { action: REMEDIATION_NONE, remediated: false, reason: 'smoke_passed' };

  if (haltOnly) {
    const alert = `DEPLOY HALTED: ${target} post-deploy smoke FAILED. No automated rollback is configured for ${target}; the pipeline is stopped and the failure is loud. Investigate and roll back by hand NOW.`;
    log(alert);
    return { action: REMEDIATION_HALTED, remediated: false, alert };
  }

  const { errors, valid } = validateWorkerRollbackTarget(rollbackTarget, now);
  if (!valid) {
    const alert = `DEPLOY HALTED: ${target} smoke FAILED and no VALID rollback target is available (${errors.join('; ')}). The failed version may still be LIVE — manual rollback required NOW.`;
    log(alert);
    return { action: REMEDIATION_HALTED, remediated: false, alert, errors };
  }

  const versionId = rollbackTarget.target_version_id;
  const args = rollbackWranglerArgs(target, versionId, configPath);
  log(`${target} post-deploy smoke FAILED — auto-rolling back to recorded good version ${versionId} at 100% traffic.`);
  const result = runWrangler(args);
  if (!result || result.status !== 0) {
    const alert = `DEPLOY HALTED: ${target} smoke FAILED and the automated rollback to ${versionId} ALSO FAILED (wrangler exit ${result ? result.status : 'unknown'}). The failed version is LIVE — manual rollback required NOW.`;
    log(alert);
    return { action: REMEDIATION_ROLLBACK_FAILED, remediated: false, alert, versionId, wranglerStatus: result ? result.status : null };
  }
  log(`${target} rolled back to recorded good version ${versionId} at 100% traffic. Smoke failure still requires investigation.`);
  return { action: REMEDIATION_ROLLED_BACK, remediated: true, versionId };
}

async function main() {
  const argv = process.argv.slice(2);
  const target = valueAfter(argv, '--target');
  const rollbackTargetPath = valueAfter(argv, '--rollback-target');
  const configPath = valueAfter(argv, '--config') ?? 'wrangler.production.jsonc';
  const haltOnly = argv.includes('--halt-only');

  let rollbackTarget = null;
  if (!haltOnly) {
    if (!rollbackTargetPath) throw new Error('usage: deploy-remediation.mjs --target staging|production (--rollback-target <file> | --halt-only) [--config <file>]');
    rollbackTarget = loadWorkerRollbackTarget(rollbackTargetPath);
  }

  // This CLI is invoked from the workflow only when the deploy step succeeded
  // and the smoke step failed, so smokeFailed is always true here.
  const outcome = remediateAfterSmoke({
    smokeFailed: true,
    target,
    rollbackTarget,
    haltOnly,
    configPath,
    log: (message) => console.error(message),
  });

  // Any smoke failure keeps the run red so a human is paged, even when the site
  // was auto-restored.
  process.exitCode = 1;
  if (outcome.action === REMEDIATION_ROLLED_BACK) {
    console.error(`Remediation complete: ${target} traffic restored to ${outcome.versionId}.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
