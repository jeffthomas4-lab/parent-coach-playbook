# D1 MCP server — setup

This is the connector that never existed. Donny and the backup job have both
been improvising D1 access for months (see `backups/backup-log.json`) and it
kept vanishing between sessions because there was nothing real to reconnect
to. This is that real thing: a small stdio MCP server with two interchangeable
backends. Verified end-to-end in the sandbox this was built in: real MCP
handshake, tool listing, tool calls, and every failure path (missing creds,
unknown database, bad backend name, multi-statement SQL) returns a clean
error instead of crashing.

It exposes two tools:
- `d1_list_databases()` — lists the known databases by friendly name.
- `d1_query(database, sql, params)` — runs exactly one SQL statement against
  one of them and returns the rows.

Known databases (ids/names pulled from `wrangler.jsonc` /
`wrangler.production.jsonc`, not secrets):

| friendly name | database |
|---|---|
| `activity-radar` | camp data layer Donny works against |
| `parent-coach-desk-ops-production` | `directory_sources`, `directory_batches`, `directory_rows`, `dedupe_log`, `org_contacts` |
| `forge-command` | Barnabus's portfolio DB |
| `parent-coach-desk-directory-staging` | staging pair, safe to test writes against |
| `parent-coach-desk-ops-staging` | staging pair, safe to test writes against |

---

## Pick a backend: `wrangler` or `api`

Set via the `D1_BACKEND` env var in the server's config (step 2).

**`wrangler` (recommended — try this first)**. Shells out to
`npx wrangler d1 execute --remote --json`, reusing whatever wrangler login
session already works on this machine. `scripts/backup-activity-radar.ps1`
already depends on that exact session working, so if nightly backups have
been running, this should just work with **zero new credentials to mint**.
Caveat: I could not test this path myself — wrangler doesn't run in the
Linux sandbox I built this in (workerd/Windows binary mismatch, same reason
Donny's own SKILL.md forbids calling wrangler from an agent run). Every other
branch of the code (argument validation, error shapes, the multi-statement
guard) is tested; the actual subprocess call to a real wrangler on a real
Windows machine is not. Run `--selftest` (step 3) before trusting it.

**`api`**. Calls Cloudflare's D1 REST API directly with a scoped token. This
is the path I actually exercised over a real MCP stdio connection. Needs a
new API token (below) but has no dependency on wrangler, node, or this
specific machine's login state — portable if this ever needs to run
somewhere else.

If `wrangler` fails `--selftest` for a reason you can't quickly fix, fall
back to `api`.

---

## Backend: `api` — get a Cloudflare API token

Skip this section entirely if you're using `wrangler`.

Cloudflare dashboard → your profile icon (top right) → **My Profile** →
**API Tokens** → **Create Token** → **Custom token** (not a broad template).
Scope it to exactly:
- Permissions: **Account → D1 → Edit**
- Account resources: this account only
- Skip zone resources — not needed for D1

Copy the token once — Cloudflare won't show it again.

**Do not paste this token into a Claude chat, a file in this repo, or
anywhere I (Claude) would read it.** It goes directly into your local MCP
client config in step 2, which only your machine's app process reads.

Also grab your account ID: Cloudflare dashboard → any domain or Workers &
Pages page → right-hand sidebar. Not as sensitive as the token, but no
reason to paste it in chat either.

---

## 1. Install dependencies

Needs Python 3.10+ on the machine that will actually run this (your machine,
not the sandbox this was built in).

```powershell
cd mcp-servers\d1
pip install -r requirements.txt
```

## 2. Register it as an MCP server

Where this config lives is app-specific:

**Claude Desktop app** — edit (or create)
`%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "d1": {
      "command": "python",
      "args": ["C:\\Users\\jeffthomas\\Desktop\\Claude Cowork\\Outputs\\Field and Forge\\parent-coach-desk\\mcp-servers\\d1\\server.py"],
      "env": {
        "D1_BACKEND": "wrangler"
      }
    }
  }
}
```

If you're using the `api` backend instead, add
`"CLOUDFLARE_API_TOKEN": "...", "CLOUDFLARE_ACCOUNT_ID": "..."` to that same
`env` block and drop `D1_BACKEND` (it defaults to `api`).

Restart the app after saving.

**Claude Code** — same `mcpServers` block, in a `.mcp.json` at the repo root
or your user-level config.

**Cowork mode specifically** — I don't have visibility into whether this
session's Cowork surface has a settings screen for adding a custom local
stdio MCP server the way Claude Desktop / Claude Code do, versus only
letting you attach connectors from its built-in registry (I checked: no
Cloudflare/D1 connector exists in that registry today). If Cowork's settings
only offer registry connectors, the practical path is to run Donny from
Claude Code or Claude Desktop instead, where custom server config is
supported today. Check Settings → Connectors / Developer settings for an
"Add custom connector" option before assuming it's not there.

## 3. Verify before wiring it in

```powershell
cd mcp-servers\d1
$env:D1_BACKEND="wrangler"          # or "api", matching step 2
python server.py --selftest
```

Runs `SELECT 1` against every known database and prints OK/FAIL per
database. For `wrangler`, this is the real test of whether the reused login
session actually works from a plain Python subprocess call the way it does
from PowerShell — don't skip it.

## 4. What this deliberately does not do

- No retries on write statements (a retried `INSERT` could double-apply).
- No multi-statement splitting — one `d1_query` call, one SQL statement.
  Donny's own workflow already reads its generated `.sql` files and executes
  them statement-by-statement; this connector just refuses a batch of
  `;`-separated statements in one call so that discipline can't be silently
  bypassed.
- No built-in dry-run / rollback. Donny's SKILL.md already does dry-run
  staging (writing to `directory_batches` / `dedupe_log` before ever calling
  apply) upstream of this connector — this file's only job is to faithfully
  run whatever SQL it's given and report exactly what happened.
- The `wrangler` backend doesn't support bound `?` params (the CLI takes a
  literal `--command` string) — bake values into the SQL text for that
  backend, same as Donny's `import_results.py` already does when it
  generates `.sql` files.
