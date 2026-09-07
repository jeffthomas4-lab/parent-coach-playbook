#!/usr/bin/env python3
"""
D1 MCP server -- a thin, honest wrapper around Cloudflare D1.

Why this exists: Donny (org-discovery-daily-worklist) and the nightly backup
job have both been blocked, repeatedly, because there was never an actual
registered MCP connector for D1 -- agents were improvising access ad hoc, and
it kept disappearing between sessions (see backups/backup-log.json,
2026-08-01 entry: "the Cloudflare D1 MCP server itself had disconnected").
This gives Donny (and anything else that needs activity-radar or
parent-coach-desk-ops-production) one real, reproducible connector.

Two backends, selected by the D1_BACKEND env var:

  "api" (default, and the one actually tested end-to-end here -- full stdio
  MCP handshake, tool listing, tool call all verified in the sandbox this was
  built in): calls Cloudflare's D1 REST API directly with a scoped API token.
  Needs CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID.

  "wrangler": shells out to `npx wrangler d1 execute --remote --json`, reusing
  whatever wrangler auth session already works on this machine -- the same
  one scripts/backup-activity-radar.ps1 already depends on. No new credential
  to mint. NOT independently tested by the agent that wrote this (wrangler
  does not run in that agent's Linux sandbox -- workerd/Windows binary
  mismatch, see buildout/donny/README.md). Run `--selftest` after setup to
  confirm it actually works on this machine before relying on it.

Design rules this file follows either way:
  - No credential is ever a tool parameter -- env vars only, read once at
    process start, invisible to any agent session driving this over MCP.
  - Database ids/names are hardcoded from wrangler.jsonc /
    wrangler.production.jsonc (not secrets -- same class as a table name).
  - One SQL statement per call, executed exactly as given. No hidden retries
    that could double-apply a write, no silent statement-splitting. Donny's
    own SKILL.md already enforces dry-run-then-apply discipline upstream of
    this; this connector's only job is to faithfully run what it's told and
    report exactly what happened.

Setup: see SETUP.md in this directory.
"""

import json
import os
import subprocess
import sys
from typing import Any, Optional

import httpx
from mcp.server.fastmcp import FastMCP

# --- known databases (ids from wrangler.jsonc / wrangler.production.jsonc) ---
# Not secrets. Safe to hardcode and to read back through d1_list_databases().
DATABASES: dict[str, str] = {
    "activity-radar": "8cc3694a-26f8-4a56-b131-d5d3a68c49ef",
    "parent-coach-desk-ops-production": "b38d5f37-54df-4e0f-9706-023edc12c7fe",
    "forge-command": "747cf988-a557-48bd-9d03-bea09e184f94",
    # staging pair -- useful for testing a statement before it touches prod
    "parent-coach-desk-directory-staging": "6aa26d4d-d545-4eb7-bf50-34d45f2182ad",
    "parent-coach-desk-ops-staging": "7f0da00d-bc98-464f-8702-ce0fb381dd5e",
}

# Which wrangler config file declares each database, for the "wrangler" backend.
# Both live at the repo root next to this file's configured D1_REPO_ROOT.
WRANGLER_CONFIG_FOR_DB: dict[str, str] = {
    "activity-radar": "wrangler.production.jsonc",
    "parent-coach-desk-ops-production": "wrangler.production.jsonc",
    "forge-command": "wrangler.production.jsonc",
    "parent-coach-desk-directory-staging": "wrangler.jsonc",
    "parent-coach-desk-ops-staging": "wrangler.jsonc",
}

CF_API_BASE = "https://api.cloudflare.com/client/v4"
BACKEND = os.environ.get("D1_BACKEND", "api").strip().lower()
REPO_ROOT = os.environ.get(
    "D1_REPO_ROOT",
    r"C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk",
)


