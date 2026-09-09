# PLAT-009 Gate 9C-P15-R2 abort without action

Status: **NO-ACTION ABORT — immutable prepared artifact unavailable**

Recorded: 2026-09-09T22:16:44Z

The owner approved Gate 9C-P15-R2 at evidence commit
`e0e5776bc31918ea332d14405b54176fac0efa1b`.

The gate binds deployment to PCD candidate
`9558d358c800c79fbad0cba3a7226dd8cdd5ce26`, tree
`7773908955984b81e85f221b0771c1bbbc031e98`, and complete prepared `dist` SHA-256
`1da2baa5c440d5b09ee30855d32b8d7de77fd56a892a75bf36645ddd0fdea37c`.

Preflight searched every retained SightSmash worktree `dist/client/build-info.json` and every
ignored `backups/` tree for that candidate or prepared artifact. Retained build artifacts identify
other candidates only. The P15-R2 worktree's current `dist` identifies later candidate
`a01e225e287b68b933116cba6b223565e1fbc528`; its ignored backup retains the permanently used
phase-one packet at boundary `1788973413000`, but not the immutable prepared `dist` required for
phase two.

Because the exact prepared artifact cannot be revalidated, the gate's pre-mutation abort threshold
was met. No fresh packet was generated, no Time Travel bookmark was captured, no Worker was
deployed, no flag or boundary changed, and no directory, PCD operations, or CRM D1 mutation was
attempted. The active staging receiver and disabled producer state were left untouched.

Any replacement attempt must freeze a new exact candidate and complete prepared-artifact hash in
a separately scoped gate. The expired/missing P15-R2 artifact must not be reconstructed or
substituted under the prior approval.
