#!/usr/bin/env python3
"""
policy.py - the source gate. Nothing reaches the batch lane without passing here.

Donny may only enumerate a group from a source that has been evaluated and
classified. "Public on the web" is not permission for bulk reuse or outreach,
and this module is where that rule is actually enforced rather than assumed.

Five classifications:

  approved_public_batch     official public directory, supported batch access
                            method, no discovered restriction blocking internal
                            directory use. Eligible for the batch lane.
  approved_manual_snapshot  official public source that may be processed as a
                            bounded, human-reviewed snapshot but NOT repeatedly
                            crawled. Eligible for the batch lane, one snapshot
                            at a time, refresh cadence enforced.
  validation_only           may confirm an individual organization. May NOT
                            enumerate a group.
  permission_required       valuable, but terms or access design require written
                            permission or a licensed feed first.
  blocked                   prohibits the intended use, exposes protected data,
                            requires bypassing a control, or cannot be accessed
                            reliably.

RATE LIMITING IS NOT HUMAN MIMICRY.

The predecessor task instructed the agent to "pace it like a human", pick
randomized 20-180s gaps, and take breaks to "mimic someone stepping away".
That is an evasion technique aimed at bot detection, and it is gone. What
replaces it is a transparent, declared, policy-compliant limiter: a fixed
minimum interval, a concurrency cap of 1, exponential backoff on 429/5xx,
a truthful User-Agent, and hard stop conditions. If a source does not want
automated access, the correct response is to stop, not to look more human.
"""

from __future__ import annotations

import dataclasses
import datetime
import re
import time
import urllib.parse

# ---------------------------------------------------------------------------
# Classifications
# ---------------------------------------------------------------------------

APPROVED_PUBLIC_BATCH = "approved_public_batch"
APPROVED_MANUAL_SNAPSHOT = "approved_manual_snapshot"
VALIDATION_ONLY = "validation_only"
PERMISSION_REQUIRED = "permission_required"
BLOCKED = "blocked"

ALL_CLASSIFICATIONS = (
    APPROVED_PUBLIC_BATCH,
    APPROVED_MANUAL_SNAPSHOT,
    VALIDATION_ONLY,
    PERMISSION_REQUIRED,
    BLOCKED,
)

# Only these two may enumerate a group.
BATCH_ELIGIBLE = frozenset({APPROVED_PUBLIC_BATCH, APPROVED_MANUAL_SNAPSHOT})

# Domains that are permanently off limits regardless of what a registry row
# says. A hard deny list exists so that a bad edit to directory_sources cannot
# quietly re-enable a source that told us in writing to stay away.
#
# aausports.org: the Club Finder carries an explicit click-through covenant --
# "I agree that this club locator tool is not to be used for solicitation of
# any kind" -- with a membership-revocation penalty, plus a site-wide
# ClaudeBot Disallow and two ToU clauses barring harvesting. Four independent
# grounds. Do not fetch, query, enumerate, or revisit.
HARD_DENY_DOMAINS = frozenset({
    "aausports.org",
    "application.aausports.org",
})

# The protected MedConfRadar core data-broker directory is out of scope for
# every Donny path. Named here so a misconfigured source cannot reach it.
HARD_DENY_PATH_SUBSTRINGS = ("medconfradar-core", "data-broker")


class PolicyError(Exception):
    """Raised when an operation is attempted against a source that forbids it."""


# ---------------------------------------------------------------------------
# Transparent rate limiting
# ---------------------------------------------------------------------------

@dataclasses.dataclass(frozen=True)
class RateLimit:
    """Declared, constant-interval politeness. No randomization, no mimicry.

    min_interval_seconds is a floor between requests to the same host. It is a
    published, boring number chosen to stay well under any plausible capacity
    concern, not a number chosen to look organic.
    """

    min_interval_seconds: float = 10.0
    max_requests_per_run: int = 50
    max_concurrency: int = 1
    backoff_base_seconds: float = 30.0
    backoff_max_seconds: float = 900.0
    max_retries: int = 3
    user_agent: str = (
        "ParentCoachDeskDirectoryBot/1.0 "
        "(+https://parentcoachdesk.com/about/crawler; contact: support@parentcoachdesk.com)"
    )

    def backoff_for(self, attempt: int) -> float:
        """Exponential backoff. attempt is 1-based."""
        delay = self.backoff_base_seconds * (2 ** max(0, attempt - 1))
        return min(delay, self.backoff_max_seconds)


