#!/usr/bin/env node
/**
 * Audit every content file against the min/max string constraints declared in
 * src/content.config.ts.
 *
 * Why this exists: a single over-length frontmatter field hard-fails
 * `astro build` with InvalidContentEntryDataError and takes the whole site
 * build down. That has now happened twice from agent-written drafts (news
 * `summary` at 432/400 and articles `seoDescription` at over 180). The schema
 * catches it, but only at build time, which is the most expensive place to find
 * out.
 *
 * This runs in about a second and names every offender at once.
 *
 * Usage:
 *   node scripts/check-content-field-lengths.mjs           # report
 *   node scripts/check-content-field-lengths.mjs --check   # exit 1 on any violation
 *   node scripts/check-content-field-lengths.mjs --near 0.95  # also warn near the cap
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(ROOT, 'src/content.config.ts');
const CONTENT = join(ROOT, 'src/content');

const args = process.argv.slice(2);
const strict = args.includes('--check');
const nearIdx = args.indexOf('--near');
const nearRatio = nearIdx !== -1 ? Number(args[nearIdx + 1]) : 0.95;

/**
 * Parse the collection schemas out of content.config.ts.
 *
 * Deliberately a scoped regex scan rather than a TS parse: this is a guard
 * rail, not a compiler. If the config shape changes enough that this stops
 * finding constraints, it reports zero constraints, which is visible, rather
 * than silently passing everything.
 */
async function loadConstraints() {
  const src = await readFile(CONFIG, 'utf8');
  const collections = new Map();

  // Find each `const <name> = defineCollection({ ... })` block by brace balance.
  const declRe = /const\s+(\w+)\s*=\s*defineCollection\(/g;
  let m;
  while ((m = declRe.exec(src))) {
    const name = m[1];
    let i = declRe.lastIndex;
    let depth = 1;
    while (i < src.length && depth > 0) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')') depth--;
      i++;
    }
    const block = src.slice(declRe.lastIndex, i);

    // field: z.string()...max(N)  — capture optional .min(N) too.
    const fieldRe = /(\w+)\s*:\s*z\s*\.string\(\)((?:\s*\.\w+\([^)]*\))*)/g;
    const fields = [];
    let f;
    while ((f = fieldRe.exec(block))) {
      const chain = f[2];
      const max = /\.max\((\d+)/.exec(chain);
      const min = /\.min\((\d+)/.exec(chain);
      if (max || min) {
        fields.push({
          field: f[1],
          max: max ? Number(max[1]) : null,
          min: min ? Number(min[1]) : null,
          optional: /\.optional\(\)/.test(chain),
        });
      }
    }
    if (fields.length) collections.set(name, fields);
  }
  return collections;
}

/** Read the frontmatter block only. */
function frontmatter(raw) {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  return end === -1 ? null : raw.slice(4, end);
}

/**
 * Pull a top-level scalar field's value.
 *
 * Three shapes appear in this repo and all three have to be handled, because
 * getting this wrong produces confident false positives:
 *
 *   1. `field: "quoted on one line"`
 *   2. `field: >-` / `|` block scalar, content on indented lines below
 *   3. `field: starts here` and CONTINUES on indented lines with no marker
 *      (plain YAML multi-line flow scalar). This is the common one for `bluf`
 *      and it is the one an over-eager parser silently truncates.
 */
function fieldValue(fm, field) {
  const line = new RegExp(`^${field}:[ \\t]*(.*)$`, 'm').exec(fm);
  if (!line) return null;

  const after = fm.slice(line.index + line[0].length);
  const following = after.split('\n').slice(1);

  /** Gather indented continuation lines, stopping at the next top-level key. */
  const continuation = () => {
    const out = [];
    for (const l of following) {
      if (l.trim() === '') { out.push(''); continue; }
      if (/^[ \t]+\S/.test(l)) out.push(l.trim());
      else break;
    }
    return out;
  };

  let v = line[1].trim();

  // Shape 2: explicit block scalar.
  if (/^[|>][-+]?$/.test(v)) {
    return continuation().join(' ').replace(/\s+/g, ' ').trim();
  }

  // Shape 1: fully quoted on one line.
  if ((v.startsWith('"') && v.endsWith('"') && v.length > 1) ||
      (v.startsWith("'") && v.endsWith("'") && v.length > 1)) {
    return v.slice(1, -1);
  }

  // Shape 3: plain scalar that may continue on indented lines.
  const rest = continuation();
  if (rest.length) v = [v, ...rest].join(' ').replace(/\s+/g, ' ').trim();

  // A multi-line quoted scalar closes on the last continuation line.
  if (v.length > 1 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    v = v.slice(1, -1);
  }
  return v;
}

const constraints = await loadConstraints();
if (constraints.size === 0) {
  console.error('No string constraints parsed from content.config.ts. The config shape may have changed.');
  process.exit(1);
}

let dirs;
try {
  dirs = (await readdir(CONTENT, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
} catch {
  console.error(`Cannot read ${CONTENT}`);
  process.exit(1);
}

const violations = [];
const near = [];
let scanned = 0;

for (const dir of dirs) {
  const fields = constraints.get(dir);
  if (!fields) continue;

  let files;
  try { files = (await readdir(join(CONTENT, dir))).filter((f) => f.endsWith('.md') || f.endsWith('.mdx')); }
  catch { continue; }

  for (const file of files) {
    const raw = await readFile(join(CONTENT, dir, file), 'utf8');
    const fm = frontmatter(raw);
    if (!fm) continue;
    scanned++;

    for (const { field, max, min } of fields) {
      const value = fieldValue(fm, field);
      if (value === null) continue;
      const n = value.length;
      if (max !== null && n > max) {
        violations.push({ dir, file, field, n, limit: max, kind: 'over' });
      } else if (min !== null && n < min) {
        violations.push({ dir, file, field, n, limit: min, kind: 'under' });
      } else if (max !== null && n >= Math.floor(max * nearRatio)) {
        near.push({ dir, file, field, n, limit: max });
      }
    }
  }
}

console.log(`Scanned ${scanned} entries across ${constraints.size} schema-constrained collections.\n`);

if (violations.length) {
  console.log(`BUILD-BREAKING (${violations.length}):`);
  for (const v of violations) {
    const rel = v.kind === 'over' ? `${v.n} > max ${v.limit}` : `${v.n} < min ${v.limit}`;
    console.log(`  ${v.dir}/${v.file}\n      ${v.field}: ${rel}`);
  }
  console.log('');
} else {
  console.log('BUILD-BREAKING: none\n');
}

if (near.length) {
  console.log(`Within ${Math.round(nearRatio * 100)}% of the cap (${near.length}) — one edit from breaking the build:`);
  for (const v of near) console.log(`  ${String(v.n).padStart(4)}/${v.limit}  ${v.dir}/${v.file}  (${v.field})`);
  console.log('');
}

if (strict && violations.length) process.exit(1);
process.exit(0);
