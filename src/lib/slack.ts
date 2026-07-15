// Slack primitives for the Worker: posting to the staging channel, and
// verifying that an inbound interactive payload really came from Slack.
//
// Convention lives in automation/SLACK-STAGING.md: one channel, one message per
// thing that needs Jeff's eyes, a link to the real content, no essay in the
// message itself.
//
// Config:
//   SLACK_WEBHOOK_URL   — incoming webhook for the PCD channel (secret)
//   SLACK_SIGNING_SECRET — the Slack app's signing secret, for inbound actions (secret)
//
// Nothing here throws into a request path. A Slack outage must not fail a camp
// submission or an approval; every post is best-effort and logs on failure.

export interface SlackEnv {
  SLACK_WEBHOOK_URL?: string;
  SLACK_SIGNING_SECRET?: string;
}

const POST_TIMEOUT_MS = 5000;
/** Slack refuses anything older than 5 minutes; so do we. */
const MAX_TIMESTAMP_SKEW_SEC = 300;

export interface SlackPostResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

/**
 * Post a message to the PCD Slack channel. Blocks are optional; `text` is
 * always sent as the notification fallback.
 *
 * Returns { ok:false, skipped:true } when no webhook is configured, so callers
 * can tell "not wired yet" from "Slack said no".
 */
export async function postToSlack(
  env: SlackEnv | undefined,
  message: { text: string; blocks?: unknown[] },
): Promise<SlackPostResult> {
  const url = env?.SLACK_WEBHOOK_URL?.trim();
  if (!url) {
    console.warn('[slack] SLACK_WEBHOOK_URL not set — message dropped:', message.text);
    return { ok: false, skipped: true, error: 'not configured' };
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        message.blocks ? { text: message.text, blocks: message.blocks } : { text: message.text },
      ),
      signal: AbortSignal.timeout(POST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error('[slack] post failed', res.status);
      return { ok: false, error: `slack returned ${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    console.error('[slack] post threw', e);
    return { ok: false, error: 'post failed' };
  }
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.length % 2 === 0 ? hex : `0${hex}`;
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/**
 * Verify an inbound Slack request signature (v0 HMAC-SHA256 over
 * `v0:<timestamp>:<raw body>`), plus the replay window.
 *
 * The caller must pass the RAW body text, read once, before any JSON or form
 * parsing — re-serializing changes the bytes and the signature will not match.
 *
 * https://api.slack.com/authentication/verifying-requests-from-slack
 */
export async function verifySlackSignature(
  request: Request,
  rawBody: string,
  signingSecret: string | undefined,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!signingSecret) return { ok: false, reason: 'signing secret not configured' };

  const timestamp = request.headers.get('x-slack-request-timestamp');
  const signature = request.headers.get('x-slack-signature');
  if (!timestamp || !signature) return { ok: false, reason: 'missing signature headers' };

  const ts = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(ts)) return { ok: false, reason: 'bad timestamp' };
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > MAX_TIMESTAMP_SKEW_SEC) {
    return { ok: false, reason: 'stale timestamp' };
  }
  if (!signature.startsWith('v0=')) return { ok: false, reason: 'unsupported signature version' };

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(signingSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const mac = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`v0:${timestamp}:${rawBody}`),
    );
    const expected = new Uint8Array(mac);
    const provided = hexToBytes(signature.slice(3));
    if (!timingSafeEqual(expected, provided)) return { ok: false, reason: 'signature mismatch' };
    return { ok: true };
  } catch (e) {
    console.error('[slack] signature verify threw', e);
    return { ok: false, reason: 'verify failed' };
  }
}