def _get_credentials() -> tuple[str, str]:
    token = os.environ.get("CLOUDFLARE_API_TOKEN", "").strip()
    account_id = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "").strip()
    missing = []
    if not token:
        missing.append("CLOUDFLARE_API_TOKEN")
    if not account_id:
        missing.append("CLOUDFLARE_ACCOUNT_ID")
    if missing:
        raise RuntimeError(
            "Missing required environment variable(s): "
            + ", ".join(missing)
            + ". Set these in the MCP server's own env block (see SETUP.md). "
            "This process will not accept credentials as a tool argument."
        )
    return token, account_id


mcp = FastMCP(
    name="d1",
    instructions=(
        "Query or write to the parent-coach-desk Cloudflare D1 databases. "
        "Call d1_list_databases() first if unsure of the exact database name. "
        "Call d1_query() with ONE SQL statement per call -- do not pass "
        "multiple ;-separated statements in a single call."
    ),
)


@mcp.tool()
def d1_list_databases() -> dict[str, Any]:
    """List the D1 databases this connector knows about, by friendly name."""
    return {"databases": DATABASES}


def _via_api(database: str, sql: str, params: Optional[list[Any]]) -> dict[str, Any]:
    db_id = DATABASES[database]
    try:
        token, account_id = _get_credentials()
    except RuntimeError as e:
        return {"success": False, "errors": [str(e)]}
    url = f"{CF_API_BASE}/accounts/{account_id}/d1/database/{db_id}/query"
    body: dict[str, Any] = {"sql": sql}
    if params:
        body["params"] = params

    try:
        resp = httpx.post(
            url,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            },
            json=body,
            timeout=30.0,
        )
    except httpx.HTTPError as e:
        return {"success": False, "errors": [f"Request to Cloudflare failed: {e}"]}

    try:
        payload = resp.json()
    except Exception:
        return {
            "success": False,
            "errors": [f"Non-JSON response, HTTP {resp.status_code}: {resp.text[:500]}"],
        }

    if resp.status_code != 200 or not payload.get("success", False):
        return {
            "success": False,
            "errors": payload.get("errors") or [f"HTTP {resp.status_code}"],
        }

    # Cloudflare wraps results in a "result" list (one entry per statement;
    # we only ever send one).
    return _normalize_result_list(payload.get("result") or [])


def _via_wrangler(database: str, sql: str, params: Optional[list[Any]]) -> dict[str, Any]:
    if params:
        return {
            "success": False,
            "errors": [
                "The 'wrangler' backend does not support bound params -- "
                "wrangler d1 execute takes a literal --command string. Bake "
                "values directly into `sql` (this matches how Donny's own "
                "import_results.py already generates its .sql files -- "
                "fully-formed statements, no placeholders)."
            ],
        }
    config = WRANGLER_CONFIG_FOR_DB.get(database)
    if not config:
        return {"success": False, "errors": [f"No wrangler config known for '{database}'"]}

    cmd = [
        "npx", "wrangler", "d1", "execute", database,
        "--remote", "--json",
        "--config", config,
        "--command", sql,
    ]
    env = dict(os.environ)
    env["CI"] = "true"  # matches scripts/backup-activity-radar.ps1: no interactive prompt
    try:
        proc = subprocess.run(
            cmd,
            cwd=REPO_ROOT,
            env=env,
            capture_output=True,
            text=True,
            timeout=60,
            shell=(os.name == "nt"),  # npx needs a shell on Windows
        )
    except FileNotFoundError as e:
        return {"success": False, "errors": [f"Could not run wrangler: {e}"]}
    except subprocess.TimeoutExpired:
        return {"success": False, "errors": ["wrangler d1 execute timed out after 60s"]}

    if proc.returncode != 0:
        return {
            "success": False,
            "errors": [f"wrangler exited {proc.returncode}", proc.stderr.strip()[-2000:]],
        }

    try:
        payload = json.loads(proc.stdout)
    except Exception:
        return {
            "success": False,
            "errors": [f"Could not parse wrangler --json output: {proc.stdout[:500]}"],
        }

    # wrangler --json prints a top-level array, one entry per statement.
    result_list = payload if isinstance(payload, list) else [payload]
    return _normalize_result_list(result_list)


