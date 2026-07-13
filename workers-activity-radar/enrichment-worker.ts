// Scheduled Cloudflare Worker: camp scan. Runs hourly. NO API, NO key.
//
// The browser discovery pass (buildout/hit-rate-test) finds each org's website and
// seeds camp_scan_queue with the URL. This worker takes that URL, fetches the page
// directly (a plain HTTP GET, not a search API), and pulls EVERY camp it can find:
//   - structured data first (schema.org JSON-LD Event / Course / SportsEvent), then
//   - repeated camp/session blocks in the HTML.
// It writes one program row per camp with all the data the page yields (name, dates,
// price, ages, times, registration link, location, day/overnight, etc.), marks the
// org camp_detected, and sets the program's pcd_status via campApproval(). Under the
// low threshold a camp with a name, a location, and one actionable or readable field
// is created pcd_status='approved' (record_status='active'), so it shows in parent
// search right away. Thin or placeless records are created 'pending' for a human.
//
// Deploy: cd workers-activity-radar && npx wrangler deploy --config wrangler.toml
// Test:   cd workers-activity-radar && npx wrangler dev --test-scheduled

export interface Env {
  DB: D1Database;
  // Optional shared secret for the manual /?key=... trigger. Set with:
  //   npx wrangler secret put RUN_KEY --config wrangler.toml
  RUN_KEY?: string;
}

interface CampQueueRow {
  id: string;
  org_id: string;
  website_url: string;
  attempts: number;
}

// ---------------------------------------------------------------------------
// Fetch (direct, no API)
// ---------------------------------------------------------------------------

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ActivityRadar/1.0; +https://activityradar.com)' },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function resolveUrl(href: string, base: string): string | null {
  try {
    const url = new URL(href, base);
    if (url.origin !== new URL(base).origin) return null;
    return url.href;
  } catch {
    return null;
  }
}

