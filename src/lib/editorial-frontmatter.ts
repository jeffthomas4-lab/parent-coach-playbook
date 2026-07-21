// Shared frontmatter helpers for editorial status transitions and flag
// resolution (src/pages/api/admin/editorial/set-status.ts). Both operate on
// the same `editorial:` YAML block and use the same read-modify-commit
// pattern as approve.ts and src/lib/publish.ts.
//
// `revisionNote` and `flagResolutions` are declared as optional fields on
// src/content.config.ts's `editorial` zod object, matching the keys this
// module writes (flag, reason, date, admin), so both round-trip through
// `getCollection()` / `item.data.editorial` as expected.

export type EditorialStatus =
  | 'draft'
  | 'claude-reviewed'
  | 'ready-for-jeff'
  | 'jeff-approved'
  | 'published'
  | 'needs-revision';

/** Statuses a piece can be sent back to revision from. `published` is
 *  excluded on purpose: sending a live post back to revision without also
 *  unpublishing it would misstate what's on the site, and this endpoint
 *  never unpublishes. `needs-revision` is excluded because it's already the
 *  target state. */
export const SEND_BACK_FROM: EditorialStatus[] = ['draft', 'claude-reviewed', 'ready-for-jeff', 'jeff-approved'];

/** The only status `reopen-draft` accepts from. */
export const REOPEN_DRAFT_FROM: EditorialStatus[] = ['needs-revision'];

/** Wire names match the labels already rendered in the Flags column of
 *  admin/editorial/index.astro, so the UI and the API agree on vocabulary
 *  without a translation table. */
export const FLAG_FIELDS = {
  INAPPROP: { field: 'flagInappropriateness', resolvedValue: 'false' },
  IP: { field: 'flagIpRisk', resolvedValue: 'false' },
  SENS: { field: 'flagSensitiveTopic', resolvedValue: 'false' },
  // citationCheckPassed is inverted: false is the flagged state (NOCITE),
  // so "resolving" it means setting it true.
  NOCITE: { field: 'citationCheckPassed', resolvedValue: 'true' },
} as const;

export type FlagName = keyof typeof FLAG_FIELDS;

export function isFlagName(v: string): v is FlagName {
  return Object.prototype.hasOwnProperty.call(FLAG_FIELDS, v);
}

/** Strip newlines/control chars and collapse whitespace so a value can sit
 *  safely on a single quoted YAML line, then cap length. */
