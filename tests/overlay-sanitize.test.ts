// Inline editor: sanitizer unit + adversarial tests.
//
// The sanitizer's output is injected into the page as HTML by HTMLRewriter, so
// anything that survives here reaches the document. These tests are the
// contract for what is allowed to survive.

import { describe, it, expect } from 'vitest';
import { sanitize } from '../src/lib/overlay-sanitize';
import type { EditableRegion } from '../src/lib/editable-regions';

const textRegion: EditableRegion = {
  key: 'test.text', label: 'Test text', kind: 'text', maxLength: 40, route: '/',
};
const richRegion: EditableRegion = {
  key: 'test.rich', label: 'Test rich', kind: 'richInline', maxLength: 200, route: '/',
};

describe('sanitize: plain text regions', () => {
  it('accepts ordinary copy', () => {
    const r = sanitize('Coaching without losing your mind', textRegion);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('Coaching without losing your mind');
  });

  it('collapses whitespace and trims', () => {
    const r = sanitize('  too   many    spaces  ', textRegion);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('too many spaces');
  });

  it('rejects any markup rather than silently stripping it', () => {
    const r = sanitize('Hello <strong>world</strong>', textRegion);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('markup_not_allowed');
  });

  it('escapes bare angle brackets that are not tags', () => {
    const r = sanitize('5 > 3 & 2 < 4', textRegion);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('5 &gt; 3 &amp; 2 &lt; 4');
  });

  it('rejects an empty or whitespace-only value', () => {
    expect(sanitize('   ', textRegion).ok).toBe(false);
    expect(sanitize('', textRegion).ok).toBe(false);
  });

  it('enforces maxLength after escaping', () => {
    const r = sanitize('x'.repeat(41), textRegion);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('too_long');
  });

  it('rejects control characters', () => {
    const r = sanitize('hello\u0000world', textRegion);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe('control_characters');
  });
});

describe('sanitize: rich inline regions', () => {
  it('passes through the three allowed tags', () => {
    const r = sanitize('A <strong>bold</strong> and <em>italic</em> line', richRegion);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe('A <strong>bold</strong> and <em>italic</em> line');
  });

  it('allows a relative link', () => {
    const r = sanitize('Read the <a href="/guides">guides</a>', richRegion);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toContain('<a href="/guides">');
  });

  it('adds rel and target to external https links', () => {
    const r = sanitize('See <a href="https://example.com/x">this</a>', richRegion);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toContain('rel="noopener noreferrer"');
      expect(r.value).toContain('target="_blank"');
    }
  });

  it('rejects unbalanced tags instead of quietly fixing them', () => {
    expect(sanitize('<strong>unclosed', richRegion).ok).toBe(false);
    expect(sanitize('mismatched <strong>x</em>', richRegion).ok).toBe(false);
  });
});

describe('sanitize: adversarial input', () => {
  const attacks: Array<[string, string]> = [
    ['script tag',            '<script>alert(1)</script>'],
    ['img onerror',           '<img src=x onerror=alert(1)>'],
    ['svg onload',            '<svg onload=alert(1)>'],
    ['iframe',                '<iframe src="https://evil.example"></iframe>'],
    ['style tag',             '<style>body{display:none}</style>'],
    ['event handler on em',   '<em onmouseover="alert(1)">hi</em>'],
    ['strong with attribute', '<strong class="x">hi</strong>'],
    ['anchor with onclick',   '<a href="/x" onclick="alert(1)">hi</a>'],
    ['form injection',        '<form action="https://evil.example"><input></form>'],
    ['object tag',            '<object data="x"></object>'],
    ['meta refresh',          '<meta http-equiv="refresh" content="0">'],
    ['base tag',              '<base href="https://evil.example">'],
  ];

  for (const [name, payload] of attacks) {
    it(`rejects ${name}`, () => {
      const r = sanitize(payload, richRegion);
      expect(r.ok, `${name} should be rejected`).toBe(false);
    });
  }

  const badUrls: Array<[string, string]> = [
    ['javascript: scheme',      '<a href="javascript:alert(1)">x</a>'],
    ['data: scheme',            '<a href="data:text/html,<script>alert(1)</script>">x</a>'],
    ['vbscript: scheme',        '<a href="vbscript:msgbox(1)">x</a>'],
    ['protocol-relative',       '<a href="//evil.example">x</a>'],
    ['plain http',              '<a href="http://insecure.example">x</a>'],
    ['backslash path trick',    '<a href="/\\evil.example">x</a>'],
  ];

  for (const [name, payload] of badUrls) {
    it(`rejects ${name}`, () => {
      const r = sanitize(payload, richRegion);
      expect(r.ok, `${name} should be rejected`).toBe(false);
      if (!r.ok) expect(['unsafe_url', 'disallowed_attribute']).toContain(r.code);
    });
  }

  it('never returns an unescaped angle bracket outside an allowed tag', () => {
    const r = sanitize('safe <strong>text</strong> with 3 < 5', richRegion);
    expect(r.ok).toBe(true);
    if (r.ok) {
      const withoutAllowed = r.value.replace(/<\/?(?:strong|em)>|<a href="[^"]*"(?: rel="[^"]*" target="_blank")?>|<\/a>/g, '');
      expect(withoutAllowed).not.toMatch(/[<>]/);
    }
  });

  it('never leaks the raw input back in an error message', () => {
    const secret = 'CANARY_TOKEN_9f3a';
    const r = sanitize(`<script>${secret}</script>`, richRegion);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.message).not.toContain(secret);
  });
});
