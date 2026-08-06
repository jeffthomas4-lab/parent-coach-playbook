// Tech-stack fingerprint engine: given the HTML and headers of a youth sports
// organization's public homepage, decide which competitor club-management
// platform (SportsGravy, and later TeamSnap, SportsEngine, LeagueApps, etc.)
// that organization runs.
//
// Fully data driven: every competitor is a CompetitorDefinition (a plain
// array of FingerprintPattern) under src/lib/intel/competitors/. Adding a
// new competitor is a new definition file, not new logic in here.
//
// Zero external dependencies, no DOM parser (Workers runtime has none in the
// stdlib worth trusting on arbitrary third-party HTML), and written so a
// malformed or hostile page can never throw — every extraction step is a
// bounded regex scan over a string.
//
// NOTE ON TYPES: this file intentionally defines its own SignalType /
// StackCategory rather than importing them from ./types — that file is
// owned by a different, concurrent change (the D1 schema layer) and is not
// wired to this one yet. The literal unions below are kept in sync by hand
// until that reconciliation happens.

export type SignalType =
  | 'script_src'
  | 'link_href'
  | 'html_text'
  | 'meta'
  | 'url_pattern'
  | 'header'
  | 'dns_cname'
  | 'manual';

export type StackCategory =
  | 'club_management'
  | 'registration'
  | 'website'
  | 'payments'
  | 'streaming'
  | 'communications';

const KNOWN_CATEGORIES: readonly StackCategory[] = [
  'club_management',
  'registration',
  'website',
  'payments',
  'streaming',
  'communications',
];

/**
 * Signal types that this engine can actually evaluate against a PageInput.
 * 'dns_cname' and 'manual' describe evidence this module has no data source
 * for (a real DNS lookup, or a human-asserted fact) — patterns of those
 * types validate structurally like any other, but never fire out of
 * detect(). They exist so a future crawler step (real CNAME resolution) or
 * an analyst's manual confirmation can be represented in the same
 * CompetitorDefinition shape without a schema change.
 */
const AUTO_MATCHABLE_TYPES: readonly SignalType[] = ['script_src', 'link_href', 'html_text', 'meta', 'url_pattern', 'header'];

export interface FingerprintPattern {
  id: string; // stable and unique across all definitions, e.g. 'sportsgravy.script.app-bundle'
  type: SignalType;
  category: StackCategory;
  match: { kind: 'substring' | 'regex'; value: string; flags?: string };
  weight: number; // 1-100, how much this single hit is worth
  note?: string; // why this pattern indicates the competitor
}

export interface CompetitorDefinition {
  id: string;
  displayName: string;
  canonicalDomain: string;
  category: StackCategory; // primary category this platform occupies
  migrationDifficulty: 'low' | 'medium' | 'high';
  patterns: FingerprintPattern[];
  negativePatterns?: FingerprintPattern[]; // hits here subtract weight, suppressing false positives
}

export interface PageInput {
  url: string;
  finalUrl?: string;
  html: string;
  headers?: Record<string, string>;
}

export interface DetectionSignal {
  competitorId: string;
  patternId: string;
  type: SignalType;
  category: StackCategory;
  weight: number;
  matchedValue: string; // truncated to 500 chars, whitespace collapsed
  sourceUrl: string;
}

export interface DetectionResult {
  competitorId: string;
  category: StackCategory;
  confidence: number; // 0-100 integer
  signals: DetectionSignal[];
  suppressedBy: string[]; // patternIds of negative matches that fired
}

const MAX_MATCHED_VALUE_LENGTH = 500;
const MAX_REGEX_SOURCE_LENGTH = 200;

/**
 * Crude, deliberately conservative ReDoS heuristic: flags a quantified group
 * that itself contains a quantifier — the classic catastrophic-backtracking
 * shape, e.g. (a+)+, (a*)*, ([^)]+)*, (\d+){2,}. This is not an exhaustive
 * backtracking analyzer (it won't catch every pathological pattern, and it
 * can false-positive on a handful of safe patterns), but it is cheap, has no
 * dependency, and blocks the shapes that actually blow up on adversarial
 * input. Definitions are hand-written by us, not user-submitted, so a
 * false-positive here just means rewriting the pattern.
 */
function hasCatastrophicBacktrackingRisk(source: string): boolean {
  return /\([^()]*[+*][^()]*\)[+*]|\([^()]*[+*][^()]*\)\{\d*,\d*\}/.test(source);
}

interface CompiledPattern {
  regex: RegExp | null;
  error: string | null;
}

/**
 * Compiles a pattern's regex defensively. Substring patterns never need a
 * RegExp and always return { regex: null, error: null }. Any failure here
 * (bad syntax, source too long, backtracking risk) is reported as `error`
 * rather than thrown, so both detect() and validateDefinitions() can skip
 * or report the pattern instead of crashing.
 */
