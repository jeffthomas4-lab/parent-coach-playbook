import type { D1Database } from '@cloudflare/workers-types';
import { recordIdentityProviderEvent } from './customer-store';

const MAX_EVENT_BYTES = 256 * 1024;
const MAX_CLOCK_SKEW_SECONDS = 300;

export interface VerifiedIdentityProviderEnvelope {
  providerEventId: string;
  eventType: string;
  issuedAtUnixSeconds: number;
}

export interface IdentityProviderSignatureVerifier {
  readonly providerCode: string;
  verify(input: { rawBody: string; headers: Headers }): Promise<VerifiedIdentityProviderEnvelope | null>;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export type IdentityProviderReceiveResult =
  | { accepted: true; outcome: 'created' | 'replay' }
  | { accepted: false; status: 400 | 401 | 409 | 413 | 415; code: string };

export async function receiveIdentityProviderEvent(input: {
  request: Request;
  db: D1Database;
  verifier: IdentityProviderSignatureVerifier;
  now: Date;
  eventRecordId: string;
}): Promise<IdentityProviderReceiveResult> {
  const contentType = input.request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') return { accepted: false, status: 415, code: 'json_required' };

  const declaredLength = Number(input.request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_EVENT_BYTES) return { accepted: false, status: 413, code: 'event_too_large' };
  const rawBody = await input.request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_EVENT_BYTES) return { accepted: false, status: 413, code: 'event_too_large' };

  let parsed: unknown;
  try { parsed = JSON.parse(rawBody); } catch { return { accepted: false, status: 400, code: 'invalid_json' }; }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { accepted: false, status: 400, code: 'object_required' };

  const envelope = await input.verifier.verify({ rawBody, headers: input.request.headers }).catch(() => null);
  if (!envelope) return { accepted: false, status: 401, code: 'signature_invalid' };
  if (!envelope.providerEventId.trim() || !envelope.eventType.trim() || !Number.isFinite(envelope.issuedAtUnixSeconds)) {
    return { accepted: false, status: 400, code: 'envelope_invalid' };
  }
  const nowSeconds = Math.floor(input.now.getTime() / 1000);
  if (Math.abs(nowSeconds - envelope.issuedAtUnixSeconds) > MAX_CLOCK_SKEW_SECONDS) {
    return { accepted: false, status: 401, code: 'event_stale' };
  }

  const outcome = await recordIdentityProviderEvent(input.db, {
    id: input.eventRecordId,
    providerCode: input.verifier.providerCode,
    providerEventId: envelope.providerEventId,
    eventType: envelope.eventType,
    payloadSha256: await sha256Hex(rawBody),
    signatureVerifiedAt: input.now.toISOString(),
    receivedAt: input.now.toISOString(),
  });
  if (outcome === 'payload_conflict') return { accepted: false, status: 409, code: 'event_payload_conflict' };
  return { accepted: true, outcome };
}
