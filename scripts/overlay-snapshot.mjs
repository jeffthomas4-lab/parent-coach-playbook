#!/usr/bin/env node
/**
 * Inline editor: overlay snapshot and reconciliation report.
 *
 * Two jobs, both read-only against production:
 *
 *   1. SNAPSHOT. Dump every stored overlay value to a dated JSON file under
 *      backups/overlay/. This is rollback level 2 (level 1 is per-region revert
 *      from the receipt log, level 3 is CONTENT_OVERLAY_ENABLED=false).
 *
 *   2. DRIFT. Report how many regions currently differ from their in-repo
 *      fallback and how long they have. Overlay values silently diverging from
 *      git is the main long-term risk of this design, so it gets a number
 *      somebody looks at rather than a hope.
 *
 * Usage:
 *   node scripts/overlay-snapshot.mjs [--env production|staging] [--drift-only]
 *
 * Requires wrangler auth. Read-only: never writes to KV, never deploys.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const KEY_PREFIX = 'pcd:overlay:v1:';

const args = process.argv.slice(2);
const envName = args.includes('--env') ? args[args.indexOf('--env') + 1] : 'production';
const driftOnly = args.includes('--drift-only');

const CONFIG = envName === 'production' ? 'wrangler.production.jsonc' : 'wrangler.jsonc';

function readJsonc(relPath) {
  const raw = readFileSync(resolve(ROOT, relPath), 'utf8');
  return JSON.parse(raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1'));
}

function namespaceId() {
  const cfg = readJsonc(CONFIG);
  const ns = (cfg.kv_namespaces ?? []).find((n) => n.binding === 'CONTENT_OVERLAY');
  if (!ns?.id) {
    console.error(`No CONTENT_OVERLAY binding in ${CONFIG}.`);
    process.exit(1);
  }
  return ns.id;
}

function wrangler(...cliArgs) {
  return execFileSync('npx', ['wrangler', ...cliArgs], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
}

/** Every stored region key, straight from KV. */
function listKeys(nsId) {
  const raw = wrangler('kv', 'key', 'list', '--namespace-id', nsId);
  return JSON.parse(raw)
    .map((k) => k.name)
    .filter((name) => name.startsWith(KEY_PREFIX) && !name.endsWith('__version'));
}

function getValue(nsId, name) {
  try {
    return JSON.parse(wrangler('kv', 'key', 'get', name, '--namespace-id', nsId));
  } catch {
    return null;
  }
}

/**
 * Pull the in-repo fallback for each key by scanning source for the matching
 * <Editable key="..." fallback="..."> call. Deliberately a plain regex rather
 * than a parse: if the shape of the call changes, this reports "unknown" rather
 * than silently claiming no drift.
 */
function repoFallbacks() {
  const out = new Map();
  let files;
  try {
    files = execFileSync('git', ['ls-files', 'src/pages', 'src/components', 'src/layouts'], {
      cwd: ROOT, encoding: 'utf8',
    }).split('\n').filter((f) => f.endsWith('.astro'));
  } catch {
    return out;
  }
  const re = /key=["']([^"']+)["'][\s\S]{0,200}?fallback=["']([^"']*)["']/g;
  for (const file of files) {
    let src;
    try { src = readFileSync(resolve(ROOT, file), 'utf8'); } catch { continue; }
    for (const m of src.matchAll(re)) out.set(m[1], m[2]);
  }
  return out;
}

const nsId = namespaceId();
const keys = listKeys(nsId);
const fallbacks = repoFallbacks();

const entries = {};
const drift = [];
const now = Date.now();

for (const kvName of keys) {
  const regionKey = kvName.slice(KEY_PREFIX.length);
  const entry = getValue(nsId, kvName);
  if (!entry) continue;
  entries[regionKey] = entry;

  const fallback = fallbacks.get(regionKey);
  if (fallback === undefined) {
    drift.push({ regionKey, state: 'unknown-fallback', ageDays: null });
  } else if (fallback !== entry.value) {
    const ageDays = entry.updatedAt
      ? Math.round((now - Date.parse(entry.updatedAt)) / 86400000)
      : null;
    drift.push({ regionKey, state: 'differs', ageDays, updatedAt: entry.updatedAt });
  }
}

const stamp = new Date().toISOString().slice(0, 10);

if (!driftOnly) {
  const dir = resolve(ROOT, 'backups/overlay');
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, `overlay-${envName}-${stamp}.json`);
  writeFileSync(file, JSON.stringify({
    environment: envName,
    takenAt: new Date().toISOString(),
    namespaceId: nsId,
    regionCount: Object.keys(entries).length,
    entries,
  }, null, 2));
  console.log(`Snapshot: ${Object.keys(entries).length} regions -> ${file}`);
}

console.log(`\nDrift from repo fallbacks: ${drift.length} of ${keys.length} stored regions`);
for (const d of drift) {
  const age = d.ageDays === null ? '' : ` (${d.ageDays}d)`;
  console.log(`  ${d.state.padEnd(18)} ${d.regionKey}${age}`);
}
if (drift.length === 0) console.log('  none');

// Drift is a signal, not a failure. Exit 0 so this can run unattended.
process.exit(0);
