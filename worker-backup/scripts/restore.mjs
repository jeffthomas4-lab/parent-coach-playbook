#!/usr/bin/env node
// Restores one dated backups/<date>/ export written by ../src/index.ts (the
// pcd-backup-worker Cron Trigger) from R2 into a target D1 database.
//
// This is a rare, manual, high-blast-radius DR action -- a local Node CLI
// Jeff runs by hand, not a scheduled job. It is never wired to any cron,
// Worker route, or CI step.
//
// R2 reads go through the `wrangler` CLI (already authenticated on this
// machine for every other D1/R2 operation in this repo -- see BACKUP.md).
// D1 writes go through Cloudflare's D1 HTTP API directly
// (POST .../d1/database/:id/query with {sql, params}) because that is the
// only interface that supports genuine bound parameters -- `wrangler d1
// execute` only accepts literal SQL text, which is not an acceptable way to
// replay untrusted row data. Never build an INSERT by concatenating row
// values into SQL text.
//
// Requires (real remote target only -- never for --dry-run against a target
// that resolves to production, see checkProductionGuard):
//   CLOUDFLARE_API_TOKEN    a token scoped to D1 Edit, set in the shell
//                           environment. Never place it in source, a config
//                           file, or a command-line argument.
//   CLOUDFLARE_ACCOUNT_ID   the Cloudflare account id.
//
// The production guard is the core safety control: --target resolving to the
// live `activity-radar` database (by name or database_id) is refused unless
// BOTH --overwrite-production and the exact --confirm-token are supplied, and
// even that override is disabled outright whenever --dry-run is set. See
// checkProductionGuard.

import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

export const PROD_DB_NAME = 'activity-radar';
export const PROD_DB_ID = '8cc3694a-26f8-4a56-b131-d5d3a68c49ef';
// Must be typed out deliberately on the command line -- this is the "typed
// confirmation token" the design spec requires, not a flag that can be set
// once and forgotten.
export const PRODUCTION_OVERRIDE_TOKEN = 'RESTORE ACTIVITY-RADAR PRODUCTION';

const D1_API_BASE = 'https://api.cloudflare.com/client/v4';
const BATCH_SIZE = 200;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class RestoreRefusedError extends Error {}

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

export function parseCli(argv) {
  const options = {
    sourceBucket: 'pcd-db-backups',
    dryRun: false,
    force: false,
    overwriteProduction: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--date') options.date = argv[++i];
    else if (arg === '--source-bucket') options.sourceBucket = argv[++i];
    else if (arg === '--target') options.target = argv[++i];
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--overwrite-production') options.overwriteProduction = true;
    else if (arg === '--confirm-token') options.confirmToken = argv[++i];
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }
  if (!options.help && !options.target) {
    throw new Error('--target <d1-name-or-id> is required');
  }
  return options;
}

export function printHelp() {
  console.log(
    `usage: node scripts/restore.mjs --target <d1-name-or-id> [--date YYYY-MM-DD] [--source-bucket pcd-db-backups] [--dry-run] [--force] [--overwrite-production --confirm-token "${PRODUCTION_OVERRIDE_TOKEN}"]\n\n` +
      'Restores one dated backups/<date>/ export from R2 into --target. Defaults to the latest date recorded\n' +
      'in backups/backup-log.json. Refuses to touch a manifest with verified !== true unless --force is passed.\n\n' +
      'Refuses --target activity-radar (by name or database_id) unless BOTH --overwrite-production and the exact\n' +
      `--confirm-token "${PRODUCTION_OVERRIDE_TOKEN}" are supplied. --dry-run disables that override entirely --\n` +
      'a dry run can never reach production no matter what else is passed.\n\n' +
      'Requires CLOUDFLARE_API_TOKEN (D1 Edit scope) and CLOUDFLARE_ACCOUNT_ID in the environment. wrangler must\n' +
      'already be authenticated on this machine (used for R2 reads only).',
  );
}

// ---------------------------------------------------------------------------
// Production guard
// ---------------------------------------------------------------------------

export function isProductionTarget({ targetName, targetId }) {
  const nameMatches = typeof targetName === 'string' && targetName.trim().toLowerCase() === PROD_DB_NAME;
  const idMatches = typeof targetId === 'string' && targetId.trim().toLowerCase() === PROD_DB_ID.toLowerCase();
  return nameMatches || idMatches;
}

/**
 * The core safety control. Called before any R2 read, any D1 write, or any
 * D1 database_id resolution against the target -- so a blocked call never
 * makes a single network request. See restore.test.mjs for the assertion
 * that a blocked call touches neither the injected fetchObject nor d1Client.
 */
