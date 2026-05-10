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

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

// Map content collections to their on-disk directories.
const COLLECTION_PATHS: Record<string, string> = {
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
};

const REPO = 'jeffthomas4-lab/parent-coach-playbook';
const BRANCH = 'main';

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

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env as
    | { ADMIN_EMAILS?: string; GITHUB_TOKEN?: string }
    | undefined;

  const auth = requireAdmin(request, env);
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

  // Slugs in our content collections map 1:1 to filenames.
  // Light defense against path traversal.
  if (slug.includes('..') || slug.includes('/')) {
    return json({ ok: false, error: 'invalid slug' }, 400);
  }
  const path = `${dir}/${slug}.md`;

  const ghHeaders: Record<string, string> = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'parent-coach-playbook-editorial',
  };

  // 1. GET the file to obtain content + sha.
  const getRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: ghHeaders },
  );
  if (!getRes.ok) {
    const errText = await getRes.text();
    return json(
      { ok: false, error: `github get failed: ${getRes.status}`, detail: errText },
      getRes.status === 404 ? 404 : 502,
    );
  }
  const fileData = (await getRes.json()) as { content: string; sha: string };
  const currentContent = decodeBase64(fileData.content);

  // 2. Update frontmatter.
  const today = new Date().toISOString().slice(0, 10);
  const updated = updateEditorialFrontmatter(currentContent, today);
  if (updated === null) {
    return json({ ok: false, error: 'no editorial frontmatter block found' }, 400);
  }
  if (updated === currentContent) {
    return json({ ok: false, error: 'no change to write' }, 400);
  }

  // 3. PUT the file with the existing sha (optimistic concurrency).
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
          name: 'Parent Coach Playbook Editorial',
          email: auth.email,
        },
      }),
    },
  );
  if (!putRes.ok) {
    const errText = await putRes.text();
    return json(
      { ok: false, error: `github put failed: ${putRes.status}`, detail: errText },
      502,
    );
  }

  return json({
    ok: true,
    status: 'jeff-approved',
    jeffReviewedAt: today,
    approvedBy: auth.email,
  });
};
