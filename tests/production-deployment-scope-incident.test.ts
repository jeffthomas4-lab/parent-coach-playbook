import { describe, expect, it } from 'vitest';
import incident from '../coordination/release-evidence/production-deployment-scope-incident-2026-07-17.json';
import packet from '../coordination/release-evidence/rc01.json';

describe('production deployment scope incident receipt', () => {
  it('records containment without overstating what the short-lived version proves', () => {
    expect(incident.actual_target).toBe('parent-coach-desk');
    expect(incident.intended_target).toBe('parent-coach-desk-staging');
    expect(incident.unintended_version).not.toBe(incident.approved_restored_version);
    expect(incident.limitations.join(' ')).toContain('does not prove that no third-party request reached');
    expect(incident.runtime_controls_observed_on_unintended_version).toMatchObject({
      TRUST_INTAKE_ENABLED: 'false',
      PCD_CUSTOMER_FOUNDATION_ENABLED: 'false',
    });
  });

  it('keeps the incident as an open release-risk decision', () => {
    expect(packet.gates.open_risk_decision.state).toBe('pending');
    expect(packet.gates.open_risk_decision.evidence).toContain(
      'coordination/release-evidence/production-deployment-scope-incident-2026-07-17.json',
    );
  });
});
