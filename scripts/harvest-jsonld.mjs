#!/usr/bin/env node
// scripts/harvest-jsonld.mjs
//
// Schema.org JSON-LD harvester. Three input modes, two output modes.
//
// Inputs:
//   --url <url>                Single URL.
//   <urls.txt>                 File with one URL per line. Comments start with #.
//   --sitemap <domain-or-url>  Walk a sitemap. Pass a bare domain (foo.com),
//                              a sitemap URL, or a sitemap-index URL. Recursively
//                              expands index -> child sitemaps -> URLs. Filter
//                              with --filter <regex>.
//
// Outputs:
//   (default)                  Writes a 24-column CSV ready for
//                              scripts/import-camps-csv.mjs. Path defaults to
//                              imports/harvested-YYYY-MM-DD.csv; override --out.
//   --submit                   POSTs each row to /api/camps/submit. Requires
//                              BULK_IMPORT_TOKEN env var (rows go approved +
//                              awaiting_review). The CSV is still written as an
//                              audit trail. Use --submit-pending to post
//                              without the token (status='pending').
//
// Other flags: --dry, --base <url>, --filter <regex>, --max-urls <n>,
//              --email <addr>, --out <path>.
//
// Sport + age inference is always on. Always review the CSV before importing.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const TODAY = new Date().toISOString().slice(0, 10);

function flagValue(name, fallback) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args[i + 1];
}
const HAS_DRY = args.includes('--dry');
const HAS_SUBMIT = args.includes('--submit');
const HAS_SUBMIT_PENDING = args.includes('--submit-pending');
const HAS_NO_COLLAPSE = args.includes('--no-collapse');
const URL_FLAG = flagValue('url', null);
const SITEMAP_FLAG = flagValue('sitemap', null);
const FILTER_FLAG = flagValue('filter', null);
const MAX_URLS = parseInt(flagValue('max-urls', '500'), 10);
const OUT_FLAG = flagValue('out', `imports/harvested-${TODAY}.csv`);
const MISSES_OUT = flagValue('misses-out', `imports/harvester-misses-${TODAY}.csv`);
const BASE_URL = flagValue('base', 'https://parentcoachdesk.com');
const SUBMITTER_EMAIL = flagValue('email', 'parentcoachplaybook@gmail.com');
const BULK_TOKEN = process.env.BULK_IMPORT_TOKEN || '';

const positional = args.find((a, i) => {
  if (a.startsWith('--')) return false;
  const prev = args[i - 1];
  if (prev && prev.startsWith('--') && !['--dry', '--submit', '--submit-pending'].includes(prev)) return false;
  return true;
});

if (HAS_SUBMIT && !BULK_TOKEN) {
  console.error('--submit requires BULK_IMPORT_TOKEN env var. Use --submit-pending to post without it.');
  process.exit(1);
}

