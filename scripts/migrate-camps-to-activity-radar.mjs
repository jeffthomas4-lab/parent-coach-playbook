#!/usr/bin/env node
// migrate-camps-to-activity-radar.mjs
// Reads wrangler d1 export SQL dump, outputs INSERT SQL for activity-radar.
// Usage: node scripts/migrate-camps-to-activity-radar.mjs
// Then:  npx wrangler d1 execute activity-radar --file=./scripts/migrate-camps-to-activity-radar.sql --remote

import { readFileSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INPUT  = join(__dirname, 'old-camps-export.json');
const OUTPUT = join(__dirname, 'migrate-camps-to-activity-radar.sql');

function parseValues(valuesStr) {
  const s = valuesStr.trim().replace(/^\(/, '').replace(/\);?\s*$/, '');
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === ',' || s[i] === ' ' || s[i] === '\t') { i++; continue; }
    if (s.slice(i, i + 4) === 'NULL') { tokens.push(null); i += 4; continue; }
    if (s[i] === "'") {
      i++;
      let str = '';
      while (i < s.length) {
        if (s[i] === "'" && s[i+1] === "'") { str += "'"; i += 2; }
        else if (s[i] === "'") { i++; break; }
        else { str += s[i]; i++; }
      }
      tokens.push(str);
      continue;
    }
    const nm = s.slice(i).match(/^-?\d+(\.\d+)?/);
    if (nm) { tokens.push(nm[0].includes('.') ? parseFloat(nm[0]) : parseInt(nm[0],10)); i += nm[0].length; continue; }
    i++;
  }
  return tokens;
}

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  return `'${String(v).replace(/'/g, "''")}'`;
}

const dump = readFileSync(INPUT, 'utf8');

const headerMatch = dump.match(/INSERT INTO "camps" \(([^)]+)\) VALUES/);
if (!headerMatch) { console.error('No INSERT INTO "camps" rows found.'); process.exit(1); }
const columns = headerMatch[1].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
console.log(`Columns (${columns.length}): ${columns.slice(0,5).join(', ')}...`);

const insertRegex = /^INSERT INTO "camps" \([^)]+\) VALUES(\([\s\S]*?\));$/gm;
const rows = [];
let m;
while ((m = insertRegex.exec(dump)) !== null) {
  const vals = parseValues(m[1]);
  if (vals.length !== columns.length) { console.warn(`Row len mismatch ${vals.length} vs ${columns.length} — skip`); continue; }
  const row = {};
  columns.forEach((col, i) => { row[col] = vals[i]; });
  rows.push(row);
}
console.log(`Parsed ${rows.length} camp rows.`);
if (rows.length === 0) { console.error('No rows parsed.'); process.exit(1); }

const lines = [
  '-- migrate-camps-to-activity-radar.sql',
  `-- Source: ${rows.length} rows from parent-coach-playbook D1`,
  '-- Both INSERTs use OR IGNORE — safe to re-run.',
  '',
];

let skipped = 0, written = 0;

for (const c of rows) {
  if (!c.id || !c.slug || !c.name) { skipped++; continue; }
  const orgId = randomUUID();
  const now   = c.submitted_at ?? new Date().toISOString();
  const pcd   = c.status ?? 'pending';
  const rs    = pcd === 'approved' ? 'active' : pcd === 'rejected' ? 'inactive' : 'unverified';
  const cs    = c.confidence === 'high' ? 80 : c.confidence === 'low' ? 20 : 50;
  const src   = c.source_domain ? 'scraped' : 'manual';

  lines.push(
    `INSERT OR IGNORE INTO organizations (id,slug,name,organization_type,website_url,email,phone,address,city,state,zip,latitude,longitude,description,record_source,record_status,is_claimed,claimed_by_email,claim_paid_until,logo_key,gallery_keys,confidence_score,created_at,updated_at) VALUES (` +
    [esc(orgId),esc(`org-${c.id}`),esc(c.name),"'other'",esc(c.website_url),esc(c.contact_email),esc(c.contact_phone),esc(c.address),esc(c.city),esc(c.state),esc(c.zip),esc(c.latitude),esc(c.longitude),esc((c.description??'').slice(0,500)),esc(src),esc(rs),esc(c.is_claimed??0),esc(c.claimed_by_email),esc(c.claim_paid_until),esc(c.logo_key),esc(c.gallery_keys),esc(cs),esc(now),esc(now)].join(',') +
    ');'
  );

  lines.push(
    `INSERT OR IGNORE INTO programs (id,organization_id,slug,name,program_type,activity_category,description,age_min,age_max,skill_level,session_start_date,session_end_date,price_text,day_or_overnight,lunch_included,aftercare_available,availability_status,registration_url,registration_deadline,schedule_text,contact_email,contact_phone,record_source,record_status,confidence_score,source_domain,hero_photo_key,pcd_status,submitted_by_email,submitted_at,reviewed_by,reviewed_at,review_notes,reject_reason_code,verified,awaiting_review,featured,featured_order,featured_until,url_health_status,url_last_checked_at,url_last_status_code,last_edited_at,last_edited_by,pcd_confidence,legacy_camp_id,legacy_slug,created_at,updated_at) VALUES (` +
    [esc(c.id),esc(orgId),esc(c.slug),esc(c.name),esc(c.program_type??'camp'),esc(c.sport),esc(c.description),esc(c.age_min),esc(c.age_max),esc(c.skill_level??'all'),esc(c.start_date),esc(c.end_date),esc(c.price_text),esc(c.day_or_overnight??'day'),esc(c.lunch_included??0),esc(c.aftercare_available??0),esc(c.spots_status??'open'),esc(c.registration_url??c.website_url),esc(c.registration_deadline),esc(c.schedule_text),esc(c.contact_email),esc(c.contact_phone),esc(src),esc(rs),esc(cs),esc(c.source_domain),esc(c.hero_photo_key),esc(pcd),esc(c.submitted_by_email??'system'),esc(c.submitted_at??now),esc(c.reviewed_by),esc(c.reviewed_at),esc(c.review_notes),esc(c.reject_reason_code),esc(c.verified??0),esc(c.awaiting_review??0),esc(c.featured??0),esc(c.featured_order),esc(c.featured_until),esc(c.url_health_status??'unchecked'),esc(c.url_last_checked_at),esc(c.url_last_status_code),esc(c.last_edited_at),esc(c.last_edited_by),esc(c.confidence??'medium'),esc(c.id),esc(c.slug),esc(now),esc(now)].join(',') +
    ');'
  );

  lines.push('');
  written++;
}

writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
console.log(`\nDone. ${written} written, ${skipped} skipped.`);
console.log(`Output: ${OUTPUT}`);
