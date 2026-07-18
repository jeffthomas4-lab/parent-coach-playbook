import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import operatingSystem from '../strategy/company-operating-system.json';
import { validateCompanyOperatingSystem } from '../scripts/check-company-operating-system.mjs';

describe('company operating system', () => {
  it('keeps the canonical operating contract valid and honest', () => {
    expect(validateCompanyOperatingSystem(operatingSystem)).toEqual({
      valid: true,
      errors: [],
      metricCount: 21,
      riskCount: 12,
    });
  });

  it('rejects manufactured actuals and unauthorized commerce activation', () => {
    const invalid = structuredClone(operatingSystem);
    invalid.metric_definitions[0].current = { status: 'pending', value: 100000 } as never;
    invalid.implementation_status.customer_and_commerce_activation = 'active';
    const result = validateCompanyOperatingSystem(invalid);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('monthly_unique_visitors: unmeasured metrics cannot carry a value.');
    expect(result.errors).toContain('customer and commerce activation must remain not_authorized.');
  });

  it('keeps the master document comprehensive and linked to its contract', async () => {
    const document = await readFile(operatingSystem.master_document, 'utf8');
    for (const heading of [
      'Discovery across every spectrum',
      'Editorial and product operating system',
      'Revenue operating system',
      'Organization and decision rights',
      'Operating cadence',
      'Company scorecard',
      'Maintenance and resilience',
      'Risk system',
      'Current implementation state',
      'Immediate 90-day operating plan',
    ]) {
      expect(document).toContain(heading);
    }
  });
});
