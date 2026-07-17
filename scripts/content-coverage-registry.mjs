import { readFile, stat } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';

const MAX_ITEMS = 5000;
const STATUS = new Set(['current', 'stale']);

export function normalizeCoverageQuery(value) {
  if (typeof value !== 'string') throw new Error('coverage query must be a string');
  const normalized = value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.length > 120 || /[\r\n\0]/.test(normalized)) {
    throw new Error('invalid coverage query');
  }
  return normalized;
}

function iso(value, label) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) {
    throw new Error(`invalid ${label}`);
  }
  return new Date(value).toISOString();
}

function assertExactArray(value, expected, label) {
  if (!Array.isArray(value) || value.length !== expected.length
    || value.some((item, index) => item !== expected[index])) {
    throw new Error(`invalid ${label}`);
  }
}

function insideRoot(root, candidate) {
  const rel = relative(root, candidate);
  return rel !== '' && rel !== '..' && !rel.startsWith(`..${sep}`) && !rel.startsWith(sep);
}

export async function buildContentCoverageSnapshot(registry, { root }) {
  if (!registry || registry.schemaVersion !== 1) throw new Error('invalid registry schemaVersion');
  if (registry.contentRegistryComplete !== false) {
    throw new Error('version 1 registry must remain explicitly partial until a separately approved completeness protocol exists');
  }
  iso(registry.registryAsOf, 'registryAsOf');
  if (!registry.scope || registry.scope.normalizationVersion !== 1) throw new Error('invalid registry scope');
  assertExactArray(registry.scope.surfaces, ['site_search'], 'registry surfaces');
  assertExactArray(registry.scope.languages, ['en'], 'registry languages');
  if (!Array.isArray(registry.items) || registry.items.length > MAX_ITEMS) throw new Error('invalid registry items');

  const projectRoot = resolve(root);
  const seenQueries = new Set();
  const seenRoutes = new Set();
  const contentItems = [];

  for (const item of registry.items) {
    const query = normalizeCoverageQuery(item?.query);
    if (seenQueries.has(query)) throw new Error(`duplicate coverage query: ${query}`);
    seenQueries.add(query);
    if (!STATUS.has(item.status)) throw new Error(`invalid coverage status: ${query}`);
    const asOf = iso(item.asOf, `asOf for ${query}`);
    if (Date.parse(asOf) > Date.parse(registry.registryAsOf)) throw new Error(`future item evidence: ${query}`);
    if (typeof item.route !== 'string' || !/^\/[a-z0-9][a-z0-9/_-]*\/$/.test(item.route)) {
      throw new Error(`invalid coverage route: ${query}`);
    }
    if (seenRoutes.has(item.route)) throw new Error(`duplicate coverage route: ${item.route}`);
    seenRoutes.add(item.route);
    if (typeof item.evidencePath !== 'string' || item.evidencePath.includes('\\')) {
      throw new Error(`invalid evidence path: ${query}`);
    }
    const evidencePath = resolve(projectRoot, item.evidencePath);
    if (!insideRoot(projectRoot, evidencePath)) throw new Error(`evidence path escapes project: ${query}`);
    const evidence = await stat(evidencePath).catch(() => null);
    if (!evidence?.isFile()) throw new Error(`missing evidence file: ${query}`);
    contentItems.push({ query, status: item.status, asOf, route: item.route });
  }

  contentItems.sort((a, b) => a.query.localeCompare(b.query));
  return {
    schemaVersion: 1,
    contentRegistryComplete: false,
    contentItems,
    directoryItems: []
  };
}

export async function loadContentCoverageRegistry({ root, registryPath = 'automation/coverage/content-coverage-v1.json' }) {
  const projectRoot = resolve(root);
  const absolute = resolve(projectRoot, registryPath);
  if (!insideRoot(projectRoot, absolute)) throw new Error('registry path escapes project');
  const registry = JSON.parse(await readFile(absolute, 'utf8'));
  return buildContentCoverageSnapshot(registry, { root: projectRoot });
}
