// Tests for src/lib/email.ts.
//
// The load-bearing test in this file is the gate one: with EMAIL_MODE unset,
// nothing reaches a real inbox. If that test ever goes green while a send
// happens, the HUMAN GATE is broken.

import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import { sendEmail, sendSubmissionConfirmation, sendAdminAlert, modeFor } from '../../src/lib/email';

// vi.fn(async () => ...) with a zero-arg implementation infers an empty-tuple
// call-args type, which is why a bare `.mock.calls[0][1]` fails to typecheck.
// Typing the mock as `Mock<typeof fetch>` gives `calls` its real shape
// (url, init?) instead. `init` and `init.body` are still narrowed for real
// here rather than asserted away, because a fetch call recorded without a
// string body is exactly the kind of regression these tests exist to catch.
// Return type is left to JSON.parse's own inference (its native `any`) —
// that was already the shape of every assertion below before this fix.
function jsonBodyOf(fetchMock: Mock<typeof fetch>, index = 0) {
  const body = fetchMock.mock.calls[index]?.[1]?.body;
  if (typeof body !== 'string') {
    throw new Error(`expected fetch call ${index} to carry a JSON string body, got ${typeof body}`);
  }
  return JSON.parse(body);
}

const SEND_ENV = {
  EMAIL_MODE: 'send',
  EMAIL_ADMIN_MODE: 'send',
  RESEND_API_KEY: 'rs_fake_key',
  EMAIL_FROM: 'Parent Coach Desk <hello@parentcoachdesk.com>',
  ADMIN_EMAILS: 'jeffthomas@pugetsound.edu',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/x',
};

const STAGE_ENV = {
  ADMIN_EMAILS: 'jeffthomas@pugetsound.edu',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/x',
  RESEND_API_KEY: 'rs_fake_key',
  EMAIL_FROM: 'Parent Coach Desk <hello@parentcoachdesk.com>',
};

const message = {
  to: 'parent@example.com',
  subject: 'Test subject',
  text: 'Body text.',
  emailClass: 'outbound' as const,
  reason: 'unit test',
};

describe('the gate', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('THE GATE: with EMAIL_MODE unset, nothing is sent — it stages to Slack', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendEmail(STAGE_ENV, message);
    expect(result.outcome).toBe('staged');
    // Exactly one call, and it is Slack, not the mail provider.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(STAGE_ENV.SLACK_WEBHOOK_URL);
    expect(fetchMock.mock.calls.some((c) => String(c[0]).includes('resend.com'))).toBe(false);
  });

  it('THE GATE: EMAIL_MODE=stage explicitly also stages', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('ok')));
    const result = await sendEmail({ ...SEND_ENV, EMAIL_MODE: 'stage' }, message);
    expect(result.outcome).toBe('staged');
  });

  it('THE FLIP: EMAIL_MODE=send actually calls the provider', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ id: 'msg_1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendEmail(SEND_ENV, message);
    expect(result).toMatchObject({ outcome: 'sent', id: 'msg_1' });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.resend.com/emails');
    const sent = jsonBodyOf(fetchMock);
    expect(sent.to).toEqual(['parent@example.com']);
    expect(sent.subject).toBe('Test subject');
  });

  it('the two switches are independent: admin mail can go live while parent mail stays staged', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: 'msg_1' })));
    vi.stubGlobal('fetch', fetchMock);
    const env = { ...SEND_ENV, EMAIL_MODE: 'stage', EMAIL_ADMIN_MODE: 'send' };
    expect(modeFor(env, 'outbound')).toBe('stage');
    expect(modeFor(env, 'internal')).toBe('send');

    const parent = await sendEmail(env, message);
    expect(parent.outcome).toBe('staged');

    const admin = await sendEmail(env, {
      ...message,
      to: 'jeffthomas@pugetsound.edu',
      emailClass: 'internal',
    });
    expect(admin.outcome).toBe('sent');
  });

  it('stages rather than sends when send mode is on but the provider is not configured', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('ok')));
    const result = await sendEmail(
      { EMAIL_MODE: 'send', SLACK_WEBHOOK_URL: 'https://hooks.slack.com/x' },
      message,
    );
    expect(result.outcome).toBe('staged');
  });

  it('masks the recipient in the Slack staging post', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);
    await sendEmail(STAGE_ENV, message);
    const posted = jsonBodyOf(fetchMock).text;
    expect(posted).not.toContain('parent@example.com');
    expect(posted).toContain('p***@example.com');
  });
});

