// All D1 access for the competitor intelligence schema
// (migrations-activity-radar/0016_competitor_intelligence.sql). Every write
// uses .bind(); nothing here string-builds SQL from caller input.
//
// The one piece of behavior worth reading before touching this file is
// recordDetection: it is the single place that turns a page's detection
// results into org_tech_stack writes, intel_review_queue rows, and
// org_tech_history entries, and it is the place that has to get idempotency
// and "never downgrade a human decision" right.

import type { D1Database } from '@cloudflare/workers-types';
import { AUTO_ACCEPT_CONFIDENCE, REVIEW_CONFIDENCE, registrableDomain } from './config';
import type { DetectionResult, DetectionSignal } from './fingerprints';
import {
  MAX_MATCHED_VALUE_LENGTH,
  type ChangeType,
  type IntelReviewQueueRow,
  type IntelRunRow,
  type OrgOpportunityScoreRow,
  type OrgTechStackRow,
  type ReviewReason,
  type ReviewStatus,
  type RunStatus,
  type RunType,
  type StackStatus,
} from './types';
import type { CompetitorDefinition } from './fingerprints';

const nowIso = (): string => new Date().toISOString();

// ---------------------------------------------------------------------------
// competitors
// ---------------------------------------------------------------------------

/**
 * Upserts every CompetitorDefinition into the competitors table. Status is
 * only set on insert ('active'); an existing row's status is left alone so
 * an admin's manual 'watch' or 'retired' choice survives a re-sync.
 */
export async function syncCompetitorCatalog(db: D1Database, definitions: CompetitorDefinition[]): Promise<number> {
  const now = nowIso();
  for (const definition of definitions) {
    await db
      .prepare(
        `INSERT INTO competitors (id, display_name, canonical_domain, category, status, migration_difficulty, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'active', ?, NULL, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           display_name = excluded.display_name,
           canonical_domain = excluded.canonical_domain,
           category = excluded.category,
           migration_difficulty = excluded.migration_difficulty,
           updated_at = excluded.updated_at`,
      )
      .bind(definition.id, definition.displayName, definition.canonicalDomain, definition.category, definition.migrationDifficulty, now, now)
      .run();
  }
  return definitions.length;
}

// ---------------------------------------------------------------------------
// intel_runs
// ---------------------------------------------------------------------------

export async function createRun(
  db: D1Database,
  input: { runType: RunType; requestedBy?: string; notes?: string; targetsPlanned?: number },
): Promise<IntelRunRow> {
  const row: IntelRunRow = {
    id: crypto.randomUUID(),
    run_type: input.runType,
    status: 'proposed',
    requested_by: input.requestedBy ?? null,
    approved_by: null,
    approved_at: null,
    started_at: null,
    finished_at: null,
    targets_planned: input.targetsPlanned ?? 0,
    targets_fetched: 0,
    targets_skipped: 0,
    signals_found: 0,
    error_code: null,
    notes: input.notes ?? null,
    created_at: nowIso(),
  };
  await db
    .prepare(
      `INSERT INTO intel_runs (id, run_type, status, requested_by, approved_by, approved_at, started_at, finished_at, targets_planned, targets_fetched, targets_skipped, signals_found, error_code, notes, created_at)
       VALUES (?, ?, ?, ?, NULL, NULL, NULL, NULL, ?, 0, 0, 0, NULL, ?, ?)`,
    )
    .bind(row.id, row.run_type, row.status, row.requested_by, row.targets_planned, row.notes, row.created_at)
    .run();
  return row;
}

/** Approves a run only when it is currently 'proposed'. Returns null if not found or not in that state. */
export async function approveRun(db: D1Database, runId: string, approvedBy: string): Promise<IntelRunRow | null> {
  const now = nowIso();
  const res = await db
    .prepare(`UPDATE intel_runs SET status = 'approved', approved_by = ?, approved_at = ? WHERE id = ? AND status = 'proposed'`)
    .bind(approvedBy, now, runId)
    .run();
  if ((res.meta?.changes ?? 0) === 0) return null;
  return getRun(db, runId);
}

