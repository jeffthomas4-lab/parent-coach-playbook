#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contract = JSON.parse(fs.readFileSync(path.join(root, 'automation/public-intake-contract.json'), 'utf8'));
const allowed = new Set(['public', 'default-off', 'internal']);
const errors = [];
const seen = new Set();
for (const route of contract.routes ?? []) {
  if (!route.source || seen.has(route.source)) { errors.push(`duplicate or missing source: ${route.source ?? '(missing)'}`); continue; }
  seen.add(route.source);
  if (!allowed.has(route.exposure)) errors.push(`${route.source}: invalid exposure`);
  const absolute = path.join(root, route.source);
  if (!fs.existsSync(absolute)) { errors.push(`${route.source}: source missing`); continue; }
  const source = fs.readFileSync(absolute, 'utf8');
  if (!source.includes('export const POST')) errors.push(`${route.source}: not a POST route`);
  for (const token of route.requires ?? []) if (!source.includes(token)) errors.push(`${route.source}: missing ${token}`);
}
if (errors.length) {
  console.error(`Public-intake contract failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Public-intake contract passed for ${seen.size} classified write surfaces.`);
