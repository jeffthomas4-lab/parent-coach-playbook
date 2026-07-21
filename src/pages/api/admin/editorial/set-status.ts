// POST /api/admin/editorial/set-status
//
// The editorial board's "send it back" and "resolve a flag" actions. Same
// GitHub-commit mechanism as ./approve.ts (read the file, patch its
// `editorial:` frontmatter block, PUT it back with the sha for optimistic
// concurrency) but three distinct, server-whitelisted actions instead of one
// fixed transition:
//
//   action: 'send-back'    any reviewable status -> 'needs-revision'
//                           (draft, claude-reviewed, ready-for-jeff,
//                           jeff-approved only — never from 'published',
//                           since this route never unpublishes). Optional
//                           `note` is committed as `revisionNote`.
//
//   action: 'reopen-draft' 'needs-revision' -> 'draft' only.
//
//   action: 'resolve-flag' clears one active flag (INAPPROP / IP / SENS /
//                           NOCITE) and appends an entry to
//                           `flagResolutions:` recording who cleared it, why,
//                           and when. Does not change `status`.
//
// Every transition is checked against the file's CURRENT status/flag value
// as read fresh from GitHub in this request — not whatever the client
// claims — and anything not on the whitelist is rejected with 400. This is
// the same non-negotiable as approve.ts: the server decides what's a legal
// move, the client just asks for one.
//
// Auth: Cloudflare Access + admin allowlist + same-origin (requireAdmin /
// requireSameOrigin from ../../../../lib/admin-auth), identical to approve.ts
// and publish.ts.
//
// Env: requires GITHUB_TOKEN with contents:write scope on the repo.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { BRANCH, COLLECTION_PATHS, REPO, isSafeSlug } from '../../../../lib/publish';
import {
  appendFlagResolution,
  FLAG_FIELDS,
  getBoolean,
  getStatus,
  isFlagName,
  parseFrontmatter,
  rebuildContent,
  REOPEN_DRAFT_FROM,
  SEND_BACK_FROM,
  sanitizeLine,
  upsertScalar,
  yamlQuote,
} from '../../../../lib/editorial-frontmatter';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

