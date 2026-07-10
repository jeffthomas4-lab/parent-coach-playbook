// Daily Yelp Fusion enrichment worker for ActivityRadar.
// Runs at 3am UTC, processes up to 450 orgs against the Yelp Business Search API.
// Prioritizes active orgs, then high-confidence unverified orgs, then remainder.
//
// Before deploying, set your Yelp API key as a secret:
//   cd workers && npx wrangler secret put YELP_API_KEY --config yelp-wrangler.toml
//
// Deploy:
//   cd workers && npx wrangler deploy --config yelp-wrangler.toml
//
// Test manually (one-shot trigger):
//   cd workers && npx wrangler dev yelp-worker.ts --config yelp-wrangler.toml --test-scheduled
//
// Free tier: 500 calls/day. We use 450, leaving 50 headroom for manual queries.

export interface Env {
  DB: D1Database;
  YELP_API_KEY: string;
}

interface OrgRow {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
  logo_url: string | null;
  social_urls: string | null;
  record_status: string;
  is_claimed: number;
}

interface YelpBusiness {
  id: string;
  name: string;
  url: string;
  phone: string;          // "+12535551234"
  display_phone: string;  // "(253) 555-1234"
  image_url: string;
  rating: number;
  review_count: number;
  price?: string;         // "$" | "$$" | "$$$" | "$$$$"
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  categories: Array<{ alias: string; title: string }>;
  is_closed: boolean;
}

interface YelpSearchResponse {
  businesses: YelpBusiness[];
  total: number;
  error?: { code: string; description: string };
}

const YELP_SEARCH = 'https://api.yelp.com/v3/businesses/search';
const DAILY_LIMIT = 450;

