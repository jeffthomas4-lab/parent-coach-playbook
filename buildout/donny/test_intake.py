#!/usr/bin/env python3
"""
Donny directory-batch lane tests. Stdlib unittest, no external deps.

  python3 buildout/donny/test_intake.py -v

ALL FIXTURES ARE SYNTHETIC. No real organization name, person, email, or phone
number appears in this file. Domains use .invalid / .example per RFC 2606 and
RFC 6761 so nothing here can resolve.
"""

from __future__ import annotations

import datetime
import json
import os
import sqlite3
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import intake  # noqa: E402
import policy  # noqa: E402


# ---------------------------------------------------------------------------
# Synthetic fixtures
# ---------------------------------------------------------------------------

def org(oid, name, city="Springfield", state="ZZ", website=None, ein=None,
        aliases=None, categories=None, is_claimed=0, deleted_at=None):
    return intake.CanonicalOrg(
        id=oid, name=name, city=city, state=state, website_url=website, ein=ein,
        aliases=json.dumps(aliases) if aliases else None,
        categories=categories, is_claimed=is_claimed, deleted_at=deleted_at)


def srow(n, name, **kw):
    base = {
        "source_row_number": n,
        "source_name": name,
        "source_city": "Springfield",
        "source_state": "ZZ",
        "source_url": "https://directory.example/snapshot",
    }
    base.update(kw)
    return base


FIXTURE_ORGS = [
    org("org-aaa", "Northside Volleyball Academy", website="https://northside-vb.invalid"),
    org("org-bbb", "Riverbend Junior Athletics", ein="123456789"),
    org("org-ccc", "Lakeview Volleyball Club", city="Lakeview", categories='["volleyball"]'),
    org("org-ddd", "Summit Sports Alliance", website="https://summit-sports.invalid", is_claimed=1),
    org("org-eee", "Harbor Point Volleyball", city="Harbor Point", categories='["volleyball"]'),
]


# ---------------------------------------------------------------------------

class TestSnapshotIdentityAndReplay(unittest.TestCase):
    """Same snapshot replay is a no-op."""

    def test_identical_bytes_produce_identical_batch_id(self):
        data = b"club,city\nAlpha,Springfield\n"
        a = intake.batch_id_for("src-1", intake.content_sha256(data))
        b = intake.batch_id_for("src-1", intake.content_sha256(data))
        self.assertEqual(a, b)

    def test_changed_bytes_produce_a_new_batch_id(self):
        a = intake.batch_id_for("src-1", intake.content_sha256(b"one"))
        b = intake.batch_id_for("src-1", intake.content_sha256(b"two"))
        self.assertNotEqual(a, b)

    def test_replay_is_rejected_by_the_unique_index(self):
        """The DB, not the caller, is what makes replay a no-op."""
        con = sqlite3.connect(":memory:")
        con.executescript("""
            CREATE TABLE directory_batches (
              id TEXT PRIMARY KEY, directory_source_id TEXT NOT NULL,
              content_sha256 TEXT NOT NULL, snapshot_date TEXT, source_url TEXT);
            CREATE UNIQUE INDEX idx_replay
              ON directory_batches(directory_source_id, content_sha256);
        """)
        sha = intake.content_sha256(b"payload")
        bid = intake.batch_id_for("src-1", sha)
        ins = "INSERT INTO directory_batches VALUES (?,?,?,?,?)"
        con.execute(ins, (bid, "src-1", sha, "2026-08-08", "https://x.example"))
        with self.assertRaises(sqlite3.IntegrityError):
            con.execute(ins, (bid, "src-1", sha, "2026-08-09", "https://x.example"))
        self.assertEqual(con.execute("SELECT COUNT(*) FROM directory_batches").fetchone()[0], 1)

    def test_row_ids_are_deterministic_so_resume_cannot_duplicate(self):
        bid = "dbatch-x"
        self.assertEqual(intake.row_id_for(bid, 51), intake.row_id_for(bid, 51))
        self.assertNotEqual(intake.row_id_for(bid, 51), intake.row_id_for(bid, 52))


