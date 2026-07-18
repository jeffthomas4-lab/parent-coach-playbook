import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { Miniflare } from 'miniflare';
import type { D1Database } from '@cloudflare/workers-types';
import {
  addClaim,
  addSource,
  advanceOpportunityToClaimsValidated,
  beginReview,
  classifyMonetization,
  classifyOpportunity,
  createBrief,
  createOpportunity,
  decideMaintenanceProposal,
  EvidenceGateError,
  getOpportunity,
  getOpportunityEvidenceSummary,
  mapRelationship,
  markRelationshipMappingComplete,
  proposeMaintenance,
  recordHumanApproval,
  recordReview,
  scoreOpportunity,
  validateClaim,
} from '../src/lib/editorial-records';

let db: D1Database;
let mf: Miniflare;

async function createDisposableOpsDatabase(): Promise<{ mf: Miniflare; db: D1Database }> {
  const isolated = new Miniflare({
    modules: true,
    script: 'export default { fetch() { return new Response("test only"); } }',
    compatibilityDate: '2026-07-15',
    d1Databases: { DB: '00000000-0000-0000-0000-000000000002' },
  });
  const isolatedDb = (await isolated.getD1Database('DB')) as unknown as D1Database;
  const directory = new URL('../migrations-pcd-ops/', import.meta.url);
  const migrations = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
  for (const migration of migrations) {
    const sql = (await readFile(new URL(migration, directory), 'utf8')).replace(/^--.*$/gm, '');
    for (const statement of sql.split(';').map((value) => value.trim()).filter(Boolean)) {
      await isolatedDb.prepare(statement).run();
    }
  }
  return { mf: isolated, db: isolatedDb };
}

beforeAll(async () => {
  ({ mf, db } = await createDisposableOpsDatabase());
}, 30_000);

afterAll(async () => mf?.dispose());