function compilePattern(pattern: FingerprintPattern): CompiledPattern {
  if (pattern.match.kind !== 'regex') return { regex: null, error: null };
  const source = pattern.match.value ?? '';
  if (source.length === 0) return { regex: null, error: 'empty regex source' };
  if (source.length > MAX_REGEX_SOURCE_LENGTH) {
    return { regex: null, error: `regex source exceeds ${MAX_REGEX_SOURCE_LENGTH} chars` };
  }
  if (hasCatastrophicBacktrackingRisk(source)) {
    return { regex: null, error: 'regex rejected: possible catastrophic backtracking (nested unbounded quantifier)' };
  }
  try {
    return { regex: new RegExp(source, pattern.match.flags), error: null };
  } catch (err) {
    return { regex: null, error: `invalid regex: ${(err as Error).message}` };
  }
}

/** Collapses whitespace runs to a single space and truncates to 500 chars. */
function formatMatchedValue(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, MAX_MATCHED_VALUE_LENGTH);
}

/**
 * Extracts every value of `attr` found inside opening tags named `tagName`,
 * e.g. extractTagScopedAttrValues(html, 'script', 'src') pulls every
 * src="..." out of <script ...> tags only, ignoring src on <img> etc.
 * Pure regex, no DOM parser: scans for opening tags first, then hunts the
 * attribute inside just that tag's text, so a malformed document (unclosed
 * tags, stray angle brackets) degrades to "fewer matches", never a throw.
 */
function extractTagScopedAttrValues(html: string, tagName: string, attr: string): string[] {
  const tagRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  const attrRe = new RegExp(`\\b${attr}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i');
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(html)) !== null) {
    const attrMatch = attrRe.exec(match[0]);
    if (attrMatch) values.push(attrMatch[2] ?? attrMatch[3] ?? '');
    if (tagRe.lastIndex === match.index) tagRe.lastIndex += 1; // guard against zero-width match loops
  }
  return values;
}

/**
 * Extracts every value of `attr` anywhere in the document, regardless of
 * which tag it's on. Used for href: real registration/login/app-store links
 * on a club site live on <a> tags, not just <link> tags, so scoping href to
 * a single tag name would miss the signals that actually matter.
 */
function extractAttrValuesAnyTag(html: string, attr: string): string[] {
  const attrRe = new RegExp(`\\b${attr}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'gi');
  const values: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(html)) !== null) {
    values.push(match[2] ?? match[3] ?? '');
    if (attrRe.lastIndex === match.index) attrRe.lastIndex += 1;
  }
  return values;
}

/** Builds the `key: value` search space for header patterns; keys are lower-cased so matching never depends on header casing. */
function buildHeaderSpace(headers: Record<string, string> | undefined): string {
  if (!headers) return '';
  return Object.entries(headers)
    .map(([key, value]) => `${key.toLowerCase()}: ${value}`)
    .join('\n');
}

type SearchSpaces = Record<Exclude<SignalType, 'dns_cname' | 'manual'>, string>;

function buildSearchSpaces(page: PageInput): SearchSpaces {
  const html = typeof page.html === 'string' ? page.html : '';
  return {
    script_src: extractTagScopedAttrValues(html, 'script', 'src').join('\n'),
    link_href: extractAttrValuesAnyTag(html, 'href').join('\n'),
    meta: extractTagScopedAttrValues(html, 'meta', 'content').join('\n'),
    html_text: html,
    url_pattern: page.finalUrl ?? page.url ?? '',
    header: buildHeaderSpace(page.headers),
  };
}

interface TestOutcome {
  matched: boolean;
  matchedText: string;
}

/** Tests a single pattern against the pre-built search spaces. Pure, never throws. */
function testPattern(pattern: FingerprintPattern, spaces: SearchSpaces, compiled: CompiledPattern): TestOutcome {
  if (pattern.type === 'dns_cname' || pattern.type === 'manual') {
    return { matched: false, matchedText: '' };
  }
  const space = spaces[pattern.type];
  if (!space) return { matched: false, matchedText: '' };

  if (pattern.match.kind === 'substring') {
    const needle = pattern.match.value ?? '';
    if (!needle) return { matched: false, matchedText: '' };
    const idx = space.toLowerCase().indexOf(needle.toLowerCase());
    if (idx === -1) return { matched: false, matchedText: '' };
    return { matched: true, matchedText: space.slice(idx, idx + needle.length) };
  }

  if (!compiled.regex) return { matched: false, matchedText: '' };
  compiled.regex.lastIndex = 0;
  const match = compiled.regex.exec(space);
  if (!match) return { matched: false, matchedText: '' };
  return { matched: true, matchedText: match[0] };
}

