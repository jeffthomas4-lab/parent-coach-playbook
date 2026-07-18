// POST /api/slack/actions
//
// The Slack interactivity endpoint — where the button click lands.
//
// This route is the human gate, not a bypass of it. Nothing publishes unless
// all four of these hold:
//   1. the request carries a valid Slack v0 signature over the raw body
//   2. inside Slack's 5-minute replay window
//   3. the clicking user's Slack ID is on SLACK_APPROVER_IDS
//   4. the action is the publish button, with a well-formed collection + slug
// Any one missing and the answer is no.
//
// Slack wants a response in 3 seconds and the publish (two GitHub calls) can
// outrun that, so the work runs behind waitUntil where the
// runtime offers it and the result is posted back to Slack's response_url.
//
// Env: SLACK_SIGNING_SECRET, SLACK_APPROVER_IDS, GITHUB_TOKEN.

import type { APIRoute } from 'astro';
import { verifySlackSignature } from '../../../lib/slack';
import { publishDraft, type PublishEnv } from '../../../lib/publish';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

interface SlackActionsEnv extends PublishEnv {
  SLACK_SIGNING_SECRET?: string;
  /** Comma-separated Slack user IDs allowed to press Publish. */
  SLACK_APPROVER_IDS?: string;
}

interface SlackInteractivePayload {
  type?: string;
  user?: { id?: string; username?: string };
  response_url?: string;
  actions?: { action_id?: string; value?: string }[];
}

const text = (body: string, status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

const ephemeral = (message: string) =>
  new Response(JSON.stringify({ response_type: 'ephemeral', text: message }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

function approverIds(env: SlackActionsEnv | undefined): Set<string> {
  return new Set(
    (env?.SLACK_APPROVER_IDS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

/** Post the outcome back to the message Jeff clicked from. Best-effort. */
async function respond(responseUrl: string | undefined, message: string): Promise<void> {
  if (!responseUrl) return;
  try {
    await fetch(responseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ replace_original: false, text: message }),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Fetch exceptions may include Slack's secret response URL.
    console.error(JSON.stringify({ event: 'slack_action_response_failed', code: 'fetch_failed' }));
  }
}

export const POST: APIRoute = async (ctx) => {
  const { request } = ctx;
  const env = cfEnv as SlackActionsEnv | undefined;

  // Raw body first, before any parsing — the signature is over these exact bytes.
  const rawBody = await request.text();

  const sig = await verifySlackSignature(request, rawBody, env?.SLACK_SIGNING_SECRET);
  if (!sig.ok) {
    // The reason goes to the log. An unverified caller learns nothing.
    console.warn('[slack-actions] signature check failed:', sig.reason);
    return text('forbidden', 403);
  }

  // Slack posts interactivity as form-encoded with a JSON `payload` field.
  let payload: SlackInteractivePayload;
  try {
    const params = new URLSearchParams(rawBody);
    const raw = params.get('payload');
    if (!raw) return text('bad request', 400);
    payload = JSON.parse(raw) as SlackInteractivePayload;
  } catch {
    return text('bad request', 400);
  }

  if (payload.type !== 'block_actions') return text('ok');

  const action = payload.actions?.[0];
  if (!action?.action_id) return text('ok');

  if (action.action_id === 'dismiss_draft') {
    return ephemeral('Left as a draft. Nothing was published.');
  }
  if (action.action_id !== 'publish_draft') return text('ok');

  // A valid Slack signature only proves the click came from Slack. It does not
  // prove who clicked, and anyone in the channel can press a button. The
  // approver allowlist is what makes this Jeff's click and not the room's.
  const allowed = approverIds(env);
  const userId = payload.user?.id ?? '';
  if (allowed.size === 0) {
    console.error('[slack-actions] SLACK_APPROVER_IDS not set — refusing to publish');
    return ephemeral('Publishing is not configured yet: no approver allowlist is set.');
  }
  if (!allowed.has(userId)) {
    console.warn(JSON.stringify({ event: 'slack_publish_blocked', code: 'unauthorized_approver' }));
    return ephemeral('You are not on the approver list for publishing.');
  }

  let target: { collection?: string; slug?: string };
  try {
    target = JSON.parse(action.value ?? '{}') as { collection?: string; slug?: string };
  } catch {
    return ephemeral('That button payload was malformed. Nothing was published.');
  }
  const collection = (target.collection ?? '').trim();
  const slug = (target.slug ?? '').trim();
  if (!collection || !slug) {
    return ephemeral('That button was missing a collection or slug. Nothing was published.');
  }

  const approvedBy = `slack:${payload.user?.username ?? userId}`;
  const responseUrl = payload.response_url;

  const work = async () => {
    const result = await publishDraft(env, { collection, slug, approvedBy });
    if (!result.ok) {
      await respond(responseUrl, `Did not publish \`${collection}/${slug}\`: ${result.error}`);
      return;
    }
    await respond(
      responseUrl,
      `Published \`${collection}/${slug}\`. The protected CI/CD workflow was queued from the main-branch commit; production still requires its configured approval.`,
    );
  };

  // Ack inside Slack's 3-second window and finish the work in the background
  // where the runtime supports it.
  const runtimeCtx = (ctx.locals as { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } })
    ?.runtime?.ctx;
  if (typeof runtimeCtx?.waitUntil === 'function') {
    runtimeCtx.waitUntil(work());
    return ephemeral(`Publishing \`${collection}/${slug}\`...`);
  }

  await work();
  return text('ok');
};
