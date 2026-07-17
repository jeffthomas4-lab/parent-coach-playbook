#!/usr/bin/env node
import { loadReleaseEvidence, validateReleaseEvidence, REQUIRED_GATES } from './release-evidence.mjs';

const args = process.argv.slice(2);
const file = args.find((arg) => !arg.startsWith('--'));
const structureOnly = args.includes('--structure-only');
const phase = args.includes('--phase=predeploy') ? 'predeploy' : 'closeout';
if (!file) {
  console.error('usage: node scripts/check-release-evidence.mjs <packet.json> [--structure-only]');
  process.exit(2);
}

try {
  const packet = loadReleaseEvidence(file);
  const result = validateReleaseEvidence(packet, phase);
  if (result.errors.length) {
    console.error(`Release evidence contract failed:\n- ${result.errors.join('\n- ')}`);
    process.exit(1);
  }
  const phaseGates = phase === 'predeploy' ? REQUIRED_GATES.filter((gate) => gate !== 'post_deploy_observation') : REQUIRED_GATES;
  const pending = phaseGates.filter((gate) => !['pass', 'not_applicable'].includes(packet.gates[gate].state));
  if (!structureOnly && !result.ready) {
    console.error(`Release is not ready. Unpassed gates: ${pending.join(', ')}`);
    process.exit(1);
  }
  console.log(structureOnly ? `Release evidence structure passed; ${pending.length} gates remain unpassed.` : 'Release evidence passed: all mandatory gates are evidenced.');
} catch (error) {
  console.error(`Release evidence could not be read: ${error instanceof Error ? error.message : 'unknown error'}`);
  process.exit(1);
}
