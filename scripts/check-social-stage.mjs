import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const REQUIRED_UTM = Object.freeze({
  utm_source: "pinterest",
  utm_medium: "social",
});

export function validateSocialStage(markdown) {
  const errors = [];
  const links = [...markdown.matchAll(/^- \*\*Link:\*\*\s+(https?:\/\/\S+)\s*$/gim)].map(
    (match) => match[1],
  );
  const pinHeadings = [...markdown.matchAll(/^### Pin \d+\s*$/gim)];

  if (!/no account creation/i.test(markdown) || !/no auto-posting/i.test(markdown)) {
    errors.push("The stage must state that account creation and auto-posting are prohibited.");
  }
  if (!/human (?:pastes|gate)/i.test(markdown)) {
    errors.push("The stage must preserve an explicit human publication gate.");
  }
  if (pinHeadings.length === 0) errors.push("No staged pins were found.");
  if (links.length !== pinHeadings.length) {
    errors.push(`Expected one Link per pin; found ${links.length} links for ${pinHeadings.length} pins.`);
  }

  for (const value of links) {
    let url;
    try {
      url = new URL(value);
    } catch {
      errors.push(`Invalid staged URL: ${value}`);
      continue;
    }
    if (url.protocol !== "https:" || url.hostname !== "parentcoachdesk.com") {
      errors.push(`Staged URL must use https://parentcoachdesk.com: ${value}`);
    }
    for (const [key, expected] of Object.entries(REQUIRED_UTM)) {
      if (url.searchParams.get(key) !== expected) {
        errors.push(`Staged URL must set ${key}=${expected}: ${value}`);
      }
    }
    if (!url.searchParams.get("utm_campaign")) {
      errors.push(`Staged URL must include utm_campaign: ${value}`);
    }
  }

  if (/\b(?:access[_-]?token|api[_-]?key|client[_-]?secret)\s*[:=]/i.test(markdown)) {
    errors.push("The social stage must not contain credentials or credential placeholders.");
  }
  if (/^\s*(?:publish|post|schedule)\s*\(/im.test(markdown)) {
    errors.push("The social stage must not contain executable publication calls.");
  }

  return { errors, links: links.length, pins: pinHeadings.length };
}

async function main() {
  const file = process.argv[2] ?? "reports/social/SOCIAL-STAGE-PATTERN.md";
  const result = validateSocialStage(await readFile(file, "utf8"));
  if (result.errors.length) {
    console.error(`Social stage validation failed (${result.errors.length} error(s)):`);
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Social stage validation passed: ${result.pins} pins, ${result.links} governed links.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
