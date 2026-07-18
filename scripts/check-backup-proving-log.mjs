import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function validateBackupProvingLog(markdown, requiredDays = 3) {
  const errors = [];
  const rows = [...markdown.matchAll(/^\|\s*(\d+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s*\|\s*([\d.]+)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|$/gm)]
    .map((match) => ({ run: Number(match[1]), date: match[2], sizeMb: Number(match[4]), attempts: Number(match[5]), backupsOnDisk: Number(match[6]) }));
  if (rows.length === 0) errors.push('no proving rows found');
  const dates = [...new Set(rows.filter((row) => row.sizeMb > 0 && row.attempts > 0 && row.backupsOnDisk > 0).map((row) => row.date))].sort();
  if (dates.length < requiredDays) errors.push(`requires clean runs on ${requiredDays} separate dates; found ${dates.length}`);
  if (rows.some((row, index) => row.run !== index + 1)) errors.push('run numbers must be contiguous and ordered');
  if (rows.some((row) => !Number.isFinite(row.sizeMb) || row.sizeMb <= 0 || row.attempts < 1 || row.backupsOnDisk < 1)) errors.push('every proving row requires positive size, attempts, and retained backup count');
  return { valid: errors.length === 0, errors, rowCount: rows.length, distinctCleanDates: dates };
}

async function main() {
  const file = process.argv[2] ?? 'scripts/BACKUP-PROVING-LOG.md';
  const result = validateBackupProvingLog(await readFile(file, 'utf8'));
  if (!result.valid) {
    console.error(`Backup proving log failed:\n- ${result.errors.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Backup proving log passed: ${result.rowCount} runs across ${result.distinctCleanDates.length} clean dates (${result.distinctCleanDates.join(', ')}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
