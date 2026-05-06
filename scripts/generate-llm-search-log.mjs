#!/usr/bin/env node
// Generates imports/CAMP-SEARCH-LOG-LLM.md — a slim, LLM-friendly version of
// the full CAMP-SEARCH-LOG.md. Notes are truncated to 80 chars max. Domains
// where next_recheck_after is in the future are removed from the visible list
// and consolidated into a compact "do not visit" section listing only domains.
//
// Run after every batch:
//   node scripts/generate-llm-search-log.mjs
//
// Output is committed alongside the full version. The Claude in Chrome prompt
// reads the slim version (CAMP-SEARCH-LOG-LLM.md), humans read the full version.

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const FULL_PATH = resolve(ROOT, 'imports/CAMP-SEARCH-LOG.md');
const SLIM_PATH = resolve(ROOT, 'imports/CAMP-SEARCH-LOG-LLM.md');
const SLIM_NOTE_LEN = 80;
const TODAY = new Date().toISOString().slice(0, 10);

const md = await readFile(FULL_PATH, 'utf8');

function parseRegistry(text) {
  const lines = text.split(/\r?\n/);
  const startIdx = lines.findIndex((l) => /^\|\s*Domain\s*\|/i.test(l));
  if (startIdx === -1) return [];
  const rows = [];
  for (let i = startIdx + 2; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim().startsWith('|')) break;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 8) continue;
    const [domain, organization, area, last, result, pulled, recheck, ...noteParts] = cells;
    rows.push({
      domain,
      organization,
      area,
      last_checked: last,
      result,
      camps_pulled: pulled,
      next_recheck_after: recheck,
      notes: noteParts.join(' | ').trim(),
    });
  }
  return rows;
}

function slim(s) {
  if (!s) return '';
  const flat = s.replace(/\s+/g, ' ').trim();
  return flat.length <= SLIM_NOTE_LEN ? flat : flat.slice(0, SLIM_NOTE_LEN - 1) + '…';
}

const rows = parseRegistry(md);

// Bucket by relevance
const dueOrNeverChecked = [];
const futureRecheck = []; // skip from the visible table; just list the domain
const noCamps = [];

for (const r of rows) {
  const recheckDate = r.next_recheck_after?.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
  const result = r.result.toLowerCase();
  if (result === 'no_camps') {
    noCamps.push(r.domain);
    continue;
  }
  if (recheckDate && recheckDate > TODAY) {
    futureRecheck.push({ domain: r.domain, date: recheckDate });
    continue;
  }
  dueOrNeverChecked.push(r);
}

// Build slim markdown
let out = `# Camp + League Search Log (slim, LLM-facing)

Auto-generated from CAMP-SEARCH-LOG.md. Read this version for batch planning.
Humans should read the full version for prose notes and history.

**Generated:** ${TODAY}
**Counts:** ${dueOrNeverChecked.length} domains in active queue · ${futureRecheck.length} on cooldown · ${noCamps.length} no_camps

---

## Active queue (visit or recheck these)

| Domain | Org | Result | Pulled | Recheck after | Note |
|---|---|---|---|---|---|
`;

for (const r of dueOrNeverChecked) {
  out += `| ${r.domain} | ${r.organization} | ${r.result} | ${r.camps_pulled} | ${r.next_recheck_after} | ${slim(r.notes)} |\n`;
}

out += `\n---\n\n## Skip (recheck date in the future)\n\nDo not visit these — they're already on a future recheck schedule.\n\n`;
if (futureRecheck.length === 0) {
  out += `*(none)*\n`;
} else {
  out += futureRecheck.map((d) => `- \`${d.domain}\` (recheck after ${d.date})`).join('\n') + '\n';
}

out += `\n---\n\n## Skip (confirmed no_camps)\n\nNever visit these — confirmed no youth camps.\n\n`;
if (noCamps.length === 0) {
  out += `*(none)*\n`;
} else {
  out += noCamps.map((d) => `- \`${d}\``).join('\n') + '\n';
}

await writeFile(SLIM_PATH, out);

const fullSize = md.length;
const slimSize = out.length;
const pct = Math.round((1 - slimSize / fullSize) * 100);
console.log(`✓ Wrote ${SLIM_PATH}`);
console.log(`  Full version: ${fullSize.toLocaleString()} chars`);
console.log(`  Slim version: ${slimSize.toLocaleString()} chars (${pct}% smaller)`);
console.log(`  ${dueOrNeverChecked.length} active · ${futureRecheck.length} cooldown · ${noCamps.length} no_camps`);
