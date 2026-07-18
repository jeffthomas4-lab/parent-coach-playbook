#!/usr/bin/env node
const valueAfter = (flag) => {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
};
const origin = valueAfter('--origin');
const target = valueAfter('--target');
if (!origin || !['staging', 'production'].includes(target)) {
  throw new Error('usage: smoke-worker-deployment.mjs --origin <https-origin> --target staging|production');
}

const checks = [
  { path: '/', statuses: [200] },
  // This is intentionally a non-mutating probe. A missing staging task token
  // is reported as 503 while production must have its configured token and
  // reject an unauthenticated caller with 403.
  { path: '/api/agent-runs', method: 'HEAD', statuses: target === 'production' ? [403] : [403, 503] },
];
if (target === 'production') checks.push({ path: '/admin', statuses: [302] });

for (const check of checks) {
  const response = await fetch(new URL(check.path, origin), {
    method: check.method ?? 'GET',
    redirect: 'manual',
    headers: { 'user-agent': `pcd-${target}-deployment-smoke/1` },
  });
  if (!check.statuses.includes(response.status)) {
    throw new Error(`${target} smoke failed: ${check.path} returned ${response.status}; expected ${check.statuses.join(' or ')}`);
  }
  console.log(`${target} smoke passed: ${check.path} -> ${response.status}`);
}
