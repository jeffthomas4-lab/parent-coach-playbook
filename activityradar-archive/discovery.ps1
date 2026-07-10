<#
  discovery.ps1 - one command for the daily org-discovery loop.

  Usage (from anywhere; the script finds its own folder):
    .\discovery.ps1 cut     Cut today's worklist and open it. (state by state, WA first)
    .\discovery.ps1 push    Import today's results and push them to the live database.
    .\discovery.ps1 status  Show where the rollout stands without opening anything.

  The searching itself happens in Chrome between `cut` and `push`, per
  buildout/hit-rate-test/DISCOVERY-PROMPT.md. Append one line per org to
  buildout/hit-rate-test/out/results.jsonl as you go.
#>

param([Parameter(Position = 0)][string]$cmd = "help")
$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$hrt  = Join-Path $root "buildout\hit-rate-test"
$out  = Join-Path $hrt  "out"
$bmf  = Join-Path $root "buildout\bmf\*.csv"
$results = Join-Path $out "results.jsonl"

function Cut {
    python "$hrt\daily_discovery.py" "$bmf"
    $wl = Get-ChildItem "$out\worklist-*.csv" -ErrorAction SilentlyContinue |
          Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($wl) {
        Write-Host "`nOpening $($wl.Name) ..."
        Invoke-Item $wl.FullName
    }
}

function Push {
    if (-not (Test-Path $results)) {
        Write-Host "No results yet at out\results.jsonl. Run a search session first (see DISCOVERY-PROMPT.md)."
        return
    }
    python "$hrt\import_results.py" --results "$results"

    $sql = Get-ChildItem "$out\import-*.sql" -ErrorAction SilentlyContinue |
           Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $sql) { Write-Host "No import SQL was produced."; return }

    # An import with zero accepted rows is just the 4-line header. Don't push that.
    $lineCount = (Get-Content $sql.FullName | Measure-Object -Line).Lines
    if ($lineCount -le 4) {
        Write-Host "Nothing to push: $($sql.Name) has no confident sites yet."
        Write-Host "(Check out\review-*.csv for the ones held back.)"
        return
    }

    Write-Host "`nPushing $($sql.Name) to the live database ..."
    npx wrangler d1 execute activity-radar --remote --file="$($sql.FullName)"
    Write-Host "`nDone. The hourly worker will scrape camps from these sites automatically."
}

switch ($cmd.ToLower()) {
    "cut"    { Cut }
    "push"   { Push }
    "status" { python "$hrt\daily_discovery.py" "$bmf" }
    default  {
        Write-Host "Daily discovery loop:"
        Write-Host "  .\discovery.ps1 cut     # morning: cut and open today's worklist"
        Write-Host "  (do the searching in Chrome, append to out\results.jsonl)"
        Write-Host "  .\discovery.ps1 push    # evening: import + push to the database"
        Write-Host "  .\discovery.ps1 status  # see how far the rollout has gotten"
    }
}
