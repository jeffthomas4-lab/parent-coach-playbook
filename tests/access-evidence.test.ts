import { describe, expect, it } from 'vitest';
import policy from '../coordination/release-evidence/access-policy-export-pending.json';
import probes from '../coordination/release-evidence/authenticated-access-probes-pending.json';
import { validateAccessPolicyEvidence, validateAuthenticatedAccessEvidence } from '../scripts/access-evidence.mjs';

describe('live Access evidence contracts', () => {
  it('accepts the exported policy packet and complete authenticated probes', () => {
    expect(validateAccessPolicyEvidence(policy)).toEqual({ errors: [], valid: true, complete: true });
    expect(validateAuthenticatedAccessEvidence(probes)).toEqual({ errors: [], valid: true, complete: true });
  });

  it('rejects an exported allow-everyone policy or missing API coverage', () => {
    const exported: any = {
      ...policy, state: 'exported', exported_at: '2026-07-16T14:00:00Z',
      team_domain: policy.expected_team_domain, audience_tag: policy.expected_audience_tag,
      export_method: 'read-only-api', export_hash: 'a'.repeat(64),
      applications: [{ domain: 'parentcoachdesk.com', paths: ['/admin*'], policies: [{ decision: 'allow', include_everyone: true, include_selector_count: 1 }] }],
    };
    expect(validateAccessPolicyEvidence(exported).errors).toEqual(expect.arrayContaining([
      'Access export does not cover /api/admin*', 'allow-everyone policy is prohibited',
    ]));
  });

  it('requires full allowed and denied route coverage without mutation', () => {
    const complete: any = {
      ...probes, state: 'complete', observed_at: '2026-07-16T14:00:00Z',
      allowed_identity_class: 'configured_admin', denied_identity_class: 'authenticated_non_admin',
      evidence_hash: 'b'.repeat(64), allowed_results: [], denied_results: [],
    };
    expect(validateAuthenticatedAccessEvidence(complete).errors).toEqual(expect.arrayContaining([
      'allowed_results must cover all 60 routes', 'denied_results must cover all 60 routes',
    ]));
  });
});
