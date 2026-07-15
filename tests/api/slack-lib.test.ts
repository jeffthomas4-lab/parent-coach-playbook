// Tests for src/lib/slack.ts — posting to the staging channel, and proving an
// inbound interactive payload really came from Slack.

import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import { postToSlack, verifySlackSignature } from '../../src/lib/slack';
import { slackSign } from '../helpers/slack-sign';

const SECRET = 'test-signing-secret';
const BODY = 'payload=%7B%22type%22%3A%22block_actions%22%7D';

// Same shape as email.test.ts's helper: a zero-arg vi.fn(async () => ...)
// infers an empty-tuple call-args type, so `.mock.calls[0][1]` fails to
// typecheck. Typing the mock as `Mock<typeof fetch>` restores the real
// (url, init?) shape, and `body` is narrowed for real rather than asserted
// away — a call recorded without a string body is worth a loud failure.
function jsonBodyOf(fetchMock: Mock<typeof fetch>, index = 0) {
  const body = fetchMock.mock.calls[index]?.[1]?.body;
  if (typeof body !== 'string') {
    throw new Error(`expected fetch call ${index} to carry a JSON string body, got ${typeof body}`);
  }
  return JSON.parse(body);
}

function makeReq(headers: Record<string, string>): Request {
  return new Request('https://parentcoachdesk.com/api/slack/actions', {
    method: 'POST',
    headers,
    body: BODY,
  });
}

describe('postToSlack', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('happy path: posts the text to the configured webhook', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await postToSlack({ SLACK_WEBHOOK_URL: 'https://hooks.slack.com/x' }, { text: 'hello' });
    expect(result.ok).toBe(true);
    expect(jsonBodyOf(fetchMock)).toEqual({ text: 'hello' });
  });

  it('reports skipped, not an error, when no webhook is configured', async () => {
    const result = await postToSlack({}, { text: 'hello' });
    expect(result).toMatchObject({ ok: false, skipped: true });
  });

  it('does not throw when Slack is down', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('down'); }));
    const result = await postToSlack({ SLACK_WEBHOOK_URL: 'https://hooks.slack.com/x' }, { text: 'hi' });
    expect(result.ok).toBe(false);
  });
});

describe('verifySlackSignature', () => {
  it('happy path: accepts a correctly signed, fresh request', async () => {
    const headers = await slackSign(BODY, SECRET);
    expect(await verifySlackSignature(makeReq(headers), BODY, SECRET)).toEqual({ ok: true });
  });

  it('SECURITY: refuses a body that was changed after signing', async () => {
    const headers = await slackSign(BODY, SECRET);
    const tampered = 'payload=%7B%22type%22%3A%22evil%22%7D';
    const result = await verifySlackSignature(makeReq(headers), tampered, SECRET);
    expect(result).toMatchObject({ ok: false, reason: 'signature mismatch' });
  });

  it('SECURITY: refuses a signature made with a different secret', async () => {
    const headers = await slackSign(BODY, 'some-other-secret');
    const result = await verifySlackSignature(makeReq(headers), BODY, SECRET);
    expect(result).toMatchObject({ ok: false, reason: 'signature mismatch' });
  });

  it('SECURITY: refuses a replayed request outside the 5-minute window', async () => {
    const old = Math.floor(Date.now() / 1000) - 600;
    const headers = await slackSign(BODY, SECRET, old);
    const result = await verifySlackSignature(makeReq(headers), BODY, SECRET);
    expect(result).toMatchObject({ ok: false, reason: 'stale timestamp' });
  });

  it('refuses a request with no signature headers', async () => {
    const result = await verifySlackSignature(makeReq({}), BODY, SECRET);
    expect(result).toMatchObject({ ok: false, reason: 'missing signature headers' });
  });

  it('refuses everything when no signing secret is configured', async () => {
    const headers = await slackSign(BODY, SECRET);
    const result = await verifySlackSignature(makeReq(headers), BODY, undefined);
    expect(result.ok).toBe(false);
  });

  it('refuses an unknown signature version', async () => {
    const headers = await slackSign(BODY, SECRET);
    headers['x-slack-signature'] = headers['x-slack-signature'].replace('v0=', 'v9=');
    const result = await verifySlackSignature(makeReq(headers), BODY, SECRET);
    expect(result).toMatchObject({ ok: false, reason: 'unsupported signature version' });
  });

  it('refuses a garbage timestamp', async () => {
    const headers = await slackSign(BODY, SECRET);
    headers['x-slack-request-timestamp'] = 'yesterday';
    const result = await verifySlackSignature(makeReq(headers), BODY, SECRET);
    expect(result).toMatchObject({ ok: false, reason: 'bad timestamp' });
  });
});
