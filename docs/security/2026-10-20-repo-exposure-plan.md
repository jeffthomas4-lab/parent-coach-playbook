# Repo exposure plan (security audit 2026-10-20, H1 + H2)

**Status:** Plan only. Nothing in this PR changes repo settings, moves files, rotates keys, or deploys.
**Source:** `C:\Users\jefft\OneDrive\Desktop\Reference\Security\2026-10-20-portfolio-security-audit.md` (H1 lines 78-81, H2 lines 83-86).
**Owner of every action below:** Jeff. Secret scanning is Jeff's to turn on himself.
**Evidence tags:** Seen = observed (cited), Inferred = reasoned (basis given), Unknown = not established.

## Checklist

| # | Question | Status |
|---|---|---|
| 1 | What is exposed, and where does it live in the tree? | Answered (section 1) |
| 2 | Which option closes the most exposure? | Answered (section 2): Option 1, private |
| 3 | What breaks under each option? | Answered (sections 3-4) |
| 4 | Does git history keep the files either way? | Answered (section 5): yes |
| 5 | How does making the repo private interact with secret scanning? | Answered (section 6) |
| 6 | H2: where are the dev secrets files, what reads them, where should they go? | Answered (section 7) |
| 7 | Does Cloudflare's GitHub app already have private-repo access? | **Open**. Jeff checks GitHub Settings > Applications > Cloudflare Workers and Pages > Repository access before flipping. |
| 8 | Do any cloud-hosted routines clone this repo anonymously? | **Open**. Unknown; see section 3. |

## 1. What is exposed

- **Seen:** `gh repo view` returns `"visibility":"PUBLIC"`, 0 forks, 0 stars. `security_and_analysis` shows secret_scanning, push_protection, validity checks and dependabot_security_updates all `disabled`. `main` is not protected (`branches/main/protection` 404) and there are 0 rulesets.
- **Seen (tracked file counts at `87864a02`):** `coordination/` 140 files (57 in `coordination/release-evidence/`), `backups/` 23 (`backups/2026-07-25/`, a production D1 export; the audit found every PII table at 0 rows), `reports/` 356, `strategy/` 15.
- **Seen:** the exposure is not only in those four folders. The Access AUD tags and D1 database ids live in root config and scripts: `wrangler.production.jsonc`, `wrangler.jsonc`, `scripts/access-evidence.mjs`, `scripts/check-ops-migration-boundary.mjs`, and `coordination/release-evidence/access-policy-export-pending.json`. The admin allowlist emails appear in `wrangler*.jsonc` and in 9 files under `tests/` (for example `tests/worker-entry-boundary.test.ts:20`). `scripts/deploy-production-crm-disabled.ps1:16-17` holds SHA-256 fingerprints of the CRM secret pack (fingerprints, not secrets; audit line 80).
- **Seen (audit line 80):** 171 distinct email addresses, mostly camp-org contacts and owner addresses. I did not re-count them.

## 2. Recommendation: Option 1, make the repo private

1. **Inferred:** Option 2 (move four folders) leaves the AUD tags, D1 ids, admin emails, and any camp-contact emails outside those folders public. Only Option 1 closes everything H1 lists.
2. **Seen (section 4):** Option 2 breaks the production build as it stands, because `src/` imports JSON from `reports/`.
3. **Seen (section 3):** Option 1's main breakage is small and known: two raw.githubusercontent.com links in `imports/`, and the free GitHub secret scanning goes away (section 6).

**Suggested order:** (a) Jeff turns on secret scanning and push protection while the repo is still public. It is free for public repos and scans full history once. (b) Triage any alerts and rotate whatever is real. (c) Confirm Open item 7. (d) Flip to private. (e) Rely on the repo's own `npm run check:secrets` (`scripts/scan-secrets.mjs --history`) plus a gitleaks pre-push or weekly sweep afterwards.

## 3. Option 1 (private): what would break

