// PCD backup worker. One job: a real, restorable, off-machine weekly export of
// the activity-radar D1 into R2, verified by row count, with a proving-clock
// log and a Slack alert on any failure.
//
// This replaces the Cowork `pcd-backup` scheduled task, whose git-based push
// silently carried zero data — `backups/` is gitignored in this repo (see
// BACKUP.md), so `git add backups/` staged nothing every week while the task
// reported success. That lesson (committing multi-hundred-MB dumps breaks
// `git push`) is exactly why R2 replaces git here instead of repeating it.
//
// No fetch handler. Nothing in this Worker is reachable from a browser or any
// public route — the only entry point is the Cron Trigger.

export interface Env {
  // activity-radar, read-only usage: every query in this file is a SELECT.
  // There is no code path here that writes to D1.
  DB: D1Database;
  // R2 bucket `pcd-db-backups`. All writes (schema, per-table dumps,
  // manifest, backup-log) go here instead of git.
  BACKUPS: R2Bucket;
  // Secret. Incoming webhook URL for #pcd-agent-notications. Referenced by
  // name only; never logged, never returned, never hardcoded.
  SLACK_WEBHOOK_URL?: string;
}

const PAGE_SIZE = 1000;
const RETENTION_COUNT = 8;
// Bump this when the dump format changes, so an old manifest can be told apart
// from a new one during a future restore.
export const WORKER_VERSION = '2026-07-22.1';

export interface TableDump {
  table: string;
  dumped_rows: number;
  counted_rows: number;
  verified: boolean;
}

export interface Manifest {
  date: string;
  database: string;
  tables: TableDump[];
  total_rows: number;
  verified: boolean;
  worker_version: string;
  started_at: string;
  finished_at: string;
}

export interface BackupLogRow {
  date: string;
  tables: number;
  total_rows: number;
  verified: boolean;
  worker_version: string;
}

export interface RunResult {
  date: string;
  verified: boolean;
  manifest: Manifest;
  pruned: string[];
}

/** Table names come from this database's own sqlite_master, not user input —
 * still checked against a conservative identifier shape before being spliced
 * into SQL, since table names cannot be bound as query parameters. */
const SAFE_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