async function main() {
  let urls;
  if (URL_FLAG) {
    urls = [URL_FLAG];
  } else if (SITEMAP_FLAG) {
    urls = await loadFromSitemap(SITEMAP_FLAG);
  } else if (positional) {
    const text = await readFile(resolve(positional), 'utf8');
    urls = text.split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
  } else {
    console.error('Usage: harvest-jsonld.mjs <urls.txt> | --url <url> | --sitemap <domain-or-url> [flags]');
    process.exit(1);
  }

  if (urls.length === 0) {
    console.log('No URLs to visit. Done.');
    return;
  }
  if (urls.length > MAX_URLS) {
    console.log(`Capping at ${MAX_URLS} URLs (set --max-urls to override). Original: ${urls.length}`);
    urls = urls.slice(0, MAX_URLS);
  }

  console.log(`Harvesting ${urls.length} URL(s)`);
  if (HAS_DRY) console.log('  mode: DRY (no CSV, no submit)');
  if (HAS_SUBMIT) console.log(`  mode: SUBMIT to ${BASE_URL}/api/camps/submit (auto-approve via BULK_IMPORT_TOKEN)`);
  if (HAS_SUBMIT_PENDING) console.log(`  mode: SUBMIT to ${BASE_URL}/api/camps/submit (pending, no token)`);
  console.log('');

  const rows = [];
  let visited = 0, withSchema = 0, totalEvents = 0;
  const misses = [];

  for (const url of urls) {
    visited += 1;
    process.stdout.write(`-> ${url}\n`);
    let html;
    try { html = await fetchUrl(url); }
    catch (e) { console.log(`  ERR fetch: ${e.message}`); misses.push({ url, reason: 'fetch_error', note: e.message }); continue; }

    const blocks = extractJsonLd(html);
    if (blocks.length === 0) { console.log('  no JSON-LD blocks'); misses.push({ url, reason: 'no_jsonld', note: '' }); continue; }
    withSchema += 1;
    console.log(`  ${blocks.length} JSON-LD block(s)`);

    const events = [];
    for (const b of blocks) findEvents(b, events);
    if (events.length === 0) { console.log('  no Event-type entries'); misses.push({ url, reason: 'no_events', note: 'JSON-LD present but no Event-type entries' }); continue; }
    console.log(`  ${events.length} Event-type entries`);
    totalEvents += events.length;

    for (const ev of events) {
      const row = eventToRow(ev, url);
      if (row) rows.push(row);
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log('');
  console.log(`Visited: ${visited} URLs`);
  console.log(`URLs with JSON-LD: ${withSchema}`);
  console.log(`Event entries found: ${totalEvents}`);
  console.log(`Rows extracted: ${rows.length}`);
  console.log(`URLs skipped (need Chrome flow or manual review): ${misses.length}`);

  if (rows.length === 0) { console.log('\nNothing to write. Done.'); return; }

  // Collapse same-date Events on the same camp page. Nike-style operators publish
  // one Event per price tier (overnight / day / half-day) — we want one row per
  // session with a price range. Disable with --no-collapse if you want the raw
  // per-offer rows.
  let finalRows = rows;
  if (!HAS_NO_COLLAPSE) {
    finalRows = collapseEvents(rows);
    if (finalRows.length !== rows.length) {
      console.log(`Collapsed ${rows.length} rows -> ${finalRows.length} unique sessions (merged price tiers)`);
    }
  }

  const csv = toCsv(finalRows);
  if (HAS_DRY) { console.log('\n--- CSV preview (DRY) ---'); console.log(csv); return; }

  const outPath = resolve(OUT_FLAG);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, csv);
  console.log(`\nWrote ${finalRows.length} rows to ${OUT_FLAG}`);

  if (HAS_SUBMIT || HAS_SUBMIT_PENDING) {
    console.log('\nSubmitting rows to /api/camps/submit...\n');
    await submitRows(finalRows, misses);
  } else {
    console.log('\nReview before importing. Inferred fields to spot-check:');
    console.log('  sport (auto-inferred; "general" if no match)');
    console.log('  age_min/max (auto-inferred from name+description; blank if no match)');
    console.log('  program_type (defaulted to "camp"; flip to "league" where appropriate)');
    console.log('\nThen:');
    console.log(`  node scripts/import-camps-csv.mjs ${OUT_FLAG}`);
  }

  if (misses.length > 0 && !HAS_DRY) {
    const missesPath = resolve(MISSES_OUT);
    await mkdir(dirname(missesPath), { recursive: true });
    await writeFile(missesPath, missesToCsv(misses));
    console.log(`\nWrote ${misses.length} skipped URL(s) to ${MISSES_OUT}`);
    console.log('  These are URLs the harvester could not extract events from.');
    console.log('  Feed this file into the Chrome flow as the next round of long-tail targets.');
  }
}

function missesToCsv(misses) {
  const lines = ['url,reason,note,domain'];
  for (const m of misses) {
    let domain = '';
    try { domain = new URL(m.url).hostname.replace(/^www\./, ''); } catch {}
    lines.push([m.url, m.reason, m.note, domain].map(csvCell).join(','));
  }
  return lines.join('\n') + '\n';
}

async function fetchUrl(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'parent-coach-desk-harvester/1.0 (jeffthomas@pugetsound.edu)',
      Accept: 'text/html,application/xhtml+xml,application/xml,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

const DEFAULT_FILTER = /(camp|program|event|class|clinic|league|registration|activity)/i;

async function loadFromSitemap(input) {
  const start = /^https?:\/\//i.test(input) ? input : `https://${input.replace(/\/$/, '')}/sitemap.xml`;
  console.log(`Sitemap entry: ${start}`);
  const filterRe = FILTER_FLAG ? new RegExp(FILTER_FLAG, 'i') : DEFAULT_FILTER;
  const visited = new Set();
  const out = [];
  await walkSitemap(start, visited, out, filterRe);
  console.log(`Sitemap walk produced ${out.length} URL(s) after filter\n`);
  return out;
}

async function walkSitemap(url, visited, out, filterRe) {
  if (visited.has(url) || out.length >= MAX_URLS) return;
  visited.add(url);

  let xml;
  try { xml = await fetchUrl(url); }
  catch (e) { console.log(`  sitemap fetch err: ${url} -> ${e.message}`); return; }

  if (/<sitemapindex\b/i.test(xml)) {
    const childs = [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/gi)].map((m) => m[1].trim());
    console.log(`  sitemap index, ${childs.length} child sitemap(s)`);
    for (const c of childs) {
      if (out.length >= MAX_URLS) return;
      await walkSitemap(c, visited, out, filterRe);
    }
    return;
  }

  const locs = [...xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/gi)].map((m) => m[1].trim());
  let kept = 0;
  for (const u of locs) {
    if (out.length >= MAX_URLS) break;
    if (!filterRe.test(u)) continue;
    out.push(u);
    kept += 1;
  }
  console.log(`  ${url} -> ${locs.length} URLs, ${kept} kept after filter`);
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    let parsed = null;
    try { parsed = JSON.parse(raw); }
    catch {
      try { parsed = JSON.parse(raw.replace(/,\s*([}\]])/g, '$1')); }
      catch { /* skip */ }
    }
    if (parsed) blocks.push(parsed);
  }
  return blocks;
}

