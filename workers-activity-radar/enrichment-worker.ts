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
  // The PCD operational D1. Holds `org_contacts` (migration 0028 in
  // migrations-pcd-ops), the named-human contact layer. Optional on purpose:
  // this worker's real job is the camp scan, and a missing binding or an
  // unapplied 0028 must degrade to "no contacts captured", never to a failed
  // scan. See CONTACT-DATA-MAP.md for why the person lives in a different
  // database than the org.
  PCD_OPS_DB?: D1Database;
  // Optional shared secret for the manual bearer-authenticated trigger. Set with:
  //   npx wrangler secret put RUN_KEY --config wrangler.toml
  RUN_KEY?: string;
  CAMP_ENRICHMENT_ENABLED?: string;
  PCD_MAINTENANCE_MODE?: string;
  // Independent hold on contact capture, separate from CAMP_ENRICHMENT_ENABLED.
  // Contact data is PII with a deletion SLA; it gets its own switch so the camp
  // scan can run without it and it can be killed without stopping the scan.
  CONTACT_CAPTURE_ENABLED?: string;
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

const FETCH_TIMEOUT_MS = 15_000;
const MAX_SOURCE_BYTES = 2 * 1024 * 1024;
const encoder = new TextEncoder();

function enabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function isSafeSourceUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host.endsWith('.local') || host === '::1' || host === '::' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) return false;
    const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (!ipv4) return true;
    const octets = ipv4.slice(1).map(Number);
    if (octets.some((octet) => octet > 255)) return false;
    const [a, b] = octets;
    return !(a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19)) || a >= 224);
  } catch { return false; }
}

function bearerCredential(request: Request): string {
  const header = request.headers.get('authorization') ?? '';
  return header.toLowerCase().startsWith('bearer ') ? header.slice(7).trim() : '';
}

async function secretsMatch(presented: string, expected: string): Promise<boolean> {
  const [a, b] = await Promise.all([crypto.subtle.digest('SHA-256', encoder.encode(presented)), crypto.subtle.digest('SHA-256', encoder.encode(expected))]);
  const left = new Uint8Array(a); const right = new Uint8Array(b); let difference = 0;
  for (let i = 0; i < left.length; i += 1) difference |= left[i] ^ right[i];
  return difference === 0;
}