class TestResume(unittest.TestCase):
    """Interrupted batch resumes without duplicates."""

    def setUp(self):
        self.con = sqlite3.connect(":memory:")
        self.con.executescript("""
            CREATE TABLE directory_rows (
              id TEXT PRIMARY KEY, directory_batch_id TEXT NOT NULL,
              source_row_number INTEGER NOT NULL, source_name TEXT,
              disposition TEXT);
            CREATE UNIQUE INDEX idx_rownum
              ON directory_rows(directory_batch_id, source_row_number);
        """)

    def _write(self, bid, start, end):
        written = 0
        for n in range(start, end + 1):
            try:
                self.con.execute(
                    "INSERT INTO directory_rows VALUES (?,?,?,?,?)",
                    (intake.row_id_for(bid, n), bid, n, "Club %d" % n, "matched"))
                written += 1
            except sqlite3.IntegrityError:
                pass          # already dispositioned by the interrupted run
        return written

    def test_crash_after_row_50_resumes_at_51(self):
        bid = "dbatch-resume"
        self.assertEqual(self._write(bid, 1, 50), 50)          # first run, then crash
        resume_after = self.con.execute(
            "SELECT COALESCE(MAX(source_row_number),0) FROM directory_rows "
            "WHERE directory_batch_id=? AND disposition IS NOT NULL", (bid,)).fetchone()[0]
        self.assertEqual(resume_after, 50)
        self.assertEqual(self._write(bid, resume_after + 1, 100), 50)
        total = self.con.execute(
            "SELECT COUNT(*) FROM directory_rows WHERE directory_batch_id=?", (bid,)).fetchone()[0]
        self.assertEqual(total, 100)

    def test_naive_restart_from_row_1_does_not_duplicate(self):
        bid = "dbatch-resume2"
        self._write(bid, 1, 50)
        self.assertEqual(self._write(bid, 1, 100), 50)         # 50 collide, 50 new
        self.assertEqual(self.con.execute(
            "SELECT COUNT(*) FROM directory_rows").fetchone()[0], 100)


class TestMatching(unittest.TestCase):
    def setUp(self):
        self.idx = intake.CanonicalIndex(FIXTURE_ORGS)

    def test_exact_domain_matches(self):
        r = self.idx.match(srow(1, "Northside VBA", source_website_url="http://www.northside-vb.invalid/teams"))
        self.assertEqual(r.organization_id, "org-aaa")
        self.assertEqual(r.method, "domain_geo")
        self.assertTrue(r.auto_appliable)

    def test_exact_ein_matches(self):
        r = self.idx.match(srow(1, "Totally Different Name", source_ein="12-3456789"))
        self.assertEqual(r.organization_id, "org-bbb")
        self.assertEqual(r.method, "ein")

    def test_exact_name_city_state_matches(self):
        r = self.idx.match(srow(1, "Lakeview Volleyball Club", source_city="Lakeview"))
        self.assertEqual(r.organization_id, "org-ccc")
        self.assertEqual(r.method, "name_city_state")

    def test_source_membership_beats_everything(self):
        r = self.idx.match(srow(1, "Anything", source_external_id="EXT-9"),
                           membership={"EXT-9": "org-eee"})
        self.assertEqual(r.organization_id, "org-eee")
        self.assertEqual(r.method, "source_membership")

    def test_fuzzy_name_only_is_held_not_merged(self):
        """The rule the brief calls out by name: never auto-merge on name alone."""
        r = self.idx.match(srow(1, "Lakeview Volleyball Club Inc", source_city="Elsewhere",
                                source_state="QQ"))
        self.assertIsNone(r.organization_id)
        self.assertEqual(r.method, "fuzzy_held")
        self.assertFalse(r.auto_appliable)
        d, why = intake.decide_disposition(intake.ScreenResult(True), r, allow_insert=True)
        self.assertEqual(d, "needs_review")

    def test_shared_platform_domain_never_matches(self):
        """Otherwise every club on one registration platform merges into one org."""
        idx = intake.CanonicalIndex([
            org("org-p1", "Club One", website="https://clubone.sportsengine.com"),
            org("org-p2", "Club Two", website="https://clubtwo.sportsengine.com"),
        ])
        r = idx.match(srow(1, "Club Three", source_website_url="https://clubthree.sportsengine.com"))
        self.assertNotEqual(r.method, "domain_geo")

    def test_ambiguous_domain_is_held(self):
        idx = intake.CanonicalIndex([
            org("org-x", "X", website="https://shared.invalid"),
            org("org-y", "Y", website="https://shared.invalid"),
        ])
        r = idx.match(srow(1, "Z", source_website_url="https://shared.invalid"))
        self.assertIsNone(r.organization_id)
        self.assertEqual(r.method, "fuzzy_held")
        self.assertEqual(len(r.conflicts), 2)

    def test_no_match_becomes_candidate_when_inserts_allowed(self):
        r = self.idx.match(srow(1, "Brand New Club That Does Not Exist", source_city="Nowhere"))
        self.assertEqual(r.method, "none")
        self.assertEqual(intake.decide_disposition(intake.ScreenResult(True), r, True)[0], "candidate")
        self.assertEqual(intake.decide_disposition(intake.ScreenResult(True), r, False)[0], "needs_review")