const EVENT_TYPES = new Set([
  'Event', 'SportsEvent', 'ChildrensEvent', 'EducationEvent',
  'TheaterEvent', 'SocialEvent', 'BusinessEvent', 'Festival',
  'Course', 'CourseInstance',
]);

function findEvents(node, out) {
  if (Array.isArray(node)) { for (const item of node) findEvents(item, out); return; }
  if (!node || typeof node !== 'object') return;
  const t = node['@type'];
  const types = Array.isArray(t) ? t : t ? [t] : [];
  if (types.some((x) => EVENT_TYPES.has(x))) out.push(node);
  if (Array.isArray(node['@graph'])) findEvents(node['@graph'], out);
  if (Array.isArray(node.subEvents)) findEvents(node.subEvents, out);
  if (Array.isArray(node.subEvent)) findEvents(node.subEvent, out);
  if (Array.isArray(node.itemListElement)) findEvents(node.itemListElement, out);
  if (Array.isArray(node.hasCourseInstance)) findEvents(node.hasCourseInstance, out);
}

function eventToRow(ev, sourceUrl) {
  const name = trim(asText(ev.name)).slice(0, 200);
  if (!name) return null;
  const startDate = parseDate(ev.startDate);
  const endDate = parseDate(ev.endDate || ev.startDate);
  if (!startDate || !endDate) return null;
  const loc = pick(ev.location);
  const addr = pick(loc?.address);
  const street = trim(asText(addr?.streetAddress));
  const city = trim(asText(addr?.addressLocality));
  const region = trim(asText(addr?.addressRegion));
  const zip = trim(asText(addr?.postalCode));
  let description = trim(asText(ev.description)).replace(/\s+/g, ' ');
  if (description.length < 30) {
    const venue = trim(asText(loc?.name));
    const org = trim(asText(pick(ev.organizer)?.name));
    const fallback = [name, venue, org].filter(Boolean).join(' at ');
    description = (description ? description + '. ' : '') + fallback;
  }
  description = description.slice(0, 4000);
  const haystack = [name, description].join(' ');
  const sport = inferSport(haystack);
  const ages = inferAgesFromEvent(ev) || inferAges(haystack);
  return {
    name, sport,
    age_min: ages.min == null ? '' : ages.min,
    age_max: ages.max == null ? '' : ages.max,
    start_date: startDate, end_date: endDate,
    address: street, city, state: normState(region), zip,
    description,
    price_text: priceText(ev.offers),
    day_or_overnight: 'day',
    skill_level: 'all',
    spots_status: 'open',
    contact_email: contactEmail(ev),
    contact_phone: contactPhone(ev),
    website_url: pickUrl(ev.url) || sourceUrl,
    lunch_included: 'FALSE',
    aftercare_available: 'FALSE',
    program_type: 'camp',
    registration_deadline: '',
    schedule_text: '',
    confidence: ages.min != null ? 'medium' : 'low',
  };
}

