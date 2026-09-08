import { bearerCredential, secretsMatch } from './secrets';
import { decodeBase64, encodeBase64, isSafeSlug, REPO, BRANCH } from './publish';

const PROVIDER = 'babylovegrowth';
const MAX_WEBHOOK_BYTES = 512 * 1024;
const MAX_MARKDOWN_CHARS = 240_000;
const GITHUB_TIMEOUT_MS = 15_000;
const API_TIMEOUT_MS = 12_000;
const API_BASE = 'https://api.babylovegrowth.ai/api/integrations/v1/articles';

export interface BabyLoveEnv {
  PCD_OPS_DB?: D1Database;
  BABYLOVE_WEBHOOK_TOKEN?: string;
  BABYLOVE_API_KEY?: string;
  BABYLOVE_AUTOPUBLISH_ENABLED?: string;
  GITHUB_TOKEN?: string;
  PUBLISH_COMMITTER_EMAIL?: string;
}

export interface BabyLoveArticle {
  id: string;
  title: string;
  slug: string;
  contentMarkdown: string;
  metaDescription: string;
  excerpt: string;
  languageCode: string;
  createdAt: string;
}

interface ReceiptRow {
  id: string;
  status: string;
  provider_article_id: string;
  payload_sha256: string;
  received_at: string;
}

interface GitHubFile {
  content: string;
  sha: string;
}

class BabyLoveFailure extends Error {
  constructor(readonly code: string, message = code) {
    super(message);
  }
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  },
});

async function readBoundedText(request: Request, maxBytes: number): Promise<string> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new BabyLoveFailure('payload_too_large');
    }
    chunks.push(decoder.decode(value, { stream: true }));
  }
  chunks.push(decoder.decode());
  return chunks.join('');
}

function enabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function stringValue(value: unknown, max: number): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
    : '';
}

