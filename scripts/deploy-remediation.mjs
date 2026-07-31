#!/usr/bin/env node
/**
 * Post-deploy remediation: halt, resolve, and hand a human the exact command.
 *
 * The smoke/health check runs AFTER `wrangler deploy` has already put the new
 * version live at 100 percent traffic, so a failed smoke means something
 * possibly-bad is already serving. This module runs on that failure.
 *
 * WHAT CHANGED, AND WHY (2026-07-30 incident, STANDARD-AUDIT item 56)
 * -------------------------------------------------------------------
 * This used to AUTO-ROLL-BACK production to a version id recorded in a
 * checked-in receipt file. On 2026-07-30 that combination reverted roughly a
 * day of shipped work:
 *
 *   1. The post-deploy smoke check failed on `/_astro/leaflet.*.js` returning
 *      404 with `cf-cache-status: HIT`. That asset is a route-only chunk the
 *      homepage never loads, so it was cold at the edge and negative-cached.
 *      The build was fine. (Selection bug fixed separately, item 55.)
 *   2. Remediation fired and rolled traffic to the id in
 *      `worker-rollback-target-2026-07-29.json` — a receipt observed a day
 *      earlier, which by then pointed at a version predating the navy/silver
 *      remap. Production lost the palette, the typography change, hero images
 *      across 847 articles, and the whole Pillar 14 mobile pass.
 *
 * Two defects, fixed here together:
 *
 *   (1) THE TARGET WAS STALE. A receipt file ages while releases pile up
 *       behind it, so the gap between "what is live" and "what rollback lands
 *       on" grows every day you ship. The target is now resolved live from
 *       `wrangler versions list` at the moment of failure, and it is the
 *       version immediately preceding this deploy. Blast radius is one
 *       release instead of however many happened since a receipt was cut.
 *
 *   (2) THE TRIGGER WAS NOT TRUSTWORTHY ENOUGH TO ACT ON ALONE. A single
 *       asset 404 is not evidence a deploy is bad, and automation acting on a
 *       false positive is worse than automation doing nothing. Production now
 *       takes the same posture staging always had: halt loudly, exit non-zero,
 *       and put the exact paste-ready rollback command in the log. A human
 *       decides. Nothing is executed against production by this script.
 *
 * The run still goes red on every smoke failure, so nobody can miss it.
 */
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const REMEDIATION_NONE = 'none';
export const REMEDIATION_HALTED = 'halted';

// Retired 2026-07-30. Nothing returns these any more — this script no longer
// executes a rollback. Kept exported so any older import fails loudly at the
// assertion rather than silently resolving to undefined.
export const REMEDIATION_ROLLED_BACK = 'rolled_back';
export const REMEDIATION_ROLLBACK_FAILED = 'rollback_failed';

const valueAfter = (argv, flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : undefined;
};

/**
 * The exact Wrangler arguments that shift 100 percent of traffic to a version.
 * Pure data: this script prints it for a human, it does not run it.
 */
export function rollbackWranglerArgs(target, versionId, configPath) {
  return [
    'versions', 'deploy', `${versionId}@100%`,
    '--config', configPath,
    '--yes',
    '--message', `manual rollback: restore ${target} to ${versionId} after post-deploy smoke failure`,
  ];
}

/**
 * Pick the version immediately preceding this deploy, newest-first.
 *
 * Pure so the selection is unit-tested without a live account. Wrangler's JSON
 * shape has moved between versions, so id and timestamp are read from several
 * candidate keys.
 *
 * @param {Array<object>} versions  parsed `wrangler versions list --json`
 * @param {string} [deployedVersionId]  the version this run just deployed. When
 *   supplied, it is excluded by id, which is exact. When omitted, the newest
 *   entry is assumed to be this deploy and the second-newest is returned.
 * @returns {{versionId:string, createdAt:string}|null}
 */
