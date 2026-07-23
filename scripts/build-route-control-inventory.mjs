import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';

const pagesRoot = new URL('../src/pages/', import.meta.url);
const rootPath = decodeURIComponent(pagesRoot.pathname).replace(/^\/(?:[A-Za-z]:\/)/, (match) => match.slice(1));
const output = new URL('../automation/route-control-inventory.json', import.meta.url);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (['.astro', '.md', '.ts'].includes(extname(entry.name)) && !entry.name.includes('.WIP-')) files.push(path);
  }
  return files;
}

function routeFromFile(file) {
  let path = relative(rootPath, file).split(sep).join('/');
  path = path.replace(/\.(astro|md|ts)$/, '').replace(/\/index$/, '');
  path = path.replace(/\[\.\.\.([^\]]+)\]/g, ':$1*').replace(/\[([^\]]+)\]/g, ':$1');
  return path ? `/${path}` : '/';
}

function cacheClass(route) {
  if (route === '/admin' || route.startsWith('/admin/')) return 'admin_preview';
  if (route === '/api' || route.startsWith('/api/')) return 'api';
  if (route === '/trust' || route.startsWith('/trust/')) return 'trust_customer_payment';
  if (route.startsWith('/camp-photos/')) return 'public_media_dynamic';
  return 'public_html';
}

function authBoundary(route) {
  if (route === '/admin' || route.startsWith('/admin/') || route.startsWith('/api/admin/')) return 'cloudflare_access_and_app_authorization';
  if (route.startsWith('/api/cron/') || route === '/api/agent-runs' || route === '/api/camps/check') return 'shared_secret';
  if (route.startsWith('/api/slack/')) return 'provider_signature';
  return 'public';
}

const limiterByRoute = new Map([
  ['POST /api/camps/submit', 'PUBLIC_SUBMISSION_RATE_LIMITER'],
  ['POST /api/proof-submit', 'PUBLIC_SUBMISSION_RATE_LIMITER'],
  ['POST /api/camps/suggest', 'PUBLIC_SUBMISSION_RATE_LIMITER'],
  ['POST /api/trust/request', 'TRUST_RATE_LIMITER'],
  ['POST /api/camps/:slug/reviews/submit', 'COMMUNITY_RATE_LIMITER'],
  ['POST /api/search-event', 'DEMAND_RATE_LIMITER'],
  ['POST /api/camps/:slug/claim', 'OWNER_RATE_LIMITER'],
]);

const routes = [];
for (const file of (await walk(rootPath)).sort()) {
  const route = routeFromFile(file);
  const source = await readFile(file, 'utf8');
  const exported = [...source.matchAll(/export\s+const\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\b/g)].map((match) => match[1]);
  const methods = exported.length ? [...new Set(exported)].sort() : ['GET'];
  routes.push({
    route,
    methods,
    source: relative(rootPath, file).split(sep).join('/'),
    cache_class: cacheClass(route),
    auth_boundary: authBoundary(route),
    public_write_limiter: methods.includes('POST') && authBoundary(route) === 'public'
      ? limiterByRoute.get(`POST ${route}`) ?? 'MISSING_REVIEW'
      : null,
  });
}

const serialized = `${JSON.stringify({
  schema_version: 1,
  generated_from: 'src/pages',
  route_count: routes.length,
  default_rule: 'Every source route must be classified; public writes require an explicit limiter or documented exemption.',
  routes,
}, null, 2)}\n`;

if (process.argv.includes('--check')) {
  const existing = await readFile(output, 'utf8').catch(() => '');
  if (existing !== serialized) {
    console.error('Route control inventory is stale. Run node scripts/build-route-control-inventory.mjs.');
    process.exitCode = 1;
  } else {
    console.log(`Route control inventory is current: ${routes.length} routes.`);
  }
} else {
  await writeFile(output, serialized);
  console.log(`Route control inventory written: ${routes.length} routes.`);
}