| Area | Effect | Tag / basis |
|---|---|---|
| Workers Builds (Cloudflare Git integration, the normal content deploy path) | Keeps working **if** the Cloudflare Workers and Pages GitHub App has access to this repo. Builds use the App installation, not anonymous clone. | Inferred. `PUBLISH-PIPELINE.md:78-99,202` and `scripts/ci-deploy-guard.mjs` describe Workers Builds with watch paths. `repos/.../hooks` returned no webhooks, so the link is via the App. Open item 7. |
| GitHub Actions | Nothing. The repo has none. | Seen: `.github/` holds only `dependabot.yml`. Commit `40b1c3e0` "Remove all GitHub Actions workflows". |
| GitHub Pages | Nothing. Pages is not enabled. | Seen: `repos/.../pages` 404. |
| DESKTOP routines and skills (Rex `agents/pcd-edge-case-desk`, `agents/pcd-auto-deploy`, Sasha `agents/pcd-social-drafter`, Nora, Sunny, Ranger, Vera, Ed, Linda, Iggy) | Nothing. They read and write the local clone `C:\Users\jefft\pcd\parent-coach-playbook` and push with the logged-in `gh`/git credential. | Inferred from the SKILL paths and `scripts/agent-push.mjs`. |
| `coordination/deploy-hold-state.json` | Nothing. It is read locally by `agents/pcd-auto-deploy/SKILL.md`, `agents/pcd-edge-case-desk/SKILL.md`, and `scripts/agent-push.mjs`. | Seen (git grep). |
| Public raw links | **Break.** `imports/claude-in-chrome-prompt.md:46` and `imports/peachjar-prompt.md:19` tell a browser agent to read `https://raw.githubusercontent.com/jeffthomas4-lab/parent-coach-playbook/main/imports/...` unauthenticated. These need a new home: a Worker-served admin route, a gist, or paste-in. | Seen. |
| Public links from the live site | Nothing. No `github.com/jeffthomas4-lab/parent-coach-playbook` links in `src/`, `public/`, `astro.config.mjs` or `README.md`. | Seen (git grep). |
| Cloud-hosted agents (Claude routines, Cursor cloud agents, the Grok Bot box) | Need an authenticated clone. Any that clone anonymously stop syncing. | Unknown (Open item 8). Notes say Alfred was pointed at the DESKTOP procedure, which is fine. |
| Origin mirror | None found. | Seen: Origin namespace `jeff-thomas-dev` lists 0 repositories. |
| Dependabot (`.github/dependabot.yml`) | Keeps working; version updates are free on private repos. | Inferred from GitHub docs. |
| Secret scanning and push protection | Free only on public repos. Once private, repo-level scanning needs paid GitHub Secret Protection, which personal accounts can't buy. "Push protection for users" also covers public repos only. | Seen: docs.github.com secret-scanning and Advanced Security billing pages. See section 6. |
| Branch protection | Can't be added on a private repo under GitHub Free. It isn't on today. | Inferred from GitHub plan docs; current state Seen. |

## 4. Option 2 (move `coordination/`, `backups/`, `reports/`, `strategy/` to a private repo): what would break

| Area | Effect | Tag / basis |
|---|---|---|
| **Production build** | **Breaks.** `src/pages/admin/editorial/index.astro:5-6` imports `reports/editorial/editorial-refresh-queue.json` and `reports/editorial/lifecycle.json`. `src/pages/admin/index.astro:4` imports `reports/affiliate/inventory.json`. `npm run build` also runs `report:editorial-refresh`, which writes into `reports/`. | Seen. |
| Deploy script | `C:\Users\jefft\pcd\pcd-deploy-code.ps1:60-62` writes `coordination/release-evidence/asset-proof-prod.json` and passes it to the smoke test. | Seen. |
| npm scripts | 11 `package.json` scripts read `coordination/release-evidence/*.json` or `reports/editorial/lifecycle.json` (`check:release-evidence`, `check:access-evidence*`, `check:recovery-tabletop`, `check:newsletter-proof`, and others). | Seen. |
| Tests | 23 files under `tests/` reference `coordination/`, 5 reference `reports/`, 1 references `strategy/`. These include the release-evidence, access-evidence, backup-proving-log and deployment-manifest suites. | Seen (git grep -l counts). |
| Scripts | `scripts/` references `coordination/` in 10 files, `reports/` in 11, `strategy/` in 3, `backups/` in 5 (`backup-d1-activity-radar.ps1`, `offsite-backup-upload.mjs`, `build-recovery-batch-manifest.mjs`, two runbooks). | Seen. |
| Agent skills and routines | 31 files in `agents/`, `automation/agents/*`, `.claude/CLAUDE.md` and `PCD-AI-OS/` reference `reports/` or `coordination/`. Every routine writes reports here: Rex `reports/edge-cases/DESK_*`, Sasha `reports/social/...`, Nora GSC reviews, Linda link health, Sunny, Ranger, Vera, Ed, Lonnie, Iggy run logs in `coordination/agent-run-logs/`, plus `coordination/deploy-hold-state.json`. All of them need path changes and a second repo to commit to. | Seen (file list); per-agent paths Inferred from SKILL text. |
| Deploy guard | `scripts/ci-deploy-guard.mjs:177-178` classifies `reports/` and `coordination/` as inert. Harmless if the folders vanish, but stale. | Seen. |
| Root registry | `coordination/root-file-registry.json` and `top-level-directory-registry.json` live inside `coordination/`, which `.githooks/pre-commit` and `check:root-organization` read. | Seen. |
| Exposure left over | AUD tags, D1 ids and admin emails in `wrangler*.jsonc`, `scripts/` and `tests/` stay public. | Seen (section 1). |

## 5. Git history keeps the files either way

