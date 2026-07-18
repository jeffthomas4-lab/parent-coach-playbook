export type RelationshipStage = 'identified' | 'researched' | 'draft_ready' | 'outreach_approved' | 'contacted' | 'active' | 'paused' | 'declined' | 'do_not_contact';

export interface RelationshipRecord {
  id: string;
  organization_name: string;
  relationship_type: 'governing_body' | 'league' | 'camp_operator' | 'media' | 'community' | 'vendor';
  stage: RelationshipStage;
  relationship_claim: boolean;
  source_url: string;
  source_basis: string;
  last_human_review_at: string | null;
  next_review_on: string | null;
  outreach_approved: boolean;
  contact_attempted: boolean;
  notes: string;
}

export function validateRelationshipRegistry(value: unknown): string[] {
  const errors: string[] = [];
  const registry = value as { schema_version?: unknown; claim_boundary?: unknown; records?: unknown };
  if (registry?.schema_version !== 1) errors.push('schema_version must be 1');
  if (typeof registry?.claim_boundary !== 'string' || !registry.claim_boundary.includes('not proof of a relationship')) errors.push('claim boundary is missing');
  if (!Array.isArray(registry?.records)) return [...errors, 'records must be an array'];
  const ids = new Set<string>();
  for (const raw of registry.records) {
    const record = raw as RelationshipRecord & Record<string, unknown>;
    if (!record.id || ids.has(record.id)) errors.push(`duplicate or missing id: ${record.id ?? ''}`);
    ids.add(record.id);
    if (!/^https:\/\//.test(record.source_url ?? '')) errors.push(`${record.id}: source_url must use HTTPS`);
    if (!record.source_basis?.trim()) errors.push(`${record.id}: source_basis is required`);
    if (record.relationship_claim && record.stage !== 'active') errors.push(`${record.id}: only active records may claim a relationship`);
    if (record.outreach_approved && !['outreach_approved', 'contacted', 'active', 'paused'].includes(record.stage)) errors.push(`${record.id}: outreach approval conflicts with stage`);
    if (record.contact_attempted && !record.outreach_approved) errors.push(`${record.id}: contact attempt lacks approval`);
    if (record.stage === 'do_not_contact' && (record.outreach_approved || record.next_review_on)) errors.push(`${record.id}: do-not-contact must remain inert`);
    for (const forbidden of ['email', 'phone', 'access_token', 'api_key']) {
      if (forbidden in record) errors.push(`${record.id}: forbidden field ${forbidden}`);
    }
  }
  return errors;
}

export function relationshipMetrics(records: RelationshipRecord[]) {
  return {
    candidates: records.length,
    human_reviewed: records.filter((record) => record.last_human_review_at).length,
    outreach_approved: records.filter((record) => record.outreach_approved).length,
    active_relationships: records.filter((record) => record.stage === 'active' && record.relationship_claim).length,
    do_not_contact: records.filter((record) => record.stage === 'do_not_contact').length,
  };
}