async function fetchText(url: string): Promise<string | null> {
  if (!isSafeSourceUrl(url)) return null;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ActivityRadar/1.0; +https://activityradar.com)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok || !res.body || !isSafeSourceUrl(res.url)) return null;
    const reader = res.body.getReader(); const chunks: Uint8Array[] = []; let total = 0;
    while (true) { const { done, value } = await reader.read(); if (done) break; total += value.byteLength; if (total > MAX_SOURCE_BYTES) { await reader.cancel(); return null; } chunks.push(value); }
    const joined = new Uint8Array(total); let offset = 0;
    for (const chunk of chunks) { joined.set(chunk, offset); offset += chunk.byteLength; }
    return new TextDecoder().decode(joined);
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

// ---------------------------------------------------------------------------
// Contact capture — the org's general email, and named humans on staff pages
//
// Two different things with two different homes, and the split is the whole
// point (CONTACT-DATA-MAP.md):
//
//   a CHANNEL  (info@org.com)      -> organizations.email, activity-radar DB
//   a PERSON   (Dana Reyes, Camp   -> org_contacts, PCD_OPS_DB
//               Director, dana@...)
//
// activity-radar syndicates wholesale to the SightSmash public directory. The
// moment a person's name is in that database every export becomes a per-row
// privacy decision, so named humans never go there. They go to PCD_OPS_DB and
// they are the CRM's source of truth.
//
// SAFETY POSTURE. This runs unattended against arbitrary third-party HTML on a
// youth-sports site, so it is built to under-capture rather than over-capture:
//   * a name is only kept when a staff TITLE sits next to it. A bare
//     capitalized pair is not a contact, it is a false positive waiting to
//     become a real person's name in a CRM.
//   * roster/participant pages are skipped outright. That is where a minor's
//     name would be, and no title check would save us there.
//   * every row is written is_public = 0. Publishing is a human-only action.
//   * a do_not_contact row is never overwritten, so a re-scan cannot resurrect
//     somebody who opted out. That is the single most important rule here.
// ---------------------------------------------------------------------------

const EMAIL_RE = /[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,24}/g;

// Addresses that are never a contact: transactional senders, vendor/CMS noise,
// tracking stubs, and image filenames the naive regex would otherwise swallow
// (e.g. "logo@2x.png").
const EMAIL_JUNK_RE = new RegExp(
  [
    'no-?reply', 'do-?not-?reply', 'donotreply', 'mailer-daemon', 'postmaster',
    'example\\.(com|org|net)', 'yourdomain', 'domain\\.com', 'email\\.com',
    'sentry\\.io', 'wixpress', 'squarespace', 'godaddy', 'wordpress', 'shopify',
    'cloudflare', 'google-?analytics', 'facebook\\.com', 'schema\\.org',
    '@2x', '\\.(png|jpe?g|gif|svg|webp|css|js|ico|woff2?)$',
    'u003', 'sentry', 'placeholder', 'test@test',
  ].join('|'),
  'i',
);

// Generic mailbox names. These belong to the organization, not to a person, so
// they fill organizations.email and never create a named contact row.
const ROLE_MAILBOX_RE = /^(info|contact|hello|hi|office|admin|administration|mail|inquiries|enquiries|general|frontdesk|front_?desk|reception|support|help|team|staff|camps?|registration|register|programs?|questions|customerservice|service|main)$/i;

function normalizeEmail(raw: string): string | null {
  const e = (raw || '').trim().toLowerCase().replace(/^mailto:/, '').split('?')[0];
  if (!e || e.length > 320) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  if (EMAIL_JUNK_RE.test(e)) return null;
  // A TLD-looking tail of digits is a version string, not an address.
  if (/\.\d+$/.test(e)) return null;
  return e;
}

/**
 * Every usable address on the page, mailto: links first because they are the
 * deliberate ones. Text-scraped addresses follow and are deduped against them.
 */
function extractEmails(html: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const e = normalizeEmail(raw);
    if (e && !seen.has(e)) { seen.add(e); out.push(e); }
  };

  const mailtoRe = /href=["']mailto:([^"'?]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = mailtoRe.exec(html)) !== null) push(m[1]);

  const text = stripTags(html);
  const textRe = new RegExp(EMAIL_RE.source, 'g');
  while ((m = textRe.exec(text)) !== null) push(m[0]);

  return out.slice(0, 40);
}

/** The address that best represents the organization itself. */
function pickOrgEmail(emails: string[]): string | null {
  const role = emails.find((e) => ROLE_MAILBOX_RE.test(e.split('@')[0]));
  return role ?? emails[0] ?? null;
}

// Title keyword -> org_contacts.role enum. Ordered most-specific first; the
// first hit wins, so 'camp director' resolves to director before 'coach' can
// match a later word in the same title.
const ROLE_PATTERNS: [RegExp, string][] = [
  [/\b(owner|founder|co-?founder|proprietor|president|ceo|principal)\b/i, 'owner'],
  [/\b(executive director|camp director|program director|athletic director|director|head of|superintendent)\b/i, 'director'],
  [/\b(registrar|registration|enrollment|admissions)\b/i, 'registrar'],
  [/\b(head coach|assistant coach|coach|instructor|trainer|teacher|counselor)\b/i, 'coach'],
  [/\b(marketing|communications|outreach|social media|publicity)\b/i, 'marketing'],
  [/\b(billing|accounts|accounting|finance|bursar|treasurer)\b/i, 'billing'],
  [/\b(media|press|photographer|videographer)\b/i, 'media'],
  [/\b(office manager|administrator|administrative|coordinator|manager|operations|secretary|supervisor)\b/i, 'admin'],
];

// Word boundaries are kept from the source patterns on purpose: without them
// "admin" matches inside "administration" and the role mapping gets sloppy.
const TITLE_SOURCE = ROLE_PATTERNS.map(([re]) => re.source).join('|');
const TITLE_RE = new RegExp(TITLE_SOURCE, 'gi');
// Non-global twin. TITLE_RE carries lastIndex between calls, so a bare .test()
// on it silently returns the wrong answer every other invocation.
const TITLE_TEST_RE = new RegExp(TITLE_SOURCE, 'i');

// Words that qualify a title rather than being one. They decide the role when
// the matched keyword alone would classify wrong: "Coordinator" on its own is
// admin, but "Marketing Coordinator" is marketing, and the deciding word sits
// to the LEFT of the match.
const TITLE_MODIFIER_RE = /\b(executive|camp|program|athletic|aquatics?|head|assistant|associate|senior|deputy|interim|general|office|business|operations|marketing|communications|admissions|enrollment|membership|facility|volunteer)\s+$/i;

function roleFromTitle(title: string): string {
  for (const [re, role] of ROLE_PATTERNS) if (re.test(title)) return role;
  return 'unknown';
}

// Capitalized pairs that are page furniture, not people. Cheap guard that kills
// the bulk of false positives before the title check even runs.
const NOT_A_NAME_RE = /\b(contact|about|home|our|the|read|learn|sign|get|click|view|more|us|we|you|your|new|summer|winter|spring|fall|camp|camps|youth|sports|team|teams|program|programs|register|registration|privacy|policy|terms|service|copyright|rights|reserved|main|office|front|desk|phone|email|address|street|avenue|road|suite|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december)\b/i;

// Any word that belongs to a job title rather than to a person. A name
// candidate containing one of these is a boundary artifact, not a human:
// "Alicia Moreau Head Coach" otherwise yields the pair "Moreau Head".
const TITLE_WORD_RE = /\b(executive|camp|program|athletic|aquatic|aquatics|head|assistant|associate|senior|deputy|interim|general|office|business|operations|marketing|communications|admissions|enrollment|membership|facility|volunteer|director|coach|coaching|registrar|owner|founder|cofounder|president|ceo|principal|manager|administrator|administrative|coordinator|supervisor|secretary|instructor|trainer|teacher|counselor|billing|accounts|accounting|finance|bursar|treasurer|media|press|photographer|videographer|publicity|outreach|social|registration|staff|team|contact|email|phone)\b/i;

const NAME_TOKEN_RE = /^(?:Mc|Mac|O['’]|Van|Von|De|Del|La)?[A-Z][A-Za-z'’\-]{1,19}$/;
const INITIAL_RE = /^[A-Z]\.?$/;

/**
 * Adjacent capitalized-word pairs that could be a person's name, WITH their
 * position in the context.
 *
 * Deliberately not a single regex. A regex scans left to right and consumes
 * what it matches, so in "Coach Alicia Moreau Head Coach" it locks onto
 * "Coach Alicia" and the real name "Alicia Moreau" is never even offered as a
 * candidate. Tokenizing and sliding a window produces overlapping candidates,
 * so the correct pair is always in the set and the filters below decide.
 */
function candidateNames(context: string): { name: string; index: number }[] {
  const tokens: { w: string; i: number }[] = [];
  const tokenRe = /[A-Za-z'’.\-]+/g;
  let t: RegExpExecArray | null;
  while ((t = tokenRe.exec(context)) !== null) tokens.push({ w: t[0], i: t.index });

  const out: { name: string; index: number }[] = [];
  for (let k = 0; k + 1 < tokens.length; k += 1) {
    const first = tokens[k];
    if (!NAME_TOKEN_RE.test(first.w)) continue;

    // Allow one middle initial: "Jane A. Smith".
    let initial: string | null = null;
    let surnameAt = k + 1;
    if (INITIAL_RE.test(tokens[k + 1].w) && k + 2 < tokens.length) {
      initial = tokens[k + 1].w;
      surnameAt = k + 2;
    }
    const surname = tokens[surnameAt];
    if (!surname || !NAME_TOKEN_RE.test(surname.w)) continue;
    if (INITIAL_RE.test(surname.w)) continue;

    const name = first.w + ' ' + (initial ? initial + ' ' : '') + surname.w;
    if (TITLE_WORD_RE.test(name)) continue;
    if (NOT_A_NAME_RE.test(name)) continue;
    out.push({ name, index: first.i });
  }
  return out;
}

/**
 * Pages that can carry a minor's name. Rosters, player lists, team pages,
 * anything about participants rather than staff. Skipped entirely — there is no
 * title check that reliably separates "Coach Dana Reyes" from a 10-year-old on
 * a roster, so the page never gets parsed for contacts at all.
 */
const MINOR_RISK_URL_RE = /\/(roster|rosters|players?|athletes?|students?|participants?|kids?|campers?|teams?\/|our-?kids|meet-the-(?:team|players|kids))/i;

/** Signals inside a text window that it is describing a child, not a staffer. */
const MINOR_RISK_TEXT_RE = /\b(grade\s*\d|\d{1,2}(?:st|nd|rd|th)\s*grade|ages?\s*\d{1,2}|u-?\d{1,2}\b|born\s+in|birthday|my (?:son|daughter|child)|parent of)\b/i;

export interface ScrapedContact {
  fullName: string | null;
  title: string | null;
  role: string;
  email: string | null;
  confidence: 'high' | 'medium' | 'low';
  sourceUrl: string;
}

/**
 * Named contacts from one page. Anchored on email addresses: for each address,
 * read the surrounding text and keep the name only when a staff title sits
 * beside it. No email, no contact — a name with no way to reach it is not worth
 * the privacy cost of storing it.
 */
export function extractContacts(html: string, pageUrl: string, isStaffPage: boolean): ScrapedContact[] {
  if (MINOR_RISK_URL_RE.test(pageUrl)) return [];

  const text = stripTags(html);
  const out: ScrapedContact[] = [];
  const seen = new Set<string>();

  const haystack = html.toLowerCase();

  for (const email of extractEmails(html)) {
    if (seen.has(email)) continue;

    const local = email.split('@')[0];
    const isRoleMailbox = ROLE_MAILBOX_RE.test(local);

    // Locate the address in the RAW HTML, not the stripped text. A link like
    // <a href="mailto:dana@org.com">Email Dana</a> has the address only in the
    // attribute, so searching stripped text would find nothing and every such
    // contact would lose its name and title. This is the common case on real
    // sites, not the edge case.
    const at = haystack.indexOf(email);
    if (at < 0) continue;

    // Read backwards to just before the address and forwards past it, then
    // strip tags on each side separately so the two stay ordered. The tail of
    // the "before" side is the nearest context, which on a staff card is the
    // person's own name and title.
    const before = stripTags(html.slice(Math.max(0, at - 1500), at)).slice(-240);
    const after = stripTags(html.slice(at, at + 500));
    const context = before + ' | ' + after;
    const emailAt = before.length;

    // Context that reads like it is describing a child is dropped, whatever
    // else it contains.
    if (MINOR_RISK_TEXT_RE.test(context)) continue;

    // The LAST title BEFORE the address wins, not the first one in the window.
    // The window reaches back over the previous person's card, so taking the
    // first match would staple the previous person's title, and then their
    // name, onto this address. Only when nothing precedes the address do we
    // fall forward to the first title after it.
    TITLE_RE.lastIndex = 0;
    let titleMatch: RegExpExecArray | null = null;
    let firstAfter: RegExpExecArray | null = null;
    let tm: RegExpExecArray | null;
    while ((tm = TITLE_RE.exec(context)) !== null) {
      if (tm.index < emailAt) titleMatch = tm;
      else if (!firstAfter) firstAfter = tm;
    }
    if (!titleMatch) titleMatch = firstAfter;

    // Expand the match left across a qualifying word, so the role is decided by
    // the whole title and not just the noun that happened to match.
    let title: string | null = null;
    if (titleMatch) {
      const lead = context.slice(Math.max(0, titleMatch.index - 30), titleMatch.index);
      const mod = TITLE_MODIFIER_RE.exec(lead);
      title = ((mod ? mod[1] + ' ' : '') + titleMatch[0]).trim().slice(0, 160);
    }

    let fullName: string | null = null;
    if (title && titleMatch && !isRoleMailbox) {
      let best: string | null = null;
      let bestDist = Infinity;
      for (const cand of candidateNames(context)) {
        // Prefer the name nearest the title; that pairing is what a staff
        // listing actually looks like.
        const dist = Math.abs(cand.index - titleMatch.index);
        if (dist < bestDist) { bestDist = dist; best = cand.name; }
      }
      // A name more than ~120 chars from its title is probably a different
      // person in a different block.
      if (best && bestDist <= 120) fullName = best.slice(0, 160);
    }

    // A role mailbox with no name is a channel, not a person. It is already
    // captured as organizations.email and does not need a contact row.
    if (!fullName && isRoleMailbox) continue;

    const confidence: 'high' | 'medium' | 'low' =
      fullName && title && isStaffPage ? 'high'
      : fullName && title ? 'medium'
      : 'low';

    seen.add(email);
    out.push({
      fullName,
      title,
      role: title ? roleFromTitle(title) : 'unknown',
      email,
      confidence,
      sourceUrl: pageUrl,
    });
  }

  return out.slice(0, 25);
}

const CONTACT_PAGE_RE = /(contact|about|staff|coaches|coaching|leadership|our-?team|meet-?the-?staff|directory|administration|front-?office)/i;

/** Same-origin links that look like a contact or staff page, best first. */
export function findContactPages(html: string, baseUrl: string, limit = 3): string[] {
  const found: { url: string; score: number }[] = [];
  const seen = new Set<string>();
  const re = /<a[^>]+href=["']([^"'#]+)["'][^>]*>([\s\S]{0,120}?)<\/a>/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(html)) !== null) {
    const href = m[1];
    const label = stripTags(m[2]);
    if (!CONTACT_PAGE_RE.test(href) && !CONTACT_PAGE_RE.test(label)) continue;
    if (MINOR_RISK_URL_RE.test(href)) continue;
    // Never follow an authenticated or transactional path.
    if (/\/(admin|login|account|dashboard|cart|checkout|wp-admin|private)\b/i.test(href)) continue;

    const resolved = resolveUrl(href, baseUrl);
    if (!resolved || seen.has(resolved) || resolved === baseUrl) continue;
    seen.add(resolved);

    // Staff pages beat generic contact pages: they carry names AND titles.
    const score = /staff|coaches|leadership|our-?team|administration/i.test(href + ' ' + label) ? 2 : 1;
    found.push({ url: resolved, score });
  }

  return found.sort((a, b) => b.score - a.score).slice(0, limit).map((f) => f.url);
}

function isStaffUrl(url: string): boolean {
  return /staff|coaches|leadership|our-?team|administration|front-?office|directory/i.test(url);
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Write one contact to org_contacts in PCD_OPS_DB.
 *
 * Deliberately mirrors upsertOrgContact() in src/lib/org-contacts.ts rather
 * than importing it: this worker is a separate deploy unit with zero imports by
 * design. The rules that must stay identical in both places are (1) a
 * do_not_contact row is never written, and (2) is_public is hardcoded to 0. If
 * you change either one, change it in both files.
 *
 * Best-effort throughout. A missing binding or an unapplied 0028 returns false
 * and never breaks the camp scan that is this worker's actual job.
 */
async function writeContact(
  opsDb: D1Database,
  organizationId: string,
  c: ScrapedContact,
  now: string,
): Promise<'created' | 'updated' | 'suppressed' | 'skipped'> {
  if (!c.email && !c.fullName) return 'skipped';

  try {
    const existing = c.email
      ? await opsDb
          .prepare(`SELECT id, do_not_contact FROM org_contacts WHERE organization_id = ? AND email = ? AND deleted_at IS NULL`)
          .bind(organizationId, c.email)
          .first<{ id: string; do_not_contact: number }>()
      : null;

    // The opt-out survives re-discovery. A scraper has no idea this person
    // asked to be left alone; the database does, and it wins.
    if (existing?.do_not_contact === 1) return 'suppressed';

    const contentHash = await sha256Hex(
      [organizationId, '', c.fullName ?? '', c.title ?? '', c.role, c.email ?? '', '', '']
        .join(' ')
        .toLowerCase(),
    );

    if (existing) {
      // COALESCE so a thinner re-scan never erases a richer earlier pass.
      await opsDb
        .prepare(
          `UPDATE org_contacts SET
             full_name    = COALESCE(?, full_name),
             title        = COALESCE(?, title),
             role         = CASE WHEN role = 'unknown' THEN ? ELSE role END,
             source_url   = COALESCE(?, source_url),
             confidence   = ?,
             content_hash = ?,
             updated_at   = ?
           WHERE id = ?`,
        )
        .bind(c.fullName, c.title, c.role, c.sourceUrl, c.confidence, contentHash, now, existing.id)
        .run();
      return 'updated';
    }

    await opsDb
      .prepare(
        `INSERT INTO org_contacts (
           id, organization_id, full_name, title, role, email,
           is_primary, is_public, source, source_url, confidence,
           verification_method, content_hash, created_at, updated_at
         ) VALUES (?,?,?,?,?,?,0,0,'enrichment',?,?, 'website', ?,?,?)`,
      )
      .bind(
        crypto.randomUUID(), organizationId, c.fullName, c.title, c.role, c.email,
        c.sourceUrl, c.confidence, contentHash, now, now,
      )
      .run();
    return 'created';
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err ?? '');
    // 0028 not applied in this environment is an expected state, not a fault.
    if (/no such table/i.test(msg)) return 'skipped';
    // Unique-index collision from a concurrent scan of the same org.
    if (/UNIQUE constraint/i.test(msg)) return 'skipped';
    console.log(JSON.stringify({ event: 'contact_write_failed', organizationId, error: msg.slice(0, 200) }));
    return 'skipped';
  }
}

/**
 * Nominate one contact per org as the primary, so a CRM has an obvious "who do
 * I actually email" without a human sorting 196k orgs by hand.
 *
 * Only ever fills an empty slot. If a human has already set a primary, that
 * choice is theirs and a scraper does not get to relitigate it — the same
 * COALESCE-guarded posture as every other field this worker writes.
 *
 * Ranking is by who can say yes: an owner or director outranks a registrar,
 * a named person outranks a bare address, and a high-confidence extraction
 * outranks a guess.
 */
async function promotePrimary(opsDb: D1Database, organizationId: string, now: string): Promise<void> {
  try {
    const existing = await opsDb
      .prepare(`SELECT id FROM org_contacts WHERE organization_id = ? AND is_primary = 1 AND deleted_at IS NULL`)
      .bind(organizationId)
      .first<{ id: string }>();
    if (existing) return;

    const best = await opsDb
      .prepare(
        `SELECT id FROM org_contacts
          WHERE organization_id = ? AND deleted_at IS NULL AND do_not_contact = 0
          ORDER BY
            CASE role
              WHEN 'owner' THEN 1 WHEN 'director' THEN 2 WHEN 'registrar' THEN 3
              WHEN 'admin'  THEN 4 WHEN 'coach'    THEN 5 WHEN 'marketing' THEN 6
              WHEN 'billing' THEN 7 WHEN 'media'   THEN 8 ELSE 9 END,
            CASE WHEN full_name IS NOT NULL THEN 0 ELSE 1 END,
            CASE confidence WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
            created_at
          LIMIT 1`,
      )
      .bind(organizationId)
      .first<{ id: string }>();
    if (!best) return;

    await opsDb
      .prepare(`UPDATE org_contacts SET is_primary = 1, updated_at = ? WHERE id = ?`)
      .bind(now, best.id)
      .run();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err ?? '');
    // A concurrent scan of the same org won the race for the primary slot.
    if (/no such table|UNIQUE constraint/i.test(msg)) return;
    console.log(JSON.stringify({ event: 'promote_primary_failed', organizationId, error: msg.slice(0, 200) }));
  }
}

