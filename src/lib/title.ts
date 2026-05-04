// Single-asterisk italics in titles is the brand's display rule:
//   "What you say in the *first 90 seconds* shapes the next week"
// becomes "What you say in the first 90 seconds shapes the next week" with
// "first 90 seconds" rendered as italic.
//
// Any place that renders a title in HTML should use renderTitle() with set:html.
// Any place that needs plain text (the <title> tag, og:title, JSON-LD,
// search-index strings) should use stripTitle() to remove the asterisks
// without producing markup.

const STAR_RE = /\*([^*]+)\*/g;

// Returns HTML with *word* replaced by <em>word</em>. Use with set:html.
export function renderTitle(t: string): string {
  if (!t) return '';
  return t.replace(STAR_RE, '<em>$1</em>');
}

// Returns plain text with the asterisks stripped. Use in head, og tags, JSON-LD.
export function stripTitle(t: string): string {
  if (!t) return '';
  return t.replace(STAR_RE, '$1');
}
