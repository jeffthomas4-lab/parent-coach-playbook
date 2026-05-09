# Sport vocabulary cheat sheets

One file per sport. Each file is a quick reference for the language a piece tagged with that sport should use. The reviewer reads the piece with the matching cheat sheet open, then sets `sportLanguageCheckPassed` in the editorial frontmatter.

The point: a beginner parent can do the drill, AND the language matches the sport. We don't call a run a touchdown.

## Files

- `baseball.md` — diamond, infield/outfield, pitch, hit, run
- `softball.md` — same diamond, underhand pitching, fastpitch vs. slowpitch
- `soccer.md` — pitch, goal, dribble, pass, shoot
- `basketball.md` — court, key, basket, dribble, shoot, rebound
- `football.md` — gridiron, end zone, touchdown, snap, pass, run, tackle. Covers tackle football, flag-football, and 7v7. Read the flag-football and 7v7 sections carefully — the no-contact rules change the verbs.
- `volleyball.md` — court, net, set, spike/kill, dig, block
- `hockey.md` — rink, ice, puck, skate, pass, shoot, save
- `lacrosse.md` — field, crease, cradle, pass, shoot. Boys' and girls' rules differ — read both sections.

## How to use

1. Open the cheat sheet for the sport tagged in the piece's frontmatter.
2. Read the piece body once.
3. Flag any term in the right-hand "wrong for this sport" column that appears in the body.
4. Flag any sport-generic term where a sport-specific term would be more correct (e.g., "the player threw the ball" → "the pitcher threw the ball" in a pitching drill).
5. If clean, set `sportLanguageCheckPassed: true`. If not, fix and recheck.

## Adding a new sport

The sports below cover the team sports with drill content as of May 2026. To add a new sport (e.g., tennis, swimming, gymnastics, cheer), copy `baseball.md` as a template and fill in:

- The field/court/venue terms
- Player position or role names
- The scoring noun (run, goal, point, basket, kill, touchdown, etc.)
- The action verbs that are correct for that sport
- A "cross-sport pitfalls" section listing the most likely wrong terms, drawn from the sports a writer might drift toward

Then add the file to the index above.
