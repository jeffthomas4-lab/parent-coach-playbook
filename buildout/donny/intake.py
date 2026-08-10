#!/usr/bin/env python3
"""
intake.py - the directory-batch lane. Snapshot -> rows -> canonical matches.

What this replaces: results.jsonl as a permanent done-ledger. A JSONL line said
"this org was attempted, never look at it again", which made a refresh
impossible when an official directory changed. Here, completion is a property
of a dated snapshot (content_sha256 + per-row disposition), not a property of an
organization. The same source can be pulled again next season; a changed
snapshot creates a new batch and reports additions, changes, and removals
without deleting a single canonical organization.

WHAT "COMPLETE" MEANS. A batch is complete when every row in one dated snapshot
has exactly one recorded disposition. It does NOT mean every organization has
complete contact information. Those are two different measures and conflating
them is how a pipeline reports success while shipping nothing usable. Row
completeness is tracked separately as C0-C5.

AUTHORITY BOUNDARY. activity-radar.organizations is the canonical organization
registry and nothing here is a second one. directory_rows are acquisition
evidence. A canonical organization id is never changed because a directory
renamed a club; the old name becomes an alias instead.
"""

from __future__ import annotations

import dataclasses
import datetime
import hashlib
import json
import re
import unicodedata
import uuid

# ---------------------------------------------------------------------------
# Normalization
# ---------------------------------------------------------------------------

_WS = re.compile(r"\s+")
_PUNCT = re.compile(r"[^\w\s&]")

# Legal-form and filler tokens that carry no identity. Dropped only for the
# ALIAS comparison key, never from the stored name.
_NOISE_TOKENS = frozenset({
    "inc", "incorporated", "llc", "ltd", "corp", "corporation", "co",
    "the", "a", "an", "of", "and",
    "nonprofit", "non", "profit", "organization", "org",
    "association", "assn", "club", "cl",
})

_SPORT_SYNONYMS = {
    "vb": "volleyball", "vbc": "volleyball", "jvc": "volleyball",
    "vball": "volleyball", "volley": "volleyball",
    "bball": "basketball", "hoops": "basketball",
    "fc": "soccer", "sc": "soccer", "futbol": "soccer",
    "ll": "baseball", "lax": "lacrosse",
}


def norm_text(s: str | None) -> str:
    """Casefold, strip accents, collapse whitespace. Used for exact comparison."""
    if not s:
        return ""
    s = unicodedata.normalize("NFKD", str(s))
    s = "".join(c for c in s if not unicodedata.combining(c))
    return _WS.sub(" ", s.strip().lower())


def name_key(s: str | None) -> str:
    """Exact-match key: normalized, punctuation stripped."""
    return _WS.sub(" ", _PUNCT.sub(" ", norm_text(s))).strip()


def alias_key(s: str | None) -> str:
    """Loose key for alias corroboration: noise tokens dropped, sports expanded.

    This key is NEVER sufficient on its own. Rule 5 requires it to agree with
    address, domain, affiliation, or sport before a match is allowed.
    """
    toks = []
    for t in name_key(s).split():
        t = _SPORT_SYNONYMS.get(t, t)
        if t not in _NOISE_TOKENS:
            toks.append(t)
    return " ".join(toks)


_TRACKING_PREFIXES = ("www.", "m.", "web.")


def norm_domain(url: str | None) -> str:
    """Registrable-ish domain from a URL or bare host. Empty when unusable."""
    if not url:
        return ""
    u = str(url).strip().lower()
    if "//" not in u:
        u = "http://" + u
    try:
        import urllib.parse
        host = urllib.parse.urlparse(u).netloc
    except ValueError:
        return ""
    host = host.split("@")[-1].split(":")[0]
    for p in _TRACKING_PREFIXES:
        if host.startswith(p):
            host = host[len(p):]
    return host.strip(".")