export function checkProductionGuard({ targetName, targetId, overwriteProduction, confirmToken, dryRun }) {
  if (!isProductionTarget({ targetName, targetId })) return { blocked: false };
  if (dryRun) {
    return {
      blocked: true,
      reason: 'refusing: --dry-run can never target production (activity-radar), regardless of any override flag',
    };
  }
  if (!overwriteProduction || confirmToken !== PRODUCTION_OVERRIDE_TOKEN) {
    return {
      blocked: true,
      reason:
        `refusing: --target resolves to production (activity-radar). Pass --overwrite-production and ` +
        `--confirm-token "${PRODUCTION_OVERRIDE_TOKEN}" to override.`,
    };
  }
  return { blocked: false, productionOverride: true };
}

// ---------------------------------------------------------------------------
// Schema parsing: column order + FK references, so rows load in an order
// that respects foreign keys without depending on PRAGMA state persisting
// across separate D1 HTTP API calls (it does not -- each call is stateless).
// This is a small regex-based parser scoped to the CREATE TABLE shape this
// repo's own D1 schema actually produces (see worker-backup/src/index.ts
// dumpSchema), not a general SQL parser.
// ---------------------------------------------------------------------------

export function splitSchemaStatements(schemaSql) {
  return schemaSql
    .split(/;\s*\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith(';') ? s : `${s};`));
}

function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of body) {
    if (ch === '(') depth += 1;
    if (ch === ')') depth -= 1;
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current);
  return parts;
}

export function parseCreateTable(stmt) {
  const m = stmt.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?"?([A-Za-z_][A-Za-z0-9_]*)"?\s*\(([\s\S]*)\)\s*;?\s*$/i);
  if (!m) return null;
  const table = m[1];
  const parts = splitTopLevel(m[2]);
  const columns = [];
  const references = new Set();
  for (const rawPart of parts) {
    const part = rawPart.trim();
    const upper = part.toUpperCase();
    const refMatch = part.match(/REFERENCES\s+"?([A-Za-z_][A-Za-z0-9_]*)"?/i);
    if (/^(PRIMARY KEY|UNIQUE|CHECK|CONSTRAINT|FOREIGN KEY)\b/.test(upper)) {
      if (refMatch) references.add(refMatch[1]);
      continue;
    }
    const colMatch = part.match(/^"?([A-Za-z_][A-Za-z0-9_]*)"?\s/);
    if (colMatch) {
      columns.push(colMatch[1]);
      if (refMatch) references.add(refMatch[1]);
    }
  }
  return { table, columns, references: [...references] };
}

/** Parents before children. Self-references and cycles are broken (visited
 * once, never re-entered) rather than thrown on -- a real DR tool should
 * degrade to "some order" instead of refusing to restore anything. */
export function topoSortTables(tableDefs) {
  const order = [];
  const done = new Set();
  const visiting = new Set();
  function visit(name) {
    if (done.has(name) || visiting.has(name)) return;
    visiting.add(name);
    const def = tableDefs.get(name);
    if (def) {
      for (const ref of def.references) {
        if (ref !== name && tableDefs.has(ref)) visit(ref);
      }
    }
    visiting.delete(name);
    done.add(name);
    order.push(name);
  }
  for (const name of tableDefs.keys()) visit(name);
  return order;
}

// ---------------------------------------------------------------------------
// Parameterized INSERT batching
// ---------------------------------------------------------------------------

export function normalizeParamValue(value) {
  if (value === undefined) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value;
}

/** Builds one multi-row INSERT with `?` placeholders and a flat params array
 * -- values never touch the SQL string. Column list comes from the schema,
 * not from each row's own keys, so a sparse/missing key becomes a bound
 * NULL instead of shifting columns. */
export function buildInsertBatch(table, columns, rows) {
  if (columns.length === 0) throw new Error(`no columns known for table "${table}"`);
  const colList = columns.map((c) => `"${c}"`).join(', ');
  const placeholderRow = `(${columns.map(() => '?').join(', ')})`;
  const valuesSql = rows.map(() => placeholderRow).join(', ');
  const sql = `INSERT INTO "${table}" (${colList}) VALUES ${valuesSql}`;
  const params = [];
  for (const row of rows) {
    for (const col of columns) params.push(normalizeParamValue(row[col] ?? null));
  }
  return { sql, params };
}

// ---------------------------------------------------------------------------
// D1 HTTP API client (real remote target)
// ---------------------------------------------------------------------------

