#!/usr/bin/env node
// Imports a CSV of camp rows by POSTing each to /api/camps/submit.
// The submit endpoint runs URL liveness + dedup + dead-link gates, so any bad
// rows are rejected with a clear error from the server. This script reports
// succeeded / rejected / skipped counts with the API's error message inline.
//
// Run from project root:
//   node scripts/import-camps-csv.mjs <path-to-csv>
//
// Examples:
//   node scripts/import-camps-csv.mjs imports/cityoflakewood.csv
//
// Optional flags:
//   --email <addr>   submitter email (default: parentcoachplaybook@gmail.com)
//   --base <url>     site base (default: https://parentcoachplaybook.com)
//   --dry-run        parse + validate only, do not POST

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args[i + 1];
};

const csvPath = positional[0];
if (!csvPath) {
  console.error('Usage: node scripts/import-camps-csv.mjs <csv-path> [--email addr] [--base url] [--dry-run]');
  process.exit(1);
}

const SUBMITTER_EMAIL = flag('email', 'parentcoachplaybook@gmail.com');
const BASE_URL = flag('base', 'https://parentcoachplaybook.com');
const DRY = args.includes('--dry-run');

console.log(`Importing ${csvPath}`);
console.log(`  submitter: ${SUBMITTER_EMAIL}`);
console.log(`  endpoint:  ${BASE_URL}/api/camps/submit`);
if (DRY) console.log('  mode:      DRY RUN (no POSTs)');
console.log('');

const text = await readFile(resolve(csvPath), 'utf8');
const { rows, headerCount } = parseCsv(text);
console.log(`Parsed ${rows.length} data rows (${headerCount} columns).`);

const required = [
  'name', 'sport', 'age_min', 'age_max', 'start_date', 'end_date',
  'address', 'city', 'state', 'zip', 'description',
];

let ok = 0;
let failed = 0;
const errors = [];

for (let i = 0; i < rows.length; i += 1) {
  const row = rows[i];
  const missing = required.filter((k) => !row[k] || String(row[k]).trim() === '');
  if (missing.length) {
    failed += 1;
    errors.push({ row: i + 1, name: row.name || '(no name)', error: `missing fields: ${missing.join(', ')}` });
    continue;
  }

  const payload = {
    name: row.name,
    sport: row.sport,
    age_min: row.age_min,
    age_max: row.age_max,
    start_date: row.start_date,
    end_date: row.end_date,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    description: row.description,
    price_text: row.price_text || '',
    day_or_overnight: row.day_or_overnight || 'day',
    skill_level: row.skill_level || 'all',
    spots_status: row.spots_status || 'open',
    contact_email: row.contact_email || '',
    contact_phone: row.contact_phone || '',
    website_url: row.website_url || '',
    lunch_included: String(row.lunch_included).toLowerCase() === 'true',
    aftercare_available: String(row.aftercare_available).toLowerCase() === 'true',
    submitted_by_email: SUBMITTER_EMAIL,
    confidence: row.confidence || 'medium',
    confirm_duplicate: 'true', // pre-acknowledge; the dedup probe still runs server-side
  };

  if (DRY) {
    console.log(`[dry] ${row.name} → would POST`);
    ok += 1;
    continue;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/camps/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.ok) {
      ok += 1;
      console.log(`✓ ${row.name} → ${body.status} (${body.slug})`);
    } else {
      failed += 1;
      const err = body.error || body.warning || `HTTP ${res.status}`;
      errors.push({ row: i + 1, name: row.name, error: err });
      console.log(`✗ ${row.name} → ${err}`);
    }
  } catch (e) {
    failed += 1;
    errors.push({ row: i + 1, name: row.name, error: e.message });
    console.log(`✗ ${row.name} → ${e.message}`);
  }

  // Tiny pause to be polite (geocode + URL health check both happen server-side)
  await new Promise((r) => setTimeout(r, 250));
}

console.log('');
console.log(`Done. ${ok} succeeded, ${failed} failed.`);
if (errors.length > 0) {
  console.log('\nFailures:');
  for (const e of errors) console.log(`  row ${e.row}: ${e.name} — ${e.error}`);
}

// --- helpers ---

function parseCsv(text) {
  const lines = text.split(/\r?\n/);
  // Find header row (first non-comment, non-empty line)
  let headerIdx = 0;
  while (headerIdx < lines.length && (!lines[headerIdx].trim() || lines[headerIdx].trim().startsWith('#'))) {
    headerIdx += 1;
  }
  const headers = parseLine(lines[headerIdx]);
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.trim().startsWith('#')) continue;
    const cells = parseLine(line);
    const obj = {};
    headers.forEach((h, idx) => (obj[h] = cells[idx] ?? ''));
    rows.push(obj);
  }
  return { rows, headerCount: headers.length };
}

function parseLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i += 1; }
      else if (c === '"') { inQuotes = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
