# Release evidence packets

One JSON packet represents one proposed production release. `scripts/release-evidence.mjs` defines the mandatory gates. A `pass` requires at least one specific evidence reference. `not_applicable` requires a named human approver. Missing, failed, pending, malformed, or expired evidence is not release-ready.

Structure validation is safe and read-only:

`node scripts/check-release-evidence.mjs coordination/release-evidence/rc01.json --structure-only`

The pre-deploy gate excludes only post-deploy observation and intentionally exits nonzero until every other item is passed or explicitly approved not applicable:

`node scripts/check-release-evidence.mjs coordination/release-evidence/rc01.json --phase=predeploy`

After deployment, closeout requires every gate including post-deploy observation:

`node scripts/check-release-evidence.mjs coordination/release-evidence/rc01.json`

This command does not deploy, migrate, probe production, send alerts, or mutate data. Evidence references must point to immutable or dated artifacts; prose claims are not substitutes for test output, live exports, receipts, versions, or approvals.