DEFAULT_RATE_LIMIT = RateLimit()


class HostThrottle:
    """Enforces min_interval_seconds per host, serially. Concurrency cap is 1
    by construction: this object is not thread-safe and is not meant to be."""

    def __init__(self, limit: RateLimit = DEFAULT_RATE_LIMIT, sleeper=time.sleep, clock=time.monotonic):
        self.limit = limit
        self._last: dict[str, float] = {}
        self._count = 0
        self._sleep = sleeper
        self._clock = clock

    def acquire(self, url: str) -> None:
        if self._count >= self.limit.max_requests_per_run:
            raise PolicyError(
                "run request cap reached (%d); stop condition, not a retry case"
                % self.limit.max_requests_per_run
            )
        host = urllib.parse.urlparse(url).netloc.lower()
        now = self._clock()
        prev = self._last.get(host)
        if prev is not None:
            wait = self.limit.min_interval_seconds - (now - prev)
            if wait > 0:
                self._sleep(wait)
                now = self._clock()
        self._last[host] = now
        self._count += 1

    @property
    def requests_made(self) -> int:
        return self._count


# ---------------------------------------------------------------------------
# robots.txt and Content-Signal
# ---------------------------------------------------------------------------

_CONTENT_SIGNAL_RE = re.compile(r"^\s*Content-Signal\s*:\s*(.+)$", re.IGNORECASE | re.MULTILINE)


def parse_content_signal(robots_text: str) -> dict[str, str]:
    """Parse Cloudflare-style `Content-Signal: search=yes,ai-train=no,use=reference`.

    This is an express reservation of rights. It is honored as a first-class
    gate, not treated as a comment, because a persistent internal directory
    built for later outreach is not a 'reference' use.
    """
    out: dict[str, str] = {}
    for m in _CONTENT_SIGNAL_RE.finditer(robots_text or ""):
        for part in m.group(1).split(","):
            if "=" in part:
                k, v = part.split("=", 1)
                out[k.strip().lower()] = v.strip().lower()
    return out


def robots_disallows_agent(robots_text: str, agent_tokens=("claudebot", "parentcoachdeskdirectorybot")) -> bool:
    """True when robots.txt disallows the whole site for any of our agent
    identities, or for `*`.

    We check ClaudeBot explicitly. If a site names ClaudeBot and disallows it,
    that is a decision about automated AI agents and it applies to us. Renaming
    the User-Agent to slip past it would be a bypass, which is out of bounds.
    """
    if not robots_text:
        return False
    current: list[str] = []
    blocked_groups: set[str] = set()
    for raw in robots_text.splitlines():
        line = raw.split("#", 1)[0].strip()
        if not line:
            current = []
            continue
        if ":" not in line:
            continue
        key, val = (p.strip() for p in line.split(":", 1))
        k = key.lower()
        if k == "user-agent":
            current.append(val.lower())
        elif k == "disallow" and current:
            if val == "/":
                blocked_groups.update(current)
    for tok in list(agent_tokens) + ["*"]:
        if tok.lower() in blocked_groups:
            return True
    return False


# ---------------------------------------------------------------------------
# The gate
# ---------------------------------------------------------------------------

@dataclasses.dataclass
class SourceRecord:
    """The subset of a directory_sources row the gate needs."""

    id: str
    name: str
    canonical_url: str
    access_classification: str
    is_active: int = 0
    refresh_cadence_days: int = 180
    last_policy_checked_at: str | None = None
    last_successful_batch_at: str | None = None
    robots_result: str | None = None
    content_signal_reserved: int = 0
    solicitation_restriction: str | None = None
    approved_method: str | None = None

    @classmethod
    def from_row(cls, row) -> "SourceRecord":
        d = dict(row)
        return cls(**{k: d.get(k) for k in cls.__dataclass_fields__ if k in d})