export function precedingVersionFrom(versions, deployedVersionId) {
  if (!Array.isArray(versions)) return null;
  const normalized = versions
    .map((v) => ({
      versionId: v?.id ?? v?.version_id ?? v?.versionId ?? null,
      createdAt: v?.created_on ?? v?.createdOn ?? v?.created_at ?? v?.metadata?.created_on ?? null,
    }))
    .filter((v) => typeof v.versionId === 'string' && v.versionId.length > 0);
  if (normalized.length === 0) return null;

  // Newest first. Entries without a timestamp keep their incoming order, which
  // wrangler already returns newest-first.
  const dated = normalized.filter((v) => v.createdAt);
  if (dated.length === normalized.length) {
    normalized.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  if (deployedVersionId) {
    return normalized.find((v) => v.versionId !== deployedVersionId) ?? null;
  }
  return normalized[1] ?? null;
}

const WRANGLER_ENTRY = resolve(process.cwd(), 'node_modules/wrangler/bin/wrangler.js');

/** Read-only. Returns the parsed version list, or null if it cannot be read. */
function defaultReadVersions(configPath) {
  try {
    const out = execFileSync(
      process.execPath,
      [WRANGLER_ENTRY, 'versions', 'list', '--config', configPath, '--json'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    const start = out.search(/[[{]/);
    if (start === -1) return null;
    const parsed = JSON.parse(out.slice(start));
    return Array.isArray(parsed) ? parsed : (parsed?.versions ?? null);
  } catch {
    return null;
  }
}

/**
 * Decide remediation after a smoke check. Never executes anything.
 *
 * @param {object} params
 * @param {boolean} params.smokeFailed
 * @param {'staging'|'production'} params.target
 * @param {string} [params.deployedVersionId]  the version this run deployed.
 * @param {(configPath:string) => Array<object>|null} [params.readVersions]  injectable reader.
 * @param {string} [params.configPath]
 * @param {(message:string) => void} [params.log]
 * @returns {{action:string, remediated:false, alert?:string, versionId?:string|null, command?:string}}
 */
export function remediateAfterSmoke({
  smokeFailed,
  target,
  deployedVersionId,
  readVersions = defaultReadVersions,
  configPath = 'wrangler.production.jsonc',
  log = () => {},
}) {
  if (!['staging', 'production'].includes(target)) throw new Error('target must be staging or production');
  if (!smokeFailed) return { action: REMEDIATION_NONE, remediated: false, reason: 'smoke_passed' };

  const versions = readVersions(configPath);
  const preceding = precedingVersionFrom(versions, deployedVersionId);

  const head = `DEPLOY HALTED: ${target} post-deploy smoke FAILED. The just-deployed version is LIVE and nothing has been rolled back automatically.`;
  const why = 'Automatic rollback was removed on 2026-07-30 after a false-positive smoke failure reverted a day of shipped work (STANDARD-AUDIT item 56). Confirm the failure is real before acting: a single asset 404 with cf-cache-status HIT is usually edge negative-caching, not a bad build.';

  if (!preceding) {
    const alert = `${head}\n${why}\nCould not resolve the preceding version from \`wrangler versions list\`, so no rollback command can be offered. Inspect the deployment by hand NOW.`;
    log(alert);
    return { action: REMEDIATION_HALTED, remediated: false, alert, versionId: null };
  }

  const command = `npx wrangler ${rollbackWranglerArgs(target, preceding.versionId, configPath).join(' ')}`;
  const alert = [
    head,
    why,
    `Immediately-preceding version, resolved live just now: ${preceding.versionId}${preceding.createdAt ? ` (created ${preceding.createdAt})` : ''}.`,
    'If the failure is real, roll back with:',
    `  ${command}`,
  ].join('\n');
  log(alert);
  return { action: REMEDIATION_HALTED, remediated: false, alert, versionId: preceding.versionId, command };
}

async function main() {
  const argv = process.argv.slice(2);
  const target = valueAfter(argv, '--target');
  const configPath = valueAfter(argv, '--config') ?? 'wrangler.production.jsonc';
  const deployedVersionId = valueAfter(argv, '--deployed-version');

  if (!target) throw new Error('usage: deploy-remediation.mjs --target staging|production [--config <file>] [--deployed-version <id>]');

  // Invoked from the workflow only when the deploy succeeded and the smoke step
  // failed, so smokeFailed is always true here.
  remediateAfterSmoke({
    smokeFailed: true,
    target,
    deployedVersionId,
    configPath,
    log: (message) => console.error(message),
  });

  // Always red. A smoke failure pages a human whether or not it turns out real.
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
