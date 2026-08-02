#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_REPORT = 'reports/editorial/article-refresh-100.json';

const BANNED_TERMS = [
  'delve', 'tapestry', 'leverage', 'robust', 'seamless', 'pivotal',
  'navigate', 'embark', 'unlock', 'unveil', 'foster', 'cultivate', 'elevate',
  'empower', 'transform', 'showcase', 'underscore', 'emphasize', 'facilitate',
  'utilize', 'harness', 'spearhead', 'champion', 'amplify', 'streamline', 'curate',
  'comprehensive', 'nuanced', 'multifaceted', 'intricate', 'sophisticated',
  'holistic', 'dynamic', 'vibrant', 'compelling', 'meaningful', 'impactful',
  'transformative', 'game-changing', 'groundbreaking', 'cutting-edge',
  'ever-evolving', 'ever-changing', 'rapidly-evolving', 'fast-paced', 'bespoke',
  'curated', 'myriad', 'profound', 'essential', 'crucial', 'vital', 'realm',
  'landscape', 'journey', 'ecosystem', 'synergy', 'paradigm', 'plethora',
  'testament', 'cornerstone', 'bedrock', 'linchpin', 'moreover', 'furthermore',
  'additionally', 'consequently', 'notably', 'importantly', 'indeed',
  'ultimately', 'essentially',
];

