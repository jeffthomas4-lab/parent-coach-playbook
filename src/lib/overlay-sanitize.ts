// Inline editor: server-side sanitizer for overlay values.
//
// Client-side validation is UX. This runs on the Worker, on every write, with
// no trust in what the browser sent (Website Build Standard, Pillar 1 item 6).
//
// The output of sanitize() is what gets stored AND what later gets injected
// into the page by HTMLRewriter, so anything that survives here ends up in the
// document. The allowed surface is deliberately tiny.

import type { EditableRegion } from './editable-regions';

export interface SanitizeOk {
  ok: true;
  value: string;
}

export interface SanitizeErr {
  ok: false;
  /** Stable machine code. Safe to return to the client. */
  code:
    | 'empty'
    | 'too_long'
    | 'markup_not_allowed'
    | 'disallowed_tag'
    | 'disallowed_attribute'
    | 'unsafe_url'
    | 'control_characters';
  /** Safe, actionable message. Never contains a stack trace or raw input. */
  message: string;
}

export type SanitizeResult = SanitizeOk | SanitizeErr;

const ALLOWED_TAGS = new Set(['strong', 'em', 'a']);

// Control characters are stripped rather than rejected, except for the ones
// that indicate someone is trying something: null bytes and friends.
const HARD_CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

const err = (code: SanitizeErr['code'], message: string): SanitizeErr => ({ ok: false, code, message });

/** Collapse runs of whitespace and trim. Keeps single spaces between words. */
function normalizeWhitespace(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

function escapeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Is this href safe to store and render?
 *
 * Relative paths and absolute https URLs only. No javascript:, no data:, no
 * protocol-relative //evil.example, no mailto (nothing on the site needs it in
 * an editable region, and allowing it widens the surface for nothing).
 */
function isSafeHref(href: string): boolean {
  const v = href.trim();
  if (!v) return false;
  if (v.startsWith('//')) return false;
  if (v.startsWith('/')) return !v.startsWith('/\\');
  if (/^https:\/\/[^\s"'<>]+$/i.test(v)) return true;
  return false;
}

/**
 * Sanitize a candidate value for a region.
 *
 * 'text' regions are escaped whole: any markup the editor produced becomes
 * literal characters, which is what we want for a button label.
 *
 * 'richInline' regions get a hand-rolled parse over a tiny grammar. A real
 * HTML parser is not needed and would be a larger dependency and a larger
 * attack surface than the three tags we allow.
 */
export function sanitize(raw: string, region: EditableRegion): SanitizeResult {
  if (typeof raw !== 'string') {
    return err('empty', 'Value must be text.');
  }
  if (HARD_CONTROL.test(raw)) {
    return err('control_characters', 'That value contains characters that are not allowed.');
  }

  const normalized = normalizeWhitespace(raw);
  if (!normalized) {
    return err('empty', 'This cannot be left blank. Revert it instead if you want the original back.');
  }

  if (region.kind === 'text') {
    if (/<[a-z/!]/i.test(normalized)) {
      return err('markup_not_allowed', `"${region.label}" is a plain-text field. Remove the formatting.`);
    }
    const value = escapeText(normalized);
    if (value.length > region.maxLength) {
      return err('too_long', `"${region.label}" is limited to ${region.maxLength} characters.`);
    }
    return { ok: true, value };
  }

  // richInline
  const parsed = sanitizeInline(normalized);
  if (!parsed.ok) return parsed;
  if (parsed.value.length > region.maxLength) {
    return err('too_long', `"${region.label}" is limited to ${region.maxLength} characters.`);
  }
  return parsed;
}

/**
 * Walk the string, passing through only <strong>, <em> and <a href="...">,
 * escaping everything else. Unbalanced tags are a rejection, not a silent fix,
 * because a silent fix on a heading is the kind of thing nobody notices.
 */
function sanitizeInline(input: string): SanitizeResult {
  const out: string[] = [];
  const open: string[] = [];
  let i = 0;

  while (i < input.length) {
    const lt = input.indexOf('<', i);
    if (lt === -1) {
      out.push(escapeText(input.slice(i)));
      break;
    }
    out.push(escapeText(input.slice(i, lt)));

    const gt = input.indexOf('>', lt);
    if (gt === -1) {
      // A bare '<' in prose. Escape it and move on.
      out.push(escapeText(input.slice(lt)));
      break;
    }

    const rawTag = input.slice(lt + 1, gt).trim();
    const isClose = rawTag.startsWith('/');
    const body = isClose ? rawTag.slice(1).trim() : rawTag;
    const name = body.split(/[\s/]/, 1)[0].toLowerCase();

    if (!ALLOWED_TAGS.has(name)) {
      return err('disallowed_tag', `Only bold, italic and links are allowed here. Found <${name || '?'}>.`);
    }

    if (isClose) {
      if (open.pop() !== name) {
        return err('disallowed_tag', 'The formatting tags in that value are not balanced.');
      }
      out.push(`</${name}>`);
      i = gt + 1;
      continue;
    }

    if (name === 'a') {
      const attrs = body.slice(1).trim();
      const hrefMatch = attrs.match(/^href\s*=\s*"([^"]*)"$/i) ?? attrs.match(/^href\s*=\s*'([^']*)'$/i);
      if (!hrefMatch) {
        return err('disallowed_attribute', 'A link may carry an href and nothing else.');
      }
      const href = hrefMatch[1];
      if (!isSafeHref(href)) {
        return err('unsafe_url', 'Links must point at a path on this site or an https address.');
      }
      const external = href.startsWith('https://');
      out.push(
        external
          ? `<a href="${escapeText(href)}" rel="noopener noreferrer" target="_blank">`
          : `<a href="${escapeText(href)}">`,
      );
      open.push('a');
      i = gt + 1;
      continue;
    }

    if (body !== name) {
      return err('disallowed_attribute', `<${name}> cannot carry attributes.`);
    }
    out.push(`<${name}>`);
    open.push(name);
    i = gt + 1;
  }

  if (open.length > 0) {
    return err('disallowed_tag', 'The formatting tags in that value are not balanced.');
  }

  return { ok: true, value: out.join('') };
}
