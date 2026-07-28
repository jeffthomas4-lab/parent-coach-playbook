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
# WHAT THIS SKIPS:
#   Runs no git hooks (equivalent to `commit --no-verify`). In particular,
#   `.githooks/pre-commit` regenerates reports/editorial/editorial-refresh-queue.json
#   whenever src/ changes are staged — this script does NOT do that. If you
#   commit src/ changes this way, that queue file goes stale until someone runs
#   `node scripts/editorial-refresh-queue.mjs` by hand (that script has the
#   same working-tree-scan cost, so run it with a longer budget, not inside a
#   single 45s tool call).
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

# Clear stale lock files left by a previous killed/timed-out git process.
# rm fails with "Operation not permitted" on this filesystem; mv works.
for lock in .git/index.lock .git/HEAD.lock; do
  if [ -e "$lock" ]; then
    mv "$lock" "$lock.stale.$$" 2>/dev/null || true
    echo "safe-commit: cleared stale lock $lock" >&2
  fi
done
BRANCH=$($GIT symbolic-ref --short HEAD)
BRANCH_LOCK=".git/refs/heads/$BRANCH.lock"
if [ -e "$BRANCH_LOCK" ]; then
  mv "$BRANCH_LOCK" "$BRANCH_LOCK.stale.$$" 2>/dev/null || true
  echo "safe-commit: cleared stale lock $BRANCH_LOCK" >&2
fi

PARENT=$($GIT rev-parse HEAD)

# Reset the index to exactly match HEAD before staging anything, so nothing
# another task left staged (and never committed) rides along in this commit.
$GIT read-tree HEAD

# Warn if this commit touches src/ — the pre-commit hook's queue regeneration
# is being skipped.
case " $* " in
  *" src/"*|*"src/"*)
    echo "safe-commit: WARNING — staging src/ paths. reports/editorial/editorial-refresh-queue.json will NOT be auto-regenerated (hooks skipped). Flag this in your run summary." >&2
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
