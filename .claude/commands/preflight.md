# /preflight

Fast GO / NO-GO check right before a deploy. Lighter than /site-check — single session, focuses on what could break.

**Usage:** `/preflight`

## Steps

1. Run `npm run build` — if it fails, stop here. Fix the build error first.
2. Check `affiliates.json` — any entry added or modified this session gets a tag integrity check (Amazon = `?tag=parentcoachpl-20`)
3. Check any new or modified content files — `bluf` field present, `sport` value in SPORTS array, no banned words
4. Confirm deploy commands match `About Me/Deployments.md` for this project (`wrangler pages deploy dist --project-name parent-coach-playbook --branch main`)
5. Confirm git commit is staged with a specific commit message (not "update files")

## GO criteria

- Build passes
- No new affiliate URLs missing the tag
- No new content files missing required fields
- Commit message is specific and in Jeff's voice

## NO-GO criteria

- Build fails
- Any Critical security finding from the last /security-check is still unresolved
- Any affiliate tag missing from a new entry

**Output:** GO / NO-GO + checklist status + paste-ready deploy block.
