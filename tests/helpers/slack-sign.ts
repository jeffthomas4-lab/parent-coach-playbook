// Test helper: signs a body the way Slack does, so the signature tests use a
// real HMAC rather than a stubbed verifier.

export async function slackSign(
  body: string,
  secret: string,
  timestamp: number = Math.floor(Date.now() / 1000),
): Promise<{ 'x-slack-signature': string; 'x-slack-request-timestamp': string }> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`v0:${timestamp}:${body}`));
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return {
    'x-slack-signature': `v0=${hex}`,
    'x-slack-request-timestamp': String(timestamp),
  };
}
