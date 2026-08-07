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
//
// CORPSES MUST LEAVE .git/refs. Fixed 2026-08-07.
//
// The original version renamed in place: .git/refs/.../foo.lock became
// .git/refs/.../foo.lock.cleared-<ts>. Harmless for .git/HEAD.lock, which sits
// at the .git root where git does not look for refs. Destructive under
// .git/refs/**, because everything in that tree IS a ref. Git read each corpse
// as a ref, the file was zero bytes, so the ref resolved to an all-zeros SHA.
// Fifty broken refs accumulated that way and `git fetch --prune` died on
// "fatal: bad object refs/remotes/origin/codex/babylove-direct-publishing
// .lock.cleared-1786029318 / did not send all necessary objects". Every fetch,
// and therefore every deploy that depends on one, was blocked by the script
// that exists to unblock git.
//
// Corpses now move to .git/stale-locks/ with a flattened name. That directory
// is not a ref namespace, so git never parses what lands there.

import { readdirSync, statSync, renameSync, existsSync, appendFileSync, mkdirSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

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

// Where corpses go. Not a ref namespace, so git never parses anything here.
const graveyard = join(gitDir, 'stale-locks');

// Collect *.lock under .git, excluding .git/objects, our own graveyard, and
// already-cleared corpses. Depth raised from 4 to 12: refs nest deeply
// (refs/remotes/origin/dependabot/npm_and_yarn/astrojs/cloudflare-14.1.4.lock
// is depth 7) and the old ceiling silently skipped the very ref locks that
// block a fetch.
const found = [];
const strays = [];
const walk = (dir, depth = 0) => {
  if (depth > 12) return;
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'objects' || entry.name === 'stale-locks') continue;
      walk(full, depth + 1);
    } else if (entry.name.endsWith('.lock')) {
      found.push(full);
    } else if (/\.lock\.[^\\/]+$/.test(entry.name)) {
      // A corpse left in place by any tool that renamed a lock instead of
      // moving it out of the ref tree. The pre-2026-08-07 version of THIS
      // script used ".lock.cleared-<ts>", but matching only that suffix missed
      // every corpse the agents left under their own invented names —
      // .lock.old3, .lock.old5, .lock.old7, .lock.bak, .lock.stale1,
      // .lock.stale-20260720, .lock.rm were all found still sitting in repos on
      // 2026-08-07. Nothing git writes has ".lock." in the middle of a name, so
      // the general pattern is the safe one and the narrow one was the bug.
      strays.push(full);
    }
  }
};
walk(gitDir);

const now = Date.now();
const cleared = [];
const live = [];

// Flatten a path under .git into a single filename, so two locks with the same
// basename in different ref directories cannot collide in the graveyard.
const corpseName = (full) =>
  `${relative(gitDir, full).split(sep).join('__')}.cleared-${Math.floor(now / 1000)}`;

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
    mkdirSync(graveyard, { recursive: true });
    renameSync(lock, join(graveyard, corpseName(lock)));
    cleared.push({ lock, ageMinutes });
  } catch (error) {
    console.error(`  could not clear ${lock}: ${error.message}`);
  }
}

// Evacuate corpses the old in-place version left behind. Under .git/refs each
// one is a zero-byte ref that makes `git fetch` fail with "bad object", so this
// is a repair pass, not housekeeping.
const evacuated = [];
for (const stray of strays) {
  if (dryRun) {
    evacuated.push(stray);
    continue;
  }
  try {
    mkdirSync(graveyard, { recursive: true });
    renameSync(stray, join(graveyard, corpseName(stray)));
    evacuated.push(stray);
  } catch (error) {
    console.error(`  could not evacuate ${stray}: ${error.message}`);
  }
}