# Platforms that host many unrelated organizations. A shared host is NOT
# evidence of identity, so domain matching must ignore these entirely --
# otherwise every SportsEngine club merges into one organization.
SHARED_PLATFORM_DOMAINS = frozenset({
    "sportsengine.com", "sportngin.com", "leagueapps.com", "teamsnap.com",
    "teamsnapsites.com", "crossbar.org", "playmetrics.com", "gotsport.com",
    "gotsoccer.com", "demosphere.com", "bluesombrero.com", "leaguelineup.com",
    "jerseywatch.com", "activekids.com", "active.com", "stacksports.com",
    "sitesbyteamsnap.com", "wixsite.com", "weebly.com", "squarespace.com",
    "wordpress.com", "godaddysites.com", "facebook.com", "instagram.com",
    "volleyballlife.com", "finalforms.com",
})


def is_shared_platform(domain: str) -> bool:
    d = norm_domain(domain)
    return any(d == p or d.endswith("." + p) for p in SHARED_PLATFORM_DOMAINS)


_DIGITS = re.compile(r"\D+")


def norm_phone(p: str | None) -> str:
    d = _DIGITS.sub("", p or "")
    if len(d) == 11 and d.startswith("1"):
        d = d[1:]
    return d if len(d) == 10 else ""


_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[a-z]{2,}$", re.IGNORECASE)


def norm_email(e: str | None) -> str:
    v = (e or "").strip().lower()
    return v if _EMAIL_RE.match(v) else ""


def norm_ein(e: str | None) -> str:
    d = _DIGITS.sub("", e or "")
    return d if len(d) == 9 else ""


# ---------------------------------------------------------------------------
# Youth-data screen
# ---------------------------------------------------------------------------
#
# Runs BEFORE a row is written to directory_rows. A rejected row still gets a
# disposition ('excluded'), so it is counted and reconciled -- it just never
# stores the offending values.

_MINOR_ROLE_TERMS = (
    "athlete", "player", "camper", "student", "participant", "roster",
    "team member", "child", "kid", "youth member", "parent", "guardian",
    "mother", "father", "mom", "dad", "emergency contact",
)
_PROTECTED_FIELD_TERMS = (
    "date of birth", "dob", "birthdate", "birth date", "grad year",
    "graduation year", "jersey", "uniform number", "medical", "allergy",
    "allergies", "medication", "diagnosis", "insurance", "physician",
    "emergency", "guardian", "ssn", "social security",
)
_GRADE_RE = re.compile(r"\b(?:grade|gr)\s*\d{1,2}\b|\bclass of\s*(?:19|20)\d{2}\b", re.IGNORECASE)
_DOB_RE = re.compile(r"\b(?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b")

# Adult organizational roles we WILL capture.
ADULT_ROLE_TERMS = (
    "club director", "director", "president", "vice president", "registrar",
    "administrator", "admin", "commissioner", "secretary", "treasurer",
    "office", "manager", "coordinator", "contact", "chair", "chairperson",
    "executive", "owner", "founder", "athletic director",
)

ROLE_CANON = [
    ("registrar", ("registrar",)),
    ("director", ("club director", "director", "athletic director", "executive")),
    ("owner", ("owner", "founder", "president", "chair", "chairperson")),
    ("admin", ("administrator", "admin", "secretary", "commissioner",
               "coordinator", "manager", "office", "contact")),
    ("billing", ("treasurer", "billing")),
]


def canon_role(raw: str | None) -> str:
    r = norm_text(raw)
    if not r:
        return "unknown"
    for canon, terms in ROLE_CANON:
        if any(t in r for t in terms):
            return canon
    return "unknown"


@dataclasses.dataclass
class ScreenResult:
    ok: bool
    reason: str = ""
    hits: tuple = ()


