#!/usr/bin/env node
import { loadEditorialLifecycleMigrationRehearsal, validateEditorialLifecycleMigrationRehearsal } from './editorial-lifecycle-migration-rehearsal.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/check-editorial-lifecycle-migration-rehearsal.mjs <receipt.json>');
  process.exit(2);
}
const result = validateEditorialLifecycleMigrationRehearsal(loadEditorialLifecycleMigrationRehearsal(file));
if (!result.valid) {
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Editorial lifecycle migration rehearsal receipt is valid and remains non-authorizing.');
