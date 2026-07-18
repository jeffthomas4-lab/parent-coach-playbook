import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const DEFAULT_PATH = 'strategy/company-operating-system.json';
const ALLOWED_CADENCES = new Set(['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'per_release']);
const ALLOWED_METRIC_STATES = new Set(['pending', 'not_activated', 'measured']);

export function validateCompanyOperatingSystem(value) {
  const errors = [];
  if (value?.schema_version !== 1) errors.push('schema_version must be 1.');
  if (value?.company !== 'Parent Coach Playbook') errors.push('company name is fixed.');
  if (!value?.owner?.trim()) errors.push('company owner is required.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value?.effective_date ?? '')) errors.push('effective_date must be ISO YYYY-MM-DD.');
  if (value?.founder_capacity_hours_per_week?.minimum !== 15 || value?.founder_capacity_hours_per_week?.maximum !== 20) {
    errors.push('founder capacity must preserve the 15–20 hour weekly boundary.');
  }

  const gates = Array.isArray(value?.milestone_gates) ? value.milestone_gates : [];
  if (gates.length !== 4) errors.push('exactly four milestone gates are required.');
  const gateIds = new Set();
  for (const gate of gates) {
    if (gateIds.has(gate.id)) errors.push(`duplicate milestone gate: ${gate.id}`);
    gateIds.add(gate.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(gate.review_date ?? '')) errors.push(`${gate.id}: invalid review_date.`);
    if (gate.decision !== 'pending') errors.push(`${gate.id}: decisions remain pending until a governed review.`);
  }

  const metrics = Array.isArray(value?.metric_definitions) ? value.metric_definitions : [];
  if (metrics.length < 20) errors.push('at least 20 cross-company metric definitions are required.');
  const metricIds = new Set();
  for (const metric of metrics) {
    if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(metric.id ?? '') || metricIds.has(metric.id)) {
      errors.push(`invalid or duplicate metric id: ${metric.id}`);
    }
    metricIds.add(metric.id);
    if (!metric.domain?.trim() || !metric.owner?.trim() || !metric.source?.trim()) {
      errors.push(`${metric.id}: domain, owner, and source are required.`);
    }
    if (!ALLOWED_CADENCES.has(metric.cadence)) errors.push(`${metric.id}: invalid cadence.`);
    if (!ALLOWED_METRIC_STATES.has(metric.current?.status)) errors.push(`${metric.id}: invalid current status.`);
    if (metric.current?.status !== 'measured' && Object.hasOwn(metric.current ?? {}, 'value')) {
      errors.push(`${metric.id}: unmeasured metrics cannot carry a value.`);
    }
  }

  const risks = Array.isArray(value?.standing_risks) ? value.standing_risks : [];
  if (risks.length < 10) errors.push('at least 10 standing cross-company risks are required.');
  for (const risk of risks) {
    if (!risk.id?.trim() || !risk.owner?.trim() || !ALLOWED_CADENCES.has(risk.cadence)) {
      errors.push(`invalid risk record: ${risk.id}`);
    }
    if (risk.status !== 'open') errors.push(`${risk.id}: initial standing risks must remain open.`);
  }

  if (value?.implementation_status?.customer_and_commerce_activation !== 'not_authorized') {
    errors.push('customer and commerce activation must remain not_authorized.');
  }
  return { valid: errors.length === 0, errors, metricCount: metrics.length, riskCount: risks.length };
}

async function main(path = DEFAULT_PATH) {
  const parsed = JSON.parse(await readFile(path, 'utf8'));
  const result = validateCompanyOperatingSystem(parsed);
  if (!result.valid) {
    console.error('Company operating system contract failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`Company operating system contract passed: ${result.metricCount} metrics, ${result.riskCount} standing risks.`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main(process.argv[2]);
