import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const CHANNELS = Object.freeze({
  pinterest: { heading: /^### Pin \d+\s*$/gim, noun: "pin" },
  facebook: { heading: /^### Facebook Draft \d+\s*$/gim, noun: "Facebook draft" },
});

export function validateSocialStage(markdown, channel = "pinterest") {
  const errors = [];
  const contract = CHANNELS[channel];
  if (!contract) return { errors: [`Unsupported social channel: ${channel}`], links: 0, items: 0, channel };
  const links = [...markdown.matchAll(/^- \*\*Link:\*\*\s+(https?:\/\/\S+)\s*$/gim)].map(
    (match) => match[1],
  );
  const itemHeadings = [...markdown.matchAll(contract.heading)];

  if (!/no account creation/i.test(markdown) || !/no auto-posting/i.test(markdown)) {
    errors.push("The stage must state that account creation and auto-posting are prohibited.");
  }
  if (!/human (?:pastes|gate)/i.test(markdown)) {
    errors.push("The stage must preserve an explicit human publication gate.");
  }
  if (itemHeadings.length === 0) errors.push(`No staged ${contract.noun}s were found.`);
  if (links.length !== itemHeadings.length) {
    errors.push(`Expected one Link per ${contract.noun}; found ${links.length} links for ${itemHeadings.length} items.`);
  }
  if (channel === "facebook") {
    const groupFit = [...markdown.matchAll(/^- \*\*Group fit:\*\*/gim)].length;
    const copy = [...markdown.matchAll(/^- \*\*Copy:\*\*/gim)].length;
    if (groupFit !== itemHeadings.length || copy !== itemHeadings.length) {
      errors.push("Every Facebook draft requires one Group fit and one Copy field.");
    }
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
    for (const [key, expected] of Object.entries({ utm_source: channel, utm_medium: "social" })) {
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

  return { errors, links: links.length, items: itemHeadings.length, channel };
}

async function main() {
  const requested = process.argv[2];
  const stages = requested
    ? [{ file: requested, channel: process.argv[3] ?? "pinterest" }]
    : [
        { file: "reports/social/SOCIAL-STAGE-PATTERN.md", channel: "pinterest" },
        { file: "reports/social/FACEBOOK-GROUP-STAGE-PATTERN.md", channel: "facebook" },
      ];
  for (const stage of stages) {
    const result = validateSocialStage(await readFile(stage.file, "utf8"), stage.channel);
    if (result.errors.length) {
      console.error(`${stage.channel} stage validation failed (${result.errors.length} error(s)):`);
      for (const error of result.errors) console.error(`- ${error}`);
      process.exitCode = 1;
      continue;
    }
    console.log(`${stage.channel} stage validation passed: ${result.items} drafts, ${result.links} governed links.`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
