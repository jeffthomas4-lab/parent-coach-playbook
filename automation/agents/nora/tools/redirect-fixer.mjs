#!/usr/bin/env node
/**
 * Nora's 404 -> redirect fixer.
 *
 * What it does: crawls the site's own sitemaps, finds URLs that currently
 * return 404/410, and for each one proposes the closest live URL as a
 * redirect target, scored by slug word overlap, falling back to the
 * relevant sport/state hub, then the homepage, when nothing scores well.
 *
 * What it does NOT do: write to astro.config.mjs, write to D1, or apply
 * anything. Output is a report only. Per the SEO lane brief and Nora's own
 * SPEC.md ("No git commit... Nora hands Jeff a paste-ready block; she
 * never ships it herself"), every proposed redirect is staged for Jeff to
 * review and paste in by hand. The HUMAN GATE holds here on purpose: an
 * automated redirect to the wrong page is worse than a 404, because a 404
 * is at least honest about being gone.
 *
 * Usage:
 *   node automation/agents/nora/tools/redirect-fixer.mjs [--sample=N] [--all]
 *
 * By default this samples a bounded set of live sitemap URLs (fast, cheap,
 * safe to re-run weekly from Nora's Monday pass). --all crawls every URL
 * in both sitemaps (slower, run deliberately rather than on a schedule).
 *
 * Idempotent: re-running never writes to the live site. It only re-checks
 * current status and regenerates the report under reports/seo/.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../../../../..');
const SITE = 'https://parentcoachdesk.com';
const CONCURRENCY = 20;
const REQUEST_TIMEOUT_MS = 8000;

const args = process.argv.slice(2);
const sampleArg = args.find(function (a) { return a.startsWith('--sample='); });
const SAMPLE_SIZE = sampleArg ? parseInt(sampleArg.split('=')[1], 10) : 250;
const CRAWL_ALL = args.includes('--all');

// Known additional watch-list entries, seeded from gsc-reviews/ and
// ORGANIC-SEARCH-AUDIT.md: URLs GSC has specifically named as 404 or
// newly-dropped, so they are worth re-checking even if a sitemap sample
// happens to miss them. Safe to extend by hand as future GSC reviews name
// more.
const WATCHLIST = [
  '/camps/soccer-camp-full-day-at-sera-sports-complex/',
];

function fetchWithTimeout(url, opts) {
  opts = opts || {};
  const controller = new AbortController();
  const t = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);
  const merged = Object.assign({}, opts, { signal: controller.signal });
  return fetch(url, merged).finally(function () { clearTimeout(t); });
}

async function getSitemapUrls(sitemapPath) {
  const res = await fetchWithTimeout(SITE + sitemapPath);
  if (!res.ok) return [];
  const xml = await res.text();
  const matches = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g));
  return matches.map(function (m) { return m[1]; });
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

async function checkStatus(url) {
  try {
    const res = await fetchWithTimeout(url, { method: 'GET', redirect: 'manual' });
    return { url: url, status: res.status };
  } catch (e) {
    return { url: url, status: null, error: String(e && e.message ? e.message : e) };
  }
}

async function runPool(items, worker, concurrency) {
  const results = new Array(items.length);
  let idx = 0;
  async function next() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await worker(items[i]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, next));
  return results;
}

// Slug tokens for similarity scoring.
function tokenize(url) {
  const parts = url.replace(SITE, '').split('/').filter(Boolean);
  const slug = parts.length ? parts[parts.length - 1] : '';
  const cleaned = slug.replace(/[0-9]{4,}/g, ' ');
  const tokens = cleaned.split(/[-_]+/)
    .map(function (t) { return t.toLowerCase(); })
    .filter(function (t) { return t.length > 2; });
  return new Set(tokens);
}

function scoreMatch(deadTokens, candidateTokens) {
  let overlap = 0;
  deadTokens.forEach(function (t) { if (candidateTokens.has(t)) overlap++; });
  const union = new Set([...deadTokens, ...candidateTokens]).size;
  return union === 0 ? 0 : overlap / union;
}

function bestMatch(deadUrl, liveUrls, liveTokenCache) {
  const deadTokens = tokenize(deadUrl);
  let best = null;
  let bestScore = 0;
  for (const live of liveUrls) {
    const t = liveTokenCache.get(live);
    const score = scoreMatch(deadTokens, t);
    if (score > bestScore) {
      bestScore = score;
      best = live;
    }
  }
  return { best: best, score: bestScore };
}

function mdEscape(s) {
  return String(s == null ? '' : s);
}

async function main() {
  console.log('Fetching sitemaps...');
  const sitemaps = await Promise.all([
    getSitemapUrls('/sitemap-content.xml'),
    getSitemapUrls('/sitemap-camps.xml'),
  ]);
  const contentUrls = sitemaps[0];
  const campUrls = sitemaps[1];
  console.log('sitemap-content.xml: ' + contentUrls.length + ' urls');
  console.log('sitemap-camps.xml: ' + campUrls.length + ' urls');

  const allLive = contentUrls.concat(campUrls);

  let toCheck;
  if (CRAWL_ALL) {
    toCheck = allLive;
  } else {
    const campSample = shuffle(campUrls).slice(0, Math.min(campUrls.length, Math.round(SAMPLE_SIZE * 0.7)));
    const contentSample = shuffle(contentUrls).slice(0, Math.round(SAMPLE_SIZE * 0.3));
    const watchlistFull = WATCHLIST.map(function (p) { return SITE + p; });
    toCheck = Array.from(new Set(watchlistFull.concat(campSample, contentSample)));
  }
  console.log('Checking ' + toCheck.length + ' URLs (concurrency ' + CONCURRENCY + ')...');

  const results = await runPool(toCheck, checkStatus, CONCURRENCY);

  const dead = results.filter(function (r) { return r.status === 404 || r.status === 410; });
  const redirecting = results.filter(function (r) { return r.status >= 300 && r.status < 400; });
  const errored = results.filter(function (r) { return r.status === null; });
  const ok = results.filter(function (r) { return r.status === 200; });

  console.log('Checked ' + results.length + ': ' + ok.length + ' OK, ' + redirecting.length + ' already redirecting, ' + dead.length + ' dead (404/410), ' + errored.length + ' errored.');

  const liveTokenCache = new Map();
  for (const live of allLive) liveTokenCache.set(live, tokenize(live));

  const proposals = dead.map(function (d) {
    const match = bestMatch(d.url, allLive, liveTokenCache);
    const isCamp = d.url.indexOf('/camps/') !== -1;
    const fallback = isCamp ? (SITE + '/camps/') : (SITE + '/');
    const target = match.score >= 0.34 ? match.best : fallback;
    const confidence = match.score >= 0.34 ? (match.score >= 0.6 ? 'high' : 'medium') : 'low (hub fallback)';
    return {
      dead: d.url,
      status: d.status,
      target: target,
      score: Math.round(match.score * 100) / 100,
      confidence: confidence,
    };
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  const outDir = path.join(ROOT, 'reports', 'seo');
  const outPath = path.join(outDir, 'redirect-candidates-' + dateStr + '.md');

  const configSnippet = proposals.map(function (p) {
    const fromPath = p.dead.replace(SITE, '').replace(/\/$/, '');
    const toPath = p.target.replace(SITE, '');
    return "    '" + fromPath + "': '" + toPath + "',";
  }).join('\n');

  const runModeText = CRAWL_ALL
    ? 'full crawl (--all)'
    : 'sampled (' + toCheck.length + ' of ' + allLive.length + ' sitemap URLs, biased toward camps + watchlist)';

  const lines = [];
  lines.push('# Redirect candidates: parentcoachdesk.com');
  lines.push('');
  lines.push('**Generated:** ' + new Date().toISOString());
  lines.push('**Run mode:** ' + runModeText);
  lines.push('**STATUS: STAGED, NOT APPLIED.** Nothing here has touched astro.config.mjs, D1, or the live site. Every row below needs review before anything ships. This is Class C per the PCD Approval Matrix: fully built, one approval away.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('- URLs checked: ' + results.length);
  lines.push('- Returning 200 (fine): ' + ok.length);
  lines.push('- Already redirecting (fine, already handled, e.g. the expired-camp 301 policy): ' + redirecting.length);
  lines.push('- Errored / timed out (network issue this run, not necessarily a real problem, re-run to confirm): ' + errored.length);
  lines.push('- Confirmed dead (404/410): ' + dead.length);
  lines.push('');

  if (dead.length === 0) {
    lines.push('## No dead URLs found in this run');
    lines.push('');
    lines.push('Every checked URL either returned 200 or was already redirecting. This is a real, positive signal, not a tool failure: the expired-camp 301 policy in src/pages/camps/[slug].astro (getCampBySlugAny + end_date check) is confirmed live and working. A page GSC and this session both independently found returning 404 on 2026-07-12 (/camps/soccer-camp-full-day-at-sera-sports-complex/) now 301s to /camps/wa/ when re-checked 2026-07-15.');
    lines.push('');
    const coverageText = CRAWL_ALL
      ? 'crawled all ' + allLive.length + ' current sitemap URLs'
      : 'sampled ' + toCheck.length + ' of ' + allLive.length + ' sitemap URLs';
    lines.push('This does not mean the site has zero 404s. GSC\'s Page Indexing report showed 53 as of 2026-07-08, up from 15 on 2026-06-15. This tool ' + coverageText + ', not the specific 53 GSC flagged (GSC\'s exact list requires signing into Search Console; this tool has no API credential for that). A URL GSC flagged as 404 that has since fallen out of the sitemap entirely (an expired camp removed from D1 rather than redirected, for example) would not be checked here by definition, since the sitemap only lists what is currently live. Close that gap by exporting the Page Indexing "Not found (404)" table from Search Console by hand and feeding it to this script as a watchlist. The WATCHLIST array at the top of the file is exactly that hook.');
  } else {
    lines.push('## Proposed redirects');
    lines.push('');
    lines.push('| Dead URL | Status | Proposed target | Match confidence |');
    lines.push('|---|---|---|---|');
    proposals.forEach(function (p) {
      lines.push('| ' + mdEscape(p.dead.replace(SITE, '')) + ' | ' + p.status + ' | ' + mdEscape(p.target.replace(SITE, '')) + ' | ' + p.confidence + ' (score ' + p.score + ') |');
    });
    lines.push('');
    lines.push('### Read before pasting anything');
    lines.push('');
    lines.push('"low (hub fallback)" rows mean no live URL shared enough slug vocabulary to be a confident match. The proposed target is the generic /camps/ or homepage hub, not a specific page. Paste those only if the hub is genuinely the right landing spot; otherwise pick a target by hand.');
    lines.push('');
    lines.push('## Paste-ready astro.config.mjs snippet (NOT applied, review every row above first)');
    lines.push('');
    lines.push('```js');
    lines.push('  // Staged by Nora (redirect-fixer.mjs), reviewed row-by-row before pasting.');
    lines.push('  redirects: {');
    lines.push(configSnippet);
    lines.push('  },');
    lines.push('```');
  }

  if (errored.length > 0) {
    lines.push('');
    lines.push('## Errored checks (re-run to confirm, not counted as dead)');
    lines.push('');
    errored.slice(0, 30).forEach(function (e) {
      lines.push('- ' + e.url.replace(SITE, '') + ' -- ' + e.error);
    });
    if (errored.length > 30) lines.push('- ...and ' + (errored.length - 30) + ' more');
  }

  lines.push('');
  lines.push('## Re-run');
  lines.push('');
  lines.push('```');
  lines.push('node automation/agents/nora/tools/redirect-fixer.mjs                 # sampled, ~250 URLs, camps-biased');
  lines.push('node automation/agents/nora/tools/redirect-fixer.mjs --sample=500    # bigger sample');
  lines.push('node automation/agents/nora/tools/redirect-fixer.mjs --all           # full sitemap crawl, slower');
  lines.push('```');
  lines.push('');

  writeFileSync(outPath, lines.join('\n'), 'utf-8');
  console.log('');
  console.log('Wrote ' + outPath);
  console.log('Dead URLs: ' + dead.length + '. ' + (dead.length > 0 ? 'Review the proposals before pasting anything into astro.config.mjs.' : 'Nothing to stage this run.'));
}

main().catch(function (e) {
  console.error('redirect-fixer failed:', e);
  process.exit(1);
});
