// Transactional email for the Worker.
//
// Before this file there was no email code anywhere in PCD. A parent submitted
// a camp and heard nothing back, ever. This is the sending primitive plus the
// two paths that need it: the submitter confirmation and the admin alert.
//
// THE GATE. Outbound email to a real person is a HUMAN GATE action under the
// constitution, so this ships in STAGE mode: the message is fully rendered,
// posted to the Slack staging channel, and not sent. Nothing reaches an inbox
// until Jeff flips the switch.
//
// THE FLIP, stated exactly (this is the answer to "what would make it
// autonomous later"):
//   EMAIL_MODE=send        → submitter-facing mail sends for real. Requires
//                            RESEND_API_KEY and EMAIL_FROM to be set.
//   EMAIL_ADMIN_MODE=send  → admin alerts (to an address on ADMIN_EMAILS only)
//                            send for real.
// Both default to "stage". They are independent: admin alerts can go live while
// parent-facing mail stays staged, which is the order they should go live in.
// Neither flip is this lane's to make.
//
// Provider: Resend (https://resend.com/docs/api-reference/emails/send-email).
// One HTTPS call, no SDK, no npm dependency in the Worker bundle. The key is a
// Worker secret and is never exposed to the browser — this module is only ever
// imported by server-side route handlers.

import { postToSlack, type SlackEnv, type SlackPostResult } from './slack';

export interface EmailEnv extends SlackEnv {
  /** "stage" (default) or "send". Governs mail to people outside the system. */
  EMAIL_MODE?: string;
  /** "stage" (default) or "send". Governs mail to the ADMIN_EMAILS allowlist. */
  EMAIL_ADMIN_MODE?: string;
  RESEND_API_KEY?: string;
  /** Envelope from, e.g. "Parent Coach Desk <hello@parentcoachdesk.com>". */
  EMAIL_FROM?: string;
  /** Reply-to for parent-facing mail. Optional. */
  EMAIL_REPLY_TO?: string;
  /** Comma-separated admin allowlist, reused as the internal-mail allowlist. */
  ADMIN_EMAILS?: string;
}

/**
 * 'outbound' — a real person outside the system (a parent, a camp operator).
 * 'internal' — Jeff, at an address already on ADMIN_EMAILS.
 * The two are gated by separate switches on purpose.
 */
export type EmailClass = 'outbound' | 'internal';

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  emailClass: EmailClass;
  /** One line for the Slack staging post and the log. Not sent to the recipient. */
  reason: string;
}

export type EmailOutcome = 'sent' | 'staged' | 'suppressed' | 'failed';

export interface EmailResult {
  outcome: EmailOutcome;
  /** Provider message id when actually sent. */
  id?: string;
  error?: string;
}

const SEND_TIMEOUT_MS = 10000;
const MAX_SUBJECT_LEN = 200;
const MAX_BODY_LEN = 50000;

const isEmail = (s: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function mode(raw: string | undefined): 'send' | 'stage' {
  return raw?.trim().toLowerCase() === 'send' ? 'send' : 'stage';
}

/** Which switch governs this message. */
export function modeFor(env: EmailEnv | undefined, emailClass: EmailClass): 'send' | 'stage' {
  return emailClass === 'internal' ? mode(env?.EMAIL_ADMIN_MODE) : mode(env?.EMAIL_MODE);
}

function adminAllowList(env: EmailEnv | undefined): Set<string> {
  return new Set(
    (env?.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
}

/**
 * Send, or stage, one message.
 *
 * Never throws. Every failure comes back as { outcome: 'failed' } with a short
 * reason, so a mail problem can never take down a camp submission.
 */
export async function sendEmail(
  env: EmailEnv | undefined,
  message: EmailMessage,
): Promise<EmailResult> {
  const to = message.to.trim().toLowerCase();
  if (!isEmail(to)) return { outcome: 'failed', error: 'invalid recipient' };
  if (!message.subject.trim()) return { outcome: 'failed', error: 'empty subject' };
  if (message.subject.length > MAX_SUBJECT_LEN) return { outcome: 'failed', error: 'subject too long' };
  if (message.text.length > MAX_BODY_LEN) return { outcome: 'failed', error: 'body too long' };

  // An internal message may only go to an address already on the admin
  // allowlist. Without this, an 'internal' call is just an ungated send.
  if (message.emailClass === 'internal' && !adminAllowList(env).has(to)) {
    console.error('[email] internal message addressed off the admin allowlist — suppressed');
    return { outcome: 'suppressed', error: 'recipient not on admin allowlist' };
  }

  if (modeFor(env, message.emailClass) === 'stage') {
    const staged = await stageToSlack(env, message, to);
    return staged.ok
      ? { outcome: 'staged' }
      : { outcome: 'failed', error: staged.skipped ? 'staging not configured' : 'staging delivery failed' };
  }

  if (!env?.RESEND_API_KEY || !env?.EMAIL_FROM) {
    console.error('[email] mode is send but RESEND_API_KEY/EMAIL_FROM are not set — staging instead');
    const staged = await stageToSlack(env, message, to);
    return staged.ok
      ? { outcome: 'staged', error: 'send mode not configured' }
      : { outcome: 'failed', error: 'send and staging are not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM,
        to: [to],
        subject: message.subject,
        text: message.text,
        ...(message.html ? { html: message.html } : {}),
        ...(env.EMAIL_REPLY_TO ? { reply_to: env.EMAIL_REPLY_TO } : {}),
      }),
      signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
    });
    if (!res.ok) {
      // Provider bodies can echo recipient or message content. Never persist them.
      console.error(JSON.stringify({ event: 'email_send_failed', code: 'provider_rejected', status: res.status }));
      return { outcome: 'failed', error: 'provider rejected the message' };
    }
    const body = (await res.json().catch(() => ({}))) as { id?: string };
    return { outcome: 'sent', id: body.id };
  } catch {
    console.error(JSON.stringify({ event: 'email_send_failed', code: 'fetch_failed' }));
    return { outcome: 'failed', error: 'send failed' };
  }
}