const BANNED_PATTERNS = [
  ['ai_phrase', /\b(?:delve into|dive deep|deep dive|at the end of the day|it(?:'|â€™)s worth noting|it(?:'|â€™)s important to note|it(?:'|â€™)s worth mentioning|when it comes to|in the realm of|at the heart of|at its core|the crux of|speaks volumes|in today(?:'|â€™)s world|in an ever-changing landscape|paint a picture|a true testament|a world where)\b/i],
  ['reframe_pattern', /\bthis (?:isn(?:'|â€™)t|is not) just\b[^.!?]{0,160}\b(?:it(?:'|â€™)s|it is)\b/i],
  ['not_only_pattern', /\bnot only\b[^.!?]{0,160}\bbut also\b/i],
  ['concession_pattern', /\bwhile\b[^.!?]{0,160},\s*(?:it(?:'|â€™)s|it is) also true that\b/i],
  ['throat_clearing', /\b(?:let me explain|here(?:'|â€™)s the thing|to put it another way)\b/i],
  ['empowerment_close', /\b(?:you(?:'|â€™)ve got this|now go make it happen|trust the process|go make it count|the future is yours)\b/i],
  ['summary_close', /\b(?:in summary|the takeaway is|so what does this mean)\b/i],
];

const MOJIBAKE = /\uFFFD|Ã.|Â(?=\s|\p{P}|\p{S})|â(?:€|€™|€œ|€�|€“|€”|€¦|†|‡)/u;
const TEMPLATE_PATTERNS = [
  ['manual_table_of_contents', /^##\s+Table of Contents\s*$/im],
  ['key_takeaways_template', /^##\s+Key Takeaways\s*$/im],
  ['pro_tip_template', /\*\*\s*Pro Tip:\s*\*\*/i],
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function issue(code, message, line = null) {
  return { code, message, ...(line === null ? {} : { line }) };
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

export function parseArticleMarkdown(markdown, source = '<article>') {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
  if (!match) throw new Error(`${source}: missing frontmatter`);
  const frontmatter = match[1];

  const scalar = (field) => {
    const first = new RegExp(`^[ \\t]*${escapeRegExp(field)}:[ \\t]*(.*)$`, 'm').exec(frontmatter);
    if (!first) return null;
    const after = frontmatter.slice(first.index + first[0].length).split(/\r?\n/).slice(1);
    const continuation = [];
    for (const line of after) {
      if (line.trim() === '') {
        if (continuation.length) continuation.push('');
        continue;
      }
      if (/^[ \t]+\S/.test(line)) continuation.push(line.trim());
      else break;
    }
    let value = first[1].trim();
    if (/^[|>][-+]?$/.test(value)) value = continuation.join(' ');
    else if (continuation.length) value = [value, ...continuation].join(' ');
    value = value.replace(/\s+/g, ' ').trim();
    if (value.length > 1 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }
    return value;
  };

  return {
    frontmatter,
    body: markdown.slice(match[0].length),
    scalar,
  };
}

export function countWords(text) {
  const withoutUrls = text.replace(/https?:\/\/\S+/g, ' ');
  return (withoutUrls.match(/[\p{L}\p{N}][\p{L}\p{N}'â€™-]*/gu) ?? []).length;
}

function stripFencedCode(body) {
  return body.replace(/^(```|~~~)[^\n]*\r?\n[\s\S]*?^\1\s*$/gm, '');
}

function proseParagraphs(body) {
  return stripFencedCode(body)
    .split(/(?:\r?\n){2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => {
      const lines = block.split(/\r?\n/);
      return !lines.some((line) => /^(?:#{1,6}\s|\s*(?:[-*+] |\d+[.)] )|\s*>|\s*\||\s*<|\s*!\[|\s*(?:---+|\*\*\*+)\s*$)/.test(line));
    });
}

export function countSentences(paragraph) {
  const plain = paragraph
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\b(?:Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs)\./gi, (match) => match.slice(0, -1))
    .replace(/\b(?:[A-Z]\.){2,}/g, (match) => match.replaceAll('.', ''));
  return [...new Intl.Segmenter('en', { granularity: 'sentence' }).segment(plain)]
    .filter(({ segment }) => /[\p{L}\p{N}]/u.test(segment))
    .length;
}

function scanInternalLinks(body) {
  const errors = [];
  const clean = stripFencedCode(body);
  const linkPattern = /!?\[([^\]\n]+)\]\(([^)\n]+)\)/g;
  let match;
  const spans = [];
  while ((match = linkPattern.exec(clean))) {
    spans.push([match.index, linkPattern.lastIndex]);
    const target = match[2].trim();
    if (!target.startsWith('/')) continue;
    if (target.startsWith('//') || /[\\<>"'\s]/.test(target)) {
      errors.push(issue('invalid_internal_link', `invalid internal Markdown target: ${target}`, lineOf(clean, match.index)));
    }
  }
  let unmatched = clean;
  for (const [start, end] of spans.reverse()) unmatched = `${unmatched.slice(0, start)}${' '.repeat(end - start)}${unmatched.slice(end)}`;
  const malformed = unmatched.search(/\]\(/);
  if (malformed >= 0) errors.push(issue('malformed_markdown_link', 'malformed Markdown link', lineOf(clean, malformed)));
  return errors;
}

function selectedText(parsed) {
  return [parsed.scalar('title'), parsed.scalar('seoTitle'), parsed.scalar('seoDescription'), parsed.scalar('dek'), parsed.scalar('bluf'), parsed.body]
    .filter(Boolean)
    .join('\n');
}

export function validateArticleContent(markdown, source = '<article>') {
  const errors = [];
  const warnings = [];
  let parsed;
  try {
    parsed = parseArticleMarkdown(markdown, source);
  } catch (error) {
    return { source, ok: false, errors: [issue('frontmatter', error.message)], warnings, metrics: null };
  }

  const body = parsed.body;
  const reviewedText = selectedText(parsed);
  const words = countWords(body.replace(/<[^>]+>/g, ' '));
  const h2Count = (body.match(/^##\s+/gm) ?? []).length;
  const format = parsed.scalar('format') ?? 'note';

  const directChecks = [
    ['provider_promotion', /article\s+generated\s+by\s+(?:\[[^\]]*\]\([^)]*\)|BabyLoveGrowth)/i, 'provider generation credit is not allowed'],
    ['robots_directive', /\b(?:noindex|nofollow)\b/i, 'public article content cannot contain noindex or nofollow'],
    ['mojibake', MOJIBAKE, 'mojibake or a replacement character is present'],
    ['body_h1', /^#\s+/m, 'the layout owns the H1; remove the body H1'],
    ['em_dash', /\u2014/, 'em dashes are not allowed'],
    ['smart_quotes', /[\u2018\u2019\u201C\u201D]/, 'use straight quotes and apostrophes in refreshed article text'],
  ];
  for (const [code, pattern, message] of directChecks) {
    const match = pattern.exec(reviewedText);
    if (match) errors.push(issue(code, message, lineOf(reviewedText, match.index)));
  }
  for (const [code, pattern] of TEMPLATE_PATTERNS) {
    const match = pattern.exec(body);
    if (match) errors.push(issue(code, 'provider-shaped article template is not allowed', lineOf(body, match.index)));
  }

  for (const term of BANNED_TERMS) {
    const pattern = new RegExp(`\\b${escapeRegExp(term).replaceAll('\\-', '[-â€‘]')}\\b`, 'i');
    const match = pattern.exec(reviewedText);
    if (match) errors.push(issue('banned_ai_term', `banned AI-writing term: ${match[0]}`, lineOf(reviewedText, match.index)));
  }
  for (const [code, pattern] of BANNED_PATTERNS) {
    const match = pattern.exec(reviewedText);
    if (match) errors.push(issue(code, `banned AI-writing pattern: ${match[0]}`, lineOf(reviewedText, match.index)));
  }

  for (const paragraph of proseParagraphs(body)) {
    const sentences = countSentences(paragraph);
    if (sentences > 3) {
      const index = body.indexOf(paragraph);
      errors.push(issue('paragraph_length', `prose paragraph has ${sentences} sentences; maximum is 3`, lineOf(body, Math.max(0, index))));
    }
  }

  const bluf = parsed.scalar('bluf');
  if (bluf !== null) {
    const blufWords = countWords(bluf);
    if (blufWords < 30 || blufWords > 50) errors.push(issue('bluf_word_count', `BLUF has ${blufWords} words; expected 30-50`));
    if (bluf.length < 80 || bluf.length > 500) errors.push(issue('bluf_character_count', `BLUF has ${bluf.length} characters; expected 80-500`));
  }

  errors.push(...scanInternalLinks(body));

  const affiliateLinks = (body.match(/(?:\]\(|href=["'])\/go\//g) ?? []).length;
  const disclosure = parsed.scalar('affiliateDisclosurePresent');
  if (affiliateLinks > 0 && disclosure !== 'true') {
    errors.push(issue('affiliate_disclosure_missing', `${affiliateLinks} affiliate link(s) require editorial.affiliateDisclosurePresent: true`));
  } else if (affiliateLinks === 0 && disclosure === 'true') {
    errors.push(issue('affiliate_disclosure_stale', 'affiliateDisclosurePresent is true but the article has no /go/ link'));
  }

  if (format === 'note') {
    if (words < 250 || words > 500) warnings.push(issue('word_band', `note has ${words} words; target is 250-500`));
    if (h2Count > 3) warnings.push(issue('heading_band', `note has ${h2Count} H2s; target is 0-3`));
  } else {
    if (words < 600 || words > 1600) warnings.push(issue('word_band', `essay has ${words} words; target is 600-1600`));
    const expected = words <= 900 ? [2, 4] : words <= 1400 ? [4, 8] : [4, 10];
    if (h2Count < expected[0] || h2Count > expected[1]) {
      warnings.push(issue('heading_band', `essay has ${h2Count} H2s at ${words} words; target is ${expected[0]}-${expected[1]}`));
    }
  }
  if (h2Count > 10) errors.push(issue('heading_cap', `article has ${h2Count} H2s; maximum is 10`));

  return {
    source,
    ok: errors.length === 0,
    errors,
    warnings,
    metrics: { words, h2_count: h2Count, format, affiliate_links: affiliateLinks },
  };
}

/**
 * @typedef {object} TargetOptions
 * @property {string} [root]
 * @property {string} [reportPath]
 * @property {number | null} [batch]
 * @property {boolean} [all]
 * @property {string[]} [files]
 */

/** @param {TargetOptions} [options] */
export async function resolveTargetFiles({ root = process.cwd(), reportPath = DEFAULT_REPORT, batch = null, all = false, files = [] } = {}) {
  if ((batch !== null && files.length) || (all && (batch !== null || files.length))) {
    throw new Error('use exactly one of --all, --batch, or explicit files');
  }
  let targets = files;
  if (batch !== null || all) {
    if (batch !== null && (!Number.isInteger(batch) || batch < 1)) throw new Error('--batch must be a positive integer');
    const reportFile = resolve(root, reportPath);
    const report = JSON.parse(await readFile(reportFile, 'utf8'));
    if (all) {
      targets = report.batches?.flatMap((entry) => entry.items?.map((item) => item.source) ?? []) ?? [];
      if (!targets.length) throw new Error(`${reportPath} contains no article sources`);
    } else {
      const found = report.batches?.find((entry) => entry.batch === batch);
      if (!found) throw new Error(`batch ${batch} is not present in ${reportPath}`);
      targets = found.items?.map((item) => item.source) ?? [];
      if (!targets.length) throw new Error(`batch ${batch} contains no article sources`);
    }
  }
  if (!targets.length) throw new Error('provide --all, --batch N, or at least one article file');

  return targets.map((file) => {
    const absolute = isAbsolute(file) ? resolve(file) : resolve(root, file);
    const rel = relative(resolve(root), absolute);
    if (rel.startsWith('..') || isAbsolute(rel)) throw new Error(`${file}: target is outside the repository`);
    if (!/\.md$/i.test(absolute)) throw new Error(`${file}: expected a Markdown article`);
    return absolute;
  });
}

/** @param {TargetOptions} [options] */
export async function checkArticleFiles(options = {}) {
  const root = options.root ?? process.cwd();
  const targets = await resolveTargetFiles({ ...options, root });
  return Promise.all(targets.map(async (file) => {
    const markdown = await readFile(file, 'utf8');
    return validateArticleContent(markdown, relative(resolve(root), file).replaceAll('\\', '/'));
  }));
}

async function main() {
  const args = process.argv.slice(2);
  const batchIndex = args.indexOf('--batch');
  const reportIndex = args.indexOf('--report');
  const batch = batchIndex >= 0 ? Number(args[batchIndex + 1]) : null;
  const all = args.includes('--all');
  const reportPath = reportIndex >= 0 ? args[reportIndex + 1] : DEFAULT_REPORT;
  const consumed = new Set();
  if (batchIndex >= 0) {
    consumed.add(batchIndex);
    consumed.add(batchIndex + 1);
  }
  if (reportIndex >= 0) {
    consumed.add(reportIndex);
    consumed.add(reportIndex + 1);
  }
  const files = args.filter((arg, index) => !consumed.has(index) && !arg.startsWith('--'));
  const results = await checkArticleFiles({ batch, all, reportPath, files });
  let errorCount = 0;
  let warningCount = 0;
  for (const result of results) {
    console.log(`${result.ok ? 'PASS' : 'FAIL'} ${result.source} (${result.metrics.words} words, ${result.metrics.h2_count} H2)`);
    for (const error of result.errors) console.error(`  ERROR ${error.code}${error.line ? ` line ${error.line}` : ''}: ${error.message}`);
    for (const warning of result.warnings) console.warn(`  WARN  ${warning.code}: ${warning.message}`);
    errorCount += result.errors.length;
    warningCount += result.warnings.length;
  }
  console.log(`Article refresh content check: ${results.length} file(s), ${errorCount} error(s), ${warningCount} warning(s).`);
  if (errorCount) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