class TestIdentityStability(unittest.TestCase):
    def test_rename_keeps_canonical_id_and_adds_alias(self):
        o = org("org-aaa", "Northside Volleyball Academy", website="https://northside-vb.invalid")
        idx = intake.CanonicalIndex([o])
        row = srow(1, "Northside Volleyball Club", source_website_url="https://northside-vb.invalid")
        m = idx.match(row)
        self.assertEqual(m.organization_id, "org-aaa")          # id does NOT move
        alias = intake.plan_alias_add(o, row)
        self.assertIsNotNone(alias)
        self.assertEqual(alias["field"], "aliases")
        self.assertIn("Northside Volleyball Club", json.loads(alias["after"]))

    def test_alias_add_is_idempotent(self):
        o = org("org-aaa", "Northside Volleyball Academy", aliases=["Northside VBA"])
        self.assertIsNone(intake.plan_alias_add(o, srow(1, "Northside VBA")))
        self.assertIsNone(intake.plan_alias_add(o, srow(1, "Northside Volleyball Academy")))


class TestNoClobber(unittest.TestCase):
    def test_claimed_org_is_never_written_to(self):
        o = org("org-ddd", "Summit Sports Alliance", website="https://summit-sports.invalid", is_claimed=1)
        self.assertEqual(intake.plan_field_updates(o, srow(1, "Summit", source_website_url="https://other.invalid")), [])

    def test_existing_website_is_never_overwritten(self):
        o = org("org-aaa", "Northside", website="https://owner-submitted.invalid")
        self.assertEqual(intake.plan_field_updates(o, srow(1, "Northside", source_website_url="https://directory-says.invalid")), [])

    def test_blank_website_is_filled_and_carries_a_before_value(self):
        o = org("org-zzz", "Empty Club", website=None)
        plans = intake.plan_field_updates(o, srow(1, "Empty Club", source_website_url="https://found.invalid"))
        self.assertEqual(len(plans), 1)
        self.assertEqual(plans[0]["after"], "https://found.invalid")
        self.assertIsNone(plans[0]["before"])          # before value present for rollback

    def test_shared_platform_url_does_not_fill_website(self):
        o = org("org-zzz", "Empty Club", website=None)
        self.assertEqual(intake.plan_field_updates(o, srow(1, "Empty Club", source_website_url="https://c.leagueapps.com")), [])


class TestYouthDataScreen(unittest.TestCase):
    def test_roster_like_row_is_rejected(self):
        s = intake.screen_row(srow(1, "Springfield 14U Team",
                                   source_contact_role="Athlete",
                                   source_contact_name="A Player"))
        self.assertFalse(s.ok)

    def test_date_of_birth_is_rejected(self):
        s = intake.screen_row(srow(1, "Some Club", _raw="Member DOB 03/14/2011"))
        self.assertFalse(s.ok)

    def test_grade_and_class_year_are_rejected(self):
        self.assertFalse(intake.screen_row(srow(1, "Club", _raw="Grade 7 roster")).ok)
        self.assertFalse(intake.screen_row(srow(1, "Club", _raw="Class of 2031")).ok)

    def test_parent_and_emergency_contact_rejected(self):
        self.assertFalse(intake.screen_row(srow(1, "Club", source_contact_role="Parent")).ok)
        self.assertFalse(intake.screen_row(srow(1, "Club", _raw="emergency contact list")).ok)

    def test_medical_fields_rejected(self):
        self.assertFalse(intake.screen_row(srow(1, "Club", _raw="allergy information")).ok)

    def test_unexpected_field_carrying_data_is_rejected(self):
        s = intake.screen_row(srow(1, "Club", jersey_number="12"))
        self.assertFalse(s.ok)

    def test_adult_role_contact_is_accepted(self):
        s = intake.screen_row(srow(1, "Northside Volleyball Academy",
                                   source_contact_role="Club Director",
                                   source_contact_name="Pat Q Example",
                                   source_contact_email="director@northside-vb.invalid"))
        self.assertTrue(s.ok, s.reason)

    def test_rejected_row_still_gets_a_disposition(self):
        """Excluded rows must still reconcile. Silent drops are the failure mode."""
        s = intake.screen_row(srow(1, "Club", source_contact_role="Camper"))
        d, why = intake.decide_disposition(s, intake.MatchResult(None, "none", 0, ""), True)
        self.assertEqual(d, "excluded")
        self.assertTrue(why)


