// Tests for POST /api/slack/actions — the Slack button click.
//
// This route is where the HUMAN GATE physically lives, so most of these tests
// are about refusing to publish: an unsigned request, a replayed one, a click
// from someone who is not an approver, a malformed payload. The happy path is
// one test. The gate is eight.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';
import { slackSign } from '../helpers/slack-sign';
import { POST } from '../../src/pages/api/slack/actions';

const SIGNING_SECRET = 'test-signing-secret';
const JEFF = 'U_JEFF';
const ENV = {
  SLACK_SIGNING_SECRET: SIGNING_SECRET,
  SLACK_APPROVER_IDS: `${JEFF},U_OTHER_ADMIN`,
  GITHUB_TOKEN: 'gh_fake',
  DEPLOY_HOOK_URL: 'https://hook.example/deploy',
};

const DRAFT_MD = `---
title: A Test Post
draft: true
editorial:
  status: claude-reviewed
---
Body.
`;

const b64 = (s: string) => Buffer.from(s, 'utf-8').toString('base64');

function payloadBody(opts: {
  userId?: string;
  actionId?: string;
  value?: string;
  type?: string;
} = {}): string {
  const payload = {
    type: opts.type ?? 'block_actions',
    user: { id: opts.userId ?? JEFF, username: 'jeff' },
    response_url: 'https://hooks.slack.com/actions/response/abc',
    actions: [
      {
        action_id: opts.actionId ?? 'publish_draft',
        value: opts.value ?? JSON.stringify({ collection: 'articles', slug: 'a-test-post' }),
      },
    ],
  };
  return `payload=${encodeURIComponent(JSON.stringify(payload))}`;
}

async function signedRequest(body: string, secret = SIGNING_SECRET, timestamp?: number): Promise<Request> {
  const headers = await slackSign(body, secret, timestamp);
  return new Request('https://parentcoachdesk.com/api/slack/actions', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
    body,
  });
}

function githubOk() {
  return vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(DRAFT_MD), sha: 'sha1' }), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ commit: { sha: 'sha2' } }), { status: 200 }))
    .mockResolvedValueOnce(new Response('{}', { status: 200 })) // deploy hook
    .mockResolvedValueOnce(new Response('{}', { status: 200 })); // response_url
}

describe('POST /api/slack/actions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('THE GATE: an unsigned request publishes nothing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = new Request('https://parentcoachdesk.com/api/slack/actions', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: payloadBody(),
    });
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('THE GATE: a request signed with the wrong secret publishes nothing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody(), 'attacker-secret');
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('THE GATE: a replayed old request publishes nothing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const body = payloadBody();
    const req = await signedRequest(body, SIGNING_SECRET, Math.floor(Date.now() / 1000) - 600);
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('THE GATE: a click from a Slack user who is not an approver publishes nothing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody({ userId: 'U_RANDOM_CHANNEL_MEMBER' }));
    const res = await POST(makeContext({ request: req, env: ENV }));
    const body = await readJson(res);
    expect(body.text).toContain('not on the approver list');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('THE GATE: with no approver allowlist configured, nothing publishes', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody());
    const res = await POST(makeContext({ request: req, env: { ...ENV, SLACK_APPROVER_IDS: '' } }));
    const body = await readJson(res);
    expect(body.text).toContain('not configured');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('THE GATE: with no signing secret configured, nothing publishes', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody());
    const res = await POST(makeContext({ request: req, env: { ...ENV, SLACK_SIGNING_SECRET: undefined } }));
    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('the "Leave as draft" button publishes nothing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody({ actionId: 'dismiss_draft' }));
    const res = await POST(makeContext({ request: req, env: ENV }));
    const body = await readJson(res);
    expect(body.text).toContain('Nothing was published');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a malformed button value publishes nothing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody({ value: 'not-json' }));
    const res = await POST(makeContext({ request: req, env: ENV }));
    const body = await readJson(res);
    expect(body.text).toContain('malformed');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a button value with no slug publishes nothing', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody({ value: JSON.stringify({ collection: 'articles' }) }));
    const res = await POST(makeContext({ request: req, env: ENV }));
    const body = await readJson(res);
    expect(body.text).toContain('missing a collection or slug');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('happy path: a signed click from an approver flips the draft, commits, and deploys', async () => {
    const fetchMock = githubOk();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody());
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(200);

    const putBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(Buffer.from(putBody.content, 'base64').toString('utf-8')).toContain('draft: false');
    expect(putBody.committer.email).toBe('parentcoachplaybook@gmail.com');
    expect(putBody.message).toContain('approved by slack:jeff');
    expect(fetchMock.mock.calls[2][0]).toBe(ENV.DEPLOY_HOOK_URL);
    // And it reports back to the Slack message it came from.
    expect(fetchMock.mock.calls[3][0]).toBe('https://hooks.slack.com/actions/response/abc');
    expect(JSON.parse(fetchMock.mock.calls[3][1].body).text).toContain('Published');
  });

  it('reports back to Slack when the publish fails instead of failing silently', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody());
    await POST(makeContext({ request: req, env: ENV }));
    const reply = JSON.parse(fetchMock.mock.calls[1][1].body).text;
    expect(reply).toContain('Did not publish');
    expect(reply).toContain('draft not found');
  });

  it('ignores a non-block_actions payload', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = await signedRequest(payloadBody({ type: 'view_submission' }));
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('acks immediately and finishes the work in the background when waitUntil exists', async () => {
    const fetchMock = githubOk();
    vi.stubGlobal('fetch', fetchMock);
    const pending: Promise<unknown>[] = [];
    const req = await signedRequest(payloadBody());
    const ctx = makeContext({ request: req, env: ENV });
    (ctx.locals as any).runtime = { ctx: { waitUntil: (p: Promise<unknown>) => pending.push(p) } };
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(body.text).toContain('Publishing');
    expect(pending).toHaveLength(1);
    await Promise.all(pending);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
