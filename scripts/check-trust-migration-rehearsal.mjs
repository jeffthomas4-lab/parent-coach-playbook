#!/usr/bin/env node
import { loadTrustMigrationRehearsal, validateTrustMigrationRehearsal } from './trust-migration-rehearsal.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/check-trust-migration-rehearsal.mjs <receipt.json>');
  process.exit(2);
}
const result = validateTrustMigrationRehearsal(loadTrustMigrationRehearsal(file));
if (!result.valid) {
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Trust migration rehearsal receipt is valid and remains non-authorizing.');
