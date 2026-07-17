import { describe, expect, it } from 'vitest';
import { bearerCredential, secretsMatch } from '../../src/lib/secrets';

describe('secret credential helpers', () => {
  it('matches equal secrets and rejects unequal or differently sized values', async () => {
    await expect(secretsMatch('same-secret', 'same-secret')).resolves.toBe(true);
    await expect(secretsMatch('same-secret', 'other-secret')).resolves.toBe(false);
    await expect(secretsMatch('short', 'a-much-longer-secret')).resolves.toBe(false);
  });

  it('extracts only bearer authorization credentials', () => {
    expect(bearerCredential(new Request('https://example.com', {
      headers: { Authorization: 'Bearer secret-value' },
    }))).toBe('secret-value');
    expect(bearerCredential(new Request('https://example.com', {
      headers: { Authorization: 'Basic abc123' },
    }))).toBe('');
  });
});