/**
 * Runs every competitor definition against one page.
 *
 * - Each pattern fires at most once per page (first match wins; repeats of
 *   the same evidence don't inflate the score).
 * - Confidence is summed positive weight minus summed fired-negative
 *   weight, clamped to 0-100 and rounded.
 * - Only definitions with confidence > 0 are returned, sorted descending.
 * - Invalid patterns (bad regex, oversized source, backtracking risk) are
 *   silently skipped here — validateDefinitions() is where those get
 *   reported so a broken definition never crashes a live crawl.
 */
export function detect(page: PageInput, definitions: CompetitorDefinition[]): DetectionResult[] {
  const spaces = buildSearchSpaces(page);
  const sourceUrl = page.finalUrl ?? page.url ?? '';
  const results: DetectionResult[] = [];

  for (const definition of definitions) {
    let weight = 0;
    const signals: DetectionSignal[] = [];
    const suppressedBy: string[] = [];

    for (const pattern of definition.patterns) {
      const compiled = compilePattern(pattern);
      if (compiled.error) continue;
      const outcome = testPattern(pattern, spaces, compiled);
      if (!outcome.matched) continue;
      weight += pattern.weight;
      signals.push({
        competitorId: definition.id,
        patternId: pattern.id,
        type: pattern.type,
        category: pattern.category,
        weight: pattern.weight,
        matchedValue: formatMatchedValue(outcome.matchedText),
        sourceUrl,
      });
    }

    for (const negative of definition.negativePatterns ?? []) {
      const compiled = compilePattern(negative);
      if (compiled.error) continue;
      const outcome = testPattern(negative, spaces, compiled);
      if (!outcome.matched) continue;
      weight -= negative.weight;
      suppressedBy.push(negative.id);
    }

    const confidence = Math.round(Math.max(0, Math.min(100, weight)));
    if (confidence > 0) {
      results.push({ competitorId: definition.id, category: definition.category, confidence, signals, suppressedBy });
    }
  }

  results.sort((a, b) => b.confidence - a.confidence);
  return results;
}

/**
 * Structural validation of a set of definitions. Returns a list of
 * human-readable problems; an empty array means the set is valid. Checked:
 * pattern ids globally unique (across positive and negative patterns, and
 * across every definition), weights in 1-100, non-empty match values, valid
 * regex (per compilePattern's rules above), category is a known
 * StackCategory, and no definition's total positive weight sums below 40
 * (a definition that can never reach a usable confidence is a bug, not a
 * quiet dead entry).
 */
export function validateDefinitions(definitions: CompetitorDefinition[]): string[] {
  const problems: string[] = [];
  const seenPatternIds = new Set<string>();
  const seenDefinitionIds = new Set<string>();

  for (const definition of definitions) {
    if (!definition.id) {
      problems.push('definition with empty id');
    } else if (seenDefinitionIds.has(definition.id)) {
      problems.push(`duplicate definition id: ${definition.id}`);
    } else {
      seenDefinitionIds.add(definition.id);
    }

    if (!KNOWN_CATEGORIES.includes(definition.category)) {
      problems.push(`${definition.id}: unknown category "${definition.category}"`);
    }

    let positiveWeightSum = 0;
    const allPatterns: Array<{ pattern: FingerprintPattern; isNegative: boolean }> = [
      ...definition.patterns.map((pattern) => ({ pattern, isNegative: false })),
      ...(definition.negativePatterns ?? []).map((pattern) => ({ pattern, isNegative: true })),
    ];

    for (const { pattern, isNegative } of allPatterns) {
      if (!pattern.id) {
        problems.push(`${definition.id}: pattern with empty id`);
      } else if (seenPatternIds.has(pattern.id)) {
        problems.push(`duplicate pattern id: ${pattern.id}`);
      } else {
        seenPatternIds.add(pattern.id);
      }

      if (!Number.isInteger(pattern.weight) || pattern.weight < 1 || pattern.weight > 100) {
        problems.push(`${pattern.id}: weight ${pattern.weight} out of range 1-100`);
      }

      if (!pattern.match || !pattern.match.value || pattern.match.value.length === 0) {
        problems.push(`${pattern.id}: empty match value`);
      }

      if (!KNOWN_CATEGORIES.includes(pattern.category)) {
        problems.push(`${pattern.id}: unknown category "${pattern.category}"`);
      }

      if (!AUTO_MATCHABLE_TYPES.includes(pattern.type) && pattern.type !== 'dns_cname' && pattern.type !== 'manual') {
        problems.push(`${pattern.id}: unknown signal type "${pattern.type}"`);
      }

      if (pattern.match?.kind === 'regex') {
        const compiled = compilePattern(pattern);
        if (compiled.error) problems.push(`${pattern.id}: ${compiled.error}`);
      }

      if (!isNegative) positiveWeightSum += Number.isFinite(pattern.weight) ? pattern.weight : 0;
    }

    if (positiveWeightSum < 40) {
      problems.push(
        `${definition.id}: total positive pattern weight ${positiveWeightSum} is below 40 (can never reach a usable confidence)`,
      );
    }
  }

  return problems;
}