@dataclasses.dataclass
class GateResult:
    allowed: bool
    reason: str
    classification: str

    def raise_if_denied(self) -> None:
        if not self.allowed:
            raise PolicyError(self.reason)


def _host_of(url: str) -> str:
    return (urllib.parse.urlparse(url).netloc or "").lower().lstrip("www.")


def check_hard_deny(url: str) -> GateResult | None:
    host = (urllib.parse.urlparse(url).netloc or "").lower()
    bare = host[4:] if host.startswith("www.") else host
    for denied in HARD_DENY_DOMAINS:
        if bare == denied or bare.endswith("." + denied):
            return GateResult(False, "hard deny list: %s (see HARD_DENY_DOMAINS)" % denied, BLOCKED)
    low = url.lower()
    for frag in HARD_DENY_PATH_SUBSTRINGS:
        if frag in low:
            return GateResult(False, "hard deny path fragment: %s" % frag, BLOCKED)
    return None


def gate_batch_lane(src: SourceRecord, today: datetime.date | None = None) -> GateResult:
    """May this source be enumerated as a group right now?

    Every failure mode returns a reason string that names the specific rule,
    because the blocked-source report is a deliverable and 'denied' on its own
    is not evidence.
    """
    deny = check_hard_deny(src.canonical_url)
    if deny is not None:
        return deny

    if src.access_classification not in ALL_CLASSIFICATIONS:
        return GateResult(False, "unknown classification %r" % src.access_classification, BLOCKED)

    if src.access_classification == BLOCKED:
        return GateResult(False, "source is classified blocked: %s"
                          % (src.solicitation_restriction or "see evidence_notes"), BLOCKED)

    if src.access_classification == PERMISSION_REQUIRED:
        return GateResult(False, "permission_required: no written permission on file", PERMISSION_REQUIRED)

    if src.access_classification == VALIDATION_ONLY:
        return GateResult(False, "validation_only: may confirm one org, may not enumerate a group",
                          VALIDATION_ONLY)

    if not src.is_active:
        return GateResult(False, "source is not active", src.access_classification)

    if src.robots_result == "disallowed":
        return GateResult(False, "robots.txt disallows our agent for this host", BLOCKED)

    if src.content_signal_reserved:
        return GateResult(
            False,
            "operator reserved AI/derivative use via Content-Signal; directory building "
            "is not a 'reference' use, so this needs written permission",
            PERMISSION_REQUIRED,
        )

    if not src.last_policy_checked_at:
        return GateResult(False, "policy has never been checked for this source", src.access_classification)

    # A stale policy check is a denial, not a warning. Terms change.
    today = today or datetime.date.today()
    try:
        checked = datetime.date.fromisoformat(src.last_policy_checked_at[:10])
    except (TypeError, ValueError):
        return GateResult(False, "unparseable last_policy_checked_at", src.access_classification)
    age = (today - checked).days
    if age > max(src.refresh_cadence_days, 1):
        return GateResult(False, "policy check is %d days stale (cadence %d)"
                          % (age, src.refresh_cadence_days), src.access_classification)

    return GateResult(True, "ok: %s, policy checked %d day(s) ago"
                      % (src.access_classification, age), src.access_classification)


def sources_due_for_refresh(rows, today: datetime.date | None = None):
    """directory_sources rows whose policy check or snapshot is past cadence."""
    today = today or datetime.date.today()
    due = []
    for r in rows:
        src = SourceRecord.from_row(r)
        if src.access_classification == BLOCKED:
            continue
        stamps = [s for s in (src.last_policy_checked_at, src.last_successful_batch_at) if s]
        if not stamps:
            due.append((src, "never checked"))
            continue
        try:
            newest = max(datetime.date.fromisoformat(s[:10]) for s in stamps)
        except ValueError:
            due.append((src, "unparseable timestamp"))
            continue
        age = (today - newest).days
        if age >= src.refresh_cadence_days:
            due.append((src, "%d days since last check (cadence %d)" % (age, src.refresh_cadence_days)))
    return due
