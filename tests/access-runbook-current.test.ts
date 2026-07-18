import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import contract from '../automation/protected-route-contract.json';
import { validateAuthenticatedAccessEvidence } from '../scripts/access-evidence.mjs';

describe('authenticated Access operator runbook', () => {
  it('uses the route contract as the only count authority', async () => {
    const runbook = await readFile(new URL('../coordination/GATE-READINESS-authenticated-access-probe.md', import.meta.url), 'utf8');
    expect(runbook).toContain('only route-count authority');
    expect(runbook).toContain('do not copy a count from this document');
    expect(runbook).not.toMatch(/\b(?:37|38) routes?\b|exactly (?:37|38) items?|(?:37|38)-item/i);
  });

  it('makes a stale operator count fail whenever the contract changes', () => {
    const result = validateAuthenticatedAccessEvidence({
      schema_version: 1, state: 'complete', tokens_retained: false, cookies_retained: false,
      contract_route_count: contract.routes.length - 1,
      observed_at: '2026-07-18T00:00:00Z', allowed_identity_class: 'configured_admin',
      denied_identity_class: 'authenticated_non_admin', evidence_hash: 'a'.repeat(64),
      allowed_results: [], denied_results: [],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(`contract_route_count must be ${contract.routes.length}`);
  });
});
