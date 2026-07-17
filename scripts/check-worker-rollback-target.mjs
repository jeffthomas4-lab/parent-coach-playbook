#!/usr/bin/env node
import { loadWorkerRollbackTarget, validateWorkerRollbackTarget } from './worker-rollback-target.mjs';

const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/check-worker-rollback-target.mjs <receipt.json>');
  process.exit(2);
}
try {
  const result = validateWorkerRollbackTarget(loadWorkerRollbackTarget(file));
  if (result.errors.length) {
    console.error(`Worker rollback target failed:\n- ${result.errors.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Worker rollback target receipt passed. This validates the target only; it does not rehearse or execute rollback.');
} catch (error) {
  console.error(`Worker rollback target could not be read: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exit(1);
}
