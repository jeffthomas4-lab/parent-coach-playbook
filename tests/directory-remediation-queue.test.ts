import { describe, expect, it } from 'vitest';
import queue from '../coordination/directory-remediation-queue-2026-07-16.json';

describe('directory remediation queue', () => {
  it('is proposal-only and contains no executable mutation payload', () => {
    expect(queue.status).toBe('proposal_only');
    expect(queue.production_writes_authorized).toBe(false);
    expect(queue.items.length).toBeGreaterThan(0);
    const serialized = JSON.stringify(queue).toLowerCase();
    expect(serialized).not.toContain('update programs');
    expect(serialized).not.toContain('delete from');
    expect(serialized).not.toContain('insert into');
  });

  it('gives every discrepancy a bounded identity, priority, evidence statement, proposal and official HTTPS source', () => {
    for (const item of queue.items) {
      expect(item.program_id).toMatch(/^[a-z0-9-]+$/);
      expect(['stop_ship', 'high', 'medium', 'low']).toContain(item.priority);
      expect(item.finding.length).toBeGreaterThan(20);
      expect(item.proposal.length).toBeGreaterThan(20);
      expect(new URL(item.source_url).protocol).toBe('https:');
      expect(['customer_harm_correction', 'stale_or_inferred_fact', 'material_fact_not_reproduced', 'source_inaccessible', 'transformation_policy']).toContain(item.action_class);
      expect(['approve_reverification_and_bounded_correction_proposal', 'approve_investigation_only', 'approve_policy_review_only']).toContain(item.recommended_decision);
    }
  });

  it('does not confuse investigation or policy review with record mutation authority', () => {
    expect(queue.approval_scope).toContain('not approval to mutate D1');
    const nonCorrection = queue.items.filter((item) => item.recommended_decision !== 'approve_reverification_and_bounded_correction_proposal');
    expect(nonCorrection.length).toBeGreaterThan(0);
    expect(nonCorrection.every((item) => item.recommended_decision.endsWith('_only'))).toBe(true);
  });
});
