export const EDITORIAL_STATES = [
  'opportunity_discovered', 'scored', 'classified', 'briefed', 'researching',
  'sourced', 'outlined', 'drafting', 'claims_validated', 'editorial_review',
  'seo_review', 'relationship_mapped', 'approval_ready', 'approved', 'published',
  'monitoring', 'maintenance_due', 'update_proposed', 'consolidation_proposed', 'retired',
] as const;

export type EditorialState = typeof EDITORIAL_STATES[number];
export type CannibalizationDecision = 'update_existing' | 'consolidate' | 'structured_directory' | 'new_url' | 'insufficient_evidence';

const transitions: Record<EditorialState, readonly EditorialState[]> = {
  opportunity_discovered: ['scored'], scored: ['classified'], classified: ['briefed', 'insufficient_evidence' as EditorialState],
  briefed: ['researching'], researching: ['sourced'], sourced: ['outlined'], outlined: ['drafting'], drafting: ['claims_validated'],
  claims_validated: ['editorial_review'], editorial_review: ['seo_review'], seo_review: ['relationship_mapped'], relationship_mapped: ['approval_ready'],
  approval_ready: ['approved'], approved: ['published'], published: ['monitoring'], monitoring: ['maintenance_due', 'update_proposed', 'consolidation_proposed', 'retired'],
  maintenance_due: ['update_proposed', 'retired'], update_proposed: ['researching', 'claims_validated'], consolidation_proposed: ['retired', 'researching'], retired: [],
};

export function canTransition(from: EditorialState, to: EditorialState): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export interface ApprovalEvidence {
  sourceCount: number;
  claimsValidated: boolean;
  editorialReviewed: boolean;
  seoReviewed: boolean;
  relationshipsMapped: boolean;
  humanApproved: boolean;
  hasFlags: boolean;
}

export function approvalGates(e: ApprovalEvidence): { ok: boolean; missing: string[] } {
  const checks: [boolean, string][] = [
    [e.sourceCount > 0, 'at least one reviewed source'], [e.claimsValidated, 'claim validation'],
    [e.editorialReviewed, 'editorial review'], [e.seoReviewed, 'SEO/AI review'],
    [e.relationshipsMapped, 'internal relationship mapping'], [e.humanApproved, 'Jeff/human approval'],
    [!e.hasFlags, 'no unresolved safety/IP/sensitivity flags'],
  ];
  const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
  return { ok: missing.length === 0, missing };
}

export function chooseCannibalizationDecision(args: { existingMatch: boolean; distinctIntent: boolean; structuredDirectoryFit: boolean; evidenceSufficient: boolean }): CannibalizationDecision {
  if (!args.evidenceSufficient) return 'insufficient_evidence';
  if (args.existingMatch && !args.distinctIntent) return 'consolidate';
  if (args.existingMatch) return 'update_existing';
  if (args.structuredDirectoryFit) return 'structured_directory';
  return 'new_url';
}
