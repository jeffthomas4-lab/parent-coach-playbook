// Quote-aware SQL statement splitter, extracted as a standalone module so
// intel test helpers can use it without importing tests/helpers/disposable-
// ops-db.ts (which pulls in `miniflare` at module load time — a dependency
// this repo's node_modules does not always resolve cleanly, see
// tests/helpers/disposable-intel-db.ts's header comment). Logic mirrors
// disposable-ops-db.ts's stripSqlComments/splitSqlStatements exactly; kept
// as a byte-for-byte copy rather than a re-export so this module has zero
// imports of its own.

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
 * not split the statement) and quoted strings/identifiers.
 */
export function splitSqlStatements(rawSql: string): string[] {
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

    const precededByWordChar = i > 0 && WORD_CHAR.test(sql[i - 1]!);
    if (!precededByWordChar && /[A-Za-z]/.test(ch!)) {
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
