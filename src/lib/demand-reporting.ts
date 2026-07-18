export interface DemandOpportunity {
  query: string;
  searches: number;
  zero_result_searches: number;
  last_seen_at: string;
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
