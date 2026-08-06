// Shared helper: spins up a throwaway in-process SQLite database (Node's
// built-in node:sqlite, no extra dependency) and applies the activity-radar
// schema against it — organizations/programs/org_tech_* plus the domain
// skip list and link_health tables that live in the same physical
// "activity-radar" D1 in production (see worker-link-checker/wrangler.toml
// and migrations/0017_domain_skip_list.sql, both of which target the same
// database_id as wrangler.production.jsonc's DB binding) — wrapped in a
// D1Database-shaped interface (.prepare().bind().first()/.all()/.run()).
//
// This repo's existing disposable-ops-db.ts helper does the same job for
// migrations-pcd-ops via Miniflare's D1 emulation; that path depends on
// `undici` being resolvable inside `miniflare`, which is not reliably true
// in every sandboxed install of this repo's node_modules (it fails with
// "Cannot find module 'undici'" independent of anything in this change).
// SQLite itself is the same engine either way (D1 is SQLite), so a thin
// node:sqlite wrapper gives intel store/fetcher/pipeline tests the same
// "run real SQL against a real schema" guarantee without that dependency
// risk. Uses a standalone copy of disposable-ops-db.ts's quote-aware
// statement splitter (./sql-split.ts) so trigger bodies and comments are
// handled identically without importing miniflare transitively.

import { readFile, readdir } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';
import type { D1Database } from '@cloudflare/workers-types';
import { splitSqlStatements } from './sql-split';

interface RunResult {
  meta: { changes: number; last_row_id: number | bigint };
}

function wrapAsD1(sqlite: DatabaseSync): D1Database {
  return {
    prepare(sql: string) {
      let boundParams: unknown[] = [];
      const wrapper = {
        bind(...params: unknown[]) {
          boundParams = params;
          return wrapper;
        },
        async first<T>(): Promise<T | null> {
          const stmt = sqlite.prepare(sql);
          const row = stmt.get(...(boundParams as never[]));
          return (row ?? null) as T | null;
        },
        async all<T>(): Promise<{ results: T[] }> {
          const stmt = sqlite.prepare(sql);
          const rows = stmt.all(...(boundParams as never[]));
          return { results: rows as T[] };
        },
        async run(): Promise<RunResult> {
          const stmt = sqlite.prepare(sql);
          const info = stmt.run(...(boundParams as never[]));
          return { meta: { changes: Number(info.changes), last_row_id: info.lastInsertRowid } };
        },
      };
      return wrapper;
    },
    async batch(statements: Array<{ run: () => Promise<unknown> }>) {
      return Promise.all(statements.map((statement) => statement.run()));
    },
  } as unknown as D1Database;
}

async function applyMigrationFile(sqlite: DatabaseSync, fileUrl: URL): Promise<void> {
  const sql = await readFile(fileUrl, 'utf8');
  for (const statement of splitSqlStatements(sql)) {
    sqlite.exec(statement);
  }
}

export async function createDisposableIntelDatabase(): Promise<{ sqlite: DatabaseSync; db: D1Database }> {
  const sqlite = new DatabaseSync(':memory:');

  const activityRadarDir = new URL('../../migrations-activity-radar/', import.meta.url);
  const activityRadarMigrations = (await readdir(activityRadarDir)).filter((name) => name.endsWith('.sql')).sort();
  for (const migration of activityRadarMigrations) {
    await applyMigrationFile(sqlite, new URL(migration, activityRadarDir));
  }

  await applyMigrationFile(sqlite, new URL('../../migrations/0017_domain_skip_list.sql', import.meta.url));
  await applyMigrationFile(sqlite, new URL('../../worker-link-checker/schema.sql', import.meta.url));

  return { sqlite, db: wrapAsD1(sqlite) };
}

let counter = 0;
export function nextId(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}
