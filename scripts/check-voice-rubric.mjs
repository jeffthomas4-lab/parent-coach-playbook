#!/usr/bin/env node
/**
 * check-voice-rubric.mjs
 *
 * Runs the mechanical half of VOICE-RUBRIC.md against one or more content files.
 *
 * Why this exists: Penny (pcd-review-publish) was running Sections A, B and C by
 * reading. The same three failures kept coming back round after round on the same
 * pieces (paragraph over 3 sentences, three consecutive sentences within a 5-word
 * spread, more than 3 hedge words) because a human-or-model read is not a reliable
 * way to count words. Those items are arithmetic. This script does the arithmetic
 * so review rounds are spent on judgment instead.
 *
 * Scope: only the deterministic items. Section A items 3, 4, 5, 8 and 9 and all of
 * Section E still need a reader, and this script says so rather than implying a
 * clean exit means publishable.
 *
 * Usage:
 *   node scripts/check-voice-rubric.mjs src/content/articles/foo.md [more.md ...]
 *   node scripts/check-voice-rubric.mjs --all
 *
 * Exit code 1 if any checked file fails any implemented item.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

// ---------------------------------------------------------------- word lists

const BANNED_WORDS = [
  'delve', 'tapestry', 'leverage', 'robust', 'seamless', 'pivotal',
  'navigate', 'embark', 'unlock', 'unveil', 'foster', 'cultivate', 'elevate',
  'empower', 'showcase', 'underscore', 'emphasize', 'facilitate', 'utilize',
  'harness', 'spearhead', 'amplify', 'streamline', 'usher',
  'comprehensive', 'nuanced', 'multifaceted', 'intricate', 'sophisticated',
  'holistic', 'vibrant', 'compelling', 'meaningful', 'impactful',
  'transformative', 'groundbreaking', 'ever-evolving', 'ever-changing',
  'fast-paced', 'bespoke', 'myriad', 'profound', 'essential', 'crucial', 'vital',
  'realm', 'landscape', 'ecosystem', 'synergy', 'paradigm', 'plethora',
  'testament', 'cornerstone', 'bedrock', 'linchpin',
  'moreover', 'furthermore', 'additionally', 'consequently', 'notably',
  'importantly', 'indeed', 'ultimately', 'essentially', 'straightforward',
];

// Multi-word phrases are matched separately so word boundaries behave.
const BANNED_PHRASES = [
  'delve into', 'dive deep', 'deep dive', 'at the end of the day',
  "it's worth noting", 'it is worth noting', "it's important to note",
  'it is important to note', "it's worth mentioning", 'when it comes to',
  'in the realm of', 'at the heart of', 'at its core', 'the crux of',
  'testament to', 'speaks volumes', "in today's world", 'paint a picture',
  'a true testament', 'not only', 'game-changing', 'cutting-edge',
  'rapidly-evolving', 'wealth of knowledge', 'wealth of experience',
];

const HEDGE_WORDS = [
  'somewhat', 'fairly', 'quite', 'rather', 'perhaps', 'arguably', 'relatively',
  'generally', 'typically', 'often', 'sometimes', 'could', 'tend to',
  'can be', 'may be',
];

const WEAK_STARTERS = ['This is', "It's", 'It is', 'There are', 'There is'];

// Section C reframe / concession / triplet shapes worth catching mechanically.
const PATTERN_CHECKS = [
  { name: 'reframe ("not just X, it\'s Y")', re: /\bnot just\b[^.!?]*\b(it'?s|its|but)\b/i },
  { name: 'concession ("while X, it\'s also true that Y")', re: /\bwhile\b[^.!?]*\bit'?s also true\b/i },
  { name: 'throat-clearing signpost', re: /\b(here'?s the thing|here'?s what|let me explain|to put it another way|let'?s talk about)\b/i },
];

// --------------------------------------------------------------- parsing

function splitFrontmatter(raw) {
  if (!raw.startsWith('---')) return { frontmatter: '', body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { frontmatter: '', body: raw };
  return {
    frontmatter: raw.slice(3, end),
    body: raw.slice(end + 4),
  };
}

/**
 * Strip the things that are data rather than prose, so they do not distort
 * sentence counts: headings, code fences, tables, blockquote markers, list
 * bullets, and the bold run-in labels PCD notes use ("**When it happens.**").
 */
function proseParagraphs(body) {
  const withoutFences = body.replace(/```[\s\S]*?```/g, '');
  return withoutFences
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !block.startsWith('#'))
    .filter((block) => !block.startsWith('|'))
    .filter((block) => !/^[-*]\s/.test(block))
    .filter((block) => !/^\d+\.\s/.test(block))
    .filter((block) => !/^>/.test(block));
}

