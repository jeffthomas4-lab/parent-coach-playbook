#!/usr/bin/env node
/**
 * Guard (2026-10-12): flag dek / bluf text that was cut mid-sentence and
 * given a period. Five live BabyLoveGrowth imports shipped that way
 * ("...the scripts, and a realistic.") because the importer sliced to a
 * length and then called ensureCompleteSentence. The importer is fixed
 * (clipToSentences in src/lib/babylove-growth.ts); this catches any repeat
 * and any hand edit that does the same thing.
 *
 * Signals, per article (all sources by default, --babylove for imports only):
 *  1. dek minus its final period is a strict prefix of bluf, and bluf does not
 *     end a sentence at that point (dek was clipped from bluf).
 *  2. dek or bluf minus its final period appears in the body, and the body
 *     carries on mid-sentence right after it (field was clipped from body).
 *  3. bluf or dek ends in a dangling word ("a realistic.", "to keep.",
 *     "for extended.", "coming back next.") per a short stop list.
 *
 * Usage: node scripts/check-truncated-summaries.mjs [--babylove] [--json] [--strict]
 * Known backlog lives in scripts/truncated-summaries-baseline.json. Exit 1
 * when a file NOT in the baseline is flagged (new regressions fail the build),
 * or when anything is flagged under --strict. Baseline files are listed as
 * warnings until they are rewritten; remove them from the baseline then.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const DIR = join(root, 'src/content/articles');
const args = new Set(process.argv.slice(2));

const norm = (v) => v.replace(/\s+/g, ' ').trim();
const stripEnd = (v) => norm(v).replace(/[.!?…]+$/, '');
const plain = (md) => norm(md
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[*_`>#|]+/g, ' '));
const DANGLING = /\b(?:a|an|the|and|or|of|with|realistic|extended|very|your|their|our|its)\.$/i;

function field(fm, key) {
  const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!m) return '';
  let v = m[1].trim();
  if (v.startsWith('"')) { try { return JSON.parse(v); } catch { return v.slice(1, -1); } }
  if (v.startsWith("'")) return v.slice(1, -1).replace(/''/g, "'");
  return v;
}

function continuesMidSentence(clipped, source) {
  const a = stripEnd(clipped);
  if (a.length < 30) return false;
  const i = source.indexOf(a);
  if (i < 0) return false;
  const rest = source.slice(i + a.length);
  return rest.length > 0 && !/^[.!?…]/.test(rest);
}

export function checkArticle(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return [];
  const [, fm, body] = m;
  const dek = field(fm, 'dek'), bluf = field(fm, 'bluf');
  const bodyText = plain(body);
  const issues = [];
  if (dek && bluf && continuesMidSentence(dek, norm(bluf))) issues.push('dek is a mid-sentence cut of bluf');
  for (const [k, v] of [['dek', dek], ['bluf', bluf]]) {
    if (!v) continue;
    if (continuesMidSentence(v, bodyText)) issues.push(`${k} is a mid-sentence cut of the body`);
    if (DANGLING.test(norm(v))) issues.push(`${k} ends on a dangling word: "${norm(v).slice(-40)}"`);
  }
  return [...new Set(issues)];
}

async function main() {
  const out = [];
  for (const name of (await readdir(DIR)).filter((n) => n.endsWith('.md')).sort()) {
    const text = await readFile(join(DIR, name), 'utf8');
    if (args.has('--babylove') && !/provider:\s*["']?babylovegrowth/.test(text)) continue;
    const issues = checkArticle(text);
    if (issues.length) out.push({ file: `src/content/articles/${name}`, issues });
  }
  let baseline = [];
  try { baseline = JSON.parse(await readFile(join(root, 'scripts/truncated-summaries-baseline.json'), 'utf8')).files ?? []; } catch {}
  const known = new Set(baseline);
  const fresh = out.filter((o) => !known.has(o.file));
  const failing = args.has('--strict') ? out : fresh;
  if (args.has('--write-baseline')) {
    const { writeFile } = await import('node:fs/promises');
    await writeFile(join(root, 'scripts/truncated-summaries-baseline.json'), JSON.stringify({ note: 'Known truncated dek/bluf backlog (2026-10-12). Rewrite, then remove the entry.', files: out.map((o) => o.file) }, null, 2) + '\n');
  }
  if (args.has('--json')) console.log(JSON.stringify({ ok: failing.length === 0, flagged: out, newSinceBaseline: fresh }, null, 2));
  else {
    for (const o of failing) console.log(`${o.file}\n  ${o.issues.join('\n  ')}`);
    console.log(`truncated dek/bluf: ${out.length} flagged, ${out.length - fresh.length} in known backlog, ${fresh.length} new.`);
  }
  process.exitCode = failing.length ? 1 : 0;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