function decodeEntities(s: string): string {
  return (s || '')
    .replace(/&amp;/g, '&').replace(/&#38;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripTags(s: string): string {
  return decodeEntities((s || '').replace(/<[^>]+>/g, ' '));
}

function slugify(text: string, fallback: string): string {
  const s = (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return s || fallback;
}

// ---------------------------------------------------------------------------
// Field extractors — each runs on one camp's chunk of HTML/text
// ---------------------------------------------------------------------------

const MONTH_MAP: Record<string, string> = {
  january:'01', february:'02', march:'03', april:'04', may:'05', june:'06',
  july:'07', august:'08', september:'09', october:'10', november:'11', december:'12',
};
function monthNum(name: string): string { return MONTH_MAP[name.toLowerCase()] ?? '01'; }
const MONTH_PAT = Object.keys(MONTH_MAP).join('|');

function extractDateRange(html: string): { sessionStart: string | null; sessionEnd: string | null } {
  const crossRe = new RegExp(`(${MONTH_PAT})\\s+(\\d{1,2})\\s*[-–—]\\s*(${MONTH_PAT})\\s+(\\d{1,2})(?:,?\\s*(20\\d{2}))?`, 'i');
  let m = crossRe.exec(html);
  if (m) {
    const yr = m[5] ?? String(new Date().getFullYear());
    return { sessionStart: `${yr}-${monthNum(m[1])}-${m[2].padStart(2,'0')}`, sessionEnd: `${yr}-${monthNum(m[3])}-${m[4].padStart(2,'0')}` };
  }
  const sameRe = new RegExp(`(${MONTH_PAT})\\s+(\\d{1,2})\\s*[-–—]\\s*(\\d{1,2})(?:,?\\s*(20\\d{2}))?`, 'i');
  m = sameRe.exec(html);
  if (m) {
    const yr = m[4] ?? String(new Date().getFullYear());
    return { sessionStart: `${yr}-${monthNum(m[1])}-${m[2].padStart(2,'0')}`, sessionEnd: `${yr}-${monthNum(m[1])}-${m[3].padStart(2,'0')}` };
  }
  const singleRe = new RegExp(`(${MONTH_PAT})\\s+(\\d{1,2})(?:,?\\s*(20\\d{2}))`, 'i');
  m = singleRe.exec(html);
  if (m) {
    const yr = m[3] ?? String(new Date().getFullYear());
    return { sessionStart: `${yr}-${monthNum(m[1])}-${m[2].padStart(2,'0')}`, sessionEnd: null };
  }
  return { sessionStart: null, sessionEnd: null };
}

function extractPrice(html: string): { price: number | null; priceType: string | null; priceText: string | null } {
  const m = /\$\s*([\d,]+(?:\.\d{2})?)\s*(?:(?:per|\/)\s*(week|day|session|season|month|year))?/i.exec(html);
  if (!m) return { price: null, priceType: null, priceText: null };
  const price = parseFloat(m[1].replace(/,/g, ''));
  if (price < 5 || price > 15000) return { price: null, priceType: null, priceText: null };
  return { price, priceType: m[2]?.toLowerCase() ?? null, priceText: m[0].trim() };
}

function extractAgeRange(html: string): { ageMin: number | null; ageMax: number | null } {
  const m = /(?:ages?\s+(\d+)\s*[-–to]+\s*(\d+))|(?:grades?\s+(\d+)\s*[-–to]+\s*(\d+))|(?:ages?\s+(\d+)\+)/i.exec(html);
  if (!m) return { ageMin: null, ageMax: null };
  if (m[5]) return { ageMin: parseInt(m[5]), ageMax: 18 };
  const isGrade = !!m[3];
  const lo = parseInt(m[1] ?? m[3]);
  const hi = parseInt(m[2] ?? m[4]);
  return { ageMin: isGrade ? lo + 5 : lo, ageMax: isGrade ? hi + 5 : hi };
}

function extractSeason(html: string): string | null {
  if (/\bsummer\b/i.test(html)) return 'summer';
  if (/\bspring\b/i.test(html)) return 'spring';
  if (/\bfall\b|\bautumn\b/i.test(html)) return 'fall';
  if (/\bwinter\b/i.test(html)) return 'winter';
  return null;
}
function extractDayOrOvernight(html: string): string | null {
  if (/overnight\s+camp|resident(?:ial)?\s+camp|sleepaway/i.test(html)) return 'overnight';
  if (/day\s+camp/i.test(html)) return 'day';
  return null;
}
function extractLunchIncluded(html: string): number | null {
  return /lunch\s+(is\s+)?(?:included|provided)|includes?\s+lunch/i.test(html) ? 1 : null;
}
function extractAftercareAvailable(html: string): number | null {
  return /after.?care|extended\s+care|after\s+camp/i.test(html) ? 1 : null;
}
function extractScheduleText(html: string): string | null {
  const m = /(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)[^\n<]{0,60}(?:\d{1,2}(?::\d{2})?\s*(?:am|pm))/i.exec(html);
  return m ? m[0].trim().replace(/\s+/g, ' ').slice(0, 200) : null;
}
function extractDaysOfWeek(html: string): string | null {
  const all = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
  const found = all.filter(d => new RegExp(`\\b${d.slice(0,3)}`, 'i').test(html));
  return found.length > 0 ? JSON.stringify(found) : null;
}
function extractTimes(html: string): { startTime: string | null; endTime: string | null } {
  const m = /(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*[-–to]+\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i.exec(html);
  return m ? { startTime: m[1].trim(), endTime: m[2].trim() } : { startTime: null, endTime: null };
}
function extractSkillLevel(html: string): string | null {
  if (/all\s+(?:levels?|abilities|skills)/i.test(html)) return 'all_levels';
  if (/beginner/i.test(html)) return 'beginner';
  if (/intermediate/i.test(html)) return 'intermediate';
  if (/advanced|elite|competitive/i.test(html)) return 'advanced';
  return null;
}
function metaDescription(html: string): string | null {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{10,500})["']/i,
    /<meta[^>]+content=["']([^"']{10,500})["'][^>]+name=["']description["']/i,
  ];
  for (const re of patterns) { const m = re.exec(html); if (m) return m[1].trim().slice(0, 500); }
  return null;
}
function telPhone(html: string): string | null {
  const m = /href="tel:([^"]+)"/.exec(html);
  return m ? m[1].trim() : null;
}
function extractSocialUrls(html: string): Record<string, string> {
  const out: Record<string, string> = {};
  const fb = /href="(https?:\/\/(?:www\.)?facebook\.com\/(?!sharer)[^"?#]+)"/.exec(html);
  if (fb) out.facebook = fb[1];
  const ig = /href="(https?:\/\/(?:www\.)?instagram\.com\/(?!p\/)[^"?#]+)"/.exec(html);
  if (ig) out.instagram = ig[1];
  return out;
}

// Activity category from a camp name, falling back to the org's category.
function categoryFromName(name: string, fallback: string): string {
  const n = (name || '').toLowerCase();
  const map: [RegExp, string][] = [
    [/soccer|futsal/, 'soccer'], [/basketball|hoops/, 'basketball'],
    [/baseball|softball|tee.?ball/, 'baseball_softball'], [/football|flag\s*football/, 'football'],
    [/tennis/, 'tennis'], [/swim|aquatic/, 'swimming'], [/volleyball/, 'volleyball'],
    [/dance|ballet/, 'dance'], [/theat(er|re)|drama/, 'theater'], [/music|band|orchestra/, 'music'],
    [/art|paint|craft/, 'arts_crafts'], [/lacrosse/, 'other'], [/golf/, 'other'],
    [/stem|robot|coding|science/, 'other'],
  ];
  for (const [re, cat] of map) if (re.test(n)) return cat;
  return fallback;
}

// ---------------------------------------------------------------------------
// Camp shape
// ---------------------------------------------------------------------------

export interface CampData {
  name:             string;
  campUrl:          string;
  description:      string | null;
  sessionStart:     string | null;
  sessionEnd:       string | null;
  price:            number | null;
  priceType:        string | null;
  priceText:        string | null;
  ageMin:           number | null;
  ageMax:           number | null;
  season:           string | null;
  dayOrOvernight:   string | null;
  lunchIncluded:    number | null;
  aftercareAvail:   number | null;
  scheduleText:     string | null;
  daysOfWeek:       string | null;
  startTime:        string | null;
  endTime:          string | null;
  skillLevel:       string | null;
  locationName:     string | null;
  registrationUrl:  string | null;
}

function fieldsFromChunk(name: string, chunkHtml: string, campUrl: string): CampData {
  const text = stripTags(chunkHtml);
  const { sessionStart, sessionEnd } = extractDateRange(text);
  const { price, priceType, priceText } = extractPrice(text);
  const { ageMin, ageMax } = extractAgeRange(text);
  const { startTime, endTime } = extractTimes(text);
  return {
    name: name || 'Camp',
    campUrl,
    description: text.length > 40 ? text.slice(0, 600) : null,
    sessionStart, sessionEnd,
    price, priceType, priceText,
    ageMin, ageMax,
    season: extractSeason(text),
    dayOrOvernight: extractDayOrOvernight(text),
    lunchIncluded: extractLunchIncluded(text),
    aftercareAvail: extractAftercareAvailable(text),
    scheduleText: extractScheduleText(text),
    daysOfWeek: extractDaysOfWeek(text),
    startTime, endTime,
    skillLevel: extractSkillLevel(text),
    locationName: null,
    registrationUrl: extractRegistrationUrl(chunkHtml, campUrl),
  };
}

function extractRegistrationUrl(html: string, baseUrl: string): string | null {
  const platformRe = /href=["'](https?:\/\/(?:[^"']*\.)?(?:sportsengine|sportngin|activityhero|leagueapps|sportssignup|raceentry|ultracamp|campbrain|campmanager|campwise|doubleknot|regpack|jumbula|daxko|active|gotsport|teamsnap|playmetrics|bluesombrero|jerseywatch)[^"']*)['"]/i;
  const pm = platformRe.exec(html);
  if (pm) return pm[1];
  const re = /href=["']([^"']+)["'][^>]*>[^<]*(register|sign[\s-]?up|enroll|apply|book)[^<]*<\/a>/gi;
  let rm: RegExpExecArray | null;
  while ((rm = re.exec(html)) !== null) {
    const resolved = resolveUrl(rm[1], baseUrl) ?? (rm[1].startsWith('http') ? rm[1] : null);
    if (resolved) return resolved;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Source 1: schema.org JSON-LD (the reliable path)
// ---------------------------------------------------------------------------

const CAMP_TYPES = /^(event|educationevent|sportsevent|businessevent|childrensevent|course|festival|dayofweek)$/i;

function collectNodes(obj: any, out: any[]): void {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { for (const x of obj) collectNodes(x, out); return; }
  if (obj['@graph']) collectNodes(obj['@graph'], out);
  const t = obj['@type'];
  const types = Array.isArray(t) ? t : [t];
  if (types.some((x: any) => typeof x === 'string' && CAMP_TYPES.test(x))) out.push(obj);
  for (const k of Object.keys(obj)) {
    if (k !== '@graph' && obj[k] && typeof obj[k] === 'object') collectNodes(obj[k], out);
  }
}

function priceFromOffers(offers: any): { price: number | null; priceText: string | null } {
  if (!offers) return { price: null, priceText: null };
  const o = Array.isArray(offers) ? offers[0] : offers;
  const raw = o?.price ?? o?.lowPrice ?? o?.priceSpecification?.price;
  if (raw == null) return { price: null, priceText: null };
  const num = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/[^\d.]/g, ''));
  if (!isFinite(num) || num < 5 || num > 15000) return { price: null, priceText: null };
  return { price: num, priceText: `$${num}` };
}

function campsFromJsonLd(html: string, baseUrl: string): CampData[] {
  const out: CampData[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  const nodes: any[] = [];
  while ((m = re.exec(html)) !== null) {
    let parsed: any;
    try { parsed = JSON.parse(m[1].trim()); } catch { continue; }
    collectNodes(parsed, nodes);
  }
  for (const n of nodes) {
    const name = decodeEntities(String(n.name ?? '')).slice(0, 200);
    if (!name) continue;
    const start = n.startDate ? String(n.startDate).slice(0, 10) : null;
    const end = n.endDate ? String(n.endDate).slice(0, 10) : null;
    const { price, priceText } = priceFromOffers(n.offers);
    const loc = n.location?.name ? decodeEntities(String(n.location.name)).slice(0, 200) : null;
    const regUrl = (Array.isArray(n.offers) ? n.offers[0]?.url : n.offers?.url) ?? n.url ?? null;
    const desc = n.description ? decodeEntities(String(n.description)).slice(0, 600) : null;
    out.push({
      name, campUrl: regUrl || baseUrl, description: desc,
      sessionStart: start && /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : null,
      sessionEnd: end && /^\d{4}-\d{2}-\d{2}$/.test(end) ? end : null,
      price, priceType: null, priceText,
      ageMin: null, ageMax: null,
      season: extractSeason(name + ' ' + (desc ?? '')),
      dayOrOvernight: null, lunchIncluded: null, aftercareAvail: null,
      scheduleText: null, daysOfWeek: null, startTime: null, endTime: null,
      skillLevel: null, locationName: loc,
      registrationUrl: regUrl ? (resolveUrl(String(regUrl), baseUrl) ?? String(regUrl)) : null,
    });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Source 2: repeated camp/session blocks (heuristic fallback)
// ---------------------------------------------------------------------------

const NAME_WORD = /(camp|clinic|session|academy|class|program|league|workshop|intensive)/i;

// Split the page into blocks at heading / list / card boundaries, keep blocks that
// name a camp and carry a date or price, and pull a name + fields from each.
function campsFromBlocks(html: string, baseUrl: string): CampData[] {
  const out: CampData[] = [];
  const seen = new Set<string>();
  // Each block starts at a heading or list/card open tag.
  const blockRe = /<(h[1-4]|li|article|section|div)[^>]*>([\s\S]*?)(?=<(?:h[1-4]|li|article|section)\b|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html)) !== null) {
    const chunk = m[0];
    const text = stripTags(chunk);
    if (text.length < 12 || text.length > 4000) continue;
    if (!NAME_WORD.test(text)) continue;
    const hasDate = new RegExp(`(${MONTH_PAT})\\s+\\d{1,2}|20\\d{2}`, 'i').test(text);
    const hasPrice = /\$\s*\d/.test(text);
    if (!hasDate && !hasPrice) continue;
    // Name: the heading text, else the first sentence mentioning a camp word.
    let name = '';
    const h = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i.exec(chunk);
    if (h) name = stripTags(h[1]).slice(0, 200);
    if (!name) {
      const s = text.split(/[.!?]/).find(x => NAME_WORD.test(x));
      name = (s ?? text).trim().slice(0, 120);
    }
    const key = name.toLowerCase().replace(/\s+/g, ' ');
    if (!name || seen.has(key)) continue;
    seen.add(key);
    out.push(fieldsFromChunk(name, chunk, baseUrl));
    if (out.length >= 50) break; // safety cap per page
  }
  return out;
}

// ---------------------------------------------------------------------------
// Pull ALL camps from a page: JSON-LD first, then blocks, then whole-page fallback.
// ---------------------------------------------------------------------------

function extractAllCamps(html: string, baseUrl: string, orgName: string): CampData[] {
  const fromLd = campsFromJsonLd(html, baseUrl);
  if (fromLd.length) return fromLd;
  const fromBlocks = campsFromBlocks(html, baseUrl);
  if (fromBlocks.length) return fromBlocks;
  if (hasCampSignal(html)) {
    const single = fieldsFromChunk(`${orgName} Camp`, html, baseUrl);
    return [single];
  }
  return [];
}

function hasCampSignal(html: string): boolean {
  const lower = html.toLowerCase();
  if (!/\bcamp(s)?\b/.test(lower)) return false;
  const hasReg = /register|sign.?up|enroll|apply now|get started|book now/i.test(lower);
  const hasDate = /\b(january|february|march|april|may|june|july|august|september|october|november|december|20\d{2})\b/i.test(lower);
  const hasPrice = /\$\s*\d+|\d+\s*(per|\/)\s*(day|week|session)/i.test(lower);
  return hasReg || hasDate || hasPrice;
}

// Skip non-page assets (css/js/images/fonts) and the case where "camp" only
// appears in the host (e.g. camptentrees.org) rather than the path.
function isAssetUrl(u: string): boolean {
  return /\.(css|js|mjs|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|pdf|xml|json|map)(\?|$)/i.test(u);
}
function campInPath(u: string): boolean {
  try { return /camp/i.test(new URL(u).pathname); } catch { return false; }
}

function findCampLink(html: string, baseUrl: string): string | null {
  const hrefRe = /href=["']([^"'#?]*camp[^"']*?)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = hrefRe.exec(html)) !== null) {
    const r = resolveUrl(m[1], baseUrl);
    if (r && r !== baseUrl && !isAssetUrl(r) && campInPath(r)) return r;
  }
  const anchorRe = /<a[^>]+href=["']([^"']+)["'][^>]*>[^<]*camp[^<]*<\/a>/gi;
  while ((m = anchorRe.exec(html)) !== null) {
    const r = resolveUrl(m[1], baseUrl);
    if (r && r !== baseUrl && !isAssetUrl(r)) return r;
  }
  return null;
}