const RUN_PATCHABLE_FIELDS: Array<keyof IntelRunRow> = [
  'approved_by',
  'approved_at',
  'started_at',
  'finished_at',
  'targets_planned',
  'targets_fetched',
  'targets_skipped',
  'signals_found',
  'error_code',
  'notes',
];

export async function markRunStatus(db: D1Database, runId: string, status: RunStatus, patch: Partial<IntelRunRow> = {}): Promise<void> {
  const sets = ['status = ?'];
  const vals: unknown[] = [status];
  for (const field of RUN_PATCHABLE_FIELDS) {
    const value = patch[field];
    if (value !== undefined) {
      sets.push(`${field} = ?`);
      vals.push(value as unknown);
    }
  }
  vals.push(runId);
  await db.prepare(`UPDATE intel_runs SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
}

export async function getRun(db: D1Database, runId: string): Promise<IntelRunRow | null> {
  const row = await db.prepare(`SELECT * FROM intel_runs WHERE id = ?`).bind(runId).first<IntelRunRow>();
  return row ?? null;
}

export async function listRuns(db: D1Database, opts: { status?: RunStatus; limit?: number; offset?: number }): Promise<IntelRunRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (opts.status) {
    conditions.push('status = ?');
    params.push(opts.status);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(opts.limit ?? 50, opts.offset ?? 0);
  const res = await db.prepare(`SELECT * FROM intel_runs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...params).all<IntelRunRow>();
  return res.results ?? [];
}

// ---------------------------------------------------------------------------
// claimSweepTargets
// ---------------------------------------------------------------------------

interface OrgCandidateRow {
  id: string;
  name: string;
  website_url: string;
}

/**
 * Ranks organizations for the sweep queue: active, with a website, not
 * deleted, preferring domains never fetched or fetched longest ago. D1/
 * SQLite has no URL parser, so the registrable domain is computed in JS
 * against a bounded candidate pool (ordered by id for a stable, deterministic
 * cursor across ticks) rather than in the SQL itself.
 */
export async function claimSweepTargets(
  db: D1Database,
  limit: number,
): Promise<Array<{ orgId: string; name: string; domain: string; url: string }>> {
  if (limit <= 0) return [];

  const candidatePoolSize = Math.min(Math.max(limit * 20, 200), 2000);
  const candidatesRes = await db
    .prepare(
      `SELECT id, name, website_url FROM organizations
       WHERE record_status = 'active' AND website_url IS NOT NULL AND trim(website_url) <> '' AND deleted_at IS NULL
       ORDER BY id ASC LIMIT ?`,
    )
    .bind(candidatePoolSize)
    .all<OrgCandidateRow>();

  const candidates = (candidatesRes.results ?? [])
    .map((row) => ({ orgId: row.id, name: row.name, url: row.website_url, domain: registrableDomain(row.website_url) }))
    .filter((candidate): candidate is { orgId: string; name: string; url: string; domain: string } => !!candidate.domain);

  if (candidates.length === 0) return [];

  const uniqueDomains = Array.from(new Set(candidates.map((candidate) => candidate.domain)));
  const placeholders = uniqueDomains.map(() => '?').join(',');
  const freshnessRes = await db
    .prepare(`SELECT domain, MAX(last_fetched_at) AS last_fetched_at FROM intel_fetch_log WHERE domain IN (${placeholders}) GROUP BY domain`)
    .bind(...uniqueDomains)
    .all<{ domain: string; last_fetched_at: string | null }>();

  const freshness = new Map<string, string | null>();
  for (const row of freshnessRes.results ?? []) freshness.set(row.domain, row.last_fetched_at);

  const ranked = candidates
    .map((candidate) => ({ ...candidate, lastFetched: freshness.get(candidate.domain) ?? null }))
    .sort((a, b) => {
      const aKey = a.lastFetched ?? '';
      const bKey = b.lastFetched ?? '';
      if (aKey !== bKey) return aKey < bKey ? -1 : 1;
      return a.orgId < b.orgId ? -1 : a.orgId > b.orgId ? 1 : 0;
    });

  return ranked.slice(0, limit).map(({ orgId, name, domain, url }) => ({ orgId, name, domain, url }));
}

