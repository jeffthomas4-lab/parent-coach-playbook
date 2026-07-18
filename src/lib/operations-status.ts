export type OperationalState = 'healthy' | 'degraded' | 'failing' | 'unknown';

export interface OperationalComponent {
  component: string;
  state: OperationalState;
  code: string;
  summary: string;
  observedAt: string;
  metrics: Record<string, number | string | null>;
}

const result = (component: string, state: OperationalState, code: string, summary: string, observedAt: string, metrics: OperationalComponent['metrics'] = {}): OperationalComponent =>
  ({ component, state, code, summary, observedAt, metrics });

export async function readOperationsStatus(env: {
  DB?: D1Database; PCD_OPS_DB?: D1Database; FORGE_DB?: D1Database;
  EMAIL_MODE?: string; EMAIL_ADMIN_MODE?: string;
  RESEND_API_KEY?: string; EMAIL_FROM?: string; SLACK_WEBHOOK_URL?: string;
}, now = new Date()): Promise<OperationalComponent[]> {
  const observedAt = now.toISOString();
  const components: OperationalComponent[] = [];

  if (!env.DB) {
    components.push(result('Public directory supply', 'unknown', 'db_binding_missing', 'Directory state cannot be measured.', observedAt));
    components.push(result('Directory URL freshness', 'unknown', 'db_binding_missing', 'URL-sweep freshness cannot be measured.', observedAt));
    components.push(result('Directory data quality', 'unknown', 'db_binding_missing', 'Directory quality cannot be measured.', observedAt));
  } else {
    try {
      const supply = await env.DB.prepare(
        `SELECT COUNT(*) AS n FROM programs
          WHERE pcd_status = 'approved' AND session_end_date >= date('now')`,
      ).first<{ n: number }>();
      const count = Number(supply?.n ?? 0);
      components.push(result('Public directory supply', count > 0 ? 'healthy' : 'failing', count > 0 ? 'approved_supply_present' : 'approved_supply_blackout', count > 0 ? 'Approved current or future programs are available.' : 'No approved current or future programs were found.', observedAt, { approved_current_or_future: count }));
    } catch {
      components.push(result('Public directory supply', 'unknown', 'supply_query_failed', 'Directory state query failed.', observedAt));
    }

    try {
      const freshness = await env.DB.prepare(
        `SELECT COUNT(*) AS approved_records,
                SUM(CASE WHEN url_last_checked_at IS NULL THEN 1 ELSE 0 END) AS never_checked,
                MAX(url_last_checked_at) AS last_checked_at
           FROM programs WHERE pcd_status = 'approved'`,
      ).first<{ approved_records: number; never_checked: number; last_checked_at: string | null }>();
      const last = freshness?.last_checked_at ? Date.parse(freshness.last_checked_at) : NaN;
      const ageHours = Number.isFinite(last) ? Math.round((now.getTime() - last) / 3_600_000) : null;
      const state: OperationalState = ageHours === null ? 'unknown' : ageHours > 36 ? 'degraded' : 'healthy';
      components.push(result('Directory URL freshness', state, ageHours === null ? 'no_completed_url_checks' : ageHours > 36 ? 'url_checks_stale' : 'url_checks_recent', ageHours === null ? 'No completed URL-check timestamp is available.' : ageHours > 36 ? 'Latest URL check is older than the daily-sweep tolerance.' : 'Latest URL check is within the daily-sweep tolerance.', observedAt, { approved_records: Number(freshness?.approved_records ?? 0), never_checked: Number(freshness?.never_checked ?? 0), last_checked_at: freshness?.last_checked_at ?? null, age_hours: ageHours }));
    } catch {
      components.push(result('Directory URL freshness', 'unknown', 'freshness_query_failed', 'URL freshness query failed.', observedAt));
    }

    try {
      const quality = await env.DB.prepare(
        `SELECT COUNT(*) AS approved,
                SUM(CASE WHEN age_min IS NULL OR age_max IS NULL THEN 1 ELSE 0 END) AS age_missing,
                SUM(CASE WHEN age_min < 0 OR age_max > 25 OR age_min > age_max THEN 1 ELSE 0 END) AS age_impossible,
                SUM(CASE WHEN session_start_date IS NULL OR session_end_date IS NULL THEN 1 ELSE 0 END) AS dates_missing,
                SUM(CASE WHEN session_start_date > session_end_date THEN 1 ELSE 0 END) AS dates_reversed,
                SUM(CASE WHEN price < 0 THEN 1 ELSE 0 END) AS negative_price,
                SUM(CASE WHEN registration_url IS NULL OR trim(registration_url) = '' THEN 1 ELSE 0 END) AS registration_url_missing,
                SUM(CASE WHEN registration_url IS NOT NULL AND lower(registration_url) NOT LIKE 'https://%' THEN 1 ELSE 0 END) AS registration_url_non_https,
                SUM(CASE WHEN source_domain IS NULL OR trim(source_domain) = '' THEN 1 ELSE 0 END) AS source_domain_missing,
                SUM(CASE WHEN verified = 1 AND last_verified_at IS NULL THEN 1 ELSE 0 END) AS verified_without_timestamp,
                SUM(CASE WHEN verified = 1 AND last_verified_at IS NOT NULL THEN 1 ELSE 0 END) AS verified_with_evidence,
                COUNT(DISTINCT CASE WHEN source_domain IS NOT NULL AND trim(source_domain) <> '' THEN lower(trim(source_domain)) END) AS distinct_source_domains,
                MIN(CASE WHEN verified = 1 THEN last_verified_at END) AS oldest_verified_at,
                MAX(CASE WHEN verified = 1 THEN last_verified_at END) AS latest_verified_at,
                SUM(CASE WHEN url_last_checked_at IS NULL THEN 1 ELSE 0 END) AS url_never_checked
           FROM programs WHERE pcd_status = 'approved'`,
      ).first<Record<string, number | string | null>>();
      const metric = (name: string) => Number(quality?.[name] ?? 0);
      const critical = metric('age_impossible') + metric('dates_reversed') + metric('negative_price') + metric('verified_without_timestamp');
      const incomplete = metric('age_missing') + metric('dates_missing') + metric('registration_url_missing') + metric('registration_url_non_https') + metric('source_domain_missing') + metric('url_never_checked');
      const approved = metric('approved');
      const verifiedWithEvidence = metric('verified_with_evidence');
      const verificationCoveragePercent = approved > 0 ? Math.round((verifiedWithEvidence / approved) * 1000) / 10 : 0;
      const state: OperationalState = critical > 0 ? 'failing' : incomplete > 0 ? 'degraded' : 'healthy';
      components.push(result('Directory data quality', state, critical > 0 ? 'invalid_approved_data' : incomplete > 0 ? 'approved_data_incomplete' : 'approved_data_contract_passed', critical > 0 ? 'Approved listings contain impossible or unsupported truth claims.' : incomplete > 0 ? 'Approved listings have material completeness or freshness gaps.' : 'Approved listings pass the aggregate quality contract.', observedAt, {
        approved, age_missing: metric('age_missing'), age_impossible: metric('age_impossible'), dates_missing: metric('dates_missing'), dates_reversed: metric('dates_reversed'), negative_price: metric('negative_price'), registration_url_missing: metric('registration_url_missing'), registration_url_non_https: metric('registration_url_non_https'), source_domain_missing: metric('source_domain_missing'), verified_without_timestamp: metric('verified_without_timestamp'), url_never_checked: metric('url_never_checked'),
        verified_with_evidence: verifiedWithEvidence,
        verification_coverage_percent: verificationCoveragePercent,
        distinct_source_domains: metric('distinct_source_domains'),
        oldest_verified_at: (quality?.oldest_verified_at as string | null | undefined) ?? null,
        latest_verified_at: (quality?.latest_verified_at as string | null | undefined) ?? null,
        verification_confidence_basis: 'approved + HTTPS source + recorded human review',
      }));
    } catch {
      components.push(result('Directory data quality', 'unknown', 'quality_query_failed', 'Directory quality query failed.', observedAt));
    }

    try {
      const queueQueries = [
        ['camp_submissions', `SELECT COUNT(*) AS pending, MIN(COALESCE(submitted_at, created_at)) AS oldest FROM programs WHERE pcd_status = 'pending' OR awaiting_review = 1`],
        ['organization_suggestions', `SELECT COUNT(*) AS pending, MIN(submitted_at) AS oldest FROM org_suggestions WHERE status = 'pending'`],
        ['camp_claims', `SELECT COUNT(*) AS pending, MIN(submitted_at) AS oldest FROM camp_claims WHERE status = 'pending'`],
        ['camp_reviews', `SELECT COUNT(*) AS pending, MIN(submitted_at) AS oldest FROM camp_reviews WHERE status = 'pending'`],
      ] as const;
      const metrics: Record<string, number | string | null> = {};
      let failing = false;
      let degraded = false;
      for (const [name, sql] of queueQueries) {
        const row = await env.DB.prepare(sql).first<{ pending: number; oldest: string | null }>();
        const count = Number(row?.pending ?? 0);
        const oldestAgeDays = row?.oldest ? Math.max(0, Math.floor((now.getTime() - Date.parse(row.oldest)) / 86_400_000)) : null;
        metrics[`${name}_pending`] = count;
        metrics[`${name}_oldest_days`] = oldestAgeDays;
        const failThreshold = name === 'organization_suggestions' ? count > 200 || (oldestAgeDays ?? 0) > 30 : count > 100 || (oldestAgeDays ?? 0) > 7;
        const degradeThreshold = name === 'organization_suggestions' ? count > 50 || (oldestAgeDays ?? 0) > 7 : count > 25 || (oldestAgeDays ?? 0) > 2;
        failing ||= failThreshold;
        degraded ||= degradeThreshold;
      }
      components.push(result(
        'Public moderation backlog',
        failing ? 'failing' : degraded ? 'degraded' : 'healthy',
        failing ? 'moderation_capacity_exceeded' : degraded ? 'moderation_backlog_attention' : 'moderation_backlog_within_threshold',
        failing ? 'One or more intake queues exceed the shutdown threshold.' : degraded ? 'One or more intake queues require operator attention.' : 'Moderation queues are within the local operating threshold.',
        observedAt,
        metrics,
      ));
    } catch {
      components.push(result('Public moderation backlog', 'unknown', 'moderation_backlog_query_failed', 'One or more moderation queues cannot be measured.', observedAt));
    }
  }

  if (!env.PCD_OPS_DB) {
    components.push(result('Trust and rights case SLA', 'unknown', 'pcd_ops_binding_missing', 'Trust-case aging cannot be measured.', observedAt));
  } else {
    try {
      const cases = await env.PCD_OPS_DB.prepare(
        `SELECT SUM(CASE WHEN status IN ('open', 'in_review') THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN status IN ('open', 'in_review') AND datetime(due_at) < datetime('now') THEN 1 ELSE 0 END) AS overdue,
                SUM(CASE WHEN status IN ('open', 'in_review') AND datetime(due_at) >= datetime('now') AND datetime(due_at) < datetime('now', '+72 hours') THEN 1 ELSE 0 END) AS due_72h,
                SUM(CASE WHEN status IN ('open', 'in_review') AND priority = 'urgent' THEN 1 ELSE 0 END) AS urgent,
                MIN(CASE WHEN status IN ('open', 'in_review') THEN submitted_at END) AS oldest_submitted_at,
                SUM(CASE WHEN category = 'listing_correction' AND status IN ('resolved', 'closed') THEN 1 ELSE 0 END) AS resolved_correction_cases,
                SUM(CASE WHEN category = 'listing_correction' AND resolution_code = 'corrected' THEN 1 ELSE 0 END) AS corrections_applied,
                MAX(CASE WHEN category = 'listing_correction' AND status IN ('resolved', 'closed') THEN resolved_at END) AS latest_correction_resolved_at
           FROM trust_cases`,
      ).first<{ active: number; overdue: number; due_72h: number; urgent: number; oldest_submitted_at: string | null; resolved_correction_cases: number; corrections_applied: number; latest_correction_resolved_at: string | null }>();
      const active = Number(cases?.active ?? 0);
      const overdueCount = Number(cases?.overdue ?? 0);
      const dueSoon = Number(cases?.due_72h ?? 0);
      const urgent = Number(cases?.urgent ?? 0);
      const state: OperationalState = overdueCount > 0 ? 'failing' : urgent > 0 || dueSoon > 0 ? 'degraded' : 'healthy';
      components.push(result('Trust and rights case SLA', state, overdueCount > 0 ? 'trust_cases_overdue' : urgent > 0 ? 'urgent_trust_cases_open' : dueSoon > 0 ? 'trust_cases_due_soon' : 'trust_case_sla_clear', overdueCount > 0 ? 'One or more trust or rights cases are overdue.' : urgent > 0 || dueSoon > 0 ? 'Urgent or near-due trust cases require attention.' : 'No active trust case is urgent, near due, or overdue.', observedAt, {
        active, overdue: overdueCount, due_72h: dueSoon, urgent,
        oldest_submitted_at: cases?.oldest_submitted_at ?? null,
        resolved_correction_cases: Number(cases?.resolved_correction_cases ?? 0),
        corrections_applied: Number(cases?.corrections_applied ?? 0),
        latest_correction_resolved_at: cases?.latest_correction_resolved_at ?? null,
      }));
    } catch {
      components.push(result('Trust and rights case SLA', 'unknown', 'trust_case_query_failed', 'Trust-case aging query failed or the operational schema is not live.', observedAt));
    }
  }

  if (!env.FORGE_DB) {
    components.push(result('PCD agent runtime', 'unknown', 'forge_binding_missing', 'Forge Command state cannot be measured.', observedAt));
    components.push(result('Scheduler execution freshness', 'unknown', 'forge_binding_missing', 'Scheduler attempts cannot be measured.', observedAt));
  } else {
    try {
      const agents = await env.FORGE_DB.prepare(
        `SELECT COUNT(*) AS registered,
                SUM(CASE WHEN status = 'paused' THEN 1 ELSE 0 END) AS paused,
                MAX(last_run_at) AS latest_run_at
           FROM agent_registry WHERE venture = 'pcd'`,
      ).first<{ registered: number; paused: number; latest_run_at: string | null }>();
      const runs = await env.FORGE_DB.prepare(
        `SELECT SUM(CASE WHEN status = 'failed' AND COALESCE(finished_at, started_at) >= datetime('now', '-24 hours') THEN 1 ELSE 0 END) AS failures_24h,
                SUM(CASE WHEN needs_you = 1 AND COALESCE(finished_at, started_at) >= datetime('now', '-7 days') THEN 1 ELSE 0 END) AS needs_you_7d,
                SUM(CASE WHEN finished_at IS NULL AND started_at < datetime('now', '-1 hour') THEN 1 ELSE 0 END) AS unfinished_over_1h
           FROM agent_runs WHERE venture = 'pcd'`,
      ).first<{ failures_24h: number; needs_you_7d: number; unfinished_over_1h: number }>();
      const registered = Number(agents?.registered ?? 0);
      const paused = Number(agents?.paused ?? 0);
      const failures = Number(runs?.failures_24h ?? 0);
      const unfinished = Number(runs?.unfinished_over_1h ?? 0);
      const state: OperationalState = registered === 0 ? 'unknown' : failures > 0 || unfinished > 0 ? 'failing' : paused > 0 ? 'degraded' : 'healthy';
      components.push(result('PCD agent runtime', state, registered === 0 ? 'no_registered_agents' : failures > 0 ? 'recent_agent_failures' : unfinished > 0 ? 'unfinished_agent_runs' : paused > 0 ? 'agents_paused' : 'recorded_runs_nominal', registered === 0 ? 'No PCD registry rows are visible.' : failures > 0 || unfinished > 0 ? 'Recent failures or unfinished runs require attention.' : paused > 0 ? 'One or more PCD agents are paused.' : 'Registered PCD agents have no detected failure condition.', observedAt, { registered, paused, failures_24h: failures, needs_you_7d: Number(runs?.needs_you_7d ?? 0), unfinished_over_1h: unfinished, latest_run_at: agents?.latest_run_at ?? null }));
    } catch {
      components.push(result('PCD agent runtime', 'unknown', 'agent_query_failed', 'Agent runtime query failed.', observedAt));
    }

    try {
      const attempt = await env.FORGE_DB.prepare(
        `SELECT status, result_code, started_at, finished_at
           FROM scheduler_attempts
          WHERE venture = 'pcd' AND workflow_id = 'pcd-camps-sweep'
          ORDER BY started_at DESC LIMIT 1`,
      ).first<{ status: string; result_code: string | null; started_at: string; finished_at: string | null }>();
      if (!attempt) {
        components.push(result('Scheduler execution freshness', 'unknown', 'no_scheduler_attempts', 'No scheduler attempt has been recorded.', observedAt));
      } else {
        const timestamp = attempt.finished_at ?? attempt.started_at;
        const ageHours = Math.round((now.getTime() - Date.parse(timestamp)) / 3_600_000);
        const stuck = attempt.status === 'running' && ageHours > 1;
        const stale = attempt.status === 'succeeded' && ageHours > 36;
        const state: OperationalState = attempt.status === 'failed' || stuck ? 'failing' : stale ? 'degraded' : attempt.status === 'succeeded' ? 'healthy' : 'unknown';
        const code = attempt.status === 'failed' ? 'latest_scheduler_attempt_failed' : stuck ? 'scheduler_attempt_stuck' : stale ? 'scheduler_attempt_stale' : attempt.status === 'succeeded' ? 'scheduler_attempt_recent' : 'scheduler_attempt_running';
        components.push(result('Scheduler execution freshness', state, code, state === 'healthy' ? 'Latest scheduled sweep completed within tolerance.' : state === 'degraded' ? 'Latest successful scheduled sweep is stale.' : state === 'failing' ? 'Latest scheduled sweep failed or is stuck.' : 'A scheduled sweep is currently running.', observedAt, { status: attempt.status, result_code: attempt.result_code, last_attempt_at: timestamp, age_hours: ageHours }));
      }
    } catch {
      components.push(result('Scheduler execution freshness', 'unknown', 'scheduler_query_failed', 'Scheduler attempt query failed.', observedAt));
    }
  }

  const outboundMode = env.EMAIL_MODE?.toLowerCase() === 'send' ? 'send' : 'stage';
  const internalMode = env.EMAIL_ADMIN_MODE?.toLowerCase() === 'send' ? 'send' : 'stage';
  const providerConfigured = Boolean(env.RESEND_API_KEY && env.EMAIL_FROM);
  const stagingConfigured = Boolean(env.SLACK_WEBHOOK_URL);
  const outboundBroken = outboundMode === 'send' ? !providerConfigured : !stagingConfigured;
  // Internal alerts are intentionally dual-channel: send mode requires both
  // Resend (email) and Slack (the privacy-safe operator signal).
  const internalBroken = internalMode === 'send' ? !providerConfigured || !stagingConfigured : !stagingConfigured;
  components.push(result(
    'Support notification delivery',
    outboundBroken || internalBroken ? 'failing' : 'unknown',
    outboundBroken || internalBroken ? 'notification_path_not_configured' : 'notification_delivery_unproven',
    outboundBroken || internalBroken
      ? 'One or more configured notification modes lack their required delivery path.'
      : 'Configuration exists, but no durable receipt or human alert-delivery drill proves delivery.',
    observedAt,
    { outbound_mode: outboundMode, internal_mode: internalMode, provider_configured: providerConfigured ? 1 : 0, staging_configured: stagingConfigured ? 1 : 0 },
  ));

  // Neither health endpoints nor console logs prove that a daily invocation
  // happened or that an alert reached a person. Keep these unknown until a
  // durable attempt ledger and independent monitor are implemented and live.
  components.push(result('Independent customer journey monitor', 'unknown', 'external_monitor_evidence_missing', 'No repository evidence proves an independent synthetic and alert-delivery path.', observedAt));
  return components;
}
