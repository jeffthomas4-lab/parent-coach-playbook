import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('commerce test-mode ledger migration', () => {
  it('contains reconciliation records and no card or bank data fields', async () => {
    const sql = await readFile(new URL('../migrations-pcd-ops/0022_commerce_test_mode_ledger.sql', import.meta.url), 'utf8');
    for (const table of ['commerce_products', 'commerce_prices', 'commerce_checkout_attempts', 'commerce_orders', 'commerce_payment_events', 'commerce_entitlements', 'commerce_refunds', 'commerce_events']) expect(sql).toContain(`CREATE TABLE ${table}`);
    const executable = sql.replace(/^--.*$/gm, '');
    expect(executable).not.toMatch(/card_number|cvv|bank_account|routing_number/i);
    expect(sql).toContain('UNIQUE(provider_code, provider_event_id)');
    expect(sql).toContain('provider_request_reference TEXT NOT NULL UNIQUE');
    expect(sql).toContain('separate from directory verification, organic ranking, and editorial truth');
  });
});
