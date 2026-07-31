// Shared helper: spins up a throwaway Miniflare D1 database and applies every
// migration in migrations-pcd-ops/ against it, so integration tests can run
// real store functions against a real (if disposable) SQLite schema instead
// of a hand-rolled fake.
//
// D1's HTTP-shaped API takes one statement at a time, so the migration file's
// SQL text has to be split into individual statements before each is run.
// A naive `sql.split(';')` shreds any CREATE TRIGGER ... BEGIN ... END block,
// because the trigger body holds its own statement-terminating semicolons
// (see migrations-pcd-ops/0029_admin_action_receipts.sql's two triggers).
// splitSqlStatements() below only treats a semicolon as a terminator at
// BEGIN/END depth zero, and ignores semicolons and BEGIN/END keywords that
// appear inside a quoted string or identifier.
//
// Comment stripping also has to handle indented comment lines. 0029's column
// comments (e.g. "  -- 'staging' | 'production' | 'local' -- whichever...")
// are indented two spaces before the leading `--`, so an anchored `^--` regex
// leaves them in place; those lines carry apostrophes that a quote-aware
// splitter would otherwise mistake for the start of a string literal. The
// regex below allows leading whitespace before the comment marker.

import { readFile, readdir } from 'node:fs/promises';
import { Miniflare } from 'miniflare';
import type { D1Database } from '@cloudflare/workers-types';

const WORD_CHAR = /[A-Za-z0-9_]/;

/**
 * Splits a block of SQL into individual statements, respecting
 * CREATE TRIGGER ... BEGIN ... END blocks (whose internal semicolons must
 * not split the statement) and quoted strings/identifiers (whose semicolons
 * and BEGIN/END-shaped text must never be treated as SQL syntax).
 */
export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let depth = 0;
  let quote: '\'' | '"' | null = null;
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];

    if (quote) {
      current += ch;
      if (ch === quote) {
        if (sql[i + 1] === quote) {
          // Doubled quote is an escaped quote inside the literal/identifier,
          // not the end of it (e.g. 'it''s' or "weird""name").
          current += sql[i + 1];
          i += 2;
          continue;
        }
        quote = null;
      }
      i += 1;
      continue;
    }

    if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
      i += 1;
      continue;
    }

    const precededByWordChar = i > 0 && WORD_CHAR.test(sql[i - 1]);
    if (!precededByWordChar && /[A-Za-z]/.test(ch)) {
      const rest = sql.slice(i, i + 6);
      const beginMatch = /^BEGIN\b/i.exec(rest);
      const endMatch = /^END\b/i.exec(rest);
      if (beginMatch) {
        depth += 1;
        current += beginMatch[0];
        i += beginMatch[0].length;
        continue;
      }
      if (endMatch) {
        depth = Math.max(0, depth - 1);
        current += endMatch[0];
        i += endMatch[0].length;
        continue;
      }
    }

    if (ch === ';' && depth === 0) {
      const trimmed = current.trim();
      if (trimmed) statements.push(trimmed);
      current = '';
      i += 1;
      continue;
    }

    current += ch;
    i += 1;
  }

  const trailing = current.trim();
  if (trailing) statements.push(trailing);
  return statements;
}

export async function createDisposableOpsDatabase(dbId: string): Promise<{ mf: Miniflare; db: D1Database }> {
  const isolated = new Miniflare({
    modules: true,
    script: 'export default { fetch() { return new Response("test only"); } }',
    compatibilityDate: '2026-07-15',
    d1Databases: { DB: dbId },
  });
  const isolatedDb = (await isolated.getD1Database('DB')) as unknown as D1Database;
  const directory = new URL('../../migrations-pcd-ops/', import.meta.url);
  const migrations = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
  for (const migration of migrations) {
    const sql = (await readFile(new URL(migration, directory), 'utf8')).replace(/^\s*--.*$/gm, '');
    for (const statement of splitSqlStatements(sql)) {
      await isolatedDb.prepare(statement).run();
    }
  }
  return { mf: isolated, db: isolatedDb };
}
