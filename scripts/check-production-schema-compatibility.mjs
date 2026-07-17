#!/usr/bin/env node
import { loadProductionSchemaCompatibility, validateProductionSchemaCompatibility } from './production-schema-compatibility.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/check-production-schema-compatibility.mjs <receipt.json>');
  process.exit(2);
}
const result = validateProductionSchemaCompatibility(loadProductionSchemaCompatibility(file));
if (!result.valid) {
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Production schema incompatibility is recorded and fails closed.');
