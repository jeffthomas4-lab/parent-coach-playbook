import { describe, expect, it } from 'vitest';
import pending from '../coordination/release-evidence/agent-token-rollout-pending.json';
import { EXPECTED_TASK_IDS, validateAgentTokenRolloutEvidence } from '../scripts/agent-token-rollout-evidence.mjs';

describe('agent token rollout evidence', () => {
  // The caller count is derived from the governed table in
  // automation/TASK-RUN-LOG-RECONCILIATION.md, so it moves whenever a task is
  // added to the inventory. It was hardcoded to 10 and went red on 2026-08-02
  // when commit 2464fbb7 added an eleventh row (pcd-freshness-audit); nobody
  // noticed because the only consumer of a red suite is an agent that aborts
  // silently. Assert the relationship, not the number.
  it('accepts the redacted pending packet without claiming runtime proof', () => {
    expect(EXPECTED_TASK_IDS.length).toBeGreaterThan(0);
    expect(new Set(EXPECTED_TASK_IDS).size).toBe(EXPECTED_TASK_IDS.length);
    expect(pending.expected_caller_count).toBe(EXPECTED_TASK_IDS.length);
    expect(validateAgentTokenRolloutEvidence(pending)).toEqual({ errors: [], valid: true, complete: false });
  });

  it('requires Nora canary receipts, every caller, and revocation ordering', () => {
    const complete = {
      ...pending, state: 'complete', observed_at: '2026-07-18T00:00:00Z', preflight_status: 204,
      expected_caller_count: EXPECTED_TASK_IDS.length,
      canary_start_ref: 'run-redacted-start', canary_finish_ref: 'run-redacted-finish',
      canary_failure_ref: 'run-redacted-controlled-failure', reconciled_task_ids: EXPECTED_TASK_IDS,
      prior_credential_revoked: true, evidence_hash: 'a'.repeat(64),
    };
    expect(validateAgentTokenRolloutEvidence(complete)).toEqual({ errors: [], valid: true, complete: true });
    expect(validateAgentTokenRolloutEvidence({ ...complete, reconciled_task_ids: EXPECTED_TASK_IDS.slice(1), prior_credential_revoked: false }).complete).toBe(false);
  });

  it('rejects credential material and incoherent rollback evidence', () => {
    expect(validateAgentTokenRolloutEvidence({ ...pending, notes: 'Authorization: Bearer abcdefghijklmnop' }).errors)
      .toContain('packet appears to contain credential material');
    expect(validateAgentTokenRolloutEvidence({ ...pending, state: 'rolled_back', rollback_ref: null, prior_credential_revoked: true }).errors)
      .toEqual(expect.arrayContaining(['rolled_back state requires rollback_ref', 'rolled_back state must preserve the prior credential']));
  });
});
