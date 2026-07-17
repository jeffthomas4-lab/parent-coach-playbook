export type OwnerClaimStatus = 'draft' | 'submitted' | 'evidence_required' | 'under_review' | 'verified' | 'rejected' | 'withdrawn' | 'suspended' | 'disputed';
export type ProposedEditStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'superseded' | 'withdrawn' | 'conflict';

const CLAIM_TRANSITIONS: Record<OwnerClaimStatus, ReadonlySet<OwnerClaimStatus>> = {
  draft: new Set(['submitted', 'withdrawn']),
  submitted: new Set(['evidence_required', 'under_review', 'withdrawn']),
  evidence_required: new Set(['submitted', 'under_review', 'withdrawn']),
  under_review: new Set(['evidence_required', 'verified', 'rejected', 'disputed']),
  verified: new Set(['suspended', 'disputed']),
  rejected: new Set(['submitted']),
  withdrawn: new Set(),
  suspended: new Set(['under_review', 'verified', 'disputed']),
  disputed: new Set(['under_review', 'verified', 'rejected', 'suspended']),
};

const EDIT_TRANSITIONS: Record<ProposedEditStatus, ReadonlySet<ProposedEditStatus>> = {
  draft: new Set(['submitted', 'withdrawn']),
  submitted: new Set(['under_review', 'withdrawn', 'superseded', 'conflict']),
  under_review: new Set(['approved', 'rejected', 'conflict', 'superseded']),
  approved: new Set(), rejected: new Set(), superseded: new Set(), withdrawn: new Set(),
  conflict: new Set(['submitted', 'superseded', 'withdrawn']),
};

export function canTransitionOwnerClaim(from: OwnerClaimStatus, to: OwnerClaimStatus): boolean {
  return CLAIM_TRANSITIONS[from].has(to);
}

export function canTransitionProposedEdit(from: ProposedEditStatus, to: ProposedEditStatus): boolean {
  return EDIT_TRANSITIONS[from].has(to);
}

export function validateClaimDecision(input: {
  from: OwnerClaimStatus;
  to: OwnerClaimStatus;
  actorType: 'customer' | 'staff' | 'system';
  reasonCode?: string;
  acceptedEvidenceCount: number;
}): 'authorized' | 'invalid_transition' | 'staff_required' | 'evidence_required' | 'reason_required' {
  if (!canTransitionOwnerClaim(input.from, input.to)) return 'invalid_transition';
  if (['verified', 'rejected', 'suspended'].includes(input.to) && input.actorType !== 'staff') return 'staff_required';
  if (input.to === 'verified' && input.acceptedEvidenceCount < 1) return 'evidence_required';
  if (['verified', 'rejected', 'suspended', 'disputed'].includes(input.to) && !input.reasonCode?.trim()) return 'reason_required';
  return 'authorized';
}

export function validateProposedPatch(input: {
  patch: Readonly<Record<string, unknown>>;
  allowedFields: ReadonlySet<string>;
  immutableFields: ReadonlySet<string>;
}): { valid: true; fields: string[] } | { valid: false; reason: 'empty' | 'unknown_field' | 'immutable_field'; field?: string } {
  const fields = Object.keys(input.patch).sort();
  if (fields.length === 0) return { valid: false, reason: 'empty' };
  for (const field of fields) {
    if (input.immutableFields.has(field)) return { valid: false, reason: 'immutable_field', field };
    if (!input.allowedFields.has(field)) return { valid: false, reason: 'unknown_field', field };
  }
  return { valid: true, fields };
}
