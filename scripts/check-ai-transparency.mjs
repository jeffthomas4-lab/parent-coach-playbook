import { readFile } from 'node:fs/promises';
const checks=[['src/layouts/BaseLayout.astro','AIContentNotice'],['src/components/Illo.astro','data-ai-origin="ai_generated"'],['src/layouts/ArticleLayout.astro','data-human-review'],['src/components/Footer.astro','/ai-transparency/'],['src/pages/terms.astro','AI-assisted and synthetic content'],['src/pages/disclosure.astro','AI transparency'],['src/pages/ai-transparency.astro','not a certification of legal compliance'],['AI-CONTENT-REGISTER.json','pcd-illustration-2026-08-03']];
for(const [file,expected] of checks){const value=await readFile(new URL(`../${file}`,import.meta.url),'utf8');if(!value.includes(expected))throw new Error(`${file} is missing: ${expected}`);}
console.log(`AI transparency contract verified (${checks.length} checks).`);
