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
// Comment handling belongs to the splitter, not to a pre-pass regex. The old
// `^\s*--.*$` pre-strip only removed comments that OWN a line; a comment
// trailing real SQL on the same line survived it. That is a live foot-gun,
// because a trailing comment can carry either of the two characters the
// splitter treats as syntax:
//
//   crm_external_id TEXT,   -- the CRM's own id for this contact
//     ^ 0028_org_contacts.sql:123. The apostrophe in "CRM's" opened a string
//       literal that never closed, so every subsequent `;` was swallowed and
//       the rest of the file arrived at D1 as one unterminated statement:
//       "D1_ERROR: incomplete input: SQLITE_ERROR".
//
//   old_value TEXT,         -- value before the write; the rollback value
//     ^ a semicolon in a trailing comment would split a CREATE TABLE in half.
//
// The splitter below consumes `--` line comments and block comments as part
// of the scan, at the one place that already knows whether it is inside a
// quoted string. Nothing upstream needs to sanitize the SQL first.
//
// stripSqlComments() exports that same quote-aware pass on its own, because
// the migration-content tests (commerce-migration, customer-challenges-
// migration) assert that forbidden words like `password`, `cvv` and
// `card_number` never appear in EXECUTABLE sql. Those tests each rolled their
// own `^--.*$` regex, which is weaker still than the one this file used to
// carry: without `\s*` it leaves every INDENTED comment in place, so a comment
// that merely mentions a forbidden word fails the test on prose rather than on
// schema. One shared implementation, used everywhere migration SQL is read.

import { readFile, readdir } from 'node:fs/promises';
import { Miniflare } from 'miniflare';
import type { D1Database } from '@cloudflare/workers-types';

const WORD_CHAR = /[A-Za-z0-9_]/;

/**
 * Removes `--` line comments and block comments from SQL, leaving anything
 * that merely LOOKS like a comment inside a quoted string or identifier
 * untouched. Whitespace is preserved in place of each comment so neighbouring
 * tokens cannot fuse.
 */
export function stripSqlComments(sql: string): string {
  let out = '';
  let quote: '\'' | '"' | null = null;
  let i = 0;

  while (i < sql.length) {
    const ch = sql[i];

    if (quote) {
      out += ch;
      if (ch === quote) {
        if (sql[i + 1] === quote) {
          out += sql[i + 1];
          i += 2;
          continue;
        }
        quote = null;
      }
      i += 1;
      continue;
    }

    if (ch === '-' && sql[i + 1] === '-') {
      const newline = sql.indexOf('\n', i);
      if (newline === -1) break;
      out += '\n';
      i = newline + 1;
      continue;
    }

    if (ch === '/' && sql[i + 1] === '*') {
      const close = sql.indexOf('*/', i + 2);
      if (close === -1) break;
      out += ' ';
      i = close + 2;
      continue;
    }

    if (ch === "'" || ch === '"') quote = ch;
    out += ch;
    i += 1;
  }

  return out;
}

/**
 * Splits a block of SQL into individual statements, respecting
 * CREATE TRIGGER ... BEGIN ... END blocks (whose internal semicolons must
 * not split the statement) and quoted strings/identifiers (whose semicolons
 * and BEGIN/END-shaped text must never be treated as SQL syntax).
 */
export function splitSqlStatements(rawSql: string): string[] {
  // Comments come out first, quote-aware, so nothing inside one can be
  // mistaken for a `;` terminator or the start of a string literal.
  const sql = stripSqlComments(rawSql);
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
    // No pre-strip: splitSqlStatements() removes comments itself, in the one
    // place that knows whether it is inside a quoted string.
    const sql = await readFile(new URL(migration, directory), 'utf8');
    for (const statement of splitSqlStatements(sql)) {
      await isolatedDb.prepare(statement).run();
    }
  }
  return { mf: isolated, db: isolatedDb };
}
