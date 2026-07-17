#!/usr/bin/env node

import { createInterface } from 'node:readline';
import { readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DETECTORS = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['openai-key', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/g],
  ['anthropic-key', /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/g],
  ['stripe-live-key', /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/g],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{30,}\b/g],
  ['notion-token', /\bsecret_[A-Za-z0-9]{20,}\b/g],
  ['resend-key', /\bre_[A-Za-z0-9]{20,}\b/g],
];

const PLACEHOLDER_MARKERS = [
  'example', 'placeholder', 'your-', 'your_', '<token', '<key', 'redacted',
  'xxxxxxxx', '0000000000000000', 'test-only',
];

export function detectSecrets(text) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    const lower = line.toLowerCase();
    if (PLACEHOLDER_MARKERS.some((marker) => lower.includes(marker))) continue;
    for (const [detector, pattern] of DETECTORS) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) findings.push({ detector, line: index + 1 });
    }
  }
  return findings;
}

function gitLines(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

async function scanCurrentTree() {
  const findings = [];
  const files = gitLines(['ls-files', '--cached', '--others', '--exclude-standard']);
  for (const file of files) {
    let bytes;
    try {
      bytes = await readFile(resolve(file));
    } catch {
      continue;
    }
    if (bytes.length > 5 * 1024 * 1024 || bytes.includes(0)) continue;
    for (const finding of detectSecrets(bytes.toString('utf8'))) {
      findings.push({ scope: 'tree', file, ...finding });
    }
  }
  return findings;
}

async function scanHistory() {
  const findings = [];
  const child = spawn('git', ['log', '--all', '--format=commit %H', '--no-ext-diff', '--unified=0', '-p'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let commit = '(unknown)';
  let file = '(unknown)';
  let stderr = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => { stderr += chunk; });
  const lines = createInterface({ input: child.stdout, crlfDelay: Infinity });
  for await (const line of lines) {
    if (line.startsWith('commit ')) {
      commit = line.slice(7).trim();
      continue;
    }
    if (line.startsWith('diff --git a/')) {
      const match = line.match(/^diff --git a\/(.+?) b\//);
      if (match) file = match[1];
      continue;
    }
    if (!line.startsWith('+') || line.startsWith('+++')) continue;
    for (const finding of detectSecrets(line.slice(1))) {
      findings.push({ scope: 'history', commit, file, detector: finding.detector });
    }
  }
  const exitCode = await new Promise((resolveExit) => child.on('close', resolveExit));
  if (exitCode !== 0) throw new Error(stderr.trim() || `git history scan failed (${exitCode})`);
  return findings;
}

export async function runSecretScan({ history = false } = {}) {
  const findings = await scanCurrentTree();
  if (history) findings.push(...await scanHistory());
  return findings;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const history = process.argv.includes('--history');
  const findings = await runSecretScan({ history });
  if (findings.length > 0) {
    console.error(`Secret scan found ${findings.length} potential credential(s). Values are intentionally redacted:`);
    for (const finding of findings) {
      const location = finding.scope === 'history'
        ? `${finding.file} at commit ${finding.commit}`
        : `${finding.file}:${finding.line}`;
      console.error(`- ${finding.detector}: ${location}`);
    }
    process.exitCode = 1;
  } else {
    console.log(`Secret scan passed for current repository files${history ? ' and complete Git history' : ''}.`);
  }
}