def screen_row(row: dict) -> ScreenResult:
    """Reject anything roster-like or minor-linked before it is stored.

    Deliberately conservative. A false reject costs one organization. A false
    accept puts a child's data in a marketing database.
    """
    hits = []
    blob = " ".join(
        str(row.get(k) or "")
        for k in ("source_name", "source_contact_name", "source_contact_role",
                  "source_affiliation", "source_sport", "_raw")
    )
    low = norm_text(blob)

    role = norm_text(row.get("source_contact_role"))
    for term in _MINOR_ROLE_TERMS:
        if term in role:
            hits.append("minor-linked role term: %s" % term)

    for term in _PROTECTED_FIELD_TERMS:
        if term in low:
            hits.append("protected field term: %s" % term)

    if _GRADE_RE.search(blob):
        hits.append("grade/class-year token present")
    if _DOB_RE.search(blob):
        hits.append("date-of-birth-shaped value present")

    # Any key outside the allowed set that carries a value is a schema leak.
    allowed = {
        "source_external_id", "source_row_number", "source_name", "source_city",
        "source_state", "source_sport", "source_affiliation", "source_website_url",
        "source_contact_name", "source_contact_role", "source_contact_email",
        "source_contact_phone", "source_url", "_raw",
    }
    for k, v in row.items():
        if k not in allowed and v not in (None, "", [], {}):
            hits.append("unexpected field carrying data: %s" % k)

    if hits:
        return ScreenResult(False, "; ".join(sorted(set(hits))), tuple(sorted(set(hits))))
    return ScreenResult(True)


# ---------------------------------------------------------------------------
# Canonical matching
# ---------------------------------------------------------------------------
#
# Deterministic evidence, in strict order. Anything fuzzy or conflicting is
# HELD, never auto-merged.

MATCH_RULES = (
    ("source_membership", 100.0),
    ("external_id", 99.0),
    ("ein", 98.0),
    ("domain_geo", 95.0),
    ("name_city_state", 90.0),
    ("alias_corroborated", 80.0),
)

# Below this, a match is never applied automatically.
AUTO_APPLY_MIN_CONFIDENCE = 90.0


@dataclasses.dataclass
class CanonicalOrg:
    """The subset of activity-radar.organizations matching needs."""
    id: str
    name: str
    city: str | None = None
    state: str | None = None
    website_url: str | None = None
    ein: str | None = None
    aliases: str | None = None
    categories: str | None = None
    is_claimed: int = 0
    deleted_at: str | None = None

    @property
    def alias_list(self) -> list[str]:
        raw = self.aliases
        if not raw:
            return []
        try:
            v = json.loads(raw)
            return [str(x) for x in v] if isinstance(v, list) else [str(v)]
        except (ValueError, TypeError):
            return [s for s in re.split(r"[;|]", str(raw)) if s.strip()]


@dataclasses.dataclass
class MatchResult:
    organization_id: str | None
    method: str
    confidence: float
    reason: str
    conflicts: tuple = ()

    @property
    def auto_appliable(self) -> bool:
        return (
            self.organization_id is not None
            and self.method not in ("fuzzy_held", "none")
            and self.confidence >= AUTO_APPLY_MIN_CONFIDENCE
        )


