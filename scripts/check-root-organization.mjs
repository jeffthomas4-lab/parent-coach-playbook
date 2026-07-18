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

export function validateDirectoryRegistry(registry, trackedFiles) {
  const errors = [];
  const entries = Object.entries(registry).flatMap(([category, directories]) =>
    directories.map((directory) => ({ category, directory })),
  );
  const counts = new Map();
  for (const { directory } of entries) counts.set(directory, (counts.get(directory) ?? 0) + 1);
  for (const [directory, count] of counts) {
    if (count !== 1) errors.push(`${directory} appears ${count} times in the directory registry.`);
    if (!directory || directory.includes("/") || directory.includes("\\")) errors.push(`Invalid top-level directory entry: ${directory}`);
  }
  const actual = [...new Set(trackedFiles.filter((file) => file.includes("/")).map((file) => file.split("/")[0]))].sort();
  for (const directory of actual) {
    if (!counts.has(directory)) errors.push(`Unclassified tracked top-level directory: ${directory}`);
  }
  for (const directory of counts.keys()) {
    if (!actual.includes(directory)) errors.push(`Directory registry entry has no tracked files: ${directory}`);
  }
  return {
    errors,
    directoryCount: actual.length,
    categoryCounts: Object.fromEntries(Object.entries(registry).map(([category, directories]) => [category, directories.length])),
  };
}

async function main() {
  const registry = JSON.parse(await readFile("coordination/root-file-registry.json", "utf8"));
  const directoryRegistry = JSON.parse(await readFile("coordination/top-level-directory-registry.json", "utf8"));
  const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);
  const result = validateRootRegistry(registry, tracked);
  const directoryResult = validateDirectoryRegistry(directoryRegistry, tracked);
  const errors = [...result.errors, ...directoryResult.errors];
  if (errors.length) {
    console.error("Root organization registry failed:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Root organization registry passed: ${result.artifactCount} artifacts classified.`);
  for (const [category, count] of Object.entries(result.categoryCounts)) {
    console.log(`- ${category}: ${count}`);
  }
  console.log(`Top-level directory registry passed: ${directoryResult.directoryCount} tracked directories classified.`);
  for (const [category, count] of Object.entries(directoryResult.categoryCounts)) {
    console.log(`- ${category}: ${count}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
