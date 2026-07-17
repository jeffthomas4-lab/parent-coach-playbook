import { describe, expect, it } from 'vitest';
import { renderTitle, stripTitle } from '../src/lib/title';

describe('title rendering', () => {
  it('returns an empty string for empty display and metadata titles', () => {
    expect(renderTitle('')).toBe('');
    expect(stripTitle('')).toBe('');
  });

  it('adds only the supported emphasis markup', () => {
    expect(renderTitle('The *first minute* matters')).toBe('The <em>first minute</em> matters');
  });

  it('escapes HTML before adding emphasis', () => {
    expect(renderTitle('<img src=x onerror=alert(1)> *safe & sound*')).toBe(
      '&lt;img src=x onerror=alert(1)&gt; <em>safe &amp; sound</em>',
    );
  });

  it('keeps plain-text title output free of formatting markup', () => {
    expect(stripTitle('The *first minute* matters')).toBe('The first minute matters');
  });
});
