# Editorial lifecycle production handoff

## Completed locally

The local vertical slice adds a governed lifecycle contract, transition and approval-gate library, deterministic corpus snapshot, editorial dashboard visibility, focused tests, and an operating document. Run `npm.cmd run report:editorial-lifecycle`, `npm.cmd run check:editorial-lifecycle`, and `npm.cmd exec vitest run tests/editorial-lifecycle.test.ts --run` from the repository root.

Read `strategy/EDITORIAL-CONTENT-LIFECYCLE.md`, `src/data/editorial-governance.json`, `src/lib/editorial-lifecycle.ts`, and `reports/editorial/lifecycle.json` before changing behavior. The baseline intentionally labels the existing corpus as legacy; it does not claim source or human-approval completeness.

## Claude execution after Jeff approval

1. Build the real opportunity intake adapters (GSC, no-result, support, seasonal, affiliate, correction, competitor and trend signals) behind a provider-neutral interface. Store only minimized, non-identifying aggregates.
2. Add durable source/claim/brief/relationship records and migrations only through the existing production migration approval and rehearsal gates. Do not reuse or alter the deferred trust migration packet.
3. Wire authenticated admin actions for brief, evidence, review, approval, maintenance and retirement proposals. Preserve no-auto-publish/no-auto-delete behavior.
4. Reconcile the 1,852-item baseline in batches; each batch needs source registry, claim validation, relationship map, disclosure classification and Jeff approval evidence.
5. Add real indexing/distribution and performance connectors only with explicit credentials and provider/production approval. Prove staging failure isolation and rollback before any live release.
6. Run the full release suite and capture the exact reviewed commit SHA, backup, observation window and synthetic proof. Jeff is the final approver for credentials, migrations, publishing and deployment.

Do not represent the lifecycle as production-complete until those evidence artifacts exist and the owner-held gates are explicitly signed off.
