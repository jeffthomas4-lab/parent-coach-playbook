import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { detect, validateDefinitions, type CompetitorDefinition, type PageInput } from '../src/lib/intel/fingerprints';
import { COMPETITOR_DEFINITIONS, getDefinition } from '../src/lib/intel/competitors';

const fixturesDir = path.resolve(import.meta.dirname, 'fixtures/intel');
const loadFixture = (name: string): string => readFileSync(path.join(fixturesDir, name), 'utf8');

const sportsGravy = getDefinition('sportsgravy');
if (!sportsGravy) throw new Error('sportsgravy definition missing from COMPETITOR_DEFINITIONS');

describe('validateDefinitions(COMPETITOR_DEFINITIONS)', () => {
  it('is empty — the shipped registry is structurally valid', () => {
    expect(validateDefinitions(COMPETITOR_DEFINITIONS)).toEqual([]);
  });
});

describe('detect() against the SportsGravy definition', () => {
  it('scores a clear SportsGravy customer page with high confidence', () => {
    const page: PageInput = {
      url: 'https://cascadeyouthsoccer.org/',
      html: loadFixture('sportsgravy-customer.html'),
    };
    const results = detect(page, [sportsGravy]);
    expect(results).toHaveLength(1);
    const [result] = results;
    expect(result.competitorId).toBe('sportsgravy');
    expect(result.category).toBe('club_management');
    expect(result.confidence).toBeGreaterThanOrEqual(80);
    expect(result.suppressedBy).toEqual([]);

    const patternIds = result.signals.map((signal) => signal.patternId).sort();
    expect(patternIds).toContain('sportsgravy.link.app-portal');
    expect(patternIds).toContain('sportsgravy.link.appstore-ios');
    expect(patternIds).toContain('sportsgravy.link.playstore-android');
    expect(patternIds).toContain('sportsgravy.html.powered-by');
  });

  it('suppresses a page that only mentions SportsGravy inside a comparison article', () => {
    const page: PageInput = {
      url: 'https://clubsoftwareblog.example/posts/sportsgravy-review',
      html: loadFixture('sportsgravy-article-mention.html'),
    };
    const results = detect(page, [sportsGravy]);
    expect(results.find((result) => result.competitorId === 'sportsgravy')).toBeUndefined();
  });

  it('returns an empty array for a page running nothing relevant', () => {
    const page: PageInput = {
      url: 'https://riversidebakery.example/',
      html: loadFixture('no-match.html'),
    };
    expect(detect(page, COMPETITOR_DEFINITIONS)).toEqual([]);
  });

  it('counts a pattern firing ten times as a single signal', () => {
    const page: PageInput = {
      url: 'https://northgateyouthbasketball.example/',
      html: loadFixture('repeated-pattern.html'),
    };
    const results = detect(page, [sportsGravy]);
    const [result] = results;
    const portalSignals = result.signals.filter((signal) => signal.patternId === 'sportsgravy.link.app-portal');
    expect(portalSignals).toHaveLength(1);
    expect(portalSignals[0].weight).toBe(45);
  });

  it('does not throw on malformed or truncated HTML', () => {
    const page: PageInput = {
      url: 'https://cascaderec.example/',
      html: loadFixture('malformed.html'),
    };
    expect(() => detect(page, COMPETITOR_DEFINITIONS)).not.toThrow();
    const results = detect(page, COMPETITOR_DEFINITIONS);
    expect(Array.isArray(results)).toBe(true);
  });

  it('does not throw on an empty or garbage page', () => {
    expect(() => detect({ url: '', html: '' }, COMPETITOR_DEFINITIONS)).not.toThrow();
    expect(() => detect({ url: 'not a url at all', html: '<<<>>>not html<<<' }, COMPETITOR_DEFINITIONS)).not.toThrow();
  });
});

describe('header signal matching', () => {
  const headerDefinition: CompetitorDefinition = {
    id: 'test-header-competitor',
    displayName: 'Test Header Co',
    canonicalDomain: 'test-header.example',
    category: 'club_management',
    migrationDifficulty: 'low',
    patterns: [
      {
        id: 'test-header.pattern.powered-by',
        type: 'header',
        category: 'club_management',
        match: { kind: 'substring', value: 'x-powered-by: express' },
        weight: 50,
      },
    ],
  };

  it('is case-insensitive on the header key', () => {
    const withMixedCaseKey: PageInput = {
      url: 'https://example.org/',
      html: '<html></html>',
      headers: { 'X-Powered-By': 'Express' },
    };
    const withLowerCaseKey: PageInput = {
      url: 'https://example.org/',
      html: '<html></html>',
      headers: { 'x-powered-by': 'EXPRESS' },
    };

    const resultsMixed = detect(withMixedCaseKey, [headerDefinition]);
    const resultsLower = detect(withLowerCaseKey, [headerDefinition]);
    expect(resultsMixed).toHaveLength(1);
    expect(resultsLower).toHaveLength(1);
    expect(resultsMixed[0].confidence).toBe(50);
  });

  it('does not match when the header is absent', () => {
    const page: PageInput = { url: 'https://example.org/', html: '<html></html>', headers: { Server: 'nginx' } };
    expect(detect(page, [headerDefinition])).toEqual([]);
  });
});

