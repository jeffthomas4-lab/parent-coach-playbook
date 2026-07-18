export interface HowToStep {
  '@type': 'HowToStep';
  position: number;
  name: string;
  text: string;
}

const RUN_HEADING = /^\s*(?:\*\*|__)?how to run it:?\s*(?:\*\*|__)?\s*$/i;
const SECTION_HEADING = /^\s*(?:\*\*|__)[^*_]+(?:\*\*|__)\s*$/;
const NUMBERED_STEP = /^\s*\d+[.)]\s+(.+?)\s*$/;

function plainText(markdown: string): string {
  return markdown
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .replace(/\\([\\`*_[\]{}()#+.!-])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract only the numbered instructions visibly published under a coaching
 * tip's "How to run it" section. Returning null is intentional: a page that
 * does not expose real sequential instructions must not claim HowTo schema.
 */
export function buildCoachingTipHowToSteps(markdown: string): HowToStep[] | null {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const headingIndex = lines.findIndex((line) => RUN_HEADING.test(line));
  if (headingIndex === -1) return null;

  const texts: string[] = [];
  for (const line of lines.slice(headingIndex + 1)) {
    if (SECTION_HEADING.test(line) || /^\s*---+\s*$/.test(line)) break;
    const match = line.match(NUMBERED_STEP);
    if (match) {
      const text = plainText(match[1]);
      if (text) texts.push(text);
    }
  }

  if (texts.length < 2) return null;
  return texts.map((text, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: `Step ${index + 1}`,
    text,
  }));
}