def _normalize_result_list(result_list: list[dict[str, Any]]) -> dict[str, Any]:
    if not result_list:
        return {"success": True, "columns": [], "rows": [], "row_count": 0, "meta": {}}
    first = result_list[0]
    if first.get("success") is False:
        return {"success": False, "errors": first.get("errors", ["unknown D1 error"])}
    rows = first.get("results", [])
    columns = list(rows[0].keys()) if rows else []
    return {
        "success": True,
        "columns": columns,
        "rows": rows,
        "row_count": len(rows),
        "meta": first.get("meta", {}),
    }


@mcp.tool()
def d1_query(
    database: str,
    sql: str,
    params: Optional[list[Any]] = None,
) -> dict[str, Any]:
    """
    Execute exactly one SQL statement against a named D1 database and return
    the result. Backend is fixed at process start via the D1_BACKEND env var
    ("api" or "wrangler") -- see this file's module docstring and SETUP.md.

    Use bound parameters (`?` placeholders + `params`) for any value that
    came from search results, user input, or another table -- never
    string-interpolate untrusted values into `sql`. (The "wrangler" backend
    can't bind params; bake values into `sql` there instead.)

    Args:
        database: friendly name from d1_list_databases(), e.g. "activity-radar"
                  or "parent-coach-desk-ops-production".
        sql: exactly one SQL statement. No trailing semicolon-separated
             second statement -- split multi-statement scripts before calling.
        params: optional list of bound parameter values for `?` placeholders
                (ignored / rejected by the "wrangler" backend).

    Returns:
        {"success": true, "columns": [...], "rows": [...], "row_count": N,
         "meta": {...}}
        or
        {"success": false, "errors": [...]}
    """
    if ";" in sql.strip().rstrip(";"):
        return {
            "success": False,
            "errors": [
                "Refusing: this looks like more than one SQL statement. "
                "Call d1_query once per statement (matches the SKILL.md "
                "'statement by statement' apply discipline)."
            ],
        }

    if database not in DATABASES:
        return {
            "success": False,
            "errors": [
                f"Unknown database '{database}'. Known: {sorted(DATABASES)}"
            ],
        }

    if BACKEND == "wrangler":
        return _via_wrangler(database, sql, params)
    elif BACKEND == "api":
        return _via_api(database, sql, params)
    else:
        return {
            "success": False,
            "errors": [f"Unknown D1_BACKEND '{BACKEND}'. Use 'api' or 'wrangler'."],
        }


def _selftest() -> int:
    """Run with `python server.py --selftest` to sanity-check the selected
    backend before wiring this into an MCP client config."""
    print(f"D1_BACKEND={BACKEND}")
    if BACKEND == "api":
        try:
            token, account_id = _get_credentials()
        except RuntimeError as e:
            print(f"FAIL: {e}", file=sys.stderr)
            return 1
        print(f"Account id set ({account_id[:4]}...{account_id[-4:]}). Token present.")
    elif BACKEND == "wrangler":
        print(f"repo root: {REPO_ROOT}")
        if not os.path.isdir(REPO_ROOT):
            print(f"FAIL: repo root does not exist -- set D1_REPO_ROOT", file=sys.stderr)
            return 1
    else:
        print(f"FAIL: unknown D1_BACKEND '{BACKEND}'", file=sys.stderr)
        return 1

    ok = True
    for name in DATABASES:
        result = d1_query(database=name, sql="SELECT 1 AS ok")
        status = "OK" if result.get("success") else f"FAIL: {result.get('errors')}"
        if not result.get("success"):
            ok = False
        print(f"  {name}: {status}")
    return 0 if ok else 1


if __name__ == "__main__":
    if "--selftest" in sys.argv:
        sys.exit(_selftest())
    mcp.run(transport="stdio")
