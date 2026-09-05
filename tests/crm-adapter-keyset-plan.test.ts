import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { splitSqlStatements } from './helpers/disposable-ops-db';

describe('CRM historical keyset query plan', () => {
  it('uses bounded index seeks without a multi-index sort', () => {
    const db = new DatabaseSync(':memory:');
    db.exec(`CREATE TABLE organizations (id TEXT PRIMARY KEY, created_at TEXT NOT NULL);
      CREATE TABLE org_contacts (id TEXT PRIMARY KEY, created_at TEXT NOT NULL);`);
    db.exec(readFileSync(new URL('../migrations-activity-radar/0019_crm_backfill_created_cursor.sql', import.meta.url), 'utf8'));
    const opsMigration = readFileSync(new URL(
      '../migrations-pcd-ops/0041_crm_backfill_created_cursor_and_public_contact_safety.sql',
      import.meta.url,
    ), 'utf8');
    const contactIndex = splitSqlStatements(opsMigration)
      .find((statement) => statement.includes('CREATE INDEX idx_org_contacts_crm_backfill_created'));
    expect(contactIndex).toBeTruthy();
    db.exec(contactIndex!);

    for (const [table, index] of [
      ['organizations', 'idx_organizations_crm_backfill_created'],
      ['org_contacts', 'idx_org_contacts_crm_backfill_created'],
    ] as const) {
      const plans = [
        db.prepare(`EXPLAIN QUERY PLAN SELECT id FROM ${table} INDEXED BY ${index}
          WHERE unixepoch(created_at)=? AND id>? AND unixepoch(created_at)<?
          ORDER BY id LIMIT ?`).all(-1, '', 2_000_000_000, 50),
        db.prepare(`EXPLAIN QUERY PLAN SELECT id FROM ${table} INDEXED BY ${index}
          WHERE unixepoch(created_at)>? AND unixepoch(created_at)<?
          ORDER BY unixepoch(created_at),id LIMIT ?`).all(-1, 2_000_000_000, 50),
      ] as Array<Array<{ detail: string }>>;
      for (const plan of plans) {
        const detail = plan.map((row) => row.detail).join('\n');
        expect(detail).toMatch(new RegExp(`USING (?:COVERING )?INDEX ${index}`));
        expect(detail).not.toContain('MULTI-INDEX OR');
        expect(detail).not.toContain('USE TEMP B-TREE FOR ORDER BY');
      }
    }
    db.close();
  });
});
