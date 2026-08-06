// Orchestrates one crawl run end to end: claim targets, fetch each one
// politely, run detection, record it, and close out the intel_runs row.
//
// Two entry points, both returning the same SweepResult shape:
//   runOrgSweep    -- the scheduled, always-safe path. Prospect org sites
//                      only, never a competitor property, off unless
//                      INTEL_SWEEP_ENABLED=true.
//   runApprovedRun -- executes a run a human has already approved (status
//                      must already be 'approved'). It always runs with the
//                      policy exactly as policyFromEnv returns it
//                      (allowCompetitorProperties: false) -- no code path in
//                      this subsystem is allowed to set that true. A run
//                      whose run_type is 'competitor_property' is accepted
//                      and recorded through the normal propose/approve
//                      flow, but is never executed: runApprovedRun refuses
//                      it immediately and marks it failed, because running
//                      it here would just re-crawl the ordinary
//                      prospect-org queue with the safety block off.
//
// KNOWN LIMITATION: a 'competitor_property' run has nowhere to source a
// reviewed list of competitor marketing pages from -- the schema has no
// per-run target list table. Until that table (or a notes-JSON convention
// on intel_runs) exists, competitor_property runs stay accepted-but-not-
// executed; see runApprovedRun's early guard below.

import type { D1Database } from '@cloudflare/workers-types';
import { log } from '../log';
import { COMPETITOR_DEFINITIONS } from './competitors';
import { DEFAULT_SWEEP_LIMIT, isFeatureEnabled, policyFromEnv, type IntelPolicy } from './config';
import { detect, validateDefinitions } from './fingerprints';
import { fetchPublicPage } from './fetcher';
import { claimSweepTargets, createRun, getRun, markRunStatus, recordDetection, syncCompetitorCatalog } from './store';

export interface SweepResult {
  runId: string;
  planned: number;
  fetched: number;
  skipped: number;
  signals: number;
  changes: number;
  queued: number;
  errors: number;
}

type IntelEnv = { DB: D1Database } & Record<string, unknown>;

function nowIso(): string {
  return new Date().toISOString();
}

async function crawlTargets(
  db: D1Database,
  runId: string,
  targets: Array<{ orgId: string; name: string; domain: string; url: string }>,
  policy: IntelPolicy,
  requestId: string,
): Promise<Omit<SweepResult, 'runId' | 'planned'>> {
  const result = { fetched: 0, skipped: 0, signals: 0, changes: 0, queued: 0, errors: 0 };
  const skipTally: Record<string, number> = {};

  // Sequential, on purpose: fetchPublicPage's own per-domain rate limit only
  // works if two fetches at the same domain are never in flight together.
  for (const target of targets) {
    try {
      const outcome = await fetchPublicPage(db, target.url, policy, COMPETITOR_DEFINITIONS);

      if (outcome.skippedReason) {
        result.skipped += 1;
        skipTally[outcome.skippedReason] = (skipTally[outcome.skippedReason] ?? 0) + 1;
        continue;
      }
      if (outcome.notModified || !outcome.html) {
        result.skipped += 1;
        skipTally.not_modified = (skipTally.not_modified ?? 0) + 1;
        continue;
      }

      result.fetched += 1;
      const detections = detect(
        { url: target.url, finalUrl: outcome.finalUrl ?? target.url, html: outcome.html, headers: outcome.headers },
        COMPETITOR_DEFINITIONS,
      );
      const recorded = await recordDetection(db, {
        runId,
        orgId: target.orgId,
        domain: target.domain,
        sourceUrl: outcome.finalUrl ?? target.url,
        results: detections,
      });
      result.signals += recorded.signalsWritten;
      result.changes += recorded.stackChanges;
      result.queued += recorded.queuedForReview;
    } catch (err) {
      result.errors += 1;
      // Never log the full URL (query strings can carry tokens) or an email;
      // domain is the identifying detail worth keeping.
      log('error', { requestId, route: 'lib/intel/pipeline', action: 'sweep_target_failed', runId, domain: target.domain, error: err });
    }
  }

  // Nested under its own key, not spread: a skip reason is literally named
  // 'error' (FetchSkipReason), which would otherwise collide with log()'s
  // reserved `error` field and get silently rewritten into an errorMessage.
  log('info', { requestId, route: 'lib/intel/pipeline', action: 'sweep_skip_tally', runId, skipTally });
  return result;
}

/**
 * The scheduled/on-demand sweep of prospect organization sites. Returns null
 * (and never touches D1) when INTEL_SWEEP_ENABLED is not exactly 'true', or
 * when the crawl policy (user-agent, operator contact) is incomplete.
 */