class TestContactUpsert(unittest.TestCase):
    def test_upsert_is_idempotent_on_repeat_snapshots(self):
        row = srow(1, "Club", source_contact_email="Director@Club.invalid",
                   source_contact_role="Club Director", source_contact_name="R Example")
        a = intake.plan_contact_upsert("org-aaa", row, "Test Directory")
        b = intake.plan_contact_upsert("org-aaa", dict(row), "Test Directory")
        self.assertEqual(a["id"], b["id"])
        self.assertEqual(a["idempotency_key"], b["idempotency_key"])

    def test_shared_mailbox_is_preferred_and_drops_the_person_name(self):
        p = intake.plan_contact_upsert("org-aaa", srow(
            1, "Club", source_contact_email="info@club.invalid",
            source_contact_name="A Person", source_contact_role="Office"), "D")
        self.assertEqual(p["is_shared_mailbox"], 1)
        self.assertIsNone(p["full_name"])

    def test_named_role_contact_keeps_the_name(self):
        p = intake.plan_contact_upsert("org-aaa", srow(
            1, "Club", source_contact_email="pat.example@club.invalid",
            source_contact_name="Pat Example", source_contact_role="Registrar"), "D")
        self.assertEqual(p["is_shared_mailbox"], 0)
        self.assertEqual(p["full_name"], "Pat Example")
        self.assertEqual(p["role"], "registrar")

    def test_public_channel_is_not_marketing_consent(self):
        p = intake.plan_contact_upsert("org-aaa", srow(
            1, "Club", source_contact_email="info@club.invalid"), "D")
        self.assertEqual(p["is_public"], 1)
        self.assertNotIn("consent", p)
        self.assertNotIn("do_not_contact", p)          # never asserted by this lane

    def test_upsert_sql_cannot_weaken_suppression(self):
        sql, _ = intake.contact_upsert_sql(intake.plan_contact_upsert(
            "org-aaa", srow(1, "Club", source_contact_email="info@club.invalid"), "D"))
        upd = sql.split("DO UPDATE SET", 1)[1]
        for col in ("do_not_contact", "do_not_contact_at", "do_not_contact_reason", "deleted_at"):
            self.assertNotIn(col + " =", upd)
            self.assertNotIn(col + "=", upd)

    def test_dnc_row_survives_a_real_upsert(self):
        con = sqlite3.connect(":memory:")
        con.executescript("""
            CREATE TABLE org_contacts (
              id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, full_name TEXT,
              role TEXT DEFAULT 'unknown', email TEXT, phone TEXT,
              is_public INTEGER DEFAULT 0, do_not_contact INTEGER NOT NULL DEFAULT 0,
              do_not_contact_reason TEXT, source TEXT, source_url TEXT,
              confidence TEXT, verification_method TEXT, verified_at TEXT,
              verified_by TEXT, deleted_at TEXT, created_at TEXT, updated_at TEXT);
            CREATE UNIQUE INDEX ix ON org_contacts(organization_id, email)
              WHERE email IS NOT NULL AND deleted_at IS NULL;
        """)
        con.execute(
            "INSERT INTO org_contacts (id, organization_id, email, do_not_contact, "
            "do_not_contact_reason, role) VALUES (?,?,?,?,?,?)",
            ("existing", "org-aaa", "info@club.invalid", 1, "unsubscribed", "director"))
        plan = intake.plan_contact_upsert("org-aaa", srow(
            1, "Club", source_contact_email="info@club.invalid",
            source_contact_role="Registrar"), "D")
        sql, params = intake.contact_upsert_sql(plan)
        con.execute(sql, params)
        row = con.execute(
            "SELECT do_not_contact, do_not_contact_reason, role, COUNT(*) "
            "FROM org_contacts WHERE organization_id='org-aaa'").fetchone()
        self.assertEqual(row[0], 1)                    # still suppressed
        self.assertEqual(row[1], "unsubscribed")       # reason intact
        self.assertEqual(row[2], "director")           # existing role not downgraded
        self.assertEqual(row[3], 1)                    # no duplicate row

    def test_changed_contact_is_an_auditable_update(self):
        before = {"phone": None, "role": "unknown"}
        entry = {
            "id": "ddl-1", "directory_batch_id": "b1", "directory_row_id": "r1",
            "canonical_organization_id": "org-aaa", "action": "contact_upsert",
            "target_table": "org_contacts", "target_id": "octc-1",
            "before_json": json.dumps(before),
            "after_json": json.dumps({"phone": "5550000000", "role": "registrar"}),
            "review_status": "auto_applied", "created_at": intake.utcnow(),
        }
        plan = intake.build_rollback_plan([entry])
        self.assertEqual(len(plan), 1)
        self.assertIn("UPDATE org_contacts SET", plan[0]["sql"])
        self.assertIn(None, plan[0]["params"])         # restores the prior NULL


