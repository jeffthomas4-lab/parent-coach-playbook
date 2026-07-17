import { readFile, readdir } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const load = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

describe('pre-commerce safety boundary', () => {
  it('does not let claim moderation manufacture payment, ownership, or entitlement', async () => {
    const [endpoint, claimsAdmin, queueAdmin, db] = await Promise.all([
      load('src/pages/api/admin/claims/[id]/update.ts'),
      load('src/pages/admin/claims/index.astro'),
      load('src/pages/admin/camps/queue.astro'),
      load('src/lib/camps-db.ts'),
    ]);
    const moderation = `${endpoint}\n${claimsAdmin}\n${queueAdmin}`;

    expect(endpoint).toContain("['verified', 'rejected']");
    expect(endpoint).not.toContain('markCampClaimed');
    expect(moderation).not.toMatch(/mark paid|paid \+ activate|data-action="mark-paid"/i);
    expect(db).not.toContain('export async function markCampClaimed');
  });

  it('keeps customer identity and commerce storage out of the legacy directory lineage', async () => {
    const migrationDir = new URL('../migrations/', import.meta.url);
    const names = (await readdir(migrationDir)).filter((name) => name.endsWith('.sql'));
    const migrations = (await Promise.all(names.map((name) => readFile(new URL(name, migrationDir), 'utf8')))).join('\n').toLowerCase();

    for (const table of ['customer_users', 'organization_memberships', 'orders', 'payment_events', 'entitlements']) {
      expect(migrations).not.toContain(`create table ${table}`);
    }
  });

  it('keeps payment storage confined to the default-inert operational commerce ledger', async () => {
    const migrationDir = new URL('../migrations-pcd-ops/', import.meta.url);
    const names = (await readdir(migrationDir)).filter((name) => name.endsWith('.sql'));
    const migrations = (await Promise.all(names.map((name) => readFile(new URL(name, migrationDir), 'utf8')))).join('\n').toLowerCase();
    for (const table of ['orders', 'payment_events', 'entitlements']) {
      expect(migrations).not.toContain(`create table ${table}`);
    }
    expect(migrations).toContain('create table customer_users');
    expect(migrations).toContain('create table organization_memberships');
    for (const table of ['commerce_orders', 'commerce_payment_events', 'commerce_entitlements']) {
      expect(migrations).toContain(`create table ${table}`);
    }
  });
});
