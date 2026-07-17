import { describe, expect, it } from 'vitest';
import { canTransitionOwnerClaim, canTransitionProposedEdit, validateClaimDecision, validateProposedPatch } from '../src/lib/owner-workflows';

describe('owner claim workflow', () => {
  it('allows forward review paths but no direct draft verification', () => {
    expect(canTransitionOwnerClaim('draft', 'submitted')).toBe(true);
    expect(canTransitionOwnerClaim('draft', 'verified')).toBe(false);
    expect(canTransitionOwnerClaim('verified', 'submitted')).toBe(false);
  });

  it('requires staff, accepted evidence, and reasons for consequential decisions', () => {
    expect(validateClaimDecision({ from: 'under_review', to: 'verified', actorType: 'customer', acceptedEvidenceCount: 1, reasonCode: 'proof' })).toBe('staff_required');
    expect(validateClaimDecision({ from: 'under_review', to: 'verified', actorType: 'staff', acceptedEvidenceCount: 0, reasonCode: 'proof' })).toBe('evidence_required');
    expect(validateClaimDecision({ from: 'under_review', to: 'verified', actorType: 'staff', acceptedEvidenceCount: 1 })).toBe('reason_required');
    expect(validateClaimDecision({ from: 'under_review', to: 'verified', actorType: 'staff', acceptedEvidenceCount: 1, reasonCode: 'domain_control' })).toBe('authorized');
  });

  it('keeps verification revocable and dispute review explicit', () => {
    expect(canTransitionOwnerClaim('verified', 'suspended')).toBe(true);
    expect(canTransitionOwnerClaim('verified', 'disputed')).toBe(true);
    expect(canTransitionOwnerClaim('disputed', 'under_review')).toBe(true);
  });
});

describe('owner proposed edits', () => {
  it('requires review and has conflict/supersession paths', () => {
    expect(canTransitionProposedEdit('draft', 'approved')).toBe(false);
    expect(canTransitionProposedEdit('submitted', 'under_review')).toBe(true);
    expect(canTransitionProposedEdit('under_review', 'conflict')).toBe(true);
    expect(canTransitionProposedEdit('conflict', 'submitted')).toBe(true);
  });

  it('allows only reviewed fields and blocks identity, rank, and commerce fields', () => {
    const allowedFields = new Set(['display_name', 'website_url', 'description', 'registration_url']);
    const immutableFields = new Set(['id', 'organization_id', 'is_verified', 'organic_rank', 'paid_status', 'entitlement']);
    expect(validateProposedPatch({ patch: { display_name: 'Updated camp' }, allowedFields, immutableFields })).toEqual({ valid: true, fields: ['display_name'] });
    expect(validateProposedPatch({ patch: { paid_status: 'active' }, allowedFields, immutableFields })).toEqual({ valid: false, reason: 'immutable_field', field: 'paid_status' });
    expect(validateProposedPatch({ patch: { secret_field: true }, allowedFields, immutableFields })).toEqual({ valid: false, reason: 'unknown_field', field: 'secret_field' });
  });
});