class CanonicalIndex:
    """In-memory index over the candidate slice of activity-radar.organizations.

    Built once per batch from a scoped query (the batch's state/sport), not the
    whole 198k-row table.
    """

    def __init__(self, orgs):
        self.by_id: dict[str, CanonicalOrg] = {}
        self._by_external: dict[str, list[str]] = {}
        self._by_ein: dict[str, list[str]] = {}
        self._by_domain: dict[str, list[str]] = {}
        self._by_ncs: dict[tuple, list[str]] = {}
        self._by_alias: dict[str, list[str]] = {}
        for o in orgs:
            org = o if isinstance(o, CanonicalOrg) else CanonicalOrg(
                **{k: dict(o).get(k) for k in CanonicalOrg.__dataclass_fields__ if k in dict(o)}
            )
            if org.deleted_at:
                continue
            self.by_id[org.id] = org
            if org.ein and norm_ein(org.ein):
                self._by_ein.setdefault(norm_ein(org.ein), []).append(org.id)
            d = norm_domain(org.website_url)
            if d and not is_shared_platform(d):
                self._by_domain.setdefault(d, []).append(org.id)
            k = (name_key(org.name), norm_text(org.city), norm_text(org.state))
            if k[0]:
                self._by_ncs.setdefault(k, []).append(org.id)
            for nm in [org.name] + org.alias_list:
                ak = alias_key(nm)
                if ak:
                    self._by_alias.setdefault(ak, []).append(org.id)

    # -- individual rules ---------------------------------------------------

    def _one(self, ids, method, conf, reason):
        ids = sorted(set(ids or []))
        if not ids:
            return None
        if len(ids) > 1:
            return MatchResult(None, "fuzzy_held", 0.0,
                               "%s matched %d organizations, ambiguous" % (method, len(ids)),
                               tuple(ids))
        return MatchResult(ids[0], method, conf, reason)

    def match(self, row: dict, membership: dict | None = None) -> MatchResult:
        """Apply the rules in order. First deterministic hit wins."""
        membership = membership or {}

        # 1. Existing source membership: we have seen this exact source row
        #    before and already resolved it.
        ext = (row.get("source_external_id") or "").strip()
        if ext and ext in membership:
            oid = membership[ext]
            if oid in self.by_id:
                return MatchResult(oid, "source_membership", 100.0,
                                   "prior batch of this source resolved external id %s" % ext)

        # 2. Exact official external id published by the source.
        if ext:
            r = self._one(self._by_external.get(ext), "external_id", 99.0,
                          "exact source external id %s" % ext)
            if r:
                return r

        # 3. Exact EIN.
        ein = norm_ein(row.get("source_ein"))
        if ein:
            r = self._one(self._by_ein.get(ein), "ein", 98.0, "exact EIN %s" % ein)
            if r:
                return r

        # 4. Exact normalized official domain + compatible geography.
        dom = norm_domain(row.get("source_website_url"))
        if dom and not is_shared_platform(dom):
            ids = self._by_domain.get(dom, [])
            compatible = [i for i in ids if self._geo_compatible(self.by_id[i], row)]
            if ids and not compatible:
                return MatchResult(None, "fuzzy_held", 0.0,
                                   "domain %s matched but geography conflicts" % dom, tuple(ids))
            r = self._one(compatible, "domain_geo", 95.0,
                          "exact domain %s with compatible geography" % dom)
            if r:
                return r

        # 5. Exact normalized name + city + state.
        k = (name_key(row.get("source_name")), norm_text(row.get("source_city")),
             norm_text(row.get("source_state")))
        if k[0] and k[2]:
            r = self._one(self._by_ncs.get(k), "name_city_state", 90.0,
                          "exact name + city + state")
            if r:
                return r

        # 6. Alias + corroboration. Requires a SECOND independent signal.
        ak = alias_key(row.get("source_name"))
        if ak:
            ids = self._by_alias.get(ak, [])
            corroborated = []
            for i in ids:
                org = self.by_id[i]
                sigs = self._corroborating_signals(org, row)
                if sigs:
                    corroborated.append((i, sigs))
            if len(corroborated) == 1:
                i, sigs = corroborated[0]
                return MatchResult(i, "alias_corroborated", 80.0,
                                   "alias match corroborated by %s" % ", ".join(sigs))
            if len(corroborated) > 1:
                return MatchResult(None, "fuzzy_held", 0.0,
                                   "alias matched %d organizations" % len(corroborated),
                                   tuple(i for i, _ in corroborated))
            if ids:
                # Name-shaped similarity with nothing backing it. This is exactly
                # the case the brief says must never auto-merge.
                return MatchResult(None, "fuzzy_held", 0.0,
                                   "name-only similarity with no corroborating signal",
                                   tuple(sorted(ids)))

        return MatchResult(None, "none", 0.0, "no deterministic match")

    # -- helpers ------------------------------------------------------------

    @staticmethod
    def _geo_compatible(org: CanonicalOrg, row: dict) -> bool:
        rs, os_ = norm_text(row.get("source_state")), norm_text(org.state)
        if rs and os_ and rs != os_:
            return False
        rc, oc = norm_text(row.get("source_city")), norm_text(org.city)
        if rc and oc and rc != oc:
            # Different city inside the same state is common for a club that
            # moved or lists a mailing address. Not disqualifying on its own.
            return True
        return True

    @staticmethod
    def _corroborating_signals(org: CanonicalOrg, row: dict) -> list[str]:
        sigs = []
        d1, d2 = norm_domain(org.website_url), norm_domain(row.get("source_website_url"))
        if d1 and d1 == d2 and not is_shared_platform(d1):
            sigs.append("domain")
        if norm_text(org.city) and norm_text(org.city) == norm_text(row.get("source_city")):
            sigs.append("city")
        if norm_text(org.state) and norm_text(org.state) == norm_text(row.get("source_state")):
            sigs.append("state")
        sport = norm_text(row.get("source_sport"))
        if sport and sport in norm_text(org.categories or ""):
            sigs.append("sport")
        aff = norm_text(row.get("source_affiliation"))
        if aff and aff in norm_text(org.categories or ""):
            sigs.append("affiliation")
        # State alone is too weak. Require geography plus something else, or a
        # domain match, which stands on its own.
        if "domain" in sigs:
            return sigs
        if "city" in sigs and ("state" in sigs or "sport" in sigs or "affiliation" in sigs):
            return sigs
        return []