describe('sendEmail validation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('SECURITY: an internal message to an address off the admin allowlist is suppressed', async () => {
    const fetchMock = vi.fn(async () => new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendEmail(SEND_ENV, {
      ...message,
      to: 'attacker@example.com',
      emailClass: 'internal',
    });
    expect(result.outcome).toBe('suppressed');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid recipient without calling anything', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    expect((await sendEmail(SEND_ENV, { ...message, to: 'not-an-email' })).outcome).toBe('failed');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an empty or oversized subject', async () => {
    vi.stubGlobal('fetch', vi.fn());
    expect((await sendEmail(SEND_ENV, { ...message, subject: '  ' })).outcome).toBe('failed');
    expect((await sendEmail(SEND_ENV, { ...message, subject: 'x'.repeat(500) })).outcome).toBe('failed');
  });

  it('rejects an oversized body', async () => {
    vi.stubGlobal('fetch', vi.fn());
    expect((await sendEmail(SEND_ENV, { ...message, text: 'x'.repeat(60000) })).outcome).toBe('failed');
  });

  it('does not leak the provider error text to the caller', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{"message":"API key rs_live_secret is invalid"}', { status: 401 })),
    );
    const result = await sendEmail(SEND_ENV, message);
    expect(result.outcome).toBe('failed');
    expect(result.error).not.toContain('rs_live_secret');
  });

  it('never throws when the provider is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network'); }));
    const result = await sendEmail(SEND_ENV, message);
    expect(result.outcome).toBe('failed');
  });
});

describe('sendSubmissionConfirmation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('a pending submission tells the parent it is in the review queue', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ id: 'm' })));
    vi.stubGlobal('fetch', fetchMock);
    await sendSubmissionConfirmation(SEND_ENV, {
      campName: 'Tacoma Soccer Camp',
      city: 'Tacoma',
      state: 'WA',
      slug: 'tacoma-soccer-camp',
      status: 'pending',
      submitterEmail: 'parent@example.com',
    });
    const sent = jsonBodyOf(fetchMock);
    expect(sent.subject).toContain('Tacoma Soccer Camp');
    expect(sent.text).toContain('review queue');
    expect(sent.text).not.toContain('amzn.to');
  });

  it('an approved submission links to the live page', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ id: 'm' })));
    vi.stubGlobal('fetch', fetchMock);
    await sendSubmissionConfirmation(SEND_ENV, {
      campName: 'Tacoma Soccer Camp',
      city: 'Tacoma',
      state: 'WA',
      slug: 'tacoma-soccer-camp',
      status: 'approved',
      submitterEmail: 'parent@example.com',
      siteUrl: 'https://parentcoachdesk.com',
    });
    const sent = jsonBodyOf(fetchMock);
    expect(sent.text).toContain('https://parentcoachdesk.com/camps/tacoma-soccer-camp/');
  });

  it('is staged by default like every other parent-facing message', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('ok')));
    const result = await sendSubmissionConfirmation(STAGE_ENV, {
      campName: 'X Camp',
      city: 'Tacoma',
      state: 'WA',
      slug: 'x-camp',
      status: 'pending',
      submitterEmail: 'parent@example.com',
    });
    expect(result.outcome).toBe('staged');
  });
});

describe('sendAdminAlert', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to the first address on ADMIN_EMAILS', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({ id: 'm' })));
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendAdminAlert(SEND_ENV, { subject: 'New submission', body: 'One camp.' });
    expect(result.outcome).toBe('sent');
    expect(jsonBodyOf(fetchMock).to).toEqual(['jeffthomas@pugetsound.edu']);
  });

  it('is suppressed when no admin recipient is configured', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await sendAdminAlert({ EMAIL_ADMIN_MODE: 'send' }, { subject: 'x', body: 'y' });
    expect(result.outcome).toBe('suppressed');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