// A corpse that was renamed while it sat in .git/refs did not just leave a file
// behind — git read it once and it may now be a REAL entry in .git/packed-refs,
// where no filesystem walk can see it. Those are branches with names like
// "main.lock.stale-20260803". They are not broken (they point at real commits),
// so fetch survives them, but they are junk branches that accumulate forever and
// make `git branch` unreadable. Report them; only delete with an explicit flag,
// and only when the commit also lives on a real branch so nothing is orphaned.
const deleteJunkRefs = args.includes('--delete-junk-refs');
const junkRefs = [];
try {
  const out = execFileSync('git', ['for-each-ref', '--format=%(objectname) %(refname)'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  for (const line of out.split('\n')) {
    const [sha, refname] = line.trim().split(' ');
    if (!refname || !/\.lock\./.test(refname)) continue;
    let safe = false;
    try {
      const holders = execFileSync('git', ['branch', '--all', '--contains', sha], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
        .split('\n')
        .map((l) => l.replace(/^[*+ ]+/, '').trim())
        .filter((l) => l && !/\.lock\./.test(l));
      safe = holders.length > 0;
    } catch {
      safe = false;
    }
    junkRefs.push({ sha, refname, safe });
  }
} catch {
  // No git on PATH, or not a repo. The file-level pass above still stands.
}

const fmt = (m) => (m < 60 ? `${Math.round(m)}m` : `${(m / 60).toFixed(1)}h`);

if (live.length > 0) {
  console.log(`Left alone (younger than ${minAgeMinutes}m — a git process may be running):`);
  for (const { lock, ageMinutes } of live) console.log(`  ${lock}  (${fmt(ageMinutes)} old)`);
}

if (evacuated.length > 0) {
  console.log(
    `${dryRun ? 'Would evacuate' : 'Evacuated'} ${evacuated.length} corpse(s) left in place by the old in-place rename:`,
  );
  for (const stray of evacuated) console.log(`  ${stray}`);
  const brokenRefs = evacuated.filter((p) => relative(gitDir, p).split(sep)[0] === 'refs');
  if (brokenRefs.length > 0) {
    console.log(
      `  ${brokenRefs.length} of those were inside .git/refs and were being read as broken refs. ` +
        'Run `git fetch origin --prune` now; it should stop reporting "bad object".',
    );
  }
}

const deletedRefs = [];
if (junkRefs.length > 0) {
  console.log(`Junk branches from renamed locks (${junkRefs.length}):`);
  for (const { sha, refname, safe } of junkRefs) {
    console.log(`  ${sha.slice(0, 8)}  ${refname}${safe ? '' : '   <-- NOT on any real branch, keeping'}`);
  }
  const removable = junkRefs.filter((r) => r.safe);
  if (deleteJunkRefs && !dryRun) {
    for (const { sha, refname } of removable) {
      try {
        execFileSync('git', ['update-ref', '-d', refname, sha], { stdio: ['ignore', 'ignore', 'pipe'] });
        deletedRefs.push(refname);
      } catch (error) {
        console.error(`  could not delete ${refname}: ${error.message}`);
      }
    }
    console.log(`Deleted ${deletedRefs.length} junk branch(es). Every commit they held is still on a real branch.`);
  } else if (removable.length > 0) {
    console.log(
      `  ${removable.length} are safe to delete (their commits are on real branches too). ` +
        'Re-run with --delete-junk-refs to remove them.',
    );
  }
}

if (cleared.length === 0 && evacuated.length === 0 && deletedRefs.length === 0) {
  if (live.length === 0 && junkRefs.length === 0) console.log('No lock files present. Git is unblocked.');
  else if (live.length > 0) console.log('No stale locks to clear.');
  process.exit(0);
}

if (cleared.length > 0) {
  console.log(`${dryRun ? 'Would clear' : 'Cleared'} ${cleared.length} stale lock file(s):`);
  for (const { lock, ageMinutes } of cleared) console.log(`  ${lock}  (${fmt(ageMinutes)} old)`);
}

if (!dryRun) {
  const logPath = join('reports', 'ops', 'stale-locks.log');
  try {
    mkdirSync(dirname(logPath), { recursive: true });
    const stamp = new Date().toISOString();
    for (const { lock, ageMinutes } of cleared) {
      appendFileSync(logPath, `${stamp}\tgit:unlock\tmanual\tcleared\t${lock}\tage=${fmt(ageMinutes)}\n`);
    }
    for (const stray of evacuated) {
      appendFileSync(logPath, `${stamp}\tgit:unlock\tmanual\tevacuated\t${stray}\tage=unknown\n`);
    }
    console.log(`Logged to ${logPath}`);
  } catch {
    // Logging is a convenience, never a reason to fail the unlock.
  }
}