# ---------------------------------------------------------------------------
# Completeness tiers
# ---------------------------------------------------------------------------

def completeness_tier(row: dict, org: CanonicalOrg | None, contact_validated: bool = False,
                      suppression_checked: bool = False, campaign_eligible: bool = False) -> str:
    """C0-C5 for one resolved row. Reported alongside, never instead of,
    batch disposition counts."""
    has_geo = bool(norm_text(row.get("source_city")) or norm_text(row.get("source_state")))
    has_ctx = has_geo or bool(row.get("source_sport")) or bool(row.get("source_affiliation"))
    site = norm_domain(row.get("source_website_url")) or norm_domain(org.website_url if org else None)
    has_contact = bool(norm_email(row.get("source_contact_email")) or norm_phone(row.get("source_contact_phone")))

    if campaign_eligible:
        return "C5"
    if has_contact and contact_validated and suppression_checked:
        return "C4"
    if has_contact:
        return "C3"
    if site:
        return "C2"
    if has_ctx:
        return "C1"
    return "C0"


TIERS = ("C0", "C1", "C2", "C3", "C4", "C5")


def tier_counts(tiers) -> dict:
    out = {t: 0 for t in TIERS}
    for t in tiers:
        if t in out:
            out[t] += 1
    return out


# ---------------------------------------------------------------------------
# Snapshot identity
# ---------------------------------------------------------------------------

def content_sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def batch_id_for(source_id: str, sha: str) -> str:
    """Deterministic batch id. Re-staging identical bytes produces the same id,
    which the unique index then rejects -- replay is a no-op by construction."""
    return "dbatch-%s" % uuid.uuid5(uuid.NAMESPACE_URL, "%s|%s" % (source_id, sha))


def row_id_for(batch_id: str, row_number: int) -> str:
    return "drow-%s" % uuid.uuid5(uuid.NAMESPACE_URL, "%s|%d" % (batch_id, row_number))


def dedupe_id_for(batch_id: str, row_id: str | None, action: str, target: str) -> str:
    return "ddl-%s" % uuid.uuid5(uuid.NAMESPACE_URL,
                                 "%s|%s|%s|%s" % (batch_id, row_id or "-", action, target))


def utcnow() -> str:
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


# ---------------------------------------------------------------------------
# Disposition
# ---------------------------------------------------------------------------

DISPOSITIONS = ("matched", "candidate", "inserted", "excluded", "needs_review")


def decide_disposition(screen: ScreenResult, match: MatchResult, allow_insert: bool) -> tuple[str, str]:
    """Exactly one disposition per extracted row. Never None on a live row."""
    if not screen.ok:
        return "excluded", screen.reason
    if match.method == "fuzzy_held":
        return "needs_review", match.reason
    if match.organization_id:
        if match.auto_appliable:
            return "matched", match.reason
        return "needs_review", "match below auto-apply threshold (%.0f < %.0f): %s" % (
            match.confidence, AUTO_APPLY_MIN_CONFIDENCE, match.reason)
    return ("candidate" if allow_insert else "needs_review"), (
        "no canonical match; staged as new-organization candidate"
        if allow_insert else "no canonical match and inserts are not enabled for this source")


# ---------------------------------------------------------------------------
# Field-update planning (never clobber a human)
# ---------------------------------------------------------------------------

# Fields a directory may fill when they are EMPTY. Never overwritten.
FILLABLE_ORG_FIELDS = ("website_url", "email", "phone")