const SPORT_RULES = [
  ['football-7v7', /\b7\s*v\s*7\b|seven on seven/i],
  ['flag-football', /flag football|flag-football/i],
  ['football', /\bfootball\b|gridiron|tackle football/i],
  ['baseball', /\bbaseball\b|t-?ball|coach pitch|machine pitch/i],
  ['softball', /\bsoftball\b/i],
  ['soccer', /\bsoccer\b|futsal/i],
  ['basketball', /\bbasketball\b|hoops/i],
  ['volleyball', /\bvolleyball\b/i],
  ['lacrosse-girls', /girls lacrosse/i],
  ['lacrosse-boys', /boys lacrosse|\blacrosse\b/i],
  ['hockey', /\b(ice )?hockey\b/i],
  ['field-hockey', /field hockey/i],
  ['rugby', /\brugby\b/i],
  ['wrestling', /\bwrestling\b/i],
  ['swimming', /\bswim(ming)?\b/i],
  ['track-field', /track and field|track & field/i],
  ['cross-country', /cross[- ]country/i],
  ['tennis', /\btennis\b/i],
  ['golf', /\bgolf\b/i],
  ['crew', /\b(crew|rowing)\b/i],
  ['martial-arts', /martial arts|karate|jiu[- ]jitsu|taekwondo|judo|kung fu/i],
  ['gymnastics', /\bgymnastics\b/i],
  ['cheer', /\bcheer\b/i],
  ['stunt', /\bstunt\b/i],
  ['theater', /\btheat(er|re)\b|drama|playwriting|musical theatre/i],
  ['band', /\bband camp\b|marching band/i],
  ['choir', /\bchoir\b|choral/i],
  ['ballet', /\bballet\b/i],
  ['dance', /\bdance\b/i],
  ['climbing', /rock climbing|\bclimbing\b/i],
  ['skateboarding', /skateboard/i],
  ['outdoor', /\b(wilderness|nature|outdoor|adventure|hiking|kayak|sail|canoe|backpack)\b/i],
  ['stem', /\b(stem|coding|robotics|engineering|science camp|programming)\b/i],
  ['arts', /\b(arts? camp|painting|drawing|visual art|mixed art|crafts?)\b/i],
  ['academic', /\b(academic|enrichment|tutoring|language|math camp|reading)\b/i],
  ['multi-sport', /multi[- ]?sport|sports? sampler|all[- ]?sports?/i],
];

function inferSport(text) {
  for (const [slug, re] of SPORT_RULES) if (re.test(text)) return slug;
  return 'general';
}

