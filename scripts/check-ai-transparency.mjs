import { readFile } from 'node:fs/promises';
const checks=[['src/components/Illo.astro','data-ai-origin="ai_generated"'],['src/layouts/ArticleLayout.astro','data-human-review'],['src/components/Footer.astro','/ai-transparency/'],['src/pages/terms.astro','AI-assisted and synthetic content'],['src/pages/disclosure.astro','AI transparency'],['src/pages/ai-transparency.astro','not a certification of legal compliance'],['AI-CONTENT-REGISTER.json','pcd-illustration-2026-08-03']];
for(const [file,expected] of checks){const value=await readFile(new URL(`../${file}`,import.meta.url),'utf8');if(!value.includes(expected))throw new Error(`${file} is missing: ${expected}`);}
const baseLayout=await readFile(new URL('../src/layouts/BaseLayout.astro',import.meta.url),'utf8');
if(baseLayout.includes('AIContentNotice'))throw new Error('BaseLayout still mounts the removed general AI notice');
const register=await readFile(new URL('../AI-CONTENT-REGISTER.json',import.meta.url),'utf8');
if(register.includes('pcd-sitewide'))throw new Error('AI content register still claims a removed sitewide notice');
console.log(`AI transparency contract verified (${checks.length+2} checks).`);
