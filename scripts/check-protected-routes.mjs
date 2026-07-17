#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOTS = ['src/pages/admin', 'src/pages/api/admin'];
const ROUTE_EXTENSIONS = new Set(['.astro', '.ts', '.md']);

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (ROUTE_EXTENSIONS.has(path.slice(path.lastIndexOf('.')))) files.push(path);
  }
  return files;
}

export function verifyProtectedRouteSource(source, control, sourcePath = '') {
  const failures = [];
  const hasAdmin = /\brequireAdmin\s*\(/.test(source);
  const hasOrigin = /\brequireSameOrigin\s*\(/.test(source);
  const isStatic = /export\s+const\s+prerender\s*=\s*true/.test(source);
  if (control === 'access-only' && !isStatic && !sourcePath.endsWith('.md')) {
    failures.push('Access-only route must be statically rendered Markdown or declare prerender=true');
  }
  if ((control === 'app-auth' || control === 'mutation') && !hasAdmin) {
    failures.push(`${control} route must call requireAdmin`);
  }
  if (control === 'mutation' && !hasOrigin) {
    failures.push('mutation route must call requireSameOrigin');
  }
  if (!['access-only', 'app-auth', 'mutation'].includes(control)) {
    failures.push(`unknown control ${JSON.stringify(control)}`);
  }
  return failures;
}

export async function verifyProtectedRoutes(contractPath = 'automation/protected-route-contract.json') {
  const contract = JSON.parse(await readFile(resolve(contractPath), 'utf8'));
  const declared = new Map(contract.routes.map((route) => [route.source, route.control]));
  const actual = (await Promise.all(ROOTS.map((root) => walk(root)))).flat().sort();
  const failures = [];

  for (const file of actual) {
    if (!declared.has(file)) {
      failures.push(`${file}: protected route is not classified in the contract`);
      continue;
    }
    const source = await readFile(resolve(file), 'utf8');
    for (const failure of verifyProtectedRouteSource(source, declared.get(file), file)) {
      failures.push(`${file}: ${failure}`);
    }
  }
  for (const file of declared.keys()) {
    if (!actual.includes(file)) failures.push(`${file}: contract entry has no route file`);
  }
  return { routeCount: actual.length, failures };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const { routeCount, failures } = await verifyProtectedRoutes();
  if (failures.length > 0) {
    console.error('Protected-route contract failed:');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`Protected-route contract passed for ${routeCount} routes across /admin* and /api/admin*.`);
  }
}