// UTF-8 safe base64 helpers — atob/btoa alone only handle Latin-1. Duplicated
// from approve.ts rather than imported so this route has no import-order
// dependency on it; both stay in sync with src/lib/publish.ts's copies.
function encodeBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function decodeBase64(b64: string): string {
  const clean = b64.replace(/\s/g, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

type Action = 'send-back' | 'reopen-draft' | 'resolve-flag';
const ACTIONS: Action[] = ['send-back', 'reopen-draft', 'resolve-flag'];

interface Body {
  action?: string;
  collection?: string;
  slug?: string;
  note?: string;
  flag?: string;
  reason?: string;
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as
    | { ADMIN_EMAILS?: string; GITHUB_TOKEN?: string }
    | undefined;

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  if (!env?.GITHUB_TOKEN) {
    return json({ ok: false, error: 'GITHUB_TOKEN not configured on the worker' }, 500);
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const { collection, slug } = body;
  const action = body.action;
  if (!action || !ACTIONS.includes(action as Action)) {
    return json({ ok: false, error: `unknown action: ${action ?? ''}` }, 400);
  }
  if (!collection || !slug) {
    return json({ ok: false, error: 'missing collection or slug' }, 400);
  }
  const dir = COLLECTION_PATHS[collection];
  if (!dir) {
    return json({ ok: false, error: `unknown collection: ${collection}` }, 400);
  }
  if (!isSafeSlug(slug)) {
    return json({ ok: false, error: 'invalid slug' }, 400);
  }

  // Action-specific input validation, before we spend a GitHub call.
  let note = '';
  if (action === 'send-back' && typeof body.note === 'string') {
    note = sanitizeLine(body.note, 500);
  }

  let flag = '';
  let reason = '';
  if (action === 'resolve-flag') {
    flag = (body.flag ?? '').trim();
    if (!isFlagName(flag)) {
      return json({ ok: false, error: `unknown flag: ${flag}` }, 400);
    }
    reason = sanitizeLine(body.reason ?? '', 500);
    if (reason.length < 3) {
      return json({ ok: false, error: 'reason must be at least 3 characters' }, 400);
    }
  }

  const path = `${dir}/${slug}.md`;
  const ghHeaders: Record<string, string> = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'parent-coach-desk-editorial',
  };

  // 1. GET the file to obtain content + sha.
  const getRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: ghHeaders },
  );
  if (!getRes.ok) {
    console.error(JSON.stringify({
      event: 'github_editorial_set_status_rejected',
      operation: 'read',
      status: getRes.status,
    }));
    return json(
      { ok: false, error: 'github_read_rejected' },
      getRes.status === 404 ? 404 : 502,
    );
  }
  const fileData = (await getRes.json()) as { content: string; sha: string };
  const currentContent = decodeBase64(fileData.content);

  const parsed = parseFrontmatter(currentContent);
  if (!parsed) {
    return json({ ok: false, error: 'no frontmatter block found' }, 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentStatus = getStatus(parsed.editorialChildren);

  let newChildren = parsed.editorialChildren;
  let newStatus = currentStatus;
  let commitMessage = '';
  let responseExtra: Record<string, unknown> = {};

  if (action === 'send-back') {
    if (!SEND_BACK_FROM.includes(currentStatus as any)) {
      return json(
        { ok: false, error: `invalid transition: ${currentStatus} -> needs-revision` },
        400,
      );
    }
    newChildren = upsertScalar(newChildren, 'status', 'needs-revision');
    if (note) {
      newChildren = upsertScalar(newChildren, 'revisionNote', yamlQuote(note));
    }
    newStatus = 'needs-revision';
    commitMessage = `Editorial: send back ${collection}/${slug} for revision`;
    responseExtra = { revisionNote: note || undefined };
  } else if (action === 'reopen-draft') {
    if (!REOPEN_DRAFT_FROM.includes(currentStatus as any)) {
      return json(
        { ok: false, error: `invalid transition: ${currentStatus} -> draft` },
        400,
      );
    }
    newChildren = upsertScalar(newChildren, 'status', 'draft');
    newStatus = 'draft';
    commitMessage = `Editorial: reopen ${collection}/${slug} as draft`;
  } else {
    // resolve-flag
    const def = FLAG_FIELDS[flag as keyof typeof FLAG_FIELDS];
    const currentlyFlagged =
      flag === 'NOCITE' ? !getBoolean(newChildren, def.field) : getBoolean(newChildren, def.field);
    if (!currentlyFlagged) {
      return json({ ok: false, error: `flag not active: ${flag}` }, 400);
    }
    newChildren = upsertScalar(newChildren, def.field, def.resolvedValue);
    newChildren = appendFlagResolution(newChildren, {
      flag,
      reason,
      date: today,
      admin: auth.email,
    });
    commitMessage = `Editorial: resolve ${flag} flag on ${collection}/${slug}`;
    responseExtra = { flag, reason };
  }

  const updated = rebuildContent(parsed, newChildren);
  if (updated === currentContent) {
    return json({ ok: false, error: 'no change to write' }, 400);
  }

  // 2. PUT the file with the existing sha (optimistic concurrency).
  const putRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: commitMessage,
        content: encodeBase64(updated),
        sha: fileData.sha,
        branch: BRANCH,
        committer: {
          name: 'Parent Coach Desk Editorial',
          email: auth.email,
        },
      }),
    },
  );
  if (!putRes.ok) {
    console.error(JSON.stringify({
      event: 'github_editorial_set_status_rejected',
      operation: 'write',
      status: putRes.status,
    }));
    return json({ ok: false, error: 'github_write_rejected' }, 502);
  }

  return json({
    ok: true,
    action,
    status: newStatus,
    collection,
    slug,
    actorEmail: auth.email,
    ...responseExtra,
  });
};