export function sanitizeLine(input: string, maxLen: number): string {
  return input.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

/** Double-quoted YAML scalar, safe for arbitrary single-line text (escapes
 *  backslashes and double quotes). */
export function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

interface ParsedFrontmatter {
  openMarker: string;
  fmBody: string;
  closeMarker: string;
  rest: string;
  editorialHeader: string;
  editorialChildren: string;
  trailingNewline: string;
  hasEditorialBlock: boolean;
}

const FRONTMATTER_RE = /^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$/;
const EDITORIAL_RE = /^(editorial:\r?\n)((?:  [^\n]*\r?\n?)+)/m;

/** Split a markdown file into its frontmatter parts and, within that, the
 *  `editorial:` block's own children. Returns null when there's no
 *  frontmatter at all (not every file needs one). A missing `editorial:`
 *  block is NOT null — it's a valid state (schema default 'draft') and
 *  callers get `hasEditorialBlock: false` so they can create one. */
export function parseFrontmatter(content: string): ParsedFrontmatter | null {
  const fmMatch = content.match(FRONTMATTER_RE);
  if (!fmMatch) return null;
  const [, openMarker, fmBody, closeMarker, rest] = fmMatch;

  const editorialMatch = fmBody.match(EDITORIAL_RE);
  if (!editorialMatch) {
    return {
      openMarker,
      fmBody,
      closeMarker,
      rest,
      editorialHeader: 'editorial:\n',
      editorialChildren: '',
      trailingNewline: '',
      hasEditorialBlock: false,
    };
  }
  const editorialHeader = editorialMatch[1];
  let editorialChildren = editorialMatch[2];
  let trailingNewline = '';
  if (editorialChildren.endsWith('\n')) {
    trailingNewline = editorialChildren.slice(editorialChildren.lastIndexOf('\n'));
    editorialChildren = editorialChildren.slice(0, editorialChildren.lastIndexOf('\n'));
  }
  return { openMarker, fmBody, closeMarker, rest, editorialHeader, editorialChildren, trailingNewline, hasEditorialBlock: true };
}

/** Reassemble a full file from parsed parts plus a new editorial-children
 *  string. Trims trailing whitespace off the children first so callers
 *  (upsertScalar, appendFlagResolution) don't have to reason about it. */
export function rebuildContent(parsed: ParsedFrontmatter, newChildren: string): string {
  const trimmedChildren = newChildren.replace(/\s+$/, '');
  // Preserve whatever trailing newline (if any) was originally captured —
  // do NOT default to '\n' here. The closing `---` marker in closeMarker
  // already carries its own leading newline, so adding one unconditionally
  // produces a spurious blank line before it when the editorial block was
  // the last thing in frontmatter (the common case).
  const newEditorial = parsed.editorialHeader + trimmedChildren + parsed.trailingNewline;
  const newFmBody = parsed.hasEditorialBlock
    ? parsed.fmBody.replace(EDITORIAL_RE, newEditorial)
    : `${parsed.fmBody.replace(/\s+$/, '')}\n${newEditorial}`;
  return parsed.openMarker + newFmBody + parsed.closeMarker + parsed.rest;
}

/** Read the current editorial status, defaulting to the schema default
 *  ('draft') when the block or the key is missing. */
export function getStatus(editorialChildren: string): string {
  const m = editorialChildren.match(/^ {2}status:\s*([^\n]*)/m);
  return m ? m[1].trim() : 'draft';
}

/** Read a boolean editorial field, defaulting to `false` per every flag
 *  field's `z.boolean().default(false)` in content.config.ts. */
export function getBoolean(editorialChildren: string, key: string): boolean {
  const m = editorialChildren.match(new RegExp(`^ {2}${key}:\\s*([^\\n]*)`, 'm'));
  return m ? m[1].trim() === 'true' : false;
}

/** Upsert a scalar `key: value` line at the top level of the editorial
 *  block (2-space indent). */
export function upsertScalar(editorialChildren: string, key: string, value: string): string {
  const re = new RegExp(`^( {2}${key}:\\s*)([^\\n]*)`, 'm');
  if (re.test(editorialChildren)) {
    return editorialChildren.replace(re, `$1${value}`);
  }
  const trimmed = editorialChildren.replace(/\s+$/, '');
  return trimmed ? `${trimmed}\n  ${key}: ${value}` : `  ${key}: ${value}`;
}

/** Append one entry to the list-valued `flagResolutions:` block, creating it
 *  if it doesn't exist yet. Each entry is self-contained (flag, reason,
 *  date, admin) so the audit trail reads without cross-referencing anything
 *  else in the file. */
export function appendFlagResolution(
  editorialChildren: string,
  entry: { flag: string; reason: string; date: string; admin: string },
): string {
  const itemLines =
    `    - flag: ${entry.flag}\n` +
    `      reason: ${yamlQuote(entry.reason)}\n` +
    `      date: ${entry.date}\n` +
    `      admin: ${entry.admin}\n`;

  const re = /^( {2}flagResolutions:\r?\n)((?: {4}[^\n]*\r?\n?)+)/m;
  const m = editorialChildren.match(re);
  if (m) {
    let body = m[2];
    if (!body.endsWith('\n')) body += '\n';
    return editorialChildren.replace(re, `${m[1]}${body}${itemLines}`);
  }
  const trimmed = editorialChildren.replace(/\s+$/, '');
  const block = `  flagResolutions:\n${itemLines}`;
  return trimmed ? `${trimmed}\n${block}` : block;
}
