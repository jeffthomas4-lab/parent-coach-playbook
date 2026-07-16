# Plan: admin entry and security.txt

**Plan ID:** 007  
**Author:** Codex  
**Date:** 2026-07-15  
**Status:** Complete

## Objective

Replace the authenticated `/admin` 404 with a useful, non-mutating workspace index and publish the standard vulnerability-reporting contact discovered by the Cloudflare security review.

## Scope and safety

Add a prerendered admin index, add `public/.well-known/security.txt`, validate the build, deploy only to the existing staging Worker, and perform read-only acceptance checks. No production deployment, shared-data write, outbound message, binding change, or secret change is authorized.

## Acceptance criteria

- Anonymous `/admin` remains protected by Cloudflare Access.
- An authenticated `/admin` session renders links to the existing administrative workspaces.
- Staging serves `/.well-known/security.txt` as plain text with Contact, Expires, Preferred-Languages, and Canonical fields.
- Astro check and build pass, generated timestamp-only churn is discarded, and the work is committed locally.

## Execution evidence

- Astro check completed with 0 errors.
- The full build completed with an explicit 8 GB Node memory ceiling; the default-memory attempts exited during the existing very large prerender set rather than reporting a source diagnostic.
- Deployed staging Worker version `88711555-7f3b-4123-bec6-098075f2a095`.
- Anonymous `/admin` returned a Cloudflare Access 302.
- The existing authenticated browser session rendered `/admin/` as `Admin desk | Parent Coach Desk` with seven workspace links.
- `/.well-known/security.txt` returned 200 as `text/plain` with the expected four fields.
