#!/usr/bin/env node
/**
 * Publish-queue drift check: is the live site missing content it should have?
 *
 * WHY THIS EXISTS. On 2026-07-28 the live homepage's newest article was dated
 * July 21, a week stale, while the repo held finished published content dated
 * through the 28th. Nothing reported it. Three separate breaks were stacked:
 * the reviewer agent had stopped publishing, the branch had never been merged,
 * and the daily rebuild that used to drain the queue had been silently removed
 * in the Pages-to-Workers cutover.
 *
 * None of those had a monitor. The build was green, the tests passed, and the
 * site was a week behind. This script is the missing signal: it compares what
 * SHOULD be live (locally, per the same isLive rule the build uses) against
 * what IS live (the production sitemap) and reports the gap.
 *
 * It deliberately checks the deployed site rather than git state, because
 * "merged but not deployed" and "deployed but stale" both look fine in git.
 *
 * Usage:
 *   node scripts/check-publish-queue-drift.mjs
 *   node scripts/check-publish-queue-drift.mjs --json
 *   node scripts/check-publish-queue-drift.mjs --origin https://staging.example.com
 *   node scripts/check-publish-queue-drift.mjs --quiet     # exit code only
 *
 * Exit codes:
 *   0  live site carries everything locally eligible
 *   1  drift found (or the live sitemap could not be read)
 *   2  usage / local error
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = join(ROOT, 'src/content');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const quiet = args.includes('--quiet');
const originIdx = args.indexOf('--origin');
const ORIGIN = (originIdx !== -1 ? args[originIdx + 1] : 'https://parentcoachdesk.com').replace(/\/$/, '');

/**
 * Collections that render as public pages, mapped to the URL prefix the built
 * site uses. `phase` in article frontmatter overrides the default for articles,
 * which is why articles are resolved per-file rather than by a fixed prefix.
 */
const ROUTED = new Set(['articles', 'news', 'guides', 'coachingTips', 'body', 'pillar', 'recruiting', 'adaptive', 'rules', 'scripts', 'decisions', 'pathways', 'resources', 'seasonCalendars']);

const FRONTMATTER_PROBE = 8192;

async function frontmatterOf(path) {
  let raw;
  try { raw = await readFile(path, 'utf8'); } catch { return null; }
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  return end === -1 ? null : raw.slice(4, end);
}

const field = (fm, name) => {
  const m = new RegExp(`^${name}:[ \\t]*(.*)$`, 'm').exec(fm);
  if (!m) return null;
  let v = m[1].trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  return v || null;
};

const nested = (fm, name) => {
  const m = new RegExp(`^[ \\t]+${name}:[ \\t]*(.*)$`, 'm').exec(fm);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') || null : null;
};

/** Mirrors isLive() in src/lib/publishFilter.ts. Keep the two in step. */
function isLive(fm, now) {
  if (field(fm, 'draft') === 'true') return false;
  const pub = field(fm, 'publishedAt');
  if (!pub) return false;
  const d = new Date(pub);
  return !Number.isNaN(d.getTime()) && d.getTime() <= now.getTime();
}

async function collectEligible(now) {
  const out = [];
  let dirs;
  try {
    dirs = (await readdir(CONTENT, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    console.error(`Cannot read ${CONTENT}`);
    process.exit(2);
  }

  for (const dir of dirs) {
    if (!ROUTED.has(dir)) continue;
    let files;
    try { files = (await readdir(join(CONTENT, dir))).filter((f) => f.endsWith('.md') || f.endsWith('.mdx')); }
    catch { continue; }

    for (const file of files) {
      const fm = await frontmatterOf(join(CONTENT, dir, file));
      if (!fm || !isLive(fm, now)) continue;
      const slug = file.replace(/\.mdx?$/, '');
      // Articles route by their `phase` value; everything else by collection.
      const phase = dir === 'articles' ? field(fm, 'phase') : null;
      out.push({
        collection: dir,
        slug,
        phase,
        title: field(fm, 'title') ?? field(fm, 'headline') ?? slug,
        publishedAt: field(fm, 'publishedAt'),
        reviewedAt: nested(fm, 'jeffReviewedAt') ?? nested(fm, 'claudeReviewedAt'),
      });
    }
  }
  return out;
}

async function liveSlugs() {
  const urls = new Set();
  const seen = new Set();

  async function pull(url) {
    if (seen.has(url)) return;
    seen.add(url);
    let xml;
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'pcd-publish-drift-check' } });
      if (!res.ok) return;
      xml = await res.text();
    } catch {
      return;
    }
    // Sitemap index: recurse into children.
    for (const m of xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/g)) {
      await pull(m[1].trim());
    }
    for (const m of xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g)) {
      urls.add(m[1].trim());
    }
  }

  for (const p of ['/sitemap.xml', '/sitemap-index.xml', '/sitemap-content.xml']) {
    await pull(`${ORIGIN}${p}`);
  }

  // Reduce to the last non-empty path segment, which is the slug for every
  // content route on this site. Comparing slugs rather than full URLs keeps
  // this from breaking when a collection's URL prefix changes.
  const slugs = new Set();
  for (const u of urls) {
    const parts = u.replace(/\/$/, '').split('/').filter(Boolean);
    if (parts.length) slugs.add(parts[parts.length - 1].toLowerCase());
  }
  return { slugs, urlCount: urls.size };
}

const now = new Date();
const eligible = await collectEligible(now);
const { slugs, urlCount } = await liveSlugs();