function idValue(value: unknown): string {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return String(value);
  if (typeof value !== 'string') return '';
  const normalized = value.trim();
  return /^[A-Za-z0-9_-]{1,80}$/.test(normalized) ? normalized : '';
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

export function sanitizeExternalMarkdown(markdown: string): string {
  let value = markdown.slice(0, MAX_MARKDOWN_CHARS);
  value = value.replace(/^---\s*[\s\S]*?\s*---\s*/, '');
  value = value.replace(/<!--[\s\S]*?-->/g, '');
  value = value.replace(/<(script|style|iframe|form|object|embed|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  value = value.replace(/<(script|style|iframe|form|object|embed|svg)\b[^>]*\/?\s*>/gi, '');
  value = value.replace(/<[^>]+>/g, '');
  // Provider-hosted images are not trusted or copied into our asset pipeline.
  // Remove the whole image token: preserving only its alt text rendered the
  // provider's image prompts as stray prose in the first two imported posts.
  //
  // All three markdown image forms, not only the inline one. The original fix
  // handled `![alt](url)` and missed `![alt][ref]` and bare `![alt]`. Those
  // survived, plainText later stripped the bracket, and the provider's image
  // prompt shipped as prose behind a stray bang: "45 Minute Tee Ball Practice
  // ... ! Decorative tee ball practice title card illustration" was the live
  // meta description on 2026-09-08. Same bug, second occurrence.
  value = value.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  value = value.replace(/!\[[^\]]*\]\[[^\]]*\]/g, '');
  value = value.replace(/!\[[^\]]*\]/g, '');
  value = value.replace(/\[([^\]]+)\]\(\s*(?:javascript|data|vbscript):[^)]*\)/gi, '$1');
  value = value.replace(/\[([^\]]+)\]\(https?:\/\/(?:www\.)?parentcoachdesk\.com(\/[^)]*)?\)/gi, (_match, label, route = '/') => {
    const [pathname, fragment] = String(route).split('#', 2);
    const canonicalPath = pathname === '/' || pathname.endsWith('/') ? pathname : `${pathname}/`;
    return `[${label}](${canonicalPath}${fragment ? `#${fragment}` : ''})`;
  });
  value = value.replace(/^#\s+/gm, '## ');
  value = decodeEntities(value);
  // Visible provider promotion is not part of Parent Coach Desk editorial
  // content. Provenance remains in externalSource frontmatter and the receipt
  // ledger. Limit this to a terminal credit so legitimate in-body citations
  // to BabyLoveGrowth are not silently removed.
  value = value.replace(/(?:\n|^)\s*\[Article generated by BabyLoveGrowth\]\(https?:\/\/(?:www\.)?babylovegrowth\.ai\/?\)\s*$/i, '');
  value = value.replace(/\r\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim();
  return `${value}\n`;
}

function normalizeArticleBody(markdown: string, title: string): string {
  const normalizedTitle = title.replace(/[\*_`#]+/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const lines = markdown.trim().split('\n');
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);
  if (firstContentIndex >= 0) {
    const heading = lines[firstContentIndex].match(/^#{1,6}\s+(.+)$/)?.[1]
      ?.replace(/[\*_`#]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
    if (heading === normalizedTitle) lines.splice(firstContentIndex, 1);
  }
  return `${lines.join('\n').replace(/^\s+/, '').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

function htmlToMarkdown(html: string): string {
  const converted = html
    .replace(/<h1\b[^>]*>/gi, '\n## ')
    .replace(/<h[2-6]\b[^>]*>/gi, '\n### ')
    .replace(/<\/(h[1-6]|p|div|section|article|blockquote)>/gi, '\n\n')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<(strong|b)\b[^>]*>/gi, '**')
    .replace(/<\/(strong|b)>/gi, '**')
    .replace(/<(em|i)\b[^>]*>/gi, '*')
    .replace(/<\/(em|i)>/gi, '*');
  return sanitizeExternalMarkdown(converted);
}

function normalizeSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/g, '');
  return isSafeSlug(slug) ? slug : '';
}

export function parseBabyLoveArticle(payload: unknown): BabyLoveArticle {
  const envelope = objectValue(payload);
  if (!envelope) throw new BabyLoveFailure('object_required');
  const input = objectValue(envelope.article) ?? envelope;
  const id = idValue(input.id);
  const title = stringValue(input.title, 120);
  const slug = normalizeSlug(stringValue(input.slug, 140) || title);
  const languageCode = stringValue(input.languageCode ?? input.language_code ?? 'en', 12).toLowerCase();
  const rawMarkdown = typeof input.content_markdown === 'string' ? input.content_markdown : '';
  const rawHtml = typeof input.content_html === 'string' ? input.content_html : '';
  const sanitizedMarkdown = rawMarkdown
    ? sanitizeExternalMarkdown(rawMarkdown)
    : rawHtml
      ? htmlToMarkdown(rawHtml)
      : '';
  const contentMarkdown = normalizeArticleBody(sanitizedMarkdown, title);
  const metaDescription = stringValue(input.metaDescription ?? input.meta_description, 180);
  const excerpt = stringValue(input.excerpt, 240);
  const createdCandidate = stringValue(input.createdAt ?? input.created_at, 64);
  const created = createdCandidate ? new Date(createdCandidate) : null;
  const createdAt = created && !Number.isNaN(created.getTime())
    ? created.toISOString()
    : '1970-01-01T00:00:00.000Z';

  if (!id) throw new BabyLoveFailure('invalid_article_id');
  if (title.length < 8) throw new BabyLoveFailure('invalid_title');
  if (!slug) throw new BabyLoveFailure('invalid_slug');
  if (languageCode !== 'en' && !languageCode.startsWith('en-')) throw new BabyLoveFailure('unsupported_language');
  if (contentMarkdown.trim().length < 200) throw new BabyLoveFailure('content_too_short');
  return { id, title, slug, contentMarkdown, metaDescription, excerpt, languageCode, createdAt };
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function articleFingerprint(article: BabyLoveArticle): Promise<string> {
  return sha256Hex(JSON.stringify({
    id: article.id,
    title: article.title,
    slug: article.slug,
    contentMarkdown: article.contentMarkdown,
    metaDescription: article.metaDescription,
    excerpt: article.excerpt,
    languageCode: article.languageCode,
    createdAt: article.createdAt,
  }));
}

function inferClassification(article: BabyLoveArticle): { phase: 'drive-there' | 'game' | 'drive-home' | 'team-parent'; topic: string } {
  const haystack = `${article.title} ${article.metaDescription} ${article.excerpt}`.toLowerCase();
  if (/team parent|snack|fundrais|picture day|roster|carpool|volunteer/.test(haystack)) {
    return { phase: 'team-parent', topic: 'season-ops' };
  }
  if (/post[- ]?game|ride home|after (the )?game|loss|lost|mistake|bad game/.test(haystack)) {
    return { phase: 'drive-home', topic: 'communication' };
  }
  if (/tryout|registration|prepare|before (the )?game|pregame|travel (ball|team)|rec vs|specializ/.test(haystack)) {
    return { phase: 'drive-there', topic: /tryout/.test(haystack) ? 'tryouts' : 'rec-vs-travel' };
  }
  if (/equipment|bat|cleat|helmet|gear/.test(haystack)) return { phase: 'game', topic: 'equipment' };
  if (/rule|penalt|official|referee|umpire/.test(haystack)) return { phase: 'game', topic: 'rules-of-play' };
  if (/coach|say|conversation|communicat/.test(haystack)) return { phase: 'game', topic: 'communication' };
  return { phase: 'game', topic: 'game-day' };
}

// BaseLayout appends " | Parent Coach Desk" (20 characters), and the content
// schema requires seoTitle between 20 and 70. Keep the provider-controlled
// portion inside 22-40 so the rendered title lands in the 45-60 audit window.
const SEO_TITLE_MIN = 22;
const SEO_TITLE_MAX = 40;

/**
 * The headline before its subtitle. Providers write "Main Idea: the long
 * promise about the thing", and cutting at a character count lands inside the
 * promise. That is what shipped `<title>Coach Pitch vs Kid Pitch: Which
 * Format | Parent Coach Desk</title>` and "Youth Basketball Drills: A Parent"
 * to production on 2026-09-08. A complete short headline beats a longer
 * fragment: Google rewrites fragments anyway, and readers see the stub.
 */
function titleHead(value: string): string {
  return value.match(/^(.+?)\s*(?::|\s[–—-]\s)\s*\S/)?.[1]?.trim() ?? '';
}

function padTitle(value: string): string {
  const padded = `${value}: a parent guide`;
  return padded.length <= SEO_TITLE_MAX ? padded : value;
}

// Every complete candidate leaves through here.
//
// BaseLayout appends 20 characters and Pillar 10 wants the rendered title in
// 45-60, so a genuinely short headline gets padded. The threshold is 22, not
// 25, on purpose: at 25 this padded six of the twenty-two imported articles
// and produced "A Parent Code of Conduct: a parent guide" and "Coach Pitch vs
// Kid Pitch: a parent guide". A complete 44-character title reads better than
// a 60-character one carrying filler, and Google displays both in full. The
// companion assertion in tests/babylove-growth.test.ts was lowered to match.
function ensureWindow(value: string): string {
  return value.length >= 22 ? value : padTitle(value);
}

// The longest prefix that ends before a conjunction or preposition and still
// clears the schema's 20-character floor for seoTitle.
function cutAtConnector(value: string): string {
  const pattern = /\s+(?:and|or|for|with|to|from|about|that|when|while|plus|including|every|each|any)\s+\S/gi;
  let best = '';
  let match: RegExpExecArray | null = pattern.exec(value);
  while (match !== null) {
    const prefix = value.slice(0, match.index).trim();
    if (prefix.length >= 20) best = prefix;
    match = pattern.exec(value);
  }
  return best;
}

function seoTitle(title: string): string {
  const clean = decodeEntities(title).replace(/[\*_`#]+/g, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= SEO_TITLE_MAX) return ensureWindow(clean);

  const head = titleHead(clean);
  if (head.length >= SEO_TITLE_MIN && head.length <= SEO_TITLE_MAX) return ensureWindow(head);

  const truncated = removeDanglingEnding(
    clean.slice(0, SEO_TITLE_MAX)
      .replace(/\s+\S*$/, '')
      // A trailing possessive is always mid-phrase: "Travel Soccer Costs: A
      // Parent's" was the shape this produced before.
      .replace(/\s+\b[\w-]+['’]s$/i, ''),
  ).replace(/[,:;.!?\s]+$/, '');

  // Anything reaching here was cut mid-phrase. Prefer the last complete clause
  // before a conjunction: "45 Minute Tee Ball Practice and 8 Quick" becomes
  // "45 Minute Tee Ball Practice". A complete short headline beats a longer
  // fragment, so a complete candidate under the audit target gets padded rather
  // than discarded.
  const cut = cutAtConnector(truncated);
  if (cut) return ensureWindow(cut);
  if (truncated.length >= SEO_TITLE_MIN) return ensureWindow(truncated);
  if (head.length >= 12) return padTitle(head);
  if (truncated.length >= 12) return padTitle(truncated);
  return 'Youth sports guidance for parents';
}

function removeDanglingEnding(value: string): string {
  let result = value.trim();
  // Relative and interrogative words were missing, which is how
  // "Coach Pitch vs Kid Pitch: Which Format" reached production as a <title>.
  const dangling = /\s+\b(?:and|or|for|to|with|of|in|on|at|the|a|an|their|your|this|that|which|what|how|why|when|where|who|whose|whether|is|are|its|our|my|from|by|about|into|than|as|vs|versus|actually|really|truly|simply|just|only|even|still|after|before|during|without|through|between|against|over|under|upon|per|like|near)\b[.,;:]?$/i;
  while (dangling.test(result)) result = result.replace(dangling, '').trim();
  return result.replace(/[,:;\s]+$/, '');
}

function ensureCompleteSentence(value: string): string {
  const clean = removeDanglingEnding(value.replace(/\s+/g, ' ').trim());
  return /[.!?…]$/.test(clean) ? clean : `${clean}.`;
}

/**
 * Clean a provider-authored summary field for display.
 *
 * WHY THIS EXISTS (2026-09-08). `excerpt` and `metaDescription` never pass
 * through sanitizeExternalMarkdown — only the body does — so they arrive
 * carrying markdown image tokens and a repeat of the headline. That is how
 * the tee-ball meta description opened "45 Minute Tee Ball Practice and 8
 * Quick Drills for Parent Coaches ! Decorative tee ball pr..." on the live
 * site, with the provider's image prompt sitting where the Google snippet goes.
 *
 * Deliberately applied HERE, at the point of use, and never in
 * parseBabyLoveArticle: articleFingerprint hashes excerpt and metaDescription,
 * so cleaning at parse time would invalidate every receipt already written.
 */
function providerSummaryText(value: string, title: string): string {
  let text = value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, ' ')
    .replace(/!\[[^\]]*\]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\*_`>#]+/g, ' ');
  text = decodeEntities(text).replace(/\s+/g, ' ').trim();
  const head = title.replace(/[\*_`#]+/g, '').replace(/\s+/g, ' ').trim();
  if (head && text.toLowerCase().startsWith(head.toLowerCase())) {
    text = text.slice(head.length).replace(/^[\s\-–—:;,.!?]+/, '');
  }
  return text.trim();
}

function seoDescription(article: BabyLoveArticle): string {
  const candidate = providerSummaryText(article.metaDescription, article.title)
    || providerSummaryText(article.excerpt, article.title);
  const fallback = `Practical guidance for parents navigating ${article.title.toLowerCase()} in youth sports, with clear next steps for the family.`;
  let value = removeDanglingEnding(candidate || fallback);
  if (value.length < 140) {
    // Strip terminal ! and ? too, not just the period. Leaving them produced
    // "...skill development and fun games!. Practical guidance..." on the live
    // basketball article's meta description.
    value = `${value.replace(/[.!?…\s]+$/, '')}. Practical guidance and clear next steps for youth sports parents and families.`;
  }
  // One padding sentence is not always enough. A provider summary as short as
  // "A ready-to-run plan." landed at 98 characters, which wastes the snippet
  // and invites Google to write its own.
  if (value.length < 140) {
    value = `${value.replace(/[.!?…\s]+$/, '')}. Written for the parent who ended up coaching.`;
  }
  if (value.length > 160) {
    const sentenceBoundary = Math.max(value.lastIndexOf('. ', 159), value.lastIndexOf('? ', 159), value.lastIndexOf('! ', 159));
    value = sentenceBoundary >= 139
      ? value.slice(0, sentenceBoundary + 1)
      : `${removeDanglingEnding(value.slice(0, 159).replace(/\s+\S*$/, ''))}…`;
  }
  return ensureCompleteSentence(value).slice(0, 160);
}

function plainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, ' ')
    .replace(/!\[[^\]]*\]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[\*_`>#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// The article's first substantial paragraph, in plain text.
function articleOpening(article: BabyLoveArticle): string {
  return article.contentMarkdown
    .split(/\n\s*\n/)
    .map(plainText)
    .find((value) => value.length >= 80 && !/^table of contents$/i.test(value)) ?? '';
}

function articleBluf(article: BabyLoveArticle): string {
  const paragraph = articleOpening(article);
  const value = paragraph || seoDescription(article);
  return ensureCompleteSentence(value.slice(0, 500).replace(/\s+\S*$/, ''));
}

interface HeroChoice {
  hero: string;
  alt: string;
}

/**
 * Sport-matched hero illustrations, mirroring how the hand-written posts use
 * them: three per sport, rotated across articles.
 *
 * WHY THIS EXISTS (2026-09-08). Every branch below used to fall through to
 * receipts-on-counter.webp, alt text "Youth sports receipts, a calendar, and a
 * family budget arranged on a kitchen counter." That image and that alt text
 * shipped on the goalkeeper drills page and the coach-pitch page, which is
 * both a quality problem and an accessibility one: a screen reader announced
 * a family budget on an article about goalkeeping.
 *
 * Every path here is verified present in public/illustrations.
 */
const HERO_POOLS: Record<string, HeroChoice[]> = {
  baseball: [
    { hero: '/illustrations/baseball-dugout-fence-quiet.webp', alt: "A young player rests forearms against a dugout's chain-link fence in late afternoon, face turned away in profile, a worn glove on the bench behind." },
    { hero: '/illustrations/baseball-glove-ball-bench.webp', alt: 'A broken-in leather glove with a scuffed baseball in the pocket rests on a dugout bench under hard side light.' },
    { hero: '/illustrations/baseball-infield-dirt-morning.webp', alt: 'A youth baseball infield shows freshly raked dirt and chalk baselines in early morning, bases set and nobody on the field.' },
  ],
  softball: [
    { hero: '/illustrations/softball-circle-chalk.webp', alt: "A youth softball field's pitching circle shows fresh chalk in morning light, a plain yellow ball resting in the dirt." },
    { hero: '/illustrations/softball-dugout-bench-gear.webp', alt: 'A row of gloves and helmets lines a dugout bench, chain-link shadow striping across them in afternoon light.' },
    { hero: '/illustrations/softball-outfield-dusk-figures.webp', alt: 'Two small figures walk in from the outfield at dusk, seen from behind at long distance with a fence line and trees beyond.' },
  ],
  soccer: [
    { hero: '/illustrations/soccer-practice-sunset-silhouettes.webp', alt: 'A youth soccer practice is photographed from far behind the touchline at sunset, players reading as warm rim-lit silhouettes with long shadows.' },
    { hero: '/illustrations/soccer-cleats-shinguards-bench.webp', alt: 'Worn soccer cleats and rolled shin guards sit on a wooden bench beside a ball in morning light through a fence.' },
    { hero: '/illustrations/soccer-goal-net-empty.webp', alt: 'An empty soccer goal is photographed from behind the net at dusk, the grass worn in the goalmouth and the field stretching away.' },
  ],
  basketball: [
    { hero: '/illustrations/basketball-empty-gym-morning.webp', alt: 'An empty school gym in the morning shows light from high windows falling across the floor, a ball at rest near the baseline.' },
    { hero: '/illustrations/basketball-hoop-outdoor-dusk.webp', alt: 'An outdoor basketball hoop with a worn net stands against a dusk sky, its backboard weathered and shot from below.' },
    { hero: '/illustrations/basketball-shoes-baseline.webp', alt: 'A pair of worn court shoes and a rolled towel sit on a gym baseline beside a water bottle under hard overhead light.' },
  ],
  volleyball: [
    { hero: '/illustrations/volleyball-net-empty-gym.webp', alt: 'A volleyball net stretches across an empty gym court, shot from the floor at one post with light falling from high windows.' },
    { hero: '/illustrations/volleyball-knee-pads-bench.webp', alt: 'Rolled knee pads, a plain volleyball, and a water bottle sit on a gym bench under side light with a worn floor beneath.' },
    { hero: '/illustrations/volleyball-line-of-players-behind.webp', alt: 'A row of young players stands along a sideline seen from directly behind, hands on hips, all facing the court away from the camera.' },
  ],
  football: [
    { hero: '/illustrations/football-helmets-on-grass.webp', alt: "Three plain unbranded youth football helmets sit in a row on grass at a practice field's edge, chinstraps loose in evening light." },
    { hero: '/illustrations/football-practice-distance-dusk.webp', alt: 'A youth football practice is seen from far outside the fence at dusk, players small and backlit with blocking sleds at the edge.' },
    { hero: '/illustrations/football-shoulder-pads-locker.webp', alt: 'Shoulder pads and a plain jersey hang in an open locker under one overhead bulb, no numbers or lettering visible.' },
  ],
  'flag-football': [
    { hero: '/illustrations/flag-football-belts-grass.webp', alt: 'Flag football belts with plain colored flags lie on grass beside a ball, dew visible in morning light.' },
  ],
  hockey: [
    { hero: '/illustrations/hockey-gear-drying-garage.webp', alt: 'Youth hockey gear hangs to dry on hooks in a garage, pads and a plain helmet visible with skates on the floor in cold morning light.' },
    { hero: '/illustrations/hockey-rink-empty-early.webp', alt: 'An empty ice rink sits ready before anyone arrives, a fresh sheet of ice with overhead lights reflecting off the surface.' },
    { hero: '/illustrations/hockey-bench-skates-laced.webp', alt: 'Skates and a stick rest against a rink bench beside a plain helmet, lit by cold blue light through the glass.' },
  ],
  lacrosse: [
    { hero: '/illustrations/lacrosse-stick-ball-grass.webp', alt: 'A lacrosse stick lies across grass with a plain ball in the head, dew coating the blades in low morning light.' },
    { hero: '/illustrations/lacrosse-goal-empty-field.webp', alt: 'An empty lacrosse goal is seen from behind the net on a worn field at dusk, the crease paint faded with a treeline beyond.' },
  ],
  tennis: [
    { hero: '/illustrations/tennis-court-empty-net-dusk.webp', alt: 'An empty tennis court at dusk is photographed from behind the baseline, the net sagging slightly with a fence beyond.' },
    { hero: '/illustrations/tennis-racket-balls-bench.webp', alt: 'A racket and three plain tennis balls sit on a courtside bench beside a towel and water bottle in afternoon light.' },
  ],
  swimming: [
    { hero: '/illustrations/swimming-lane-lines-empty.webp', alt: 'An empty swimming pool sits at early morning with lane lines strung across still water, natatorium windows glowing behind.' },
    { hero: '/illustrations/swimming-goggles-cap-deck.webp', alt: 'A pair of goggles and a plain silicone cap sit on a wet pool deck beside a towel, light rippling across the surface.' },
    { hero: '/illustrations/swimming-blocks-from-behind.webp', alt: 'Starting blocks stand at the end of a pool shot from behind, one swimmer on the deck beyond seen only from the back in morning light.' },
  ],
  'track-field': [
    { hero: '/illustrations/track-lanes-empty-morning.webp', alt: 'An empty outdoor track is photographed low along the lane lines in early morning, dew visible on the surface.' },
    { hero: '/illustrations/track-blocks-and-spikes.webp', alt: 'Starting blocks sit set in a lane with a pair of spikes beside them, hard morning shadow crossing the track.' },
  ],
  'cross-country': [
    { hero: '/illustrations/cross-country-trail-morning-fog.webp', alt: 'A grass and dirt course trail winds through morning fog with course flags marking the turns and no runners in frame.' },
    { hero: '/illustrations/cross-country-spikes-mud.webp', alt: 'A pair of muddy racing spikes sits on grass beside a discarded warm-up top under overcast light.' },
    { hero: '/illustrations/cross-country-runners-far-ridge.webp', alt: 'A line of runners strings out along a distant ridge at dawn, tiny and silhouetted against the sky with foreground grass in soft focus.' },
  ],
  wrestling: [
    { hero: '/illustrations/wrestling-mat-circle-empty.webp', alt: 'An empty wrestling mat is photographed from the edge under gym lights, its circle markings plain with folded bleachers behind.' },
    { hero: '/illustrations/wrestling-shoes-headgear-bench.webp', alt: 'A pair of wrestling shoes and plain headgear sit on a bench beside a towel under dim gym light.' },
  ],
  gymnastics: [
    { hero: '/illustrations/gymnastics-chalk-bowl-bars.webp', alt: 'A chalk bowl sits beside uneven bars in a training gym, white dust dusting the rail and floor in morning light.' },
    { hero: '/illustrations/gymnastics-beam-empty-low.webp', alt: 'A balance beam is photographed at very low angle down its length in an empty gym, a foam pit blurred beyond.' },
    { hero: '/illustrations/gymnastics-grips-tape-bench.webp', alt: 'Worn hand grips and a roll of athletic tape sit on a bench beside a chalk-dusted water bottle under side light.' },
  ],
  cheer: [
    { hero: '/illustrations/cheer-mat-empty-gym.webp', alt: 'A blue practice mat rolls out across an empty gym floor, a water bottle at the edge under high window light.' },
    { hero: '/illustrations/cheer-shoes-bow-bench.webp', alt: 'Cheer shoes, a plain hair bow, and a rolled wrap sit on a gym bench under side light.' },
    { hero: '/illustrations/cheer-line-from-behind-arms.webp', alt: 'A line of young athletes stands in formation seen from directly behind, arms raised in a high V, all facing away from the camera.' },
  ],
  golf: [
    { hero: '/illustrations/golf-bag-cart-path-dawn.webp', alt: 'A youth golf bag stands on a cart path at dawn with plain clubs inside, the fairway fading into mist beyond.' },
    { hero: '/illustrations/golf-putting-green-long-shadow.webp', alt: 'A putting green sits at low sun with a flagstick and a single ball near the cup, one long shadow crossing the grass.' },
  ],
  'multi-sport': [
    { hero: '/illustrations/sideline-two-parents-talking.webp', alt: 'Two parents stand a few feet apart on a youth practice field sideline in late afternoon, both turned toward the field mid-conversation.' },
    { hero: '/illustrations/bleachers-two-parents-side.webp', alt: 'Two adults sit a seat apart on aluminum bleachers, shot from behind and below, a bright field beyond them.' },
    { hero: '/illustrations/kitchen-phone-group-thread.webp', alt: 'A parent holds a phone at a kitchen island in the evening with a messaging thread open, dinner half cleared behind them.' },
  ],
};

/**
 * Deterministic index into a hero pool. The same article id always picks the
 * same illustration, so a re-import does not churn the file, while different
 * articles spread across the pool the way the hand-written posts do.
 */
function heroIndex(seed: string, length: number): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % length;
}

// Order matters. "flag football" contains "football"; hockey and lacrosse own
// "goalie" often enough that only "goalkeeper" is read as soccer.
function inferSport(haystack: string): string {
  if (/flag[- ]football/.test(haystack)) return 'flag-football';
  if (/baseball|tee[- ]?ball|t-ball|coach pitch|kid pitch|machine pitch|\bbats?\b/.test(haystack)) return 'baseball';
  if (/softball/.test(haystack)) return 'softball';
  if (/basketball/.test(haystack)) return 'basketball';
  if (/volleyball/.test(haystack)) return 'volleyball';
  if (/hockey/.test(haystack)) return 'hockey';
  if (/lacrosse/.test(haystack)) return 'lacrosse';
  if (/soccer|goalkeeper|goalkeeping/.test(haystack)) return 'soccer';
  if (/football/.test(haystack)) return 'football';
  if (/tennis/.test(haystack)) return 'tennis';
  if (/swim(ming|mer)?\b|freestyle|backstroke/.test(haystack)) return 'swimming';
  if (/cross[- ]country/.test(haystack)) return 'cross-country';
  if (/track (?:and|&) field|track meet|hurdles|relay race/.test(haystack)) return 'track-field';
  if (/wrestl/.test(haystack)) return 'wrestling';
  if (/gymnast/.test(haystack)) return 'gymnastics';
  if (/cheer(leading)?\b/.test(haystack)) return 'cheer';
  if (/\bgolf/.test(haystack)) return 'golf';
  return 'multi-sport';
}

function inferredArticleMetadata(article: BabyLoveArticle, topic: string): {
  sport: string;
  age: string;
  hero: string;
  heroAlt: string;
} {
  const haystack = `${article.title} ${article.metaDescription} ${article.excerpt}`.toLowerCase();
  const sport = inferSport(haystack);
  const age = /tee[- ]?ball|t-ball/.test(haystack) ? 't-ball'
    : /\b(?:13|14)u?\b/.test(haystack) ? '13-14'
      : /\b(?:11|12)u?\b/.test(haystack) ? '11-12'
        : /\b(?:8|9|10)u?\b/.test(haystack) ? '8-10'
          : /\b(?:5|6|7)u?\b/.test(haystack) ? '5-7'
            : 'all-ages';

  // A named sport beats a topic illustration: a reader on a goalkeeping
  // article is better served by a soccer goal than by a generic gear bag.
  const pool = HERO_POOLS[sport];
  if (pool && sport !== 'multi-sport') {
    const choice = pool[heroIndex(article.id, pool.length)];
    return { sport, age, hero: choice.hero, heroAlt: choice.alt };
  }
  if (topic === 'equipment') {
    return {
      sport,
      age,
      hero: '/illustrations/guide-parent-coach-gear.webp',
      heroAlt: 'A youth sports gear bag and equipment arranged for a parent checklist.',
    };
  }
  if (topic === 'rec-vs-travel') {
    return {
      sport,
      age,
      hero: '/illustrations/travel-vs-rec-diptych.webp',
      heroAlt: 'A neighborhood recreation field beside a larger travel-sports complex.',
    };
  }
  const generic = HERO_POOLS['multi-sport'];
  const choice = generic[heroIndex(article.id, generic.length)];
  return { sport, age, hero: choice.hero, heroAlt: choice.alt };
}

function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]+/g, ' ')}"`;
}

export function buildBabyLoveArticleMarkdown(article: BabyLoveArticle, payloadSha256: string, importedAt: string): string {
  const classification = inferClassification(article);
  const inferred = inferredArticleMetadata(article, classification.topic);
  const description = seoDescription(article);
  // When the provider's excerpt is unusable, the article's own opening beats
  // reusing the description: the dek renders as the card subtitle on the home,
  // ages and parent-coach pages, and the description carries padding sentences
  // that read as boilerplate there. The bluf renders on the article page, so
  // the two never appear side by side.
  const cleanExcerpt = providerSummaryText(article.excerpt, article.title);
  const dekSource = cleanExcerpt.length >= 40
    ? cleanExcerpt
    : (articleOpening(article) || description);
  // Only drop a trailing partial word when the slice actually cut the string.
  // The unconditional `.replace(/\s+\S*$/, '')` ate the last word of every dek
  // ever imported, whether or not it hit the 220 limit: the live basketball
  // article read "ready to run." where the source said "ready to run today."
  const trimmed = dekSource.length > 220
    ? dekSource.slice(0, 220).replace(/\s+\S*$/, '')
    : dekSource;
  const dekCandidate = ensureCompleteSentence(removeDanglingEnding(trimmed));
  // The schema floor for dek is 20 characters.
  const dek = dekCandidate.length >= 20 ? dekCandidate : ensureCompleteSentence(description);
  const publishedAt = article.createdAt.slice(0, 10);
  return `---\n` +
    `title: ${yamlQuote(article.title)}\n` +
    `seoTitle: ${yamlQuote(seoTitle(article.title))}\n` +
    `seoDescription: ${yamlQuote(description)}\n` +
    `dek: ${yamlQuote(dek)}\n` +
    `bluf: ${yamlQuote(articleBluf(article))}\n` +
    `topic: ${yamlQuote(classification.topic)}\n` +
    `format: "essay"\n` +
    `phase: ${yamlQuote(classification.phase)}\n` +
    `sport: ${yamlQuote(inferred.sport)}\n` +
    `age: ${yamlQuote(inferred.age)}\n` +
    `hero: ${yamlQuote(inferred.hero)}\n` +
    `heroAlt: ${yamlQuote(inferred.heroAlt)}\n` +
    `publishedAt: ${publishedAt}\n` +
    `draft: false\n` +
    `externalSource:\n` +
    `  provider: "babylovegrowth"\n` +
    `  articleId: ${yamlQuote(article.id)}\n` +
    `  payloadSha256: ${yamlQuote(payloadSha256)}\n` +
    `  importedAt: ${yamlQuote(importedAt)}\n` +
    `editorial:\n` +
    `  status: published\n` +
    `  citationCheckPassed: false\n` +
    `  reviewerNotes: "Automatically imported from authenticated BabyLoveGrowth publishing."\n` +
    `---\n\n${article.contentMarkdown}`;
}

async function findReceipt(db: D1Database, articleId: string, fingerprint: string): Promise<ReceiptRow | null> {
  return db.prepare(`SELECT id, status, provider_article_id, payload_sha256, received_at
    FROM external_article_receipts
    WHERE provider = ? AND provider_article_id = ? AND payload_sha256 = ?
    LIMIT 1`).bind(PROVIDER, articleId, fingerprint).first<ReceiptRow>();
}

async function createOrFindReceipt(db: D1Database, article: BabyLoveArticle, fingerprint: string, source: 'webhook' | 'api_reconciliation'): Promise<ReceiptRow> {
  const existing = await findReceipt(db, article.id, fingerprint);
  if (existing) return existing;
  const id = `ext_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO external_article_receipts
    (id, provider, provider_article_id, source, payload_sha256, provider_created_at, received_at, status, target_slug, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`)
    .bind(id, PROVIDER, article.id, source, fingerprint, article.createdAt, now, article.slug, now)
    .run();
  return { id, status: 'received', provider_article_id: article.id, payload_sha256: fingerprint, received_at: now };
}

async function updateReceipt(db: D1Database, receiptId: string, status: string, fields: { route?: string; commitSha?: string; errorCode?: string } = {}): Promise<void> {
  const now = new Date().toISOString();
  await db.prepare(`UPDATE external_article_receipts
    SET status = ?, target_route = COALESCE(?, target_route), github_commit_sha = COALESCE(?, github_commit_sha),
        last_error_code = ?, published_at = CASE WHEN ? = 'published' THEN ? ELSE published_at END, updated_at = ?
    WHERE id = ?`)
    .bind(status, fields.route ?? null, fields.commitSha ?? null, fields.errorCode ?? null, status, now, now, receiptId)
    .run();
}

function githubHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'parent-coach-desk-babylove-importer',
  };
}