function inferAgesFromEvent(ev) {
  // schema.org Event.typicalAgeRange ("7-9", "8-12 years", "11-")
  if (ev.typicalAgeRange) {
    const s = ev.typicalAgeRange.toString();
    const m = s.match(/(\d{1,2})\s*-\s*(\d{1,2})/);
    if (m) return { min: clamp(+m[1]), max: clamp(+m[2]) };
    const open = s.match(/(\d{1,2})\s*[-+]/);
    if (open) return { min: clamp(+open[1]), max: 18 };
  }
  // schema.org Event.audience.suggestedMinAge / suggestedMaxAge
  const aud = pick(ev.audience);
  if (aud) {
    const min = aud.suggestedMinAge != null ? clamp(+aud.suggestedMinAge) : null;
    const max = aud.suggestedMaxAge != null ? clamp(+aud.suggestedMaxAge) : null;
    if (min != null && max != null) return { min, max };
    if (min != null) return { min, max: 18 };
  }
  return null;
}

function inferAges(text) {
  // boys/girls/players/coed X-Y
  let m = text.match(/\b(?:boys|girls|kids|youth|athletes?|players?|coed|co-ed)\s+(?:ages?\s+)?(\d{1,2})\s*(?:to|-|\u2013|\u2014)\s*(\d{1,2})\b/i);
  if (m) return { min: clamp(+m[1]), max: clamp(+m[2]) };
  // for X-Y year/kid/player
  m = text.match(/\bfor\s+(\d{1,2})\s*(?:to|-|\u2013|\u2014)\s*(\d{1,2})\s+(?:year|kid|player|athlete)/i);
  if (m) return { min: clamp(+m[1]), max: clamp(+m[2]) };
  m = text.match(/ages?\s+(\d{1,2})\s*(?:to|-|–|—)\s*(\d{1,2})/i);
  if (m) return { min: clamp(+m[1]), max: clamp(+m[2]) };
  m = text.match(/\b(\d{1,2})\s*(?:to|-|–|—)\s*(\d{1,2})\s*(?:year|yr|y\.o\.|years? old)/i);
  if (m) return { min: clamp(+m[1]), max: clamp(+m[2]) };
  m = text.match(/grades?\s+(K|\d{1,2})\s*(?:to|-|–|—)\s*(\d{1,2})/i);
  if (m) {
    const lo = m[1].toUpperCase() === 'K' ? 5 : 5 + parseInt(m[1], 10);
    const hi = 5 + parseInt(m[2], 10);
    return { min: clamp(lo), max: clamp(hi) };
  }
  m = text.match(/ages?\s+(\d{1,2})\s*(?:and\s+up|\+)/i);
  if (m) return { min: clamp(+m[1]), max: 18 };
  m = text.match(/\b(\d{1,2})[-\s]year[-\s]olds?\b/i);
  if (m) return { min: clamp(+m[1]), max: clamp(+m[1]) };
  return { min: null, max: null };
}

function clamp(n) {
  if (Number.isNaN(n)) return null;
  if (n < 3) return 3;
  if (n > 22) return 22;
  return n;
}

function parseDate(v) {
  if (!v) return '';
  const s = v.toString();
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : '';
}

function asText(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return v.toString();
  if (Array.isArray(v)) return asText(v[0]);
  return '';
}
function trim(s) { return (s || '').toString().trim(); }
function pick(v) { if (Array.isArray(v)) return v[0] || null; return v || null; }
function pickUrl(v) {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object' && v.url) return asText(v.url);
  if (Array.isArray(v)) return pickUrl(v[0]);
  return '';
}

function priceText(offers) {
  const o = pick(offers);
  if (!o) return '';
  const cur = o.priceCurrency === 'USD' || !o.priceCurrency ? '$' : `${o.priceCurrency} `;
  if (o.price) return `${cur}${o.price}`;
  if (o.lowPrice && o.highPrice) return `${cur}${o.lowPrice}-${cur}${o.highPrice}`;
  if (o.priceRange) return o.priceRange.toString();
  return '';
}
function contactEmail(ev) { const o = pick(ev.organizer) || pick(ev.performer); return trim(asText(o?.email)); }
function contactPhone(ev) { const o = pick(ev.organizer) || pick(ev.performer); return trim(asText(o?.telephone)); }