if (urlCount === 0) {
  const msg = `Could not read any sitemap from ${ORIGIN}. Cannot determine drift.`;
  if (asJson) console.log(JSON.stringify({ ok: false, reason: 'sitemap_unreachable', origin: ORIGIN }, null, 2));
  else console.error(msg);
  process.exit(1);
}

const days = (d) => Math.floor((now - new Date(d)) / 86_400_000);

/**
 * Candidate public URLs for an entry.
 *
 * Articles route by their `phase`; other collections have a fixed prefix, and a
 * couple render at two paths. Order does not matter: a 200 on ANY candidate
 * means the piece is reachable.
 */
const PREFIXES = {
  news: ['/news'],
  pillar: ['/pillar', '/guides'],
  guides: ['/what-to-buy', '/guides'],
  coachingTips: ['/coaching-tips'],
  body: ['/body'],
  recruiting: ['/recruiting'],
  adaptive: ['/adaptive'],
  rules: ['/rules'],
  scripts: ['/scripts'],
  decisions: ['/decisions'],
  pathways: ['/pathways'],
  resources: ['/team-parent', '/resources'],
  seasonCalendars: ['/season-calendar'],
};

function candidateUrls(e) {
  if (e.collection === 'articles') {
    // Without a phase we cannot construct the route; try the known lanes.
    const lanes = e.phase ? [`/${e.phase}`] : ['/drive-home', '/drive-there', '/game', '/team-parent'];
    return lanes.map((p) => `${ORIGIN}${p}/${e.slug}/`);
  }
  return (PREFIXES[e.collection] ?? [`/${e.collection}`]).map((p) => `${ORIGIN}${p}/${e.slug}/`);
}

async function isReachable(e) {
  for (const url of candidateUrls(e)) {
    try {
      // HEAD first; some hosts answer HEAD differently, so fall back to GET.
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'user-agent': 'pcd-publish-drift-check' } });
      if (res.status === 405 || res.status === 501) {
        res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'pcd-publish-drift-check' } });
      }
      if (res.ok) return url;
    } catch { /* try the next candidate */ }
  }
  return null;
}

// Sitemap absence is a CANDIDATE signal, not a verdict. On 2026-07-28 seventeen
// pillar guides were absent from the sitemap while returning 200 live, so
// reporting sitemap misses as "not published" would have been 17 false alarms
// out of 24 findings. A guard that cries wolf gets ignored, so every candidate
// is verified against the real URL before it is called drift.
const candidates = eligible
  .filter((e) => !slugs.has(e.slug.toLowerCase()))
  .sort((a, b) => (a.publishedAt ?? '').localeCompare(b.publishedAt ?? ''));

const missing = [];
const unlisted = [];
for (const e of candidates) {
  const url = await isReachable(e);
  if (url) unlisted.push({ ...e, url });
  else missing.push(e);
}

if (asJson) {
  console.log(JSON.stringify({
    ok: missing.length === 0,
    origin: ORIGIN,
    checkedAt: now.toISOString(),
    liveUrls: urlCount,
    locallyEligible: eligible.length,
    missingCount: missing.length,
    missing: missing.map((m) => ({ ...m, waitingDays: m.publishedAt ? days(m.publishedAt) : null })),
    unlistedCount: unlisted.length,
    unlisted: unlisted.map((u) => ({ collection: u.collection, slug: u.slug, url: u.url })),
  }, null, 2));
  process.exit(missing.length ? 1 : 0);
}

if (!quiet) {
  console.log(`Live site   : ${ORIGIN} (${urlCount} URLs in sitemap)`);
  console.log(`Eligible now: ${eligible.length} entries pass isLive() locally`);
  console.log(`Verified    : ${candidates.length} sitemap misses checked against their real URLs\n`);

  if (missing.length === 0) {
    console.log('NO PUBLISH DRIFT. Everything locally eligible is reachable on the live site.');
  } else {
    console.log(`PUBLISH DRIFT: ${missing.length} entr${missing.length === 1 ? 'y is' : 'ies are'} eligible locally and NOT reachable live.\n`);
    for (const m of missing) {
      const w = m.publishedAt ? `${days(m.publishedAt)}d` : '?';
      console.log(`  ${(m.publishedAt ?? '????-??-??')}  waiting ${w.padStart(4)}  ${m.collection}/${m.slug}`);
      console.log(`      ${m.title}`);
    }
    console.log('\nMost likely cause: the branch holding this content has not been merged to main,');
    console.log('or no production deploy has run since these dates. Nothing rebuilds this site on');
    console.log('a schedule. See QUEUE.md.');
  }

  if (unlisted.length) {
    console.log(`\nSEPARATE ISSUE, not publish drift: ${unlisted.length} page${unlisted.length === 1 ? '' : 's'} return 200 live but are absent from the sitemap.`);
    console.log('Reachable by URL, invisible to crawlers. This is an SEO indexing gap, not a queue problem.');
    for (const u of unlisted.slice(0, 10)) console.log(`  ${u.collection}/${u.slug}  ->  ${u.url}`);
    if (unlisted.length > 10) console.log(`  ... and ${unlisted.length - 10} more (use --json for the full list)`);
  }
}

// Exit non-zero only for genuine publish drift. Sitemap gaps are reported but
// do not fail the check, because they need a different fix and would otherwise
// keep this red forever.
process.exit(missing.length ? 1 : 0);