function existingProviderId(markdown: string): string | null {
  const block = markdown.match(/^externalSource:\r?\n((?: {2}[^\n]*\r?\n?)+)/m)?.[1] ?? '';
  const provider = block.match(/^ {2}provider:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();
  const articleId = block.match(/^ {2}articleId:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();
  return provider === PROVIDER && articleId ? articleId : null;
}

async function upsertGitHubArticle(env: BabyLoveEnv, article: BabyLoveArticle, markdown: string): Promise<{ commitSha?: string; noChange: boolean }> {
  if (!env.GITHUB_TOKEN) throw new BabyLoveFailure('github_token_missing');
  const path = `src/content/articles/${article.slug}.md`;
  const headers = githubHeaders(env.GITHUB_TOKEN);
  let sha: string | undefined;
  const get = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers,
    signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
  });
  if (get.ok) {
    const file = await get.json() as GitHubFile;
    const current = decodeBase64(file.content);
    const currentProviderId = existingProviderId(current);
    if (currentProviderId !== article.id) throw new BabyLoveFailure('slug_collision');
    if (current === markdown) return { noChange: true };
    sha = file.sha;
  } else if (get.status !== 404) {
    throw new BabyLoveFailure(`github_read_${get.status}`);
  }

  const committerEmail = env.PUBLISH_COMMITTER_EMAIL?.trim() || 'parentcoachplaybook@gmail.com';
  const put = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Publish BabyLoveGrowth article ${article.id}: ${article.slug}`,
      content: encodeBase64(markdown),
      ...(sha ? { sha } : {}),
      branch: BRANCH,
      committer: { name: 'Parent Coach Desk Editorial', email: committerEmail },
    }),
    signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
  });
  if (!put.ok) throw new BabyLoveFailure(`github_write_${put.status}`);
  const result = await put.json() as { commit?: { sha?: string } };
  return { commitSha: result.commit?.sha, noChange: false };
}

async function publishReceipt(env: BabyLoveEnv, receipt: ReceiptRow, article: BabyLoveArticle): Promise<void> {
  const db = env.PCD_OPS_DB;
  if (!db) throw new BabyLoveFailure('database_missing');
  if (!enabled(env.BABYLOVE_AUTOPUBLISH_ENABLED)) {
    await updateReceipt(db, receipt.id, 'held', { errorCode: 'autopublish_disabled' });
    return;
  }
  await updateReceipt(db, receipt.id, 'processing');
  try {
    const importedAt = receipt.received_at;
    const markdown = buildBabyLoveArticleMarkdown(article, receipt.payload_sha256, importedAt);
    const outcome = await upsertGitHubArticle(env, article, markdown);
    await updateReceipt(db, receipt.id, 'published', {
      route: `/${inferClassification(article).phase}/${article.slug}/`,
      commitSha: outcome.commitSha,
    });
    console.log(JSON.stringify({ event: 'babylove_article_published', article_id: article.id, receipt_id: receipt.id, no_change: outcome.noChange }));
  } catch (error) {
    const code = error instanceof BabyLoveFailure ? error.code : 'publish_failed';
    await updateReceipt(db, receipt.id, isQuarantineCode(code) ? 'quarantined' : 'retryable_failure', { errorCode: code });
    console.error(JSON.stringify({ event: 'babylove_article_failed', article_id: article.id, receipt_id: receipt.id, code }));
    throw error;
  }
}

// A quarantine is a decision this code made on purpose, not an outage. These
// codes are permanent: the identical payload replayed an hour later lands in
// the identical state, so telling the sender to retry is always wrong.
function isQuarantineCode(code: string): boolean {
  return code === 'slug_collision' || code.startsWith('invalid_') || code === 'unsupported_language';
}

/**
 * Credential failures on OUR side. Not the sender's problem, and never fixed
 * by them resending.
 *
 * WHY THIS EXISTS (2026-09-07). On 2026-09-02 the GITHUB_TOKEN expired.
 * Article 793309 (youth-sports-safety) failed with `github_read_401`, which
 * was not a quarantine code, so the webhook answered 503. Per the comment on
 * the response below, BabyLoveGrowth reads 5xx as "this endpoint is
 * unhealthy" and stops delivering. It stopped. Seven days, zero articles,
 * including 812356 (coach-pitch-drills) which never arrived. Rotating the
 * token on 2026-09-04 fixed the cause and did nothing about the state,
 * because the sender had already disabled us.
 *
 * This is the SECOND time that deadlock has run. The first was 2026-08-21 to
 * 2026-08-26 and was fixed by making quarantines answer 200 (05b81759). That
 * fix was right and too narrow: it covered the failures we decide on, not the
 * failures we cause.
 *
 * A 401 or 403 from GitHub means our token is dead. Replaying the identical
 * payload in an hour hits the identical dead token. Telling the sender to
 * retry is not just useless, it is actively harmful — it costs the whole
 * delivery lane. The receipt is already written to D1 as `retryable_failure`,
 * so nothing is lost: reconciliation backfills it, and the watchdog alerts on
 * it the next morning. Answer 200, keep the lane open, fix the token.
 *
 * Deliberately NOT included: github_read_404 / github_write_404 (the repo or
 * path is wrong, which is a real misconfiguration worth surfacing loudly) and
 * 5xx from GitHub (genuinely transient — a retry is the correct advice).
 */
function isOurCredentialFailure(code: string): boolean {
  return /^github_(read|write)_40[13]$/.test(code);
}

async function acceptArticle(env: BabyLoveEnv, article: BabyLoveArticle, source: 'webhook' | 'api_reconciliation'): Promise<{ receipt: ReceiptRow; replay: boolean }> {
  if (!env.PCD_OPS_DB) throw new BabyLoveFailure('database_missing');
  const fingerprint = await articleFingerprint(article);
  const before = await findReceipt(env.PCD_OPS_DB, article.id, fingerprint);
  const receipt = before ?? await createOrFindReceipt(env.PCD_OPS_DB, article, fingerprint, source);
  return { receipt, replay: Boolean(before) };
}

export async function handleBabyLoveWebhook(request: Request, env: BabyLoveEnv, _context: ExecutionContext): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  if (!env.BABYLOVE_WEBHOOK_TOKEN || !env.PCD_OPS_DB) return json({ ok: false, error: 'integration_unavailable' }, 503);
  if (!(await secretsMatch(bearerCredential(request), env.BABYLOVE_WEBHOOK_TOKEN))) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') return json({ ok: false, error: 'json_required' }, 415);
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) return json({ ok: false, error: 'payload_too_large' }, 413);

  let raw: string;
  try {
    raw = await readBoundedText(request, MAX_WEBHOOK_BYTES);
  } catch (error) {
    if (error instanceof BabyLoveFailure && error.code === 'payload_too_large') {
      return json({ ok: false, error: error.code }, 413);
    }
    return json({ ok: false, error: 'body_unavailable' }, 400);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  let article: BabyLoveArticle;
  try {
    article = parseBabyLoveArticle(parsed);
  } catch (error) {
    const code = error instanceof BabyLoveFailure ? error.code : 'invalid_payload';
    return json({ ok: false, error: code }, 400);
  }

  try {
    const accepted = await acceptArticle(env, article, 'webhook');
    if (accepted.receipt.status !== 'published') {
      try {
        await publishReceipt(env, accepted.receipt, article);
      } catch (error) {
        // WHY THIS IS NOT A 503. Every publish failure used to answer with a
        // retryable 503, quarantines included. BabyLoveGrowth reads 5xx as
        // "this endpoint is unhealthy" and stops delivering, and its own
        // webhook verification step replays an OLD article whose slug always
        // collides — so the endpoint 503s, stays unverified, and can never be
        // re-verified. That deadlock is why nothing arrived between
        // 2026-08-21 and 2026-08-26 while three articles published on the
        // provider side. A quarantine is a 200: received, understood, parked
        // for a human, do not send it again.
        const code = error instanceof BabyLoveFailure ? error.code : 'publish_failed';
        if (isQuarantineCode(code)) {
          return json({ ok: true, accepted: false, quarantined: true, error: code });
        }
        if (isOurCredentialFailure(code)) {
          // Our credential is dead, not their payload. Take the article, keep
          // the lane open, let reconciliation and the watchdog do the rest.
          // See isOurCredentialFailure for the seven days this cost.
          console.error(JSON.stringify({
            event: 'babylove_webhook_credential_failure',
            code,
            article_id: article.id,
            slug: article.slug,
            note: 'answered 200 to keep the delivery lane open; receipt left retryable_failure for reconciliation',
          }));
          return json({ ok: true, accepted: false, deferred: true, error: code });
        }
        return json({ ok: false, error: 'publish_failed', retryable: true }, 503);
      }
    }
    return json({ ok: true, accepted: true, replayed: accepted.replay });
  } catch {
    return json({ ok: false, error: 'receipt_unavailable' }, 503);
  }
}

// fetchApiJson was removed 2026-09-04, superseded by fetchApiJsonTracked.
// It sent no User-Agent, which is why every call it made returned api_403:
// an empty UA from a Cloudflare Worker IP is a standard bot-filter signature,
// and a WAF answers that with 403 rather than the 401 BabyLoveGrowth's docs
// describe for a bad key. Proven 2026-09-04 — the same key, same URL and same
// headers succeeded from curl, which sends a UA of its own.
// It also had no notion of the provider's two-request-per-window limit.

// The provider has never committed to one envelope shape, and a shape we did
// not recognize used to throw `api_list_invalid` before a single article was
// examined. That is exactly how "Youth Basketball Drills: A Parent Coach's
// Ready-to-Run Guide" was lost: the webhook for it never landed, and the
// six-hourly reconciliation that exists to catch missed webhooks had never
// published anything in its life (zero `api_reconciliation` rows in
// external_article_receipts as of 2026-08-10). Accept every list-shaped
// envelope the provider plausibly returns, and when none of them match, log
// the top-level keys we actually got so the next failure is one query away
// instead of another silent week.
const LISTING_KEYS = ['articles', 'data', 'items', 'results', 'records'] as const;

function extractListing(payload: unknown): { listing: unknown[] | null; envelopeKeys: string[] } {
  if (Array.isArray(payload)) return { listing: payload, envelopeKeys: [] };
  const envelope = objectValue(payload);
  if (!envelope) return { listing: null, envelopeKeys: [] };
  const envelopeKeys = Object.keys(envelope).slice(0, 20);
  for (const key of LISTING_KEYS) {
    if (Array.isArray(envelope[key])) return { listing: envelope[key] as unknown[], envelopeKeys };
  }
  // One level of nesting, e.g. { data: { articles: [...] } }.
  for (const key of LISTING_KEYS) {
    const nested = objectValue(envelope[key]);
    if (!nested) continue;
    for (const inner of LISTING_KEYS) {
      if (Array.isArray(nested[inner])) return { listing: nested[inner] as unknown[], envelopeKeys };
    }
  }
  return { listing: null, envelopeKeys };
}

const RECONCILE_BATCH = 50;

/**
 * The provider allows TWO requests per window (`RateLimit-Limit: 2`, observed
 * live 2026-09-04). The original loop fetched the listing and then full detail
 * for all 50 summaries on every run — 51 requests against a ceiling of 2 —
 * with no backoff, so everything after the second call was throttled. Every
 * run, since the function was written.
 *
 * Two changes make it fit inside the budget:
 *
 *   1. Ask the database which article ids already have a receipt BEFORE
 *      spending any API calls. Detail is fetched only for genuinely new
 *      articles. Steady state is now ONE request per run (just the listing),
 *      because on most days nothing is new.
 *
 *   2. Stop when the budget is gone instead of hammering into throttling.
 *      Reconciliation runs every six hours, so a backlog drains across runs.
 *      Deferred work is reported, not silently dropped.
 *
 * Do not "optimize" this back into fetching detail up front. That is the bug.
 */
interface RateBudget {
  remaining: number;
  resetAt: number | null;
}

async function fetchApiJsonTracked(
  url: string,
  apiKey: string,
  budget: RateBudget,
): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'parent-coach-desk-babylove-importer',
    },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  const remaining = Number(response.headers.get('RateLimit-Remaining'));
  if (Number.isFinite(remaining)) budget.remaining = remaining;
  else budget.remaining -= 1;
  const reset = Number(response.headers.get('RateLimit-Reset'));
  if (Number.isFinite(reset)) budget.resetAt = reset;

  if (response.status === 429) throw new BabyLoveFailure('api_rate_limited');
  if (!response.ok) throw new BabyLoveFailure(`api_${response.status}`);
  return response.json();
}

/**
 * Which of these provider article ids do we already have a receipt for, in any
 * state other than a failure worth retrying? Answered in one query so the
 * listing can be filtered without spending API calls.
 */
async function existingReceiptIds(db: D1Database, ids: string[]): Promise<Set<string>> {
  if (!ids.length) return new Set();
  const placeholders = ids.map(() => '?').join(',');
  const rows = await db.prepare(
    `SELECT DISTINCT provider_article_id FROM external_article_receipts
     WHERE provider = 'babylovegrowth'
       AND status IN ('published', 'quarantined', 'processing')
       AND provider_article_id IN (${placeholders})`,
  ).bind(...ids).all<{ provider_article_id: string }>();
  return new Set((rows.results ?? []).map((r) => r.provider_article_id));
}

/**
 * The listing carries a `published` flag. An article the provider has not
 * published yet is a draft on their side and must not go live on ours.
 * Observed 2026-09-04: article 812356 sat in the listing with
 * `"published": false` while still being actively edited.
 */
function providerHasPublished(record: Record<string, unknown> | null): boolean {
  if (!record) return false;
  const flag = record.published;
  if (typeof flag === 'boolean') return flag;
  if (typeof flag === 'string') return flag.toLowerCase() === 'true';
  // Field absent: older payload shape. Treat as publishable, matching the
  // behaviour the webhook lane has always had.
  return flag === undefined || flag === null;
}

export async function reconcileBabyLoveArticles(env: BabyLoveEnv): Promise<{ scanned: number; published: number; skipped: number; failed: number }> {
  if (!enabled(env.BABYLOVE_AUTOPUBLISH_ENABLED)) return { scanned: 0, published: 0, skipped: 0, failed: 0 };
  const missing = [
    !env.BABYLOVE_API_KEY && 'BABYLOVE_API_KEY',
    !env.PCD_OPS_DB && 'PCD_OPS_DB',
    !env.GITHUB_TOKEN && 'GITHUB_TOKEN',
  ].filter(Boolean) as string[];
  if (missing.length) {
    // Name the binding. `reconciliation_unavailable` on its own sent us looking
    // at the provider API when the answer may simply be an unset Worker secret.
    console.error(JSON.stringify({ event: 'babylove_reconciliation_unavailable', missing }));
    throw new BabyLoveFailure('reconciliation_unavailable', `reconciliation_unavailable: ${missing.join(',')}`);
  }
  // Two requests per window is the whole budget. The listing costs one.
  const budget: RateBudget = { remaining: 2, resetAt: null };
  const listingPayload = await fetchApiJsonTracked(API_BASE, env.BABYLOVE_API_KEY!, budget);
  const { listing, envelopeKeys } = extractListing(listingPayload);
  if (!listing) {
    console.error(JSON.stringify({
      event: 'babylove_reconciliation_list_invalid',
      envelope_keys: envelopeKeys,
      payload_type: Array.isArray(listingPayload) ? 'array' : typeof listingPayload,
    }));
    throw new BabyLoveFailure('api_list_invalid');
  }
  if (listing.length > RECONCILE_BATCH) {
    console.warn(JSON.stringify({
      event: 'babylove_reconciliation_truncated',
      returned: listing.length,
      batch: RECONCILE_BATCH,
    }));
  }
  let scanned = 0;
  let published = 0;
  let skipped = 0;
  let failed = 0;
  let deferred = 0;
  const apiKey = env.BABYLOVE_API_KEY!;

  // Pass 1 — no API calls. Identify every candidate, drop provider drafts, and
  // ask the database which ones we already hold.
  const candidates: Array<{ id: string; record: Record<string, unknown> | null }> = [];
  for (const summary of listing.slice(0, RECONCILE_BATCH)) {
    const record = objectValue(summary);
    const id = idValue(record?.id)
      || idValue(record?.article_id)
      || idValue(record?.articleId)
      || idValue(record?.uuid);
    if (!id) {
      failed += 1;
      console.error(JSON.stringify({
        event: 'babylove_reconciliation_item_unidentified',
        item_keys: record ? Object.keys(record).slice(0, 20) : [],
      }));
      continue;
    }
    if (!providerHasPublished(record)) {
      skipped += 1;
      continue;
    }
    candidates.push({ id, record });
  }

  const known = await existingReceiptIds(env.PCD_OPS_DB!, candidates.map((c) => c.id));
  const fresh = candidates.filter((c) => !known.has(c.id));
  skipped += candidates.length - fresh.length;

  // Pass 2 — spend the remaining request budget on genuinely new articles only.
  for (const { id } of fresh) {
    if (budget.remaining <= 0) {
      deferred += 1;
      continue;
    }
    scanned += 1;
    try {
      const detail = await fetchApiJsonTracked(`${API_BASE}/${encodeURIComponent(id)}`, apiKey, budget);
      const article = parseBabyLoveArticle(detail);
      const accepted = await acceptArticle(env, article, 'api_reconciliation');
      if (accepted.receipt.status === 'published') {
        skipped += 1;
        continue;
      }
      await publishReceipt(env, accepted.receipt, article);
      published += 1;
    } catch (error) {
      const code = error instanceof BabyLoveFailure ? error.code : 'reconciliation_item_failed';
      // Throttling is not this article's fault. Leave it for the next run
      // rather than burning it as a failure.
      if (code === 'api_rate_limited') {
        budget.remaining = 0;
        deferred += 1;
        scanned -= 1;
      } else {
        failed += 1;
      }
      console.error(JSON.stringify({ event: 'babylove_reconciliation_item_failed', article_id: id, code }));
    }
  }

  console.log(JSON.stringify({
    event: 'babylove_reconciliation_completed',
    listing_size: listing.length,
    candidates: candidates.length,
    fresh: fresh.length,
    scanned,
    published,
    skipped,
    failed,
    deferred,
    rate_remaining: budget.remaining,
    rate_reset: budget.resetAt,
  }));
  return { scanned, published, skipped, failed };
}