export async function runOrgSweep(env: IntelEnv, opts: { limit?: number; runId?: string; requestedBy?: string } = {}): Promise<SweepResult | null> {
  const requestId = crypto.randomUUID();

  if (!isFeatureEnabled(env)) {
    log('info', { requestId, route: 'lib/intel/pipeline', action: 'org_sweep_skipped', reason: 'feature_disabled' });
    return null;
  }

  const policy = policyFromEnv(env);
  if (!policy.userAgent || !policy.operatorContact) {
    log('error', { requestId, route: 'lib/intel/pipeline', action: 'org_sweep_skipped', reason: 'policy_incomplete' });
    return null;
  }

  const db = env.DB;
  const limit = opts.limit ?? DEFAULT_SWEEP_LIMIT;

  const run = await createRun(db, { runType: 'org_sweep', requestedBy: opts.requestedBy, targetsPlanned: 0 });
  log('info', { requestId, route: 'lib/intel/pipeline', action: 'org_sweep_run_created', runId: run.id });

  const problems = validateDefinitions(COMPETITOR_DEFINITIONS);
  if (problems.length > 0) {
    log('error', { requestId, route: 'lib/intel/pipeline', action: 'org_sweep_invalid_definitions', runId: run.id, problemCount: problems.length });
    await markRunStatus(db, run.id, 'failed', { error_code: 'invalid_definitions', started_at: nowIso(), finished_at: nowIso() });
    return { runId: run.id, planned: 0, fetched: 0, skipped: 0, signals: 0, changes: 0, queued: 0, errors: 0 };
  }

  await syncCompetitorCatalog(db, COMPETITOR_DEFINITIONS);

  const targets = await claimSweepTargets(db, limit);
  await markRunStatus(db, run.id, 'running', { started_at: nowIso(), targets_planned: targets.length });
  log('info', { requestId, route: 'lib/intel/pipeline', action: 'org_sweep_started', runId: run.id, planned: targets.length });

  const crawlResult = await crawlTargets(db, run.id, targets, policy, requestId);
  const result: SweepResult = { runId: run.id, planned: targets.length, ...crawlResult };

  await markRunStatus(db, run.id, 'complete', {
    targets_fetched: result.fetched,
    targets_skipped: result.skipped,
    signals_found: result.signals,
    finished_at: nowIso(),
  });
  log('info', { requestId, route: 'lib/intel/pipeline', action: 'org_sweep_finished', ...result });

  return result;
}

/**
 * Executes a run that a human has already approved (intel_runs.status must
 * be 'approved'). No automated or admin-approved path in this subsystem
 * ever fetches a competitor-owned property: this function always runs with
 * the policy exactly as policyFromEnv returns it (allowCompetitorProperties:
 * false). A run whose run_type is 'competitor_property' is accepted and
 * recorded by the propose/approve flow, but is refused here and marked
 * 'failed' with error_code 'competitor_targets_not_implemented' -- there is
 * no reviewed-target-list mechanism yet, so executing it would just
 * re-crawl the ordinary prospect-org queue with the safety block off.
 * Returns null if the run does not exist, is not in 'approved' state, is a
 * 'competitor_property' run, or the crawl policy is incomplete.
 */
export async function runApprovedRun(env: IntelEnv, runId: string): Promise<SweepResult | null> {
  const requestId = crypto.randomUUID();
  const db = env.DB;

  const run = await getRun(db, runId);
  if (!run) {
    log('warn', { requestId, route: 'lib/intel/pipeline', action: 'approved_run_not_found', runId });
    return null;
  }
  if (run.status !== 'approved') {
    log('warn', { requestId, route: 'lib/intel/pipeline', action: 'approved_run_not_ready', runId, status: run.status });
    return null;
  }

  if (run.run_type === 'competitor_property') {
    // No reviewed-target-list mechanism exists yet (see the KNOWN LIMITATION
    // note at the top of this file). Executing this would just re-crawl the
    // ordinary prospect-org queue with the competitor-property block off, so
    // it is accepted and recorded by propose/approve but refused here.
    log('warn', { requestId, route: 'lib/intel/pipeline', action: 'approved_run_competitor_targets_not_implemented', runId });
    await markRunStatus(db, runId, 'failed', { error_code: 'competitor_targets_not_implemented', finished_at: nowIso() });
    return null;
  }

  const policy = policyFromEnv(env);
  if (!policy.userAgent || !policy.operatorContact) {
    log('error', { requestId, route: 'lib/intel/pipeline', action: 'approved_run_skipped', runId, reason: 'policy_incomplete' });
    await markRunStatus(db, runId, 'failed', { error_code: 'policy_incomplete', finished_at: nowIso() });
    return null;
  }

  const problems = validateDefinitions(COMPETITOR_DEFINITIONS);
  if (problems.length > 0) {
    log('error', { requestId, route: 'lib/intel/pipeline', action: 'approved_run_invalid_definitions', runId, problemCount: problems.length });
    await markRunStatus(db, runId, 'failed', { error_code: 'invalid_definitions', finished_at: nowIso() });
    return { runId, planned: run.targets_planned, fetched: 0, skipped: 0, signals: 0, changes: 0, queued: 0, errors: 0 };
  }

  await syncCompetitorCatalog(db, COMPETITOR_DEFINITIONS);
  await markRunStatus(db, runId, 'running', { started_at: nowIso() });
  log('info', { requestId, route: 'lib/intel/pipeline', action: 'approved_run_started', runId });

  const limit = run.targets_planned > 0 ? run.targets_planned : DEFAULT_SWEEP_LIMIT;
  const targets = await claimSweepTargets(db, limit);
  await markRunStatus(db, runId, 'running', { targets_planned: targets.length });

  const crawlResult = await crawlTargets(db, runId, targets, policy, requestId);
  const result: SweepResult = { runId, planned: targets.length, ...crawlResult };

  await markRunStatus(db, runId, 'complete', {
    targets_fetched: result.fetched,
    targets_skipped: result.skipped,
    signals_found: result.signals,
    finished_at: nowIso(),
  });
  log('info', { requestId, route: 'lib/intel/pipeline', action: 'approved_run_finished', ...result });

  return result;
}