// ---------------------------------------------------------------------------
// recordDetection
// ---------------------------------------------------------------------------

async function insertHistory(
  db: D1Database,
  args: {
    orgId: string;
    category: string;
    fromCompetitorId: string | null;
    toCompetitorId: string | null;
    changeType: ChangeType;
    fromConfidence: number | null;
    toConfidence: number | null;
    runId: string | null;
    now: string;
  },
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO org_tech_history (org_id, category, from_competitor_id, to_competitor_id, change_type, from_confidence, to_confidence, run_id, detected_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(args.orgId, args.category, args.fromCompetitorId, args.toCompetitorId, args.changeType, args.fromConfidence, args.toConfidence, args.runId, args.now)
    .run();
}

/**
 * Applies a single AUTO_ACCEPT-confidence detection to org_tech_stack.
 * Returns 1 if the stack row was inserted or updated, 0 if a human's
 * 'confirmed'/'rejected' verdict protected the row from being touched.
 */
async function applyStackDetection(
  db: D1Database,
  args: { orgId: string; category: string; competitorId: string; confidence: number; runId: string; now: string },
): Promise<number> {
  const { orgId, category, competitorId, confidence, runId, now } = args;
  const existing = await db
    .prepare(`SELECT * FROM org_tech_stack WHERE org_id = ? AND category = ?`)
    .bind(orgId, category)
    .first<OrgTechStackRow>();

  if (!existing) {
    await db
      .prepare(
        `INSERT INTO org_tech_stack (id, org_id, category, competitor_id, confidence, status, first_detected_at, last_confirmed_at, evidence_count, reviewed_by, reviewed_at, review_notes)
         VALUES (?, ?, ?, ?, ?, 'detected', ?, ?, 1, NULL, NULL, NULL)`,
      )
      .bind(crypto.randomUUID(), orgId, category, competitorId, confidence, now, now)
      .run();
    await insertHistory(db, {
      orgId,
      category,
      fromCompetitorId: null,
      toCompetitorId: competitorId,
      changeType: 'first_detected',
      fromConfidence: null,
      toConfidence: confidence,
      runId,
      now,
    });
    return 1;
  }

  if (existing.status === 'confirmed' || existing.status === 'rejected') {
    // A human decided. Never let a sweep downgrade or overwrite that verdict
    // — log what this run saw and leave the row exactly as it was.
    if (existing.competitor_id !== competitorId) {
      await insertHistory(db, {
        orgId,
        category,
        fromCompetitorId: existing.competitor_id,
        toCompetitorId: competitorId,
        changeType: 'switched',
        fromConfidence: existing.confidence,
        toConfidence: confidence,
        runId,
        now,
      });
    } else if (existing.confidence !== confidence) {
      await insertHistory(db, {
        orgId,
        category,
        fromCompetitorId: existing.competitor_id,
        toCompetitorId: competitorId,
        changeType: 'confidence_changed',
        fromConfidence: existing.confidence,
        toConfidence: confidence,
        runId,
        now,
      });
    }
    return 0;
  }

  if (existing.competitor_id !== competitorId) {
    await db
      .prepare(`UPDATE org_tech_stack SET competitor_id = ?, confidence = ?, status = 'detected', evidence_count = evidence_count + 1, last_confirmed_at = ? WHERE id = ?`)
      .bind(competitorId, confidence, now, existing.id)
      .run();
    await insertHistory(db, {
      orgId,
      category,
      fromCompetitorId: existing.competitor_id,
      toCompetitorId: competitorId,
      changeType: 'switched',
      fromConfidence: existing.confidence,
      toConfidence: confidence,
      runId,
      now,
    });
    return 1;
  }

  const delta = Math.abs(existing.confidence - confidence);
  await db
    .prepare(`UPDATE org_tech_stack SET confidence = ?, status = 'detected', evidence_count = evidence_count + 1, last_confirmed_at = ? WHERE id = ?`)
    .bind(confidence, now, existing.id)
    .run();
  if (delta >= 10) {
    await insertHistory(db, {
      orgId,
      category,
      fromCompetitorId: existing.competitor_id,
      toCompetitorId: competitorId,
      changeType: 'confidence_changed',
      fromConfidence: existing.confidence,
      toConfidence: confidence,
      runId,
      now,
    });
  }
  return 1;
}

async function enqueueReview(
  db: D1Database,
  args: {
    orgId: string | null;
    domain: string;
    competitorId: string;
    category: string;
    confidence: number;
    reason: ReviewReason;
    evidence: DetectionSignal[];
    runId: string;
    now: string;
  },
): Promise<boolean> {
  const { orgId, domain, competitorId, category, confidence, reason, evidence, runId, now } = args;
  const existing = orgId
    ? await db
        .prepare(`SELECT id FROM intel_review_queue WHERE status = 'pending' AND org_id = ? AND competitor_id = ? AND category = ?`)
        .bind(orgId, competitorId, category)
        .first()
    : await db
        .prepare(`SELECT id FROM intel_review_queue WHERE status = 'pending' AND org_id IS NULL AND domain = ? AND competitor_id = ? AND category = ?`)
        .bind(domain, competitorId, category)
        .first();
  if (existing) return false;

  await db
    .prepare(
      `INSERT INTO intel_review_queue (id, org_id, domain, competitor_id, category, confidence, reason, evidence_json, status, run_id, resolved_by, resolved_at, resolution_notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NULL, NULL, NULL, ?)`,
    )
    .bind(crypto.randomUUID(), orgId, domain, competitorId, category, confidence, reason, JSON.stringify(evidence), runId, now)
    .run();
  return true;
}

/**
 * Turns one page's DetectionResults into signal rows, stack writes, and
 * review-queue rows.
 *
 * Idempotent by (run_id, domain): recordDetection is called once per fetched
 * page per run, so a second call for the same run_id and domain is a
 * retry/replay, not new evidence. That replay is detected up front (a
 * signal row already exists for this run_id + domain) and short-circuits to
 * an all-zero result before writing anything, so signals, stack rows, and
 * queue rows can never double up on retry.
 */
export async function recordDetection(
  db: D1Database,
  input: { runId: string; orgId: string | null; domain: string; sourceUrl: string; results: DetectionResult[] },
): Promise<{ signalsWritten: number; stackChanges: number; queuedForReview: number }> {
  const { runId, orgId, domain, results } = input;

  const already = await db.prepare(`SELECT 1 FROM org_tech_signals WHERE run_id = ? AND domain = ? LIMIT 1`).bind(runId, domain).first();
  if (already) {
    return { signalsWritten: 0, stackChanges: 0, queuedForReview: 0 };
  }

  const now = nowIso();
  let signalsWritten = 0;
  let stackChanges = 0;
  let queuedForReview = 0;

  for (const result of results) {
    for (const signal of result.signals) {
      await db
        .prepare(
          `INSERT INTO org_tech_signals (run_id, org_id, domain, competitor_id, signal_type, pattern_id, matched_value, weight, source_url, observed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          runId,
          orgId,
          domain,
          signal.competitorId,
          signal.type,
          signal.patternId,
          signal.matchedValue.slice(0, MAX_MATCHED_VALUE_LENGTH),
          signal.weight,
          signal.sourceUrl,
          now,
        )
        .run();
      signalsWritten += 1;
    }
  }

  const categoryCounts = new Map<string, number>();
  for (const result of results) {
    if (result.confidence < REVIEW_CONFIDENCE) continue;
    categoryCounts.set(result.category, (categoryCounts.get(result.category) ?? 0) + 1);
  }

  for (const result of results) {
    if (result.confidence < REVIEW_CONFIDENCE) continue; // signals only, already written above

    if (result.confidence >= AUTO_ACCEPT_CONFIDENCE && orgId) {
      stackChanges += await applyStackDetection(db, { orgId, category: result.category, competitorId: result.competitorId, confidence: result.confidence, runId, now });
      continue;
    }

    const reason: ReviewReason = !orgId
      ? 'org_unmatched'
      : (categoryCounts.get(result.category) ?? 0) > 1
        ? 'conflicting_signals'
        : result.suppressedBy.length > 0
          ? 'negative_pattern_conflict'
          : 'low_confidence';

    const inserted = await enqueueReview(db, {
      orgId,
      domain,
      competitorId: result.competitorId,
      category: result.category,
      confidence: result.confidence,
      reason,
      evidence: result.signals,
      runId,
      now,
    });
    if (inserted) queuedForReview += 1;
  }

  return { signalsWritten, stackChanges, queuedForReview };
}

// ---------------------------------------------------------------------------
// listStack / listReviewQueue / resolveReviewItem
// ---------------------------------------------------------------------------

export async function listStack(
  db: D1Database,
  opts: { competitorId?: string; status?: StackStatus; minConfidence?: number; state?: string; limit?: number; offset?: number },
): Promise<Array<OrgTechStackRow & { org_name: string; org_city: string | null; org_state: string | null; org_website_url: string | null }>> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (opts.competitorId) {
    conditions.push('s.competitor_id = ?');
    params.push(opts.competitorId);
  }
  if (opts.status) {
    conditions.push('s.status = ?');
    params.push(opts.status);
  }
  if (opts.minConfidence != null) {
    conditions.push('s.confidence >= ?');
    params.push(opts.minConfidence);
  }
  if (opts.state) {
    conditions.push('o.state = ?');
    params.push(opts.state);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(opts.limit ?? 50, opts.offset ?? 0);

  const res = await db
    .prepare(
      `SELECT s.*, o.name AS org_name, o.city AS org_city, o.state AS org_state, o.website_url AS org_website_url
       FROM org_tech_stack s JOIN organizations o ON o.id = s.org_id
       ${where}
       ORDER BY s.confidence DESC, s.last_confirmed_at DESC
       LIMIT ? OFFSET ?`,
    )
    .bind(...params)
    .all<OrgTechStackRow & { org_name: string; org_city: string | null; org_state: string | null; org_website_url: string | null }>();
  return res.results ?? [];
}

export async function listReviewQueue(
  db: D1Database,
  opts: { status?: ReviewStatus; limit?: number; offset?: number },
): Promise<IntelReviewQueueRow[]> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (opts.status) {
    conditions.push('status = ?');
    params.push(opts.status);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(opts.limit ?? 50, opts.offset ?? 0);
  const res = await db.prepare(`SELECT * FROM intel_review_queue ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...params).all<IntelReviewQueueRow>();
  return res.results ?? [];
}

/** Resolves one pending review row. Accepting promotes it into org_tech_stack with status 'confirmed'. */
export async function resolveReviewItem(
  db: D1Database,
  id: string,
  input: { status: 'accepted' | 'rejected'; resolvedBy: string; notes?: string },
): Promise<boolean> {
  const row = await db.prepare(`SELECT * FROM intel_review_queue WHERE id = ?`).bind(id).first<IntelReviewQueueRow>();
  if (!row || row.status !== 'pending') return false;

  const now = nowIso();
  const res = await db
    .prepare(`UPDATE intel_review_queue SET status = ?, resolved_by = ?, resolved_at = ?, resolution_notes = ? WHERE id = ? AND status = 'pending'`)
    .bind(input.status, input.resolvedBy, now, input.notes ?? null, id)
    .run();
  if ((res.meta?.changes ?? 0) === 0) return false;

  if (input.status === 'accepted' && row.org_id) {
    const existing = await db
      .prepare(`SELECT * FROM org_tech_stack WHERE org_id = ? AND category = ?`)
      .bind(row.org_id, row.category)
      .first<OrgTechStackRow>();

    if (!existing) {
      await db
        .prepare(
          `INSERT INTO org_tech_stack (id, org_id, category, competitor_id, confidence, status, first_detected_at, last_confirmed_at, evidence_count, reviewed_by, reviewed_at, review_notes)
           VALUES (?, ?, ?, ?, ?, 'confirmed', ?, ?, 1, ?, ?, ?)`,
        )
        .bind(crypto.randomUUID(), row.org_id, row.category, row.competitor_id, row.confidence, now, now, input.resolvedBy, now, input.notes ?? null)
        .run();
    } else {
      await db
        .prepare(
          `UPDATE org_tech_stack SET competitor_id = ?, confidence = ?, status = 'confirmed', evidence_count = evidence_count + 1, last_confirmed_at = ?, reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`,
        )
        .bind(row.competitor_id, row.confidence, now, input.resolvedBy, now, input.notes ?? null, existing.id)
        .run();
    }

    await insertHistory(db, {
      orgId: row.org_id,
      category: row.category,
      fromCompetitorId: existing?.competitor_id ?? null,
      toCompetitorId: row.competitor_id,
      changeType: 'confirmed',
      fromConfidence: existing?.confidence ?? null,
      toConfidence: row.confidence,
      runId: row.run_id,
      now,
    });
  }

  return true;
}

// ---------------------------------------------------------------------------
// listOpportunities / getIntelSummary
// ---------------------------------------------------------------------------

export async function listOpportunities(
  db: D1Database,
  opts: { minPriority?: number; competitorId?: string; limit?: number; offset?: number },
): Promise<Array<OrgOpportunityScoreRow & { org_name: string; org_state: string | null; competitor_id: string | null }>> {
  const conditions: string[] = [];
  const params: unknown[] = [];
  if (opts.minPriority != null) {
    conditions.push('sc.priority >= ?');
    params.push(opts.minPriority);
  }
  if (opts.competitorId) {
    conditions.push(`EXISTS (SELECT 1 FROM org_tech_stack s WHERE s.org_id = sc.org_id AND s.competitor_id = ? AND s.status IN ('detected', 'confirmed'))`);
    params.push(opts.competitorId);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  params.push(opts.limit ?? 50, opts.offset ?? 0);

  const sql = `
    SELECT sc.*, o.name AS org_name, o.state AS org_state,
      (SELECT s.competitor_id FROM org_tech_stack s WHERE s.org_id = sc.org_id AND s.status IN ('detected', 'confirmed') ORDER BY s.confidence DESC LIMIT 1) AS competitor_id
    FROM org_opportunity_scores sc
    JOIN organizations o ON o.id = sc.org_id
    ${where}
    ORDER BY sc.priority DESC
    LIMIT ? OFFSET ?
  `;
  const res = await db.prepare(sql).bind(...params).all<OrgOpportunityScoreRow & { org_name: string; org_state: string | null; competitor_id: string | null }>();
  return res.results ?? [];
}

export async function getIntelSummary(
  db: D1Database,
): Promise<{ orgsWithStack: number; byCompetitor: Array<{ competitor_id: string; count: number }>; pendingReview: number; lastRunAt: string | null; signalsLast30d: number }> {
  const [orgsWithStack, byCompetitor, pendingReview, lastRun, signalsLast30d] = await Promise.all([
    db.prepare(`SELECT COUNT(DISTINCT org_id) AS n FROM org_tech_stack WHERE status IN ('detected', 'confirmed')`).first<{ n: number }>(),
    db
      .prepare(`SELECT competitor_id, COUNT(*) AS count FROM org_tech_stack WHERE status IN ('detected', 'confirmed') GROUP BY competitor_id`)
      .all<{ competitor_id: string; count: number }>(),
    db.prepare(`SELECT COUNT(*) AS n FROM intel_review_queue WHERE status = 'pending'`).first<{ n: number }>(),
    db.prepare(`SELECT started_at, created_at FROM intel_runs ORDER BY created_at DESC LIMIT 1`).first<{ started_at: string | null; created_at: string }>(),
    db.prepare(`SELECT COUNT(*) AS n FROM org_tech_signals WHERE observed_at >= datetime('now', '-30 days')`).first<{ n: number }>(),
  ]);

  return {
    orgsWithStack: Number(orgsWithStack?.n ?? 0),
    byCompetitor: byCompetitor.results ?? [],
    pendingReview: Number(pendingReview?.n ?? 0),
    lastRunAt: lastRun?.started_at ?? lastRun?.created_at ?? null,
    signalsLast30d: Number(signalsLast30d?.n ?? 0),
  };
}
