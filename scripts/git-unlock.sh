#!/usr/bin/env bash
#
# git-unlock.sh — safely remove stale Git lock files.
#
# Git writes *.lock files while an operation is in progress and deletes them
# when it finishes. If a process is killed (or an editor/IDE crashes) the lock
# can be left behind, and every later command fails with:
#
#     fatal: Unable to create '.../.git/index.lock': File exists.
#
# This script removes those stale locks — but ONLY after confirming no Git
# process is currently running, so it can't yank a lock out from under a live
# operation and corrupt the repo.
#
# Usage:
#   scripts/git-unlock.sh            # remove stale locks (with safety check)
#   scripts/git-unlock.sh --dry-run  # show what would be removed, change nothing
#   scripts/git-unlock.sh --force    # skip the running-process check (use with care)
#
set -euo pipefail

DRY_RUN=0
FORCE=0
for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY_RUN=1 ;;
    --force|-f)   FORCE=1 ;;
    --help|-h)
      grep -E '^#( |$)' "$0" | sed -E 's/^# ?//'
      exit 0
      ;;
    *)
      echo "git-unlock: unknown argument '$arg' (try --help)" >&2
      exit 2
      ;;
  esac
done

# Resolve the .git directory, even from a subdirectory or a worktree.
if ! GIT_DIR="$(git rev-parse --git-dir 2>/dev/null)"; then
  echo "git-unlock: not inside a Git repository." >&2
  exit 1
fi

# Refuse to touch anything while Git is actively running, unless --force.
if [ "$FORCE" -eq 0 ]; then
  if pgrep -x git >/dev/null 2>&1; then
    echo "git-unlock: a 'git' process is currently running — aborting." >&2
    echo "  Wait for it to finish, or re-run with --force if you are certain it is hung." >&2
    exit 1
  fi
fi

# Known lock files Git creates. Globs are resolved safely below.
LOCKS=(
  "$GIT_DIR/index.lock"
  "$GIT_DIR/HEAD.lock"
  "$GIT_DIR/config.lock"
  "$GIT_DIR/packed-refs.lock"
  "$GIT_DIR/objects/maintenance.lock"
  "$GIT_DIR/gc.pid.lock"
)

# Also catch per-ref locks (e.g. refs/heads/main.lock) and shallow.lock.
shopt -s nullglob globstar 2>/dev/null || true
LOCKS+=("$GIT_DIR"/refs/**/*.lock)
LOCKS+=("$GIT_DIR"/logs/**/*.lock)
LOCKS+=("$GIT_DIR"/shallow.lock)

removed=0
for lock in "${LOCKS[@]}"; do
  [ -e "$lock" ] || continue
  if [ "$DRY_RUN" -eq 1 ]; then
    echo "would remove: $lock"
  else
    rm -f "$lock"
    echo "removed: $lock"
  fi
  removed=$((removed + 1))
done

if [ "$removed" -eq 0 ]; then
  echo "git-unlock: no stale lock files found — repository is clean."
fi