class TestPolicyGate(unittest.TestCase):
    TODAY = datetime.date(2026, 8, 8)

    def _src(self, **kw):
        base = dict(id="src-1", name="Test", canonical_url="https://directory.example/list",
                    access_classification=policy.APPROVED_MANUAL_SNAPSHOT, is_active=1,
                    refresh_cadence_days=180, last_policy_checked_at="2026-08-01")
        base.update(kw)
        return policy.SourceRecord(**base)

    def test_approved_manual_snapshot_passes(self):
        self.assertTrue(policy.gate_batch_lane(self._src(), self.TODAY).allowed)

    def test_blocked_source_cannot_enter_the_batch_lane(self):
        r = policy.gate_batch_lane(self._src(access_classification=policy.BLOCKED), self.TODAY)
        self.assertFalse(r.allowed)

    def test_validation_only_cannot_enumerate_a_group(self):
        r = policy.gate_batch_lane(self._src(access_classification=policy.VALIDATION_ONLY), self.TODAY)
        self.assertFalse(r.allowed)
        self.assertIn("may not enumerate", r.reason)

    def test_permission_required_is_denied(self):
        self.assertFalse(policy.gate_batch_lane(
            self._src(access_classification=policy.PERMISSION_REQUIRED), self.TODAY).allowed)

    def test_robots_disallow_denies_even_when_classified_approved(self):
        r = policy.gate_batch_lane(self._src(robots_result="disallowed"), self.TODAY)
        self.assertFalse(r.allowed)

    def test_content_signal_reservation_denies(self):
        r = policy.gate_batch_lane(self._src(content_signal_reserved=1), self.TODAY)
        self.assertFalse(r.allowed)
        self.assertEqual(r.classification, policy.PERMISSION_REQUIRED)

    def test_stale_policy_check_denies(self):
        r = policy.gate_batch_lane(
            self._src(last_policy_checked_at="2025-01-01", refresh_cadence_days=90), self.TODAY)
        self.assertFalse(r.allowed)
        self.assertIn("stale", r.reason)

    def test_hard_deny_domain_overrides_a_bad_registry_edit(self):
        """Someone flipping AAU to approved in the table must still be stopped."""
        r = policy.gate_batch_lane(self._src(
            canonical_url="https://www.aausports.org/club-finder/",
            access_classification=policy.APPROVED_PUBLIC_BATCH), self.TODAY)
        self.assertFalse(r.allowed)
        self.assertIn("hard deny", r.reason)

    def test_robots_parser_detects_named_agent_block(self):
        txt = "User-agent: *\nAllow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n"
        self.assertTrue(policy.robots_disallows_agent(txt))

    def test_robots_parser_allows_permissive_file(self):
        self.assertFalse(policy.robots_disallows_agent("User-agent: *\nDisallow:\n"))
        self.assertFalse(policy.robots_disallows_agent("User-agent: *\nDisallow: /admin/\n"))

    def test_content_signal_parsed(self):
        cs = policy.parse_content_signal(
            "User-agent: *\nContent-Signal: search=yes,ai-train=no,use=reference\nAllow: /\n")
        self.assertEqual(cs["ai-train"], "no")
        self.assertEqual(cs["use"], "reference")


class TestRateLimit(unittest.TestCase):
    def test_interval_is_constant_not_randomized(self):
        """Regression guard against reintroducing human-mimicry pacing."""
        slept, t = [], [0.0]
        thr = policy.HostThrottle(policy.RateLimit(min_interval_seconds=10.0),
                                  sleeper=lambda s: (slept.append(s), t.__setitem__(0, t[0] + s)),
                                  clock=lambda: t[0])
        for _ in range(4):
            thr.acquire("https://a.example/x")
        self.assertEqual(slept, [10.0, 10.0, 10.0])
        self.assertEqual(len(set(slept)), 1)

    def test_run_cap_is_a_stop_condition(self):
        thr = policy.HostThrottle(policy.RateLimit(min_interval_seconds=0, max_requests_per_run=2),
                                  sleeper=lambda s: None, clock=lambda: 0.0)
        thr.acquire("https://a.example/1")
        thr.acquire("https://a.example/2")
        with self.assertRaises(policy.PolicyError):
            thr.acquire("https://a.example/3")

    def test_backoff_is_exponential_and_capped(self):
        rl = policy.RateLimit(backoff_base_seconds=30, backoff_max_seconds=120)
        self.assertEqual([rl.backoff_for(i) for i in (1, 2, 3, 4, 9)], [30, 60, 120, 120, 120])