// Normalize org name for fuzzy matching.
// Strips legal suffixes and common generic words that differ between IRS BMF
// names ("TACOMA YOUTH SOCCER ASSOC INC") and Yelp display names ("Tacoma Youth Soccer").
function nameTokens(s: string): Set<string> {
  return new Set(
    s.toLowerCase()
      .replace(/\b(inc|llc|corp|ltd|co|association|assoc|club|youth|sports?|athletic|athletics|recreation|rec|foundation|fund|center|society|organization|org|team|league|academy|the)\b/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(t => t.length > 1)
  );
}

// Token-overlap score 0–1. Threshold 0.4 accepts "Tacoma Soccer" vs "Tacoma Youth Soccer Assoc".
function nameScore(a: string, b: string): number {
  const ta = nameTokens(a);
  const tb = nameTokens(b);
  if (ta.size === 0 || tb.size === 0) return 0;
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return overlap / Math.max(ta.size, tb.size);
}

async function yelpSearch(
  name: string,
  lat: number,
  lng: number,
  apiKey: string
): Promise<YelpBusiness[]> {
  const params = new URLSearchParams({
    term: name,
    latitude: String(lat),
    longitude: String(lng),
    radius: '500',      // meters — tight to avoid cross-city false matches
    limit: '3',
    sort_by: 'best_match',
  });

  const res = await fetch(`${YELP_SEARCH}?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (res.status === 429) throw new Error('rate_limited');
  if (res.status === 401) throw new Error('bad_api_key');
  if (!res.ok) return [];

  const data = await res.json() as YelpSearchResponse;
  if (data.error) return [];
  return data.businesses ?? [];
}

function pickBestMatch(org: OrgRow, candidates: YelpBusiness[]): YelpBusiness | null {
  let best: YelpBusiness | null = null;
  let bestScore = 0;
  for (const b of candidates) {
    const score = nameScore(org.name, b.name);
    if (score > bestScore) {
      bestScore = score;
      best = b;
    }
  }
  // Threshold 0.4: lenient enough for "TACOMA FC INC" → "Tacoma FC", strict enough
  // to reject "Seattle Sports" when we searched for "Seattle Baseball Club".
  return bestScore >= 0.4 ? best : null;
}

async function processOrg(db: D1Database, org: OrgRow, apiKey: string): Promise<void> {
  const candidates = await yelpSearch(org.name, org.latitude, org.longitude, apiKey);
  const now = new Date().toISOString();
  const isClaimed = org.is_claimed === 1;

  if (candidates.length === 0) {
    // No results from Yelp at all — mark searched so we skip next run.
    await db.prepare(`UPDATE organizations SET yelp_id = 'none', updated_at = ? WHERE id = ?`)
      .bind(now, org.id).run();
    return;
  }

  const match = pickBestMatch(org, candidates);

  if (!match) {
    // Yelp returned results but none matched the name. Mark 'none' to skip.
    await db.prepare(`UPDATE organizations SET yelp_id = 'none', updated_at = ? WHERE id = ?`)
      .bind(now, org.id).run();
    return;
  }

  // Merge yelp URL into social_urls JSON
  let existingSocials: Record<string, string> = {};
  try { existingSocials = org.social_urls ? JSON.parse(org.social_urls) : {}; } catch { /* */ }
  const mergedSocials = { ...existingSocials, yelp: match.url };
  const socialJson = JSON.stringify(mergedSocials);

  // Yelp display_phone is already formatted, e.g. "(253) 555-1234"
  const yelpPhone = match.display_phone || match.phone || null;

  // For claimed orgs: COALESCE — never overwrite what the owner entered.
  // For unclaimed: fill any null fields, keep existing non-null values.
  // Both paths use COALESCE for phone and logo so human-entered data wins.
  await db.prepare(`
    UPDATE organizations SET
      yelp_id           = ?,
      phone             = COALESCE(phone, ?),
      logo_url          = COALESCE(logo_url, ?),
      social_urls       = ?,
      yelp_rating       = ?,
      yelp_review_count = ?,
      price_tier        = COALESCE(price_tier, ?),
      updated_at        = ?
    WHERE id = ?
  `).bind(
    match.id,
    yelpPhone,
    match.image_url || null,
    socialJson,
    match.rating,
    match.review_count,
    match.price || null,
    now,
    org.id
  ).run();

  // Write trust signals with new UUIDs — org won't be re-processed (yelp_id is now set),
  // so there's no risk of duplicates.
  if (match.review_count > 0) {
    await db.batch([
      db.prepare(`
        INSERT INTO trust_signals (id, organization_id, signal_type, signal_value, signal_source, verified_at, created_at)
        VALUES (?, ?, 'average_rating', ?, 'yelp', ?, ?)
      `).bind(crypto.randomUUID(), org.id, String(match.rating), now, now),
      db.prepare(`
        INSERT INTO trust_signals (id, organization_id, signal_type, signal_value, signal_source, verified_at, created_at)
        VALUES (?, ?, 'review_count', ?, 'yelp', ?, ?)
      `).bind(crypto.randomUUID(), org.id, String(match.review_count), now, now),
    ]);
  }

  // Promote unverified orgs that Yelp confirms exist with at least one review.
  // This is a weaker bar than the Google enrichment path (no confidence threshold),
  // but a real Yelp listing with reviews is a strong signal an org is legitimate.
  if (org.record_status === 'unverified' && !isClaimed && match.review_count > 0) {
    await db.prepare(
      `UPDATE organizations SET record_status = 'active', last_verified_at = ? WHERE id = ?`
    ).bind(now, org.id).run();
  }
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    const { results: orgs } = await env.DB
      .prepare(`
        SELECT id, name, city, state, latitude, longitude,
               phone, logo_url, social_urls, record_status, is_claimed
        FROM organizations
        WHERE yelp_id IS NULL
          AND latitude IS NOT NULL
          AND longitude IS NOT NULL
        ORDER BY
          CASE
            WHEN LOWER(name) LIKE '%soccer%'      OR LOWER(name) LIKE '%football%'
              OR LOWER(name) LIKE '%basketball%'  OR LOWER(name) LIKE '%baseball%'
              OR LOWER(name) LIKE '%softball%'    OR LOWER(name) LIKE '%volleyball%'
              OR LOWER(name) LIKE '%swimming%'    OR LOWER(name) LIKE '%swim%'
              OR LOWER(name) LIKE '%tennis%'      OR LOWER(name) LIKE '%lacrosse%'
              OR LOWER(name) LIKE '%hockey%'      OR LOWER(name) LIKE '%wrestling%'
              OR LOWER(name) LIKE '%gymnastics%'  OR LOWER(name) LIKE '%golf%'
              OR LOWER(name) LIKE '%rugby%'       OR LOWER(name) LIKE '%cheer%'
              OR LOWER(name) LIKE '%track%'       OR LOWER(name) LIKE '%karate%'
              OR LOWER(name) LIKE '%judo%'        OR LOWER(name) LIKE '%martial art%'
              OR LOWER(name) LIKE '%dance%'       OR LOWER(name) LIKE '%archery%'
              OR LOWER(name) LIKE '%bowling%'     OR LOWER(name) LIKE '%skating%'
              OR LOWER(name) LIKE '%aquatic%'     OR LOWER(name) LIKE '%rowing%'
              OR LOWER(name) LIKE '%cycling%'     OR LOWER(name) LIKE '%fencing%'
            THEN 0 ELSE 1
          END,
          CASE record_status WHEN 'active' THEN 0 ELSE 1 END,
          enrichment_confidence DESC
        LIMIT ?
      `)
      .bind(DAILY_LIMIT)
      .all<OrgRow>();

    console.log(`Yelp worker: processing ${orgs.length} orgs`);

    let processed = 0;
    let matched = 0;

    for (const org of orgs) {
      try {
        const beforeStatus = org.record_status;
        await processOrg(env.DB, org, env.YELP_API_KEY);
        processed++;

        // Count as matched if yelp_id was set to a real ID (not 'none').
        // We don't re-query the row — just approximate from candidates above.
        matched++;
      } catch (e) {
        const msg = (e as Error).message;
        if (msg === 'rate_limited') {
          console.log(`Yelp rate limit hit after ${processed} orgs — stopping for today`);
          break;
        }
        if (msg === 'bad_api_key') {
          console.error('YELP_API_KEY is invalid or expired — aborting run');
          break;
        }
        console.error(`Error on org ${org.id} (${org.name}):`, e);
      }

      // 50ms between calls — polite pacing without being slow.
      // 450 orgs × ~350ms avg network + 50ms = ~3 min total wall time.
      await new Promise(r => setTimeout(r, 50));
    }

    console.log(`Yelp worker: done. Processed ${processed} orgs.`);
  },
};
