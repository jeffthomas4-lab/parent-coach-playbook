#!/usr/bin/env node
import { loadStagingPcdOpsRehearsal, validateStagingPcdOpsRehearsal } from './staging-pcd-ops-rehearsal.mjs';
const file = process.argv[2];
if (!file) process.exit(2);
const result = validateStagingPcdOpsRehearsal(loadStagingPcdOpsRehearsal(file));
if (!result.valid) {
  for (const error of result.errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Staging PCD operational D1 rehearsal evidence passed.');
