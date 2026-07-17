#!/usr/bin/env node
import { loadRecoveryTabletop, validateRecoveryTabletop } from './recovery-tabletop.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/check-recovery-tabletop.mjs <receipt.json>');
  process.exit(2);
}
try {
  const result = validateRecoveryTabletop(loadRecoveryTabletop(file));
  if (!result.valid) {
    console.error(`Recovery tabletop failed:\n- ${result.errors.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Recovery tabletop passed. Operational rollback and storage restore remain unproved.');
} catch (error) {
  console.error(`Recovery tabletop could not be read: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exit(1);
}
