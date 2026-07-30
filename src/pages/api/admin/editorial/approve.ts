// POST /api/admin/editorial/approve
// Approves a piece by updating its frontmatter status to `jeff-approved`
// and stamping `jeffReviewedAt` with today's date. Commits directly to the
// repo via the GitHub Contents API. The Cloudflare Pages build picks up the
// change on its next deploy.
//
// Auth: Cloudflare Access + admin allowlist + same-origin.
// Env: requires GITHUB_TOKEN with contents:write scope on the repo.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { BRANCH, COLLECTION_PATHS, REPO, isSafeSlug } from '../../../../lib/publish';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

// Statuses this route refuses to approve from. `published` is the one that
// matters: re-stamping a live piece as `jeff-approved` would silently revert
// it, and this route never unpublishes. A deny list rather than an allow list
// on purpose — files predate the canonical status vocabulary in
// src/lib/editorial-frontmatter.ts, and approving one of those is harmless.
const APPROVE_BLOCKED_FROM = ['published'];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

// UTF-8 safe base64 helpers — atob/btoa alone only handle Latin-1.
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

/**
 * Read the current `status:` out of the editorial block, or '' when the file
 * has no editorial block or no status key (both are legal — the schema
 * default is 'draft'). Mirrors getStatus in src/lib/editorial-frontmatter.ts,
 * kept local for the same reason the base64 helpers are: this route carries
 * no import-order dependency on its siblings.
 */
function readEditorialStatus(content: string): string {
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!fmMatch) return '';
  const editorialMatch = fmMatch[2].match(/^(editorial:\r?\n)((?:  [^\n]*\r?\n?)+)/m);
  if (!editorialMatch) return '';
  const statusMatch = editorialMatch[2].match(/^  status:\s*([^\n]*)/m);
  return statusMatch ? statusMatch[1].trim() : '';
}

/**
 * Update the editorial frontmatter block of a markdown file:
 *  - set status to `jeff-approved`
 *  - upsert jeffReviewedAt with today's YYYY-MM-DD
 *
 * Returns the new file content, or null if the file has no editorial block.
 */
function updateEditorialFrontmatter(content: string, today: string): string | null {
  // Split frontmatter from body. Frontmatter is between the first two `---` lines.
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/);
  if (!fmMatch) return null;
  const [, openMarker, fmBody, closeMarker, rest] = fmMatch;

  // Find the editorial: block. We capture all immediate children (lines
  // starting with two spaces, anything indented further is also absorbed).
  const editorialMatch = fmBody.match(/^(editorial:\r?\n)((?:  [^\n]*\r?\n?)+)/m);

  // No editorial block yet (most non-drill collections start without one).
  // Append a fresh minimal block at the end of the frontmatter.
  if (!editorialMatch) {
    const trimmedFm = fmBody.replace(/\s+$/, '');
    const newBlock =
      `${trimmedFm}\n` +
      `editorial:\n` +
      `  jeffReviewedAt: ${today}\n` +
      `  status: jeff-approved`;
    return openMarker + newBlock + closeMarker + rest;
  }

  const editorialHeader = editorialMatch[1];
  let editorialChildren = editorialMatch[2];

  // Trim a trailing newline if present so we can append cleanly later.
  let trailingNewline = '';
  if (editorialChildren.endsWith('\n')) {
    trailingNewline = editorialChildren.slice(editorialChildren.lastIndexOf('\n'));
    editorialChildren = editorialChildren.slice(0, editorialChildren.lastIndexOf('\n'));
  }

  // Update status: ... → status: jeff-approved
  if (/^  status:\s*[^\n]+/m.test(editorialChildren)) {
    editorialChildren = editorialChildren.replace(
      /^(  status:\s*)([^\n]+)/m,
      `$1jeff-approved`,
    );
  } else {
    editorialChildren = editorialChildren + `\n  status: jeff-approved`;
  }

  // Upsert jeffReviewedAt
  if (/^  jeffReviewedAt:\s*[^\n]+/m.test(editorialChildren)) {
    editorialChildren = editorialChildren.replace(
      /^(  jeffReviewedAt:\s*)([^\n]+)/m,
      `$1${today}`,
    );
  } else if (/^  claudeReviewedAt:\s*[^\n]+/m.test(editorialChildren)) {
    // Insert directly after claudeReviewedAt for tidiness.
    editorialChildren = editorialChildren.replace(
      /^(  claudeReviewedAt:\s*[^\n]+)$/m,
      `$1\n  jeffReviewedAt: ${today}`,
    );
  } else {
    editorialChildren = editorialChildren + `\n  jeffReviewedAt: ${today}`;
  }

  const newEditorial = editorialHeader + editorialChildren + trailingNewline;
  const newFmBody = fmBody.replace(
    /^(editorial:\r?\n)((?:  [^\n]*\r?\n?)+)/m,
    newEditorial,
  );
  return openMarker + newFmBody + closeMarker + rest;
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

  let body: { collection?: string; slug?: string };
  try {
    body = (await request.json()) as { collection?: string; slug?: string };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const { collection, slug } = body;
  if (!collection || !slug) {
    return json({ ok: false, error: 'missing collection or slug' }, 400);
  }
  const dir = COLLECTION_PATHS[collection];
  if (!dir) {
    return json({ ok: false, error: `unknown collection: ${collection}` }, 400);
  }

  // Slugs in our content collections map 1:1 to filenames. Same check as
  // ./set-status.ts and src/lib/publish.ts: an allowlist regex, not an
  // ad-hoc blocklist, so `?` and `#` cannot smuggle a query string or
  // fragment into the GitHub URLs built below.
  if (!isSafeSlug(slug)) {
    return json({ ok: false, error: 'invalid slug' }, 400);
  }
  // `dir` is a server-side constant from COLLECTION_PATHS and carries the
  // path separators; only the caller-supplied segment gets encoded.
  const path = `${dir}/${encodeURIComponent(slug)}.md`;

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
      event: 'github_editorial_approval_rejected',
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

  // 2. Check the transition against the file's CURRENT status, read fresh from
  // GitHub in this request — not whatever the client claims. Same
  // non-negotiable as ./set-status.ts: the server decides what's a legal move.
  const currentStatus = readEditorialStatus(currentContent);
  if (APPROVE_BLOCKED_FROM.includes(currentStatus)) {
    return json(
      { ok: false, error: `invalid transition: ${currentStatus} -> jeff-approved` },
      400,
    );
  }

  // 3. Update frontmatter.
  const today = new Date().toISOString().slice(0, 10);
  const updated = updateEditorialFrontmatter(currentContent, today);
  if (updated === null) {
    return json({ ok: false, error: 'no editorial frontmatter block found' }, 400);
  }
  if (updated === currentContent) {
    return json({ ok: false, error: 'no change to write' }, 400);
  }

  // 4. PUT the file with the existing sha (optimistic concurrency).
  const putRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Editorial: approve ${collection}/${slug}`,
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
      event: 'github_editorial_approval_rejected',
      operation: 'write',
      status: putRes.status,
    }));
    // A 409 from the Contents API is the stale-sha case: someone edited the
    // file between our read and our write. That is a conflict the caller can
    // retry, not an upstream outage, so it does not get reported as a 502.
    if (putRes.status === 409) {
      return json({ ok: false, error: 'content_changed_concurrently' }, 409);
    }
    return json({ ok: false, error: 'github_write_rejected' }, 502);
  }

  return json({
    ok: true,
    status: 'jeff-approved',
    jeffReviewedAt: today,
    approvedBy: auth.email,
  });
};