// ---------------------------------------------------------------------------
// DB writes
// ---------------------------------------------------------------------------

// Low-threshold auto-approval for scraped camps. Mirrors CAMPS_APPROVAL_THRESHOLD.md.
// Default is to go live: a scraped camp is approved when it has a real name, a
// location on its org, and at least one thing a parent can act on or read. Only
// empty or placeless records are held pending for a human. Reruns never override a
// human decision, because the INSERT's ON CONFLICT clause leaves pcd_status untouched.
function campApproval(
  org: { city: string | null; state: string | null },
  c: CampData,
): { status: 'approved' | 'pending'; confidence: 'low' | 'medium' | 'high' } {
  const hasLocation = !!(org.city && org.state);
  const hasName = !!c.name && c.name.trim().toLowerCase() !== 'camp';
  const hasDate = !!(c.sessionStart || c.sessionEnd);
  const hasReg = !!c.registrationUrl;
  const hasPrice = c.price != null || !!c.priceText;
  const hasDescription = !!c.description && c.description.trim().length >= 120;
  const actionable = hasDate || hasReg || hasPrice;
  if (!hasLocation || !hasName || !(actionable || hasDescription)) {
    return { status: 'pending', confidence: 'low' };
  }
  const isFuture = !!c.sessionEnd && c.sessionEnd >= new Date().toISOString().slice(0, 10);
  if (isFuture && (hasReg || hasPrice)) return { status: 'approved', confidence: 'high' };
  if (actionable) return { status: 'approved', confidence: 'medium' };
  return { status: 'approved', confidence: 'low' };
}