def plan_field_updates(org: CanonicalOrg, row: dict) -> list[dict]:
    """Fill-blank-only updates, each with a before value so it can be reversed.

    Three hard rules, all tested:
      - a claimed organization is never written to at all;
      - a non-empty field is never overwritten;
      - a canonical id is never changed because a directory renamed a club.
    """
    if org.is_claimed:
        return []
    plans = []
    site = (row.get("source_website_url") or "").strip()
    if site and not (org.website_url or "").strip() and not is_shared_platform(site):
        plans.append({"field": "website_url", "before": org.website_url, "after": site})
    return plans


def plan_alias_add(org: CanonicalOrg, row: dict) -> dict | None:
    """A rename in the source becomes an alias on the existing organization.
    The canonical id does not move."""
    src_name = (row.get("source_name") or "").strip()
    if not src_name:
        return None
    if name_key(src_name) == name_key(org.name):
        return None
    existing = {name_key(a) for a in org.alias_list}
    if name_key(src_name) in existing:
        return None
    after = sorted(set(org.alias_list) | {src_name})
    return {"field": "aliases", "before": org.aliases, "after": json.dumps(after)}


# ---------------------------------------------------------------------------
# Contact staging (public adult role contacts only)
# ---------------------------------------------------------------------------

def plan_contact_upsert(org_id: str, row: dict, source_name: str,
                        org: "CanonicalOrg | None" = None) -> dict | None:
    """Build an idempotent org_contacts upsert for a published adult role contact.

    Idempotency key is (organization_id, normalized email) when an email exists,
    otherwise (organization_id, normalized phone, role). Re-running the same
    snapshot must not create a second row.

    is_public reflects PUBLICATION EVIDENCE. It is not consent to market.
    do_not_contact is never set to 0 here and never cleared; suppression is
    owned elsewhere and checked again at campaign-eligibility time.
    """
    # A claimed organization is managed by its owner. A directory-sourced
    # contact must not be pushed underneath them; it goes to review instead.
    if org is not None and org.is_claimed:
        return None

    email = norm_email(row.get("source_contact_email"))
    phone = norm_phone(row.get("source_contact_phone"))
    if not email and not phone:
        return None

    role = canon_role(row.get("source_contact_role"))
    name = (row.get("source_contact_name") or "").strip() or None

    # A shared mailbox is preferred over a person's address for org-level
    # completeness. Detect it and mark it, keeping the named contact only when
    # it is separately published.
    local = email.split("@")[0] if email else ""
    shared = local in {
        "info", "office", "admin", "contact", "registration", "register",
        "hello", "support", "director", "board", "volleyball", "club",
    }

    key = ("email", email) if email else ("phone", "%s|%s" % (phone, role))
    return {
        "id": "octc-%s" % uuid.uuid5(uuid.NAMESPACE_URL, "%s|%s|%s" % (org_id, key[0], key[1])),
        "organization_id": org_id,
        "full_name": None if shared else name,
        "role": role,
        "email": email or None,
        "phone": phone or None,
        "is_public": 1,
        "is_shared_mailbox": 1 if shared else 0,
        "source": "import",
        "source_url": row.get("source_url"),
        "source_name": source_name,
        "confidence": "high" if (email and role != "unknown") else "medium",
        "verification_method": "website",
        "verified_at": utcnow(),
        "verified_by": "donny/directory-batch",
        "idempotency_key": "%s|%s|%s" % (org_id, key[0], key[1]),
    }