export function createD1ApiClient({ accountId, apiToken, databaseId, fetchFn = fetch }) {
  async function query(sql, params) {
    const res = await fetchFn(`${D1_API_BASE}/accounts/${accountId}/d1/database/${databaseId}/query`, {
      method: 'POST',
      headers: { authorization: `Bearer ${apiToken}`, 'content-type': 'application/json' },
      body: JSON.stringify(params === undefined ? { sql } : { sql, params }),
    });
    const body = await res.json();
    if (!res.ok || body.success === false) {
      throw new Error(`D1 API error: ${JSON.stringify(body.errors ?? body)}`);
    }
    return body;
  }
  return {
    async exec(sql) {
      await query(sql);
    },
    async run(sql, params) {
      await query(sql, params);
    },
    async count(table) {
      const body = await query(`SELECT COUNT(*) AS c FROM "${table}"`, []);
      const row = body.result?.[0]?.results?.[0];
      return row ? Number(row.c) : 0;
    },
  };
}

// ---------------------------------------------------------------------------
// R2 reads via wrangler (already authenticated on this machine)
// ---------------------------------------------------------------------------

export function runWrangler(args, { cwd, spawnFn = spawnSync } = {}) {
  const result = spawnFn('npx', ['wrangler', ...args], {
    cwd,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`wrangler ${args.join(' ')} failed (exit ${result.status}): ${(result.stderr || result.stdout || '').slice(0, 2000)}`);
  }
  return result.stdout ?? '';
}

export function resolveDatabaseId(target, { cwd, spawnFn } = {}) {
  if (UUID_RE.test(target)) return { name: null, id: target };
  const out = runWrangler(['d1', 'info', target, '--json'], { cwd, spawnFn });
  let info;
  try {
    info = JSON.parse(out);
  } catch (error) {
    throw new Error(`could not parse "wrangler d1 info ${target} --json" output: ${error.message}`);
  }
  const id = info.uuid || info.database_id || info.id;
  if (!id) throw new Error(`"wrangler d1 info ${target} --json" did not return a database id`);
  return { name: target, id };
}

export async function fetchObjectViaWrangler({ bucket, key, workDir, cwd, spawnFn }) {
  const destPath = join(workDir, key.replace(/[\\/]/g, '__'));
  runWrangler(['r2', 'object', 'get', `${bucket}/${key}`, `--file=${destPath}`, '--remote'], { cwd, spawnFn });
  return readFile(destPath, 'utf8');
}

export function latestDateFromLog(log) {
  if (!Array.isArray(log) || log.length === 0) throw new Error('backup-log.json is empty or not an array');
  const dates = log.map((row) => row.date).filter((d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d));
  if (dates.length === 0) throw new Error('backup-log.json has no valid date entries');
  return dates.sort().at(-1);
}

// ---------------------------------------------------------------------------
// Orchestration -- pure-ish, everything network/D1-facing is injected so
// this is fully testable against fakes (see restore.test.mjs).
// ---------------------------------------------------------------------------

