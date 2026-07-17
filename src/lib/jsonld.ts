// Safe serializer for values dropped into <script type="application/ld+json">
// or <script type="application/json"> via set:html.
//
// JSON.stringify does not escape '<', so a string value containing
// '</script>' (e.g. a camp name or description that reached us through an
// unauthenticated public submission and was later approved by an admin)
// breaks out of the script tag and injects arbitrary HTML. The Unicode
// escapes below are invisible to JSON.parse but make that break-out
// impossible; '&' is escaped because it is unsafe in an inline <script>,
// and U+2028/U+2029 (line/paragraph separator) are escaped because they
// are valid inside a JSON string but are illegal, unescaped, inside a JS
// string literal -- some JSON-LD consumers parse the payload as JS, not JSON.
//
// Any place that renders JSON.stringify(...) inside set:html should use
// serializeJsonLd() instead.
export function serializeJsonLd(data: unknown): string {
  if (data === undefined || data === null) {
    throw new Error(`serializeJsonLd received ${String(data)}; guard the call site, e.g. {schema && <script ... set:html={serializeJsonLd(schema)} />}`);
  }
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
    .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
}