/**
 * The contact pass for one org: homepage + up to three contact/staff pages.
 * Returns the org-level email so the caller can fold it into its own UPDATE.
 * Counts only in the log line — never a name, never an address (PII must not
 * reach the log sink; see src/lib/org-contacts.ts header).
 */
async function captureContacts(
  env: Env,
  organizationId: string,
  homepageHtml: string,
  websiteUrl: string,
  now: string,
): Promise<{ orgEmail: string | null }> {
  const homepageEmails = extractEmails(homepageHtml);
  let orgEmail = pickOrgEmail(homepageEmails);

  if (!enabled(env.CONTACT_CAPTURE_ENABLED) || !env.PCD_OPS_DB) {
    return { orgEmail };
  }

  const pages: { url: string; html: string }[] = [{ url: websiteUrl, html: homepageHtml }];
  for (const url of findContactPages(homepageHtml, websiteUrl)) {
    const html = await fetchText(url);
    if (html) pages.push({ url, html });
  }

  // A contact page often holds the real org mailbox when the homepage does not.
  if (!orgEmail) {
    for (const p of pages.slice(1)) {
      orgEmail = pickOrgEmail(extractEmails(p.html));
      if (orgEmail) break;
    }
  }

  const byEmail = new Map<string, ScrapedContact>();
  for (const p of pages) {
    for (const c of extractContacts(p.html, p.url, isStaffUrl(p.url))) {
      const key = c.email ?? c.fullName ?? '';
      const prior = byEmail.get(key);
      // Keep the richest observation of the same person across pages.
      if (!prior || (!prior.fullName && c.fullName) || (prior.confidence === 'low' && c.confidence !== 'low')) {
        byEmail.set(key, c);
      }
    }
  }

  let created = 0, updated = 0, suppressed = 0;
  for (const c of byEmail.values()) {
    const r = await writeContact(env.PCD_OPS_DB, organizationId, c, now);
    if (r === 'created') created += 1;
    else if (r === 'updated') updated += 1;
    else if (r === 'suppressed') suppressed += 1;
  }

  if (created || updated) await promotePrimary(env.PCD_OPS_DB, organizationId, now);

  if (created || updated || suppressed) {
    console.log(JSON.stringify({
      event: 'contacts_captured', organizationId, pages: pages.length,
      created, updated, suppressed,
    }));
  }

  return { orgEmail };
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

// Scraped material is evidence, not publication authority. New records remain
// pending until a governed review approves them; reruns never override a human
// decision because the conflict update leaves pcd_status untouched.
function campApproval(
  org: { city: string | null; state: string | null },
  c: CampData,
): { status: 'approved' | 'pending'; confidence: 'low' | 'medium' | 'high' } {
  void org; void c;
  return { status: 'pending', confidence: 'low' };
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

async function processCampRow(env: Env, row: CampQueueRow): Promise<'done' | 'retry'> {
  const db = env.DB;
  const now = new Date().toISOString();
  const org = await db
    .prepare('SELECT id, name, slug, city, state, categories, phone, email, description, social_urls, is_claimed FROM organizations WHERE id = ?')
    .bind(row.org_id)
    .first<{ id: string; name: string; slug: string; city: string | null; state: string | null; categories: string | null; phone: string | null; email: string | null; description: string | null; social_urls: string | null; is_claimed: number | null }>();
  if (!org) return 'done';

  const html = await fetchText(row.website_url);
  if (!html) return 'retry';

  let sourceDomain = '';
  try { sourceDomain = new URL(row.website_url).hostname.replace(/^www\./, ''); } catch { /* ignore */ }

  // Contact pass. Runs before the camp check so an org with no camps still gets
  // its contacts — a CRM cares about the organization, not about whether this
  // particular scan found a camp on the page.
  //
  // Skipped entirely on a claimed org: once an owner has taken the listing over,
  // their own entered contact details are authoritative and a scraper must not
  // second-guess them.
  const { orgEmail } = org.is_claimed === 1
    ? { orgEmail: null }
    : await captureContacts(env, org.id, html, row.website_url, now);

  // Light org-level enrichment from the homepage (no API): description, phone,
  // email, socials. Every field is COALESCE-guarded so enrichment only ever
  // fills a blank and never overwrites a verified or human-entered value.
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
      email = COALESCE(email, ?),
      social_urls = COALESCE(social_urls, ?), last_enriched_at = ?, updated_at = ?
    WHERE id = ?
  `).bind(desc, phone, orgEmail, socialJson, now, now, org.id).run();

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
  if (!enabled(env.CAMP_ENRICHMENT_ENABLED) || enabled(env.PCD_MAINTENANCE_MODE)) {
    console.log(JSON.stringify({ event: 'camp_enrichment_held', enabled: enabled(env.CAMP_ENRICHMENT_ENABLED), maintenance_mode: enabled(env.PCD_MAINTENANCE_MODE) }));
    return 0;
  }
  const { results: campRows } = await env.DB
    .prepare(`SELECT id, org_id, website_url, attempts FROM camp_scan_queue WHERE status = 'pending' LIMIT 20`)
    .all<CampQueueRow>();

  for (const row of campRows) {
    const ts = new Date().toISOString();
    await env.DB.prepare(`UPDATE camp_scan_queue SET status = 'processing', attempts = attempts + 1 WHERE id = ?`).bind(row.id).run();
    try {
      const outcome = await processCampRow(env, row);
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

  // Manual trigger for the deployed worker. Use POST with:
  //   Authorization: Bearer <RUN_KEY>
  // Runs one scan batch (up to 20 sites) and returns a JSON summary so you can
  // watch data come in without waiting for the cron. Repeat to drain the queue.
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== 'POST') return new Response('method not allowed', { status: 405, headers: { Allow: 'POST' } });
    if (!env.RUN_KEY || !(await secretsMatch(bearerCredential(req), env.RUN_KEY))) {
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