class TestReconciliation(unittest.TestCase):
    def _rows(self, n, disposition="matched"):
        return [{"id": "r%d" % i, "source_row_number": i, "disposition": disposition}
                for i in range(1, n + 1)]

    def _log(self, rows):
        return [{"id": "d%d" % i, "directory_row_id": r["id"], "review_status": "auto_applied",
                 "created_at": intake.utcnow()} for i, r in enumerate(rows, 1)]

    def test_clean_batch_reconciles(self):
        rows = self._rows(10)
        batch = {"content_sha256": "abc", "expected_row_count": 10, "extracted_row_count": 10}
        rec = intake.reconcile_batch(batch, rows, self._log(rows))
        self.assertTrue(rec.ok, rec.failures)
        self.assertEqual(rec.counts["matched"], 10)

    def test_expected_vs_extracted_mismatch_fails(self):
        rows = self._rows(9)
        rec = intake.reconcile_batch(
            {"content_sha256": "a", "expected_row_count": 10, "extracted_row_count": 9},
            rows, self._log(rows))
        self.assertFalse(rec.ok)
        self.assertTrue(any("expected_row_count" in f for f in rec.failures))

    def test_row_with_no_disposition_fails(self):
        rows = self._rows(5)
        rows[2]["disposition"] = None
        rec = intake.reconcile_batch(
            {"content_sha256": "a", "expected_row_count": 5, "extracted_row_count": 5}, rows, [])
        self.assertFalse(rec.ok)
        self.assertTrue(any("no disposition" in f for f in rec.failures))

    def test_silently_vanished_row_fails(self):
        rows = self._rows(5)
        del rows[2]                                    # row 3 disappears
        rec = intake.reconcile_batch(
            {"content_sha256": "a", "expected_row_count": 4, "extracted_row_count": 4},
            rows, self._log(rows))
        self.assertFalse(rec.ok)
        self.assertTrue(any("gaps" in f for f in rec.failures))

    def test_applied_row_without_a_dedupe_entry_fails(self):
        rows = self._rows(3)
        rec = intake.reconcile_batch(
            {"content_sha256": "a", "expected_row_count": 3, "extracted_row_count": 3}, rows, [])
        self.assertFalse(rec.ok)
        self.assertTrue(any("no dedupe_log entry" in f for f in rec.failures))

    def test_missing_snapshot_hash_fails(self):
        rows = self._rows(2)
        rec = intake.reconcile_batch(
            {"content_sha256": "", "expected_row_count": 2, "extracted_row_count": 2},
            rows, self._log(rows))
        self.assertFalse(rec.ok)

    def test_excluded_rows_still_count_toward_completion(self):
        rows = self._rows(4, "excluded")
        rec = intake.reconcile_batch(
            {"content_sha256": "a", "expected_row_count": 4, "extracted_row_count": 4}, rows, [])
        self.assertTrue(rec.ok, rec.failures)
        self.assertEqual(rec.counts["excluded"], 4)


