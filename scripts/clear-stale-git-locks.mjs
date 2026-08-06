#!/usr/bin/env node
// Clear stale .git lock files.
//
// WHY: this repo sits on a Windows volume that is also mounted into the Cowork
// Linux sandbox. Git processes get killed or time out against that mount often,
// and each one can leave a *.lock behind. A leftover HEAD.lock blocks every
// operation that updates HEAD — merge, commit, rebase — and git reports it as a
// single line ("Another git process seems to be running...") that is trivially
// missed in a long paste. On 2026-08-05 one such lock sat for hours and made a
// merge appear to succeed three separate times without ever producing a commit.
// An audit that day found 61 lock corpses going back to 2026-07-28, every one
// cleared silently by some agent under its own suffix, never reported.
//
// scripts/safe-commit.sh does this for agents. This script is the same guard for
// a human at a PowerShell prompt:  npm run git:unlock
//
// SAFETY: a lock younger than --min-age-minutes (default 2) might belong to a
// git process that is genuinely running, so it is reported and left alone. This
// script never touches anything under .git/objects (pack/maintenance locks are
// git's own business) and never deletes — it renames, because this filesystem
// refuses to unlink these files ("Operation not permitted") even though mv works.

import { readdirSync, statSync, renameSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const args = process.argv.slice(2);
const value = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const minAgeMinutes = Number(value('--min-age-minutes', '2'));
const dryRun = args.includes('--dry-run');

const gitDir = '.git';
if (!existsSync(gitDir)) {
  console.error('clear-stale-git-locks: no .git directory here. Run from the repo root.');
  process.exit(1);
}

// Collect *.lock under .git, excluding .git/objects and already-cleared corpses.
const found = [];
const walk = (dir, depth = 0) => {
  if (depth > 4) return;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'objects') continue;
      walk(full, depth + 1);
    } else if (entry.name.endsWith('.lock')) {
      found.push(full);
    }
  }
};
walk(gitDir);

const now = Date.now();
const cleared = [];
const live = [];

for (const lock of found) {
  let ageMinutes;
  try {
    ageMinutes = (now - statSync(lock).mtimeMs) / 60_000;
  } catch {
    continue;
  }
  if (ageMinutes < minAgeMinutes) {
    live.push({ lock, ageMinutes });
    continue;
  }
  if (dryRun) {
    cleared.push({ lock, ageMinutes });
    continue;
  }
  try {
    renameSync(lock, `${lock}.cleared-${Math.floor(now / 1000)}`);
    cleared.push({ lock, ageMinutes });
  } catch (error) {
    console.error(`  could not clear ${lock}: ${error.message}`);
  }
}

const fmt = (m) => (m < 60 ? `${Math.round(m)}m` : `${(m / 60).toFixed(1)}h`);

if (live.length > 0) {
  console.log(`Left alone (younger than ${minAgeMinutes}m — a git process may be running):`);
  for (const { lock, ageMinutes } of live) console.log(`  ${lock}  (${fmt(ageMinutes)} old)`);
}

if (cleared.length === 0) {
  console.log(live.length > 0 ? 'No stale locks to clear.' : 'No lock files present. Git is unblocked.');
  process.exit(0);
}

console.log(`${dryRun ? 'Would clear' : 'Cleared'} ${cleared.length} stale lock file(s):`);
for (const { lock, ageMinutes } of cleared) console.log(`  ${lock}  (${fmt(ageMinutes)} old)`);

if (!dryRun) {
  const logPath = join('reports', 'ops', 'stale-locks.log');
  try {
    mkdirSync(dirname(logPath), { recursive: true });
    const stamp = new Date().toISOString();
    for (const { lock, ageMinutes } of cleared) {
      appendFileSync(logPath, `${stamp}\tgit:unlock\tmanual\tcleared\t${lock}\tage=${fmt(ageMinutes)}\n`);
    }
    console.log(`Logged to ${logPath}`);
  } catch {
    // Logging is a convenience, never a reason to fail the unlock.
  }
}
