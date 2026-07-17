import { describe, expect, it } from 'vitest';
import {
  classifyDemandActor,
  demandExpiry,
  demandResultBand,
  demandRetentionDays,
  sanitizeDemandQuery,
} from '../src/lib/demand-telemetry';

describe('demand telemetry contract', () => {
  it('maps result counts into stable bounded bands', () => {
    expect(demandResultBand(undefined)).toBe('unknown');
    expect(demandResultBand(-2)).toBe('zero');
    expect(demandResultBand(0)).toBe('zero');
    expect(demandResultBand(5.9)).toBe('one_to_five');
    expect(demandResultBand(20)).toBe('six_to_twenty');
    expect(demandResultBand(21)).toBe('twenty_one_plus');
    expect(demandResultBand(999_999)).toBe('twenty_one_plus');
  });

  it('requires explicit retention between one and ninety days', () => {
    expect(demandRetentionDays(undefined)).toBeNull();
    expect(demandRetentionDays('0')).toBeNull();
    expect(demandRetentionDays('91')).toBeNull();
    expect(demandRetentionDays('30 days')).toBeNull();
    expect(demandRetentionDays(' 30 ')).toBe(30);
  });

  it('computes deterministic expiry from server time', () => {
    expect(demandExpiry('2026-07-01T00:00:00.000Z', 30)).toBe('2026-07-31T00:00:00.000Z');
    expect(() => demandExpiry('invalid', 30)).toThrow(/retention/);
    expect(() => demandExpiry('2026-07-01T00:00:00.000Z', 91)).toThrow(/retention/);
  });

  it('classifies obvious bots and leaves unverifiable actors unknown', () => {
    expect(classifyDemandActor(new Request('https://example.com', { headers: { 'user-agent': 'Googlebot' } }))).toBe('bot_likely');
    expect(classifyDemandActor(new Request('https://example.com'))).toBe('unknown');
    expect(classifyDemandActor(new Request('https://example.com', { headers: {
      'user-agent': 'Mozilla/5.0', 'sec-fetch-site': 'same-origin',
    } }))).toBe('human_likely');
  });

  it('redacts contact data before any persistence boundary', () => {
    expect(sanitizeDemandQuery('Call 253-555-1212 at parent@example.com')).toEqual({
      query: 'call [phone] at [email]', redacted: true,
    });
  });
});
