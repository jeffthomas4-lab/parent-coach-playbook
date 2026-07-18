#!/usr/bin/env node

const DEFAULT_ENDPOINT = 'https://parentcoachdesk.com/api/agent-runs';
const SAFE_ID = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,199}$/;

function endpoint(value = DEFAULT_ENDPOINT) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'parentcoachdesk.com' || url.pathname !== '/api/agent-runs') {
    throw new Error('agent run endpoint is not approved');
  }
  return url.toString();
}

function credential(token = process.env.PCD_AGENT_RUNS_TOKEN) {
  if (!token?.trim()) throw new Error('PCD_AGENT_RUNS_TOKEN is not available in the runtime secret environment');
  return token.trim();
}

function machineId(value, label) {
  if (!SAFE_ID.test(value ?? '')) throw new Error(`${label} is invalid`);
  return value;
}

export async function preflightAgentRunClient(options = {}) {
  const response = await fetch(endpoint(options.endpoint), {
    method: 'HEAD',
    headers: { authorization: `Bearer ${credential(options.token)}` },
    redirect: 'error',
  });
  if (response.status === 204) return { ok: true, status: 204 };
  if (response.status === 403) return { ok: false, status: 403, code: 'credential_rejected' };
  if (response.status === 503) return { ok: false, status: 503, code: 'service_not_configured' };
  return { ok: false, status: response.status, code: 'unexpected_response' };
}

export async function writeAgentRun(input, options = {}) {
  const payload = {
    ...input,
    run_id: machineId(input.run_id, 'run_id'),
    agent: machineId(input.agent, 'agent'),
    venture: machineId(input.venture, 'venture'),
  };
  const response = await fetch(endpoint(options.endpoint), {
    method: 'POST',
    headers: { authorization: `Bearer ${credential(options.token)}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'error',
  });
  if (!response.ok) throw new Error(`agent run write failed with HTTP ${response.status}`);
  return response.json();
}

if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replaceAll('\\', '/')}`).href) {
  if (process.argv[2] !== 'preflight') {
    console.error('usage: node scripts/agent-run-client.mjs preflight');
    process.exit(2);
  }
  try {
    const result = await preflightAgentRunClient();
    console.log(JSON.stringify(result));
    if (!result.ok) process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'agent run preflight failed');
    process.exitCode = 1;
  }
}
