// Regression cover for the SQL statement splitter that every migration-reading
// test depends on. Deploy Workers #35 failed in build-production because
// migrations-pcd-ops/0028_org_contacts.sql:123 carries a TRAILING comment with
// an apostrophe in it:
//
//   crm_external_id     TEXT,            -- the CRM's own id for this contact
//
// The old pre-strip regex (`^\s*--.*$`) only removed comments that own a line,
// so that one survived. The splitter then read the apostrophe in "CRM's" as
// the start of a string literal that never closed, swallowed every subsequent
// semicolon, and handed D1 the whole remaining file as one 4,035-character
// statement containing nine CREATE keywords. D1 answered:
//
//   D1_ERROR: incomplete input: SQLITE_ERROR
//
// which surfaced as two failing suites (editorial-records-migration,
// customer-lifecycle.integration) and a red production build.
//
// These tests pin the behaviour so the next trailing comment cannot do it
// again. The real migration files are exercised too, so a future migration
// with an unlucky comment fails here — one obvious test — rather than in the
// deploy pipeline.

import { readFile, readdir } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { splitSqlStatements, stripSqlComments } from './helpers/disposable-ops-db';

describe('splitSqlStatements', () => {
  it('ignores an apostrophe inside a trailing comment (the 0028 failure)', () => {
    // Shaped like migrations-pcd-ops/0028_org_contacts.sql: the comment trails
    // a column definition inside the CREATE TABLE, and more statements follow.
    const sql = [
      'CREATE TABLE org_contacts (',
      '  id TEXT PRIMARY KEY,',
      "  crm_external_id TEXT,            -- the CRM's own id for this contact",
      '  created_at TEXT NOT NULL',
      ');',
      'CREATE INDEX idx_org_contacts_org ON org_contacts(id);',
      'CREATE INDEX idx_org_contacts_crm ON org_contacts(crm_external_id);',
    ].join('\n');

    const statements = splitSqlStatements(sql);
    expect(statements).toHaveLength(3);
    expect(statements[0]).toContain('CREATE TABLE org_contacts');
    expect(statements[0]).not.toContain('CREATE INDEX');
    // Before the fix this collapsed to a single statement carrying all three
    // CREATE keywords, which D1 rejected as "incomplete input".
    expect(statements[0].match(/CREATE/g)).toHaveLength(1);
  });

  it('ignores a semicolon inside a trailing comment', () => {
    const sql = 'CREATE TABLE a (\n  v TEXT -- value before the write; the rollback value\n);\nSELECT 1;';
    const statements = splitSqlStatements(sql);
    expect(statements).toHaveLength(2);
    expect(statements[0]).toContain('CREATE TABLE a');
    expect(statements[0]).toContain('v TEXT');
  });

  it('keeps a comment marker that lives inside a string literal', () => {
    const statements = splitSqlStatements("INSERT INTO t VALUES ('a -- not a comment'); SELECT 1;");
    expect(statements).toHaveLength(2);
    expect(statements[0]).toContain('-- not a comment');
  });

  it('keeps an escaped apostrophe inside a string literal', () => {
    expect(splitSqlStatements("INSERT INTO t VALUES ('it''s fine'); SELECT 1;")).toHaveLength(2);
  });

  it('does not split a CREATE TRIGGER on its internal semicolons', () => {
    const sql = 'CREATE TRIGGER t AFTER INSERT ON a BEGIN UPDATE a SET x=1; UPDATE a SET y=2; END;\nSELECT 1;';
    const statements = splitSqlStatements(sql);
    expect(statements).toHaveLength(2);
    expect(statements[0]).toContain('END');
  });

  it('drops block comments', () => {
    expect(splitSqlStatements('CREATE TABLE a (x TEXT); /* drop; this */ SELECT 1;')).toHaveLength(2);
  });

  it('splits every real ops migration into balanced, comment-free statements', async () => {
    const directory = new URL('../migrations-pcd-ops/', import.meta.url);
    const files = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const sql = await readFile(new URL(file, directory), 'utf8');
      const statements = splitSqlStatements(sql);
      expect(statements.length, `${file} produced no statements`).toBeGreaterThan(0);

      for (const statement of statements) {
        // An odd number of apostrophes means a literal was left open, which is
        // exactly how the 0028 bug presented before it reached D1.
        const apostrophes = (statement.match(/'/g) ?? []).length;
        expect(apostrophes % 2, `${file}: unterminated string literal in a statement`).toBe(0);
      }
    }
  });
});

describe('stripSqlComments', () => {
  it('removes indented comments, which an anchored ^-- regex leaves behind', () => {
    expect(stripSqlComments('  -- indented note\nSELECT 1;')).not.toContain('indented note');
  });

  it('removes trailing comments, which a line-anchored regex leaves behind', () => {
    expect(stripSqlComments("SELECT 1; -- the CRM's id")).not.toContain('CRM');
  });

  it('leaves quoted text alone', () => {
    expect(stripSqlComments("SELECT '-- literal';")).toContain('-- literal');
  });
});
