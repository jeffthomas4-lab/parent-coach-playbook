import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const ARTIFACT = /\.(?:md|docx|xlsx|csv|txt)$/i;

export function validateRootRegistry(registry, trackedFiles) {
  const errors = [];
  const entries = Object.entries(registry).flatMap(([category, files]) =>
    files.map((file) => ({ category, file })),
  );
  const counts = new Map();
  for (const { file } of entries) counts.set(file, (counts.get(file) ?? 0) + 1);

  for (const [file, count] of counts) {
    if (count !== 1) errors.push(`${file} appears ${count} times in the registry.`);
  }

  const actual = trackedFiles.filter((file) => !file.includes("/") && ARTIFACT.test(file)).sort();
  const registered = [...counts.keys()].sort();
  for (const file of actual) {
    if (!counts.has(file)) errors.push(`Unclassified tracked root artifact: ${file}`);
  }
  for (const file of registered) {
    if (!actual.includes(file)) errors.push(`Registry entry is missing from the tracked root: ${file}`);
  }

  return {
    errors,
    artifactCount: actual.length,
    categoryCounts: Object.fromEntries(
      Object.entries(registry).map(([category, files]) => [category, files.length]),
    ),
  };
}

async function main() {
  const registry = JSON.parse(await readFile("coordination/root-file-registry.json", "utf8"));
  const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);
  const result = validateRootRegistry(registry, tracked);
  if (result.errors.length) {
    console.error("Root organization registry failed:");
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Root organization registry passed: ${result.artifactCount} artifacts classified.`);
  for (const [category, count] of Object.entries(result.categoryCounts)) {
    console.log(`- ${category}: ${count}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
