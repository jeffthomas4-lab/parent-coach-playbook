import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readme = readFileSync('README.md', 'utf8');

describe('developer entrypoint authority', () => {
  it('points operators to current Worker-era authorities', () => {
    expect(readme).toContain('coordination/REPOSITORY-STRUCTURE.md');
    expect(readme).toContain('DEPLOYMENT-RUNBOOK.md');
    expect(readme).toContain('protected workflow');
    expect(readme).not.toMatch(/Cloudflare Pages|wrangler pages|Pages environment/i);
  });

  it('does not claim inactive newsletter or CMS behavior is live', () => {
    expect(readme).toContain('hosted Kit form');
    expect(readme).toContain('Markdown is canonical today');
    expect(readme).not.toContain('console.log`s the email');
    expect(readme).not.toContain('keep both running');
  });
});
