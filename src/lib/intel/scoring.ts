// Opportunity scoring: turns what the crawler believes about an org's
// current tech stack, plus what the directory already knows about that org,
// into one priority number for outreach, with a rationale a human can check
// against the inputs.
//
// Every weight is a named constant up top so the formula can be re-tuned by
// reading this file, not by re-deriving the logic. Every rationale line is
// built from the same inputs that produced the number next to it -- nothing
// in the rationale is a hard-coded phrase disconnected from the math.

import type { D1Database } from '@cloudflare/workers-types';
import { INTEL_SCORING_VERSION, registrableDomain } from './config';
import type { MigrationDifficulty } from './types';

export interface OpportunityInput {
  orgId: string;
  competitorId: string | null;
  competitorMigrationDifficulty: MigrationDifficulty | null;
  stackConfidence: number;
  programCount: number;
  ageSpanYears: number | null;
  hasStreaming: boolean;
  websiteLastVerifiedDaysAgo: number | null;
  brokenLinkCount: number;
  categoriesDetected: number;
  yearsOperating: number | null;
}

export interface OpportunityScore {
  migrationDifficulty: number;
  orgSizeScore: number;
  techMaturity: number;
  switchLikelihood: number;
  revenueEstimateUsd: number;
  priority: number;
  rationale: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Tunable weights. Change these, not the formulas below.
// ---------------------------------------------------------------------------

/** Base 0-100 difficulty by the competitor definition's own migrationDifficulty rating. */
const MIGRATION_DIFFICULTY_BASE: Record<MigrationDifficulty, number> = { low: 20, medium: 50, high: 80 };
/** Used when no competitor is identified, or as the low-confidence anchor below. */
const MIGRATION_DIFFICULTY_UNKNOWN = 50;

/** Points added to org size per active program, capped at ORG_SIZE_PROGRAM_CAP programs. */
const ORG_SIZE_PROGRAM_WEIGHT = 4;
const ORG_SIZE_PROGRAM_CAP = 20;
/** Points added to org size per year of age span served, capped at ORG_SIZE_AGE_SPAN_CAP years. */
const ORG_SIZE_AGE_SPAN_WEIGHT = 2;
const ORG_SIZE_AGE_SPAN_CAP = 15;
/** Flat bonus when the org already runs any streaming product (signals a bigger production). */
const ORG_SIZE_STREAMING_BONUS = 10;

/** Points added to tech maturity per distinct stack category detected, capped at 6 categories. */
const TECH_MATURITY_CATEGORY_WEIGHT = 12;
const TECH_MATURITY_CATEGORY_CAP = 6;
/** Share of the raw stack confidence (0-100) folded directly into tech maturity. */
const TECH_MATURITY_CONFIDENCE_WEIGHT = 0.4;
const TECH_MATURITY_STREAMING_BONUS = 15;

/** Points added to switch likelihood per day since the org's directory record was last verified, capped. */
const SWITCH_STALE_SITE_WEIGHT = 0.3;
const SWITCH_STALE_SITE_CAP_DAYS = 180;
/** Points added to switch likelihood per broken link on the org's site, capped at this many links. */
const SWITCH_BROKEN_LINK_WEIGHT = 5;
const SWITCH_BROKEN_LINK_CAP = 10;
/** Full bonus when migration difficulty is 0 (easiest to move), scaled down to 0 as difficulty rises to 100. */
const SWITCH_EASY_MIGRATION_BONUS = 25;
/** Full bonus when tech maturity is 0 (a thin, painful stack), scaled down to 0 as maturity rises to 100. */
const SWITCH_LOW_MATURITY_BONUS = 20;

/** Documented proxy: one active program roughly maps to one team/season worth of registration volume per year. */
const REVENUE_PER_PROGRAM_ANNUAL_USD = 3500;

/** Composite priority weights; must sum to 1 so the composite stays 0-100. */
const PRIORITY_WEIGHT_SWITCH_LIKELIHOOD = 0.35;
const PRIORITY_WEIGHT_ORG_SIZE = 0.25;
const PRIORITY_WEIGHT_EASE_OF_MIGRATION = 0.25;
const PRIORITY_WEIGHT_TECH_MATURITY = 0.15;

// Keys here must be kept in sync with OpportunityScore's rationale object;
// tests/intel-scoring.test.ts checks every rationale key against this map.
export const RATIONALE_KEY_TO_FIELD: Record<string, keyof OpportunityScore> = {
  migrationDifficulty: 'migrationDifficulty',
  orgSize: 'orgSizeScore',
  techMaturity: 'techMaturity',
  switchLikelihood: 'switchLikelihood',
  revenue: 'revenueEstimateUsd',
  priority: 'priority',
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round(value: number): number {
  return Math.round(value);
}

function scoreMigrationDifficulty(input: OpportunityInput): number {
  const base = input.competitorMigrationDifficulty ? MIGRATION_DIFFICULTY_BASE[input.competitorMigrationDifficulty] : MIGRATION_DIFFICULTY_UNKNOWN;
  const confidenceFactor = clamp(input.stackConfidence, 0, 100) / 100;
  const blended = base * confidenceFactor + MIGRATION_DIFFICULTY_UNKNOWN * (1 - confidenceFactor);
  return round(clamp(blended, 0, 100));
}

function scoreOrgSize(input: OpportunityInput): number {
  const programPoints = Math.min(input.programCount, ORG_SIZE_PROGRAM_CAP) * ORG_SIZE_PROGRAM_WEIGHT;
  const agePoints = input.ageSpanYears != null ? Math.min(input.ageSpanYears, ORG_SIZE_AGE_SPAN_CAP) * ORG_SIZE_AGE_SPAN_WEIGHT : 0;
  const streamingPoints = input.hasStreaming ? ORG_SIZE_STREAMING_BONUS : 0;
  return round(clamp(programPoints + agePoints + streamingPoints, 0, 100));
}

function scoreTechMaturity(input: OpportunityInput): number {
  const categoryPoints = Math.min(input.categoriesDetected, TECH_MATURITY_CATEGORY_CAP) * TECH_MATURITY_CATEGORY_WEIGHT;
  const confidencePoints = clamp(input.stackConfidence, 0, 100) * TECH_MATURITY_CONFIDENCE_WEIGHT;
  const streamingPoints = input.hasStreaming ? TECH_MATURITY_STREAMING_BONUS : 0;
  return round(clamp(categoryPoints + confidencePoints + streamingPoints, 0, 100));
}

function scoreSwitchLikelihood(input: OpportunityInput, migrationDifficulty: number, techMaturity: number): number {
  const stalePoints = input.websiteLastVerifiedDaysAgo != null ? Math.min(input.websiteLastVerifiedDaysAgo, SWITCH_STALE_SITE_CAP_DAYS) * SWITCH_STALE_SITE_WEIGHT : 0;
  const brokenLinkPoints = Math.min(input.brokenLinkCount, SWITCH_BROKEN_LINK_CAP) * SWITCH_BROKEN_LINK_WEIGHT;
  const easyMigrationPoints = SWITCH_EASY_MIGRATION_BONUS * (1 - migrationDifficulty / 100);
  const lowMaturityPoints = SWITCH_LOW_MATURITY_BONUS * (1 - techMaturity / 100);
  return round(clamp(stalePoints + brokenLinkPoints + easyMigrationPoints + lowMaturityPoints, 0, 100));
}

function estimateRevenue(programCount: number): number {
  return Math.round(Math.max(0, programCount) * REVENUE_PER_PROGRAM_ANNUAL_USD);
}

function scorePriority(orgSizeScore: number, migrationDifficulty: number, techMaturity: number, switchLikelihood: number): number {
  const ease = 100 - migrationDifficulty;
  const composite =
    switchLikelihood * PRIORITY_WEIGHT_SWITCH_LIKELIHOOD +
    orgSizeScore * PRIORITY_WEIGHT_ORG_SIZE +
    ease * PRIORITY_WEIGHT_EASE_OF_MIGRATION +
    techMaturity * PRIORITY_WEIGHT_TECH_MATURITY;
  return round(clamp(composite, 0, 100));
}

function buildRationale(
  input: OpportunityInput,
  migrationDifficulty: number,
  orgSizeScore: number,
  techMaturity: number,
  switchLikelihood: number,
  revenueEstimateUsd: number,
  priority: number,
): Record<string, string> {
  return {
    migrationDifficulty: input.competitorMigrationDifficulty
      ? `Rated ${input.competitorMigrationDifficulty} difficulty to move off the detected platform, at ${input.stackConfidence} confidence, scores ${migrationDifficulty} out of 100.`
      : `No competitor platform identified yet, so migration difficulty defaults to a neutral ${migrationDifficulty} out of 100.`,
    orgSize: `${input.programCount} programs${input.ageSpanYears != null ? ` across an ${input.ageSpanYears} year age span` : ''}${input.hasStreaming ? ', plus streaming' : ''} scores ${orgSizeScore} out of 100 for size.`,
    techMaturity: `${input.categoriesDetected} tech categories detected at ${input.stackConfidence} confidence${input.hasStreaming ? ', including streaming' : ''} scores ${techMaturity} out of 100 for maturity.`,
    switchLikelihood: `${input.websiteLastVerifiedDaysAgo ?? 'an unknown number of'} days since the directory record was last verified and ${input.brokenLinkCount} broken links, against a migration ease of ${100 - migrationDifficulty}, scores ${switchLikelihood} out of 100 to switch.`,
    revenue: `${input.programCount} programs at $${REVENUE_PER_PROGRAM_ANNUAL_USD} estimated per program per year is about $${revenueEstimateUsd}.`,
    priority: `A weighted blend of switch likelihood, org size, ease of migration, and tech maturity lands at ${priority} out of 100 priority.`,
  };
}

/** Pure, deterministic. Same input always produces the same OpportunityScore. */
export function scoreOpportunity(input: OpportunityInput): OpportunityScore {
  const migrationDifficulty = scoreMigrationDifficulty(input);
  const orgSizeScore = scoreOrgSize(input);
  const techMaturity = scoreTechMaturity(input);
  const switchLikelihood = scoreSwitchLikelihood(input, migrationDifficulty, techMaturity);
  const revenueEstimateUsd = estimateRevenue(input.programCount);
  const priority = scorePriority(orgSizeScore, migrationDifficulty, techMaturity, switchLikelihood);
  const rationale = buildRationale(input, migrationDifficulty, orgSizeScore, techMaturity, switchLikelihood, revenueEstimateUsd, priority);
  return { migrationDifficulty, orgSizeScore, techMaturity, switchLikelihood, revenueEstimateUsd, priority, rationale };
}

interface StackRow {
  category: string;
  competitor_id: string | null;
  confidence: number;
  migration_difficulty: MigrationDifficulty | null;
}

/**
 * Rescoring an org with no active org_tech_stack row is a no-op (nothing to
 * score); everything else is derived from organizations, programs, and
 * org_tech_stack (the "primary" stack row is whichever category has the
 * highest confidence). Returns the number of orgs actually scored.
 */
export async function rescoreOrgs(db: D1Database, limit: number): Promise<number> {
  if (limit <= 0) return 0;

  const orgsRes = await db
    .prepare(
      `SELECT DISTINCT o.id AS org_id, o.website_url, o.years_operating, o.last_verified_at
       FROM organizations o
       JOIN org_tech_stack s ON s.org_id = o.id AND s.status IN ('detected', 'confirmed')
       ORDER BY o.id ASC
       LIMIT ?`,
    )
    .bind(limit)
    .all<{ org_id: string; website_url: string | null; years_operating: number | null; last_verified_at: string | null }>();

  const orgs = orgsRes.results ?? [];
  const now = Date.now();
  let scored = 0;

  for (const org of orgs) {
    const stackRows = await db
      .prepare(
        `SELECT s.category, s.competitor_id, s.confidence, c.migration_difficulty
         FROM org_tech_stack s LEFT JOIN competitors c ON c.id = s.competitor_id
         WHERE s.org_id = ? AND s.status IN ('detected', 'confirmed')`,
      )
      .bind(org.org_id)
      .all<StackRow>();
    const stacks = stackRows.results ?? [];
    if (stacks.length === 0) continue;

    const primary = stacks.reduce((best, row) => (row.confidence > best.confidence ? row : best), stacks[0]!);
    const hasStreaming = stacks.some((row) => row.category === 'streaming');
    const categoriesDetected = new Set(stacks.map((row) => row.category)).size;

    const programRes = await db
      .prepare(`SELECT COUNT(*) AS n, MIN(age_min) AS min_age, MAX(age_max) AS max_age FROM programs WHERE organization_id = ? AND record_status = 'active'`)
      .bind(org.org_id)
      .first<{ n: number; min_age: number | null; max_age: number | null }>();
    const programCount = Number(programRes?.n ?? 0);
    const ageSpanYears = programRes?.min_age != null && programRes?.max_age != null ? Math.max(0, programRes.max_age - programRes.min_age) : null;

    let brokenLinkCount = 0;
    const domain = registrableDomain(org.website_url ?? '');
    if (domain) {
      const linkRes = await db.prepare(`SELECT COUNT(*) AS n FROM link_health WHERE is_broken = 1 AND url LIKE ?`).bind(`%${domain}%`).first<{ n: number }>();
      brokenLinkCount = Number(linkRes?.n ?? 0);
    }

    const websiteLastVerifiedDaysAgo = org.last_verified_at ? Math.max(0, Math.round((now - Date.parse(org.last_verified_at)) / (24 * 60 * 60 * 1000))) : null;

    const score = scoreOpportunity({
      orgId: org.org_id,
      competitorId: primary.competitor_id,
      competitorMigrationDifficulty: primary.migration_difficulty,
      stackConfidence: primary.confidence,
      programCount,
      ageSpanYears,
      hasStreaming,
      websiteLastVerifiedDaysAgo,
      brokenLinkCount,
      categoriesDetected,
      yearsOperating: org.years_operating,
    });

    await db
      .prepare(
        `INSERT INTO org_opportunity_scores (org_id, migration_difficulty, org_size_score, tech_maturity, switch_likelihood, revenue_estimate_usd, priority, rationale, scoring_version, scored_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(org_id) DO UPDATE SET
           migration_difficulty = excluded.migration_difficulty,
           org_size_score = excluded.org_size_score,
           tech_maturity = excluded.tech_maturity,
           switch_likelihood = excluded.switch_likelihood,
           revenue_estimate_usd = excluded.revenue_estimate_usd,
           priority = excluded.priority,
           rationale = excluded.rationale,
           scoring_version = excluded.scoring_version,
           scored_at = excluded.scored_at`,
      )
      .bind(
        org.org_id,
        score.migrationDifficulty,
        score.orgSizeScore,
        score.techMaturity,
        score.switchLikelihood,
        score.revenueEstimateUsd,
        score.priority,
        JSON.stringify(score.rationale),
        INTEL_SCORING_VERSION,
        new Date(now).toISOString(),
      )
      .run();
    scored += 1;
  }

  return scored;
}