- **Seen:** every file above is in public history (for example `backups/2026-07-25/` since July).
- **Option 1:** history becomes private along with the tree. Anything already cloned, cached or scraped while the repo was public stays out there. The repo has 0 forks (Seen), but crawlers and mirrors are Unknown.
- **Option 2:** moving folders does not remove them from history. A real purge needs `git filter-repo` on all four folders plus a force-push to `main`. That rewrites every SHA, breaks `/build-info.json` anchoring in `ci-deploy-guard.mjs`, invalidates every open branch and worktree, and still can't recall existing copies. It is a destructive step that needs Jeff's explicit go.
- **Rotation, either way:** treat anything that was ever in public history as disclosed. D1 ids and Access AUD tags are identifiers, not credentials: rotating an AUD means recreating the Access application, which is low value unless paired with another weakness. Real secrets found by the scan in section 2 must be rotated no matter which option is chosen.

## 6. Secret scanning

Jeff turns this on himself. Do it **before** going private, while it is free (public repo), so GitHub scans the whole history once. After the flip, the repo's own guard `npm run check:secrets` (`scripts/scan-secrets.mjs --history`, with `.gitleaksignore`) is the remaining control. Wiring it into `.githooks/pre-commit` or a weekly routine is a reasonable follow-up PR.

## 7. H2: the OpenAI key in the OneDrive-synced `.env`

- **Seen:** `C:\Users\jefft\OneDrive\Desktop\Reference\Parent Coach Desk\01-product\app\` is a second git clone of this repo. Its origin is `jeffthomas4-lab/parent-coach-playbook` and its HEAD `ec9dd999` dates from 2026-08-14. It holds `.env`, last written 2026-09-18. Git ignores `.env` and `.dev.vars` there (`.gitignore:17,23`), but OneDrive uploads them. Key **names** in that `.env` include `OPENAI_API_KEY` and also `SANITY_API_TOKEN`. Both are secrets; values were not read or printed.
- **Seen:** no `.env` (other than `.env.example`) and no `.dev.vars` exist in the working clone `C:\Users\jefft\pcd\parent-coach-playbook` (searched to depth 3), and none in the OneDrive clone besides `app\.env`.
- **Seen:** the Worker does not read `OPENAI_API_KEY`. `src/` has no code reference to it, and it is not in `wrangler.production.jsonc`. Readers are local scripts: `scripts/build-illustrations.py:172-177` (`load_dotenv(ROOT / '.env')`, then env), `scripts/build-sport-heroes.py:237` (env, `setx` advice), `scripts/gen_hero_image.py:10` (env, marked obsolete), `scripts/_tmp_gen_clinic_hero.py:8` (env), and Iggy's `agents/pcd-hero-image-backfill/SKILL.md:19,53` (env only).

**Plan (Jeff rotates; nothing moved in this PR):**
1. Rotate `OPENAI_API_KEY` in the OpenAI dashboard and revoke the old one. Consider rotating `SANITY_API_TOKEN` too, since it sat in the same synced file.
2. Store the new key outside OneDrive. If a Worker feature ever needs it, use `npx wrangler secret put OPENAI_API_KEY --config wrangler.production.jsonc`. Today none does, so a Worker secret would be unused. For the local image scripts, use a user env var (`setx OPENAI_API_KEY ...`, which `build-sport-heroes.py` already documents) or a file outside OneDrive.
3. Delete the key lines from the OneDrive `app\.env`. Then retire the stale OneDrive clone entirely (it is 2 months behind, with about 1,604 dirty files per audit line 171), or move it out of OneDrive.
4. Proposed home for any remaining dev secret files: `C:\Users\jefft\pcd\secrets\parent-coach-playbook\` (`.env`, `.dev.vars`), outside OneDrive.

   Path updates that move needs:
   - `scripts/build-illustrations.py:173`: read `PCD_ENV_FILE` or `C:\Users\jefft\pcd\secrets\parent-coach-playbook\.env` before `ROOT / '.env'`.
   - `wrangler dev`: reads `.dev.vars` only from the project dir. Either keep a gitignored `.dev.vars` in `C:\Users\jefft\pcd\parent-coach-playbook` (already outside OneDrive, so it is fine to leave there), or pass `--env-file`.
   - `agents/pcd-social-drafter/SKILL.md:64`: still points at the OneDrive clone's `reports\social\`. Repoint it to `C:\Users\jefft\pcd\parent-coach-playbook\reports\social\` before retiring that clone.

## Follow-ups (not in this PR)

- Jeff: secret scanning on (while public), triage, then the visibility decision.
- Jeff: confirm Cloudflare GitHub App repo access (Open item 7).
- PR: rehome the two `imports/*` raw.githubusercontent prompts if going private.
- PR: repoint `pcd-social-drafter` off the OneDrive clone; teach `build-illustrations.py` the `PCD_ENV_FILE` path.
- PR: wire `check:secrets` into pre-commit or a weekly routine.
