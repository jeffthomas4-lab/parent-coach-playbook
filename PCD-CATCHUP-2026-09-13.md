# PCD catch-up, 2026-09-13

Written by Claude from the cloud session. The Sept 8 Windows update still blocks Cowork's shell on this
machine, and the cloud proxy refuses to push to jeffthomas4-lab/parent-coach-playbook, so nothing below
shipped on its own. Claude Code (the CLI) is not affected by the mount bug: paste the block at the bottom into
Claude Code or run the PowerShell yourself.

## Where things stand (verified against the live site and origin, not against Slack reports)

Production (`/build-info.json`) was built 2026-09-11 23:49 PT from local commit `686bf1d1`, which is not on
origin. Origin main is at `39e1e4c` (concussion-protocol-youth-sports, pushed 2026-09-12 21:00 PT) and that
piece is not live. So local and origin have diverged again and production is one build behind origin.

Every piece Penny approved through 2026-09-07 is live (all 16 September `draft: false` items return 200).

Waiting on a review or a decision:

- `src/content/news/nfhs-flag-football-rule-changes-2026-27.md`: reviewed today, one factual fix applied
  (teams start with seven and may drop to five; the draft said exactly seven). Flipped to `draft: false`.
- `src/content/news/nfhs-volleyball-libero-rule-2026-27.md`: reviewed today, passes as written. Flipped to
  `draft: false`.
- `src/content/articles/the-kid-who-throws-up-before-tryouts.md`: `ready-for-jeff` since 09-08. Your call.
- `src/content/articles/the-friend-you-coached-with-who-isnt-coming-back.md`: `ready-for-jeff` since 09-02,
  held on flagSensitiveTopic. Your call.
- Ed's 09-10 hockey volunteer-jobs draft: exists only on this clone, uncommitted.

## Run this (PowerShell, from the repo)

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"
npm run git:unlock
git status
git stash push -u -m "catchup-2026-09-13"
git fetch origin --prune
git rebase origin/main
git stash pop
git add src/content editorial-queue.md CONTENT_ROADMAP.md reports coordination
git commit -m "Catch-up 2026-09-13: publish 2 NFHS news items (reviewed), commit stranded agent output"
git push origin main
npm ci
npm run build:production
(Get-Content dist\server\wrangler.json -Raw | ConvertFrom-Json).name
npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars --dry-run
npm exec wrangler -- deploy --config dist/server/wrangler.json --keep-vars
```

Stop if the `name` line prints anything other than `parent-coach-desk`. If `git stash pop` reports a
conflict, the file in conflict is agent bookkeeping (reports/, coordination/) nine times out of ten; keep the
origin side unless it is under src/content.

Then confirm:

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" https://parentcoachdesk.com/news/nfhs-flag-football-rule-changes-2026-27/
curl.exe -s -o NUL -w "%{http_code}`n" https://parentcoachdesk.com/game/concussion-protocol-youth-sports/
```

## Until the mount bug is fixed

Ed, Penny, Arnie, Dana, Cass and Iggy all die at step 0 on this machine. Two options: move the nightly
PCD tasks to Claude Code scheduled runs on this machine, or point them at a cloud clone with the repo added
to the session's authorized sources so they can push. Either one gets the pipeline moving before Microsoft
or Anthropic fixes the mount.
