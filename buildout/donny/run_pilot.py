#!/usr/bin/env python3
"""
run_pilot.py - dry-run one directory snapshot end to end. Writes NOTHING live.

  python3 buildout/donny/run_pilot.py --snapshot <file> --orgs <orgs.json> --out <dir>

Everything lands in a local SQLite staging mirror and a masked markdown report.
There is no code path in this file that opens a production connection. The
`--apply` flag does not exist on purpose: applying is a separate, gated step.
"""

from __future__ import annotations

import argparse
import csv
import datetime
import json
import os
import sqlite3
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import intake      # noqa: E402
import policy      # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))


# ---------------------------------------------------------------------------

def load_orgs(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    rows = data[0]["results"] if isinstance(data, list) and data and "results" in data[0] else data
    return [intake.CanonicalOrg(**{k: r.get(k) for k in intake.CanonicalOrg.__dataclass_fields__})
            for r in rows]


def parse_snapshot_csv(raw: bytes, source_url: str):
    """Parse a club-directory snapshot into normalized source rows.

    Column headers mirror the verified SCSN directory structure:
      Club Name | Club Director Name | Club Email Address | Club Phone number
                | Club Location/City | Club Area
    """
    text = raw.decode("utf-8-sig")
    rows = []
    for n, rec in enumerate(csv.DictReader(text.splitlines()), 1):
        rl = {(k or "").strip().lower(): (v or "").strip() for k, v in rec.items()}
        row = {
            "source_row_number": n,
            "source_external_id": rl.get("club id") or None,
            "source_name": rl.get("club name") or "",
            "source_city": rl.get("club location/city") or rl.get("city") or "",
            "source_state": rl.get("state") or "",
            "source_sport": "volleyball",
            "source_affiliation": rl.get("club area") or None,
            "source_website_url": rl.get("club website") or None,
            "source_contact_name": rl.get("club director name") or None,
            "source_contact_role": rl.get("role") or ("Club Director" if rl.get("club director name") else None),
            "source_contact_email": rl.get("club email address") or None,
            "source_contact_phone": rl.get("club phone number") or None,
            "source_url": source_url,
        }
        # Anything the source published that we do not model is kept only for
        # the screen, never stored.
        extra = {k: v for k, v in rl.items() if k not in {
            "club id", "club name", "club location/city", "city", "state",
            "club area", "club website", "club director name", "role",
            "club email address", "club phone number"} and v}
        if extra:
            row["_raw"] = json.dumps(extra)
        rows.append(row)
    return rows


# ---------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--snapshot", required=True)
    ap.add_argument("--orgs", required=True)
    ap.add_argument("--source-id", default="dsrc-scsn-club-directory")
    ap.add_argument("--source-name", default="USAV SCSN Region Club Directory")
    ap.add_argument("--source-url", required=True)
    ap.add_argument("--expected-rows", type=int, default=None)
    ap.add_argument("--allow-insert", action="store_true", default=True)
    ap.add_argument("--out", default=os.path.join(HERE, "out"))
    # The staging mirror is a scratch artifact, not a deliverable. It defaults
    # off the mounted share because SQLite's locking does not work reliably
    # over a Windows mount from the Linux sandbox (raises "disk I/O error").
    ap.add_argument("--staging-db", default=os.path.join(
        os.environ.get("TMPDIR", "/tmp"), "donny-pilot-staging.sqlite"))
    ap.add_argument("--crash-after", type=int, default=0,
                    help="Test hook: process this many rows then stop, simulating a crash.")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    t0 = time.time()

    # ---- 1. Policy gate --------------------------------------------------
    src = policy.SourceRecord(
        id=args.source_id, name=args.source_name, canonical_url=args.source_url,
        access_classification=policy.APPROVED_MANUAL_SNAPSHOT, is_active=1,
        refresh_cadence_days=365,
        last_policy_checked_at=datetime.date.today().isoformat(),
        robots_result="unverified", content_signal_reserved=0)
    gate = policy.gate_batch_lane(src)
    print("[gate] %s -> %s (%s)" % (src.name, "ALLOWED" if gate.allowed else "DENIED", gate.reason))
    gate.raise_if_denied()

    # ---- 2. Stage the snapshot ------------------------------------------
    raw = open(args.snapshot, "rb").read()
    sha = intake.content_sha256(raw)
    batch_id = intake.batch_id_for(args.source_id, sha)
    print("[snapshot] %d bytes  sha256=%s" % (len(raw), sha))
    print("[batch] %s" % batch_id)

    db = sqlite3.connect(args.staging_db)
    db.row_factory = sqlite3.Row
    db.executescript(open(os.path.join(HERE, "schema_local.sql"), encoding="utf-8").read())

    # Replay guard. An identical snapshot is a no-op ONLY when the existing
    # batch actually finished. An interrupted batch has the same hash and must
    # resume, not be mistaken for a completed replay -- getting this wrong
    # means a crashed run can never be picked back up.
    replay = db.execute("SELECT id, status, extracted_row_count FROM directory_batches "
                        "WHERE directory_source_id=? AND content_sha256=?",
                        (args.source_id, sha)).fetchone()
    if replay:
        done = db.execute(
            "SELECT COUNT(*) AS n FROM directory_rows WHERE directory_batch_id=? "
            "AND disposition IS NOT NULL", (replay["id"],)).fetchone()["n"]
        if replay["status"] in ("complete", "dry_run") and done:
            print("[replay] identical snapshot already completed as %s (%d rows) -- NO-OP"
                  % (replay["id"], done))
            return
        print("[replay] identical snapshot found in status=%s with %d rows dispositioned; "
              "resuming rather than restarting" % (replay["status"], done))

    if not replay:
        db.execute(
            "INSERT INTO directory_batches (id, directory_source_id, snapshot_date, source_url, "
            "content_sha256, content_bytes, expected_row_count, status, is_dry_run, started_at) "
            "VALUES (?,?,?,?,?,?,?, 'parsing', 1, ?)",
            (batch_id, args.source_id, datetime.date.today().isoformat(), args.source_url,
             sha, len(raw), args.expected_rows, intake.utcnow()))
        db.commit()

    # ---- 3. Parse --------------------------------------------------------
    rows = parse_snapshot_csv(raw, args.source_url)
    print("[parse] extracted %d rows" % len(rows))

    # ---- 4. Match + disposition -----------------------------------------
    index = intake.CanonicalIndex(load_orgs(args.orgs))
    print("[index] %d canonical organizations in scope" % len(index.by_id))

    # Resume by PRESENCE, not by MAX(source_row_number). A crashed run may have
    # written rows out of order, or a parser change may have filled a gap; a
    # high-water mark would silently skip everything below it. The set of
    # already-dispositioned row numbers is the only safe resume key, and it
    # agrees with the unique index on (batch_id, source_row_number).
    done_rows = {r["source_row_number"] for r in db.execute(
        "SELECT source_row_number FROM directory_rows WHERE directory_batch_id=? "
        "AND disposition IS NOT NULL", (batch_id,)).fetchall()}
    if done_rows:
        print("[resume] %d row(s) already dispositioned; processing the %d that are not"
              % (len(done_rows), len(rows) - len(done_rows)))

    dedupe, tiers, skipped, processed = [], [], 0, 0
    for row in rows:
        n = row["source_row_number"]
        if n in done_rows:
            skipped += 1
            continue
        if args.crash_after and processed >= args.crash_after:
            print("[crash-after] stopping after %d rows this run (test hook)" % processed)
            break
        processed += 1

        screen = intake.screen_row(row)
        match = index.match(row) if screen.ok else intake.MatchResult(None, "none", 0.0, "screened out")
        disp, why = intake.decide_disposition(screen, match, args.allow_insert)
        org = index.by_id.get(match.organization_id) if match.organization_id else None

        store = dict(row)
        if not screen.ok:                     # never persist the offending values
            for f in ("source_contact_name", "source_contact_email",
                      "source_contact_phone", "source_contact_role"):
                store[f] = None
        store.pop("_raw", None)

        # Completeness is scored on what was actually STORED, not on what the
        # source offered. An excluded row had its contact values stripped, so it
        # must not count as contact-complete.
        tier = intake.completeness_tier(store, org)

        rid = intake.row_id_for(batch_id, n)
        db.execute(
            "INSERT OR IGNORE INTO directory_rows (id, directory_batch_id, source_external_id, "
            "source_row_number, source_name, source_city, source_state, source_sport, "
            "source_affiliation, source_website_url, source_contact_name, source_contact_role, "
            "source_contact_email, source_contact_phone, source_url, canonical_organization_id, "
            "match_method, match_confidence, disposition, disposition_reason, completeness_tier) "
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (rid, batch_id, store.get("source_external_id"), n, store["source_name"],
             store.get("source_city"), store.get("source_state"), store.get("source_sport"),
             store.get("source_affiliation"), store.get("source_website_url"),
             store.get("source_contact_name"), store.get("source_contact_role"),
             store.get("source_contact_email"), store.get("source_contact_phone"),
             store["source_url"], match.organization_id, match.method,
             match.confidence, disp, why, tier))
        tiers.append(tier)

        # ---- plan writes (recorded as dry_run; nothing is executed) -------
        def log(action, target, target_id, before, after, status="dry_run"):
            e = {
                "id": intake.dedupe_id_for(batch_id, rid, action, str(target_id)),
                "directory_batch_id": batch_id, "directory_row_id": rid,
                "canonical_organization_id": match.organization_id,
                "action": action, "target_table": target, "target_id": target_id,
                "match_method": match.method,
                "before_json": json.dumps(before) if before is not None else None,
                "after_json": json.dumps(after) if after is not None else None,
                "confidence": match.confidence, "review_status": status,
                "created_at": intake.utcnow(),
            }
            dedupe.append(e)
            db.execute(
                "INSERT OR IGNORE INTO dedupe_log (id, directory_batch_id, directory_row_id, "
                "canonical_organization_id, action, target_table, target_id, match_method, "
                "before_json, after_json, confidence, review_status, created_at) "
                "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
                tuple(e[k] for k in ("id", "directory_batch_id", "directory_row_id",
                                     "canonical_organization_id", "action", "target_table",
                                     "target_id", "match_method", "before_json", "after_json",
                                     "confidence", "review_status", "created_at")))

        if disp == "matched" and org:
            log("match", "directory_rows", rid, None, {"organization_id": org.id})
            for p in intake.plan_field_updates(org, row):
                log("field_update", "organizations", org.id,
                    {p["field"]: p["before"]}, {p["field"]: p["after"]})
            alias = intake.plan_alias_add(org, row)
            if alias:
                log("alias_add", "organizations", org.id,
                    {"aliases": alias["before"]}, {"aliases": alias["after"]})
            c = intake.plan_contact_upsert(org.id, row, args.source_name, org)
            if c:
                log("contact_upsert", "org_contacts", c["id"], None,
                    {k: c[k] for k in ("role", "is_public", "source", "confidence")})
        elif disp == "candidate":
            log("insert_candidate", "organizations", None, None,
                {"name": row["source_name"], "city": row.get("source_city")}, "pending_review")
        elif disp == "needs_review":
            log("hold_for_review", "directory_rows", rid, None, {"reason": why}, "pending_review")
        elif disp == "excluded":
            log("exclude", "directory_rows", rid, None, {"reason": why}, "auto_applied")

    db.commit()

    # ---- 5. Reconcile ----------------------------------------------------
    stored = [dict(r) for r in db.execute(
        "SELECT * FROM directory_rows WHERE directory_batch_id=? ORDER BY source_row_number",
        (batch_id,)).fetchall()]
    all_log = [dict(r) for r in db.execute(
        "SELECT * FROM dedupe_log WHERE directory_batch_id=?", (batch_id,)).fetchall()]

    db.execute("UPDATE directory_batches SET extracted_row_count=? WHERE id=?",
               (len(stored), batch_id))
    batch = dict(db.execute("SELECT * FROM directory_batches WHERE id=?", (batch_id,)).fetchone())
    rec = intake.reconcile_batch(batch, stored, all_log)

    counts = {d: sum(1 for r in stored if r["disposition"] == d) for d in intake.DISPOSITIONS}
    tier_c = intake.tier_counts([r["completeness_tier"] for r in stored])
    contact_complete = sum(1 for r in stored
                           if r["disposition"] in ("matched", "candidate")
                           and (r["source_contact_email"] or r["source_contact_phone"]))

    db.execute(
        "UPDATE directory_batches SET matched_count=?, candidate_count=?, excluded_count=?, "
        "needs_review_count=?, contact_complete_count=?, completeness_json=?, "
        "status=?, completed_at=?, resume_after_row=? WHERE id=?",
        (counts["matched"], counts["candidate"], counts["excluded"], counts["needs_review"],
         contact_complete, json.dumps(tier_c),
         "dry_run" if rec.ok else "failed", intake.utcnow(), len(stored), batch_id))
    db.commit()

    elapsed = time.time() - t0
    result = {
        "batch_id": batch_id, "source": args.source_name, "source_url": args.source_url,
        "content_sha256": sha, "content_bytes": len(raw),
        "expected_row_count": args.expected_rows, "extracted_row_count": len(stored),
        "rows_skipped_by_resume": skipped,
        "dispositions": counts, "completeness": tier_c,
        "contact_channels_on_usable_rows": contact_complete,
        "match_methods": {m: sum(1 for r in stored if r["match_method"] == m)
                          for m in sorted({r["match_method"] for r in stored if r["match_method"]})},
        "website_additions_planned": sum(1 for d in all_log if d["action"] == "field_update"),
        "alias_additions_planned": sum(1 for d in all_log if d["action"] == "alias_add"),
        "contact_upserts_planned": sum(1 for d in all_log if d["action"] == "contact_upsert"),
        "dedupe_entries": len(all_log),
        "reconciliation": rec.as_dict(),
        "rollback_steps": len(intake.build_rollback_plan(
            [dict(d, review_status="auto_applied") for d in all_log])),
        "elapsed_seconds": round(elapsed, 2),
        "rows_per_minute": round(len(stored) / max(elapsed, 0.001) * 60, 1),
        "masked_samples": [intake.mask_row(r) for r in stored[:5]],
        "wrote_to_production": False,
    }
    out = os.path.join(args.out, "pilot-report-%s.json" % datetime.date.today().isoformat())
    with open(out, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print("\n[dispositions] " + "  ".join("%s=%d" % kv for kv in counts.items()))
    print("[completeness] " + "  ".join("%s=%d" % kv for kv in tier_c.items()))
    print("[match methods] " + "  ".join("%s=%d" % kv for kv in result["match_methods"].items()))
    print("[planned] website=%d alias=%d contact=%d  dedupe_entries=%d rollback_steps=%d"
          % (result["website_additions_planned"], result["alias_additions_planned"],
             result["contact_upserts_planned"], len(all_log), result["rollback_steps"]))
    print("[reconcile] %s%s" % ("PASS" if rec.ok else "FAIL",
                                "" if rec.ok else " -> " + "; ".join(rec.failures)))
    print("[timing] %.2fs  %.1f rows/min" % (elapsed, result["rows_per_minute"]))
    print("[report] %s" % out)
    print("[production] nothing written. is_dry_run=1 on the batch row.")


if __name__ == "__main__":
    main()
