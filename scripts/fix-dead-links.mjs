#!/usr/bin/env node
// Reads the most recent link-audit-*.csv and:
//   1. Archives every dead approved camp via D1 (status=rejected, reason=dead-url)
//   2. Prints the dead manifest URLs grouped by source file so you can edit them by hand
//   3. Appends every dead URL to imports/DEAD-LINKS-LOG.md so we don't re-import them
//      blindly later. Idempotent: existing entries are not duplicated.
//
// Run from project root:  node scripts/fix-dead-links.mjs
//
// Pass --dry-run to preview the SQL without executing it.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
const DRY = process.argv.includes('--dry-run');

// --- 1. Find the latest audit CSV ---

const files = (await readdir(ROOT)).filter((f) => f.startsWith('link-audit-') && f.endsWith('.csv'));
if (files.length === 0) {
  console.error('No link-audit-*.csv in project root. Run scripts/audit-all-links.mjs first.');
  process.exit(1);
}
files.sort();
const latest = files[files.length - 1];
console.log(`Reading ${latest}...`);

const csv = await readFile(join(ROOT, latest), 'utf8');
const rows = parseCsv(csv);
const dead = rows.filter((r) => r.status === 'dead' || r.status === 'timeout');
console.log(`  ${dead.length} dead/timeout entries`);

// --- 2. Split into camp URLs vs manifest URLs ---

const deadCamps = [];
const deadManifest = [];
for (const r of dead) {
  const tags = (r.sources || '').split('+');
  if (tags.includes('camp')) deadCamps.push(r);
  if (tags.includes('manifest')) deadManifest.push(r);
}

// --- 3. Archive dead camps ---

if (deadCamps.length > 0) {
  console.log(`\n=== Archiving ${deadCamps.length} dead camps ===`);
  const urls = deadCamps.map((c) => c.url.replace(/'/g, "''"));
  const inClause = urls.map((u) => `'${u}'`).join(',');
  const sql = `UPDATE camps SET status = 'rejected', reject_reason_code = 'dead-url', reviewed_by = 'audit-script', reviewed_at = datetime('now'), review_notes = 'Auto-archived: URL dead in full-site audit' WHERE status = 'approved' AND website_url IN (${inClause})`;
  if (DRY) {
    console.log('--dry-run: would execute:');
    console.log(sql);
  } else {
    try {
      execSync(
        `npx wrangler d1 execute parent-coach-playbook --command "${sql.replace(/"/g, '\\"')}" --remote`,
        { stdio: 'inherit' },
      );
      console.log(`✓ Archived ${deadCamps.length} camps`);
    } catch (e) {
      console.error('! D1 execute failed:', e.message);
    }
  }
} else {
  console.log('\nNo dead camps to archive.');
}

// --- 4. Print dead manifest URLs grouped by source file ---

if (deadManifest.length > 0) {
  console.log(`\n=== ${deadManifest.length} dead URLs in articles / pages / affiliates ===`);
  console.log('These need manual edits. Each URL is listed with the file(s) that reference it.\n');

  // Group by source file
  const byFile = new Map();
  for (const r of deadManifest) {
    const detail = r.details || '';
    const files = detail.split(';').map((s) => s.trim()).filter(Boolean);
    for (const f of files) {
      if (!byFile.has(f)) byFile.set(f, []);
      byFile.get(f).push({ url: r.url, code: r.code });
    }
  }

  const sortedFiles = [...byFile.keys()].sort();
  for (const f of sortedFiles) {
    console.log(`📄 ${f}`);
    for (const { url, code } of byFile.get(f)) {
      console.log(`   [${code || '---'}]  ${url}`);
    }
    console.log('');
  }

  console.log('Triage options for each URL:');
  console.log('  • If the URL has moved: find the new URL and update the markdown.');
  console.log('  • If the resource is genuinely gone: remove the link (keep the prose).');
  console.log('  • If the site blocks HEAD/UA crawling but is fine in a browser: ignore (false positive).');
} else {
  console.log('\nNo dead manifest URLs.');
}

// --- 5. Append everything to the permanent dead-links log ---

const LOG_PATH = join(ROOT, 'imports', 'DEAD-LINKS-LOG.md');
const today = new Date().toISOString().slice(0, 10);

let existing = '';
if (existsSync(LOG_PATH)) {
  existing = await readFile(LOG_PATH, 'utf8');
} else {
  existing = `# Dead links log

Permanent record of URLs that have failed our health check at least once.

When importing camps or writing new content, search this file before adding any URL
that you suspect might already be on the bad list. URLs are kept here even after
they're removed from the site so we don't re-introduce them later.

If a URL on this list later starts working again (operator fixed it, etc.), feel free
to remove it from this log AND add it back to wherever it belongs.

Format: \`<date> | <status_code> | <source_tag> | <url> | <context>\`

---

`;
}

const newLines = [];
for (const r of dead) {
  if (existing.includes(`| ${r.url} |`)) continue; // already logged
  const tags = r.sources || '';
  const context = (r.details || '').replace(/\|/g, '/').slice(0, 120);
  newLines.push(`${today} | ${r.code || '---'} | ${tags} | ${r.url} | ${context}`);
}

if (newLines.length > 0) {
  const updated = existing + newLines.join('\n') + '\n';
  if (DRY) {
    console.log(`\n--dry-run: would append ${newLines.length} lines to ${LOG_PATH}`);
  } else {
    await writeFile(LOG_PATH, updated);
    console.log(`\n✓ Logged ${newLines.length} new dead URLs to imports/DEAD-LINKS-LOG.md`);
  }
} else {
  console.log('\n(no new entries for the dead-links log; everything was already recorded)');
}

// --- helpers ---

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const obj = {};
    headers.forEach((h, i) => (obj[h] = cells[i] ?? ''));
    return obj;
  });
}

function parseLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cur += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') {
        out.push(cur);
        cur = '';
      } else cur += c;
    }
  }
  out.push(cur);
  return out;
}