async function writeCamp(db: D1Database, org: { id: string; name: string; slug: string; categories: string | null; city: string | null; state: string | null }, c: CampData, sourceDomain: string, now: string): Promise<void> {
  let fallbackCat = 'camp_sports';
  try { const cats: string[] = org.categories ? JSON.parse(org.categories) : []; if (cats.length) fallbackCat = cats[0]; } catch { /* default */ }
  const activityCategory = categoryFromName(c.name, fallbackCat);
  const datePart = c.sessionStart ?? '';
  const slug = `${org.slug}-${slugify(c.name + '-' + datePart, 'camp-' + Math.random().toString(36).slice(2, 8))}`.slice(0, 120);

  const approval = campApproval(org, c);
  const pcdStatus = approval.status;
  const pcdConfidence = approval.confidence;
  const recordStatus = pcdStatus === 'approved' ? 'active' : 'unverified';
  const awaitingReview = pcdStatus === 'approved' ? 0 : 1;
  const reviewedBy = pcdStatus === 'approved' ? 'enrichment-worker (auto-approve)' : null;
  const reviewedAt = pcdStatus === 'approved' ? now : null;
  const reviewNotes = pcdStatus === 'approved' ? 'low-threshold auto-approve' : 'held: below info threshold';

  await db.prepare(`
    INSERT INTO programs (
      id, organization_id, slug, name, program_type, activity_category,
      description, age_min, age_max,
      price, price_type, price_text,
      registration_url, location_notes,
      session_start_date, session_end_date,
      season, day_or_overnight,
      lunch_included, aftercare_available,
      schedule_text, days_of_week, start_time, end_time,
      skill_level, source_domain, url_health_status,
      availability_status, record_source, record_status, confidence_score,
      pcd_status, pcd_confidence, awaiting_review, reviewed_by, reviewed_at, review_notes,
      created_at, last_verified_at, updated_at
    )
    VALUES (?, ?, ?, ?, 'camp', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'live', 'open', 'scraped', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(slug) DO UPDATE SET
      session_start_date = excluded.session_start_date,
      session_end_date   = excluded.session_end_date,
      price              = COALESCE(excluded.price, programs.price),
      registration_url   = COALESCE(excluded.registration_url, programs.registration_url),
      last_verified_at   = excluded.last_verified_at,
      updated_at         = excluded.updated_at
  `).bind(
    crypto.randomUUID(), org.id, slug, c.name.slice(0, 200),
    activityCategory,
    c.description, c.ageMin, c.ageMax,
    c.price, c.priceType, c.priceText,
    c.registrationUrl, c.locationName,
    c.sessionStart, c.sessionEnd,
    c.season, c.dayOrOvernight,
    c.lunchIncluded, c.aftercareAvail,
    c.scheduleText, c.daysOfWeek, c.startTime, c.endTime,
    c.skillLevel, sourceDomain,
    recordStatus,
    c.price || c.sessionStart ? 60 : 40,
    pcdStatus, pcdConfidence, awaitingReview, reviewedBy, reviewedAt, reviewNotes,
    now, now, now
  ).run();
}