const STATE_NAME_TO_CODE = {
  ALABAMA:'AL',ALASKA:'AK',ARIZONA:'AZ',ARKANSAS:'AR',CALIFORNIA:'CA',COLORADO:'CO',CONNECTICUT:'CT',
  DELAWARE:'DE',FLORIDA:'FL',GEORGIA:'GA',HAWAII:'HI',IDAHO:'ID',ILLINOIS:'IL',INDIANA:'IN',IOWA:'IA',
  KANSAS:'KS',KENTUCKY:'KY',LOUISIANA:'LA',MAINE:'ME',MARYLAND:'MD',MASSACHUSETTS:'MA',MICHIGAN:'MI',
  MINNESOTA:'MN',MISSISSIPPI:'MS',MISSOURI:'MO',MONTANA:'MT',NEBRASKA:'NE',NEVADA:'NV',
  'NEW HAMPSHIRE':'NH','NEW JERSEY':'NJ','NEW MEXICO':'NM','NEW YORK':'NY','NORTH CAROLINA':'NC',
  'NORTH DAKOTA':'ND',OHIO:'OH',OKLAHOMA:'OK',OREGON:'OR',PENNSYLVANIA:'PA','RHODE ISLAND':'RI',
  'SOUTH CAROLINA':'SC','SOUTH DAKOTA':'SD',TENNESSEE:'TN',TEXAS:'TX',UTAH:'UT',VERMONT:'VT',
  VIRGINIA:'VA',WASHINGTON:'WA','WEST VIRGINIA':'WV',WISCONSIN:'WI',WYOMING:'WY','DISTRICT OF COLUMBIA':'DC',
};

function normState(s) {
  if (!s) return '';
  const v = s.toString().trim().toUpperCase();
  if (v.length === 2) return v;
  return STATE_NAME_TO_CODE[v] || v.slice(0, 2);
}

const HEADERS = [
  'name','sport','age_min','age_max','start_date','end_date',
  'address','city','state','zip','description','price_text',
  'day_or_overnight','skill_level','spots_status',
  'contact_email','contact_phone','website_url',
  'lunch_included','aftercare_available',
  'program_type','registration_deadline','schedule_text','confidence',
];

// Collapse same-date Events on the same camp into one row.
// Group key: name|start|end|address|zip. For the merged row, take the first row's
// metadata and merge price_text into a range. Strip URL fragments so the canonical
// URL points at the parent camp page, not a specific offer anchor.
function collapseEvents(rows) {
  const groups = new Map();
  for (const r of rows) {
    const key = [r.name, r.start_date, r.end_date, r.address, r.zip].join('|');
    const existing = groups.get(key);
    if (!existing) {
      groups.set(key, { ...r, website_url: stripFragment(r.website_url) });
      continue;
    }
    existing.price_text = mergePriceText(existing.price_text, r.price_text);
    if (!existing.contact_email && r.contact_email) existing.contact_email = r.contact_email;
    if (!existing.contact_phone && r.contact_phone) existing.contact_phone = r.contact_phone;
    if ((existing.age_min === '' || existing.age_min == null) && r.age_min !== '' && r.age_min != null) {
      existing.age_min = r.age_min;
      existing.age_max = r.age_max;
    }
    const order = { low: 0, medium: 1, high: 2 };
    if (order[r.confidence] > order[existing.confidence]) existing.confidence = r.confidence;
  }
  return Array.from(groups.values());
}

function stripFragment(url) {
  if (!url) return url;
  const i = url.indexOf('#');
  return i === -1 ? url : url.slice(0, i);
}

function mergePriceText(a, b) {
  if (!a) return b || '';
  if (!b) return a;
  if (a === b) return a;
  const all = [a, b];
  const nums = all.flatMap((s) => [...String(s).matchAll(/\$?(\d+(?:\.\d+)?)/g)].map((m) => parseFloat(m[1])));
  if (nums.length >= 2) {
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    if (min !== max) return `$${min}-$${max}`;
    return `$${min}`;
  }
  return `${a} / ${b}`;
}

function toCsv(rows) {
  const lines = [HEADERS.join(',')];
  for (const r of rows) lines.push(HEADERS.map((h) => csvCell(r[h])).join(','));
  return lines.join('\n') + '\n';
}

