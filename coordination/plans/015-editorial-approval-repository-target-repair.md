# Plan: Editorial approval repository-target repair

**Plan ID:** 015
**Author:** Codex
**Date:** 2026-07-17
**Status:** Implemented and deployed; designated live editorial-write verification remains separately gated
**Tier:** 2

## Objective

Restore the protected Editorial dashboard's Approve action without weakening Cloudflare Access, the application allowlist, same-origin checks, GitHub optimistic concurrency, or the requirement for a human click.

## Evidence

- **Verified in code:** `src/pages/api/admin/editorial/approve.ts` targets `jeffthomas4-lab/parent-coach-desk`.
- **Verified in code:** `src/lib/publish.ts` targets `jeffthomas4-lab/parent-coach-playbook`.
- **Verified locally:** Git `origin` fetch and push URLs target `https://github.com/jeffthomas4-lab/parent-coach-playbook.git`.
- **Verified in code:** the current approval-route tests mock GitHub responses and do not assert the target repository URL.
- **Not yet confirmed live:** the exact browser error. A likely result is an authenticated GitHub Contents API `404` during the initial file read, but a missing/under-scoped Worker `GITHUB_TOKEN` can produce a different error.

## Scope

1. Replace the approval route's independent repository and collection-path constants with the canonical exports from `src/lib/publish.ts`, or extract a small dependency-free shared module if importing `publish.ts` would include unrelated publish behavior in the approval route.
2. Preserve the approval route's existing behavior: an authenticated and same-origin POST reads one allowlisted Markdown file, changes only the `editorial` frontmatter, and performs one GitHub Contents API update with the retrieved SHA.
3. Add focused regression tests that assert every GitHub Contents API URL used by approval targets the canonical repository and `main` branch.
4. Add a failure-path test for the provider response shown when GitHub refuses the configured repository or token. The test must not contain a real token or provider response body.
5. Verify the implementation locally. Do not invoke a live approval action as a test because that action creates a repository commit.

## Non-goals

- Do not change the GitHub token, its scope, Cloudflare secret values, Access policy, DNS, Worker binding, GitHub repository settings, branch protection, editorial content, or deployment pipeline.
- Do not auto-approve, auto-publish, or add a fallback repository target.
- Do not expose GitHub provider error bodies to the browser. Keep diagnostic detail in server logs only; return a bounded actionable message and status code.
- Do not deploy, push, merge, or exercise the live write path until the scoped repair has been reviewed and all acceptance criteria pass. The separately approved production deployment is limited to that exact reviewed repair commit.

## Files

- `src/pages/api/admin/editorial/approve.ts`
- `src/lib/publish.ts`, only if its exports need a narrow refactor for safe reuse
- `tests/api/admin-editorial-approve.test.ts`
- A new focused shared-configuration test only if one cannot be expressed in the route test

## Implementation steps

1. Confirm the canonical repository owner/name and branch from the configured Git remote. Treat that remote as the source of truth for editorial GitHub writes.
2. Inspect `src/lib/publish.ts` exports. Reuse `REPO`, `BRANCH`, and `COLLECTION_PATHS` only if the import has no request-time side effects and does not make the approval route depend on deploy-hook behavior.
3. If direct reuse is not clean, create a small pure module containing only the repository, branch, collection allowlist, and safe-slug helper. Update both the approval and publish paths to import it. Do not leave two independent repository constants.
4. Update the approval route to construct both the GitHub read URL and write URL from the canonical values.
5. Keep `requireAdmin`, `requireSameOrigin`, the allowlisted collection lookup, traversal rejection, SHA precondition, and authenticated committer attribution unchanged.
6. Replace response bodies that currently relay raw GitHub text to the browser with a stable error code such as `github_read_rejected` or `github_write_rejected`. Log only an aggregate event, operation, and HTTP status. Do not log the token, request body, or file contents.
7. Extend `tests/api/admin-editorial-approve.test.ts`:
   - happy path asserts the GET and PUT URLs both reference the canonical repo and `ref=main` on the GET;
   - wrong repository/token provider response returns the bounded error and does not expose provider text;
   - existing auth, same-origin, unknown-collection, missing-token, and file-not-found tests remain green.
8. Run the focused route test, full unit suite, unit coverage, integration suite, Astro check, production-manifest check, and secret scan.
9. Record the exact commands, exit codes, results, and any remaining provider-secret requirement in a Claude handoff. Do not claim the live button works until it is deployed and exercised by an authorized administrator.

## Acceptance criteria

- The approval route and the publish route use one canonical repository target.
- A focused test fails if an approval URL is changed to a different repository or branch.
- GitHub provider details and tokens are not returned to the browser or logs.
- All current authorization and write-precondition tests remain green.
- The local release checks pass without reducing coverage thresholds or excluding the route from test scope.
- A later production verification, after an explicitly approved deployment, shows one authorized editor can approve a synthetic or designated non-customer article and receives a bounded success response. That verification must be separately authorized because it writes a Git commit.

## Human gates

1. Jeff approved the source repair plan on 2026-07-16; Claude Code may implement the scoped repair.
2. Jeff approved production deployment on 2026-07-16, limited to the reviewed repair commit after all acceptance criteria and release checks pass.
3. If the deployed route reports a token or repository authorization failure after the code repair, Jeff must approve creation or replacement of a least-privilege GitHub credential with Contents read/write access only to the canonical repository. Do not create, rotate, or paste a token into chat or source.
4. Jeff separately chooses the designated live test article and approves the resulting GitHub content commit.

## Implementation and deployment outcome

- **Implemented by Codex, 2026-07-17:** the approval route now imports the canonical repository, branch, and collection allowlist from `src/lib/publish.ts`; raw GitHub response bodies are neither returned to the browser nor logged.
- **Focused commit:** `bf4c424` (`fix: repair editorial approval repository target`).
- **Validation:** focused approval-route suite (8 tests), full unit coverage (104 files / 554 tests), integration suite (10 files / 44 tests), Astro check (0 errors), production-manifest build, release-evidence structure, secret scan, and high-severity dependency audit all passed.
- **Production deployment:** Worker version `35449367-a085-4096-bb7b-6886c048cea5` is active at 100%. Public apex, `www` canonical redirect, security.txt, and anonymous Access interception for `/admin/` and the approval API were verified with GET-only checks.
- **Still intentionally unproved:** the protected approval POST has not been invoked. It writes a GitHub content commit and requires Jeff to choose the test article and supply the human click/approval.

## Rollback

If the deployed repair produces an unexpected result, roll back only the Worker version to the previously recorded Worker rollback target. Do not revert editorial content automatically. Any GitHub content change from a later live verification is a separate, reviewable commit and must be handled through the normal editorial process.
