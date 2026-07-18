export const AFFILIATE_LIFECYCLE_STATES = [
  'need_discovered',
  'intent_qualified',
  'researching',
  'candidate',
  'evaluating',
  'editorial_review',
  'approved',
  'integrated',
  'published',
  'monitoring',
  'maintenance_due',
  'update_proposed',
  'retired',
] as const;

export type AffiliateLifecycleState = typeof AFFILIATE_LIFECYCLE_STATES[number];

const TRANSITIONS: Record<AffiliateLifecycleState, AffiliateLifecycleState[]> = {
  need_discovered: ['intent_qualified', 'retired'],
  intent_qualified: ['researching', 'retired'],
  researching: ['candidate', 'retired'],
  candidate: ['evaluating', 'retired'],
  evaluating: ['editorial_review', 'researching', 'retired'],
  editorial_review: ['approved', 'evaluating', 'retired'],
  approved: ['integrated', 'editorial_review', 'retired'],
  integrated: ['published', 'approved', 'retired'],
  published: ['monitoring', 'maintenance_due', 'retired'],
  monitoring: ['maintenance_due', 'update_proposed', 'retired'],
  maintenance_due: ['update_proposed', 'monitoring', 'retired'],
  update_proposed: ['editorial_review', 'monitoring', 'retired'],
  retired: ['researching'],
};

export function canTransitionAffiliateLifecycle(from: AffiliateLifecycleState, to: AffiliateLifecycleState): boolean {
  return TRANSITIONS[from].includes(to);
}

export type RecommendationEvidence = {
  sourceCount: number;
  sourceQuality: number;
  verifiedAt: string;
  editorialReviewedAt?: string;
  availabilityState: 'available' | 'limited' | 'unavailable' | 'unknown';
  correctionCount: number;
  firstHandUseWeeks?: number;
  comparedAlternatives?: number;
  hasStrengths: boolean;
  hasWeaknesses: boolean;
  hasWrongFor: boolean;
  hasReasoning: boolean;
};

const isoDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function recommendationTrustScore(evidence: RecommendationEvidence, asOf: string): number {
  if (!isoDay(evidence.verifiedAt) || !isoDay(asOf)) return 0;
  const ageDays = Math.max(0, (Date.parse(`${asOf}T00:00:00Z`) - Date.parse(`${evidence.verifiedAt}T00:00:00Z`)) / 86_400_000);
  const freshness = ageDays <= 30 ? 25 : ageDays <= 90 ? 18 : ageDays <= 180 ? 10 : 0;
  const sourcing = Math.min(20, evidence.sourceCount * 5) * Math.max(0, Math.min(1, evidence.sourceQuality / 100));
  const reasoning = [evidence.hasStrengths, evidence.hasWeaknesses, evidence.hasWrongFor, evidence.hasReasoning].filter(Boolean).length * 7.5;
  const editorial = evidence.editorialReviewedAt && isoDay(evidence.editorialReviewedAt) ? 15 : 0;
  const availability = evidence.availabilityState === 'available' ? 10 : evidence.availabilityState === 'limited' ? 5 : 0;
  const correctionPenalty = Math.min(20, Math.max(0, evidence.correctionCount) * 4);
  return clamp(freshness + sourcing + reasoning + editorial + availability - correctionPenalty);
}

export function recommendationMayPublish(evidence: RecommendationEvidence, asOf: string): { allowed: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (evidence.sourceCount < 1 || evidence.sourceQuality < 60) reasons.push('evidence_grade_source_required');
  if (!evidence.editorialReviewedAt || !isoDay(evidence.editorialReviewedAt)) reasons.push('human_editorial_review_required');
  if (!evidence.hasReasoning || !evidence.hasStrengths || !evidence.hasWeaknesses || !evidence.hasWrongFor) {
    reasons.push('complete_explainable_recommendation_required');
  }
  if (evidence.availabilityState === 'unavailable' || evidence.availabilityState === 'unknown') reasons.push('known_available_offer_required');
  if (recommendationTrustScore(evidence, asOf) < 60) reasons.push('trust_score_below_publication_floor');
  return { allowed: reasons.length === 0, reasons };
}

export const REVENUE_ATTRIBUTION_DIMENSIONS = [
  'statement_period',
  'merchant',
  'program',
  'offer',
  'product',
  'recommendation',
  'guide',
  'campaign',
  'channel',
] as const;

export const PROHIBITED_REVENUE_DIMENSIONS = [
  'person',
  'email',
  'child',
  'household',
  'precise_location',
  'raw_search',
  'cross_site_user_journey',
] as const;
