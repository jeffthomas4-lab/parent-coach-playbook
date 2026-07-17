import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { loadAndValidateDirectoryRemediationPacket, validateDirectoryRemediationPacket } from '../scripts/directory-remediation-packet.mjs';

const paths = { packetPath: 'coordination/directory-remediation-proposals-2026-07-16.json', queuePath: 'coordination/directory-remediation-queue-2026-07-16.json' };

describe('directory remediation proposal packet', () => {
  it('covers the full queue, authorizes no writes and contains only bounded owner-gated corrections', async () => {
    const result = await loadAndValidateDirectoryRemediationPacket(paths);
    expect(result.validation).toEqual({ ok: true, failures: [], itemCount: 10, correctionCount: 3 });
    expect(result.sha256).toMatch(/^[a-f0-9]{64}$/);
  });

  it('contains current read evidence with no production mutation', async () => {
    const packet = JSON.parse(await readFile(paths.packetPath, 'utf8'));
    expect(packet.productionWritesAuthorized).toBe(false);
    expect(packet.liveRead.rowsWritten).toBe(0);
    expect(packet.liveRead.changedDb).toBe(false);
    expect(packet.items.filter((item: any) => item.programId).every((item: any) => item.currentState.pcd_status === 'approved')).toBe(true);
  });

  it('rejects executable SQL, unauthorized fields, investigation changes and missing owner gates', async () => {
    const queue = JSON.parse(await readFile(paths.queuePath, 'utf8'));
    const packet = JSON.parse(await readFile(paths.packetPath, 'utf8'));
    const sql = structuredClone(packet); sql.items[0].reason = 'UPDATE programs SET price_text = NULL for this record';
    expect(validateDirectoryRemediationPacket(sql, queue).failures).toContain('packet contains executable or comment-like SQL text');
    const status = structuredClone(packet); status.items[0].proposedChanges = { pcd_status: 'rejected' };
    expect(validateDirectoryRemediationPacket(status, queue).ok).toBe(false);
    const investigate = structuredClone(packet); investigate.items[3].proposedChanges = { price_text: null };
    expect(validateDirectoryRemediationPacket(investigate, queue).ok).toBe(false);
    const owner = structuredClone(packet); owner.items[0].decisionState = 'approved';
    expect(validateDirectoryRemediationPacket(owner, queue).ok).toBe(false);
    const source = structuredClone(packet); delete source.items[0].sourceVerifiedAt;
    expect(validateDirectoryRemediationPacket(source, queue).ok).toBe(false);
  });

  it('rejects partial, duplicate or invented queue coverage', async () => {
    const queue = JSON.parse(await readFile(paths.queuePath, 'utf8'));
    const packet = JSON.parse(await readFile(paths.packetPath, 'utf8'));
    expect(validateDirectoryRemediationPacket({ ...packet, items: packet.items.slice(1) }, queue).ok).toBe(false);
    const duplicate = structuredClone(packet); duplicate.items[1].programId = duplicate.items[0].programId;
    expect(validateDirectoryRemediationPacket(duplicate, queue).ok).toBe(false);
  });
});
