#!/usr/bin/env node
/**
 * Stamp the commit this build came from into a static asset.
 *
 * WHY THIS EXISTS. Nothing on the live site said which commit it was built
 * from, so "is production current?" could only be answered by diffing the
 * sitemap against the repo (scripts/check-publish-queue-drift.mjs) — which
 * catches missing pages but says nothing about code. It also left the CI
 * deploy guard with no way to ask "what is live right now?" before deciding
 * whether the incoming diff is content-only.
 *
 * Written to public/, so Astro copies it to dist/client/ and the ASSETS
 * binding serves it at /build-info.json. Untracked: it is derived, and
 * tracking it would conflict on every branch, the same trap that
 * reports/editorial/editorial-refresh-queue.json fell into on 2026-08-05.
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function gitSha() {
  // Workers Builds injects the push SHA. Trust it over `git rev-parse` because
  // the build container's checkout may be shallow or detached.
  if (process.env.WORKERS_CI_COMMIT_SHA) return process.env.WORKERS_CI_COMMIT_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const info = {
  schemaVersion: 1,
  commit: gitSha(),
  branch: process.env.WORKERS_CI_BRANCH ?? '',
  builtAt: new Date().toISOString(),
  builtBy: process.env.WORKERS_CI === '1' ? 'workers-builds' : 'local',
  buildId: process.env.WORKERS_CI_BUILD_UUID ?? '',
};

const target = join(ROOT, 'public', 'build-info.json');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, `${JSON.stringify(info, null, 2)}\n`, 'utf8');
console.log(`build-info: ${info.commit.slice(0, 8)} (${info.builtBy})`);
