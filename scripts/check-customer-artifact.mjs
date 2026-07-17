import { readFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), "dist", "client");
const representativePages = [
  ["home", "index.html"],
  ["camp submission", "camps/submit/index.html"],
  ["camp suggestion", "camps/suggest/index.html"],
  ["search", "search/index.html"],
  ["terms", "terms/index.html"],
  ["disclosure", "disclosure/index.html"],
  ["accessibility", "accessibility/index.html"],
  ["corrections", "about/corrections/index.html"],
];

const failures = [];
const load = async (path) => {
  try {
    return await readFile(join(root, path), "utf8");
  } catch (error) {
    failures.push(`${path}: missing from the production client artifact`);
    return "";
  }
};

for (const [name, path] of representativePages) {
  const html = await load(path);
  if (!html) continue;

  const checks = [
    [/<html\b[^>]*\blang=["']en["']/i, "English document language"],
    [/<title>\s*[^<]+\s*<\/title>/i, "non-empty document title"],
    [/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["'][^"']+["']/i, "meta description"],
    [/<main\b[^>]*\bid=["']main["']/i, "main landmark with id=main"],
    [/<a\b[^>]*\bhref=["']#main["']/i, "skip link to main content"],
    [/<h1\b/i, "page heading"],
  ];

  for (const [pattern, requirement] of checks) {
    if (!pattern.test(html)) failures.push(`${name} (${path}): missing ${requirement}`);
  }

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) failures.push(`${name} (${path}): expected one h1, found ${h1Count}`);

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(image[0])) {
      failures.push(`${name} (${path}): image without an alt attribute`);
    }
  }
}

const sitemap = `${await load("sitemap.xml")}\n${await load("sitemap-content.xml")}`;
for (const forbidden of ["/admin", "/api/admin", "/admin/preview"]) {
  if (sitemap.includes(forbidden)) failures.push(`sitemaps expose protected route: ${forbidden}`);
}

const robots = await load("robots.txt");
if (!/Disallow:\s*\/admin\//i.test(robots)) failures.push("robots.txt does not disallow /admin/");
if (!/Sitemap:\s*https:\/\/parentcoachdesk\.com\/sitemap\.xml/i.test(robots)) {
  failures.push("robots.txt does not identify the canonical production sitemap");
}

if (failures.length > 0) {
  console.error(`Customer artifact contract failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Customer artifact contract passed for ${representativePages.length} representative public pages.`);
console.log("Verified: document structure, basic image alternatives, policy/support artifacts, and public-discovery boundaries.");
console.log("Not verified here: SSR directory data, form submission behavior, CSS rendering, keyboard behavior, or live Access enforcement.");
