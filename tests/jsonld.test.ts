import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from '../src/lib/jsonld';

describe('serializeJsonLd', () => {
  it('escapes a script-breakout payload so it cannot close the tag', () => {
    const out = serializeJsonLd({ name: '</script><img src=x>' });
    expect(out).toContain('\\u003c/script');
    expect(out).not.toContain('</script>');
  });

  it('still round-trips through JSON.parse to the original value', () => {
    const input = { name: '</script><img src=x>', ok: true, n: 1 };
    const out = serializeJsonLd(input);
    expect(JSON.parse(out)).toEqual(input);
  });

  it('escapes ampersands and line/paragraph separators', () => {
    const separators = String.fromCharCode(0x2028) + String.fromCharCode(0x2029);
    const out = serializeJsonLd({ text: 'Tom & Jerry' + separators });
    expect(out).toContain('\\u0026');
    expect(out).toContain('\\u2028');
    expect(out).toContain('\\u2029');
    expect(out).not.toContain(String.fromCharCode(0x26));
    expect(out).not.toContain(separators);
  });
});