function csvCell(v) {
  if (v == null) return '';
  const s = v.toString();
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

// POST with backoff on rate-limit-like responses (503, 429, 502, 504).
// Other status codes return immediately so dedup/422 rejections don't get retried.
// Backoff: 30s, 60s, 120s. After 3 retries we give up and return the last response
// so the caller logs the failure normally.
const RETRY_STATUSES = new Set([429, 502, 503, 504]);
const RETRY_BACKOFFS_MS = [30000, 60000, 120000];

async function postWithRetry(url, body, bearerToken = '') {
  const idempotencyKey = `harvest_${createHash('sha256').update(JSON.stringify(body)).digest('hex')}`;
  for (let attempt = 0; attempt <= RETRY_BACKOFFS_MS.length; attempt += 1) {
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
          ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        },
        body: JSON.stringify({ ...body, idempotency_key: idempotencyKey }),
      });
    } catch (e) {
      // Network error (connection reset, DNS, etc.) — treat like a retryable
      // failure if we still have attempts left, otherwise rethrow.
      if (attempt >= RETRY_BACKOFFS_MS.length) throw e;
      const wait = RETRY_BACKOFFS_MS[attempt];
      console.log(`  network error (${e.message}); backing off ${wait/1000}s before retry ${attempt + 1}/${RETRY_BACKOFFS_MS.length}`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (!RETRY_STATUSES.has(res.status)) return res;
    if (attempt >= RETRY_BACKOFFS_MS.length) return res;
    const wait = RETRY_BACKOFFS_MS[attempt];
    console.log(`  rate-limited (HTTP ${res.status}); backing off ${wait/1000}s before retry ${attempt + 1}/${RETRY_BACKOFFS_MS.length}`);
    await new Promise((r) => setTimeout(r, wait));
  }
}

async function submitRows(rows, misses) {
  let ok = 0, failed = 0;
  const errors = [];
  for (const r of rows) {
    const required = ['name','sport','start_date','end_date','address','city','state','zip','description'];
    const missing = required.filter((k) => !r[k] || String(r[k]).trim() === '');
    if (missing.length) {
      failed += 1;
      errors.push({ name: r.name || '(no name)', error: `missing fields: ${missing.join(', ')}` });
      console.log(`x ${r.name} -> missing: ${missing.join(', ')}`);
      continue;
    }
    if (r.age_min === '' || r.age_max === '') {
      failed += 1;
      errors.push({ name: r.name, error: 'age_min/age_max blank — inference did not match' });
      misses.push({ url: r.website_url || '', reason: 'age_blank', note: r.name });
      console.log(`x ${r.name} -> age inference blank, skipping submit`);
      continue;
    }
    const payload = {
      ...r,
      submitted_by_email: SUBMITTER_EMAIL,
      confirm_duplicate: 'true',
      lunch_included: r.lunch_included === 'TRUE' ? 'true' : 'false',
      aftercare_available: r.aftercare_available === 'TRUE' ? 'true' : 'false',
    };
    try {
      const res = await postWithRetry(
        `${BASE_URL}/api/camps/submit`,
        payload,
        HAS_SUBMIT ? BULK_TOKEN : '',
      );
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        ok += 1;
        const reviewSuffix = body.awaiting_review ? ' . awaiting review' : '';
        console.log(`+ ${r.name} -> ${body.status}${reviewSuffix} (${body.slug})`);
      } else {
        failed += 1;
        const err = body.error || body.warning || `HTTP ${res.status}`;
        errors.push({ name: r.name, error: err });
        console.log(`x ${r.name} -> ${err}`);
      }
    } catch (e) {
      failed += 1;
      errors.push({ name: r.name, error: e.message });
      console.log(`x ${r.name} -> ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log('');
  console.log(`Submitted: ${ok} succeeded, ${failed} failed.`);
  if (errors.length > 0) {
    console.log('\nFailures:');
    for (const e of errors) console.log(`  ${e.name} -- ${e.error}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
