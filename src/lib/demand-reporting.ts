export interface DemandOpportunity {
  query: string;
  searches: number;
  zero_result_searches: number;
  last_seen_at: string;
}

export interface ContentCoverageItem {
  query: string;
  status: 'current' | 'stale';
  route: string;
}

export interface GovernedDemandOpportunity extends DemandOpportunity {
  coverage_status: 'current' | 'stale' | 'unknown';
  coverage_route: string | null;
  opportunity_score: number;
}

const normalizeQuery = (value: string) => value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();

export function annotateDemandCoverage(
  demand: DemandOpportunity[],
  coverage: ContentCoverageItem[],
): GovernedDemandOpportunity[] {
  const byQuery = new Map(coverage.map((item) => [normalizeQuery(item.query), item]));
  return demand.map((item) => {
    const match = byQuery.get(normalizeQuery(item.query));
    return {
      ...item,
      coverage_status: match?.status ?? 'unknown',
      coverage_route: match?.route ?? null,
      opportunity_score: item.zero_result_searches * 3 + item.searches,
    };
  });
}

export async function listDemandOpportunities(
  db: D1Database,
  now: string,
  limit = 20,
): Promise<DemandOpportunity[]> {
  if (!Number.isFinite(Date.parse(now))) throw new Error('invalid reporting time');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('invalid reporting limit');

  const result = await db.prepare(
    `SELECT query,
            COUNT(*) AS searches,
            SUM(CASE WHEN result_band = 'zero' THEN 1 ELSE 0 END) AS zero_result_searches,
            MAX(created_at) AS last_seen_at
       FROM demand_events_v1
      WHERE expires_at > ?
        AND bot_class != 'bot_likely'
      GROUP BY query
      ORDER BY zero_result_searches DESC, searches DESC, query ASC
      LIMIT ?`,
  ).bind(now, limit).all<DemandOpportunity>();

  return result.results ?? [];
}
