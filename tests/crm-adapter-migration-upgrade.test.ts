import { afterAll, describe, expect, it } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { Miniflare } from 'miniflare';
import type { D1Database } from '@cloudflare/workers-types';
import { splitSqlStatements } from './helpers/disposable-ops-db';

describe('CRM adapter migration upgrade', () => {
  let isolated: Miniflare | undefined;

  afterAll(async () => isolated?.dispose());

  it('upgrades a database that already recorded the original 0038', async () => {
    isolated = new Miniflare({
      modules: true,
      script: 'export default { fetch() { return new Response("test only"); } }',
      compatibilityDate: '2026-07-15',
      d1Databases: { DB: `crm-migration-upgrade-${crypto.randomUUID()}` },
    });
    const db = (await isolated.getD1Database('DB')) as unknown as D1Database;
    const directory = new URL('../migrations-pcd-ops/', import.meta.url);
    const names = (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort();

    for (const name of names.filter((name) => name <= '0038_crm_adapter_safety_upgrade.sql')) {
      const sql = await readFile(new URL(name, directory), 'utf8');
      for (const statement of splitSqlStatements(sql)) await db.prepare(statement).run();
    }

    const at = Date.now();
    await db.prepare(`INSERT INTO crm_adapter_outbox
      (id,producer_workspace_id,event_id,source_sequence,event_type,subject_type,subject_id,
       authority_updated_at,payload_json,payload_hash,idempotency_key,status,attempt_count,
       next_attempt_at,created_at,updated_at,target_workspace_id)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      'outbox-upgrade', 'pcd-activity-radar', 'event-upgrade', 1, 'contact.observed.v1',
      'contact', 'contact-upgrade', at,
      JSON.stringify({ payload: { workspaceId: 'ws-sightsmash' } }), 'a'.repeat(64),
      'idempotency-upgrade', 'retry', 2, at, at, at, 'ws-sightsmash',
    ).run();

    for (const name of [
      '0039_crm_adapter_atomic_send_cancellation.sql',
      '0040_crm_adapter_bounded_retractions.sql',
      '0041_crm_backfill_created_cursor_and_public_contact_safety.sql',
    ]) {
      const sql = await readFile(new URL(name, directory), 'utf8');
      for (const statement of splitSqlStatements(sql)) await db.prepare(statement).run();
    }

    expect(await db.prepare(`SELECT cancelled_at,send_attempt_count FROM crm_adapter_outbox
      WHERE id='outbox-upgrade'`).first()).toEqual({ cancelled_at: null, send_attempt_count: 2 });
    const index = await db.prepare(`SELECT sql FROM sqlite_master
      WHERE type='index' AND name='idx_crm_adapter_outbox_claim_sequence'`).first<{ sql: string }>();
    expect(index?.sql).toContain('cancelled_at IS NULL');
    expect(await db.prepare(`SELECT 1 FROM pragma_table_info('crm_adapter_controls')
      WHERE name='target_workspace_id'`).first()).toEqual({ 1: 1 });
    expect(await db.prepare(`SELECT 1 FROM sqlite_master WHERE type='table'
      AND name='crm_contact_retraction_runs'`).first()).toEqual({ 1: 1 });
    for (const name of ['organization_cursor_created_second', 'contact_cursor_created_second']) {
      expect(await db.prepare(`SELECT 1 FROM pragma_table_info('crm_adapter_backfill_runs')
        WHERE name=?`).bind(name).first()).toEqual({ 1: 1 });
    }
    await db.prepare(`INSERT INTO org_contacts (id,organization_id,full_name,contact_context)
      VALUES ('contact-upgrade','org-upgrade','Upgrade Contact','professional')`).run();
    const before = await db.prepare(`SELECT crm_projection_revision FROM org_contacts WHERE id=?`)
      .bind('contact-upgrade').first<{ crm_projection_revision: number }>();
    await db.prepare(`UPDATE org_contacts SET is_public=1 WHERE id=?`).bind('contact-upgrade').run();
    const after = await db.prepare(`SELECT crm_projection_revision FROM org_contacts WHERE id=?`)
      .bind('contact-upgrade').first<{ crm_projection_revision: number }>();
    expect(Number(after?.crm_projection_revision)).toBeGreaterThan(Number(before?.crm_projection_revision));
  }, 30_000);
});
