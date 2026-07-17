import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const ALLOWED_CHANGES = new Set(['price_text', 'availability_status', 'age_min', 'age_max', 'registration_url']);
const FORBIDDEN_TEXT = /\b(?:update\s+[a-z_][a-z0-9_]*\s+set|insert\s+into|delete\s+from|drop\s+table|alter\s+table|replace\s+into|pragma\s+[a-z_]|execute\s+[a-z_])\b|(?:--\s|\/\*)/i;

export function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

export function validateDirectoryRemediationPacket(packet, queue) {
  const failures = [];
  if (packet?.schemaVersion !== 1 || packet.status !== 'proposal_only' || packet.productionWritesAuthorized !== false) failures.push('packet must be version 1, proposal-only and non-authorizing');
  if (packet?.liveRead?.rowsWritten !== 0 || packet?.liveRead?.changedDb !== false) failures.push('live evidence must prove zero writes');
  if (!Array.isArray(packet?.items) || packet.items.length !== queue?.items?.length) failures.push('packet must cover every queue item exactly once');
  const queuedIds = new Set(queue.items.map((item) => item.program_id));
  const seen = new Set();
  for (const item of packet.items ?? []) {
    const queueId = item.programId ?? 'policy-auburn-minimum-age-rounding';
    if (!queuedIds.has(queueId) || seen.has(queueId)) failures.push(`missing, unknown or duplicate queue item: ${queueId}`);
    seen.add(queueId);
    if (typeof item.reason !== 'string' || item.reason.length < 30 || typeof item.sourceUrl !== 'string' || !item.sourceUrl.startsWith('https://')) failures.push(`invalid evidence summary: ${item.itemId}`);
    const changes = Object.keys(item.proposedChanges ?? {});
    if (changes.length > 5 || changes.some((key) => !ALLOWED_CHANGES.has(key))) failures.push(`disallowed proposed field: ${item.itemId}`);
    if (item.actionClass !== 'bounded_field_correction' && changes.length) failures.push(`investigation/policy item contains changes: ${item.itemId}`);
    if (item.actionClass === 'bounded_field_correction' && !item.decisionState.includes('needs_owner')) failures.push(`correction lacks owner gate: ${item.itemId}`);
    if (item.actionClass === 'bounded_field_correction'
      && (typeof item.sourceVerifiedAt !== 'string' || !Number.isFinite(Date.parse(item.sourceVerifiedAt))
        || Date.parse(item.sourceVerifiedAt) > Date.parse(packet.generatedAt))) failures.push(`correction lacks current source verification: ${item.itemId}`);
    for (const key of changes) {
      if (!(key in item.currentState) || item.currentState[key] === item.proposedChanges[key]) failures.push(`change lacks a distinct before value: ${item.itemId}.${key}`);
    }
  }
  const serialized = JSON.stringify(packet);
  if (FORBIDDEN_TEXT.test(serialized)) failures.push('packet contains executable or comment-like SQL text');
  return { ok: failures.length === 0, failures, itemCount: packet?.items?.length ?? 0, correctionCount: (packet?.items ?? []).filter((item) => Object.keys(item.proposedChanges ?? {}).length).length };
}

export async function loadAndValidateDirectoryRemediationPacket({ packetPath, queuePath }) {
  const [packet, queue] = await Promise.all([readFile(packetPath, 'utf8').then(JSON.parse), readFile(queuePath, 'utf8').then(JSON.parse)]);
  const validation = validateDirectoryRemediationPacket(packet, queue);
  return { packet, validation, sha256: createHash('sha256').update(canonicalJson(packet)).digest('hex') };
}