/** Sentence split that does not break on decimals, initials, or "11-12". */
function sentences(text) {
  const cleaned = text
    // PCD note-format paragraphs open with a bold run-in label ("**What it costs.**").
    // That label is a heading, not a sentence, so drop it before counting. Penny does
    // not count it either; counting it here would fail every note the rubric passes.
    .replace(/^\*\*[^*]+\*\*\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  return cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z"'(])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

function wordCount(sentence) {
  return sentence
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

// --------------------------------------------------------------- the checks

function checkFile(path) {
  const raw = readFileSync(path, 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const fails = [];

  // A2: no em dashes, anywhere in the file including frontmatter.
  const emDashes = (raw.match(/—/g) || []).length;
  if (emDashes > 0) {
    fails.push(`A2 em dash: ${emDashes} instance(s) of the em dash character`);
  }

  // A1: paragraph length, 3 sentence maximum.
  const paras = proseParagraphs(body);
  paras.forEach((para) => {
    const count = sentences(para).length;
    if (count > 3) {
      fails.push(`A1 paragraph length: ${count} sentences in "${para.slice(0, 60).replace(/\s+/g, ' ')}..."`);
    }
  });

  // A6: sentence rhythm, no three consecutive sentences within a 5-word spread.
  const flat = paras.flatMap((p) => sentences(p));
  const lengths = flat.map(wordCount);
  for (let i = 0; i + 2 < lengths.length; i += 1) {
    const window = lengths.slice(i, i + 3);
    const spread = Math.max(...window) - Math.min(...window);
    if (spread <= 5) {
      fails.push(
        `A6 sentence rhythm: spread ${spread} across ${window.join('/')} words at "${flat[i].slice(0, 50).replace(/\s+/g, ' ')}..."`
      );
    }
  }

  // C5: weak sentence starters, max one per 300 words of body.
  const bodyWords = wordCount(body);
  const weakHits = flat.filter((s) => WEAK_STARTERS.some((w) => s.startsWith(w)));
  const weakAllowance = Math.max(1, Math.floor(bodyWords / 300));
  if (weakHits.length > weakAllowance) {
    fails.push(`C5 weak starters: ${weakHits.length} found, ${weakAllowance} allowed at ${bodyWords} words`);
  }
  if (flat.length && WEAK_STARTERS.some((w) => flat[0].startsWith(w))) {
    fails.push('C5 weak starters: the first sentence of the body opens with a weak starter');
  }

  // B: banned words and phrases, across frontmatter strings and body.
  const searchable = `${frontmatter}\n${body}`.toLowerCase();
  BANNED_WORDS.forEach((word) => {
    const re = new RegExp(`\\b${word.replace(/[-]/g, '\\-')}\\b`, 'gi');
    const hits = (searchable.match(re) || []).length;
    if (hits > 0) fails.push(`B banned word: "${word}" x${hits}`);
  });
  BANNED_PHRASES.forEach((phrase) => {
    const hits = (searchable.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length;
    if (hits > 0) fails.push(`B banned phrase: "${phrase}" x${hits}`);
  });

  // B: hedging. Two in one sentence fails. More than three in the body fails.
  let hedgeTotal = 0;
  flat.forEach((s) => {
    let inSentence = 0;
    HEDGE_WORDS.forEach((h) => {
      const hits = (s.match(new RegExp(`\\b${h}\\b`, 'gi')) || []).length;
      inSentence += hits;
    });
    hedgeTotal += inSentence;
    if (inSentence >= 2) {
      fails.push(`B hedging: ${inSentence} hedge words in one sentence, "${s.slice(0, 60).replace(/\s+/g, ' ')}..."`);
    }
  });
  if (hedgeTotal > 3) {
    fails.push(`B hedging: ${hedgeTotal} hedge words in the body, 3 is the ceiling`);
  }

  // C: pattern shapes.
  PATTERN_CHECKS.forEach(({ name, re }) => {
    if (re.test(body)) fails.push(`C pattern: ${name}`);
  });

  // E5: dek under 15 words.
  const dekMatch = frontmatter.match(/^dek:\s*"?(.*?)"?\s*$/m);
  if (dekMatch) {
    const dekWords = wordCount(dekMatch[1]);
    if (dekWords >= 15) fails.push(`E5 dek length: ${dekWords} words, must be under 15`);
  }

  // E2: unresolved editorial flags.
  const hasTrueFlag = /flag(Inappropriateness|IpRisk|SensitiveTopic):\s*true/.test(frontmatter);
  const hasResolution = /flagResolutions:/.test(frontmatter);
  const isPublished = /^draft:\s*false/m.test(frontmatter);
  if (isPublished && hasTrueFlag && !hasResolution) {
    fails.push('E2 open flag: a flag is true with no flagResolutions entry on a draft:false file');
  }

  return { path, fails, stats: { paragraphs: paras.length, sentences: flat.length, bodyWords } };
}

// --------------------------------------------------------------- entrypoint

function walkContent(dir, acc = []) {
  readdirSync(dir).forEach((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkContent(full, acc);
    else if (entry.endsWith('.md') && !entry.startsWith('_')) acc.push(full);
  });
  return acc;
}

const args = process.argv.slice(2);
const targets = args.includes('--all')
  ? walkContent(join(ROOT, 'src', 'content'))
  : args.filter((a) => !a.startsWith('--'));

if (targets.length === 0) {
  console.error('Usage: node scripts/check-voice-rubric.mjs <file.md> [...] | --all');
  process.exit(2);
}

let failing = 0;
targets.forEach((target) => {
  const { path, fails, stats } = checkFile(target);
  const label = relative(ROOT, path);
  if (fails.length === 0) {
    console.log(`PASS  ${label}  (${stats.paragraphs} paras, ${stats.sentences} sentences, ${stats.bodyWords} words)`);
  } else {
    failing += 1;
    console.log(`FAIL  ${label}`);
    fails.forEach((f) => console.log(`        ${f}`));
  }
});

console.log(
  `\n${targets.length - failing}/${targets.length} passed the mechanical checks.`
);
console.log(
  'Still needs a reader: A3 opens inside the problem, A4 no summary close, A5 no empowerment close,\n' +
  'A8 at least one specific, A9 at least one voice marker, A7 unsolicited bullets, and all of Section E\n' +
  'beyond dek length and open flags. A clean run here does not mean publishable.'
);

process.exit(failing > 0 ? 1 : 0);
