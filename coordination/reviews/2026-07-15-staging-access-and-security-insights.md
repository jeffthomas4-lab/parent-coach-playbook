# Review: staging Access and Cloudflare Security Insights

**Date:** 2026-07-15  
**Reviewer:** Codex  
**Plan:** 006  
**Verdict:** Approved with one non-blocking routing follow-up

## Scope

Staging Worker configuration/deployment, Cloudflare Access behavior, authenticated read-only admin acceptance, and the supplied Cloudflare Security Insights export.

## Evidence

- Full staging build passed and produced 9,229 assets.
- Deployed staging version: `a95f7b5d-74a8-4b1e-a1da-4f96eb285e04`.
- Deploy output listed the expected KV, two D1 databases, R2, assets, and non-secret Access variables.
- Anonymous `/` returned 200. Anonymous `/admin` and `/api/admin/editorial` returned Cloudflare Access redirects.
- After the user completed email OTP, `/admin/editorial/` rendered the editorial review board and its inventory. No buttons, forms, or mutation APIs were invoked.
- Authenticated `/admin` returned the application's branded 404. Repository inspection confirms there is no `src/pages/admin/index.astro`; Access itself succeeded.
- Cloudflare export: 141 active findings, with 0 Critical and 0 High. Live DNS contradicts the duplicated DMARC-error label: a valid monitoring-only DMARC record exists.

## Findings

1. **Non-blocking:** `/admin` has no landing route even though it is the natural protected entry URL. Add an index page or redirect in a separate application change.
2. **Low:** add a public `.well-known/security.txt` after confirming its contact and expiry policy.
3. **Decision required:** do not enable Bot Fight Mode, AI bot controls, or DMARC enforcement without impact review and staging tests.

## Approval boundary

This review approves the staging Access/deployment work in Plan 006. It does not approve production deployment, data mutation, outbound communication, bot-setting changes, or DMARC policy enforcement.
