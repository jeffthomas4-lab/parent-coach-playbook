# PLAT-009 Gate 9C-C1 read-only staging revalidation

Status: **PASS — READ-ONLY DRIFT CHECK ONLY / C1-A PACKET HOLD**

Observed: `2026-09-06T04:08:09Z` (2026-09-05 Pacific)

This receipt refreshes the staging starting state for the two-gate synthetic pilot defined at
evidence commit `91b5e40de0dc4f3a19b17147cdc90e20af9f1edc`. It does not create or authorize a
packet, activation boundary, Worker deployment, D1 mutation, rollback, historical transfer,
production change, export, send, privacy-policy text, or secret/provider/resource change.

## Worker identity

### Parent Coach Desk

- deployment: `019eec55-9cf0-4881-acd0-24ab0441c0ea`
- version: `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%
- message: `exact candidate f1bc696720d65c578b513165e2f62756da2fe2f5; adapter and backfill disabled`

### Central CRM

- deployment: `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`
- version: `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%
- message: `exact candidate d810612d5c8f55f97e7e04596cca2af4128049eb; Gate 9C-C0; producers disabled; no activation boundary`

Both deployment identities match the C1 contract. No deployment command ran.

## Directory D1 aggregate

Database: `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`

- exact fixture rows: 3
- live fixture rows: 3
- unprojected fixture rows: 3
- total organizations: 10
- total CRM projection revision sum: 0

Both statements reported `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`.

## PCD ops D1 aggregate

Database: `7f0da00d-bc98-464f-8702-ce0fb381dd5e`

All of the following remain zero: contacts, adapter controls, outbox rows, projection receipts,
reconciliation receipts, backfill runs, backfill chunks, backfill reconciliation windows,
backfill subjects, and contact-retraction runs.

The statement reported `success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`.

## Central CRM D1 aggregate

Database: `9d5e91d3-683b-4070-b511-623e5173ba33`

All of the following remain zero: organizations, people, contact points, workspace organizations,
workspace contacts, campaigns, import batches, export artifacts, touches, outcomes, inbox
receipts, and dead letters.

The statement reported `success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`.

## Decision

The C1 staging baseline has not drifted since the proposal snapshot. Gate 9C-C1-A remains the
next required owner approval. Until that exact approval exists, the fixed eight-file synthetic
packet must not be generated and no remote action may begin.

