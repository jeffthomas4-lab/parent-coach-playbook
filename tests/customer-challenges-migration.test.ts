import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('customer invitation and recovery migration', () => {
  it('stores hashes and lifecycle evidence without raw secrets or request fingerprints', async () => {
    const sql = await readFile(new URL('../migrations-pcd-ops/0018_customer_invitations_and_recovery.sql', import.meta.url), 'utf8');
    const executableSql = sql.replace(/^--.*$/gm, '');
    for (const table of ['customer_invitations', 'customer_recovery_challenges', 'customer_security_events']) expect(sql).toContain(`CREATE TABLE ${table}`);
    expect(sql).toContain('token_sha256');
    expect(sql).toContain('request_context_hash');
    expect(executableSql).not.toMatch(/password|user_agent|ip_address|raw_token/i);
  });
});
