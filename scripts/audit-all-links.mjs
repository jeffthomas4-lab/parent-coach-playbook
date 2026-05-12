#!/usr/bin/env node
// One-shot link audit: checks every external URL on the site.
//
// Sources checked:
//   1. public/link-manifest.json — every URL in articles, pages, affiliate /go targets,
//      governing bodies, sources page, etc. (regenerated on each `npm run build`).
//   2. All approved camps' website_url values pulled from D1.
//
// Output: link-audit-<timestamp>.csv in the project root. Open it in Excel/Sheets.
// Sorted with failures (dead, timeout) at the top.
//
// Run from project root:
//   node scripts/audit-all-links.mjs
//
// Takes ~5–15 minutes depending on link count. Concurrency capped at 10 to be polite.

import { readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
const MANIFEST_PATH = join(ROOT, 'public/link-manifest.json');
const TIMEOUT_MS = 10000;
const CONCURRENCY = 10;
const USER_AGENT = 'parentcoachdesk.com link audit (https://parentcoachdesk.com)';

// --- 1. Gather URLs from the manifest ---

console.log('Reading link manifest...');
const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
const manifestUrls = manifest.links.map((l) => ({
  url: l.url,
  source: 'manifest',
  detail: l.sources.slice(0, 3).join('; ') + (l.sources.length > 3 ? `; +${l.sources.length - 3} more` : ''),
}));
console.log(`  ${manifestUrls.length} URLs from articles, pages, affiliates`);

// --- 2. Gather URLs from D1 (approved camps) ---

console.log('Pulling approved camp URLs from D1...');
let campUrls = [];
try {
  const sql = `SELECT name, website_url FROM camps WHERE status = 'approved' AND website_url IS NOT NULL AND website_url != ''`;
  const raw = execSync(
    `npx wrangler d1 execute parent-coach-desk --command "${sql}" --remote --json`,
    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] },
  );
  const parsed = JSON.parse(raw);
  // wrangler --json returns an array of result groups
  const rows = parsed?.[0]?.results ?? [];
  campUrls = rows.map((r) => ({
    url: r.website_url,
    source: 'camp',
    detail: r.name,
  }));
  console.log(`  ${campUrls.length} approved camp URLs from D1`);
} catch (e) {
  console.warn('  ! Failed to pull camps from D1. Continuing with manifest-only audit.');
  console.warn('    Reason:', e.message?.slice(0, 200));
}

// --- 3. Dedupe + check ---

const all = [...manifestUrls, ...campUrls];
const byUrl = new Map();
for (const item of all) {
  if (!byUrl.has(item.url)) byUrl.set(item.url, { url: item.url, sources: [] });
  byUrl.get(item.url).sources.push({ source: item.source, detail: item.detail });
}
const unique = [...byUrl.values()];
console.log(`Checking ${unique.length} unique URLs at concurrency=${CONCURRENCY}...`);

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': USER_AGENT },
    });
    if (res.status >= 400) {
      // Some servers reject HEAD. Retry with GET.
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT },
      });
    }
    clearTimeout(timer);
    let status;
    if (res.status >= 200 && res.status < 300) status = 'live';
    else if (res.status >= 300 && res.status < 400) status = 'redirect';
    else status = 'dead';
    return { status, code: res.status, finalUrl: res.url };
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') return { status: 'timeout', code: null, finalUrl: null };
    return { status: 'dead', code: null, finalUrl: null, error: err.message?.slice(0, 100) };
  }
}

const results = [];
let done = 0;

async function worker(queue) {
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    const result = await check(item.url);
    results.push({ ...item, ...result });
    done += 1;
    if (done % 10 === 0 || done === unique.length) {
      process.stdout.write(`\r  ${done}/${unique.length}`);
    }
  }
}

const queue = [...unique];
const workers = Array.from({ length: CONCURRENCY }, () => worker(queue));
await Promise.all(workers);
console.log('');

// --- 4. Sort + write CSV ---

const STATUS_RANK = { dead: 0, timeout: 1, redirect: 2, live: 3 };
results.sort((a, b) => {
  const r = STATUS_RANK[a.status] - STATUS_RANK[b.status];
  if (r !== 0) return r;
  return a.url.localeCompare(b.url);
});

const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
const outPath = join(ROOT, `link-audit-${ts}.csv`);

const escape = (s) => {
  if (s == null) return '';
  const str = String(s);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

const lines = ['status,code,url,sources,details,error'];
for (const r of results) {
  const sourceTags = [...new Set(r.sources.map((s) => s.source))].join('+');
  const detailJoined = r.sources.map((s) => s.detail).filter(Boolean).join(' | ');
  lines.push([r.status, r.code ?? '', r.url, sourceTags, detailJoined, r.error ?? ''].map(escape).join(','));
}
await writeFile(outPath, lines.join('\n') + '\n');

const tally = results.reduce((m, r) => ((m[r.status] = (m[r.status] || 0) + 1), m), {});
console.log('\nSummary:');
console.log(`  live:     ${tally.live ?? 0}`);
console.log(`  redirect: ${tally.redirect ?? 0}`);
console.log(`  dead:     ${tally.dead ?? 0}`);
console.log(`  timeout:  ${tally.timeout ?? 0}`);
console.log(`\nReport: ${outPath}`);