def contact_upsert_sql(plan: dict) -> tuple[str, list]:
    """UPDATE-then-INSERT pair that never weakens suppression.

    The UPDATE deliberately omits do_not_contact, do_not_contact_at, and
    do_not_contact_reason. Those columns are not in the write set, so no code
    path here can clear them.
    """
    sql = (
        "INSERT INTO org_contacts "
        "(id, organization_id, full_name, role, email, phone, is_public, source, "
        " source_url, confidence, verification_method, verified_at, verified_by, "
        " created_at, updated_at) "
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) "
        # The conflict target must repeat the predicate of the partial unique
        # index in 0028 (idx_org_contacts_org_email is scoped to live rows with
        # an email). Without the WHERE clause SQLite raises "ON CONFLICT clause
        # does not match any PRIMARY KEY or UNIQUE constraint" at runtime.
        "ON CONFLICT(organization_id, email) WHERE email IS NOT NULL AND deleted_at IS NULL "
        "DO UPDATE SET "
        "  full_name = COALESCE(org_contacts.full_name, excluded.full_name), "
        "  role = CASE WHEN org_contacts.role = 'unknown' THEN excluded.role ELSE org_contacts.role END, "
        "  phone = COALESCE(org_contacts.phone, excluded.phone), "
        "  source_url = COALESCE(org_contacts.source_url, excluded.source_url), "
        "  verified_at = excluded.verified_at, "
        "  verified_by = excluded.verified_by, "
        "  updated_at = excluded.updated_at "
        "WHERE org_contacts.deleted_at IS NULL"
    )
    now = utcnow()
    params = [
        plan["id"], plan["organization_id"], plan["full_name"], plan["role"],
        plan["email"], plan["phone"], plan["is_public"], plan["source"],
        plan["source_url"], plan["confidence"], plan["verification_method"],
        plan["verified_at"], plan["verified_by"], now, now,
    ]
    return sql, params


# ---------------------------------------------------------------------------
# Completion gate + reconciliation
# ---------------------------------------------------------------------------

@dataclasses.dataclass
class Reconciliation:
    ok: bool
    failures: list
    counts: dict

    def as_dict(self) -> dict:
        return {"ok": self.ok, "failures": list(self.failures), "counts": dict(self.counts)}


def reconcile_batch(batch: dict, rows: list, dedupe_entries: list) -> Reconciliation:
    """A batch is complete only when every one of these holds."""
    failures = []
    extracted = len(rows)

    if not batch.get("content_sha256"):
        failures.append("snapshot hash is not stored")

    expected = batch.get("expected_row_count")
    if expected is not None and int(expected) != extracted:
        failures.append("expected_row_count %s != extracted %d" % (expected, extracted))

    if int(batch.get("extracted_row_count") or 0) != extracted:
        failures.append("batch.extracted_row_count %s != rows present %d"
                        % (batch.get("extracted_row_count"), extracted))

    missing = [r for r in rows if not r.get("disposition")]
    if missing:
        failures.append("%d row(s) carry no disposition" % len(missing))
    bad = [r for r in rows if r.get("disposition") and r["disposition"] not in DISPOSITIONS]
    if bad:
        failures.append("%d row(s) carry an unknown disposition" % len(bad))

    nums = [int(r["source_row_number"]) for r in rows if r.get("source_row_number") is not None]
    if len(set(nums)) != len(nums):
        failures.append("duplicate source_row_number values present")
    if nums and sorted(nums) != list(range(1, extracted + 1)):
        failures.append("source_row_number sequence has gaps; a row disappeared silently")

    # Every automatic write must be attributable to a batch and a row.
    auto = [d for d in dedupe_entries if d.get("review_status") == "auto_applied"]
    orphan = [d for d in auto if not d.get("directory_row_id")]
    if orphan:
        failures.append("%d auto-applied dedupe entries have no directory_row_id" % len(orphan))

    applied_rows = {r["id"] for r in rows if r.get("disposition") in ("matched", "inserted")}
    logged = {d.get("directory_row_id") for d in dedupe_entries}
    unlogged = applied_rows - logged
    if unlogged:
        failures.append("%d applied row(s) have no dedupe_log entry" % len(unlogged))

    counts = {d: 0 for d in DISPOSITIONS}
    for r in rows:
        if r.get("disposition") in counts:
            counts[r["disposition"]] += 1
    if sum(counts.values()) != extracted:
        failures.append("disposition counts do not sum to extracted rows")

    counts["extracted"] = extracted
    counts["dedupe_entries"] = len(dedupe_entries)
    return Reconciliation(not failures, failures, counts)


# ---------------------------------------------------------------------------
# Rollback
# ---------------------------------------------------------------------------