class TestRollback(unittest.TestCase):
    def test_rollback_restores_pre_batch_values(self):
        con = sqlite3.connect(":memory:")
        con.executescript("""
            CREATE TABLE organizations (id TEXT PRIMARY KEY, website_url TEXT,
              aliases TEXT, deleted_at TEXT, updated_at TEXT);
        """)
        con.execute("INSERT INTO organizations (id, website_url) VALUES ('org-aaa', NULL)")
        con.execute("UPDATE organizations SET website_url='https://found.invalid' WHERE id='org-aaa'")
        entry = {
            "id": "ddl-1", "directory_batch_id": "b1", "directory_row_id": "r1",
            "canonical_organization_id": "org-aaa", "action": "field_update",
            "target_table": "organizations", "target_id": "org-aaa",
            "before_json": json.dumps({"website_url": None}),
            "after_json": json.dumps({"website_url": "https://found.invalid"}),
            "review_status": "auto_applied", "created_at": intake.utcnow(),
        }
        for step in intake.build_rollback_plan([entry]):
            con.execute(step["sql"], step["params"])
        self.assertIsNone(con.execute(
            "SELECT website_url FROM organizations WHERE id='org-aaa'").fetchone()[0])

    def test_inserted_candidate_is_soft_deleted_not_hard_deleted(self):
        plan = intake.build_rollback_plan([{
            "id": "ddl-2", "directory_batch_id": "b1", "directory_row_id": "r2",
            "canonical_organization_id": "org-new", "action": "insert_candidate",
            "target_table": "organizations", "target_id": "org-new",
            "before_json": None, "after_json": json.dumps({"id": "org-new"}),
            "review_status": "auto_applied", "created_at": intake.utcnow()}])
        self.assertEqual(len(plan), 1)
        self.assertIn("deleted_at", plan[0]["sql"])
        self.assertNotIn("DELETE FROM", plan[0]["sql"].upper())

    def test_dry_run_entries_are_not_rolled_back(self):
        self.assertEqual(intake.build_rollback_plan([{
            "id": "d", "directory_batch_id": "b", "directory_row_id": "r",
            "canonical_organization_id": "o", "action": "field_update",
            "target_table": "organizations", "target_id": "o",
            "before_json": json.dumps({"website_url": None}), "after_json": "{}",
            "review_status": "dry_run", "created_at": intake.utcnow()}]), [])


class TestSnapshotDiff(unittest.TestCase):
    def test_changed_snapshot_reports_add_change_remove(self):
        prev = [srow(1, "Alpha Club"), srow(2, "Beta Club"), srow(3, "Gamma Club")]
        cur = [srow(1, "Alpha Club", source_website_url="https://alpha.invalid"),
               srow(2, "Beta Club"),
               srow(3, "Delta Club")]
        d = intake.diff_snapshots(prev, cur)
        self.assertEqual(d["added_count"], 1)
        self.assertEqual(d["removed_count"], 1)
        self.assertEqual(d["changed_count"], 1)
        self.assertEqual(d["changed"][0]["key"], "alpha club")

    def test_removal_is_recorded_not_deleted(self):
        d = intake.diff_snapshots([srow(1, "Gone Club")], [])
        self.assertEqual(d["removed"], ["gone club"])   # a report, not a DELETE


class TestCompleteness(unittest.TestCase):
    def test_tiers(self):
        self.assertEqual(intake.completeness_tier(
            {"source_name": "X"}, None), "C0")
        self.assertEqual(intake.completeness_tier(
            {"source_name": "X", "source_state": "ZZ"}, None), "C1")
        self.assertEqual(intake.completeness_tier(
            {"source_state": "ZZ", "source_website_url": "https://x.invalid"}, None), "C2")
        self.assertEqual(intake.completeness_tier(
            {"source_state": "ZZ", "source_contact_email": "info@x.invalid"}, None), "C3")
        self.assertEqual(intake.completeness_tier(
            {"source_contact_email": "info@x.invalid"}, None,
            contact_validated=True, suppression_checked=True), "C4")

    def test_website_on_the_canonical_org_counts_for_c2(self):
        o = org("org-aaa", "X", website="https://known.invalid")
        self.assertEqual(intake.completeness_tier({"source_name": "X"}, o), "C2")

    def test_batch_completion_is_not_contact_completion(self):
        """The distinction the brief insists on: all rows processed != contacts done."""
        rows = [{"id": "r%d" % i, "source_row_number": i, "disposition": "matched"}
                for i in range(1, 6)]
        log = [{"id": "d%d" % i, "directory_row_id": "r%d" % i,
                "review_status": "auto_applied", "created_at": intake.utcnow()}
               for i in range(1, 6)]
        rec = intake.reconcile_batch(
            {"content_sha256": "a", "expected_row_count": 5, "extracted_row_count": 5}, rows, log)
        self.assertTrue(rec.ok)                       # batch complete
        tiers = intake.tier_counts(["C1", "C1", "C2", "C0", "C1"])
        self.assertEqual(tiers["C3"], 0)              # zero contact-complete


class TestMasking(unittest.TestCase):
    def test_masked_row_leaks_nothing(self):
        m = intake.mask_row(srow(1, "Club", source_contact_email="director@club.invalid",
                                 source_contact_phone="(555) 867-5309",
                                 source_contact_name="Pat Q Example", _raw="dropped"))
        self.assertNotIn("director@club.invalid", json.dumps(m))
        self.assertNotIn("8675309", json.dumps(m))
        self.assertNotIn("Pat", json.dumps(m))
        self.assertNotIn("_raw", m)
        self.assertTrue(m["source_contact_email"].endswith(".invalid"))
        self.assertEqual(m["source_contact_name"], "P. Q. E.")


