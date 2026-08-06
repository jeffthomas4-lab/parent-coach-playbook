import { readFile } from 'node:fs/promises';

const requiredChecks = [
  ['src/layouts/ArticleLayout.astro', 'data-human-review'],
  ['src/components/Footer.astro', '/ai-transparency/'],
  ['src/pages/terms.astro', 'AI-assisted and synthetic content'],
  ['src/pages/disclosure.astro', 'AI transparency'],
  ['src/pages/ai-transparency.astro', 'not a certification of legal compliance'],
  ['AI-CONTENT-REGISTER.json', 'pcd-editorial-2026-08-03'],
];

for (const [file, expected] of requiredChecks) {
  const value = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  if (!value.includes(expected)) throw new Error(`${file} is missing: ${expected}`);
}

const baseLayout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
if (baseLayout.includes('AIContentNotice')) throw new Error('BaseLayout still mounts the removed general AI notice');

const register = await readFile(new URL('../AI-CONTENT-REGISTER.json', import.meta.url), 'utf8');
if (register.includes('pcd-sitewide')) throw new Error('AI content register still claims a removed sitewide notice');
if (!register.includes('internal provenance only; no per-image public notice')) {
  throw new Error('AI content register does not reflect the removal of public illustration notices');
}

const illo = await readFile(new URL('../src/components/Illo.astro', import.meta.url), 'utf8');
const forbiddenIllustrationUi = [
  'AI-generated illustration.',
  'data-ai-origin=',
  'data-ai-disclosure-id=',
  'aria-describedby=',
  'detailsLink',
  'disclosure?:',
  'ai-illustration-disclosure',
  '/ai-transparency/',
];
for (const forbidden of forbiddenIllustrationUi) {
  if (illo.includes(forbidden)) throw new Error(`Illo still exposes removed illustration UI: ${forbidden}`);
}

const homepage = await readFile(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
if (homepage.includes('detailsLink={false}') || homepage.includes('disclosure="overlay"')) {
  throw new Error('Homepage still passes removed illustration disclosure properties');
}

const publicPolicyFiles = await Promise.all([
  'src/pages/terms.astro',
  'src/pages/disclosure.astro',
  'src/pages/ai-transparency.astro',
].map(async (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8')));
const publicPolicyCopy = publicPolicyFiles.join('\n');
for (const forbidden of ['AI-generated illustration', 'AI-generated or AI-modified', 'Illustrations and AI-assisted']) {
  if (publicPolicyCopy.includes(forbidden)) throw new Error(`Public policy copy still advertises illustration disclosure: ${forbidden}`);
}

console.log(`AI transparency contract verified (${requiredChecks.length + forbiddenIllustrationUi.length + 7} checks).`);