def build_rollback_plan(dedupe_entries: list) -> list:
    """Reverse a batch newest-first, restoring before_json field by field.

    Inserted candidate organizations are soft-deleted, never hard-deleted, so a
    downstream sync sees a tombstone. Contact rows are soft-deleted for the same
    reason. Nothing in this plan clears a do_not_contact flag.
    """
    plan = []
    for d in sorted(dedupe_entries, key=lambda x: x.get("created_at") or "", reverse=True):
        if d.get("review_status") not in ("auto_applied", "approved"):
            continue
        action, target = d.get("action"), d.get("target_table")
        before = json.loads(d["before_json"]) if d.get("before_json") else None

        if action in ("field_update", "alias_add") and target == "organizations":
            if not before:
                continue
            cols = [c for c in before if c != "id"]
            plan.append({
                "sql": "UPDATE organizations SET %s, updated_at = ? WHERE id = ?"
                       % ", ".join("%s = ?" % c for c in cols),
                "params": [before[c] for c in cols] + [utcnow(), d["canonical_organization_id"]],
                "reverses": d["id"],
            })
        elif action == "insert_candidate" and target == "organizations":
            plan.append({
                "sql": "UPDATE organizations SET deleted_at = ?, updated_at = ? "
                       "WHERE id = ? AND deleted_at IS NULL",
                "params": [utcnow(), utcnow(), d["canonical_organization_id"]],
                "reverses": d["id"],
            })
        elif action == "contact_upsert" and target == "org_contacts":
            if before:
                cols = [c for c in before if c != "id"]
                plan.append({
                    "sql": "UPDATE org_contacts SET %s, updated_at = ? WHERE id = ?"
                           % ", ".join("%s = ?" % c for c in cols),
                    "params": [before[c] for c in cols] + [utcnow(), d["target_id"]],
                    "reverses": d["id"],
                })
            else:
                plan.append({
                    "sql": "UPDATE org_contacts SET deleted_at = ?, updated_at = ? "
                           "WHERE id = ? AND deleted_at IS NULL",
                    "params": [utcnow(), utcnow(), d["target_id"]],
                    "reverses": d["id"],
                })
    return plan


# ---------------------------------------------------------------------------
# Snapshot diffing (refresh, not re-do)
# ---------------------------------------------------------------------------

def diff_snapshots(previous_rows: list, current_rows: list) -> dict:
    """Compare two batches of the same source. Removals are RECORDED, never
    turned into a canonical delete."""
    def key(r):
        return (r.get("source_external_id") or "").strip() or name_key(r.get("source_name"))

    prev = {key(r): r for r in previous_rows if key(r)}
    cur = {key(r): r for r in current_rows if key(r)}

    added = sorted(set(cur) - set(prev))
    removed = sorted(set(prev) - set(cur))
    changed = []
    watched = ("source_name", "source_city", "source_state", "source_website_url",
               "source_contact_email", "source_contact_phone", "source_contact_role")
    for k in sorted(set(prev) & set(cur)):
        deltas = {f: (prev[k].get(f), cur[k].get(f)) for f in watched
                  if norm_text(prev[k].get(f)) != norm_text(cur[k].get(f))}
        if deltas:
            changed.append({"key": k, "deltas": deltas})
    return {"added": added, "removed": removed, "changed": changed,
            "added_count": len(added), "removed_count": len(removed),
            "changed_count": len(changed)}


# ---------------------------------------------------------------------------
# Masking (reports never carry real contact values)
# ---------------------------------------------------------------------------

def mask_email(e: str | None) -> str:
    v = norm_email(e)
    if not v:
        return ""
    local, _, dom = v.partition("@")
    keep = local[0] if local else "*"
    parts = dom.split(".")
    return "%s%s@%s.%s" % (keep, "*" * max(len(local) - 1, 3), "*" * max(len(parts[0]), 3), parts[-1])


def mask_phone(p: str | None) -> str:
    d = norm_phone(p)
    return "(%s) ***-**%s" % (d[:3], d[-2:]) if d else ""


def mask_name(n: str | None) -> str:
    n = (n or "").strip()
    if not n:
        return ""
    return " ".join((w[0] + "." if w else "") for w in n.split())


def mask_row(row: dict) -> dict:
    out = dict(row)
    out["source_contact_email"] = mask_email(row.get("source_contact_email"))
    out["source_contact_phone"] = mask_phone(row.get("source_contact_phone"))
    out["source_contact_name"] = mask_name(row.get("source_contact_name"))
    out.pop("_raw", None)
    return out
