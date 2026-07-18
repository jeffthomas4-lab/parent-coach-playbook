#!/usr/bin/env node

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const inventoryPath = join(root, 'reports/affiliate/inventory.json');
const governancePath = join(root, 'src/data/affiliate-governance.json');
const outputPath = join(root, 'reports/affiliate/lifecycle.json');
const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
const governance = JSON.parse(await readFile(governancePath, 'utf8'));
const hostToMerchant = new Map();

for (const merchant of governance.merchants) {
  for (const host of merchant.hosts) {
    const normalized = host.toLowerCase();
    if (hostToMerchant.has(normalized)) throw new Error(`Duplicate governed host: ${normalized}`);
    hostToMerchant.set(normalized, merchant);
  }
}

const errors = [...inventory.errors];
const offers = inventory.links.map((link) => {
  const merchant = hostToMerchant.get(link.destinationHost.toLowerCase());
  if (!merchant) errors.push(`${link.slug}: ${link.destinationHost} has no governed merchant`);
  return {
    offerSlug: link.slug,
    merchantId: merchant?.id ?? 'unknown',
    merchantName: merchant?.display_name ?? link.retailer,
    accountState: merchant?.account_state ?? 'unknown',
    destinationHost: link.destinationHost,
    campaign: link.campaign,
    placementCount: link.sources.length,
    lifecycleState: 'legacy_offer_unclassified',
    nextAction: link.sources.length > 0 ? 'research_and_map_product' : 'review_need_before_research',
  };
}).sort((a, b) => a.offerSlug.localeCompare(b.offerSlug));

const merchantRollup = governance.merchants.map((merchant) => {
  const merchantOffers = offers.filter((offer) => offer.merchantId === merchant.id);
  return {
    merchantId: merchant.id,
    merchantName: merchant.display_name,
    program: merchant.program,
    accountState: merchant.account_state,
    trackingMode: merchant.tracking_mode,
    offerCount: merchantOffers.length,
    placementCount: merchantOffers.reduce((sum, offer) => sum + offer.placementCount, 0),
    ownerActionRequired: !merchant.account_state.startsWith('active_evidenced'),
  };
});

const snapshot = {
  schemaVersion: 1,
  generatedFrom: ['reports/affiliate/inventory.json', 'src/data/affiliate-governance.json'],
  trustRule: governance.trust_rule,
  counts: {
    merchants: merchantRollup.length,
    offers: offers.length,
    referencedOffers: offers.filter((offer) => offer.placementCount > 0).length,
    unreferencedOffers: offers.filter((offer) => offer.placementCount === 0).length,
    legacyOffersAwaitingProductMapping: offers.length,
    governedProducts: 0,
    approvedRecommendations: 0,
    revenueStatements: 0,
    blockingErrors: errors.length,
  },
  queues: {
    ownerAccountVerification: merchantRollup.filter((merchant) => merchant.ownerActionRequired).map((merchant) => merchant.merchantId),
    researchAndProductMapping: offers.filter((offer) => offer.placementCount > 0).map((offer) => offer.offerSlug),
    needReviewBeforeResearch: offers.filter((offer) => offer.placementCount === 0).map((offer) => offer.offerSlug),
    editorialApproval: [],
    healthIncidents: [],
    revenueReconciliation: [],
  },
  merchantRollup,
  errors: errors.sort(),
  offers,
};

const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;
if (process.argv.includes('--check')) {
  let current = '';
  try { current = await readFile(outputPath, 'utf8'); } catch {}
  if (current !== serialized) {
    console.error(`${relative(root, outputPath)} is stale; run npm run report:affiliate-lifecycle`);
    process.exitCode = 1;
  }
} else {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, serialized);
  console.log(`Affiliate lifecycle snapshot written to ${relative(root, outputPath)}`);
}

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`${offers.length} legacy offers mapped to ${merchantRollup.length} governed merchants`);
}
