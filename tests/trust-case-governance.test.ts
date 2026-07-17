import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { trustCaseDueAt, trustCasePriority } from '../src/lib/trust-cases';

describe('trust-case governance contract', () => {
  it('assigns deterministic internal targets and severity', () => {
    const submitted = '2026-07-16T00:00:00.000Z';
    expect(trustCasePriority('safety_concern')).toBe('urgent');
    expect(trustCasePriority('privacy')).toBe('high');
    expect(trustCasePriority('listing_correction')).toBe('normal');
    expect(trustCaseDueAt('safety_concern', submitted)).toBe('2026-07-17T00:00:00.000Z');
    expect(trustCaseDueAt('privacy', submitted)).toBe('2026-08-15T00:00:00.000Z');
  });

  it('provides immutable lifecycle evidence and separately approved suppression', async () => {
    const migration = await readFile(new URL('../migrations/0011_trust_cases.sql', import.meta.url), 'utf8');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS trust_case_events');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS content_suppressions');
    expect(migration).toContain("DEFAULT 'proposed'");
    expect(migration).toContain("status IN ('proposed', 'active', 'lifted')");
    expect(migration).not.toMatch(/UPDATE\s+trust_case_events|DELETE\s+FROM\s+trust_case_events/i);
  });

  it('keeps protected response drafts separate from metadata-only notification delivery', async () => {
    const migration = await readFile(new URL('../migrations/0012_trust_drafts_and_notification_outbox.sql', import.meta.url), 'utf8');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS trust_response_drafts');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS notification_outbox');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS trust_response_draft_events');
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS trust_response_delivery_attempts');
    expect(migration).toContain('idempotency_key TEXT NOT NULL UNIQUE');
    expect(migration).toContain("'delivery_unknown'");
    expect(migration).toContain("'reconciled_sent'");
    expect(migration).toContain("'reconciled_not_sent'");
    expect(migration).toContain('reconciliation_evidence TEXT');
    expect(migration).toContain("status TEXT NOT NULL DEFAULT 'draft'");
    expect(migration).toContain("status TEXT NOT NULL DEFAULT 'pending'");
    expect(migration).toContain('approved_content_hash TEXT');
    expect(migration).toContain('expires_at TEXT NOT NULL');
    const outbox = migration.split('CREATE TABLE IF NOT EXISTS notification_outbox')[1] ?? '';
    expect(outbox).not.toMatch(/requester_email|recipient_email|subject|body_text/i);
  });
});