export async function restore({
  date,
  sourceBucket,
  target,
  dryRun = false,
  force = false,
  overwriteProduction = false,
  confirmToken,
  resolveTarget,
  fetchObject,
  fetchLog,
  d1Client,
}) {
  if (!target) throw new Error('target is required');
  if (!resolveTarget) throw new Error('resolveTarget is required');
  if (!fetchObject) throw new Error('fetchObject is required');
  if (!d1Client) throw new Error('d1Client is required');

  // Guard first, before resolving the target id or touching R2/D1 at all --
  // a name match short-circuits without even needing resolution.
  if (isProductionTarget({ targetName: target })) {
    const guard = checkProductionGuard({ targetName: target, overwriteProduction, confirmToken, dryRun });
    if (guard.blocked) throw new RestoreRefusedError(guard.reason);
  }

  const resolvedTarget = await resolveTarget(target);
  const guard = checkProductionGuard({
    targetName: resolvedTarget.name ?? target,
    targetId: resolvedTarget.id,
    overwriteProduction,
    confirmToken,
    dryRun,
  });
  if (guard.blocked) throw new RestoreRefusedError(guard.reason);

  const startedAt = Date.now();
  const resolvedDate = date ?? latestDateFromLog(await fetchLog());
  const prefix = `backups/${resolvedDate}/`;

  const manifest = JSON.parse(await fetchObject(`${prefix}manifest.json`));
  if (manifest.verified !== true) {
    if (!force) {
      throw new RestoreRefusedError(
        `refusing: backup ${resolvedDate} has manifest.verified=${manifest.verified}. Pass --force to restore an unverified backup.`,
      );
    }
    console.warn(`WARNING: restoring un-verified backup ${resolvedDate} because --force was passed.`);
  }

  const schemaSql = await fetchObject(`${prefix}schema.sql`);
  const statements = splitSchemaStatements(schemaSql);
  const tableDefs = new Map();
  for (const stmt of statements) {
    const parsed = parseCreateTable(stmt);
    if (parsed) tableDefs.set(parsed.table, parsed);
  }
  for (const stmt of statements) {
    await d1Client.exec(stmt);
  }

  const manifestTableNames = manifest.tables.map((t) => t.table);
  const loadOrder = topoSortTables(tableDefs).filter((t) => manifestTableNames.includes(t));
  for (const t of manifestTableNames) if (!loadOrder.includes(t)) loadOrder.push(t);

  const tableReports = [];
  for (const table of loadOrder) {
    const manifestEntry = manifest.tables.find((t) => t.table === table);
    const rows = JSON.parse(await fetchObject(`${prefix}${table}.json`));
    const columns = tableDefs.get(table)?.columns ?? (rows[0] ? Object.keys(rows[0]) : []);

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      if (batch.length === 0) continue;
      const { sql, params } = buildInsertBatch(table, columns, batch);
      await d1Client.run(sql, params);
    }

    const targetCount = await d1Client.count(table);
    const expected = manifestEntry?.dumped_rows ?? rows.length;
    tableReports.push({
      table,
      rows_restored: rows.length,
      expected_rows: expected,
      target_count: targetCount,
      verified: targetCount === expected,
    });
  }

  const finishedAt = Date.now();
  return {
    date: resolvedDate,
    target: { name: resolvedTarget.name ?? target, id: resolvedTarget.id },
    dry_run: Boolean(dryRun),
    manifest_verified: manifest.verified,
    forced_unverified_backup: manifest.verified !== true && Boolean(force),
    tables: tableReports,
    all_verified: tableReports.every((t) => t.verified),
    total_rows_restored: tableReports.reduce((sum, t) => sum + t.rows_restored, 0),
    duration_ms: finishedAt - startedAt,
  };
}

function printReport(report) {
  console.log(JSON.stringify(report, null, 2));
  console.log('');
  console.log(`Restore ${report.dry_run ? '(dry-run) ' : ''}for ${report.date} -> ${report.target.name ?? report.target.id}`);
  console.log(`  manifest verified: ${report.manifest_verified}${report.forced_unverified_backup ? ' (forced)' : ''}`);
  for (const t of report.tables) {
    const mark = t.verified ? 'OK' : 'MISMATCH';
    console.log(`  [${mark}] ${t.table}: restored ${t.rows_restored}, target count ${t.target_count}, expected ${t.expected_rows}`);
  }
  console.log(`  total rows restored: ${report.total_rows_restored}`);
  console.log(`  duration: ${report.duration_ms}ms`);
  console.log(`  ALL VERIFIED: ${report.all_verified}`);
}

async function main() {
  const options = parseCli(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const cwd = process.cwd();
  const workDir = await mkdtemp(join(tmpdir(), 'pcd-restore-'));

  try {
    // --target could be a name or a raw database_id -- isProductionTarget checks
    // both fields independently, so passing the same raw string as both is safe
    // and catches either form before any credential is required.
    const preGuard = checkProductionGuard({
      targetName: options.target,
      targetId: options.target,
      overwriteProduction: options.overwriteProduction,
      confirmToken: options.confirmToken,
      dryRun: options.dryRun,
    });
    if (preGuard.blocked) {
      throw new RestoreRefusedError(preGuard.reason);
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!accountId || !apiToken) {
      throw new Error('CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set in the environment to write to D1.');
    }

    const resolveTarget = (target) => resolveDatabaseId(target, { cwd });
    const fetchObject = (key) => fetchObjectViaWrangler({ bucket: options.sourceBucket, key, workDir, cwd });
    const fetchLog = () => fetchObject('backups/backup-log.json').then((raw) => JSON.parse(raw));

    const resolved = await resolveTarget(options.target);
    const d1Client = createD1ApiClient({ accountId, apiToken, databaseId: resolved.id });
    const report = await restore({ ...options, resolveTarget: async () => resolved, fetchObject, fetchLog, d1Client });
    printReport(report);
    process.exitCode = report.all_verified ? 0 : 1;
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    if (error instanceof RestoreRefusedError) {
      console.error(`restore.mjs: ${error.message}`);
    } else {
      console.error(`restore.mjs: ${error.stack || error.message}`);
    }
    process.exitCode = 1;
  });
}
