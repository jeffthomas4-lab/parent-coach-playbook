// The approve-to-publish pipeline.
//
// pcd-rules-watcher drafts posts with `draft: true` and nothing ever flipped
// them, so drafts piled up and the site never saw them. This is the loop:
//
//   Slack message with an Approve button   (built by buildApprovalBlocks)
//     -> Jeff clicks it                    (THE HUMAN GATE — this file does not click)
//     -> /api/slack/actions verifies the click really came from Slack
//     -> publishDraft(): flip draft:false, stamp the editorial block, commit to
//        GitHub, fire the deploy hook
//
// Everything on either side of the click is automated. The click is not. There
// is no code path in this file that publishes without a caller having proven a
// human asked for it.
//
// Env: GITHUB_TOKEN (contents:write on the repo), DEPLOY_HOOK_URL (the
// Cloudflare deploy hook). Both are Worker secrets.

export interface PublishEnv {
  GITHUB_TOKEN?: string;
  DEPLOY_HOOK_URL?: string;
}

export const REPO = 'jeffthomas4-lab/parent-coach-desk';
export const BRANCH = 'main';

// Map content collections to their on-disk directories. Kept in sync with
// src/pages/api/admin/editorial/approve.ts — the same allowlist gates both
// routes, and an unknown collection is refused rather than guessed at.
export const COLLECTION_PATHS: Record<string, string> = {
  articles:        'src/content/articles',
  body:            'src/content/body',
  pathways:        'src/content/pathways',
  seasonCalendars: 'src/content/seasonCalendars',
  guides:          'src/content/guides',
  resources:       'src/content/resources',
  coachingTips:    'src/content/coachingTips',
  recruiting:      'src/content/recruiting',
  adaptive:        'src/content/adaptive',
  rules:           'src/content/rules',
  scripts:         'src/content/scripts',
  decisions:       'src/content/decisions',
  news:            'src/content/news',
};

const GH_TIMEOUT_MS = 15000;

// UTF-8 safe base64 helpers — atob/btoa alone only handle Latin-1.
export function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function decodeBase64(b64: string): string {
  const clean = b64.replace(/\s/g, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Slug must map 1:1 to a filename in the collection directory. No traversal. */
export function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{0,120}$/i.test(slug) && !slug.includes('..');
}

export interface FlipResult {
  content: string;
  /** False when the file was already published — the caller should stop, not recommit. */
  changed: boolean;
}

/**
 * Flip `draft: true` to `draft: false` in the frontmatter and stamp the
 * editorial block with the approver and the date.
 *
 * Returns changed:false when the file is already published, so a double-clicked
 * Slack button is a no-op instead of an empty commit.
 */
export function flipDraftFrontmatter(
  content: string,
  opts: { today: string; approvedBy: string },
): FlipResult | null {
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!fmMatch) return null;
  const [, openMarker, fmBody, closeMarker, rest] = fmMatch;

  let newFm = fmBody;
  let changed = false;

  const draftLine = newFm.match(/^draft:\s*(true|false)\s*$/m);
  if (draftLine) {
    if (draftLine[1] === 'true') {
      newFm = newFm.replace(/^draft:\s*true\s*$/m, 'draft: false');
      changed = true;
    }
  } else {
    // No draft key at all: the file is already publishable. Adding
    // `draft: false` would be a no-op commit, so leave it alone and let the
    // editorial stamp below decide whether anything changed.
  }

  // Stamp the editorial block so the run is auditable from the file itself.
  // Only fields that exist in src/content.config.ts's editorial schema get
  // written — inventing keys here would make them vanish at build time and the
  // audit trail with them. Who approved it lives in the commit message and the
  // committer email.
  const stamp = (block: string): string => {
    let b = block;
    if (/^ {2}status:\s*[^\n]+/m.test(b)) {
      b = b.replace(/^( {2}status:\s*)([^\n]+)/m, `$1published`);
    } else {
      b = `${b}\n  status: published`;
    }
    if (/^ {2}jeffReviewedAt:\s*[^\n]+/m.test(b)) {
      b = b.replace(/^( {2}jeffReviewedAt:\s*)([^\n]+)/m, `$1${opts.today}`);
    } else {
      b = `${b}\n  jeffReviewedAt: ${opts.today}`;
    }
    return b;
  };

  const editorialMatch = newFm.match(/^(editorial:\r?\n)((?: {2}[^\n]*\r?\n?)+)/m);
  if (editorialMatch) {
    let children = editorialMatch[2];
    let trailing = '';
    if (children.endsWith('\n')) {
      trailing = children.slice(children.lastIndexOf('\n'));
      children = children.slice(0, children.lastIndexOf('\n'));
    }
    const stamped = stamp(children);
    if (stamped !== children) changed = true;
    newFm = newFm.replace(
      /^(editorial:\r?\n)((?: {2}[^\n]*\r?\n?)+)/m,
      editorialMatch[1] + stamped + trailing,
    );
  } else {
    newFm =
      `${newFm.replace(/\s+$/, '')}\n` +
      `editorial:\n` +
      `  status: published\n` +
      `  jeffReviewedAt: ${opts.today}`;
    changed = true;
  }

  return { content: openMarker + newFm + closeMarker + rest, changed };
}

export type PublishOutcome =
  | { ok: true; path: string; commitSha?: string; deploy: 'fired' | 'skipped' | 'failed' }
  | { ok: false; code: number; error: string };

function ghHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'parent-coach-desk-editorial',
  };
}

/**
 * Fire the Cloudflare deploy hook. Best-effort by design: the commit is the
 * source of truth and a missed hook can be re-fired, so a hook failure reports
 * rather than rolls anything back.
 */
export async function fireDeployHook(env: PublishEnv | undefined): Promise<'fired' | 'skipped' | 'failed'> {
  const url = env?.DEPLOY_HOOK_URL?.trim();
  if (!url) {
    console.warn('[publish] DEPLOY_HOOK_URL not set — commit landed, no build triggered');
    return 'skipped';
  }
  try {
    const res = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(GH_TIMEOUT_MS) });
    if (!res.ok) {
      console.error('[publish] deploy hook returned', res.status);
      return 'failed';
    }
    return 'fired';
  } catch (e) {
    console.error('[publish] deploy hook threw', e);
    return 'failed';
  }
}

/**
 * Publish one draft: read the file, flip it, commit it, fire the deploy hook.
 *
 * The caller is responsible for proving a human asked for this. Callers today:
 * POST /api/admin/editorial/publish (Cloudflare Access identity) and
 * POST /api/slack/actions (a signature-verified Slack button click).
 */
export async function publishDraft(
  env: PublishEnv | undefined,
  input: { collection: string; slug: string; approvedBy: string },
): Promise<PublishOutcome> {
  if (!env?.GITHUB_TOKEN) {
    return { ok: false, code: 500, error: 'GITHUB_TOKEN not configured on the worker' };
  }
  const dir = COLLECTION_PATHS[input.collection];
  if (!dir) return { ok: false, code: 400, error: `unknown collection: ${input.collection}` };
  if (!isSafeSlug(input.slug)) return { ok: false, code: 400, error: 'invalid slug' };

  const path = `${dir}/${input.slug}.md`;
  const headers = ghHeaders(env.GITHUB_TOKEN);

  let getRes: Response;
  try {
    getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
      headers,
      signal: AbortSignal.timeout(GH_TIMEOUT_MS),
    });
  } catch (e) {
    console.error('[publish] github get threw', e);
    return { ok: false, code: 502, error: 'could not reach GitHub' };
  }
  if (!getRes.ok) {
    // Full GitHub error goes to the log; the caller gets a status only.
    console.error('[publish] github get failed', getRes.status, await getRes.text());
    return getRes.status === 404
      ? { ok: false, code: 404, error: 'draft not found' }
      : { ok: false, code: 502, error: 'github read failed' };
  }

  const fileData = (await getRes.json()) as { content: string; sha: string };
  const current = decodeBase64(fileData.content);
  const today = new Date().toISOString().slice(0, 10);
  const flipped = flipDraftFrontmatter(current, { today, approvedBy: input.approvedBy });
  if (!flipped) return { ok: false, code: 400, error: 'no frontmatter block found' };
  if (!flipped.changed) return { ok: false, code: 409, error: 'already published' };

  let putRes: Response;
  try {
    putRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Publish: ${input.collection}/${input.slug} (approved by ${input.approvedBy})`,
        content: encodeBase64(flipped.content),
        // Optimistic concurrency: a stale sha means someone edited the file
        // since we read it, and GitHub refuses rather than clobbering them.
        sha: fileData.sha,
        branch: BRANCH,
        committer: { name: 'Parent Coach Desk Editorial', email: input.approvedBy },
      }),
      signal: AbortSignal.timeout(GH_TIMEOUT_MS),
    });
  } catch (e) {
    console.error('[publish] github put threw', e);
    return { ok: false, code: 502, error: 'could not reach GitHub' };
  }
  if (!putRes.ok) {
    console.error('[publish] github put failed', putRes.status, await putRes.text());
    return { ok: false, code: 502, error: 'github commit failed' };
  }
  const putBody = (await putRes.json().catch(() => ({}))) as { commit?: { sha?: string } };

  const deploy = await fireDeployHook(env);
  return { ok: true, path, commitSha: putBody.commit?.sha, deploy };
}

/**
 * The Slack message that carries the button. One line on what is ready, a link,
 * and the two actions. Convention: automation/SLACK-STAGING.md.
 *
 * The action value carries collection and slug so the click is self-describing
 * and the actions route does not need a lookup table.
 */
export function buildApprovalBlocks(input: {
  collection: string;
  slug: string;
  title: string;
  reviewUrl: string;
}): unknown[] {
  const value = JSON.stringify({ collection: input.collection, slug: input.slug });
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Ed has a draft ready to publish.*\n<${input.reviewUrl}|${input.title}>\n\`${input.collection}/${input.slug}\``,
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          action_id: 'publish_draft',
          style: 'primary',
          text: { type: 'plain_text', text: 'Publish' },
          value,
          confirm: {
            title: { type: 'plain_text', text: 'Publish this post?' },
            text: {
              type: 'mrkdwn',
              text: `This flips \`draft: false\`, commits to main, and fires the deploy hook. It goes live.`,
            },
            confirm: { type: 'plain_text', text: 'Publish it' },
            deny: { type: 'plain_text', text: 'Not yet' },
          },
        },
        {
          type: 'button',
          action_id: 'dismiss_draft',
          text: { type: 'plain_text', text: 'Leave as draft' },
          value,
        },
      ],
    },
  ];
}