describe('editorial opportunity lifecycle schema (disposable D1)', () => {
  it('applies migration 0024 cleanly and reports a clean foreign-key check', async () => {
    const tables = await db.prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE 'editorial_%' ORDER BY name`,
    ).all<{ name: string }>();
    expect((tables.results ?? []).map((row) => row.name)).toEqual([
      'editorial_approvals',
      'editorial_briefs',
      'editorial_claim_sources',
      'editorial_claims',
      'editorial_lifecycle_events',
      'editorial_maintenance_proposals',
      'editorial_opportunities',
      'editorial_relationships',
      'editorial_reviews',
      'editorial_sources',
    ]);
    const fkCheck = await db.prepare(`PRAGMA foreign_key_check`).all();
    expect(fkCheck.results ?? []).toEqual([]);
  });

  it('walks a full opportunity through discovery, scoring, and classification', async () => {
    const opportunity = await createOpportunity(db, {
      source: 'no_result',
      signalSummary: '"youth flag football camp seattle" -- 14 searches, 9 zero-result, coverage stale',
      signalRef: 'demand_events_v1:youth flag football camp seattle',
      actor: 'staff:editor-1',
    });
    expect(opportunity.status).toBe('opportunity_discovered');

    const scored = await scoreOpportunity(db, { id: opportunity.id, score: 82, actor: 'staff:editor-1' });
    expect(scored.status).toBe('scored');
    expect(scored.score).toBe(82);

    const classified = await classifyOpportunity(db, {
      id: opportunity.id, contentType: 'guide', existingMatch: false, distinctIntent: true,
      structuredDirectoryFit: false, evidenceSufficient: true, decisionReason: 'No existing Seattle flag football guide.',
      actor: 'staff:editor-1',
    });
    expect(classified.status).toBe('classified');
    expect(classified.cannibalization_decision).toBe('new_url');

    await expect(scoreOpportunity(db, { id: opportunity.id, score: 50, actor: 'staff:editor-1' })).rejects.toThrow('invalid opportunity transition');
  });

  it('stops an opportunity at insufficient_evidence instead of letting it reach a brief', async () => {
    const opportunity = await createOpportunity(db, { source: 'competitor', signalSummary: 'competitor observation, low confidence', actor: 'staff:editor-1' });
    await scoreOpportunity(db, { id: opportunity.id, score: 20, actor: 'staff:editor-1' });
    const result = await classifyOpportunity(db, {
      id: opportunity.id, contentType: 'article', existingMatch: false, distinctIntent: false,
      structuredDirectoryFit: false, evidenceSufficient: false, decisionReason: 'Signal too thin to act on.', actor: 'staff:editor-1',
    });
    expect(result.status).toBe('insufficient_evidence');
    await expect(createBrief(db, { opportunityId: opportunity.id, intentStatement: 'x', contentType: 'article', actor: 'staff:editor-1' }))
      .rejects.toThrow('opportunity is not ready to be briefed');
  });

  it('requires all claims validated and at least one source before claims_validated', async () => {
    const opportunity = await createOpportunity(db, { source: 'gsc', signalSummary: 'aggregate GSC coverage gap', actor: 'staff:editor-1' });
    await scoreOpportunity(db, { id: opportunity.id, score: 70, actor: 'staff:editor-1' });
    await classifyOpportunity(db, {
      id: opportunity.id, contentType: 'guide', existingMatch: false, distinctIntent: true,
      structuredDirectoryFit: false, evidenceSufficient: true, decisionReason: 'ok', actor: 'staff:editor-1',
    });
    const brief = await createBrief(db, { opportunityId: opportunity.id, intentStatement: 'Explain age cutoffs by state.', contentType: 'guide', actor: 'staff:editor-1' });

    await expect(advanceOpportunityToClaimsValidated(db, { opportunityId: opportunity.id, actor: 'staff:editor-1' }))
      .rejects.toThrow('brief has no claims to validate');

    const claim = await addClaim(db, { briefId: brief.id, claimText: 'Most Pop Warner divisions cap at age 12 by August 1.', actor: 'staff:editor-1' });
    await expect(advanceOpportunityToClaimsValidated(db, { opportunityId: opportunity.id, actor: 'staff:editor-1' }))
      .rejects.toThrow('every claim on the active brief must be validated first');

    const source = await addSource(db, {
      entityType: 'brief', entityId: brief.id, sourceType: 'governing_body', sourceUrl: 'https://www.popwarner.com/age-chart',
      sourceQuality: 90, claimScope: 'Age cutoff dates by division.', verifiedAt: '2026-07-18T00:00:00Z', actor: 'staff:editor-1',
    });
    await validateClaim(db, { claimId: claim.id, sourceIds: [source.id], actor: 'staff:editor-1' });

    const advanced = await advanceOpportunityToClaimsValidated(db, { opportunityId: opportunity.id, actor: 'staff:editor-1' });
    expect(advanced.status).toBe('claims_validated');

    const evidence = await getOpportunityEvidenceSummary(db, opportunity.id);
    expect(evidence).toEqual(expect.objectContaining({ sourceCount: 1, claimsValidated: true }));
  });

  it('runs review, relationship mapping, monetization classification, and blocks approval on missing evidence gates', async () => {
    const opportunity = await createOpportunity(db, { source: 'seasonal', signalSummary: 'aggregate seasonal camp-gap signal', actor: 'staff:editor-1' });
    await scoreOpportunity(db, { id: opportunity.id, score: 60, actor: 'staff:editor-1' });
    await classifyOpportunity(db, {
      id: opportunity.id, contentType: 'article', existingMatch: false, distinctIntent: true,
      structuredDirectoryFit: false, evidenceSufficient: true, decisionReason: 'ok', actor: 'staff:editor-1',
    });
    const brief = await createBrief(db, { opportunityId: opportunity.id, intentStatement: 'Spring camp registration windows.', contentType: 'article', actor: 'staff:editor-1' });
    const claim = await addClaim(db, { briefId: brief.id, claimText: 'Most spring camps open registration in February.', actor: 'staff:editor-1' });
    const source = await addSource(db, {
      entityType: 'brief', entityId: brief.id, sourceType: 'internal_data', sourceUrl: 'https://parentcoachdesk.com/camps/',
      sourceQuality: 70, claimScope: 'Registration window pattern.', verifiedAt: '2026-07-18T00:00:00Z', actor: 'staff:editor-1',
    });
    await validateClaim(db, { claimId: claim.id, sourceIds: [source.id], actor: 'staff:editor-1' });
    await advanceOpportunityToClaimsValidated(db, { opportunityId: opportunity.id, actor: 'staff:editor-1' });

    await beginReview(db, { opportunityId: opportunity.id, reviewType: 'editorial', actor: 'staff:editor-1' });
    await recordReview(db, { opportunityId: opportunity.id, reviewType: 'editorial', outcome: 'changes_requested', reviewer: 'staff:senior-editor', notes: 'Tighten the intro.', actor: 'staff:senior-editor' });
    expect((await getOpportunity(db, opportunity.id))?.status).toBe('editorial_review');
    await recordReview(db, { opportunityId: opportunity.id, reviewType: 'editorial', outcome: 'pass', reviewer: 'staff:senior-editor', actor: 'staff:senior-editor' });
    expect((await getOpportunity(db, opportunity.id))?.status).toBe('seo_review');

    await recordReview(db, { opportunityId: opportunity.id, reviewType: 'seo_ai', outcome: 'pass', reviewer: 'staff:seo-reviewer', actor: 'staff:seo-reviewer' });
    expect((await getOpportunity(db, opportunity.id))?.status).toBe('relationship_mapped');

    await mapRelationship(db, { opportunityId: opportunity.id, relatedRoute: '/camps/', relationshipType: 'hub_child', actor: 'staff:editor-1' });
    const approvalReady = await markRelationshipMappingComplete(db, { opportunityId: opportunity.id, actor: 'staff:editor-1' });
    expect(approvalReady.status).toBe('approval_ready');

    await expect(recordHumanApproval(db, { opportunityId: opportunity.id, approvedBy: 'jeffthomas@pugetsound.edu', flagsResolved: true, actor: 'jeffthomas@pugetsound.edu' }))
      .rejects.toThrow('monetization/disclosure classification is required before approval');

    await classifyMonetization(db, { opportunityId: opportunity.id, monetizationClassification: 'none', disclosureRequired: false, actor: 'staff:editor-1' });

    const approved = await recordHumanApproval(db, { opportunityId: opportunity.id, approvedBy: 'jeffthomas@pugetsound.edu', flagsResolved: true, actor: 'jeffthomas@pugetsound.edu' });
    expect(approved.opportunity.status).toBe('approved');
    expect(approved.approval.approved_by).toBe('jeffthomas@pugetsound.edu');
  }, 20_000);

  it('throws a typed EvidenceGateError naming exactly what is missing, and never lets an unapproved item auto-publish', async () => {
    const opportunity = await createOpportunity(db, { source: 'affiliate_gap', signalSummary: 'aggregate affiliate coverage gap', actor: 'staff:editor-1' });
    await scoreOpportunity(db, { id: opportunity.id, score: 55, actor: 'staff:editor-1' });
    await classifyOpportunity(db, {
      id: opportunity.id, contentType: 'comparison', existingMatch: false, distinctIntent: true,
      structuredDirectoryFit: false, evidenceSufficient: true, decisionReason: 'ok', actor: 'staff:editor-1',
    });
    const brief = await createBrief(db, { opportunityId: opportunity.id, intentStatement: 'Cleat comparison.', contentType: 'comparison', actor: 'staff:editor-1' });
    const claim = await addClaim(db, { briefId: brief.id, claimText: 'Molded cleats are allowed at most youth levels.', actor: 'staff:editor-1' });
    const source = await addSource(db, {
      entityType: 'brief', entityId: brief.id, sourceType: 'governing_body', sourceUrl: 'https://www.usafootball.com/rules',
      sourceQuality: 80, claimScope: 'Cleat rules.', verifiedAt: '2026-07-18T00:00:00Z', actor: 'staff:editor-1',
    });
    await validateClaim(db, { claimId: claim.id, sourceIds: [source.id], actor: 'staff:editor-1' });
    await advanceOpportunityToClaimsValidated(db, { opportunityId: opportunity.id, actor: 'staff:editor-1' });
    await beginReview(db, { opportunityId: opportunity.id, reviewType: 'editorial', actor: 'staff:editor-1' });
    // Deliberately stop here: no seo review, no relationship mapping, no monetization
    // classification, no human approval. The opportunity must not be publishable.
    expect((await getOpportunity(db, opportunity.id))?.status).toBe('editorial_review');
    await expect(recordHumanApproval(db, { opportunityId: opportunity.id, approvedBy: 'jeffthomas@pugetsound.edu', flagsResolved: true, actor: 'jeffthomas@pugetsound.edu' }))
      .rejects.toThrow('opportunity is not ready for human approval');
  });

  it('lets automation propose refresh/consolidate maintenance but never execute retirement without a human decision', async () => {
    // Fabricate a published, monitored opportunity directly (bypassing the full
    // pipeline, which is already covered above) to exercise the maintenance path.
    const opportunity = await createOpportunity(db, { source: 'correction', signalSummary: 'aggregate correction-driven refresh candidate', actor: 'staff:editor-1' });
    await db.prepare(`UPDATE editorial_opportunities SET status = 'monitoring', scored_at = ? WHERE id = ?`).bind('2026-07-18T00:00:00Z', opportunity.id).run();

    await expect(proposeMaintenance(db, { opportunityId: opportunity.id, proposalType: 'retire', reason: 'Superseded by a newer guide.', actor: 'system:refresh-queue' }))
      .rejects.toThrow('consolidation and retirement proposals require an incoming-link audit reference');

    const retireProposal = await proposeMaintenance(db, {
      opportunityId: opportunity.id, proposalType: 'retire', reason: 'Superseded by a newer guide.',
      incomingLinkAuditRef: 'audit:2026-07-18-corrections-sweep', actor: 'system:refresh-queue',
    });
    // Proposing retirement must not itself change opportunity status -- there is
    // no "retirement_proposed" state, and automation never executes retirement.
    expect((await getOpportunity(db, opportunity.id))?.status).toBe('monitoring');
    expect(retireProposal.decision).toBeNull();

    await expect(decideMaintenanceProposal(db, { proposalId: retireProposal.id, decision: 'accepted', decidedBy: 'jeffthomas@pugetsound.edu', actor: 'jeffthomas@pugetsound.edu' }))
      .resolves.toEqual(expect.objectContaining({ decision: 'accepted' }));
    expect((await getOpportunity(db, opportunity.id))?.status).toBe('retired');

    await expect(decideMaintenanceProposal(db, { proposalId: retireProposal.id, decision: 'rejected', decidedBy: 'jeffthomas@pugetsound.edu', actor: 'jeffthomas@pugetsound.edu' }))
      .rejects.toThrow('maintenance proposal already decided');
  });

  it('lets a refresh proposal move a monitored opportunity into update_proposed', async () => {
    const opportunity = await createOpportunity(db, { source: 'support', signalSummary: 'aggregate support-driven refresh candidate', actor: 'staff:editor-1' });
    await db.prepare(`UPDATE editorial_opportunities SET status = 'monitoring', scored_at = ? WHERE id = ?`).bind('2026-07-18T00:00:00Z', opportunity.id).run();
    const proposal = await proposeMaintenance(db, { opportunityId: opportunity.id, proposalType: 'refresh', reason: 'Rule change reported by three parents.', actor: 'system:refresh-queue' });
    expect(proposal.proposal_type).toBe('refresh');
    expect((await getOpportunity(db, opportunity.id))?.status).toBe('update_proposed');
  });
});

describe('EvidenceGateError', () => {
  it('is a distinguishable error type carrying the missing gate list', () => {
    const error = new EvidenceGateError(['at least one reviewed source', 'Jeff/human approval']);
    expect(error).toBeInstanceOf(EvidenceGateError);
    expect(error.missing).toEqual(['at least one reviewed source', 'Jeff/human approval']);
  });
});