async function markNoCamps(db: D1Database, orgId: string, queueId: string, now: string): Promise<void> {
  await db.prepare(`UPDATE organizations SET camp_detected = 0, updated_at = ? WHERE id = ?`).bind(now, orgId).run();
  await db.prepare(`UPDATE camp_scan_queue SET status = 'done', camp_detected = 0, scanned_at = ? WHERE id = ?`).bind(now, queueId).run();
}

async function processCampRow(db: D1Database, row: CampQueueRow): Promise<'done' | 'retry'> {
  const now = new Date().toISOString();
  const org = await db
    .prepare('SELECT id, name, slug, city, state, categories, phone, description, social_urls FROM organizations WHERE id = ?')
    .bind(row.org_id)
    .first<{ id: string; name: string; slug: string; city: string | null; state: string | null; categories: string | null; phone: string | null; description: string | null; social_urls: string | null }>();
  if (!org) return 'done';

  const html = await fetchText(row.website_url);
  if (!html) return 'retry';

  let sourceDomain = '';
  try { sourceDomain = new URL(row.website_url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }

  // Light org-level enrichment from the homepage (no API): description, phone, socials.
  const desc = metaDescription(html);
  const phone = telPhone(html);
  const socials = extractSocialUrls(html);
  let existingSocials: Record<string, string> = {};
  try { existingSocials = org.social_urls ? JSON.parse(org.social_urls) : {}; } catch { /* ignore */ }
  const mergedSocials = { ...socials, ...existingSocials };
  const socialJson = Object.keys(mergedSocials).length ? JSON.stringify(mergedSocials) : null;
  await db.prepare(`
    UPDATE organizations SET
      description = COALESCE(description, ?), phone = COALESCE(phone, ?),
      social_urls = COALESCE(social_urls, ?), last_enriched_at = ?, updated_at = ?
    WHERE id = ?
  `).bind(desc, phone, socialJson, now, now, org.id).run();

  if (!/\bcamp(s)?\b/i.test(html)) { await markNoCamps(db, org.id, row.id, now); return 'done'; }

  // Pull all camps from the homepage, plus the dedicated camp page if there is one.
  const camps: CampData[] = [];
  camps.push(...extractAllCamps(html, row.website_url, org.name));
  const campLink = findCampLink(html, row.website_url);
  if (campLink) {
    const campHtml = await fetchText(campLink);
    if (campHtml) camps.push(...extractAllCamps(campHtml, campLink, org.name));
  }

  // Dedup by name+start.
  const unique = new Map<string, CampData>();
  for (const c of camps) {
    const key = (c.name + '|' + (c.sessionStart ?? '')).toLowerCase();
    if (!unique.has(key)) unique.set(key, c);
  }

  if (unique.size === 0) { await markNoCamps(db, org.id, row.id, now); return 'done'; }

  const campUrl = campLink ?? row.website_url;
  for (const c of unique.values()) await writeCamp(db, org, c, sourceDomain, now);

  await db.prepare(`UPDATE organizations SET camp_detected = 1, camp_url = ?, record_status = 'active', last_verified_at = ?, updated_at = ? WHERE id = ?`)
    .bind(campUrl, now, now, org.id).run();
  await db.prepare(`UPDATE camp_scan_queue SET status = 'done', camp_detected = 1, camp_url = ?, scanned_at = ? WHERE id = ?`)
    .bind(campUrl, now, row.id).run();
  return 'done';
}

// ---------------------------------------------------------------------------
// Scheduled handler — camp scan only. No API key needed.
// ---------------------------------------------------------------------------

async function runCampScan(env: Env): Promise<number> {
  const { results: campRows } = await env.DB
    .prepare(`SELECT id, org_id, website_url, attempts FROM camp_scan_queue WHERE status = 'pending' LIMIT 20`)
    .all<CampQueueRow>();

  for (const row of campRows) {
    const ts = new Date().toISOString();
    await env.DB.prepare(`UPDATE camp_scan_queue SET status = 'processing', attempts = attempts + 1 WHERE id = ?`).bind(row.id).run();
    try {
      const outcome = await processCampRow(env.DB, row);
      if (outcome === 'retry') {
        const newAttempts = row.attempts + 1;
        await env.DB.prepare(`UPDATE camp_scan_queue SET status = ?, scanned_at = ? WHERE id = ?`)
          .bind(newAttempts >= 3 ? 'failed' : 'pending', ts, row.id).run();
      }
    } catch {
      await env.DB.prepare(`UPDATE camp_scan_queue SET status = 'pending', scanned_at = ? WHERE id = ?`).bind(ts, row.id).run();
    }
  }
  return campRows.length;
}

export default {
  // Hourly cron.
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    await runCampScan(env);
  },

  // Manual trigger for the deployed worker. Hit:
  //   https://<worker-url>/?key=YOUR_RUN_KEY
  // Runs one scan batch (up to 20 sites) and returns a JSON summary so you can
  // watch data come in without waiting for the cron. Repeat to drain the queue.
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (!env.RUN_KEY || url.searchParams.get('key') !== env.RUN_KEY) {
      return new Response('forbidden', { status: 403 });
    }
    const scanned = await runCampScan(env);
    const q = await env.DB.prepare(`SELECT status, COUNT(*) AS n FROM camp_scan_queue GROUP BY status`).all();
    const camps = await env.DB.prepare(`SELECT COUNT(*) AS n FROM programs WHERE record_source='scraped'`).first<{ n: number }>();
    const detected = await env.DB.prepare(`SELECT COUNT(*) AS n FROM organizations WHERE camp_detected=1`).first<{ n: number }>();
    return Response.json({
      scanned_this_run: scanned,
      queue: q.results,
      camps_scraped_total: camps?.n ?? 0,
      orgs_with_camp: detected?.n ?? 0,
    });
  },
};
