#!/bin/sh
# safe-commit.sh — commit workaround for Cowork agents running in the sandboxed
# Linux bash tool against this repo's Windows-mounted working directory.
#
# WHY THIS EXISTS (found 2026-07-28, pcd-editorial-writer run):
#   Plain `git add`/`git commit` in this environment can hang past any single
#   tool call's time budget, for two separate reasons:
#     1. git's default fsync behavior blocks on this network-mounted volume
#        when writing loose objects. Fix: core.fsync=none / core.fsyncMethod=none.
#     2. `git commit` (and `git status`) refresh the index by stat()-ing every
#        tracked file to catch out-of-band changes. With 1000+ tracked files,
#        that per-file stat latency on this mount blows past 45s even with
#        fsync fixed and even with `--no-verify` (hooks skipped). This is the
#        same reason `git status` and `git count-objects -v` hang here too.
#   Neither is fixable with a config flag alone. The workaround is to never let
#   git refresh/scan the working tree: reset the index straight from HEAD,
#   stage only the exact paths given, and build the commit with plumbing
#   (write-tree / commit-tree / update-ref), which reads only the index and
#   object store and never stats the working tree. Each plumbing step finishes
#   in 1-3s on this mount instead of hanging.
#
#   Stale `.git/*.lock` files are common after a killed/timed-out git process.
#   This filesystem also refuses to unlink them (`rm` fails with "Operation
#   not permitted") even though `mv` works fine, so this script clears locks
#   by renaming them aside rather than deleting them.
#
#   STALE LOCKS ARE NOT COSMETIC (learned 2026-08-05). A leftover
#   `.git/HEAD.lock` blocks every operation that updates HEAD, including
#   `git merge` — which then fails with a one-line error that is easy to miss
#   in a long paste. That lock sat from a 21:15 commit until it was found
#   hours later, and it is why a merge "succeeded" three separate times
#   without ever producing a commit. An audit that day found 61 leftover
#   lock corpses in .git going back to 2026-07-28: every agent had cleared
#   one silently, with its own suffix, and none had ever reported it. So this
#   script now records every clear to reports/ops/stale-locks.log and prints
#   a line agents are required to surface. See "REPORT THIS" below.
#
# WHAT THIS SKIPS:
#   Runs no git hooks (equivalent to `commit --no-verify`). The pre-commit
#   hook's only commit-affecting job used to be regenerating and staging
#   reports/editorial/editorial-refresh-queue.json; that file is untracked as
#   of 2026-08-05 and is regenerated at the top of every build, so skipping
#   the hook no longer leaves anything stale in a commit.
#
# USAGE:
#   sh scripts/safe-commit.sh "commit message" path/one path/two ...
#
# Only ever stages the exact paths you list. Never use -A or a glob with this
# script — the whole point is to avoid sweeping in whatever another task left
# staged or lying around in the working tree.

set -eu

MSG="${1:-}"
shift || true

if [ -z "$MSG" ]; then
  echo "safe-commit: missing commit message. Usage: safe-commit.sh \"message\" path [path...]" >&2
  exit 1
fi

if [ "$#" -eq 0 ]; then
  echo "safe-commit: no paths given. Refusing to commit nothing. Usage: safe-commit.sh \"message\" path [path...]" >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "safe-commit: not inside a git work tree. Run this from the repo root." >&2
  exit 1
fi

GIT="git -c core.fsync=none -c core.fsyncMethod=none"

BRANCH=$($GIT symbolic-ref --short HEAD)

# ---------------------------------------------------------------------------
# Stale lock preflight.
#
# rm fails with "Operation not permitted" on this filesystem; mv works. A lock
# younger than STALE_AFTER_MIN might belong to a git process that is genuinely
# still running, so we refuse rather than race it. Anything older is a corpse.
# ---------------------------------------------------------------------------
STALE_AFTER_MIN=2
LOCK_LOG="reports/ops/stale-locks.log"
CLEARED_LOCKS=""
LIVE_LOCKS=""

for lock in \
  .git/index.lock \
  .git/HEAD.lock \
  .git/ORIG_HEAD.lock \
  .git/packed-refs.lock \
  .git/config.lock \
  ".git/refs/heads/$BRANCH.lock"
do
  [ -e "$lock" ] || continue
  if [ -n "$(find "$lock" -maxdepth 0 -mmin "+$STALE_AFTER_MIN" 2>/dev/null)" ]; then
    stamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
    if mv "$lock" "$lock.stale.$$" 2>/dev/null; then
      CLEARED_LOCKS="$CLEARED_LOCKS $lock"
      mkdir -p "$(dirname "$LOCK_LOG")" 2>/dev/null || true
      printf '%s\tsafe-commit\t%s\tcleared\t%s\n' "$stamp" "$BRANCH" "$lock" >>"$LOCK_LOG" 2>/dev/null || true
    fi
  else
    LIVE_LOCKS="$LIVE_LOCKS $lock"
  fi
done

if [ -n "$LIVE_LOCKS" ]; then
  echo "safe-commit: ABORTING — lock file(s) newer than ${STALE_AFTER_MIN}m:$LIVE_LOCKS" >&2
  echo "             Another git process may be running. Wait and retry; do not clear these by hand." >&2
  exit 1
fi

if [ -n "$CLEARED_LOCKS" ]; then
  echo "===============================================================" >&2
  echo "REPORT THIS: safe-commit cleared stale git lock(s):$CLEARED_LOCKS" >&2
  echo "A stale lock silently blocks merges and HEAD updates. Put this" >&2
  echo "line in your Slack run summary so it stops going unnoticed." >&2
  echo "Logged to $LOCK_LOG" >&2
  echo "===============================================================" >&2
fi

# Prune old corpses so they stop accumulating (61 had piled up by 2026-08-05).
# Keeps anything from the last day in case a post-mortem needs it.
find .git -maxdepth 3 -name '*.lock.stale.*' -mtime +1 -exec mv {} /tmp/ \; 2>/dev/null || true

PARENT=$($GIT rev-parse HEAD)

# Reset the index to exactly match HEAD before staging anything, so nothing
# another task left staged (and never committed) rides along in this commit.
$GIT read-tree HEAD

# Refuse to stage the generated editorial refresh queue. It is untracked as of
# 2026-08-05 (see .gitignore); an explicit attempt to commit it means a caller
# is working from stale instructions.
case " $* " in
  *"reports/editorial/editorial-refresh-queue.json"*)
    echo "safe-commit: ABORTING — reports/editorial/editorial-refresh-queue.json is generated and untracked." >&2
    echo "             Drop it from your path list. The build regenerates it." >&2
    exit 1
    ;;
esac

$GIT add -- "$@"

TREE=$($GIT write-tree)

echo "safe-commit: about to commit these changes vs HEAD ($PARENT):" >&2
$GIT diff-tree --no-commit-id --name-status -r "$PARENT" "$TREE" >&2

COMMIT_SHA=$(printf '%s\n' "$MSG" | $GIT commit-tree "$TREE" -p "$PARENT")

$GIT update-ref "refs/heads/$BRANCH" "$COMMIT_SHA"

echo "safe-commit: committed $COMMIT_SHA on $BRANCH" >&2
echo "$COMMIT_SHA"
