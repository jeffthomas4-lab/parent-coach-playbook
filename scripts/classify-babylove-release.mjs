#!/usr/bin/env node
import { appendFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const NORMALIZE_MESSAGE = 'chore: normalize BabyLove editorial evidence';
const EVIDENCE_PATH = 'reports/editorial/editorial-refresh-queue.json';
const ARTICLE_PATH = /^src\/content\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const PUBLISH_MESSAGE = /^Publish BabyLoveGrowth article ([A-Za-z0-9_-]{1,80}): ([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function denyDecision(reason) {
  return {
    eligible: false,
    reason,
    articleId: '',
    slug: '',
    route: '',
  };
}

export function lineageDenialReason(deployParentCount, publishParentCount = 1) {
  if (deployParentCount !== 1) return 'deploy_commit_not_single_parent';
  if (publishParentCount !== 1) return 'publish_commit_not_single_parent';
  return '';
}

function frontmatterValue(markdown, field) {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  return frontmatter.match(new RegExp(`^${field}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'))?.[1]?.trim() ?? '';
}

function nestedFrontmatterValue(markdown, blockName, field) {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  const block = frontmatter.match(new RegExp(`^${blockName}:\\r?\\n((?: {2}[^\\n]*\\r?\\n?)+)`, 'm'))?.[1] ?? '';
  return block.match(new RegExp(`^ {2}${field}:\\s*["']?([^"'\\n]+)["']?\\s*$`, 'm'))?.[1]?.trim() ?? '';
}

export function classifyBabyLoveRelease(input) {
  const deny = denyDecision;

  if (input.deployMessage.trim() !== NORMALIZE_MESSAGE) return deny('not_normalization_commit');
  const publish = input.parentMessage.trim().match(PUBLISH_MESSAGE);
  if (!publish) return deny('parent_not_babylove_publish');
  const [, articleId, slug] = publish;

  if (!Array.isArray(input.changes) || input.changes.length !== 2) return deny('unexpected_change_count');
  const articleChanges = input.changes.filter(({ path }) => ARTICLE_PATH.test(path));
  const evidenceChanges = input.changes.filter(({ path }) => path === EVIDENCE_PATH);
  if (articleChanges.length !== 1 || evidenceChanges.length !== 1) return deny('unexpected_changed_paths');
  if (!['A', 'M'].includes(articleChanges[0].status) || !['A', 'M'].includes(evidenceChanges[0].status)) {
    return deny('unsupported_change_status');
  }
  const changedSlug = articleChanges[0].path.match(ARTICLE_PATH)?.[1];
  if (changedSlug !== slug) return deny('slug_mismatch');

  const provider = nestedFrontmatterValue(input.articleMarkdown, 'externalSource', 'provider');
  const markdownArticleId = nestedFrontmatterValue(input.articleMarkdown, 'externalSource', 'articleId');
  const editorialStatus = nestedFrontmatterValue(input.articleMarkdown, 'editorial', 'status');
  const phase = frontmatterValue(input.articleMarkdown, 'phase');
  const draft = frontmatterValue(input.articleMarkdown, 'draft');
  if (provider !== 'babylovegrowth') return deny('provider_mismatch');
  if (markdownArticleId !== articleId) return deny('article_id_mismatch');
  if (editorialStatus !== 'published' || draft !== 'false') return deny('article_not_published');
  if (!['drive-there', 'game', 'drive-home', 'team-parent'].includes(phase)) return deny('invalid_phase');

  return {
    eligible: true,
    reason: 'eligible_content_only_babylove_release',
    articleId,
    slug,
    route: `/${phase}/${slug}/`,
  };
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function readArgs(argv) {
  const shaIndex = argv.indexOf('--sha');
  const outputIndex = argv.indexOf('--output');
  if (shaIndex < 0 || !argv[shaIndex + 1] || outputIndex < 0 || !argv[outputIndex + 1]) {
    throw new Error('usage: classify-babylove-release.mjs --sha <full-sha> --output <receipt.json>');
  }
  return { sha: argv[shaIndex + 1], output: argv[outputIndex + 1] };
}

function main() {
  const { sha, output } = readArgs(process.argv.slice(2));
  if (!/^[a-f0-9]{40}$/.test(sha)) throw new Error('full immutable SHA required');
  const deployParents = git('show', '-s', '--format=%P', sha).split(/\s+/).filter(Boolean);
  const deployLineageReason = lineageDenialReason(deployParents.length);
  if (deployLineageReason) {
    emitReceipt(output, {
      schemaVersion: 1,
      deploySha: sha,
      publishSha: '',
      baseSha: '',
      changedPaths: [],
      ...denyDecision(deployLineageReason),
    });
    return;
  }
  const parentSha = deployParents[0];
  const parentParents = git('show', '-s', '--format=%P', parentSha).split(/\s+/).filter(Boolean);
  const publishLineageReason = lineageDenialReason(deployParents.length, parentParents.length);
  if (publishLineageReason) {
    emitReceipt(output, {
      schemaVersion: 1,
      deploySha: sha,
      publishSha: parentSha,
      baseSha: '',
      changedPaths: [],
      ...denyDecision(publishLineageReason),
    });
    return;
  }
  const baseSha = parentParents[0];
  const changes = git('diff', '--name-status', '--no-renames', baseSha, sha)
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const [status, path] = line.split('\t');
      return { status, path };
    });
  const articlePath = changes.find(({ path }) => ARTICLE_PATH.test(path))?.path;
  const articleMarkdown = articlePath ? git('show', `${sha}:${articlePath}`) : '';
  const decision = classifyBabyLoveRelease({
    deployMessage: git('show', '-s', '--format=%B', sha),
    parentMessage: git('show', '-s', '--format=%B', parentSha),
    changes,
    articleMarkdown,
  });
  const receipt = {
    schemaVersion: 1,
    deploySha: sha,
    publishSha: parentSha,
    baseSha,
    changedPaths: changes,
    ...decision,
  };
  emitReceipt(output, receipt);
}

function emitReceipt(output, receipt) {
  writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, [
      `eligible=${receipt.eligible}`,
      `article_id=${receipt.articleId}`,
      `article_slug=${receipt.slug}`,
      `article_route=${receipt.route}`,
      `reason=${receipt.reason}`,
      '',
    ].join('\n'), 'utf8');
  }
  console.log(JSON.stringify(receipt));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