describe('matchedValue formatting', () => {
  it('never exceeds 500 characters, even given a very long attribute value', () => {
    const longSuffix = 'A'.repeat(2000);
    const html = `<html><body><a href="https://example.com/reg?ref=BIGVALUE${longSuffix}">Register</a></body></html>`;
    const truncationDefinition: CompetitorDefinition = {
      id: 'test-truncation-competitor',
      displayName: 'Test Truncation Co',
      canonicalDomain: 'test-truncation.example',
      category: 'registration',
      migrationDifficulty: 'low',
      patterns: [
        {
          id: 'test-truncation.pattern.ref',
          type: 'link_href',
          category: 'registration',
          match: { kind: 'regex', value: 'BIGVALUE[\\s\\S]*' },
          weight: 50,
        },
      ],
    };

    const results = detect({ url: 'https://someclub.example/', html }, [truncationDefinition]);
    expect(results).toHaveLength(1);
    const [signal] = results[0].signals;
    expect(signal.matchedValue.length).toBeLessThanOrEqual(500);
    expect(signal.matchedValue.length).toBe(500);
  });

  it('collapses runs of whitespace to a single space', () => {
    const html = `<html><body><div>\n    Register      now    with\n    SportsGravy\n</div></body></html>`;
    const whitespaceDefinition: CompetitorDefinition = {
      id: 'test-whitespace-competitor',
      displayName: 'Test Whitespace Co',
      canonicalDomain: 'test-whitespace.example',
      category: 'website',
      migrationDifficulty: 'low',
      patterns: [
        {
          id: 'test-whitespace.pattern.phrase',
          type: 'html_text',
          category: 'website',
          match: { kind: 'regex', value: 'Register[\\s\\S]*?SportsGravy' },
          weight: 50,
        },
      ],
    };

    const results = detect({ url: 'https://someclub.example/', html }, [whitespaceDefinition]);
    expect(results).toHaveLength(1);
    const [signal] = results[0].signals;
    expect(signal.matchedValue).toBe('Register now with SportsGravy');
    expect(/\s{2,}/.test(signal.matchedValue)).toBe(false);
  });
});

describe('validateDefinitions() on a bad ad hoc definition', () => {
  const badDefinition: CompetitorDefinition = {
    id: 'test-bad-definition',
    displayName: 'Test Bad Definition Co',
    canonicalDomain: 'test-bad.example',
    category: 'website',
    migrationDifficulty: 'low',
    patterns: [
      {
        id: 'test-bad-definition.pattern.broken-regex',
        type: 'html_text',
        category: 'website',
        match: { kind: 'regex', value: '(unclosed' },
        weight: 50,
      },
    ],
  };

  it('reports an invalid regex instead of throwing', () => {
    const problems = validateDefinitions([badDefinition]);
    expect(problems.some((problem) => problem.includes('test-bad-definition.pattern.broken-regex'))).toBe(true);
    expect(problems.some((problem) => problem.toLowerCase().includes('invalid regex'))).toBe(true);
  });

  it('detect() skips the invalid pattern instead of throwing', () => {
    const page: PageInput = { url: 'https://example.org/', html: '<html><body>nothing relevant</body></html>' };
    expect(() => detect(page, [badDefinition])).not.toThrow();
    expect(detect(page, [badDefinition])).toEqual([]);
  });

  it('rejects a regex with a nested unbounded quantifier (catastrophic backtracking risk)', () => {
    const redosDefinition: CompetitorDefinition = {
      ...badDefinition,
      id: 'test-redos-definition',
      patterns: [
        {
          id: 'test-redos-definition.pattern.nested-quantifier',
          type: 'html_text',
          category: 'website',
          match: { kind: 'regex', value: '(a+)+$' },
          weight: 50,
        },
      ],
    };
    const problems = validateDefinitions([redosDefinition]);
    expect(problems.some((problem) => problem.includes('test-redos-definition.pattern.nested-quantifier'))).toBe(true);
  });
});
