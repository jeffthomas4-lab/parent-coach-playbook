import { describe, expect, it } from 'vitest';
import { detectSecrets } from '../../scripts/scan-secrets.mjs';

const join = (...parts: string[]) => parts.join('');

describe('secret scanner detectors', () => {
  it('detects representative credentials without returning their values', () => {
    const source = [
      join('sk-', 'proj-', 'A'.repeat(32)),
      join('ghp_', 'B'.repeat(36)),
      join('AKIA', 'C'.repeat(16)),
      join('-----BEGIN ', 'PRIVATE KEY-----'),
    ].join('\n');
    const findings = detectSecrets(source);
    expect(findings.map((finding) => finding.detector)).toEqual([
      'openai-key', 'github-token', 'aws-access-key', 'private-key',
    ]);
    expect(JSON.stringify(findings)).not.toContain('AAAA');
  });

  it('does not flag documented placeholders or ordinary content', () => {
    expect(detectSecrets([
      join('sk-', 'proj-', 'placeholder', 'A'.repeat(24)),
      join('ghp_', 'your_token_here_', 'B'.repeat(20)),
      'This is normal editorial content.',
    ].join('\n'))).toEqual([]);
  });
});
