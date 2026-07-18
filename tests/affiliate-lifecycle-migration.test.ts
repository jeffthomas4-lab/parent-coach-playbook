import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('affiliate lifecycle migration', () => {
  it('defines the complete provider-neutral lifecycle without customer surveillance', async () => {
    const sql = await readFile('migrations-pcd-ops/0023_affiliate_recommendation_lifecycle.sql', 'utf8');
    for (const table of [
      'affiliate_merchants',
      'affiliate_products',
      'affiliate_product_identifiers',
      'affiliate_product_sources',
      'affiliate_offers',
      'affiliate_buying_intents',
      'affiliate_recommendations',
      'affiliate_guide_placements',
      'affiliate_lifecycle_events',
      'affiliate_health_checks',
      'affiliate_incidents',
      'affiliate_revenue_statements',
      'affiliate_revenue_lines',
      'equipment_requirements',
    ]) expect(sql).toContain(`CREATE TABLE ${table}`);
    expect(sql).not.toMatch(/email|ip_address|user_agent|child_id|household_id|card_|credential|password/i);
  });

  it('keeps recommendation publication, offers, and revenue evidence human-gated', async () => {
    const sql = await readFile('migrations-pcd-ops/0023_affiliate_recommendation_lifecycle.sql', 'utf8');
    expect(sql).toContain("status NOT IN ('approved','published','maintenance_due')");
    expect(sql).toContain("status NOT IN ('approved','active')");
    expect(sql).toContain('statement_sha256');
    expect(sql).toContain('editorial_approved_by');
    expect(sql).toContain('disclosure_verified_at');
  });
});