class TestImporterIdentity(unittest.TestCase):
    """The individual-search lane's identity fix."""

    def setUp(self):
        sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                        "..", "hit-rate-test"))
        import import_results
        self.ir = import_results

    def test_worklist_id_wins(self):
        wl = {self.ir.nck("Some Club", "Springfield", "ZZ"): "org-live"}
        oid, method, _ = self.ir.resolve_org_id(
            {"name": "Some Club", "city": "Springfield", "state": "ZZ", "org_id": "org-garbage"},
            wl, {"org-live"})
        self.assertEqual((oid, method), ("org-live", "worklist"))

    def test_carried_id_used_when_it_exists(self):
        """The 2-of-37 case: agent id correct, recompute would have broken it."""
        oid, method, _ = self.ir.resolve_org_id(
            {"name": "Club", "city": "Mountlake Terrace", "state": "WA", "org_id": "org-real"},
            {}, {"org-real"})
        self.assertEqual((oid, method), ("org-real", "carried"))

    def test_recompute_repairs_a_corrupted_id(self):
        """The 35-of-37 case: agent UUID hallucinated, recompute rescues it."""
        legacy = self.ir.legacy_org_id("Club", "Springfield", "ZZ")
        oid, method, note = self.ir.resolve_org_id(
            {"name": "Club", "city": "Springfield", "state": "ZZ",
             "org_id": "org-0e16372e-9f8b-5a6e-db05-7b4f3e2a1h5d"},
            {}, {legacy})
        self.assertEqual((oid, method), (legacy, "recomputed_repair"))
        self.assertIn("repaired", note)

    def test_unresolvable_row_is_held_never_guessed(self):
        oid, method, note = self.ir.resolve_org_id(
            {"name": "Ghost Club", "city": "Nowhere", "state": "ZZ", "org_id": "org-nope"},
            {}, {"org-unrelated"})
        self.assertIsNone(oid)
        self.assertEqual(method, "unresolved")
        self.assertIn("neither", note)

    def test_no_live_ids_refuses_rather_than_guessing(self):
        oid, method, _ = self.ir.resolve_org_id(
            {"name": "Club", "city": "X", "state": "ZZ", "org_id": "org-x"}, {}, None)
        self.assertIsNone(oid)
        self.assertEqual(method, "unverified")


class TestReadmeExamplesAreExecutable(unittest.TestCase):
    """The brief calls out stale README examples as a defect. This proves the
    commands the README now prints refer to files that actually exist."""

    ROOT = os.path.dirname(os.path.abspath(__file__))

    def test_referenced_scripts_exist(self):
        readme = os.path.join(self.ROOT, "..", "hit-rate-test", "README.md")
        if not os.path.exists(readme):
            self.skipTest("README not present")
        text = open(readme, encoding="utf-8").read()
        import re as _re
        for rel in sorted(set(_re.findall(r"buildout/[\w./-]+\.(?:py|sql|md)", text))):
            path = os.path.join(self.ROOT, "..", "..", rel)
            self.assertTrue(os.path.exists(path), "README references missing file: %s" % rel)

    def test_no_retired_commands_in_readme(self):
        """Retired behavior may be DESCRIBED (so the history is legible) but must
        never appear as a runnable instruction. So this checks for the executable
        idioms, not for prose that explains why they are gone."""
        readme = os.path.join(self.ROOT, "..", "hit-rate-test", "README.md")
        if not os.path.exists(readme):
            self.skipTest("README not present")
        with open(readme, encoding="utf-8") as f:
            text = f.read()

        # The human-mimicry sleep idiom, in any spelling.
        self.assertNotIn("$((RANDOM", text, "randomized human-mimicry pacing is back")
        self.assertNotIn("sleep $", text, "randomized human-mimicry pacing is back")

        # wrangler d1 execute may only appear inside an explicit prohibition.
        for line_no, line in enumerate(text.splitlines(), 1):
            if "wrangler d1 execute" in line:
                window = " ".join(text.splitlines()[max(0, line_no - 3):line_no + 1])
                self.assertIn("Do not use", window,
                              "line %d presents `wrangler d1 execute` as runnable" % line_no)

    def test_batch_lane_readme_exists(self):
        self.assertTrue(os.path.exists(os.path.join(self.ROOT, "README.md")),
                        "buildout/donny/README.md is referenced but missing")


if __name__ == "__main__":
    unittest.main(verbosity=2)