/**
 * Stage mode emits only a pointer-free notification. Recipient, subject,
 * reason, and body may contain personal data and are withheld.
 */
async function stageToSlack(
  env: EmailEnv | undefined,
  message: EmailMessage,
  _to: string,
): Promise<SlackPostResult> {
  const text = [
    `:envelope_with_arrow: *Staged email — not sent* (${message.emailClass})`,
    'A protected email draft requires human review.',
    '_Body withheld from Slack. Review the authoritative protected record._',
    message.emailClass === 'internal'
      ? '_Set EMAIL_ADMIN_MODE=send to let these go out on their own._'
      : '_Set EMAIL_MODE=send to let these go out on their own._',
  ].join('\n');
  return await postToSlack(env, { text });
}

/**
 * Internal alerts are a dual-channel operator control: Slack receives a
 * privacy-safe routing signal before the approved administrator receives the
 * email. A missing or failed Slack channel prevents the email from being sent,
 * so send mode can never silently degrade to email-only delivery.
 */
async function stageInternalEmailRelayInSlack(env: EmailEnv | undefined): Promise<SlackPostResult> {
  return await postToSlack(env, {
    text: [
      ':envelope: *Internal Parent Coach Desk alert routing*',
      'A protected administrator alert is being delivered by email.',
      '_Recipient, subject, and body are withheld from Slack._',
    ].join('\n'),
  });
}

// ---------- The two paths that use the primitive ----------

export interface SubmissionDetails {
  campName: string;
  city: string;
  state: string;
  slug: string;
  status: 'pending' | 'approved';
  submitterEmail: string;
  siteUrl?: string;
}

/**
 * Confirmation to the person who submitted a camp. Plain, short, tells them
 * what happens next and how to reach a human. No marketing, no affiliate links.
 */
export async function sendSubmissionConfirmation(
  env: EmailEnv | undefined,
  details: SubmissionDetails,
): Promise<EmailResult> {
  const site = details.siteUrl ?? 'https://parentcoachdesk.com';
  const body =
    details.status === 'approved'
      ? [
          `Thanks for adding ${details.campName} to Parent Coach Desk.`,
          ``,
          `It is live now: ${site}/camps/${details.slug}/`,
          ``,
          `We review every listing after it posts. If anything looks wrong, reply to this email so we can investigate it.`,
          ``,
          `Parent Coach Desk`,
        ].join('\n')
      : [
          `Thanks for submitting ${details.campName} in ${details.city}, ${details.state}.`,
          ``,
          `It is in the review queue. We check the dates, ages, and registration link before anything goes live. Review timing depends on the evidence and current queue.`,
          ``,
          `You will hear from us when it posts. If you need to change something before then, reply to this email.`,
          ``,
          `Parent Coach Desk`,
        ].join('\n');

  return sendEmail(env, {
    to: details.submitterEmail,
    subject:
      details.status === 'approved'
        ? `${details.campName} is live on Parent Coach Desk`
        : `We got your camp submission: ${details.campName}`,
    text: body,
    emailClass: 'outbound',
    reason: `Submission confirmation for ${details.campName} (${details.status})`,
  });
}

/**
 * Alert to Jeff that something landed in the admin queue. Internal class, so it
 * can only ever reach an address on ADMIN_EMAILS.
 */
export async function sendAdminAlert(
  env: EmailEnv | undefined,
  alert: { subject: string; body: string; to?: string },
): Promise<EmailResult> {
  const to = alert.to ?? (env?.ADMIN_EMAILS ?? '').split(',')[0]?.trim();
  if (!to) return { outcome: 'suppressed', error: 'no admin recipient configured' };

  if (modeFor(env, 'internal') === 'send') {
    const slack = await stageInternalEmailRelayInSlack(env);
    if (!slack.ok) {
      console.error(JSON.stringify({
        event: 'internal_alert_suppressed',
        code: slack.skipped ? 'slack_not_configured' : 'slack_provider_rejected',
      }));
      return { outcome: 'failed', error: 'internal alert Slack relay unavailable' };
    }
  }

  const result = await sendEmail(env, {
    to,
    subject: alert.subject,
    text: alert.body,
    emailClass: 'internal',
    reason: 'Admin alert',
  });
  return result;
}
