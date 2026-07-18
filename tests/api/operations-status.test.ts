import { describe, expect, it } from 'vitest';
import { readOperationsStatus } from '../../src/lib/operations-status';

const db = (answers: Array<Record<string, unknown>>) => ({
  prepare() {
    const answer = answers.shift();
    return { first: async () => answer };
  },
}) as unknown as D1Database;

describe('operations status', () => {
  it('keeps unproven scheduler and external monitoring states unknown', async () => {
    const rows = await readOperationsStatus({}, new Date('2026-07-16T00:00:00.000Z'));
    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ component: 'Scheduler execution freshness', state: 'unknown', code: 'forge_binding_missing' }),
      expect.objectContaining({ component: 'Independent customer journey monitor', state: 'unknown', code: 'external_monitor_evidence_missing' }),
      expect.objectContaining({ component: 'PCD agent runtime', state: 'unknown', code: 'forge_binding_missing' }),
      expect.objectContaining({ component: 'Support notification delivery', state: 'failing', code: 'notification_path_not_configured' }),
    ]));
  });

  it('never calls notification readiness healthy from configuration alone', async () => {
    const rows = await readOperationsStatus({
      EMAIL_MODE: 'send', EMAIL_ADMIN_MODE: 'send',
      RESEND_API_KEY: 'configured', EMAIL_FROM: 'PCD <support@example.com>',
      SLACK_WEBHOOK_URL: 'configured',
    });
    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ component: 'Support notification delivery', state: 'unknown', code: 'notification_delivery_unproven' }),
    ]));
  });

  it('treats internal send mode as failing until both email and Slack are configured', async () => {
    const rows = await readOperationsStatus({
      EMAIL_MODE: 'stage', EMAIL_ADMIN_MODE: 'send',
      RESEND_API_KEY: 'configured', EMAIL_FROM: 'PCD <support@example.com>',
    });
    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ component: 'Support notification delivery', state: 'failing', code: 'notification_path_not_configured' }),
    ]));
  });

  it('distinguishes healthy supply, stale sweeps, and failing agent runs', async () => {
    const rows = await readOperationsStatus({
      DB: db([
        { n: 25 },
        { approved_records: 25, never_checked: 2, last_checked_at: '2026-07-14T00:00:00.000Z' },
        { approved: 25, age_missing: 2, age_impossible: 0, dates_missing: 0, dates_reversed: 0, negative_price: 0, registration_url_missing: 0, registration_url_non_https: 0, source_domain_missing: 0, verified_without_timestamp: 0, verified_with_evidence: 10, distinct_source_domains: 7, oldest_verified_at: '2026-07-01T00:00:00Z', latest_verified_at: '2026-07-15T00:00:00Z', url_never_checked: 2 },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
      ]),
      PCD_OPS_DB: db([{ active: 3, overdue: 0, due_72h: 2, urgent: 0, oldest_submitted_at: '2026-07-14T00:00:00.000Z', resolved_correction_cases: 5, corrections_applied: 4, latest_correction_resolved_at: '2026-07-15T00:00:00Z' }]),
      FORGE_DB: db([
        { registered: 7, paused: 0, latest_run_at: '2026-07-15T12:00:00.000Z' },
        { failures_24h: 1, needs_you_7d: 2, unfinished_over_1h: 0 },
        { status: 'succeeded', result_code: 'sweep_completed', started_at: '2026-07-15T13:00:00.000Z', finished_at: '2026-07-15T13:05:00.000Z' },
      ]),
    }, new Date('2026-07-16T00:00:00.000Z'));

    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ component: 'Public directory supply', state: 'healthy' }),
      expect.objectContaining({ component: 'Directory URL freshness', state: 'degraded', code: 'url_checks_stale' }),
      expect.objectContaining({ component: 'Directory data quality', state: 'degraded', code: 'approved_data_incomplete' }),
      expect.objectContaining({ component: 'Directory data quality', metrics: expect.objectContaining({ verified_with_evidence: 10, verification_coverage_percent: 40, distinct_source_domains: 7, latest_verified_at: '2026-07-15T00:00:00Z', verification_confidence_basis: expect.stringContaining('recorded human review') }) }),
      expect.objectContaining({ component: 'Trust and rights case SLA', state: 'degraded', code: 'trust_cases_due_soon', metrics: expect.objectContaining({ resolved_correction_cases: 5, corrections_applied: 4, latest_correction_resolved_at: '2026-07-15T00:00:00Z' }) }),
      expect.objectContaining({ component: 'PCD agent runtime', state: 'failing', code: 'recent_agent_failures' }),
      expect.objectContaining({ component: 'Scheduler execution freshness', state: 'healthy', code: 'scheduler_attempt_recent' }),
    ]));
  });

  it('fails closed to unknown when operational queries fail', async () => {
    const broken = { prepare() { return { first: async () => { throw new Error('private provider detail'); } }; } } as unknown as D1Database;
    const rows = await readOperationsStatus({ DB: broken, PCD_OPS_DB: broken, FORGE_DB: broken });
    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ component: 'Public directory supply', state: 'unknown', code: 'supply_query_failed' }),
      expect.objectContaining({ component: 'Directory data quality', state: 'unknown', code: 'quality_query_failed' }),
      expect.objectContaining({ component: 'Trust and rights case SLA', state: 'unknown', code: 'trust_case_query_failed' }),
      expect.objectContaining({ component: 'PCD agent runtime', state: 'unknown', code: 'agent_query_failed' }),
    ]));
    expect(JSON.stringify(rows)).not.toContain('private provider detail');
  });

  it('fails directory quality on impossible approved facts', async () => {
    const rows = await readOperationsStatus({
      DB: db([
        { n: 1 },
        { approved_records: 1, never_checked: 0, last_checked_at: '2026-07-16T00:00:00.000Z' },
        { approved: 1, age_missing: 0, age_impossible: 1, dates_missing: 0, dates_reversed: 0, negative_price: 0, registration_url_missing: 0, registration_url_non_https: 0, source_domain_missing: 0, verified_without_timestamp: 0, url_never_checked: 0 },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
      ]),
      PCD_OPS_DB: db([{ active: 1, overdue: 1, due_72h: 0, urgent: 0, oldest_submitted_at: '2026-06-01T00:00:00.000Z' }]),
    }, new Date('2026-07-16T01:00:00.000Z'));
    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ component: 'Directory data quality', state: 'failing', code: 'invalid_approved_data' }),
      expect.objectContaining({ component: 'Trust and rights case SLA', state: 'failing', code: 'trust_cases_overdue' }),
    ]));
  });

  it('fails the moderation component when queue age or volume exceeds shutdown thresholds', async () => {
    const rows = await readOperationsStatus({
      DB: db([
        { n: 1 },
        { approved_records: 1, never_checked: 0, last_checked_at: '2026-07-16T00:00:00.000Z' },
        { approved: 1 },
        { pending: 101, oldest: '2026-07-15T00:00:00.000Z' },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
        { pending: 0, oldest: null },
      ]),
      PCD_OPS_DB: db([{ active: 0, overdue: 0, due_72h: 0, urgent: 0, oldest_submitted_at: null }]),
    }, new Date('2026-07-16T01:00:00.000Z'));
    expect(rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ component: 'Public moderation backlog', state: 'failing', code: 'moderation_capacity_exceeded' }),
    ]));
  });
});
