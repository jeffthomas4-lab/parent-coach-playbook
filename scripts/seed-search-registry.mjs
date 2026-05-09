#!/usr/bin/env node
// One-time seed: parses imports/CAMP-SEARCH-LOG.md and writes the registry into
// D1. Idempotent — re-running is safe because every upsert is keyed on domain/slug.
//
// Run from project root after applying migrations/0007:
//   node scripts/seed-search-registry.mjs
//
// Pass --dry-run to print what would be written without touching D1.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
const LOG_PATH = resolve(ROOT, 'imports/CAMP-SEARCH-LOG.md');
const DRY = process.argv.includes('--dry-run');

const md = await readFile(LOG_PATH, 'utf8');

// --- Parse the Domain Registry table ---
// Find the table by locating the header row that starts with "| Domain |"
// and read until a blank or section break.

function parseRegistry(text) {
  const lines = text.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => /^\|\s*Domain\s*\|/i.test(l));
  if (startIdx === -1) return [];
  // Skip header + separator
  const rows = [];
  for (let i = startIdx + 2; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 8) continue;
    const [domain, organization, area, last, result, pulled, recheck, ...noteParts] = cells;
    if (!domain) continue;
    rows.push({
      domain: domain.split('/')[0].trim(), // keep the first domain when slash-listed
      organization: organization === '(none — DNS NXDOMAIN)' ? null : organization || null,
      area_covered: areaToSlug(area),
      last_checked: normDate(last),
      result: normResult(result),
      camps_pulled: Number.parseInt(pulled, 10) || 0,
      next_recheck_after: normDate(recheck),
      notes: noteParts.join(' | ').trim() || null,
      permanent_skip: 0,
    });
  }
  return rows;
}

function parseAnchors(text) {
  const lines = text.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => /^\|\s*Anchor\s*\|/i.test(l));
  if (startIdx === -1) return [];
  const rows = [];
  for (let i = startIdx + 2; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 7) continue;
    const [anchor, radius, status, last, next, count, ...noteParts] = cells;
    if (!anchor) continue;
    const slug = anchorSlug(anchor, radius);
    const radiusMiles = Number.parseInt(radius, 10) || 25;
    rows.push({
      slug,
      city: anchor.trim(),
      radius_miles: radiusMiles,
      status: normAnchorStatus(status),
      last_batch_at: normDate(last),
      next_batch_after: normDate(next),
      notes: noteParts.join(' | ').trim() || null,
      ring: 1,
      position: 0,
    });
  }
  // Number positions in order
  return rows.map((r, i) => ({ ...r, position: i }));
}

function areaToSlug(area) {
  // "Tacoma 25mi" -> "tacoma-25mi"
  return area
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}
function anchorSlug(city, radius) {
  const r = (radius || '').replace(/[^0-9]/g, '') || '25';
  return city
    .toLowerCase()
    .replace(/[,]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    + `-${r}mi`;
}
function normDate(s) {
  if (!s) return null;
  const m = s.match(/\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : null;
}
function normResult(r) {
  const v = (r || '').toLowerCase().trim();
  if (['camps_extracted', 'partial', 'blocked', 'stale_listings', 'no_camps'].includes(v)) return v;
  return 'unknown';
}
function normAnchorStatus(s) {
  const v = (s || '').toLowerCase().trim().split(/\s/)[0];
  if (['not_started', 'in_progress', 'saturated', 'diminishing', 'paused'].includes(v)) return v;
  return 'not_started';
}

const domains = parseRegistry(md);
const anchors = parseAnchors(md);

console.log(`Parsed ${anchors.length} anchors and ${domains.length} domains from the markdown log.`);

if (DRY) {
  console.log('\n--dry-run: would upsert these anchors:');
  for (const a of anchors) console.log(`  ${a.slug.padEnd(20)} ${a.status.padEnd(15)} (${a.city})`);
  console.log('\n--dry-run: would upsert these domains:');
  for (const d of domains) console.log(`  ${d.domain.padEnd(48)} ${d.result.padEnd(18)} pulled=${d.camps_pulled}`);
  process.exit(0);
}

// --- Write to D1 via wrangler ---

function escapeSql(s) {
  if (s === null || s === undefined) return 'NULL';
  return `'${String(s).replace(/'/g, "''")}'`;
}

function buildAnchorSql(a) {
  return `INSERT INTO search_anchors (slug, city, radius_miles, status, last_batch_at, next_batch_after, notes, ring, position) VALUES (${escapeSql(a.slug)}, ${escapeSql(a.city)}, ${a.radius_miles}, ${escapeSql(a.status)}, ${escapeSql(a.last_batch_at)}, ${escapeSql(a.next_batch_after)}, ${escapeSql(a.notes)}, ${a.ring}, ${a.position}) ON CONFLICT(slug) DO UPDATE SET city=excluded.city, radius_miles=excluded.radius_miles, status=excluded.status, last_batch_at=excluded.last_batch_at, next_batch_after=excluded.next_batch_after, notes=excluded.notes, ring=excluded.ring, position=excluded.position, updated_at=datetime('now');`;
}
function buildDomainSql(d) {
  return `INSERT INTO search_domains (domain, organization, area_covered, last_checked, result, camps_pulled, next_recheck_after, notes, permanent_skip) VALUES (${escapeSql(d.domain)}, ${escapeSql(d.organization)}, ${escapeSql(d.area_covered)}, ${escapeSql(d.last_checked)}, ${escapeSql(d.result)}, ${d.camps_pulled}, ${escapeSql(d.next_recheck_after)}, ${escapeSql(d.notes)}, ${d.permanent_skip}) ON CONFLICT(domain) DO UPDATE SET organization=excluded.organization, area_covered=excluded.area_covered, last_checked=excluded.last_checked, result=excluded.result, camps_pulled=excluded.camps_pulled, next_recheck_after=excluded.next_recheck_after, notes=excluded.notes, permanent_skip=excluded.permanent_skip, updated_at=datetime('now');`;
}

// Build a single .sql file with all upserts and execute it in one wrangler call.
// This avoids spawning 30+ separate wrangler processes (slow + flaky).

const sqlLines = [
  '-- Auto-generated by scripts/seed-search-registry.mjs',
  '-- Source: imports/CAMP-SEARCH-LOG.md',
  '',
];
for (const a of anchors) sqlLines.push(buildAnchorSql(a));
sqlLines.push('');
for (const d of domains) sqlLines.push(buildDomainSql(d));

const SQL_OUT = resolve(ROOT, 'imports/.cache/seed-search-registry.sql');
await mkdir(dirname(SQL_OUT), { recursive: true });
await writeFile(SQL_OUT, sqlLines.join('\n') + '\n');

console.log(`Wrote ${sqlLines.length} SQL statements to ${SQL_OUT}`);
console.log('Executing against D1 via single wrangler call...');

try {
  execSync(
    `npx wrangler d1 execute parent-coach-playbook --file="${SQL_OUT}" --remote`,
    { stdio: 'inherit' },
  );
  console.log(`\n✓ Seeded ${anchors.length} anchors and ${domains.length} domains`);
  console.log('\nTest the API:');
  console.log('  curl "https://parentcoachplaybook.com/api/camps/search-priority?anchor=tacoma-wa-25mi"');
} catch (e) {
  console.error('! D1 execute failed. The generated SQL is at:');
  console.error('   ' + SQL_OUT);
  console.error('You can inspect it and run manually with:');
  console.error(`   npx wrangler d1 execute parent-coach-playbook --file="${SQL_OUT}" --remote`);
  process.exit(1);
}