export async function listTables(db: D1Database): Promise<string[]> {
  const { results } = await db
    .prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`)
    .all<{ name: string }>();
  const names = results.map((r) => r.name);
  const unsafe = names.filter((n) => !SAFE_IDENTIFIER.test(n));
  if (unsafe.length > 0) {
    throw new Error(`[pcd-backup-worker] refusing unsafe table name(s): ${unsafe.join(', ')}`);
  }
  return names;
}

export async function dumpSchema(db: D1Database): Promise<string> {
  const { results } = await db
    .prepare(`SELECT sql FROM sqlite_master WHERE sql IS NOT NULL ORDER BY name`)
    .all<{ sql: string }>();
  return results.map((r) => `${r.sql};`).join('\n\n');
}

/** Pages by rowid ascending, 1000 rows/page, per the design spec. Returns both
 * the dumped rows and an independent COUNT(*) so the caller can verify them
 * against each other without re-reading what was just paginated. */
export async function dumpTable(
  db: D1Database,
  table: string,
): Promise<{ rows: Record<string, unknown>[]; countedRows: number }> {
  if (!SAFE_IDENTIFIER.test(table)) {
    throw new Error(`[pcd-backup-worker] refusing unsafe table name: ${table}`);
  }

  const rows: Record<string, unknown>[] = [];
  let lastRowId = -1;
  for (;;) {
    const { results } = await db
      .prepare(`SELECT rowid AS __rowid, * FROM "${table}" WHERE rowid > ? ORDER BY rowid LIMIT ?`)
      .bind(lastRowId, PAGE_SIZE)
      .all<Record<string, unknown>>();
    if (results.length === 0) break;
    for (const row of results) {
      const { __rowid, ...rest } = row;
      rows.push(rest);
      lastRowId = __rowid as number;
    }
    if (results.length < PAGE_SIZE) break;
  }

  const countRow = await db.prepare(`SELECT COUNT(*) AS c FROM "${table}"`).first<{ c: number }>();
  return { rows, countedRows: countRow?.c ?? 0 };
}

export async function sendSlackAlert(webhookUrl: string | undefined, text: string): Promise<void> {
  if (!webhookUrl) {
    // Fails loud in logs (no PII/secret here) rather than silently skipping —
    // an unconfigured webhook should not look identical to "nothing to report".
    console.error(JSON.stringify({ event: 'pcd_backup_alert_skipped', reason: 'SLACK_WEBHOOK_URL not set', text }));
    return;
  }
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      console.error(JSON.stringify({ event: 'pcd_backup_alert_failed', status: response.status }));
    }
  } catch (error) {
    console.error(JSON.stringify({ event: 'pcd_backup_alert_error', error: String(error) }));
  }
}

export async function updateBackupLog(bucket: R2Bucket, manifest: Manifest): Promise<BackupLogRow[]> {
  const key = 'backups/backup-log.json';
  const existing = await bucket.get(key);
  let log: BackupLogRow[] = [];
  if (existing) {
    try {
      const parsed = JSON.parse(await existing.text());
      if (Array.isArray(parsed)) log = parsed as BackupLogRow[];
    } catch {
      // A corrupt log should not block a real backup from completing; start
      // a fresh log rather than throwing away the dump we already wrote.
      console.error(JSON.stringify({ event: 'pcd_backup_log_corrupt', key }));
    }
  }
  log.push({
    date: manifest.date,
    tables: manifest.tables.length,
    total_rows: manifest.total_rows,
    verified: manifest.verified,
    worker_version: manifest.worker_version,
  });
  await bucket.put(key, JSON.stringify(log, null, 2));
  return log;
}

/** Keeps the newest RETENTION_COUNT dated backup prefixes, deletes the rest.
 * Sorted lexicographically, which is also chronological for YYYY-MM-DD keys.
 * The prefix just written by this run is always among the newest, so it is
 * never a deletion candidate. */
export async function pruneOldBackups(bucket: R2Bucket, keep = RETENTION_COUNT): Promise<string[]> {
  const listed = await bucket.list({ prefix: 'backups/', delimiter: '/' });
  const datePrefixes = (listed.delimitedPrefixes ?? [])
    .map((p) => p.replace(/^backups\//, '').replace(/\/$/, ''))
    .filter((p) => /^\d{4}-\d{2}-\d{2}$/.test(p))
    .sort()
    .reverse();

  const toDelete = datePrefixes.slice(keep);
  const deleted: string[] = [];
  for (const datePrefix of toDelete) {
    const objects = await bucket.list({ prefix: `backups/${datePrefix}/` });
    for (const obj of objects.objects) {
      await bucket.delete(obj.key);
    }
    deleted.push(datePrefix);
  }
  return deleted;
}

/** The whole job. Throws only on genuine infrastructure failure (missing
 * binding, D1/R2 error) so Cloudflare's own invocation tracking also catches
 * it. A data-integrity mismatch does NOT throw — it is a completed run that
 * detected and reported a real problem, per the design spec (step 4/6):
 * verified: false plus a Slack alert, not a crashed invocation. */
export async function runBackup(env: Env, now: () => Date = () => new Date()): Promise<RunResult> {
  if (!env.DB) throw new Error('[pcd-backup-worker] DB binding missing.');
  if (!env.BACKUPS) throw new Error('[pcd-backup-worker] BACKUPS binding missing.');

  const startedAt = now();
  const date = startedAt.toISOString().slice(0, 10);
  const prefix = `backups/${date}/`;

  const tables = await listTables(env.DB);
  const schemaSql = await dumpSchema(env.DB);
  await env.BACKUPS.put(`${prefix}schema.sql`, schemaSql);

  const tableDumps: TableDump[] = [];
  let totalRows = 0;
  let allVerified = true;

  for (const table of tables) {
    const { rows, countedRows } = await dumpTable(env.DB, table);
    await env.BACKUPS.put(`${prefix}${table}.json`, JSON.stringify(rows));
    const verified = rows.length === countedRows;
    if (!verified) allVerified = false;
    tableDumps.push({ table, dumped_rows: rows.length, counted_rows: countedRows, verified });
    totalRows += rows.length;
  }

  const finishedAt = now();
  const manifest: Manifest = {
    date,
    database: 'activity-radar',
    tables: tableDumps,
    total_rows: totalRows,
    verified: allVerified,
    worker_version: WORKER_VERSION,
    started_at: startedAt.toISOString(),
    finished_at: finishedAt.toISOString(),
  };
  await env.BACKUPS.put(`${prefix}manifest.json`, JSON.stringify(manifest, null, 2));
  await updateBackupLog(env.BACKUPS, manifest);

  if (!allVerified) {
    const failed = tableDumps
      .filter((t) => !t.verified)
      .map((t) => `${t.table} (dumped ${t.dumped_rows}, count ${t.counted_rows})`)
      .join(', ');
    await sendSlackAlert(env.SLACK_WEBHOOK_URL, `PCD backup FAILED verification for ${date}: ${failed}`);
    console.error(JSON.stringify({ event: 'pcd_backup_verify_failed', date, failed }));
  } else {
    console.log(JSON.stringify({ event: 'pcd_backup_ok', date, tables: tableDumps.length, total_rows: totalRows }));
  }

  const pruned = await pruneOldBackups(env.BACKUPS);
  if (pruned.length > 0) {
    console.log(JSON.stringify({ event: 'pcd_backup_pruned', dates: pruned }));
  }

  return { date, verified: allVerified, manifest, pruned };
}

export default {
  // Directly awaited (not ctx.waitUntil) so Cloudflare's own invocation
  // tracking reflects a genuine crash as a failed run, matching worker-cron's
  // convention: "the scheduled handler awaits this promise so Cloudflare
  // records the invocation as failed instead of silently green."
  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    try {
      await runBackup(env);
    } catch (error) {
      console.error(JSON.stringify({ event: 'pcd_backup_crashed', error: String(error) }));
      await sendSlackAlert(env.SLACK_WEBHOOK_URL, `PCD backup worker CRASHED: ${String(error)}`);
      throw error;
    }
  },
};
