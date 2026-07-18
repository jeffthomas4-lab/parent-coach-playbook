import { describe, expect, it } from 'vitest';
import pending from '../coordination/release-evidence/agent-token-rollout-pending.json';
import { EXPECTED_TASK_IDS, validateAgentTokenRolloutEvidence } from '../scripts/agent-token-rollout-evidence.mjs';

describe('agent token rollout evidence', () => {
  it('accepts the redacted pending packet without claiming runtime proof', () => {
    expect(EXPECTED_TASK_IDS).toHaveLength(10);
    expect(validateAgentTokenRolloutEvidence(pending)).toEqual({ errors: [], valid: true, complete: false });
  });

  it('requires Nora canary receipts, every caller, and revocation ordering', () => {
    const complete = {
      ...pending, state: 'complete', observed_at: '2026-07-18T00:00:00Z', preflight_status: 204,
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
