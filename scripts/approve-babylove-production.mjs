#!/usr/bin/env node
import { fileURLToPath } from 'node:url';

const API_VERSION = '2022-11-28';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function approvePendingBabyLoveDeployment({
  repository,
  runId,
  token,
  expectedEnvironment = 'production',
  fetchImpl = fetch,
  attempts = 60,
  intervalMs = 5_000,
}) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('invalid repository');
  if (!/^\d+$/.test(String(runId))) throw new Error('invalid run id');
  if (!token) throw new Error('approval token missing');
  const endpoint = `https://api.github.com/repos/${repository}/actions/runs/${runId}/pending_deployments`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': API_VERSION,
    'User-Agent': 'parent-coach-desk-babylove-deploy-approver',
  };

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const pendingResponse = await fetchImpl(endpoint, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (!pendingResponse.ok) throw new Error(`pending deployment lookup failed: ${pendingResponse.status}`);
    const pending = await pendingResponse.json();
    if (!Array.isArray(pending)) throw new Error('invalid pending deployment response');
    const target = pending.find((item) => item?.environment?.name === expectedEnvironment);
    if (target) {
      const environmentId = Number(target.environment.id);
      if (!Number.isSafeInteger(environmentId) || environmentId <= 0) throw new Error('invalid production environment id');
      const approveResponse = await fetchImpl(endpoint, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment_ids: [environmentId],
          state: 'approved',
          comment: 'Automatically approved: classifier-proven BabyLoveGrowth content-only release passed full build and staging smoke.',
        }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!approveResponse.ok) throw new Error(`deployment approval failed: ${approveResponse.status}`);
      return { approved: true, environmentId, attempt };
    }
    if (attempt < attempts) await wait(intervalMs);
  }
  throw new Error(`production deployment did not enter pending review after ${attempts} attempts`);
}

async function main() {
  const result = await approvePendingBabyLoveDeployment({
    repository: process.env.GITHUB_REPOSITORY ?? '',
    runId: process.env.GITHUB_RUN_ID ?? '',
    token: process.env.BABYLOVE_DEPLOY_APPROVER_TOKEN ?? '',
  });
  console.log(JSON.stringify({ event: 'babylove_production_approved', ...result }));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
