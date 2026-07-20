import { describe, expect, it } from 'vitest';
import registry from '../automation/trusted-relationships-v1.json';
import { relationshipMetrics, validateRelationshipRegistry, type RelationshipRecord } from '../src/lib/relationship-governance';

describe('trusted relationship registry', () => {
  it('keeps current candidates evidence-backed and entirely pre-outreach', () => {
    expect(validateRelationshipRegistry(registry)).toEqual([]);
    expect(relationshipMetrics(registry.records as RelationshipRecord[])).toEqual({ candidates: 7, human_reviewed: 0, outreach_approved: 0, active_relationships: 0, do_not_contact: 0 });
  });

  it('rejects relationship claims and contact attempts without their human gates', () => {
    const claimed = structuredClone(registry);
    claimed.records[0].relationship_claim = true;
    expect(validateRelationshipRegistry(claimed)).toContain('little-league-international: only active records may claim a relationship');
    const contacted = structuredClone(registry);
    contacted.records[0].contact_attempted = true;
    expect(validateRelationshipRegistry(contacted)).toContain('little-league-international: contact attempt lacks approval');
  });

  it('keeps do-not-contact records inert and excludes direct contact fields', () => {
    const blocked = structuredClone(registry);
    Object.assign(blocked.records[0], { stage: 'do_not_contact', next_review_on: '2026-08-01', email: 'person@example.com' });
    expect(validateRelationshipRegistry(blocked)).toEqual(expect.arrayContaining([
      'little-league-international: do-not-contact must remain inert',
      'little-league-international: forbidden field email',
    ]));
  });
});
